import type { QuizQuestion, QuizQuestionTranslation } from "./types";
import type { Locale } from "./i18n/locale";

/**
 * Applique la traduction anglaise d'une question, quand elle existe.
 *
 * Les banques OCP sont rédigées en français ; leur version anglaise vit dans
 * des tables séparées (`lib/quiz-en-ocp1.ts`, `lib/quiz-en-ocp2.ts`) indexées
 * par identifiant. Cela évite de dupliquer les métadonnées — module, parcours,
 * difficulté, index des bonnes réponses — qui restent identiques.
 *
 * L'ordre des options est strictement conservé : `correctIndexes` reste donc
 * valide sans retraitement.
 */
export function localizeQuestion(
  question: QuizQuestion,
  locale: Locale,
  table: Record<string, QuizQuestionTranslation>,
): QuizQuestion {
  if (locale !== "en") return question;
  const t = table[question.id];
  if (!t) return question;
  if (t.options.length !== question.options.length) return question;
  return {
    ...question,
    question: t.question,
    options: t.options,
    explanation: t.explanation,
    topic: t.topic ?? question.topic,
  };
}

export function localizeBank(
  bank: QuizQuestion[],
  locale: Locale,
  table: Record<string, QuizQuestionTranslation>,
): QuizQuestion[] {
  if (locale !== "en") return bank;
  return bank.map((question) => localizeQuestion(question, locale, table));
}

/** Part de la banque effectivement traduite, pour le suivi. */
export function translationCoverage(
  bank: QuizQuestion[],
  table: Record<string, QuizQuestionTranslation>,
): { translated: number; total: number; percent: number } {
  const translated = bank.filter((q) => table[q.id]).length;
  return {
    translated,
    total: bank.length,
    percent: bank.length === 0 ? 0 : Math.round((translated / bank.length) * 100),
  };
}
