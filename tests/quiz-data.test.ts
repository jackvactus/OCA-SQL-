import { test } from "node:test";
import assert from "node:assert/strict";

import { allQuestions, getQuestionBank, ocpTranslationStatus } from "../lib/quiz-banks";
import { certificationTracks } from "../lib/certification-tracks";
import { curricula } from "../lib/curricula";
import { modules } from "../lib/modules-data";
import type { Locale } from "../lib/i18n/locale";

const LOCALES: Locale[] = ["fr", "en"];

/**
 * Invariants des banques de questions.
 *
 * Ces contrôles étaient jusqu'ici exécutés à la main à chaque lot de contenu.
 * Les figer en tests évite qu'une régression passe inaperçue : un identifiant
 * dupliqué ou une clé de réponse hors bornes casse silencieusement l'examen.
 */

test("aucun identifiant de question n'est dupliqué", () => {
  const ids = allQuestions.map((q) => q.id);
  const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  assert.deepEqual(dups, [], `identifiants dupliqués : ${dups.join(", ")}`);
});

test("chaque question a au moins trois options", () => {
  const trop_peu = allQuestions.filter((q) => q.options.length < 3).map((q) => q.id);
  assert.deepEqual(trop_peu, []);
});

test("aucune option n'est répétée à l'intérieur d'une question", () => {
  const fautives = allQuestions
    .filter((q) => new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length)
    .map((q) => q.id);
  assert.deepEqual(fautives, [], `options répétées : ${fautives.join(", ")}`);
});

test("les clés de réponse sont non vides, dans les bornes et sans doublon", () => {
  const fautives = allQuestions
    .filter(
      (q) =>
        q.correctIndexes.length === 0 ||
        q.correctIndexes.length >= q.options.length ||
        q.correctIndexes.some((i) => !Number.isInteger(i) || i < 0 || i >= q.options.length) ||
        new Set(q.correctIndexes).size !== q.correctIndexes.length,
    )
    .map((q) => q.id);
  assert.deepEqual(fautives, [], `clés invalides : ${fautives.join(", ")}`);
});

test("chaque question porte une explication non triviale", () => {
  const vides = allQuestions.filter((q) => q.explanation.trim().length < 20).map((q) => q.id);
  assert.deepEqual(vides, []);
});

test("aucun énoncé n'apparaît deux fois dans une même banque", () => {
  for (const track of certificationTracks) {
    for (const locale of LOCALES) {
      const vus = new Map<string, string>();
      const dups: string[] = [];
      for (const q of getQuestionBank(track.id, locale)) {
        const cle = q.question.trim().toLowerCase();
        const deja = vus.get(cle);
        if (deja) dups.push(`${deja}=${q.id}`);
        else vus.set(cle, q.id);
      }
      assert.deepEqual(dups, [], `${track.examCode}-${locale} : ${dups.join(", ")}`);
    }
  }
});

test("chaque question pointe vers un module ou une session qui existe", () => {
  const moduleIds = new Set(modules.map((m) => m.id));
  const sessionIds = new Set(curricula.flatMap((c) => c.sessions.map((s) => s.id)));
  const orphelines = allQuestions
    .filter((q) => !moduleIds.has(q.moduleId) && !sessionIds.has(q.moduleId))
    .map((q) => `${q.id}->${q.moduleId}`);
  assert.deepEqual(orphelines, []);
});

test("la traduction anglaise conserve le nombre d'options et la clé", () => {
  for (const track of certificationTracks) {
    const fr = new Map(getQuestionBank(track.id, "fr").map((q) => [q.id, q]));
    for (const en of getQuestionBank(track.id, "en")) {
      const source = fr.get(en.id);
      if (!source) continue; // banque anglaise indépendante (OCA SQL)
      assert.equal(
        en.options.length,
        source.options.length,
        `${en.id} : ${en.options.length} options en anglais contre ${source.options.length} en français`,
      );
      assert.deepEqual(
        en.correctIndexes,
        source.correctIndexes,
        `${en.id} : la traduction a déplacé la bonne réponse`,
      );
    }
  }
});

test("les banques d'administration sont traduites à 100 %", () => {
  for (const [track, statut] of Object.entries(ocpTranslationStatus)) {
    assert.equal(statut.percent, 100, `${track} : ${statut.percent} %`);
  }
});

test("chaque parcours dispose d'une banque non vide dans les deux langues", () => {
  for (const track of certificationTracks) {
    for (const locale of LOCALES) {
      assert.ok(
        getQuestionBank(track.id, locale).length > 0,
        `${track.examCode}-${locale} est vide`,
      );
    }
  }
});
