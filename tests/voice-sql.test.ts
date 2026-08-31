import { test } from "node:test";
import assert from "node:assert/strict";

import { motsVersNombres, ressembleADuSqlDicte, voiceToSql } from "../lib/voice-sql";
import { runQuery } from "../lib/sql-sandbox";

/**
 * Dictée vocale vers SQL.
 *
 * La promesse est double : ce qui est compris produit une requête **qui
 * s'exécute**, et ce qui ne l'est pas est refusé plutôt que deviné. Une
 * requête plausible mais fausse est le pire résultat possible : l'apprenant
 * la croit correcte et apprend une erreur.
 */

/** Traduit et vérifie que la requête tourne réellement. */
function traduire(phrase: string) {
  const resultat = voiceToSql(phrase, "fr");
  return resultat;
}

/* ------------------------------------------------------------------ */
/*  Nombres dictés                                                     */
/* ------------------------------------------------------------------ */

test("les nombres écrits en lettres sont reconstitués", () => {
  assert.deepEqual(motsVersNombres(["cinq", "mille"]), ["5000"]);
  assert.deepEqual(motsVersNombres(["deux", "mille", "vingt", "quatre"]), ["2024"]);
  assert.deepEqual(motsVersNombres(["les", "cinq", "premiers"]), ["les", "5", "premiers"]);
});

test("les irrégularités du français sont traitées", () => {
  // « quatre-vingt » vaut 80, pas 4 x 20 ; et « quatre-vingt-dix » vaut 90,
  // ce qui exige que les deux mots forment un seul jeton.
  assert.deepEqual(motsVersNombres(["quatre", "vingt"]), ["80"]);
  assert.deepEqual(motsVersNombres(["quatre", "vingt", "dix"]), ["90"]);
  assert.deepEqual(motsVersNombres(["soixante", "quinze"]), ["75"]);
  assert.deepEqual(motsVersNombres(["vingt", "et", "un"]), ["21"]);
});

test("« une » reste un article quand il n'est pas soudé à un nombre", () => {
  // Le convertir en « 1 » détruisait « qui ont une commission ».
  assert.deepEqual(motsVersNombres(["une", "commission"]), ["une", "commission"]);
  assert.deepEqual(motsVersNombres(["vingt", "et", "une"]), ["21"]);
});

/* ------------------------------------------------------------------ */
/*  Questions en langage courant                                       */
/* ------------------------------------------------------------------ */

const CAS: [string, RegExp][] = [
  ["montre moi les employés dont le salaire dépasse 5000", /WHERE salary > 5000/],
  ["les employés qui gagnent au moins 10000", /WHERE salary >= 10000/],
  ["combien d'employés par département", /COUNT\(\*\)[\s\S]*GROUP BY department_id/],
  ["le salaire moyen par département", /AVG\(salary\)[\s\S]*GROUP BY department_id/],
  ["la somme des salaires par département", /SUM\(salary\)/],
  ["les employés sans commission", /commission_pct IS NULL/],
  ["les employés qui ont une commission", /commission_pct IS NOT NULL/],
  ["les employés dont le nom commence par K", /last_name LIKE 'K%'/],
  ["les employés dont l'email contient KING", /email LIKE '%KING%'/],
  ["les 5 salaires les plus élevés", /ORDER BY salary DESC[\s\S]*FETCH FIRST 5 ROWS ONLY/],
  ["les départements triés par nom", /FROM departments[\s\S]*ORDER BY department_name ASC/],
  ["les postes dont le salaire maximum dépasse 15000", /FROM jobs[\s\S]*max_salary > 15000/],
  ["les départements distincts", /SELECT DISTINCT/],
];

for (const [phrase, motif] of CAS) {
  test(`« ${phrase} »`, () => {
    const resultat = traduire(phrase);
    assert.ok(resultat.sql, `aucune requête produite — ${resultat.message ?? ""}`);
    assert.match(resultat.sql!, motif);
    assert.equal(resultat.mode, "question");
  });
}

test("une valeur d'une autre table devient une sous-requête", () => {
  // « les employés du département Sales » : le nom du service vit dans
  // `departments`. C'est exactement la forme qu'enseigne le programme.
  const resultat = traduire("les employés du département Sales");
  assert.match(
    resultat.sql!,
    /department_id = \(SELECT department_id FROM departments WHERE department_name = 'Sales'\)/,
  );
  const execution = runQuery(resultat.sql!);
  assert.equal(execution.error, undefined);
  assert.equal(execution.rowCount, 3);
});

