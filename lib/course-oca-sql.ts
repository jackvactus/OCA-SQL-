import type { Locale } from "./i18n/locale";

/**
 * Cursus complet Oracle SQL 1Z0-071, structuré à partir de
 * `docs/OCA/sql oca/📚 COURS COMPLET ORACLE SQL 1Z0.docx`.
 *
 * Le document source est un support de formation original (et non un recueil
 * d'examen) : il est repris intégralement, dans son ordre pédagogique — six
 * sessions, de l'introduction au SQL jusqu'à l'administration des objets.
 *
 * Deux corrections ont été apportées au passage :
 *  1. Les blocs qui énuméraient des opérateurs sous forme de `WHERE a > 1, b < 2`
 *     — syntaxiquement invalides — sont rendus en tableaux de référence plutôt
 *     qu'en code exécutable, pour ne pas enseigner une syntaxe erronée.
 *  2. Chaque titre et chaque texte est fourni en français et en anglais ; le SQL,
 *     lui, est identique dans les deux langues.
 */

export interface Bilingual {
  fr: string;
  en: string;
}

export type CourseBlock =
  | { kind: "text"; body: Bilingual }
  | { kind: "list"; title?: Bilingual; items: Bilingual[] }
  | { kind: "code"; title?: Bilingual; code: string; caption?: Bilingual }
  | { kind: "table"; title?: Bilingual; headers: Bilingual[]; rows: Bilingual[][] }
  | { kind: "tip"; title?: Bilingual; body: Bilingual }
  | { kind: "warning"; title?: Bilingual; body: Bilingual }
  | { kind: "compare"; title?: Bilingual; wrong: string; right: string; note: Bilingual };

export interface CourseTopic {
  id: string;
  number: string;
  title: Bilingual;
  blocks: CourseBlock[];
}

export interface SelfCheck {
  question: Bilingual;
  answer: Bilingual;
}

export interface CourseSession {
  id: string;
  number: number;
  title: Bilingual;
  summary: Bilingual;
  estimatedMinutes: number;
  topics: CourseTopic[];
  /** Ce qu'il faut avoir retenu en fermant la session. */
  keyTakeaways?: Bilingual[];
  /** Questions de contrôle, réponse masquée jusqu'au clic. */
  selfCheck?: SelfCheck[];
}

export function tr(value: Bilingual, locale: Locale): string {
  return locale === "en" ? value.en : value.fr;
}

export const courseMeta = {
  title: {
    fr: "Cours complet Oracle SQL — 1Z0-071",
    en: "Complete Oracle SQL course — 1Z0-071",
  },
  subtitle: {
    fr: "Six sessions progressives, du premier SELECT à l'administration des objets de schéma.",
    en: "Six progressive sessions, from your first SELECT to schema object administration.",
  },
  objectives: {
    fr: [
      "Comprendre et maîtriser le langage SQL Oracle",
      "Savoir interroger et manipuler des bases de données relationnelles",
      "Être prêt pour l'examen de certification Oracle Database SQL",
    ],
    en: [
      "Understand and master the Oracle SQL language",
      "Query and manipulate relational databases with confidence",
      "Be ready for the Oracle Database SQL certification exam",
    ],
  },
  environment: {
    fr: [
      "Oracle Database Express Edition (XE) — édition gratuite",
      "SQL Developer — environnement de développement graphique",
      "SQL*Plus — interface en ligne de commande",
    ],
    en: [
      "Oracle Database Express Edition (XE) — free edition",
      "SQL Developer — graphical development environment",
      "SQL*Plus — command-line interface",
    ],
  },
};

