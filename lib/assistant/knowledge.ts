import { curricula, type Curriculum } from "../curricula";
import { tr, type Bilingual, type CourseBlock } from "../course-oca-sql";
import { getQuestionBank, tracksWithBank } from "../quiz-banks";
import { allExamObjectives } from "../exam-objectives";
import { getLocalizedFunctions, getLocalizedGlossary } from "../content-i18n";
import { certificationTracks, type TrackId } from "../certification-tracks";
import { sampleQueries, pickSample } from "../sql-sandbox/samples";
import type { Locale } from "../i18n/locale";
import type { AssistantSource } from "./types";

/**
 * Corpus interrogeable, construit à partir du contenu de la plateforme.
 *
 * L'assistant répond en **citant le cours**, pas en générant du texte. Sur une
 * plateforme de certification, c'est la seule forme de réponse défendable :
 * chaque phrase renvoyée est déjà validée, et le lien de la source permet de
 * l'ouvrir pour lire le passage entier.
 *
 * Le corpus est construit une fois par langue, à la première question, puis
 * gardé en mémoire du processus.
 */

export interface Passage {
  id: string;
  /** Intitulé lisible, affiché comme source. */
  title: string;
  /** Texte cherché et cité. */
  body: string;
  href: string;
  kind: AssistantSource["kind"];
  track: TrackId;
  /** Requêtes SQL présentes dans le passage, dans l'ordre du cours. */
  sql: string[];
  /** Légende du premier extrait, quand le cours en fournit une. */
  sqlCaption?: string;
}

/* ------------------------------------------------------------------ */
/*  Extraction du texte des blocs de cours                             */
/* ------------------------------------------------------------------ */

function texteDuBloc(bloc: CourseBlock, locale: Locale): string {
  switch (bloc.kind) {
    case "text":
      return tr(bloc.body, locale);
    case "tip":
    case "warning":
      return [bloc.title ? tr(bloc.title, locale) : "", tr(bloc.body, locale)]
        .filter(Boolean)
        .join(" — ");
    case "list":
      return [
        bloc.title ? tr(bloc.title, locale) : "",
        ...bloc.items.map((item) => tr(item, locale)),
      ]
        .filter(Boolean)
        .join(" ");
    case "table":
      return [
        bloc.title ? tr(bloc.title, locale) : "",
        ...bloc.headers.map((h) => tr(h, locale)),
        ...bloc.rows.flat().map((c) => tr(c, locale)),
      ]
        .filter(Boolean)
        .join(" ");
    case "code":
      return [bloc.title ? tr(bloc.title, locale) : "", bloc.caption ? tr(bloc.caption, locale) : ""]
        .filter(Boolean)
        .join(" — ");
    case "compare":
      // Le couple faux/juste est le cœur pédagogique du bloc : on garde les
      // deux, la note explique la différence.
      return [
        bloc.title ? tr(bloc.title, locale) : "",
        tr(bloc.note, locale),
        bloc.wrong,
        bloc.right,
      ]
        .filter(Boolean)
        .join(" — ");
    case "figure":
      return [tr(bloc.alt, locale), bloc.caption ? tr(bloc.caption, locale) : ""]
        .filter(Boolean)
        .join(" — ");
    default:
      return "";
  }
}

/**
 * Un bloc de code du cours contient souvent plusieurs instructions séparées
 * par `;`. Les garder groupées les rendait toutes injouables — le moteur
 * s'arrêtait sur « jetons inattendus après la fin de la requête » — alors que
 * chacune prise isolément s'exécute.
 */
function sqlDuBloc(bloc: CourseBlock): string[] {
  const brut = bloc.kind === "code" ? bloc.code : bloc.kind === "compare" ? bloc.right : "";
  if (!brut) return [];
  return brut
    .split(/;\s*(?:\r?\n|$)/)
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction.length > 0);
}

/* ------------------------------------------------------------------ */
/*  Construction du corpus                                             */
/* ------------------------------------------------------------------ */

function passagesDuCursus(curriculum: Curriculum, locale: Locale): Passage[] {
  const sortie: Passage[] = [];
  for (const session of curriculum.sessions) {
    const titreSession = tr(session.title, locale);
    const href = `/curriculum/${session.id}`;

    for (const topic of session.topics) {
      const corps = topic.blocks.map((b) => texteDuBloc(b, locale)).filter(Boolean).join("\n\n");
      const sql = topic.blocks.flatMap(sqlDuBloc).filter((q) => q.trim().length > 0);
      const legende = topic.blocks.find((b) => b.kind === "code" && b.caption);

      sortie.push({
        id: `${session.id}:${topic.id}`,
        title: `${titreSession} · ${topic.number} ${tr(topic.title, locale)}`,
        body: corps,
        href,
        kind: "session",
        track: curriculum.id,
        sql,
        sqlCaption:
          legende && legende.kind === "code" && legende.caption
            ? tr(legende.caption, locale)
            : undefined,
      });
    }

    // Les points à retenir sont courts et souvent la meilleure réponse directe.
    if (session.keyTakeaways?.length) {
      sortie.push({
        id: `${session.id}:retenir`,
        title: `${titreSession} · ${locale === "en" ? "Key takeaways" : "À retenir"}`,
        body: session.keyTakeaways.map((k) => tr(k, locale)).join("\n"),
        href,
        kind: "session",
        track: curriculum.id,
        sql: [],
      });
    }

    for (const controle of session.selfCheck ?? []) {
      sortie.push({
        id: `${session.id}:controle:${sortie.length}`,
        title: `${titreSession} · ${tr(controle.question, locale)}`,
        body: `${tr(controle.question, locale)}\n${tr(controle.answer, locale)}`,
        href,
        kind: "session",
        track: curriculum.id,
        sql: [],
      });
    }
  }
  return sortie;
}

