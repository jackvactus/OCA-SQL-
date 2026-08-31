import { test } from "node:test";
import assert from "node:assert/strict";

import { runQuery } from "../lib/sql-sandbox";

/**
 * Le bac à sable ne vaut que s'il exécute ce que le cours enseigne.
 * L'ancien moteur refusait GROUP BY, les jointures, les agrégats et toutes les
 * fonctions — c'est-à-dire quatre des seize domaines officiels du 1Z0-071.
 *
 * Ces tests vérifient d'abord que les cas du programme passent, ensuite que les
 * pièges qu'Oracle réserve sont bien reproduits.
 */

function lignes(sql: string) {
  const r = runQuery(sql);
  assert.equal(r.error, undefined, `${sql}\n  → ${r.error}`);
  return r.rows!;
}

function valeur(sql: string) {
  const r = lignes(sql);
  assert.ok(r.length > 0, `aucune ligne pour : ${sql}`);
  return r[0][0];
}

/* ----------------------------- Projection ----------------------------- */

test("SELECT * renvoie toutes les colonnes", () => {
  const r = runQuery("SELECT * FROM employees");
  assert.equal(r.error, undefined);
  assert.ok(r.columns!.includes("EMPLOYEE_ID"));
  assert.ok(r.rows!.length > 0);
});

test("la projection nommée respecte l'ordre demandé", () => {
  const r = runQuery("SELECT last_name, employee_id FROM employees");
  assert.deepEqual(r.columns, ["LAST_NAME", "EMPLOYEE_ID"]);
});

test("un alias renomme la colonne, avec ou sans AS", () => {
  assert.deepEqual(runQuery("SELECT salary AS paie FROM employees").columns, ["PAIE"]);
  assert.deepEqual(runQuery("SELECT salary paie FROM employees").columns, ["PAIE"]);
});

test("DISTINCT supprime les doublons du résultat", () => {
  const avec = lignes("SELECT DISTINCT department_id FROM employees").length;
  const sans = lignes("SELECT department_id FROM employees").length;
  assert.ok(avec < sans);
});

test("SELECT sans FROM évalue une expression, comme sur DUAL", () => {
  assert.equal(valeur("SELECT 2 + 3"), 5);
});

/* ------------------------- Restriction et tri ------------------------- */

test("WHERE filtre les lignes", () => {
  const r = lignes("SELECT last_name FROM employees WHERE salary > 15000");
  assert.ok(r.length > 0);
  assert.ok(r.length < lignes("SELECT last_name FROM employees").length);
});

test("IS NULL est le seul test valable pour NULL", () => {
  const avecIsNull = lignes("SELECT * FROM employees WHERE commission_pct IS NULL").length;
  assert.ok(avecIsNull > 0);
  // `= NULL` ne rend jamais rien : la comparaison est inconnue, pas fausse.
  assert.equal(lignes("SELECT * FROM employees WHERE commission_pct = NULL").length, 0);
});

test("BETWEEN inclut ses deux bornes", () => {
  const bornes = lignes("SELECT salary FROM employees WHERE salary BETWEEN 17000 AND 17000");
  assert.ok(bornes.length > 0);
  assert.ok(bornes.every((r) => r[0] === 17000));
});

test("LIKE distingue % et _", () => {
  assert.ok(lignes("SELECT last_name FROM employees WHERE last_name LIKE 'K%'").length > 0);
  const uneLettre = lignes("SELECT last_name FROM employees WHERE last_name LIKE '_ing'");
  assert.ok(uneLettre.every((r) => String(r[0]).length === 4));
});

test("AND lie plus fort que OR", () => {
  // a OR b AND c se lit a OR (b AND c) : le résultat contient donc toutes les
  // lignes vérifiant a, quelles que soient b et c.
  const total = lignes(
    "SELECT employee_id FROM employees WHERE department_id = 90 OR salary > 100000 AND salary < 0",
  );
  const seulementA = lignes("SELECT employee_id FROM employees WHERE department_id = 90");
  assert.equal(total.length, seulementA.length);
});

