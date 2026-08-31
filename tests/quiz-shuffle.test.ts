import { test } from "node:test";
import assert from "node:assert/strict";

import { shuffleOptions, drawQuestions } from "../lib/quiz-shuffle";
import { getQuestionBank } from "../lib/quiz-banks";
import { certificationTracks } from "../lib/certification-tracks";

/**
 * La permutation des options est la seule chose qui empêche de réussir un
 * examen en mémorisant un rang. Les données sources gardent, pour plusieurs
 * banques, une majorité de bonnes réponses en première position : si la
 * permutation cessait de fonctionner, le biais reviendrait sans bruit.
 */

const exemple = {
  id: "test-1",
  moduleId: "m1",
  question: "Question de contrôle",
  options: ["A", "B", "C", "D"],
  correctIndexes: [0],
  explanation: "Explication de contrôle, suffisamment longue.",
  topic: "Test",
  difficulty: "medium" as const,
};

test("la permutation conserve l'ensemble des options", () => {
  for (let i = 0; i < 200; i++) {
    const permutee = shuffleOptions(exemple);
    assert.deepEqual([...permutee.options].sort(), [...exemple.options].sort());
  }
});

test("la permutation fait suivre la bonne réponse", () => {
  for (let i = 0; i < 500; i++) {
    const permutee = shuffleOptions(exemple);
    const attendues = exemple.correctIndexes.map((i) => exemple.options[i]).sort();
    const obtenues = permutee.correctIndexes.map((i) => permutee.options[i]).sort();
    assert.deepEqual(obtenues, attendues);
  }
});

test("la permutation fait suivre toutes les réponses d'une question multiple", () => {
  const multi = { ...exemple, correctIndexes: [1, 3] };
  for (let i = 0; i < 500; i++) {
    const permutee = shuffleOptions(multi);
    assert.equal(permutee.correctIndexes.length, 2);
    const attendues = multi.correctIndexes.map((i) => multi.options[i]).sort();
    const obtenues = permutee.correctIndexes.map((i) => permutee.options[i]).sort();
    assert.deepEqual(obtenues, attendues);
    // les index doivent rester triés, comme les composants le supposent
    assert.deepEqual(permutee.correctIndexes, [...permutee.correctIndexes].sort((a, b) => a - b));
  }
});

test("sur un grand nombre de tirages, aucune position ne domine", () => {
  // Un seul tirage ne prouve rien sur une petite banque : la variance
  // d'echantillonnage suffit a produire 50 % sur une trentaine de questions.
  // On agrege donc vingt tirages par parcours avant de conclure.
  for (const track of certificationTracks) {
    const banque = getQuestionBank(track.id, "fr").filter((q) => q.correctIndexes.length === 1);
    if (banque.length === 0) continue;
    const compte = [0, 0, 0, 0, 0, 0];
    let total = 0;
    for (let tour = 0; tour < 20; tour++) {
      for (const q of drawQuestions(banque)) {
        compte[q.correctIndexes[0]]++;
        total++;
      }
    }
    // Les questions n'ont pas toutes le meme nombre d'options : la position 0
    // est donc structurellement un peu plus frequente. Le seuil laisse cette
    // marge tout en detectant un biais reel (la banque brute depasse 85 %).
    const maxPart = Math.max(...compte) / total;
    assert.ok(
      maxPart < 0.45,
      `${track.examCode} : ${Math.round(maxPart * 100)} % des bonnes réponses à la même position sur ${total} tirages`,
    );
  }
});

test("la permutation corrige effectivement le biais des données sources", () => {
  for (const track of certificationTracks) {
    const banque = getQuestionBank(track.id, "fr").filter((q) => q.correctIndexes.length === 1);
    if (banque.length < 30) continue;
    const brut = banque.filter((q) => q.correctIndexes[0] === 0).length / banque.length;
    let enPremier = 0;
    let total = 0;
    for (let tour = 0; tour < 20; tour++) {
      for (const q of drawQuestions(banque)) {
        if (q.correctIndexes[0] === 0) enPremier++;
        total++;
      }
    }
    const apres = enPremier / total;
    if (brut > 0.5) {
      assert.ok(
        apres < brut - 0.2,
        `${track.examCode} : biais brut ${Math.round(brut * 100)} %, encore ${Math.round(apres * 100)} % après permutation`,
      );
    }
  }
});

test("le tirage respecte le nombre demandé et ne répète aucune question", () => {
  const banque = getQuestionBank("ocp-dba-ii", "fr");
  const tirage = drawQuestions(banque, 20);
  assert.equal(tirage.length, 20);
  assert.equal(new Set(tirage.map((q) => q.id)).size, 20);
});

test("un tirage sans nombre rend toute la banque", () => {
  const banque = getQuestionBank("ocp-tuning", "fr");
  assert.equal(drawQuestions(banque).length, banque.length);
});
