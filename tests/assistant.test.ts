import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { answerQuestion, isAssistantConfigured } from "../lib/assistant/answer";
import { lireSources, lireSql } from "../lib/assistant/audit";
import { assistantStrings } from "../lib/assistant/strings";
import { chercher, termes } from "../lib/assistant/search";
import { corpus } from "../lib/assistant/knowledge";
import { runQuery } from "../lib/sql-sandbox";
import type { AssistantContext } from "../lib/assistant/types";

/**
 * L'assistant répond en citant le contenu de la plateforme. Ces tests gardent
 * les deux propriétés qui font sa valeur : il trouve le bon passage, et il
 * n'affirme rien qu'il ne puisse étayer.
 */

const FR: AssistantContext = { path: "/", track: "oca-sql", locale: "fr" };
const EN: AssistantContext = { path: "/", track: "oca-sql", locale: "en" };

/* ------------------------------------------------------------------ */
/*  Le corpus                                                          */
/* ------------------------------------------------------------------ */

test("le corpus couvre les quatre familles de contenu", () => {
  const passages = corpus("fr");
  assert.ok(passages.length > 500, `corpus trop maigre : ${passages.length} passages`);

  for (const genre of ["session", "question", "reference"] as const) {
    assert.ok(
      passages.some((p) => p.kind === genre),
      `aucun passage de type ${genre}`,
    );
  }
  // Les exemples du bac à sable sont la seule source de SQL garanti exécutable.
  assert.ok(passages.some((p) => p.href === "/sandbox" && p.sql.length > 0));
});

test("chaque passage renvoie vers une page interne existante", () => {
  const debuts = ["/curriculum/", "/courses/", "/tracks", "/reference", "/sandbox", "/quiz"];
  const mauvais = corpus("fr")
    .map((p) => p.href)
    .filter((href) => !debuts.some((d) => href.startsWith(d)));
  assert.deepEqual([...new Set(mauvais)], []);
});

test("le corpus anglais ne sert pas les explications françaises", () => {
  // `allQuestions` empilait les six parcours dans les deux langues : une
  // question posée en anglais recevait une explication française.
  const fr = corpus("fr").filter((p) => p.kind === "question");
  const en = corpus("en").filter((p) => p.kind === "question");
  assert.ok(en.length > 0 && fr.length > 0);

  const corpsFr = new Set(fr.map((p) => p.body));
  const communs = en.filter((p) => corpsFr.has(p.body)).length;
  // Les banques OCP ne sont traduites que partiellement : on vérifie que la
  // majorité diffère, pas la totalité.
  assert.ok(communs < en.length * 0.6, `${communs}/${en.length} passages anglais identiques au français`);
});

/* ------------------------------------------------------------------ */
/*  La recherche                                                       */
/* ------------------------------------------------------------------ */

test("les mots vides sont retirés, mais jamais un mot-clé SQL", () => {
  // WHERE est à la fois un mot interrogatif anglais et LA clause de filtrage.
  // Le compter comme mot vide revenait à ne plus chercher que « having ».
  assert.deepEqual(termes("Quelle est la différence entre WHERE et HAVING ?"), ["where", "having"]);
  assert.deepEqual(termes("What is the difference between WHERE and HAVING?"), [
    "between",
    "where",
    "having",
  ]);
  assert.deepEqual(termes("Comment utiliser NOT IN avec des valeurs NULL ?"), [
    "utiliser",
    "not",
    "in",
    "valeurs",
    "null",
  ]);
});

test("les questions du cours trouvent le bon passage", () => {
  const attendus: [string, RegExp][] = [
    ["Quelle est la différence entre WHERE et HAVING ?", /HAVING/i],
    ["Pourquoi NOT IN ne renvoie rien avec un NULL ?", /NOT IN|NULL/i],
    ["A quoi sert NVL2 ?", /NVL2/i],
    ["Comment fonctionne une jointure externe ?", /jointure|externe|OUTER/i],
    ["GROUP BY", /GROUP BY/i],
  ];
  for (const [question, motif] of attendus) {
    const trouves = chercher(question, "fr", "oca-sql", 3);
    assert.ok(trouves.length > 0, `aucun résultat pour « ${question} »`);
    const cible = `${trouves[0].passage.title} ${trouves[0].passage.body}`;
    assert.match(cible, motif, `« ${question} » tombe sur : ${trouves[0].passage.title}`);
  }
});

test("le parcours suivi remonte dans le classement, sans exclure les autres", () => {
  const sansParcours = chercher("sauvegarde et restauration", "fr", undefined, 20);
  const avecParcours = chercher("sauvegarde et restauration", "fr", "ocp-dba-ii", 20);
  assert.ok(sansParcours.length > 0 && avecParcours.length > 0);
  // Le filtre ne doit rien retirer : il ne fait que repondérer.
  assert.equal(avecParcours.length, sansParcours.length);
});