test("ORDER BY place les NULL en dernier en ordre croissant", () => {
  const r = lignes("SELECT commission_pct FROM employees ORDER BY commission_pct");
  const premierNul = r.findIndex((x) => x[0] === null);
  if (premierNul >= 0) {
    assert.ok(
      r.slice(premierNul).every((x) => x[0] === null),
      "une valeur non nulle suit un NULL en tri croissant",
    );
  }
});

test("NULLS FIRST inverse ce placement", () => {
  const r = lignes("SELECT commission_pct FROM employees ORDER BY commission_pct NULLS FIRST");
  assert.equal(r[0][0], null);
});

test("ORDER BY accepte un alias du SELECT", () => {
  const r = lignes("SELECT salary * 12 AS annuel FROM employees ORDER BY annuel DESC");
  assert.ok(Number(r[0][0]) >= Number(r[r.length - 1][0]));
});

test("FETCH FIRST limite le nombre de lignes, OFFSET les décale", () => {
  const cinq = lignes("SELECT employee_id FROM employees ORDER BY employee_id FETCH FIRST 5 ROWS ONLY");
  assert.equal(cinq.length, 5);
  const decale = lignes(
    "SELECT employee_id FROM employees ORDER BY employee_id OFFSET 2 ROWS FETCH FIRST 3 ROWS ONLY",
  );
  assert.deepEqual(decale.map((r) => r[0]), cinq.slice(2).map((r) => r[0]));
});

test("LIMIT est refusé, avec l'alternative Oracle", () => {
  const r = runQuery("SELECT * FROM employees LIMIT 5");
  assert.ok(r.error?.includes("FETCH FIRST"), r.error);
});

/* --------------------------- Fonctions ---------------------------- */

test("les fonctions de chaîne s'appliquent par ligne", () => {
  assert.equal(valeur("SELECT UPPER('oracle')"), "ORACLE");
  assert.equal(valeur("SELECT LOWER('ORACLE')"), "oracle");
  assert.equal(valeur("SELECT LENGTH('ORACLE')"), 6);
  assert.equal(valeur("SELECT INITCAP('steven king')"), "Steven King");
});

test("SUBSTR commence à la position 1", () => {
  assert.equal(valeur("SELECT SUBSTR('ORACLE', 2, 3)"), "RAC");
  // Un début négatif compte depuis la fin de la chaîne.
  assert.equal(valeur("SELECT SUBSTR('ORACLE', -3)"), "CLE");
});

test("INSTR renvoie 0 quand la sous-chaîne est absente", () => {
  assert.equal(valeur("SELECT INSTR('ORACLE', 'A')"), 3);
  assert.equal(valeur("SELECT INSTR('ORACLE', 'Z')"), 0);
});

test("un second argument négatif de ROUND agit à gauche de la virgule", () => {
  assert.equal(valeur("SELECT ROUND(156.78, -1)"), 160);
  assert.equal(valeur("SELECT TRUNC(156.78, -1)"), 150);
  assert.equal(valeur("SELECT ROUND(156.78)"), 157);
});

test("MOD renvoie le reste", () => {
  assert.equal(valeur("SELECT MOD(10, 3)"), 1);
});

test("NVL2 renvoie son deuxième argument quand le premier n'est PAS nul", () => {
  assert.equal(valeur("SELECT NVL2('x', 'plein', 'vide')"), "plein");
  assert.equal(valeur("SELECT NVL2(NULL, 'plein', 'vide')"), "vide");
});

test("NVL, NULLIF et COALESCE se distinguent", () => {
  assert.equal(valeur("SELECT NVL(NULL, 0)"), 0);
  assert.equal(valeur("SELECT NULLIF(5, 5)"), null);
  assert.equal(valeur("SELECT NULLIF(5, 6)"), 5);
  assert.equal(valeur("SELECT COALESCE(NULL, NULL, 'trouvé')"), "trouvé");
});

