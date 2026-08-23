import type { QuizQuestion } from "./types";
import type { TrackId } from "./certification-tracks";
import type { Locale } from "./i18n/locale";
import { quizQuestions } from "./quiz-data";
import { workbookQuizQuestions } from "./quiz-data-en-workbook";
import { ocp1Questions } from "./quiz-data-ocp1";
import { ocp2Questions } from "./quiz-data-ocp2";

/**
 * Registre des banques de questions, par parcours de certification.
 *
 * Le parcours OCA SQL dispose de deux banques, une par langue. Les parcours
 * OCP n'en ont qu'une, en français : les énoncés d'administration n'ont pas
 * encore été traduits (voir `docs/CORRECTIFS-APPLIQUES.md`).
 */
export function getQuestionBank(track: TrackId, locale: Locale): QuizQuestion[] {
  switch (track) {
    case "ocp-dba-i":
      return ocp1Questions;
    case "ocp-dba-ii":
      return ocp2Questions;
    default:
      return locale === "en" ? workbookQuizQuestions : quizQuestions;
  }
}

/** Toutes les questions, tous parcours et toutes langues confondus. */
export const allQuestions: QuizQuestion[] = [
  ...quizQuestions,
  ...workbookQuizQuestions,
  ...ocp1Questions,
  ...ocp2Questions,
];

/** Identifiants valides, pour la validation côté serveur. */
export const allQuestionIds = new Set(allQuestions.map((question) => question.id));

/** Nombre de questions disponibles pour un parcours, dans une langue donnée. */
export function bankSize(track: TrackId, locale: Locale): number {
  return getQuestionBank(track, locale).length;
}

export const tracksWithBank: TrackId[] = ["oca-sql", "ocp-dba-i", "ocp-dba-ii"];