function passagesDesQuestions(locale: Locale): Passage[] {
  // `getQuestionBank` et non `allQuestions` : la seconde empile les six
  // parcours dans les deux langues, si bien qu'une question posée en anglais
  // recevait une explication française.
  return tracksWithBank.flatMap((track) =>
    getQuestionBank(track, locale)
      .filter((q) => q.explanation && q.explanation.trim().length > 0)
      .map((q) => ({
        id: `question:${locale}:${q.id}`,
        title: q.topic || q.question.slice(0, 70),
        body: `${q.question}\n${q.explanation}`,
        // Renvoyer vers le module ou la session qui traite la notion : la page
        // du quiz ne sait pas ouvrir une question précise.
        href: /^m\d+$/.test(q.moduleId) ? `/courses/${q.moduleId}` : `/curriculum/${q.moduleId}`,
        kind: "question" as const,
        track,
        sql: [],
      })),
  );
}

function passagesDesObjectifs(locale: Locale): Passage[] {
  const sortie: Passage[] = [];
  for (const [domaine, def] of Object.entries(allExamObjectives)) {
    const titre = locale === "en" ? domaine : def.titleFr || domaine;
    const parcours = certificationTracks.find((t) => domaine.startsWith(t.examCode));
    sortie.push({
      id: `objectif:${domaine}`,
      title: `${locale === "en" ? "Exam objectives" : "Objectifs d'examen"} · ${titre}`,
      body: def.objectives.map((o) => (locale === "en" ? o.en : o.fr)).join("\n"),
      href: parcours ? `/tracks/${parcours.id}` : "/tracks",
      kind: "reference",
      track: (parcours?.id ?? "oca-sql") as TrackId,
      sql: [],
    });
  }
  return sortie;
}

function passagesDeReference(locale: Locale): Passage[] {
  const sortie: Passage[] = [];

  for (const terme of getLocalizedGlossary(locale)) {
    sortie.push({
      id: `glossaire:${terme.term}`,
      title: `${locale === "en" ? "Glossary" : "Glossaire"} · ${terme.term}`,
      body: [terme.definition, terme.example].filter(Boolean).join("\n"),
      href: "/reference",
      kind: "reference",
      track: "oca-sql",
      sql: terme.example ? [terme.example] : [],
    });
  }

  for (const fonction of getLocalizedFunctions(locale)) {
    sortie.push({
      id: `fonction:${fonction.name}`,
      title: `${fonction.name} — ${fonction.category}`,
      body: [fonction.description, fonction.syntax, `${fonction.example} → ${fonction.result}`]
        .filter(Boolean)
        .join("\n"),
      href: "/reference",
      kind: "reference",
      track: "oca-sql",
      sql: fonction.example ? [fonction.example] : [],
    });
  }

  return sortie;
}

/**
 * Les exemples du bac à sable.
 *
 * Ils sont rédigés une notion par exemple, et surtout **garantis exécutables**
 * sur le schéma HR simulé — ce qui n'est pas le cas du SQL du cours, qui
 * illustre souvent un autre schéma ou des vues d'administration. Ce sont donc
 * eux qu'il faut proposer quand l'apprenant demande une démonstration.
 */
function passagesDuBacASable(locale: Locale): Passage[] {
  return sampleQueries.map((exemple, i) => ({
    id: `bac-a-sable:${i}`,
    title: `${locale === "en" ? "Sandbox" : "Bac à sable"} · ${pickSample(exemple.label, locale)}`,
    body: `${pickSample(exemple.label, locale)}
${pickSample(exemple.description, locale)}
${exemple.query}`,
    href: "/sandbox",
    kind: "reference",
    track: "oca-sql",
    sql: [exemple.query],
    sqlCaption: pickSample(exemple.description, locale),
  }));
}

const CACHE = new Map<Locale, Passage[]>();

/** Corpus complet dans une langue, construit une fois puis réutilisé. */
export function corpus(locale: Locale): Passage[] {
  const memo = CACHE.get(locale);
  if (memo) return memo;

  const passages = [
    ...curricula.flatMap((c) => passagesDuCursus(c, locale)),
    ...passagesDesQuestions(locale),
    ...passagesDesObjectifs(locale),
    ...passagesDeReference(locale),
    ...passagesDuBacASable(locale),
  ].filter((p) => p.body.trim().length > 20);

  CACHE.set(locale, passages);
  return passages;
}

/** Remise à zéro — réservée aux tests. */
export function resetCorpus() {
  CACHE.clear();
}

export type { Bilingual };