test("CASE évalue ses branches dans l'ordre", () => {
  const r = lignes(
    "SELECT CASE WHEN salary > 15000 THEN 'haut' WHEN salary > 8000 THEN 'moyen' ELSE 'bas' END AS niveau FROM employees",
  );
  assert.ok(r.every((x) => ["haut", "moyen", "bas"].includes(String(x[0]))));
});

test("la concaténation traite NULL comme une chaîne vide", () => {
  assert.equal(valeur("SELECT 'a' || NULL || 'b'"), "ab");
  // L'arithmétique, elle, propage NULL.
  assert.equal(valeur("SELECT 1 + NULL"), null);
});

test("la division par zéro est refusée", () => {
  assert.ok(runQuery("SELECT 1 / 0").error?.includes("ORA-01476"));
});

/* ------------------------ Fonctions de groupe ------------------------ */

test("COUNT(*) compte les lignes, COUNT(colonne) les valeurs non nulles", () => {
  const total = Number(valeur("SELECT COUNT(*) FROM employees"));
  const commissions = Number(valeur("SELECT COUNT(commission_pct) FROM employees"));
  assert.ok(total > commissions, "COUNT(*) devrait dépasser COUNT d'une colonne nullable");
});

test("les agrégats ignorent les NULL", () => {
  const moyenne = Number(valeur("SELECT AVG(commission_pct) FROM employees"));
  const somme = Number(valeur("SELECT SUM(commission_pct) FROM employees"));
  const compte = Number(valeur("SELECT COUNT(commission_pct) FROM employees"));
  assert.ok(Math.abs(moyenne - somme / compte) < 1e-9, "AVG doit diviser par le nombre de non-NULL");
});

test("GROUP BY forme des groupes et HAVING les filtre", () => {
  const tous = lignes("SELECT department_id, COUNT(*) FROM employees GROUP BY department_id");
  const filtres = lignes(
    "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 1",
  );
  assert.ok(filtres.length > 0);
  assert.ok(filtres.length < tous.length);
  assert.ok(filtres.every((r) => Number(r[1]) > 1));
});

test("un agrégat dans WHERE est refusé", () => {
  const r = runQuery("SELECT * FROM employees WHERE COUNT(*) > 1");
  assert.ok(r.error?.includes("ORA-00934"), r.error);
});

test("COUNT(DISTINCT colonne) dédoublonne avant de compter", () => {
  const distincts = Number(valeur("SELECT COUNT(DISTINCT department_id) FROM employees"));
  const total = Number(valeur("SELECT COUNT(department_id) FROM employees"));
  assert.ok(distincts < total);
});

test("MIN et MAX acceptent du texte", () => {
  assert.equal(typeof valeur("SELECT MIN(last_name) FROM employees"), "string");
});

/* ------------------------------ Jointures ------------------------------ */

test("INNER JOIN ne garde que les lignes appariées", () => {
  const r = lignes(
    "SELECT e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id",
  );
  assert.ok(r.length > 0);
  assert.ok(r.every((x) => x[1] !== null));
});

test("LEFT JOIN conserve les lignes non appariées de gauche", () => {
  const interne = lignes(
    "SELECT e.employee_id FROM employees e JOIN departments d ON e.department_id = d.department_id",
  ).length;
  const externe = lignes(
    "SELECT e.employee_id FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id",
  ).length;
  assert.ok(externe >= interne);
  assert.equal(externe, lignes("SELECT employee_id FROM employees").length);
});

test("CROSS JOIN produit le produit cartésien", () => {
  const e = lignes("SELECT employee_id FROM employees").length;
  const d = lignes("SELECT department_id FROM departments").length;
  assert.equal(lignes("SELECT e.employee_id FROM employees e CROSS JOIN departments d").length, e * d);
});

