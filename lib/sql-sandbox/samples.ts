import type { Locale } from "../i18n/locale";

/**
 * Requêtes d'exemple du bac à sable, une par notion du programme officiel.
 *
 * L'ancien jeu se limitait à des SELECT simples parce que le moteur ne savait
 * rien faire d'autre. Il couvre désormais les fonctions, les agrégats, les
 * jointures, les sous-requêtes et les opérateurs ensemblistes — c'est-à-dire
 * ce que le cours enseigne réellement.
 *
 * Chaque description dit **ce que l'exemple démontre**, pas ce qu'il fait :
 * l'intérêt est d'aller vérifier soi-même un point de règle.
 */
export interface SampleQuery {
  label: { fr: string; en: string };
  query: string;
  description: { fr: string; en: string };
}

export const sampleQueries: SampleQuery[] = [
  {
    label: { fr: "Tous les employés", en: "All employees" },
    query: "SELECT * FROM employees",
    description: {
      fr: "Projection complète — le point de départ",
      en: "Full projection — the starting point",
    },
  },
  {
    label: { fr: "Alias et expression", en: "Alias and expression" },
    query: [
      "SELECT first_name || ' ' || last_name AS nom_complet,",
      "       salary * 12 AS salaire_annuel",
      "FROM employees",
      "ORDER BY salaire_annuel DESC",
    ].join("\n"),
    description: {
      fr: "Concaténation, calcul et alias — l'alias est visible dans ORDER BY, pas dans WHERE",
      en: "Concatenation, arithmetic and alias — the alias is visible in ORDER BY, not in WHERE",
    },
  },
  {
    label: { fr: "Le piège du NULL", en: "The NULL trap" },
    query: [
      "SELECT last_name, commission_pct, NVL(commission_pct, 0) AS sans_null",
      "FROM employees",
      "WHERE commission_pct IS NULL",
    ].join("\n"),
    description: {
      fr: "IS NULL est le seul test valable : remplacez-le par « = NULL » et plus rien ne sort",
      en: "IS NULL is the only valid test: replace it with “= NULL” and nothing comes back",
    },
  },
  {
    label: { fr: "Fonctions mono-ligne", en: "Single-row functions" },
    query: [
      "SELECT UPPER(last_name)        AS nom,",
      "       SUBSTR(email, 1, 3)     AS debut,",
      "       LENGTH(email)           AS taille,",
      "       ROUND(salary / 30, -1)  AS arrondi_dizaine",
      "FROM employees",
      "FETCH FIRST 10 ROWS ONLY",
    ].join("\n"),
    description: {
      fr: "SUBSTR commence à la position 1, et un second argument négatif de ROUND agit sur les dizaines",
      en: "SUBSTR starts at position 1, and a negative second argument to ROUND works on tens",
    },
  },
  {
    label: { fr: "Agrégats et GROUP BY", en: "Aggregates and GROUP BY" },
    query: [
      "SELECT department_id,",
      "       COUNT(*)              AS effectif,",
      "       COUNT(commission_pct) AS avec_commission,",
      "       ROUND(AVG(salary))    AS salaire_moyen",
      "FROM employees",
      "GROUP BY department_id",
      "ORDER BY salaire_moyen DESC",
    ].join("\n"),
    description: {
      fr: "COUNT(*) compte les lignes, COUNT(colonne) les valeurs non nulles — comparez les deux colonnes",
      en: "COUNT(*) counts rows, COUNT(column) counts non-null values — compare the two columns",
    },
  },
  {
    label: { fr: "HAVING contre WHERE", en: "HAVING versus WHERE" },
    query: [
      "SELECT department_id, SUM(salary) AS masse_salariale",
      "FROM employees",
      "WHERE salary > 3000",
      "GROUP BY department_id",
      "HAVING SUM(salary) > 20000",
      "ORDER BY masse_salariale DESC",
    ].join("\n"),
    description: {
      fr: "WHERE filtre les lignes avant le regroupement, HAVING filtre les groupes après",
      en: "WHERE filters rows before grouping, HAVING filters groups afterwards",
    },
  },
  {
    label: { fr: "Jointure interne", en: "Inner join" },
    query: [
      "SELECT e.last_name, d.department_name",
      "FROM employees e",
      "JOIN departments d ON e.department_id = d.department_id",
      "ORDER BY d.department_name",
    ].join("\n"),
    description: {
      fr: "Seules les lignes appariées des deux côtés",
      en: "Only the rows matched on both sides",
    },
  },
  {
    label: { fr: "Jointure externe", en: "Outer join" },
    query: [
      "SELECT e.last_name, d.department_name",
      "FROM employees e",
      "LEFT JOIN departments d ON e.department_id = d.department_id",
      "ORDER BY e.last_name",
    ].join("\n"),
    description: {
      fr: "Tous les employés, même sans département — comptez les lignes et comparez à la jointure interne",
      en: "Every employee, department or not — count the rows and compare with the inner join",
    },
  },
  {
    label: { fr: "Auto-jointure", en: "Self join" },
    query: [
      "SELECT e.last_name AS employe, m.last_name AS responsable",
      "FROM employees e",
      "JOIN employees m ON e.manager_id = m.employee_id",
      "ORDER BY responsable",
    ].join("\n"),
    description: {
      fr: "La même table lue deux fois, sous deux alias distincts",
      en: "The same table read twice, under two distinct aliases",
    },
  },
  {
    label: { fr: "Sous-requête scalaire", en: "Scalar subquery" },
    query: [
      "SELECT last_name, salary",
      "FROM employees",
      "WHERE salary > (SELECT AVG(salary) FROM employees)",
      "ORDER BY salary DESC",
    ].join("\n"),
    description: {
      fr: "Un agrégat est interdit dans WHERE : il faut le calculer dans une sous-requête",
      en: "An aggregate is forbidden in WHERE: it has to be computed in a subquery",
    },
  },
  {
    label: { fr: "EXISTS corrélé", en: "Correlated EXISTS" },
    query: [
      "SELECT d.department_name",
      "FROM departments d",
      "WHERE EXISTS (SELECT 1",
      "              FROM employees e",
      "              WHERE e.department_id = d.department_id)",
    ].join("\n"),
    description: {
      fr: "La sous-requête lit la ligne externe : elle est évaluée une fois par département",
      en: "The subquery reads the outer row: it is evaluated once per department",
    },
  },
  {
    label: { fr: "Opérateurs ensemblistes", en: "Set operators" },
    query: [
      "SELECT department_id FROM departments",
      "MINUS",
      "SELECT department_id FROM employees",
    ].join("\n"),
    description: {
      fr: "Les départements sans aucun employé — remplacez MINUS par INTERSECT pour l'inverse",
      en: "Departments with no employee — swap MINUS for INTERSECT to get the opposite",
    },
  },
  {
    label: { fr: "CASE et placement des NULL", en: "CASE and NULL placement" },
    query: [
      "SELECT last_name,",
      "       commission_pct,",
      "       CASE WHEN salary >= 15000 THEN 'haut'",
      "            WHEN salary >= 8000  THEN 'moyen'",
      "            ELSE 'entrée' END AS niveau",
      "FROM employees",
      "ORDER BY commission_pct NULLS FIRST",
    ].join("\n"),
    description: {
      fr: "Expression conditionnelle, et placement explicite des NULL — par défaut ils passent en dernier",
      en: "Conditional expression, and explicit NULL placement — by default they sort last",
    },
  },
];

/** Libellé ou description dans la langue demandée. */
export function pickSample(value: { fr: string; en: string }, locale: Locale): string {
  return locale === "en" ? value.en : value.fr;
}
