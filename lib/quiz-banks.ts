import type { QuizQuestion } from "./types";
import { certificationTracks, type TrackId } from "./certification-tracks";
import type { Locale } from "./i18n/locale";
import { quizQuestions } from "./quiz-data";
import { workbookQuizQuestions } from "./quiz-data-en-workbook";
import { ocp1Questions } from "./quiz-data-ocp1";
import { ocp1QuestionsB } from "./quiz-data-ocp1-b";
import { ocp2Questions } from "./quiz-data-ocp2";
import { ocp2QuestionsB } from "./quiz-data-ocp2-b";
import { tuningQuestions } from "./quiz-data-tuning";
import { dataGuardQuestions } from "./quiz-data-dataguard";
import { racQuestions } from "./quiz-data-rac";
import { modules } from "./modules-data";
import { curricula } from "./curricula";
import { ocp1English } from "./quiz-en-ocp1";
import { ocp2English } from "./quiz-en-ocp2";
import { tuningEnglish } from "./quiz-en-tuning";
import { dataGuardEnglish } from "./quiz-en-dataguard";
import { racEnglish } from "./quiz-en-rac";
import { localizeBank, translationCoverage } from "./quiz-i18n";

const ocp1All = [...ocp1Questions, ...ocp1QuestionsB];
const ocp2All = [...ocp2Questions, ...ocp2QuestionsB];

/**
 * Registre des banques de questions, par parcours de certification.
 *
 * Le parcours OCA SQL dispose de deux banques distinctes, une par langue.
 * Les cinq parcours d'administration ont une banque française assortie d'une
 * table de traduction anglaise appliquée à l'exécution par `localizeBank`.
 */
export function getQuestionBank(track: TrackId, locale: Locale): QuizQuestion[] {
  switch (track) {
    case "ocp-dba-i":
      return localizeBank(ocp1All, locale, ocp1English);
    case "ocp-dba-ii":
      return localizeBank(ocp2All, locale, ocp2English);
    case "ocp-tuning":
      return localizeBank(tuningQuestions, locale, tuningEnglish);
    case "ocp-dataguard":
      return localizeBank(dataGuardQuestions, locale, dataGuardEnglish);
    case "ocp-rac":
      return localizeBank(racQuestions, locale, racEnglish);
    default:
      return locale === "en" ? workbookQuizQuestions : quizQuestions;
  }
}

/** Toutes les questions, tous parcours et toutes langues confondus. */
export const allQuestions: QuizQuestion[] = [
  ...quizQuestions,
  ...workbookQuizQuestions,
  ...ocp1All,
  ...ocp2All,
  ...tuningQuestions,
  ...dataGuardQuestions,
  ...racQuestions,
];

/** Identifiants valides, pour la validation côté serveur. */
export const allQuestionIds = new Set(allQuestions.map((question) => question.id));

const trackIds: TrackId[] = certificationTracks.map((track) => track.id);
const quizDifficulties = ["all", "easy", "medium", "hard"];

/** Portées valides (module OCA SQL ou session OCP) par parcours, pour la validation. */
const scopeIdsByTrack: Record<TrackId, Set<string>> = Object.fromEntries(
  trackIds.map((trackId) => [
    trackId,
    trackId === "oca-sql"
      ? new Set(modules.map((module) => module.id))
      : new Set(curricula.find((c) => c.id === trackId)?.sessions.map((s) => s.id) ?? []),
  ]),
) as Record<TrackId, Set<string>>;

/**
 * Session quiz IDs are composite, built client-side from a track/scope/difficulty
 * triple (e.g. "quiz-oca-sql-all-medium", "quiz-ocp-dba-i-ocp1-session-3-hard") —
 * not individual question IDs — so validate the structure per track rather than
 * checking membership in `allQuestionIds`, which would reject every quiz result.
 */
export function isValidQuizId(quizId: string): boolean {
  if (!quizId.startsWith("quiz-")) return false;
  const rest = quizId.slice("quiz-".length);
  for (const trackId of trackIds) {
    if (!rest.startsWith(`${trackId}-`)) continue;
    const remainder = rest.slice(trackId.length + 1);
    const sep = remainder.lastIndexOf("-");
    if (sep === -1) continue;
    const scopeId = remainder.slice(0, sep);
    const difficulty = remainder.slice(sep + 1);
    if (!quizDifficulties.includes(difficulty)) continue;
    if (scopeId === "all" || scopeIdsByTrack[trackId]?.has(scopeId)) return true;
  }
  return false;
}

/** Nombre de questions disponibles pour un parcours, dans une langue donnée. */
export function bankSize(track: TrackId, locale: Locale): number {
  return getQuestionBank(track, locale).length;
}

export const tracksWithBank: TrackId[] = [
  "oca-sql",
  "ocp-dba-i",
  "ocp-dba-ii",
  "ocp-tuning",
  "ocp-dataguard",
  "ocp-rac",
];

/** Taux de traduction anglaise des banques OCP, pour le suivi qualité. */
export const ocpTranslationStatus = {
  "ocp-dba-i": translationCoverage(ocp1All, ocp1English),
  "ocp-dba-ii": translationCoverage(ocp2All, ocp2English),
  "ocp-tuning": translationCoverage(tuningQuestions, tuningEnglish),
  "ocp-dataguard": translationCoverage(dataGuardQuestions, dataGuardEnglish),
  "ocp-rac": translationCoverage(racQuestions, racEnglish),
};