test("USING fusionne la colonne commune", () => {
  const r = lignes(
    "SELECT last_name, department_name FROM employees JOIN departments USING (department_id)",
  );
  assert.ok(r.length > 0);
});

test("une auto-jointure relie un employé à son responsable", () => {
  const r = lignes(
    "SELECT e.last_name, m.last_name FROM employees e JOIN employees m ON e.manager_id = m.employee_id",
  );
  assert.ok(r.length > 0);
  assert.ok(r.every((x) => x[1] !== null));
});

/* ----------------------------- Sous-requêtes ----------------------------- */

test("une sous-requête scalaire sert de valeur de comparaison", () => {
  const r = lignes(
    "SELECT last_name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
  );
  assert.ok(r.length > 0);
  assert.ok(r.length < lignes("SELECT last_name FROM employees").length);
});

test("IN accepte une sous-requête multi-lignes", () => {
  const r = lignes(
    "SELECT last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700)",
  );
  assert.ok(r.length > 0);
});

test("une sous-requête scalaire renvoyant plusieurs lignes est refusée", () => {
  const r = runQuery("SELECT * FROM employees WHERE salary = (SELECT salary FROM employees)");
  assert.ok(r.error?.includes("ORA-01427"), r.error);
});

test("EXISTS teste la présence d'au moins une ligne", () => {
  const r = lignes(
    "SELECT department_name FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id)",
  );
  assert.ok(r.length > 0);
});

/* -------------------------- Opérateurs ensemblistes -------------------------- */

test("UNION dédoublonne, UNION ALL non", () => {
  const avecDoublons = lignes(
    "SELECT department_id FROM employees UNION ALL SELECT department_id FROM employees",
  ).length;
  const sansDoublons = lignes(
    "SELECT department_id FROM employees UNION SELECT department_id FROM employees",
  ).length;
  assert.ok(sansDoublons < avecDoublons);
});

test("INTERSECT renvoie les lignes communes, MINUS la différence", () => {
  const commun = lignes(
    "SELECT department_id FROM employees INTERSECT SELECT department_id FROM departments",
  );
  assert.ok(commun.length > 0);
  const difference = lignes(
    "SELECT department_id FROM departments MINUS SELECT department_id FROM employees",
  );
  assert.ok(difference.length >= 0);
});

test("un nombre de colonnes différent est refusé", () => {
  const r = runQuery("SELECT employee_id FROM employees UNION SELECT department_id, department_name FROM departments");
  assert.ok(r.error?.includes("ORA-01789"), r.error);
});

/* ------------------------------ Refus utiles ------------------------------ */

test("le DML est refusé, avec la raison", () => {
  const r = runQuery("DELETE FROM employees");
  assert.ok(r.error?.includes("lecture seule"), r.error);
});

test("le DDL est refusé, avec la raison", () => {
  const r = runQuery("DROP TABLE employees");
  assert.ok(r.error?.includes("schéma est fixe"), r.error);
});

test("une table inconnue liste les tables disponibles", () => {
  const r = runQuery("SELECT * FROM clients");
  assert.ok(r.error?.includes("ORA-00942"), r.error);
  assert.ok(r.error?.includes("employees"), r.error);
});

test("une colonne inconnue est signalée par son nom", () => {
  const r = runQuery("SELECT salaire FROM employees");
  assert.ok(r.error?.includes("ORA-00904"), r.error);
});

test("une erreur de syntaxe indique la position", () => {
  const r = runQuery("SELECT FROM WHERE");
  assert.ok(r.error?.startsWith("Erreur de syntaxe"), r.error);
});

test("les commentaires sont ignorés", () => {
  const r = lignes("SELECT employee_id -- un commentaire\nFROM employees /* et un autre */");
  assert.ok(r.length > 0);
});

test("une quote doublée est une quote littérale", () => {
  assert.equal(valeur("SELECT 'aujourd''hui'"), "aujourd'hui");
});
