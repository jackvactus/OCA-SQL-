import { test } from "node:test";
import assert from "node:assert/strict";

import { graderCopie, permuter } from "../lib/exam-session";
import type { QuizQuestion } from "../lib/types";

/**
 * L'intégrité d'un examen tient à cette correction : si elle se trompe, le
 * score annoncé ne vaut rien. Ces tests couvrent en particulier les copies
 * forgées, puisque c'est précisément contre elles que la correction a été
 * déplacée côté serveur (constat PED-04).
 */

const mono: QuizQuestion = {
  id: "m1",
  moduleId: "mod",
  question: "Question à réponse unique",
  options: ["zéro", "un", "deux", "trois"],
  correctIndexes: [2],
  explanation: "La bonne réponse est « deux », explication de contrôle.",
  topic: "Test",
  difficulty: "medium",
};

const multi: QuizQuestion = {
  id: "m2",
  moduleId: "mod",
  question: "Question à deux réponses",
  options: ["a", "b", "c", "d"],
  correctIndexes: [0, 3],
  explanation: "Les bonnes réponses sont « a » et « d », explication de contrôle.",
  topic: "Test",
  difficulty: "hard",
};

const banque = new Map<string, QuizQuestion>([
  [mono.id, mono],
  [multi.id, multi],
]);

/** Ordre identité : les options ne bougent pas. */
const identite = [0, 1, 2, 3];

test("une copie parfaite obtient tous les points", () => {
  const { score, corrections } = graderCopie(
    ["m1", "m2"],
    [identite, identite],
    banque,
    { 0: [2], 1: [0, 3] },
  );
  assert.equal(score, 2);
  assert.equal(corrections.length, 2);
});

test("une copie vide n'obtient aucun point", () => {
  const { score } = graderCopie(["m1", "m2"], [identite, identite], banque, {});
  assert.equal(score, 0);
});

test("la correction suit la permutation des options", () => {
  // Les options sont inversées : la bonne réponse de « mono » passe de 2 à 1.
  const ordre = [3, 2, 1, 0];
  const permutee = permuter(mono, ordre);
  assert.deepEqual(permutee.correctIndexes, [1]);
  assert.equal(permutee.options[1], "deux");

  const juste = graderCopie(["m1"], [ordre], banque, { 0: [1] });
  assert.equal(juste.score, 1, "la réponse à la position permutée doit compter");

  const faux = graderCopie(["m1"], [ordre], banque, { 0: [2] });
  assert.equal(faux.score, 0, "l'ancienne position ne doit plus compter");
});

test("une réponse partielle à une question multiple ne compte pas", () => {
  const { score } = graderCopie(["m2"], [identite], banque, { 0: [0] });
  assert.equal(score, 0);
});

test("cocher toutes les options ne donne pas le point", () => {
  // La triche la plus évidente : tout cocher pour être sûr d'inclure les bonnes.
  const { score } = graderCopie(["m2"], [identite], banque, { 0: [0, 1, 2, 3] });
  assert.equal(score, 0);
});

test("une réponse dupliquée ne fabrique pas un score", () => {
  // [0, 0] a bien deux éléments, comme la clé [0, 3] : sans dédoublonnage,
  // une copie forgée pourrait passer.
  const { score } = graderCopie(["m2"], [identite], banque, { 0: [0, 0] });
  assert.equal(score, 0);
});

test("les index hors bornes sont écartés", () => {
  const { score } = graderCopie(["m1"], [identite], banque, { 0: [2, 99, -1] });
  assert.equal(score, 0, "un index valide accompagné d'index absurdes ne doit pas passer");
});

test("les valeurs non entières sont écartées", () => {
  const forge = { 0: [2.5, 2] } as unknown as Record<number, number[]>;
  const { score } = graderCopie(["m1"], [identite], banque, forge);
  assert.equal(score, 0);
});

test("une question retirée de la banque n'est ni corrigée ni comptée juste", () => {
  const { score, corrections } = graderCopie(
    ["m1", "disparue"],
    [identite, identite],
    banque,
    { 0: [2], 1: [0] },
  );
  assert.equal(score, 1);
  assert.equal(corrections.length, 1);
  assert.equal(corrections[0].id, "m1");
});

test("les réponses sont rattachées à leur position, pas à leur identifiant", () => {
  // La bonne réponse de « mono » (2) placée en position 1, où l'on attend
  // celle de « multi », ne doit pas marquer de point.
  const { score } = graderCopie(["m1", "m2"], [identite, identite], banque, { 1: [2] });
  assert.equal(score, 0);
});

test("le corrigé renvoyé porte la position permutée et l'explication", () => {
  const ordre = [3, 2, 1, 0];
  const { corrections } = graderCopie(["m1"], [ordre], banque, { 0: [] });
  assert.deepEqual(corrections[0].correctIndexes, [1]);
  assert.ok(corrections[0].explanation.length > 20);
});
