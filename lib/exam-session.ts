import { query } from "./db";
import { getQuestionBank } from "./quiz-banks";
import { shuffle } from "./quiz-shuffle";
import type { TrackId } from "./certification-tracks";
import type { Locale } from "./i18n/locale";
import type { QuizQuestion } from "./types";

/**
 * Examens blancs arbitrés par le serveur.
 *
 * Jusqu'ici le navigateur recevait les corrigés en même temps que les
 * questions, calculait lui-même le score, et le transmettait : n'importe qui
 * pouvait déclarer un sans-faute d'un appel `fetch`. C'est le constat PED-04 de
 * `docs/AUDIT-SYSTEME.md`.
 *
 * Le serveur tire désormais les questions, mémorise la permutation des options,
 * n'envoie que ce qui est nécessaire pour composer, corrige lui-même à la
 * remise, et ne livre les corrigés qu'à ce moment-là.
 */

/** Une question telle qu'elle part vers le navigateur pendant l'épreuve. */
export interface ExamQuestionPublic {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  topic: string;
  difficulty: QuizQuestion["difficulty"];
  /**
   * Nombre de bonnes réponses attendues — l'énoncé l'annonce déjà
   * (« Choisissez deux réponses »), mais **pas** lesquelles.
   */
  answerCount: number;
}

/** Le corrigé d'une question, livré une fois la copie remise. */
export interface ExamCorrection {
  id: string;
  correctIndexes: number[];
  explanation: string;
}

export interface ExamStartResult {
  sessionId: string;
  questions: ExamQuestionPublic[];
  durationSeconds: number;
  expiresAt: string;
}

export interface ExamSubmitResult {
  score: number;
  total: number;
  timeSeconds: number;
  corrections: ExamCorrection[];
}

/** Format de l'examen complet, repris de la fiche 1Z0-071. */
const FULL_EXAM_QUESTIONS = 63;
const FULL_EXAM_MINUTES = 120;
/** Marge accordée au-delà du temps théorique, pour la latence et la remise. */
const GRACE_SECONDS = 120;

function dureeSecondes(count: number): number {
  const minutes = Math.ceil((count / FULL_EXAM_QUESTIONS) * FULL_EXAM_MINUTES);
  return minutes * 60;
}

/** Applique une permutation d'options à une question. */
export function permuter(question: QuizQuestion, ordre: number[]): QuizQuestion {
  return {
    ...question,
    options: ordre.map((i) => question.options[i]),
    correctIndexes: question.correctIndexes
      .map((c) => ordre.indexOf(c))
      .sort((a, b) => a - b),
  };
}

/**
 * Ouvre une session d'examen : tire les questions, mémorise l'ordre des
 * options, et renvoie de quoi composer — sans les corrigés.
 */