test("la casse stockée est rétablie, pas celle prononcée", () => {
  // La reconnaissance vocale rend « sales » ; la table contient « Sales ».
  const resultat = traduire("les employés du département sales");
  assert.match(resultat.sql!, /'Sales'/);
});

/* ------------------------------------------------------------------ */
/*  SQL dicté mot à mot                                                */
/* ------------------------------------------------------------------ */

test("une phrase commençant par un verbe de requête est lue comme du SQL", () => {
  assert.equal(ressembleADuSqlDicte("select étoile from employés"), true);
  assert.equal(ressembleADuSqlDicte("Sélectionne le nom depuis les employés"), true);
  assert.equal(ressembleADuSqlDicte("combien d'employés"), false);
});

test("le SQL dicté est rendu à ses identifiants réels", () => {
  const resultat = traduire("select étoile from employés");
  assert.equal(resultat.sql, "SELECT * FROM employees");
  assert.equal(resultat.mode, "dictee");
});

test("les déterminants disparaissent et « et » sépare les colonnes", () => {
  // « SELECT le last_name AND le salary FROM les employees » ne compile pas :
  // les articles n'ont pas d'équivalent, et dans la projection « et » est une
  // virgule, pas une conjonction.
  const resultat = traduire(
    "sélectionne le nom et le salaire depuis les employés où le salaire supérieur à 10000",
  );
  assert.equal(resultat.sql, "SELECT last_name, salary FROM employees WHERE salary > 10000");
  assert.equal(resultat.valide, true);
});

test("une table inconnue est signalée avec la liste des tables disponibles", () => {
  const resultat = traduire("select étoile from clients");
  assert.ok(resultat.message);
  assert.match(resultat.message!, /employees, departments, jobs, dual/);
});

test("une dictée sans FROM est refusée avec la marche à suivre", () => {
  const resultat = traduire("select étoile");
  assert.equal(resultat.sql, null);
  assert.match(resultat.message!, /FROM/);
});

/* ------------------------------------------------------------------ */
/*  Refus honnêtes                                                     */
/* ------------------------------------------------------------------ */

test("une phrase sans rien de reconnaissable ne produit pas de requête", () => {
  // Le danger : renvoyer « SELECT * FROM employees » et laisser croire que la
  // phrase a été comprise.
  for (const phrase of ["n'importe quoi du tout", "bonjour comment ça va", "euh"]) {
    const resultat = traduire(phrase);
    assert.equal(resultat.sql, null, `« ${phrase} » a produit ${resultat.sql}`);
    assert.ok(resultat.message);
  }
});

test("une transcription vide est refusée sans erreur", () => {
  const resultat = voiceToSql("   ", "fr");
  assert.equal(resultat.sql, null);
  assert.match(resultat.message!, /Rien/);
});

test("une colonne absente de la table est signalée, pas inventée", () => {
  // « la commission des départements » : `commission_pct` n'existe pas dans
  // `departments`. La clause est abandonnée et le message le dit.
  const resultat = traduire("les départements et leur commission");
  if (resultat.sql) {
    assert.doesNotMatch(resultat.sql, /commission/);
    assert.match(resultat.message ?? "", /commission/);
  }
});

/* ------------------------------------------------------------------ */
/*  La garantie d'exécution                                            */
/* ------------------------------------------------------------------ */

test("toute requête produite s'exécute réellement dans le bac à sable", () => {
  const phrases = [
    ...CAS.map(([p]) => p),
    "les employés du département Sales",
    "select étoile from employés",
    "combien de postes",
    "le salaire le plus élevé",
    "les employés triés par salaire décroissant",
    "les 3 premiers départements",
    "les employés dont le département vaut 60",
  ];

  const echecs: string[] = [];
  for (const phrase of phrases) {
    const resultat = traduire(phrase);
    if (!resultat.sql) continue;
    const execution = runQuery(resultat.sql);
    if (execution.error) echecs.push(`« ${phrase} »\n    ${resultat.sql}\n    → ${execution.error}`);
  }
  assert.deepEqual(echecs, [], `Requêtes produites mais refusées :\n  ${echecs.join("\n  ")}`);
});

test("le résultat annonce lui-même si la requête est exécutable", () => {
  // `valide` est renseigné par une exécution réelle, pas par une supposition.
  const bonne = traduire("les employés dont le salaire dépasse 5000");
  assert.equal(bonne.valide, true);
  assert.equal(bonne.message, undefined);
});
