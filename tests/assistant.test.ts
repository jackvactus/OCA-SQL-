import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { answerQuestion, isAssistantConfigured } from "../lib/assistant/answer";
import { lireSources, lireSql } from "../lib/assistant/audit";
import { assistantStrings } from "../lib/assistant/strings";
import type { AssistantContext } from "../lib/assistant/types";

/**
 * L'assistant est livré en deux moitiés : l'interface, complète, et la
 * production de la réponse, laissée en point d'extension. Ces tests gardent
 * les propriétés qui doivent tenir **quelle que soit** la logique branchée.
 */

const CONTEXTE: AssistantContext = {
  path: "/curriculum/dg-session-4",
  track: "oca-sql",
  locale: "fr",
};

/* ------------------------------------------------------------------ */
/*  Le défaut ne doit jamais faire semblant de savoir                  */
/* ------------------------------------------------------------------ */

test("sans logique branchée, la réponse est marquée indisponible", async () => {
  const reponse = await answerQuestion("Quelle est la différence entre WHERE et HAVING ?", CONTEXTE);
  assert.equal(reponse.unavailable, true);
  assert.ok(reponse.text.length > 0, "le message doit expliquer, pas rester vide");
});

test("le défaut n'invente ni source ni requête", async () => {
  // Une source ou un extrait SQL fabriqués donneraient l'illusion d'une
  // réponse étayée : sur une plateforme de certification, c'est pire que rien.
  const reponse = await answerQuestion("SELECT ?", CONTEXTE);
  assert.deepEqual(reponse.sources, []);
  assert.deepEqual(reponse.sql, []);
});

test("le défaut répond dans la langue du contexte", async () => {
  const fr = await answerQuestion("Question", { ...CONTEXTE, locale: "fr" });
  const en = await answerQuestion("Question", { ...CONTEXTE, locale: "en" });
  assert.notEqual(fr.text, en.text);
  assert.match(en.text, /answering logic/i);
  assert.match(fr.text, /logique de réponse/i);
});

test("l'indicateur de configuration suit l'implémentation réelle", async () => {
  // Il doit passer à `true` en même temps que `answerQuestion` : les deux
  // mentent ensemble ou disent vrai ensemble.
  const reponse = await answerQuestion("Question", CONTEXTE);
  assert.equal(isAssistantConfigured(), reponse.unavailable !== true);
});

/* ------------------------------------------------------------------ */
/*  Relecture de la transcription                                      */
/* ------------------------------------------------------------------ */

test("une colonne jsonb malformée ne fait pas tomber la transcription", () => {
  // Ces valeurs correspondent à ce qu'on trouve dans une base ayant vécu :
  // colonne nulle, tableau hétérogène, objet à la place d'un tableau.
  assert.deepEqual(lireSources(null), []);
  assert.deepEqual(lireSources("pas un tableau"), []);
  assert.deepEqual(lireSources({ href: "/x" }), []);
  assert.deepEqual(lireSql(undefined), []);
});

test("les entrées incomplètes sont écartées, les valides conservées", () => {
  const sources = lireSources([
    { label: "Session 4", href: "/curriculum/dg-session-4", kind: "session" },
    { label: "Sans lien" },
    null,
    42,
  ]);
  assert.equal(sources.length, 1);
  assert.equal(sources[0].href, "/curriculum/dg-session-4");

  const sql = lireSql([{ query: "SELECT 1 FROM dual", runnable: true }, { caption: "orpheline" }]);
  assert.equal(sql.length, 1);
  assert.equal(sql[0].query, "SELECT 1 FROM dual");
});

/* ------------------------------------------------------------------ */
/*  Textes                                                             */
/* ------------------------------------------------------------------ */

test("les deux langues exposent les mêmes clés", () => {
  const fr = assistantStrings("fr");
  const en = assistantStrings("en");
  assert.deepEqual(Object.keys(fr).sort(), Object.keys(en).sort());
});

test("aucun texte n'est vide ni laissé en français côté anglais", () => {
  const en = assistantStrings("en");
  for (const [cle, valeur] of Object.entries(en)) {
    if (typeof valeur === "string") {
      assert.ok(valeur.trim().length > 0, `texte vide : ${cle}`);
    }
  }
  // Repère grossier mais efficace : ces mots ne peuvent pas apparaître dans
  // une traduction anglaise correcte.
  const anglais = JSON.stringify(en);
  for (const mot of ["Fermer", "Envoyer", "Copier", "bac à sable", "échange"]) {
    assert.ok(!anglais.includes(mot), `« ${mot} » a été laissé en français`);
  }
});

test("le compteur d'échanges accorde le pluriel", () => {
  assert.equal(assistantStrings("fr").auditCount(1), "1 échange");
  assert.equal(assistantStrings("fr").auditCount(3), "3 échanges");
  assert.equal(assistantStrings("en").auditCount(1), "1 exchange");
  assert.equal(assistantStrings("en").auditCount(3), "3 exchanges");
});

/* ------------------------------------------------------------------ */
/*  Le point lumineux                                                  */
/* ------------------------------------------------------------------ */

const RACINE = join(__dirname, "..");

test("les animations du point lumineux cèdent devant prefers-reduced-motion", () => {
  // Un point qui pulse en permanence dans un coin de l'écran est précisément
  // ce que ce réglage demande de supprimer. La règle est facile à perdre lors
  // d'une refonte de la feuille de style : on la verrouille ici.
  const css = readFileSync(join(RACINE, "app", "globals.css"), "utf8");
  const bloc = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.ok(bloc.length > 0, "aucune règle prefers-reduced-motion");

  for (const classe of [".assistant-halo", ".assistant-ripple", ".assistant-core", ".assistant-spin"]) {
    assert.ok(css.includes(`${classe} `), `classe absente de la feuille : ${classe}`);
    assert.ok(bloc.includes(classe), `${classe} continue de s'animer en mouvement réduit`);
  }
});

test("le point lumineux reste un bouton accessible", () => {
  const orb = readFileSync(join(RACINE, "components", "assistant", "orb.tsx"), "utf8");
  // Un `<div onClick>` ne se tabule pas et ne s'annonce pas : le composant
  // doit rester un vrai bouton, nommé, et déclarer le panneau qu'il commande.
  assert.ok(orb.includes('type="button"'), "le point doit être un <button>");
  assert.ok(orb.includes("aria-label"), "le point doit être nommé");
  assert.ok(orb.includes("aria-expanded"), "le point doit annoncer l'état du panneau");
  assert.ok(orb.includes("aria-controls"), "le point doit désigner le panneau");
  assert.ok(orb.includes("focus-visible:ring"), "le focus clavier doit rester visible");
  // Les couches décoratives ne doivent pas être lues par un lecteur d'écran.
  assert.equal((orb.match(/aria-hidden/g) ?? []).length, 2);
});