export async function startExamSession(
  userId: string,
  track: TrackId,
  locale: Locale,
  requestedCount: number,
): Promise<ExamStartResult> {
  const banque = getQuestionBank(track, locale);
  if (banque.length === 0) {
    throw new Error("Banque de questions vide pour ce parcours");
  }

  const count = Math.max(1, Math.min(requestedCount, banque.length));
  const tirage = shuffle(banque).slice(0, count);
  const ordres = tirage.map((q) => shuffle(q.options.map((_, i) => i)));

  const duree = dureeSecondes(count);
  const expiresAt = new Date(Date.now() + (duree + GRACE_SECONDS) * 1000);

  const { rows } = await query<{ id: string }>(
    `insert into exam_sessions
       (user_id, track, locale, question_ids, option_orders, expires_at, total)
     values ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7)
     returning id`,
    [
      userId,
      track,
      locale,
      JSON.stringify(tirage.map((q) => q.id)),
      JSON.stringify(ordres),
      expiresAt.toISOString(),
      count,
    ],
  );

  const questions: ExamQuestionPublic[] = tirage.map((q, i) => {
    const permutee = permuter(q, ordres[i]);
    return {
      id: permutee.id,
      moduleId: permutee.moduleId,
      question: permutee.question,
      options: permutee.options,
      topic: permutee.topic,
      difficulty: permutee.difficulty,
      answerCount: permutee.correctIndexes.length,
    };
  });

  return {
    sessionId: rows[0].id,
    questions,
    durationSeconds: duree,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Corrige une copie, sans aucun accès à la base.
 *
 * La logique de notation vit ici, isolée de la persistance, pour qu'elle soit
 * vérifiable par des tests : c'est la fonction dont dépend l'intégrité du
 * score, elle ne doit pas être la partie non testée du système.
 */
export function graderCopie(
  questionIds: string[],
  optionOrders: number[][],
  banque: Map<string, QuizQuestion>,
  answers: Record<number, number[]>,
): { score: number; corrections: ExamCorrection[] } {
  let score = 0;
  const corrections: ExamCorrection[] = [];

  questionIds.forEach((qid, position) => {
    const source = banque.get(qid);
    // Question retirée de la banque depuis le tirage : elle ne peut être ni
    // corrigée ni comptée juste. Le total reste celui du tirage initial, donc
    // l'apprenant n'est pas avantagé.
    if (!source) return;

    const permutee = permuter(source, optionOrders[position]);
    const attendu = [...permutee.correctIndexes].sort((a, b) => a - b);

    // Politique stricte : une réponse contenant un index invalide ou répété
    // est comptée fausse, elle n'est pas « réparée ». Un client conforme
    // n'en produit jamais ; tout le reste est forgé ou buggé, et corriger
    // silencieusement une entrée aberrante masquerait le problème.
    const brut = answers[position] ?? [];
    const valide =
      Array.isArray(brut) &&
      brut.every((i) => Number.isInteger(i) && i >= 0 && i < permutee.options.length) &&
      new Set(brut).size === brut.length;

    if (valide) {
      const fourni = [...brut].sort((a, b) => a - b);
      if (fourni.length === attendu.length && fourni.every((v, i) => v === attendu[i])) {
        score++;
      }
    }
    corrections.push({
      id: permutee.id,
      correctIndexes: attendu,
      explanation: permutee.explanation,
    });
  });

  return { score, corrections };
}

export type ExamSubmitError =
  | "introuvable"
  | "deja_remise"
  | "expiree"
  | "reponses_invalides";

/**
 * Corrige une copie côté serveur.
 *
 * Les réponses sont indexées par **position dans l'épreuve**, pas par
 * identifiant de question : c'est le même repère que celui envoyé au
 * navigateur, et cela évite qu'une réponse soit rattachée à une autre question.
 */
export async function submitExamSession(
  userId: string,
  sessionId: string,
  answers: Record<number, number[]>,
): Promise<ExamSubmitResult | { error: ExamSubmitError }> {
  const { rows } = await query<{
    track: TrackId;
    locale: Locale;
    question_ids: string[];
    option_orders: number[][];
    started_at: Date;
    expires_at: Date;
    submitted_at: Date | null;
    total: number;
  }>(
    `select track, locale, question_ids, option_orders, started_at, expires_at,
            submitted_at, total
       from exam_sessions
      where id = $1 and user_id = $2`,
    [sessionId, userId],
  );

  const session = rows[0];
  if (!session) return { error: "introuvable" };
  if (session.submitted_at) return { error: "deja_remise" };
  if (new Date(session.expires_at).getTime() < Date.now()) {
    // La copie est refusée, mais la session est close : elle ne peut pas être
    // rejouée indéfiniment pour deviner les corrigés.
    await query("update exam_sessions set submitted_at = now(), score = 0 where id = $1", [
      sessionId,
    ]);
    return { error: "expiree" };
  }

  const banque = new Map(getQuestionBank(session.track, session.locale).map((q) => [q.id, q]));
  const { score, corrections } = graderCopie(
    session.question_ids,
    session.option_orders,
    banque,
    answers,
  );

  const timeSeconds = Math.max(
    0,
    Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000),
  );

  await query(
    `update exam_sessions
        set submitted_at = now(), score = $2, time_seconds = $3
      where id = $1`,
    [sessionId, score, timeSeconds],
  );

  return { score, total: session.total, timeSeconds, corrections };
}