export const courseSessions: CourseSession[] = [
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-1",
    number: 1,
    title: { fr: "Les fondamentaux du SQL", en: "SQL fundamentals" },
    summary: {
      fr: "Le langage, la commande SELECT, les types de données Oracle, les fonctions scalaires et la conversion.",
      en: "The language, the SELECT statement, Oracle data types, scalar functions and conversion.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "1-1",
        number: "1.1",
        title: { fr: "Introduction au langage SQL", en: "Introduction to the SQL language" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "SQL (Structured Query Language) est le langage standard permettant de communiquer avec les bases de données relationnelles. Il se décompose en quatre familles de commandes, dont la distinction est régulièrement testée à l'examen.",
              en: "SQL (Structured Query Language) is the standard language for communicating with relational databases. It splits into four command families, and telling them apart is regularly tested on the exam.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les quatre familles de commandes", en: "The four command families" },
            headers: [
              { fr: "Famille", en: "Family" },
              { fr: "Signification", en: "Meaning" },
              { fr: "Commandes", en: "Statements" },
            ],
            rows: [
              [
                { fr: "DML", en: "DML" },
                { fr: "Data Manipulation Language", en: "Data Manipulation Language" },
                { fr: "SELECT, INSERT, UPDATE, DELETE", en: "SELECT, INSERT, UPDATE, DELETE" },
              ],
              [
                { fr: "DDL", en: "DDL" },
                { fr: "Data Definition Language", en: "Data Definition Language" },
                { fr: "CREATE, ALTER, DROP, RENAME", en: "CREATE, ALTER, DROP, RENAME" },
              ],
              [
                { fr: "DCL", en: "DCL" },
                { fr: "Data Control Language", en: "Data Control Language" },
                { fr: "GRANT, REVOKE", en: "GRANT, REVOKE" },
              ],
              [
                { fr: "TCL", en: "TCL" },
                { fr: "Transaction Control Language", en: "Transaction Control Language" },
                { fr: "COMMIT, ROLLBACK, SAVEPOINT", en: "COMMIT, ROLLBACK, SAVEPOINT" },
              ],
            ],
          },
          {
            kind: "tip",
            title: { fr: "À retenir pour l'examen", en: "Remember for the exam" },
            body: {
              fr: "Toute commande DDL déclenche un COMMIT implicite avant et après son exécution. Un CREATE TABLE valide donc définitivement les DML en attente : un ROLLBACK ultérieur n'a plus rien à annuler.",
              en: "Every DDL statement fires an implicit COMMIT before and after it runs. A CREATE TABLE therefore commits any pending DML for good: a later ROLLBACK has nothing left to undo.",
            },
          },
        ],
      },
      {
        id: "1-2",
        number: "1.2",
        title: { fr: "La commande SELECT", en: "The SELECT statement" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Syntaxe fondamentale", en: "Core syntax" },
            code: `SELECT colonne1, colonne2, ...
FROM   nom_table
WHERE  condition;`,
          },
          {
            kind: "code",
            title: { fr: "Exemples pratiques", en: "Practical examples" },
            code: `-- Toutes les colonnes
SELECT * FROM employes;

-- Colonnes spécifiques
SELECT id, nom, prenom FROM employes;

-- Alias de colonnes (guillemets doubles pour conserver casse et espaces)
SELECT nom AS "Nom de famille", prenom AS "Prénom" FROM employes;

-- Calcul dans la projection
SELECT nom, salaire, salaire * 12 AS "Salaire annuel" FROM employes;`,
          },
          {
            kind: "code",
            title: { fr: "La table DUAL", en: "The DUAL table" },
            caption: {
              fr: "Table système Oracle d'une seule ligne et d'une seule colonne, utilisée pour évaluer une expression sans interroger de vraie table.",
              en: "A one-row, one-column Oracle system table, used to evaluate an expression without querying a real table.",
            },
            code: `SELECT 2 + 3   FROM DUAL;   -- 5
SELECT SYSDATE FROM DUAL;   -- date et heure courantes
SELECT USER    FROM DUAL;   -- utilisateur connecté`,
          },
        ],
      },
      {
        id: "1-3",
        number: "1.3",
        title: { fr: "Types de données Oracle", en: "Oracle data types" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Types numériques", en: "Numeric types" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Description", en: "Description" },
              { fr: "Exemple", en: "Example" },
            ],
            rows: [
              [
                { fr: "NUMBER(p,s)", en: "NUMBER(p,s)" },
                { fr: "Précision p, échelle s", en: "Precision p, scale s" },
                { fr: "NUMBER(7,2) → 12345.67", en: "NUMBER(7,2) → 12345.67" },
              ],
              [
                { fr: "NUMBER(p)", en: "NUMBER(p)" },
                { fr: "Entier de p chiffres", en: "Integer with p digits" },
                { fr: "NUMBER(5) → 12345", en: "NUMBER(5) → 12345" },
              ],
              [
                { fr: "NUMBER", en: "NUMBER" },
                { fr: "Précision maximale", en: "Maximum precision" },
                { fr: "—", en: "—" },
              ],
              [
                { fr: "FLOAT", en: "FLOAT" },
                { fr: "Virgule flottante", en: "Floating point" },
                { fr: "—", en: "—" },
              ],
            ],
          },
          {
            kind: "table",
            title: { fr: "Types caractères et date", en: "Character and date types" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Description", en: "Description" },
            ],
            rows: [
              [
                { fr: "VARCHAR2(n)", en: "VARCHAR2(n)" },
                { fr: "Chaîne de longueur variable, 1 à 4 000 caractères", en: "Variable-length string, 1 to 4,000 characters" },
              ],
              [
                { fr: "CHAR(n)", en: "CHAR(n)" },
                { fr: "Longueur fixe, complétée par des espaces", en: "Fixed length, blank-padded" },
              ],
              [
                { fr: "CLOB", en: "CLOB" },
                { fr: "Texte volumineux, jusqu'à 4 Go", en: "Large text, up to 4 GB" },
              ],
              [
                { fr: "DATE", en: "DATE" },
                { fr: "Date et heure à la seconde près", en: "Date and time to the second" },
              ],
              [
                { fr: "TIMESTAMP", en: "TIMESTAMP" },
                { fr: "Date et heure avec fractions de seconde", en: "Date and time with fractional seconds" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "CHAR complète avec des espaces jusqu'à la longueur déclarée : 'AB' stocké dans un CHAR(5) devient 'AB   '. Une comparaison avec un VARCHAR2 peut alors échouer là où on l'attendait vraie.",
              en: "CHAR blank-pads up to the declared length: 'AB' stored in a CHAR(5) becomes 'AB   '. A comparison against a VARCHAR2 can then fail where you expected it to hold.",
            },
          },
        ],
      },
      {
        id: "1-4",
        number: "1.4",
        title: { fr: "Fonctions mono-ligne", en: "Single-row functions" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Fonctions numériques", en: "Numeric functions" },
            code: `SELECT
  ROUND(45.926, 2)  AS arrondi,        -- 45.93
  TRUNC(45.926, 2)  AS troncature,     -- 45.92
  MOD(10, 3)        AS modulo,         -- 1
  CEIL(45.2)        AS plafond,        -- 46
  FLOOR(45.9)       AS plancher,       -- 45
  ABS(-15)          AS valeur_absolue, -- 15
  POWER(2, 3)       AS puissance       -- 8
FROM DUAL;`,
          },
          {
            kind: "code",
            title: { fr: "Fonctions de chaînes", en: "Character functions" },
            code: `SELECT
  UPPER('oracle')                            AS majuscule,   -- ORACLE
  LOWER('ORACLE')                            AS minuscule,   -- oracle
  INITCAP('john doe')                        AS initiales,   -- John Doe
  CONCAT('Hello ', 'World')                  AS concat,      -- Hello World
  'Hello ' || 'World'                        AS operateur,   -- Hello World
  SUBSTR('Oracle Database', 8, 8)            AS sous_chaine, -- Database
  LENGTH('Oracle')                           AS longueur,    -- 6
  INSTR('Oracle', 'a')                       AS position,    -- 3
  LPAD('5', 3, '0')                          AS pad_gauche,  -- 005
  RPAD('5', 3, '0')                          AS pad_droit,   -- 500
  TRIM('  Hello  ')                          AS trim,        -- Hello
  REPLACE('Hello World', 'World', 'Oracle')  AS remplacement -- Hello Oracle
FROM DUAL;`,
          },
          {
            kind: "code",
            title: { fr: "Fonctions de date", en: "Date functions" },
            code: `SELECT
  SYSDATE                                        AS date_actuelle,
  CURRENT_DATE                                   AS date_session,
  ADD_MONTHS(SYSDATE, 3)                         AS plus_3_mois,
  MONTHS_BETWEEN(DATE '2024-12-15',
                 DATE '2024-01-15')              AS mois_entre_dates,
  LAST_DAY(SYSDATE)                              AS dernier_jour_mois,
  NEXT_DAY(SYSDATE, 'MONDAY')                    AS prochain_lundi,
  ROUND(SYSDATE, 'MM')                           AS arrondi_mois,
  TRUNC(SYSDATE, 'YYYY')                         AS troncature_annee,
  EXTRACT(YEAR  FROM SYSDATE)                    AS annee,
  EXTRACT(MONTH FROM SYSDATE)                    AS mois
FROM DUAL;`,
            caption: {
              fr: "MONTHS_BETWEEN renvoie un décimal : arrondissez-le si vous affichez un nombre de mois entier.",
              en: "MONTHS_BETWEEN returns a decimal: round it if you display a whole number of months.",
            },
          },
        ],
      },
      {
        id: "1-5",
        number: "1.5",
        title: { fr: "Conversion et gestion des NULL", en: "Conversion and NULL handling" },
        blocks: [
          {
            kind: "code",
            title: { fr: "TO_CHAR — vers du texte", en: "TO_CHAR — to text" },
            code: `-- Nombres
SELECT
  TO_CHAR(1234.56, '999,999.99')    AS format_standard, -- 1,234.56
  TO_CHAR(1234.56, '000000.000')    AS zeros_devant,    -- 001234.560
  TO_CHAR(-1234.56, '999,999.99MI') AS signe_apres      -- 1,234.56-
FROM DUAL;

-- Dates
SELECT
  TO_CHAR(SYSDATE, 'DD/MM/YYYY')          AS format_francais,
  TO_CHAR(SYSDATE, 'YYYY-MM-DD')          AS format_international,
  TO_CHAR(SYSDATE, 'Day, DD Month YYYY')  AS format_long,
  TO_CHAR(SYSDATE, 'HH24:MI:SS')          AS heure_24,
  TO_CHAR(SYSDATE, 'HH:MI:SS AM')         AS heure_12
FROM DUAL;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Si le modèle de format est trop court pour le nombre, Oracle remplit toute la largeur de dièses (####). Prévoyez aussi une position pour le signe si des valeurs négatives sont possibles.",
              en: "If the format model is too short for the number, Oracle fills the whole width with hashes (####). Also allow a position for the sign if negative values are possible.",
            },
          },
          {
            kind: "code",
            title: { fr: "TO_NUMBER et TO_DATE", en: "TO_NUMBER and TO_DATE" },
            code: `SELECT TO_NUMBER('1,234.56', '9,999.99') AS nombre FROM DUAL;

SELECT
  TO_DATE('25/12/2024', 'DD/MM/YYYY')                     AS date1,
  TO_DATE('2024-12-25 14:30', 'YYYY-MM-DD HH24:MI')       AS date2
FROM DUAL;`,
            caption: {
              fr: "Les modèles de format sont en anglais : DD, MM, YYYY — jamais JJ ni AAAA.",
              en: "Format models are English: DD, MM, YYYY — never JJ or AAAA.",
            },
          },
          {
            kind: "code",
            title: { fr: "Fonctions de gestion des NULL", en: "NULL-handling functions" },
            code: `SELECT
  NVL(salaire, 0)                                   AS salaire_par_defaut,
  NVL2(commission, salaire + commission, salaire)   AS salaire_total,
  COALESCE(telephone, mobile, 'Non renseigné')      AS contact,
  NULLIF(objectif, realise)                         AS ecart_nul_si_egal
FROM employes;`,
          },
          {
            kind: "tip",
            body: {
              fr: "NVL prend deux arguments de types compatibles. NVL2 en prend trois : valeur testée, résultat si NON NULL, résultat si NULL. COALESCE renvoie la première expression non NULL de la liste. NULLIF renvoie NULL si les deux arguments sont égaux.",
              en: "NVL takes two arguments of compatible types. NVL2 takes three: the tested value, the result when NOT NULL, the result when NULL. COALESCE returns the first non-NULL expression in the list. NULLIF returns NULL when both arguments are equal.",
            },
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-2",
    number: 2,
    title: { fr: "Requêtes avancées", en: "Advanced queries" },
    summary: {
      fr: "Filtrage, tri, agrégation avec GROUP BY et HAVING, puis toutes les formes de jointures.",
      en: "Filtering, sorting, aggregation with GROUP BY and HAVING, then every form of join.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "2-1",
        number: "2.1",
        title: { fr: "Filtrage avec WHERE", en: "Filtering with WHERE" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Opérateurs de comparaison", en: "Comparison operators" },
            headers: [
              { fr: "Opérateur", en: "Operator" },
              { fr: "Signification", en: "Meaning" },
            ],
            rows: [
              [{ fr: "=", en: "=" }, { fr: "Égal à", en: "Equal to" }],
              [{ fr: "!=  ou  <>", en: "!=  or  <>" }, { fr: "Différent de", en: "Not equal to" }],
              [{ fr: ">   /   >=", en: ">   /   >=" }, { fr: "Supérieur / supérieur ou égal", en: "Greater / greater or equal" }],
              [{ fr: "<   /   <=", en: "<   /   <=" }, { fr: "Inférieur / inférieur ou égal", en: "Less / less or equal" }],
            ],
          },
          {
            kind: "table",
            title: { fr: "Opérateurs spéciaux", en: "Special operators" },
            headers: [
              { fr: "Opérateur", en: "Operator" },
              { fr: "Rôle", en: "Purpose" },
              { fr: "Exemple", en: "Example" },
            ],
            rows: [
              [
                { fr: "BETWEEN … AND …", en: "BETWEEN … AND …" },
                { fr: "Plage, bornes incluses", en: "Range, bounds included" },
                { fr: "salaire BETWEEN 3000 AND 5000", en: "salaire BETWEEN 3000 AND 5000" },
              ],
              [
                { fr: "IN (…)", en: "IN (…)" },
                { fr: "Appartenance à une liste", en: "Membership in a list" },
                { fr: "service_id IN (10, 20, 30)", en: "service_id IN (10, 20, 30)" },
              ],
              [
                { fr: "LIKE", en: "LIKE" },
                { fr: "Motif : % = 0..n caractères, _ = 1 caractère", en: "Pattern: % = 0..n characters, _ = exactly 1" },
                { fr: "nom LIKE 'D%'", en: "nom LIKE 'D%'" },
              ],
              [
                { fr: "IS NULL / IS NOT NULL", en: "IS NULL / IS NOT NULL" },
                { fr: "Test de valeur absente", en: "Test for a missing value" },
                { fr: "commission IS NULL", en: "commission IS NULL" },
              ],
            ],
          },
          {
            kind: "warning",
            title: { fr: "Le piège NULL", en: "The NULL trap" },
            body: {
              fr: "NULL n'est égal à rien, pas même à NULL. WHERE commission = NULL ne renvoie jamais aucune ligne : le seul test valide est IS NULL.",
              en: "NULL equals nothing, not even NULL. WHERE commission = NULL never returns a row: the only valid test is IS NULL.",
            },
          },
          {
            kind: "code",
            title: { fr: "Combiner les conditions", en: "Combining conditions" },
            code: `SELECT * FROM employes
WHERE  (service = 'IT' AND salaire > 3000)
   OR  (service = 'RH' AND salaire > 2500);

-- Priorité : NOT, puis AND, puis OR.
-- Les parenthèses lèvent toute ambiguïté — utilisez-les systématiquement.`,
          },
        ],
      },
      {
        id: "2-2",
        number: "2.2",
        title: { fr: "Tri avec ORDER BY", en: "Sorting with ORDER BY" },
        blocks: [
          {
            kind: "code",
            code: `SELECT nom, prenom, salaire, service
FROM   employes
ORDER BY
  service ASC,   -- ascendant (valeur par défaut)
  salaire DESC,  -- descendant
  3;             -- par position dans le SELECT`,
          },
          {
            kind: "tip",
            body: {
              fr: "ORDER BY est évalué en dernier : il voit donc les alias du SELECT, accepte une position numérique, et peut trier sur une colonne absente de la projection. Par défaut les NULL passent en dernier en ordre croissant et en premier en ordre décroissant — NULLS FIRST et NULLS LAST permettent de forcer le comportement.",
              en: "ORDER BY runs last: it therefore sees the SELECT aliases, accepts a numeric position, and can sort on a column that is not projected. By default NULLs come last in ascending order and first in descending order — NULLS FIRST and NULLS LAST let you force the behaviour.",
            },
          },
        ],
      },
      {
        id: "2-3",
        number: "2.3",
        title: { fr: "Agrégation, GROUP BY et HAVING", en: "Aggregation, GROUP BY and HAVING" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Fonctions de groupe", en: "Group functions" },
            code: `SELECT
  COUNT(*)                 AS total_lignes,   -- compte les lignes
  COUNT(id)                AS id_non_nuls,    -- ignore les NULL
  COUNT(DISTINCT service)  AS services_uniques,
  AVG(salaire)             AS salaire_moyen,
  SUM(salaire)             AS masse_salariale,
  MAX(salaire)             AS salaire_max,
  MIN(salaire)             AS salaire_min
FROM employes;`,
          },
          {
            kind: "code",
            title: { fr: "Regroupement puis filtrage des groupes", en: "Grouping then filtering groups" },
            code: `SELECT
  service,
  COUNT(*)     AS effectif,
  AVG(salaire) AS salaire_moyen
FROM   employes
GROUP  BY service
HAVING COUNT(*) > 5 AND AVG(salaire) > 3000;`,
          },
          {
            kind: "warning",
            title: { fr: "WHERE ou HAVING ?", en: "WHERE or HAVING?" },
            body: {
              fr: "WHERE filtre les lignes AVANT le regroupement et n'accepte aucune fonction de groupe. HAVING filtre les groupes APRÈS le regroupement et n'accepte que des expressions de groupe. Par ailleurs, toute colonne du SELECT non encapsulée dans une fonction de groupe doit figurer dans le GROUP BY.",
              en: "WHERE filters rows BEFORE grouping and accepts no group function. HAVING filters groups AFTER grouping and only accepts group expressions. Also, every SELECT column not wrapped in a group function must appear in the GROUP BY.",
            },
          },
          {
            kind: "compare",
            title: { fr: "Le piège classique", en: "The classic trap" },
            wrong: `SELECT service, nom, AVG(salaire)
FROM   employes
GROUP  BY service;`,
            right: `SELECT service, AVG(salaire)
FROM   employes
GROUP  BY service;`,
            note: {
              fr: "nom n'est ni agrégé ni présent dans le GROUP BY : Oracle lève ORA-00979.",
              en: "nom is neither aggregated nor in the GROUP BY: Oracle raises ORA-00979.",
            },
          },
        ],
      },
      {
        id: "2-4",
        number: "2.4",
        title: { fr: "Jointures de tables", en: "Table joins" },
        blocks: [
          {
            kind: "code",
            title: { fr: "INNER JOIN — uniquement les correspondances", en: "INNER JOIN — matches only" },
            code: `SELECT e.nom, e.prenom, d.nom_service
FROM   employes e
INNER JOIN services d ON e.service_id = d.id;`,
          },
          {
            kind: "code",
            title: { fr: "LEFT / RIGHT / FULL OUTER JOIN", en: "LEFT / RIGHT / FULL OUTER JOIN" },
            code: `-- Toutes les lignes de gauche, même sans correspondance
SELECT e.nom, d.nom_service
FROM   employes e LEFT JOIN services d ON e.service_id = d.id;

-- Toutes les lignes de droite
SELECT e.nom, d.nom_service
FROM   employes e RIGHT JOIN services d ON e.service_id = d.id;

-- Toutes les lignes des deux tables
SELECT e.nom, d.nom_service
FROM   employes e FULL JOIN services d ON e.service_id = d.id;`,
          },
          {
            kind: "code",
            title: { fr: "Jointures multiples et auto-jointure", en: "Multiple joins and self-join" },
            code: `SELECT
  e.nom  AS employe,
  d.nom_service,
  p.nom_projet,
  m.nom  AS manager
FROM   employes e
INNER JOIN services d ON e.service_id = d.id
LEFT  JOIN projets  p ON e.projet_id  = p.id
LEFT  JOIN employes m ON e.manager_id = m.id;  -- auto-jointure : alias obligatoires`,
          },
          {
            kind: "code",
            title: { fr: "USING et NATURAL JOIN", en: "USING and NATURAL JOIN" },
            code: `-- USING : colonnes de même nom, listées entre parenthèses, jamais préfixées
SELECT e.nom, d.nom_service
FROM   employes e JOIN services d USING (service_id);

-- NATURAL JOIN : joint automatiquement sur TOUTES les colonnes de même nom
SELECT e.nom, d.nom_service
FROM   employes e NATURAL JOIN services d;`,
          },
          {
            kind: "warning",
            body: {
              fr: "NATURAL JOIN est à proscrire en production : l'ajout ultérieur d'une colonne de même nom dans les deux tables change silencieusement la condition de jointure. Une jointure ON explicite reste stable dans le temps.",
              en: "Avoid NATURAL JOIN in production: later adding a same-named column to both tables silently changes the join condition. An explicit ON join stays stable over time.",
            },
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-3",
    number: 3,
    title: { fr: "Intégrité des données", en: "Data integrity" },
    summary: {
      fr: "Création de tables, les cinq contraintes d'intégrité, modification de structure et suppression de données.",
      en: "Creating tables, the five integrity constraints, altering structure and removing data.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "3-1",
        number: "3.1",
        title: { fr: "Création de tables", en: "Creating tables" },
        blocks: [
          {
            kind: "code",
            code: `CREATE TABLE clients (
  id             NUMBER        PRIMARY KEY,
  nom            VARCHAR2(50)  NOT NULL,
  prenom         VARCHAR2(50),
  email          VARCHAR2(100),
  date_naissance DATE,
  solde          NUMBER(10,2)  DEFAULT 0,
  date_creation  DATE          DEFAULT SYSDATE
);`,
          },
          {
            kind: "tip",
            body: {
              fr: "DEFAULT s'écrit sans signe égal et précède les contraintes de colonne. Une valeur DEFAULT ne s'applique que si la colonne est absente de l'INSERT — pas si l'on y insère explicitement NULL.",
              en: "DEFAULT is written without an equals sign and comes before column constraints. A DEFAULT value only applies when the column is omitted from the INSERT — not when NULL is inserted explicitly.",
            },
          },
        ],
      },
      {
        id: "3-2",
        number: "3.2",
        title: { fr: "Les contraintes d'intégrité", en: "Integrity constraints" },
        blocks: [
          {
            kind: "code",
            title: { fr: "PRIMARY KEY — en ligne, en bloc, composite", en: "PRIMARY KEY — inline, out-of-line, composite" },
            code: `-- En ligne
CREATE TABLE employes (
  id  NUMBER PRIMARY KEY,
  nom VARCHAR2(50)
);

-- En bloc (permet de nommer la contrainte)
CREATE TABLE employes (
  id  NUMBER,
  nom VARCHAR2(50),
  CONSTRAINT pk_employes PRIMARY KEY (id)
);

-- Composite : obligatoirement en bloc
CREATE TABLE inscriptions (
  etudiant_id      NUMBER,
  cours_id         NUMBER,
  date_inscription DATE,
  CONSTRAINT pk_inscriptions PRIMARY KEY (etudiant_id, cours_id)
);`,
          },
          {
            kind: "code",
            title: { fr: "FOREIGN KEY", en: "FOREIGN KEY" },
            code: `CREATE TABLE commandes (
  id            NUMBER PRIMARY KEY,
  client_id     NUMBER,
  date_commande DATE,
  CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Action à la suppression du parent
CREATE TABLE employes (
  id         NUMBER PRIMARY KEY,
  service_id NUMBER,
  CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id)
    ON DELETE CASCADE      -- ou ON DELETE SET NULL
);`,
            caption: {
              fr: "Une clé étrangère doit référencer une colonne PRIMARY KEY ou UNIQUE — y compris dans la même table (hiérarchie manager_id → id).",
              en: "A foreign key must reference a PRIMARY KEY or UNIQUE column — including in the same table (manager_id → id hierarchy).",
            },
          },
          {
            kind: "code",
            title: { fr: "NOT NULL, UNIQUE et CHECK", en: "NOT NULL, UNIQUE and CHECK" },
            code: `CREATE TABLE utilisateurs (
  id    NUMBER PRIMARY KEY,
  nom   VARCHAR2(100) NOT NULL,
  email VARCHAR2(100) UNIQUE,               -- plusieurs NULL autorisés
  login VARCHAR2(50),
  CONSTRAINT uk_login UNIQUE (login)
);

CREATE TABLE employes (
  id            NUMBER PRIMARY KEY,
  salaire       NUMBER  CHECK (salaire > 0),
  genre         CHAR(1) CHECK (genre IN ('M', 'F')),
  age           NUMBER  CONSTRAINT ck_age CHECK (age BETWEEN 18 AND 65)
);`,
          },
          {
            kind: "table",
            title: { fr: "Les cinq contraintes en un coup d'œil", en: "The five constraints at a glance" },
            headers: [
              { fr: "Contrainte", en: "Constraint" },
              { fr: "Garantit", en: "Guarantees" },
              { fr: "NULL autorisé ?", en: "NULL allowed?" },
            ],
            rows: [
              [
                { fr: "PRIMARY KEY", en: "PRIMARY KEY" },
                { fr: "Unicité + non NULL, une seule par table", en: "Uniqueness + not null, one per table" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "UNIQUE", en: "UNIQUE" },
                { fr: "Unicité des valeurs renseignées", en: "Uniqueness of supplied values" },
                { fr: "Oui, plusieurs", en: "Yes, several" },
              ],
              [
                { fr: "FOREIGN KEY", en: "FOREIGN KEY" },
                { fr: "Intégrité référentielle", en: "Referential integrity" },
                { fr: "Oui", en: "Yes" },
              ],
              [
                { fr: "NOT NULL", en: "NOT NULL" },
                { fr: "Valeur obligatoire", en: "Value required" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "CHECK", en: "CHECK" },
                { fr: "Condition booléenne sur la ligne", en: "Boolean condition on the row" },
                { fr: "Oui", en: "Yes" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Une contrainte CHECK ne peut appeler ni fonction non déterministe (SYSDATE, USER), ni sous-requête, ni pseudo-colonne. Toute contrainte peut en revanche être désactivée puis réactivée par ALTER TABLE … DISABLE / ENABLE CONSTRAINT.",
              en: "A CHECK constraint cannot call a non-deterministic function (SYSDATE, USER), a subquery, or a pseudocolumn. Any constraint can however be disabled and re-enabled with ALTER TABLE … DISABLE / ENABLE CONSTRAINT.",
            },
          },
        ],
      },
      {
        id: "3-3",
        number: "3.3",
        title: { fr: "Modification de structure", en: "Altering structure" },
        blocks: [
          {
            kind: "code",
            code: `-- Ajouter une colonne (pas de mot-clé COLUMN après ADD)
ALTER TABLE employes ADD (telephone VARCHAR2(20));

-- Modifier une colonne
ALTER TABLE employes MODIFY (nom VARCHAR2(100));

-- Supprimer une colonne
ALTER TABLE employes DROP COLUMN telephone;

-- Marquer inutilisée sans libérer l'espace tout de suite
ALTER TABLE employes SET UNUSED (telephone);
ALTER TABLE employes DROP UNUSED COLUMNS;

-- Renommer
ALTER TABLE employes RENAME COLUMN nom TO nom_famille;

-- Contraintes
ALTER TABLE employes ADD  CONSTRAINT uk_email UNIQUE (email);
ALTER TABLE employes DROP CONSTRAINT uk_email;`,
          },
          {
            kind: "tip",
            body: {
              fr: "ADD prend la définition entre parenthèses et sans le mot-clé COLUMN, contrairement à d'autres SGBD. DROP COLUMN, lui, exige COLUMN. Une nouvelle colonne est toujours ajoutée en dernière position.",
              en: "ADD takes the definition in parentheses and without the COLUMN keyword, unlike other DBMSs. DROP COLUMN does require COLUMN. A new column is always appended last.",
            },
          },
        ],
      },
      {
        id: "3-4",
        number: "3.4",
        title: { fr: "DELETE, TRUNCATE et DROP", en: "DELETE, TRUNCATE and DROP" },
        blocks: [
          {
            kind: "code",
            code: `-- DELETE (DML) : lignes ciblées, annulable par ROLLBACK
DELETE FROM employes WHERE service = 'RH';

-- TRUNCATE (DDL) : vide la table, auto-validé, non annulable
TRUNCATE TABLE employes;

-- DROP (DDL) : supprime la table et sa structure
DROP TABLE employes;          -- récupérable via la corbeille
DROP TABLE employes PURGE;    -- définitif`,
          },
          {
            kind: "table",
            headers: [
              { fr: "Commande", en: "Statement" },
              { fr: "Type", en: "Type" },
              { fr: "WHERE", en: "WHERE" },
              { fr: "Annulable", en: "Rollback-able" },
              { fr: "Triggers", en: "Triggers" },
            ],
            rows: [
              [
                { fr: "DELETE", en: "DELETE" },
                { fr: "DML", en: "DML" },
                { fr: "Oui", en: "Yes" },
                { fr: "Oui", en: "Yes" },
                { fr: "Déclenchés", en: "Fired" },
              ],
              [
                { fr: "TRUNCATE", en: "TRUNCATE" },
                { fr: "DDL", en: "DDL" },
                { fr: "Non", en: "No" },
                { fr: "Non", en: "No" },
                { fr: "Non déclenchés", en: "Not fired" },
              ],
              [
                { fr: "DROP", en: "DROP" },
                { fr: "DDL", en: "DDL" },
                { fr: "Non", en: "No" },
                { fr: "Non", en: "No" },
                { fr: "Supprimés", en: "Dropped" },
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-4",
    number: 4,
    title: { fr: "Vues et fonctions avancées", en: "Views and advanced functions" },
    summary: {
      fr: "Vues, opérateurs ensemblistes, MERGE et fonctions analytiques avec la clause OVER.",
      en: "Views, set operators, MERGE and analytic functions with the OVER clause.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "4-1",
        number: "4.1",
        title: { fr: "Les vues", en: "Views" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Création et utilisation", en: "Creating and using" },
            code: `CREATE OR REPLACE VIEW vue_employes_service AS
SELECT e.id, e.nom AS employe, e.prenom, e.salaire,
       d.nom_service AS service, m.nom AS manager
FROM   employes e
JOIN   services d ON e.service_id = d.id
LEFT   JOIN employes m ON e.manager_id = m.id
WHERE  e.salaire > 3000;

-- S'interroge exactement comme une table
SELECT * FROM vue_employes_service
WHERE  service = 'IT'
ORDER  BY salaire DESC;`,
          },
          {
            kind: "code",
            title: { fr: "WITH CHECK OPTION", en: "WITH CHECK OPTION" },
            code: `CREATE OR REPLACE VIEW vue_hauts_salaires AS
SELECT id, nom, salaire
FROM   employes
WHERE  salaire > 5000
WITH CHECK OPTION CONSTRAINT ck_vue_salaire;`,
            caption: {
              fr: "Empêche d'insérer ou de modifier une ligne qui sortirait du périmètre de la vue. WITH READ ONLY, à l'inverse, interdit toute modification.",
              en: "Prevents inserting or updating a row that would fall outside the view. WITH READ ONLY, conversely, forbids any modification.",
            },
          },
          {
            kind: "tip",
            body: {
              fr: "Une vue n'est modifiable que si elle est « simple » : une seule table de base, sans fonction de groupe, GROUP BY, DISTINCT, ROWNUM ni opérateur ensembliste. Les autres cas exigent un trigger INSTEAD OF.",
              en: "A view is only updatable when it is “simple”: a single base table, with no group function, GROUP BY, DISTINCT, ROWNUM or set operator. Anything else requires an INSTEAD OF trigger.",
            },
          },
        ],
      },
      {
        id: "4-2",
        number: "4.2",
        title: { fr: "Opérateurs ensemblistes", en: "Set operators" },
        blocks: [
          {
            kind: "code",
            code: `-- UNION : fusionne et élimine les doublons
SELECT nom FROM clients_paris
UNION
SELECT nom FROM clients_lyon;

-- UNION ALL : conserve les doublons (plus rapide, pas de tri)
SELECT nom FROM clients_2023
UNION ALL
SELECT nom FROM clients_2024;

-- INTERSECT : lignes communes
SELECT nom FROM clients_actifs
INTERSECT
SELECT nom FROM clients_premium;

-- MINUS : lignes de la première absentes de la seconde
SELECT nom FROM clients_paris
MINUS
SELECT nom FROM clients_fideles;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Les requêtes doivent avoir le même nombre de colonnes, avec des types compatibles. Un seul ORDER BY est autorisé, obligatoirement après la dernière requête : il porte sur le résultat global et désigne les colonnes par le nom du premier SELECT ou par leur position. L'ordre compte pour MINUS, pas pour UNION ni INTERSECT.",
              en: "The queries must have the same number of columns, with compatible types. Only one ORDER BY is allowed, necessarily after the last query: it applies to the whole result and names columns using the first SELECT's names or their position. Order matters for MINUS, not for UNION or INTERSECT.",
            },
          },
        ],
      },
      {
        id: "4-3",
        number: "4.3",
        title: { fr: "MERGE — insertion et mise à jour conditionnelles", en: "MERGE — conditional insert and update" },
        blocks: [
          {
            kind: "code",
            code: `MERGE INTO employes_cible t
USING employes_source s ON (t.id = s.id)
WHEN MATCHED THEN
  UPDATE SET t.salaire  = s.salaire,
             t.service  = s.service,
             t.date_maj = SYSDATE
WHEN NOT MATCHED THEN
  INSERT (id, nom, salaire, service, date_embauche)
  VALUES (s.id, s.nom, s.salaire, s.service, SYSDATE);`,
            caption: {
              fr: "Un seul parcours de la source suffit : c'est l'instruction de référence pour les chargements incrémentaux.",
              en: "A single pass over the source is enough: this is the go-to statement for incremental loads.",
            },
          },
        ],
      },
      {
        id: "4-4",
        number: "4.4",
        title: { fr: "Fonctions analytiques", en: "Analytic functions" },
        blocks: [
          {
            kind: "code",
            title: { fr: "La clause OVER()", en: "The OVER() clause" },
            code: `SELECT
  nom, salaire, service,
  AVG(salaire) OVER (PARTITION BY service)               AS moyenne_service,
  salaire - AVG(salaire) OVER (PARTITION BY service)     AS ecart_moyenne
FROM employes;`,
            caption: {
              fr: "Contrairement à GROUP BY, une fonction analytique conserve toutes les lignes du résultat.",
              en: "Unlike GROUP BY, an analytic function keeps every row of the result.",
            },
          },
          {
            kind: "code",
            title: { fr: "Fonctions de classement", en: "Ranking functions" },
            code: `SELECT
  nom, salaire, service,
  ROW_NUMBER() OVER (ORDER BY salaire DESC)                       AS rang_absolu,
  RANK()       OVER (PARTITION BY service ORDER BY salaire DESC)  AS rang_service,
  DENSE_RANK() OVER (ORDER BY salaire DESC)                       AS rang_dense,
  NTILE(4)     OVER (ORDER BY salaire DESC)                       AS quartile
FROM employes;`,
            caption: {
              fr: "RANK laisse des trous après une égalité (1, 1, 3) ; DENSE_RANK n'en laisse pas (1, 1, 2) ; ROW_NUMBER n'a jamais d'ex æquo.",
              en: "RANK leaves gaps after a tie (1, 1, 3); DENSE_RANK does not (1, 1, 2); ROW_NUMBER never ties.",
            },
          },
          {
            kind: "code",
            title: { fr: "LAG et LEAD", en: "LAG and LEAD" },
            code: `SELECT
  mois, ventes,
  LAG(ventes, 1, 0)  OVER (ORDER BY mois) AS ventes_mois_precedent,
  LEAD(ventes, 1)    OVER (ORDER BY mois) AS ventes_mois_suivant,
  ROUND(
    (ventes - LAG(ventes, 1, ventes) OVER (ORDER BY mois))
    / NULLIF(LAG(ventes, 1, ventes) OVER (ORDER BY mois), 0) * 100, 2
  ) AS croissance_pct
FROM ventes_mensuelles;`,
          },
          {
            kind: "code",
            title: { fr: "Fenêtres glissantes", en: "Sliding windows" },
            code: `SELECT
  nom, mois, ventes,
  SUM(ventes) OVER (PARTITION BY nom ORDER BY mois
                    ROWS UNBOUNDED PRECEDING)               AS cumul_annuel,
  AVG(ventes) OVER (PARTITION BY nom ORDER BY mois
                    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3m,
  FIRST_VALUE(ventes) OVER (PARTITION BY nom
                            ORDER BY ventes DESC)            AS meilleure_vente
FROM ventes_vendeurs;`,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-5",
    number: 5,
    title: { fr: "Requêtes complexes", en: "Complex queries" },
    summary: {
      fr: "Clause WITH et CTE récursives, toutes les formes de sous-requêtes, et l'analyse Top-N.",
      en: "The WITH clause and recursive CTEs, every form of subquery, and Top-N analysis.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "5-1",
        number: "5.1",
        title: { fr: "La clause WITH (CTE)", en: "The WITH clause (CTE)" },
        blocks: [
          {
            kind: "code",
            title: { fr: "CTE simple", en: "Simple CTE" },
            code: `WITH employes_bien_payes AS (
  SELECT nom, salaire, service
  FROM   employes
  WHERE  salaire > 5000
)
SELECT * FROM employes_bien_payes
WHERE  service = 'IT'
ORDER  BY salaire DESC;`,
          },
          {
            kind: "code",
            title: { fr: "CTE multiples", en: "Multiple CTEs" },
            code: `WITH
services_actifs AS (
  SELECT id, nom_service FROM services WHERE budget > 100000
),
employes_service AS (
  SELECT e.nom, e.salaire, d.nom_service
  FROM   employes e
  JOIN   services_actifs d ON e.service_id = d.id
),
statistiques AS (
  SELECT nom_service, COUNT(*) AS effectif, AVG(salaire) AS salaire_moyen
  FROM   employes_service
  GROUP  BY nom_service
)
SELECT * FROM statistiques
WHERE  effectif > 5
ORDER  BY salaire_moyen DESC;`,
            caption: {
              fr: "Chaque CTE peut référencer les précédentes : la requête se lit de haut en bas, comme une suite d'étapes.",
              en: "Each CTE can reference the previous ones: the query reads top to bottom, like a series of steps.",
            },
          },
          {
            kind: "code",
            title: { fr: "CTE récursive — hiérarchie", en: "Recursive CTE — hierarchy" },
            code: `WITH hierarchie (niveau, id, nom, manager_id, chemin) AS (
  -- Ancrage : le sommet de la hiérarchie
  SELECT 0, id, nom, manager_id, CAST(nom AS VARCHAR2(1000))
  FROM   employes
  WHERE  manager_id IS NULL
  UNION ALL
  -- Récursion : les subordonnés
  SELECT h.niveau + 1, e.id, e.nom, e.manager_id, h.chemin || ' -> ' || e.nom
  FROM   employes e
  JOIN   hierarchie h ON e.manager_id = h.id
)
SELECT LPAD(' ', niveau * 3) || nom AS organigramme, niveau, chemin
FROM   hierarchie
ORDER  BY chemin;`,
          },
        ],
      },
      {
        id: "5-2",
        number: "5.2",
        title: { fr: "Sous-requêtes", en: "Subqueries" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Dans la clause WHERE", en: "In the WHERE clause" },
            code: `-- Scalaire : renvoie une seule valeur
SELECT nom, salaire FROM employes
WHERE  salaire > (SELECT AVG(salaire) FROM employes);

-- Multi-lignes avec IN
SELECT nom, service FROM employes
WHERE  service_id IN (SELECT id FROM services WHERE budget > 50000);

-- EXISTS : teste la simple présence d'une ligne
SELECT nom FROM employes e
WHERE  EXISTS (
  SELECT 1 FROM projets p
  WHERE  p.chef_id = e.id AND p.date_fin > SYSDATE
);`,
          },
          {
            kind: "code",
            title: { fr: "Sous-requête corrélée", en: "Correlated subquery" },
            code: `-- Employés mieux payés que la moyenne de LEUR service
SELECT nom, salaire, service
FROM   employes e1
WHERE  salaire > (
  SELECT AVG(salaire) FROM employes e2
  WHERE  e2.service_id = e1.service_id
);`,
            caption: {
              fr: "Elle référence la requête externe et est donc réévaluée pour chaque ligne candidate.",
              en: "It references the outer query and is therefore re-evaluated for every candidate row.",
            },
          },
          {
            kind: "code",
            title: { fr: "Vue en ligne (clause FROM)", en: "Inline view (FROM clause)" },
            code: `SELECT stats.nom_service, stats.salaire_moyen
FROM (
  SELECT d.nom_service, AVG(e.salaire) AS salaire_moyen
  FROM   employes e
  JOIN   services d ON e.service_id = d.id
  GROUP  BY d.nom_service
) stats
WHERE stats.salaire_moyen > 4000;`,
          },
          {
            kind: "table",
            title: { fr: "Opérateurs et cardinalité attendue", en: "Operators and expected cardinality" },
            headers: [
              { fr: "Opérateur", en: "Operator" },
              { fr: "Cardinalité de la sous-requête", en: "Subquery cardinality" },
            ],
            rows: [
              [
                { fr: "= , > , <  (seuls)", en: "= , > , <  (alone)" },
                { fr: "Une seule ligne — sinon ORA-01427", en: "One row only — otherwise ORA-01427" },
              ],
              [
                { fr: "IN , NOT IN", en: "IN , NOT IN" },
                { fr: "Plusieurs lignes", en: "Multiple rows" },
              ],
              [
                { fr: "> ANY  /  > ALL", en: "> ANY  /  > ALL" },
                { fr: "Plusieurs lignes — ANY = « > minimum », ALL = « > maximum »", en: "Multiple rows — ANY = “> minimum”, ALL = “> maximum”" },
              ],
              [
                { fr: "EXISTS", en: "EXISTS" },
                { fr: "Quelconque : seule la présence compte", en: "Any — only presence matters" },
              ],
            ],
          },
        ],
      },
      {
        id: "5-3",
        number: "5.3",
        title: { fr: "Analyse Top-N et pagination", en: "Top-N analysis and pagination" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "ROWNUM : le piège de l'ordre", en: "ROWNUM: the ordering trap" },
            wrong: `SELECT * FROM employes
WHERE  ROWNUM <= 5
ORDER  BY salaire DESC;`,
            right: `SELECT * FROM (
  SELECT * FROM employes ORDER BY salaire DESC
) WHERE ROWNUM <= 5;`,
            note: {
              fr: "ROWNUM est affecté avant le tri : la première écriture prend 5 lignes au hasard puis les trie. Il faut trier dans une sous-requête, puis limiter.",
              en: "ROWNUM is assigned before sorting: the first form takes 5 arbitrary rows and then sorts them. Sort in a subquery first, then limit.",
            },
          },
          {
            kind: "code",
            title: { fr: "Pagination moderne", en: "Modern pagination" },
            code: `-- Avec ROW_NUMBER()
SELECT * FROM (
  SELECT nom, salaire,
         ROW_NUMBER() OVER (ORDER BY salaire DESC) AS rang
  FROM   employes
) WHERE rang BETWEEN 11 AND 20;

-- Depuis 12c : la clause de limitation de lignes
SELECT nom, salaire
FROM   employes
ORDER  BY salaire DESC
OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;`,
            caption: {
              fr: "FETCH FIRST n [PERCENT] ROWS [ONLY | WITH TIES] se place après ORDER BY. LIMIT et TOP n'existent pas en Oracle.",
              en: "FETCH FIRST n [PERCENT] ROWS [ONLY | WITH TIES] goes after ORDER BY. LIMIT and TOP do not exist in Oracle.",
            },
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    id: "session-6",
    number: 6,
    title: { fr: "Administration et objets", en: "Administration and objects" },
    summary: {
      fr: "Séquences, dictionnaire de données, index, sécurité (utilisateurs, privilèges, rôles) et types temporels avancés.",
      en: "Sequences, the data dictionary, indexes, security (users, privileges, roles) and advanced temporal types.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "6-1",
        number: "6.1",
        title: { fr: "Séquences", en: "Sequences" },
        blocks: [
          {
            kind: "code",
            code: `CREATE SEQUENCE seq_clients
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  MAXVALUE 999999
  CACHE 20
  NOCYCLE;

INSERT INTO clients (id, nom) VALUES (seq_clients.NEXTVAL, 'Dupont');

SELECT seq_clients.CURRVAL FROM DUAL;   -- valeur courante de la session
SELECT seq_clients.NEXTVAL FROM DUAL;   -- valeur suivante

ALTER SEQUENCE seq_clients INCREMENT BY 5;
DROP  SEQUENCE seq_clients;`,
          },
          {
            kind: "warning",
            body: {
              fr: "CURRVAL n'est disponible qu'après un premier appel à NEXTVAL dans la même session. Les valeurs consommées ne sont jamais restituées : un ROLLBACK ne rend pas le numéro, ce qui crée des trous — c'est normal et attendu.",
              en: "CURRVAL is only available after a first NEXTVAL call in the same session. Consumed values are never returned: a ROLLBACK does not give the number back, which creates gaps — that is normal and expected.",
            },
          },
        ],
      },
      {
        id: "6-2",
        number: "6.2",
        title: { fr: "Dictionnaire de données", en: "Data dictionary" },
        blocks: [
          {
            kind: "code",
            code: `SELECT table_name FROM user_tables;

SELECT table_name, column_name, data_type, nullable
FROM   user_tab_columns
WHERE  table_name = 'EMPLOYES';

SELECT constraint_name, constraint_type, table_name, search_condition
FROM   user_constraints;

SELECT view_name, text        FROM user_views;
SELECT sequence_name, last_number, increment_by FROM user_sequences;
SELECT index_name, table_name, uniqueness        FROM user_indexes;
SELECT object_name, object_type, created         FROM user_objects;`,
          },
          {
            kind: "table",
            title: { fr: "Les trois préfixes", en: "The three prefixes" },
            headers: [
              { fr: "Préfixe", en: "Prefix" },
              { fr: "Périmètre", en: "Scope" },
            ],
            rows: [
              [
                { fr: "USER_", en: "USER_" },
                { fr: "Les objets dont l'utilisateur courant est propriétaire", en: "Objects owned by the current user" },
              ],
              [
                { fr: "ALL_", en: "ALL_" },
                { fr: "Les objets auxquels il a accès, quel qu'en soit le propriétaire", en: "Objects it can access, whoever owns them" },
              ],
              [
                { fr: "DBA_", en: "DBA_" },
                { fr: "Tous les objets de la base — réservé aux administrateurs", en: "Every object in the database — administrators only" },
              ],
            ],
          },
          {
            kind: "tip",
            body: {
              fr: "Les noms d'objets sont stockés en MAJUSCULES dans le dictionnaire, sauf s'ils ont été créés entre guillemets doubles. WHERE table_name = 'employes' ne renvoie donc rien.",
              en: "Object names are stored in UPPERCASE in the dictionary, unless they were created inside double quotes. WHERE table_name = 'employes' therefore returns nothing.",
            },
          },
        ],
      },
      {
        id: "6-3",
        number: "6.3",
        title: { fr: "Index", en: "Indexes" },
        blocks: [
          {
            kind: "code",
            code: `-- Index simple
CREATE INDEX idx_employes_nom ON employes (nom);

-- Index composite (l'ordre des colonnes compte)
CREATE INDEX idx_employes_service_salaire ON employes (service_id, salaire);

-- Index unique
CREATE UNIQUE INDEX idx_employes_email ON employes (email);

-- Index basé sur une fonction
CREATE INDEX idx_employes_upper_nom ON employes (UPPER(nom));

DROP INDEX idx_employes_nom;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Une contrainte PRIMARY KEY ou UNIQUE crée automatiquement son index : il est inutile — et refusé — d'en créer un second identique. Un index basé sur fonction est indispensable si vos requêtes filtrent sur UPPER(nom) plutôt que sur nom.",
              en: "A PRIMARY KEY or UNIQUE constraint automatically creates its index: creating a second identical one is pointless — and rejected. A function-based index is essential when your queries filter on UPPER(nom) rather than nom.",
            },
          },
        ],
      },
      {
        id: "6-4",
        number: "6.4",
        title: { fr: "Sécurité : utilisateurs, privilèges, rôles", en: "Security: users, privileges, roles" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Gestion des utilisateurs", en: "Managing users" },
            code: `CREATE USER dupont IDENTIFIED BY mot_de_passe
  DEFAULT TABLESPACE users
  QUOTA 100M ON users;

ALTER USER dupont IDENTIFIED BY nouveau_mot_de_passe;
ALTER USER dupont ACCOUNT LOCK;
DROP  USER dupont CASCADE;`,
          },
          {
            kind: "code",
            title: { fr: "Privilèges système et objet", en: "System and object privileges" },
            code: `-- Système : agir sur la base
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW TO dupont;

-- Objet : agir sur un objet précis
GRANT SELECT, INSERT, UPDATE ON employes TO dupont;
GRANT SELECT ON employes TO dupont WITH GRANT OPTION;

REVOKE INSERT ON employes FROM dupont;`,
          },
          {
            kind: "code",
            title: { fr: "Rôles", en: "Roles" },
            code: `CREATE ROLE lecteur_rh;
GRANT SELECT ON employes TO lecteur_rh;
GRANT SELECT ON services  TO lecteur_rh;

GRANT lecteur_rh TO dupont;   -- un seul GRANT pour tout le lot
REVOKE lecteur_rh FROM dupont;`,
            caption: {
              fr: "Un rôle regroupe des privilèges et se donne en une fois : c'est le moyen normal d'appliquer le principe du moindre privilège à l'échelle.",
              en: "A role bundles privileges and is granted in one go: it is the normal way to apply least privilege at scale.",
            },
          },
          {
            kind: "warning",
            body: {
              fr: "GRANT et REVOKE sont des commandes DCL : elles déclenchent, elles aussi, un COMMIT implicite. Un GRANT ne peut porter que sur un seul objet à la fois — GRANT ALL ON t1, t2 TO … est invalide.",
              en: "GRANT and REVOKE are DCL statements: they too fire an implicit COMMIT. A GRANT can only target one object at a time — GRANT ALL ON t1, t2 TO … is invalid.",
            },
          },
        ],
      },
      {
        id: "6-5",
        number: "6.5",
        title: { fr: "Fuseaux horaires et intervalles", en: "Time zones and intervals" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Fuseaux horaires", en: "Time zones" },
            code: `SELECT
  SYSTIMESTAMP                                          AS horodatage_serveur,
  CURRENT_TIMESTAMP                                     AS horodatage_session,
  DBTIMEZONE                                            AS fuseau_base,
  SESSIONTIMEZONE                                       AS fuseau_session,
  SYSTIMESTAMP AT TIME ZONE 'Europe/Paris'              AS heure_paris,
  SYS_EXTRACT_UTC(SYSTIMESTAMP)                         AS equivalent_utc
FROM DUAL;`,
          },
          {
            kind: "code",
            title: { fr: "Intervalles", en: "Intervals" },
            code: `SELECT
  INTERVAL '5' YEAR                     AS cinq_ans,
  INTERVAL '3-6' YEAR TO MONTH          AS trois_ans_six_mois,
  INTERVAL '10 12:30:45' DAY TO SECOND  AS dix_jours_et_demi,
  NUMTODSINTERVAL(150, 'MINUTE')        AS cent_cinquante_minutes,
  NUMTOYMINTERVAL(30, 'MONTH')          AS trente_mois
FROM DUAL;`,
          },
          {
            kind: "table",
            title: { fr: "Les trois types temporels à distinguer", en: "The three temporal types to tell apart" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Stocke", en: "Stores" },
            ],
            rows: [
              [
                { fr: "DATE", en: "DATE" },
                { fr: "Date et heure, sans fuseau", en: "Date and time, no time zone" },
              ],
              [
                { fr: "TIMESTAMP WITH TIME ZONE", en: "TIMESTAMP WITH TIME ZONE" },
                { fr: "Conserve le décalage tel qu'il a été saisi", en: "Keeps the offset exactly as entered" },
              ],
              [
                { fr: "TIMESTAMP WITH LOCAL TIME ZONE", en: "TIMESTAMP WITH LOCAL TIME ZONE" },
                { fr: "Normalise au fuseau de la base, restitue dans celui de la session", en: "Normalises to the database zone, renders in the session zone" },
              ],
            ],
          },
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════
export const examTraps: { wrong: string; right: string; note: Bilingual }[] = [
  {
    wrong: `SELECT service, nom, AVG(salaire)
FROM   employes;`,
    right: `SELECT service, AVG(salaire)
FROM   employes
GROUP  BY service;`,
    note: {
      fr: "Colonne non agrégée sans GROUP BY : ORA-00937.",
      en: "Non-aggregated column without GROUP BY: ORA-00937.",
    },
  },
  {
    wrong: `SELECT nom AS employe
FROM   employes
WHERE  employe = 'Dupont';`,
    right: `SELECT nom AS employe
FROM   employes
WHERE  nom = 'Dupont';`,
    note: {
      fr: "WHERE est évalué avant SELECT : l'alias n'existe pas encore.",
      en: "WHERE runs before SELECT: the alias does not exist yet.",
    },
  },
  {
    wrong: `SELECT * FROM employes
WHERE  ROWNUM <= 5
ORDER  BY salaire DESC;`,
    right: `SELECT * FROM (
  SELECT * FROM employes ORDER BY salaire DESC
) WHERE ROWNUM <= 5;`,
    note: {
      fr: "ROWNUM est affecté avant le tri.",
      en: "ROWNUM is assigned before sorting.",
    },
  },
  {
    wrong: `SELECT nom FROM employes
WHERE  commission = NULL;`,
    right: `SELECT nom FROM employes
WHERE  commission IS NULL;`,
    note: {
      fr: "Aucune comparaison avec = ne peut être vraie face à NULL.",
      en: "No = comparison can ever be true against NULL.",
    },
  },
];

export const executionOrder: Bilingual[] = [
  { fr: "FROM — identification des tables et des jointures", en: "FROM — identify tables and joins" },
  { fr: "WHERE — filtrage des lignes", en: "WHERE — filter rows" },
  { fr: "GROUP BY — regroupement", en: "GROUP BY — group" },
  { fr: "HAVING — filtrage des groupes", en: "HAVING — filter groups" },
  { fr: "SELECT — projection des colonnes et des alias", en: "SELECT — project columns and aliases" },
  { fr: "ORDER BY — tri final", en: "ORDER BY — final sort" },
];

export const keyPoints: Bilingual[] = [
  { fr: "Jointures : distinguer INNER, LEFT, RIGHT et FULL", en: "Joins: tell INNER, LEFT, RIGHT and FULL apart" },
  { fr: "Agrégation : la différence WHERE / HAVING", en: "Aggregation: the WHERE / HAVING difference" },
  { fr: "Fonctions : TO_CHAR, TO_DATE, NVL et les analytiques", en: "Functions: TO_CHAR, TO_DATE, NVL and the analytics" },
  { fr: "Contraintes : PRIMARY KEY, FOREIGN KEY, CHECK", en: "Constraints: PRIMARY KEY, FOREIGN KEY, CHECK" },
  { fr: "Sous-requêtes : corrélées ou non corrélées", en: "Subqueries: correlated or not" },
];

export function totalTopics(): number {
  return courseSessions.reduce((sum, session) => sum + session.topics.length, 0);
}

export function totalMinutes(): number {
  return courseSessions.reduce((sum, session) => sum + session.estimatedMinutes, 0);
}

export function getSession(id: string): CourseSession | undefined {
  return courseSessions.find((session) => session.id === id);
}
