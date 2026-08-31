import type { DomainObjectives } from "./exam-objectives";
import { SRC_SQL } from "./exam-sources";

/**
 * Objectifs officiels de l'examen 1Z0-071 — Oracle Database SQL.
 * 63 questions · 120 minutes · 63 %.
 *
 * Seize domaines, repris dans l'ordre de la fiche d'examen Oracle University.
 * La formulation anglaise est celle d'Oracle ; la traduction française est
 * fournie à côté, jamais à la place.
 */
export const ocaObjectives: Record<string, DomainObjectives> = {
  "1Z0-071|Relational Database Concepts": {
    titleFr: "Concepts des bases de données relationnelles",
    source: SRC_SQL,
    objectives: [
      { en: "Explaining the theoretical and physical aspects of a relational database", fr: "Expliquer les aspects théoriques et physiques d'une base relationnelle" },
      { en: "Relating clauses in SQL Select Statement to Components of an ERD", fr: "Associer les clauses d'un SELECT aux composants d'un diagramme entité-association" },
      { en: "Explaining the relationship between a database and SQL", fr: "Expliquer la relation entre une base de données et SQL" },
    ],
  },
  "1Z0-071|Retrieving Data using the SQL SELECT Statement": {
    titleFr: "Extraire des données avec l'instruction SELECT",
    source: SRC_SQL,
    objectives: [
      { en: "Using The SQL SELECT Statement", fr: "Utiliser l'instruction SELECT" },
      { en: "Using Column aliases", fr: "Utiliser les alias de colonnes" },
      { en: "Using concatenation operator, literal character strings, alternative quote operator, and the DISTINCT keyword", fr: "Opérateur de concaténation, chaînes littérales, opérateur de quote alternatif et mot-clé DISTINCT" },
      { en: "Using Arithmetic expressions and NULL values in the SELECT statement", fr: "Expressions arithmétiques et valeurs NULL dans le SELECT" },
    ],
  },
  "1Z0-071|Restricting and Sorting Data": {
    titleFr: "Restreindre et trier les données",
    source: SRC_SQL,
    objectives: [
      { en: "Applying Rules of precedence for operators in an expression", fr: "Appliquer les règles de priorité des opérateurs dans une expression" },
      { en: "Limiting Rows Returned in a SQL Statement", fr: "Limiter le nombre de lignes renvoyées par une requête" },
      { en: "Sorting Data", fr: "Trier les données" },
      { en: "Using Substitution Variables", fr: "Utiliser les variables de substitution" },
      { en: "Using the DEFINE and VERIFY commands", fr: "Utiliser les commandes DEFINE et VERIFY" },
    ],
  },
  "1Z0-071|Using Single-Row Functions to Customize Output": {
    titleFr: "Personnaliser le résultat avec les fonctions mono-ligne",
    source: SRC_SQL,
    objectives: [
      { en: "Manipulating strings with character functions in SQL SELECT and WHERE clauses", fr: "Manipuler les chaînes avec les fonctions caractère dans SELECT et WHERE" },
      { en: "Manipulating numbers with the ROUND, TRUNC and MOD functions", fr: "Manipuler les nombres avec ROUND, TRUNC et MOD" },
      { en: "Manipulating dates with the date function", fr: "Manipuler les dates avec les fonctions de date" },
      { en: "Performing arithmetic with date data", fr: "Effectuer des opérations arithmétiques sur des dates" },
    ],
  },
  "1Z0-071|Using Conversion Functions and Conditional Expressions": {
    titleFr: "Fonctions de conversion et expressions conditionnelles",
    source: SRC_SQL,
    objectives: [
      { en: "Understanding implicit and explicit data type conversion", fr: "Comprendre la conversion implicite et explicite des types de données" },
      { en: "Using the TO_CHAR, TO_NUMBER, and TO_DATE conversion functions", fr: "Utiliser les fonctions TO_CHAR, TO_NUMBER et TO_DATE" },
      { en: "Applying the NVL, NULLIF, and COALESCE functions to data", fr: "Appliquer les fonctions NVL, NULLIF et COALESCE aux données" },
      { en: "Nesting multiple functions", fr: "Imbriquer plusieurs fonctions" },
    ],
  },
  "1Z0-071|Reporting Aggregated Data Using Group Functions": {
    titleFr: "Restituer des données agrégées avec les fonctions de groupe",
    source: SRC_SQL,
    objectives: [
      { en: "Using Group Functions", fr: "Utiliser les fonctions de groupe" },
      { en: "Creating Groups of Data", fr: "Créer des groupes de données" },
      { en: "Restricting Group Results", fr: "Restreindre les résultats de groupe" },
    ],
  },
  "1Z0-071|Displaying Data from Multiple Tables": {
    titleFr: "Afficher les données de plusieurs tables",
    source: SRC_SQL,
    objectives: [
      { en: "Using Various Types of Joins", fr: "Utiliser les différents types de jointures" },
      { en: "Using Self-joins", fr: "Utiliser les auto-jointures" },
      { en: "Using Non-equijoins", fr: "Utiliser les non-équijointures" },
      { en: "Using OUTER joins", fr: "Utiliser les jointures externes" },
      { en: "Understanding and Using Cartesian Products", fr: "Comprendre et utiliser les produits cartésiens" },
    ],
  },
  "1Z0-071|Using Subqueries to Solve Queries": {
    titleFr: "Résoudre des requêtes à l'aide de sous-requêtes",
    source: SRC_SQL,
    objectives: [
      { en: "Using Single Row Subqueries", fr: "Utiliser les sous-requêtes mono-ligne" },
      { en: "Using Multiple Row Subqueries", fr: "Utiliser les sous-requêtes multi-lignes" },
      { en: "Update and delete rows using correlated subqueries", fr: "Mettre à jour et supprimer des lignes par sous-requêtes corrélées" },
    ],
  },
  "1Z0-071|Using SET Operators": {
    titleFr: "Utiliser les opérateurs ensemblistes",
    source: SRC_SQL,
    objectives: [
      { en: "Matching the SELECT statements", fr: "Faire correspondre les instructions SELECT" },
      { en: "Using The UNION and UNION ALL operators", fr: "Utiliser les opérateurs UNION et UNION ALL" },
      { en: "Using The INTERSECT operator", fr: "Utiliser l'opérateur INTERSECT" },
      { en: "Using The MINUS operator", fr: "Utiliser l'opérateur MINUS" },
      { en: "Using the ORDER BY clause in set operations", fr: "Utiliser ORDER BY dans les opérations ensemblistes" },
    ],
  },
  "1Z0-071|Managing Tables using DML statements": {
    titleFr: "Gérer les tables avec les instructions DML",
    source: SRC_SQL,
    objectives: [
      { en: "Performing Insert, Update and Delete operations", fr: "Effectuer des opérations INSERT, UPDATE et DELETE" },
      { en: "Performing multi table Inserts", fr: "Effectuer des insertions multi-tables" },
      { en: "Performing Merge statements", fr: "Exécuter des instructions MERGE" },
      { en: "Managing Database Transactions", fr: "Gérer les transactions de la base de données" },
      { en: "Controlling transactions", fr: "Contrôler les transactions" },
    ],
  },
  "1Z0-071|Managing Indexes Synonyms and Sequences": {
    titleFr: "Gérer les index, synonymes et séquences",
    source: SRC_SQL,
    objectives: [
      { en: "Managing Indexes", fr: "Gérer les index" },
      { en: "Managing Synonyms", fr: "Gérer les synonymes" },
      { en: "Managing Sequences", fr: "Gérer les séquences" },
    ],
  },
  "1Z0-071|Use DDL to manage tables and their relationships": {
    titleFr: "Gérer les tables et leurs relations avec le DDL",
    source: SRC_SQL,
    objectives: [
      { en: "Describing and Working with Tables", fr: "Décrire et manipuler les tables" },
      { en: "Describing and Working with Columns and Data Types", fr: "Décrire et manipuler les colonnes et les types de données" },
      { en: "Creating tables", fr: "Créer des tables" },
      { en: "Dropping columns and setting column UNUSED", fr: "Supprimer des colonnes et les marquer UNUSED" },
      { en: "Truncating tables", fr: "Tronquer des tables" },
      { en: "Creating and using Temporary Tables", fr: "Créer et utiliser des tables temporaires" },
      { en: "Creating and using External Tables", fr: "Créer et utiliser des tables externes" },
      { en: "Managing Constraints", fr: "Gérer les contraintes" },
    ],
  },
  "1Z0-071|Managing Views": {
    titleFr: "Gérer les vues",
    source: SRC_SQL,
    objectives: [{ en: "Managing Views", fr: "Créer, modifier et supprimer des vues" }],
  },
  "1Z0-071|Controlling User Access": {
    titleFr: "Contrôler les accès utilisateurs",
    source: SRC_SQL,
    objectives: [
      { en: "Differentiating system privileges from object privileges", fr: "Distinguer privilèges système et privilèges objet" },
      { en: "Granting privileges on tables", fr: "Accorder des privilèges sur les tables" },
      { en: "Distinguishing between granting privileges and roles", fr: "Distinguer l'octroi de privilèges de l'attribution de rôles" },
    ],
  },
  "1Z0-071|Managing Objects with Data Dictionary Views": {
    titleFr: "Gérer les objets avec les vues du dictionnaire",
    source: SRC_SQL,
    objectives: [{ en: "Using data dictionary views", fr: "Utiliser les vues du dictionnaire de données" }],
  },
  "1Z0-071|Managing Data in Different Time Zones": {
    titleFr: "Gérer les données dans différents fuseaux horaires",
    source: SRC_SQL,
    objectives: [
      { en: "Using CURRENT_DATE, CURRENT_TIMESTAMP, and LOCALTIMESTAMP", fr: "Utiliser CURRENT_DATE, CURRENT_TIMESTAMP et LOCALTIMESTAMP" },
      { en: "Using INTERVAL data types", fr: "Utiliser les types de données INTERVAL" },
    ],
  },
};