/* ------------------------------------------------------------------ */
/*  Les réponses                                                       */
/* ------------------------------------------------------------------ */

test("l'assistant est bien branché", async () => {
  const reponse = await answerQuestion("GROUP BY", FR);
  assert.equal(isAssistantConfigured(), true);
  assert.notEqual(reponse.unavailable, true);
});

test("une réponse cite toujours au moins une source", async () => {
  for (const question of ["GROUP BY", "jointure externe", "NOT IN et NULL", "zzz qqq xxx"]) {
    const reponse = await answerQuestion(question, FR);
    assert.ok(reponse.sources.length > 0, `aucune source pour « ${question} »`);
    assert.ok(reponse.text.trim().length > 0);
  }
});

test("une question hors sujet reçoit un aveu d'ignorance, pas une réponse", async () => {
  const reponse = await answerQuestion("azerty qsdfgh wxcvbn poiuyt", FR);
  assert.match(reponse.text, /pas trouvé/i);
  assert.deepEqual(reponse.sql, []);
  assert.equal(reponse.sources[0].href, "/reference");
});

test("la réponse suit la langue demandée", async () => {
  const fr = await answerQuestion("GROUP BY", FR);
  const en = await answerQuestion("GROUP BY", EN);
  assert.match(fr.text, /D'après le cours/);
  assert.match(en.text, /From the course/);
});

test("tout SQL proposé s'exécute réellement dans le bac à sable", async () => {
  // C'est la promesse du bouton « exécuter » : il ne doit jamais échouer sous
  // les yeux de l'apprenant.
  const questions = [
    "GROUP BY et HAVING",
    "jointure externe entre employees et departments",
    "trier avec les NULL en premier",
    "sous-requête scalaire",
    "opérateurs ensemblistes MINUS",
  ];
  let extraits = 0;
  for (const question of questions) {
    const reponse = await answerQuestion(question, FR);
    for (const sql of reponse.sql) {
      extraits += 1;
      assert.equal(sql.runnable, true, `marqué non exécutable : ${sql.query}`);
      const resultat = runQuery(sql.query);
      assert.equal(resultat.error, undefined, `${sql.query}\n→ ${resultat.error}`);
    }
  }
  assert.ok(extraits > 0, "aucune de ces questions n'a produit d'extrait SQL");
});

test("la citation reste lisible et ne coupe pas au milieu d'un mot", async () => {
  const reponse = await answerQuestion("jointure", FR);
  assert.ok(reponse.text.length < 1200, "citation trop longue");
  if (reponse.text.endsWith("…")) {
    assert.match(reponse.text, /[.\n…]…$|[a-zà-ÿ)»"']…$/i);
  }
});

/* ------------------------------------------------------------------ */
/*  Relecture de la transcription                                      */
/* ------------------------------------------------------------------ */

test("une colonne jsonb malformée ne fait pas tomber la transcription", () => {
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
  assert.deepEqual(
    Object.keys(assistantStrings("fr")).sort(),
    Object.keys(assistantStrings("en")).sort(),
  );
});

test("aucun texte n'est vide ni laissé en français côté anglais", () => {
  const en = assistantStrings("en");
  for (const [cle, valeur] of Object.entries(en)) {
    if (typeof valeur === "string") {
      assert.ok(valeur.trim().length > 0, `texte vide : ${cle}`);
    }
  }
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
  assert.ok(orb.includes('type="button"'), "le point doit être un <button>");
  assert.ok(orb.includes("aria-label"), "le point doit être nommé");
  assert.ok(orb.includes("aria-expanded"), "le point doit annoncer l'état du panneau");
  assert.ok(orb.includes("aria-controls"), "le point doit désigner le panneau");
  assert.ok(orb.includes("focus-visible:ring"), "le focus clavier doit rester visible");
  assert.equal((orb.match(/aria-hidden/g) ?? []).length, 2);
});

/**
 * Le panneau fermé ne doit capter aucun clic.
 *
 * `[hidden] { display: none }` vient de la feuille du navigateur, et la classe
 * `flex` est une règle d'auteur, donc prioritaire : le panneau restait affiché
 * et son calque neutralisait tous les boutons du coin inférieur droit.
 */
test("le panneau fermé est réellement masqué et laisse passer les clics", () => {
  const panneau = readFileSync(join(RACINE, "components", "assistant", "panel.tsx"), "utf8");
  assert.match(panneau, /display:\s*open\s*\?\s*"flex"\s*:\s*"none"/);

  const monte = readFileSync(join(RACINE, "components", "assistant", "assistant.tsx"), "utf8");
  assert.match(monte, /open\s*\?\s*"pointer-events-auto"\s*:\s*"pointer-events-none"/);
});
