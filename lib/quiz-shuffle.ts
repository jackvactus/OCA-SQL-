import type { QuizQuestion } from "./types";

/** Mélange de Fisher-Yates sur une copie du tableau. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Permute les options d'une question et réindexe les bonnes réponses en
 * conséquence.
 *
 * Sans cette permutation, la position de la bonne réponse est figée dans les
 * données : un apprenant peut réussir en mémorisant un rang plutôt qu'un
 * concept. C'est le correctif du constat PED-01/PED-03 de `docs/AUDIT-SYSTEME.md`.
 */
export function shuffleOptions(question: QuizQuestion): QuizQuestion {
  const order = shuffle(question.options.map((_, index) => index));
  return {
    ...question,
    options: order.map((index) => question.options[index]),
    correctIndexes: question.correctIndexes
      .map((correct) => order.indexOf(correct))
      .sort((a, b) => a - b),
  };
}

/** Tire `count` questions au hasard, options permutées. `count` omis ⇒ toutes. */
export function drawQuestions(bank: QuizQuestion[], count?: number): QuizQuestion[] {
  const drawn = shuffle(bank);
  return (count === undefined ? drawn : drawn.slice(0, count)).map(shuffleOptions);
}
