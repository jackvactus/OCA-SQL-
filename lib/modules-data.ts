import type { Module } from "./types";

export const modules: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Introduction to SQL and Relational Databases",
    description: "Comprendre les fondements des bases de données relationnelles et du langage SQL dans Oracle.",
    icon: "Database",
    category: "Fondamentaux",
    estimatedHours: 3,
    lessons: [
      {
        id: "m1l1",
        title: "Qu'est-ce qu'une base de données relationnelle ?",
        duration: 25,
        objectives: [
          "Définir le modèle relationnel et ses concepts clés",
          "Comprendre les tables, lignes, colonnes et relations",
          "Identifier les avantages du modèle relationnel",
        ],
        content: [
          {
            type: "text",
            title: "Le modèle relationnel",
            body: "Une base de données relationnelle organise les données en tables (relations) composées de lignes (tuples) et de colonnes (attributs). Chaque table représente une entité du monde réel, et les relations entre tables sont établies par des clés primaires et étrangères. Ce modèle, proposé par Edgar F. Codd en 1970, reste le standard dominant en entreprise.",
          },
          {
            type: "diagram",
            title: "Structure d'une table relationnelle",
            body: `EMPLOYEES (Table)
┌─────┬───────────┬──────────┬────────┐
│ ID  │ NOM       │ DEPT_ID  │ SALAIRE│
├─────┼───────────┼──────────┼────────┤
│  1  │ Alice     │    10    │  5000  │  ← Ligne (tuple)
│  2  │ Bob       │    20    │  4500  │
│  3  │ Charlie   │    10    │  5500  │
└─────┴───────────┴──────────┴────────┘
  ↑                ↑
Colonne      Clé étrangère
(Clé primaire) → DEPARTMENTS.ID`,
          },
          {
            type: "text",
            title: "Concepts essentiels",
            body: "Une **clé primaire** identifie de manière unique chaque ligne d'une table. Une **clé étrangère** référence la clé primaire d'une autre table, créant ainsi une relation. L'**intégrité référentielle** garantit que ces relations restent valides. Oracle Database implémente ces concepts via des contraintes (CONSTRAINT).",
          },
          {
            type: "code",
            title: "Exemple de création de table avec contraintes",
            code: `CREATE TABLE employees (
    employee_id   NUMBER PRIMARY KEY,
    first_name    VARCHAR2(50) NOT NULL,
    last_name     VARCHAR2(50) NOT NULL,
    salary        NUMBER(8,2) CHECK (salary > 0),
    department_id NUMBER,
    CONSTRAINT fk_dept FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE departments (
    department_id   NUMBER PRIMARY KEY,
    department_name VARCHAR2(30) NOT NULL
);`,
          },
          {
            type: "tip",
            body: "Dans Oracle, une table peut avoir au maximum une clé primaire, mais plusieurs contraintes UNIQUE. La clé primaire implique automatiquement NOT NULL et UNIQUE.",
          },
          {
            type: "table",
            title: "Terminologie relationnelle vs SQL",
            headers: ["Modèle relationnel", "Terme SQL", "Description"],
            rows: [
              ["Relation", "Table", "Structure de stockage des données"],
              ["Tuple", "Ligne / Row", "Une occurrence de données"],
              ["Attribut", "Colonne / Column", "Une caractéristique des données"],
              ["Domaine", "Type de données", "Ensemble des valeurs autorisées"],
              ["Clé primaire", "PRIMARY KEY", "Identifiant unique de chaque ligne"],
              ["Clé étrangère", "FOREIGN KEY", "Référence vers une autre table"],
            ],
          },
        ],
        keyPoints: [
          "Le modèle relationnel organise les données en tables, lignes et colonnes",
          "La clé primaire identifie de façon unique chaque ligne",
          "La clé étrangère crée des relations entre tables",
          "Oracle utilise des contraintes pour garantir l'intégrité des données",
        ],
        flashcards: [
          {
            id: "fc-m1-1",
            front: "Qu'est-ce qu'une clé primaire ?",
            back: "Une colonne (ou combinaison de colonnes) qui identifie de manière unique chaque ligne d'une table. Elle est NOT NULL et UNIQUE.",
            category: "Fondamentaux",
          },
          {
            id: "fc-m1-2",
            front: "Qu'est-ce qu'une clé étrangère ?",
            back: "Une colonne qui référence la clé primaire d'une autre table, établissant une relation et garantissant l'intégrité référentielle.",
            category: "Fondamentaux",
          },
          {
            id: "fc-m1-3",
            front: "Qui a proposé le modèle relationnel et quand ?",
            back: "Edgar F. Codd en 1970, dans son article 'A Relational Model of Data for Large Shared Data Banks'.",
            category: "Fondamentaux",
          },
        ],
        exercises: [
          {
            id: "ex-m1-1",
            prompt: "Créez une table 'students' avec un id (clé primaire), un nom (obligatoire), et un age (positif).",
            starterCode: "-- Écrivez votre CREATE TABLE ici\n",
            solution: `CREATE TABLE students (
    id   NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    age  NUMBER CHECK (age > 0)
);`,
            hint: "Utilisez PRIMARY KEY, NOT NULL et CHECK",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m1l2",
        title: "Le langage SQL et ses catégories",
        duration: 20,
        objectives: [
          "Distinguer DDL, DML, DCL et TCL",
          "Comprendre le rôle de chaque catégorie de commandes",
          "Identifier les commandes auto-validantes vs transactionnelles",
        ],
        content: [
          {
            type: "text",
            title: "Les catégories de commandes SQL",
            body: "SQL (Structured Query Language) se divise en plusieurs catégories selon leur rôle. Comprendre cette distinction est crucial pour la certification et pour la gestion des transactions en production.",
          },
          {
            type: "table",
            title: "Catégories SQL",
            headers: ["Catégorie", "Rôle", "Commandes", "Auto-commit ?"],
            rows: [
              ["DDL", "Définit la structure", "CREATE, ALTER, DROP, TRUNCATE, RENAME", "Oui"],
              ["DML", "Manipule les données", "INSERT, UPDATE, DELETE, MERGE", "Non"],
              ["DQL", "Interroge les données", "SELECT", "Non"],
              ["DCL", "Gère les droits", "GRANT, REVOKE", "Oui"],
              ["TCL", "Gère les transactions", "COMMIT, ROLLBACK, SAVEPOINT", "—"],
            ],
          },
          {
            type: "warning",
            body: "Les commandes DDL (CREATE, ALTER, DROP, TRUNCATE) déclenchent un COMMIT implicite avant ET après leur exécution. Toute transaction DML en cours est validée automatiquement. C'est un piège classique de l'examen 1Z0-071.",
          },
          {
            type: "code",
            title: "Exemple : DDL vs DML",
            code: `-- DML : modification transactionnelle (annulable)
INSERT INTO employees VALUES (1, 'Alice', 5000);
ROLLBACK;  -- L'insertion est annulée

-- DDL : auto-validée (non annulable)
TRUNCATE TABLE employees;
ROLLBACK;  -- Trop tard ! La table est déjà vidée`,
          },
          {
            type: "tip",
            body: "TRUNCATE est une commande DDL (ultra-rapide, non annulable, réinitialise les segments). DELETE est une commande DML (lente sur gros volumes, annulable, ne réinitialise pas les segments).",
          },
        ],
        keyPoints: [
          "DDL = structure (auto-commit), DML = données (transactionnel)",
          "TRUNCATE est DDL, DELETE est DML",
          "Les commandes DDL valident implicitement les transactions en cours",
          "SELECT appartient techniquement au DML mais est parfois classé en DQL",
        ],
        flashcards: [
          {
            id: "fc-m1-4",
            front: "Quelles commandes déclenchent un COMMIT implicite ?",
            back: "Les commandes DDL (CREATE, ALTER, DROP, TRUNCATE, RENAME, COMMENT). Elles valident les transactions DML en cours avant et après leur exécution.",
            category: "Fondamentaux",
          },
          {
            id: "fc-m1-5",
            front: "Différence entre TRUNCATE et DELETE ?",
            back: "TRUNCATE est DDL (auto-commit, ultra-rapide, réinitialise le storage). DELETE est DML (transactionnel, annulable, plus lent sur gros volumes).",
            category: "Fondamentaux",
          },
        ],
        exercises: [
          {
            id: "ex-m1-2",
            prompt: "Insérez une ligne dans 'employees', puis annulez avec ROLLBACK.",
            starterCode: "INSERT INTO employees VALUES (10, 'Test', 3000);\n",
            solution: `INSERT INTO employees VALUES (10, 'Test', 3000);
ROLLBACK;`,
            hint: "Utilisez ROLLBACK après l'INSERT",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Retrieving Data with SELECT",
    description: "Maîtriser la commande SELECT, les projections, les alias et le filtrage avec WHERE.",
    icon: "Search",
    category: "Fondamentaux",
    estimatedHours: 4,
    lessons: [
      {
        id: "m2l1",
        title: "La commande SELECT et les projections",
        duration: 30,
        objectives: [
          "Écrire des requêtes SELECT basiques",
          "Utiliser des alias de colonnes",
          "Comprendre la projection vs la sélection",
          "Utiliser DISTINCT pour éliminer les doublons",
        ],
        content: [
          {
            type: "text",
            title: "Anatomie d'une requête SELECT",
            body: "La commande SELECT est la pierre angulaire de SQL. Elle permet de récupérer des données d'une ou plusieurs tables. La **projection** sélectionne les colonnes à retourner, tandis que la **sélection** filtre les lignes via la clause WHERE.",
          },
          {
            type: "code",
            title: "Syntaxe de base",
            code: `SELECT   column1, column2, ...   -- Projection
FROM     table_name
WHERE    condition              -- Sélection
ORDER BY column1 [ASC|DESC];`,
          },
          {
            type: "diagram",
            title: "Projection vs Sélection",
            body: `Table EMPLOYEES (4 colonnes, 5 lignes)

  Projection (SELECT nom, salaire)     Sélection (WHERE dept = 'IT')
  ┌──────────┬────────┐                 ┌────┬──────┬──────┬───────┐
  │ NOM      │ SALAIRE│                 │ ID │ NOM   │ DEPT │SALAIRE│
  ├──────────┼────────┤                 ├────┼──────┼──────┼───────┤
  │ Alice    │  5000  │  ← Colonnes     │  1 │Alice  │ IT   │ 5000  │
  │ Bob      │  4500  │    choisies     │  3 │Charlie│ IT   │ 5500  │
  │ Charlie  │  5500  │                 └────┴──────┴──────┴───────┘
  │ Diana    │  4800  │                       ↑ Lignes filtrées
  │ Eve      │  6000  │
  └──────────┴────────┘`,
          },
          {
            type: "code",
            title: "Exemples pratiques",
            code: `-- Toutes les colonnes
SELECT * FROM employees;

-- Projection : colonnes spécifiques
SELECT first_name, last_name, salary FROM employees;

-- Alias de colonne (AS optionnel)
SELECT first_name AS prenom, salary "Salaire Annuel" FROM employees;

-- Éliminer les doublons
SELECT DISTINCT department_id FROM employees;

-- Concaténation (opérateur ||)
SELECT first_name || ' ' || last_name AS full_name FROM employees;

-- Valeurs littérales
SELECT first_name, 'travaille en' AS phrase, department_id FROM employees;`,
          },
          {
            type: "tip",
            body: "L'alias de colonne avec guillemets doubles (\"Salaire Annuel\") préserve la casse et autorise les espaces. Sans guillemets, Oracle convertit en majuscules. Le mot-clé AS est optionnel mais recommandé pour la lisibilité.",
          },
          {
            type: "warning",
            body: "SELECT * est pratique pour l'exploration mais proscrit en production : il récupère des colonnes inutiles, casse le code si la structure change, et empêche l'optimiseur d'utiliser des index covering. Spécifiez toujours les colonnes nécessaires.",
          },
          {
            type: "table",
            title: "Ordre d'exécution des clauses",
            headers: ["Ordre logique", "Clause", "Rôle"],
            rows: [
              ["1", "FROM", "Identifie la table source"],
              ["2", "WHERE", "Filtre les lignes"],
              ["3", "GROUP BY", "Groupe les lignes"],
              ["4", "HAVING", "Filtre les groupes"],
              ["5", "SELECT", "Choisit les colonnes"],
              ["6", "ORDER BY", "Trie le résultat"],
              ["7", "FETCH FIRST", "Limite les lignes"],
            ],
          },
          {
            type: "note",
            body: "L'ordre d'écriture (SELECT en premier) diffère de l'ordre d'exécution logique (FROM en premier). Cette distinction est testée à l'examen : les alias de colonne définis dans SELECT ne sont PAS disponibles dans WHERE, mais le sont dans ORDER BY.",
          },
        ],
        keyPoints: [
          "SELECT = projection (colonnes), WHERE = sélection (lignes)",
          "DISTINCT élimine les doublons sur toutes les colonnes listées",
          "Les alias avec guillemets préservent la casse",
          "L'ordre d'exécution : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
          "Les alias du SELECT ne sont pas utilisables dans WHERE",
        ],
        flashcards: [
          {
            id: "fc-m2-1",
            front: "Quelle est la différence entre projection et sélection ?",
            back: "La projection choisit les COLONNES à retourner (SELECT). La sélection filtre les LIGNES à retourner (WHERE).",
            category: "SELECT",
          },
          {
            id: "fc-m2-2",
            front: "Quel est l'ordre d'exécution logique des clauses SELECT ?",
            back: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → FETCH FIRST. L'ordre d'écriture est différent (SELECT en premier).",
            category: "SELECT",
          },
          {
            id: "fc-m2-3",
            front: "Peut-on utiliser un alias de colonne défini dans SELECT dans la clause WHERE ?",
            back: "Non. WHERE s'exécute avant SELECT. L'alias n'existe pas encore au moment de l'évaluation de WHERE. Il est utilisable dans ORDER BY.",
            category: "SELECT",
          },
        ],
        exercises: [
          {
            id: "ex-m2-1",
            prompt: "Affichez le nom et prénom concaténés avec un espace, et le salaire, pour tous les employés.",
            starterCode: "SELECT \nFROM employees;\n",
            solution: `SELECT first_name || ' ' || last_name AS full_name, salary
FROM employees;`,
            hint: "Utilisez l'opérateur || pour concaténer",
            difficulty: "beginner",
          },
          {
            id: "ex-m2-2",
            prompt: "Affichez les identifiants de département distincts de la table employees.",
            starterCode: "SELECT  department_id FROM employees;\n",
            solution: `SELECT DISTINCT department_id FROM employees;`,
            hint: "Utilisez DISTINCT",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m2l2",
        title: "Filtrage avec WHERE et opérateurs",
        duration: 35,
        objectives: [
          "Maîtriser la clause WHERE",
          "Utiliser les opérateurs de comparaison et logiques",
          "Comprendre les opérateurs IN, BETWEEN, LIKE, IS NULL",
          "Gérer les valeurs NULL dans les conditions",
        ],
        content: [
          {
            type: "text",
            title: "La clause WHERE",
            body: "WHERE filtre les lignes selon une ou plusieurs conditions. C'est l'outil principal de sélection. Les conditions peuvent combiner des opérateurs de comparaison, logiques et spéciaux.",
          },
          {
            type: "table",
            title: "Opérateurs de comparaison",
            headers: ["Opérateur", "Description", "Exemple"],
            rows: [
              ["=", "Égalité", "WHERE salary = 5000"],
              ["!=", "<>", "Différent de", "WHERE dept != 10"],
              [">, <, >=, <=", "Comparaison", "WHERE salary > 4000"],
              ["BETWEEN", "Intervalle inclusif", "WHERE salary BETWEEN 4000 AND 6000"],
              ["IN", "Liste de valeurs", "WHERE dept IN (10, 20, 30)"],
              ["LIKE", "Pattern matching", "WHERE name LIKE 'A%'"],
              ["IS NULL", "Test de valeur nulle", "WHERE manager_id IS NULL"],
            ],
          },
          {
            type: "code",
            title: "Exemples de filtrage",
            code: `-- Opérateurs logiques AND, OR, NOT
SELECT * FROM employees
WHERE salary > 4000 AND department_id = 10;

-- BETWEEN (inclusif)
SELECT * FROM employees
WHERE salary BETWEEN 4000 AND 6000;

-- IN (liste de valeurs)
SELECT * FROM employees
WHERE department_id IN (10, 20, 30);

-- LIKE avec wildcards
SELECT * FROM employees
WHERE last_name LIKE 'S%'      -- Commence par S
   OR last_name LIKE '%son';  -- Finit par son

-- IS NULL (jamais = NULL)
SELECT * FROM employees
WHERE commission_pct IS NULL;`,
          },
          {
            type: "warning",
            body: "NULL n'est jamais égal à NULL. La condition `WHERE col = NULL` retourne toujours 0 lignes. Utilisez `WHERE col IS NULL` ou `WHERE col IS NOT NULL`. C'est l'un des pièges les plus fréquents de l'examen.",
          },
          {
            type: "table",
            title: "Wildcards de LIKE",
            headers: ["Wildcard", "Description", "Exemple"],
            rows: [
              ["%", "0 à N caractères", "'A%' = commence par A"],
              ["_", "Exactement 1 caractère", "'_A%' = 2e caractère = A"],
              ["ESCAPE", "Caractère d'échappement", "LIKE '50\\%' ESCAPE '\\'"],
            ],
          },
          {
            type: "tip",
            body: "L'opérateur LIKE est coûteux car il empêche souvent l'utilisation d'index (sauf si le pattern ne commence pas par %). Pour la recherche full-text, Oracle propose CONTEXT index (CTXSYS.CONTEXT).",
          },
          {
            type: "code",
            title: "Gestion des NULL avec opérateurs logiques",
            code: `-- Piège : NULL avec AND et OR
-- TRUE  AND NULL  = NULL  (ligne exclue)
-- FALSE AND NULL  = FALSE (ligne exclue)
-- TRUE  OR  NULL  = TRUE  (ligne incluse)
-- FALSE OR  NULL  = NULL  (ligne exclue)

-- Exemple concret
SELECT * FROM employees
WHERE commission_pct > 0.1;
-- N'inclut PAS les lignes où commission_pct IS NULL

-- Pour inclure les NULL, utiliser NVL ou IS NULL
SELECT * FROM employees
WHERE commission_pct > 0.1 OR commission_pct IS NULL;`,
          },
        ],
        keyPoints: [
          "WHERE filtre les lignes avant GROUP BY et SELECT",
          "BETWEEN est inclusif des deux bornes",
          "IS NULL / IS NOT NULL pour tester les valeurs nulles",
          "NULL = NULL retourne toujours FALSE (utiliser IS NULL)",
          "LIKE avec % empêche l'usage d'index sur la colonne",
        ],
        flashcards: [
          {
            id: "fc-m2-4",
            front: "Que retourne WHERE col = NULL ?",
            back: "Aucune ligne. NULL ne peut pas être comparé avec =. Il faut utiliser IS NULL.",
            category: "WHERE",
          },
          {
            id: "fc-m2-5",
            front: "BETWEEN est-il inclusif ou exclusif ?",
            back: "Inclusif. BETWEEN 1 AND 5 inclut les valeurs 1 et 5. Équivalent à >= 1 AND <= 5.",
            category: "WHERE",
          },
          {
            id: "fc-m2-6",
            front: "Que fait TRUE AND NULL ?",
            back: "Retourne NULL (inconnu), donc la ligne est exclue du résultat. FALSE AND NULL retourne FALSE. TRUE OR NULL retourne TRUE.",
            category: "WHERE",
          },
        ],
        exercises: [
          {
            id: "ex-m2-3",
            prompt: "Trouvez tous les employés gagnant entre 4000 et 8000 dans les départements 10 ou 20.",
            starterCode: "SELECT * FROM employees\nWHERE \n",
            solution: `SELECT * FROM employees
WHERE salary BETWEEN 4000 AND 8000
  AND department_id IN (10, 20);`,
            hint: "Utilisez BETWEEN et IN",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Sorting and Limiting Rows",
    description: "Maîtriser ORDER BY, FETCH FIRST, et la pagination des résultats.",
    icon: "ArrowDownUp",
    category: "Fondamentaux",
    estimatedHours: 2,
    lessons: [
      {
        id: "m3l1",
        title: "ORDER BY et le tri des résultats",
        duration: 25,
        objectives: [
          "Trier les résultats avec ORDER BY",
          "Comprendre ASC et DESC",
          "Trier sur plusieurs colonnes",
          "Gérer les NULL dans le tri",
        ],
        content: [
          {
            type: "text",
            title: "La clause ORDER BY",
            body: "ORDER BY trie le résultat final. C'est la dernière clause exécutée logiquement. Sans ORDER BY, l'ordre des lignes n'est pas garanti — un point crucial pour la certification et en production.",
          },
          {
            type: "code",
            title: "Syntaxe et exemples",
            code: `-- Tri ascendant (défaut)
SELECT * FROM employees ORDER BY last_name;

-- Tri descendant
SELECT * FROM employees ORDER BY salary DESC;

-- Tri multi-colonnes
SELECT * FROM employees
ORDER BY department_id ASC, salary DESC;

-- Tri par position de colonne (déconseillé)
SELECT first_name, salary FROM employees ORDER BY 2 DESC;

-- Tri avec alias du SELECT
SELECT first_name, salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC;`,
          },
          {
            type: "table",
            title: "Comportement des NULL dans ORDER BY",
            headers: ["Ordre", "NULLs apparaissent", "Commande"],
            rows: [
              ["ASC", "En dernier (Oracle)", "ORDER BY col ASC NULLS LAST"],
              ["ASC", "En premier (option)", "ORDER BY col ASC NULLS FIRST"],
              ["DESC", "En premier (Oracle)", "ORDER BY col DESC NULLS FIRST"],
              ["DESC", "En dernier (option)", "ORDER BY col DESC NULLS LAST"],
            ],
          },
          {
            type: "warning",
            body: "Dans Oracle, ORDER BY ASC place les NULL en dernier par défaut. C'est l'inverse de certains autres SGBD. L'examen teste cette spécificité. Utilisez NULLS FIRST / NULLS LAST pour un contrôle explicite.",
          },
          {
            type: "tip",
            body: "ORDER BY est la SEULE clause qui peut utiliser les alias définis dans SELECT. C'est parce qu'elle s'exécute en dernier. C'est un point testé systématiquement à l'examen.",
          },
        ],
        keyPoints: [
          "ORDER BY est la dernière clause exécutée",
          "Sans ORDER BY, l'ordre n'est pas garanti",
          "ASC = ascendant (défaut), DESC = descendant",
          "Oracle place les NULL en dernier avec ASC, en premier avec DESC",
          "ORDER BY peut utiliser les alias du SELECT",
        ],
        flashcards: [
          {
            id: "fc-m3-1",
            front: "Où apparaissent les NULL avec ORDER BY ASC dans Oracle ?",
            back: "En dernier par défaut. C'est une spécificité Oracle. On peut forcer avec NULLS FIRST ou NULLS LAST.",
            category: "ORDER BY",
          },
          {
            id: "fc-m3-2",
            front: "ORDER BY peut-il utiliser les alias de colonne du SELECT ?",
            back: "Oui. ORDER BY s'exécute après SELECT, donc les alias sont disponibles. C'est la seule clause qui peut le faire.",
            category: "ORDER BY",
          },
        ],
        exercises: [
          {
            id: "ex-m3-1",
            prompt: "Affichez les employés triés par département (ascendant) puis par salaire (descendant).",
            starterCode: "SELECT * FROM employees\n",
            solution: `SELECT * FROM employees
ORDER BY department_id ASC, salary DESC;`,
            hint: "Utilisez ORDER BY avec deux colonnes",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m3l2",
        title: "FETCH FIRST et la pagination",
        duration: 20,
        objectives: [
          "Limiter le nombre de lignes avec FETCH FIRST",
          "Implémenter la pagination avec OFFSET",
          "Comprendre ROWNUM vs FETCH FIRST",
        ],
        content: [
          {
            type: "text",
            title: "FETCH FIRST (Oracle 12c+)",
            body: "FETCH FIRST est la syntaxe standard SQL pour limiter les lignes. Elle remplace l'ancien ROWNUM et offre plus de flexibilité, notamment pour la pagination.",
          },
          {
            type: "code",
            title: "Syntaxe FETCH FIRST",
            code: `-- Top 5 salaires
SELECT * FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;

-- Top 5 avec ex aequo
SELECT * FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS WITH TIES;

-- Pagination : page 2 (10 lignes par page)
SELECT * FROM employees
ORDER BY employee_id
OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;`,
          },
          {
            type: "table",
            title: "FETCH FIRST vs ROWNUM",
            headers: ["Critère", "ROWNUM", "FETCH FIRST"],
            rows: [
              ["Standard SQL", "Non (Oracle only)", "Oui (ANSI)"],
              ["Avec ORDER BY", "Problématique", "Correct"],
              ["Pagination", "Complexe", "OFFSET ... FETCH NEXT"],
              ["WITH TIES", "Non supporté", "Supporté"],
              ["Version min", "Toutes", "Oracle 12c+"],
            ],
          },
          {
            type: "warning",
            body: "ROWNUM est assigné AVANT le tri ORDER BY. Pour 'top N' avec ROWNUM, il faut une sous-requête. FETCH FIRST gère cela correctement. L'examen teste cette différence.",
          },
          {
            type: "code",
            title: "Piège ROWNUM vs FETCH FIRST",
            code: `-- INCORRECT avec ROWNUM (assigné avant le tri)
SELECT * FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;
-- Retourne 5 lignes aléatoires, puis les trie

-- CORRECT avec sous-requête
SELECT * FROM (
    SELECT * FROM employees ORDER BY salary DESC
) WHERE ROWNUM <= 5;

-- CORRECT et simple avec FETCH FIRST
SELECT * FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;`,
          },
        ],
        keyPoints: [
          "FETCH FIRST est la syntaxe standard (Oracle 12c+)",
          "WITH TIES inclut les ex aequo",
          "OFFSET ... FETCH NEXT pour la pagination",
          "ROWNUM est assigné avant ORDER BY (piège classique)",
          "FETCH FIRST gère correctement le tri",
        ],
        flashcards: [
          {
            id: "fc-m3-3",
            front: "Quand ROWNUM est-il assigné par rapport à ORDER BY ?",
            back: "AVANT le tri ORDER BY. Pour un 'top N' correct avec ROWNUM, il faut une sous-requête. FETCH FIRST évite ce problème.",
            category: "FETCH FIRST",
          },
          {
            id: "fc-m3-4",
            front: "Que fait FETCH FIRST 5 ROWS WITH TIES ?",
            back: "Retourne les 5 premières lignes ET toutes les lignes ayant la même valeur de tri que la 5e ligne (ex aequo).",
            category: "FETCH FIRST",
          },
        ],
        exercises: [
          {
            id: "ex-m3-2",
            prompt: "Affichez la page 3 des employés (10 par page), triés par ID.",
            starterCode: "SELECT * FROM employees\nORDER BY employee_id\n",
            solution: `SELECT * FROM employees
ORDER BY employee_id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;`,
            hint: "OFFSET = (page-1) * taille, puis FETCH NEXT",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Single-Row Functions",
    description: "Maîtriser les fonctions mono-ligne : caractères, nombres, dates, conversions, NULL.",
    icon: "FunctionSquare",
    category: "Fonctions",
    estimatedHours: 5,
    lessons: [
      {
        id: "m4l1",
        title: "Fonctions de caractères",
        duration: 35,
        objectives: [
          "Manipuler des chaînes avec UPPER, LOWER, SUBSTR, etc.",
          "Comprendre les fonctions de casse et d'extraction",
          "Utiliser LPAD, RPAD, TRIM, REPLACE",
        ],
        content: [
          {
            type: "text",
            title: "Fonctions de caractères",
            body: "Oracle fournit de nombreuses fonctions pour manipuler les chaînes de caractères. Elles se divisent en fonctions de casse, d'extraction, de modification et de recherche.",
          },
          {
            type: "table",
            title: "Fonctions de casse et d'extraction",
            headers: ["Fonction", "Description", "Exemple", "Résultat"],
            rows: [
              ["UPPER(s)", "Majuscules", "UPPER('oracle')", "ORACLE"],
              ["LOWER(s)", "Minuscules", "LOWER('ORACLE')", "oracle"],
              ["INITCAP(s)", "Initiale majuscule", "INITCAP('hello world')", "Hello World"],
              ["SUBSTR(s, pos, len)", "Extrait une sous-chaîne", "SUBSTR('Oracle', 1, 3)", "Ora"],
              ["LENGTH(s)", "Longueur", "LENGTH('Oracle')", "6"],
              ["INSTR(s, sub)", "Position d'une sous-chaîne", "INSTR('Oracle', 'cl')", "4"],
            ],
          },
          {
            type: "code",
            title: "Exemples pratiques",
            code: `-- Extraction et manipulation
SELECT
    UPPER(last_name) AS nom_maj,
    SUBSTR(first_name, 1, 1) AS initiale,
    LENGTH(last_name) AS longueur
FROM employees;

-- Recherche de position
SELECT INSTR('Hello World', 'o') AS pos FROM dual;
-- Résultat : 5 (première occurrence)

-- INSTR avec position de départ
SELECT INSTR('Hello World', 'o', 6) AS pos FROM dual;
-- Résultat : 7 (recherche à partir du 6e caractère)`,
          },
          {
            type: "table",
            title: "Fonctions de modification",
            headers: ["Fonction", "Description", "Exemple", "Résultat"],
            rows: [
              ["LPAD(s, len, char)", "Remplissage à gauche", "LPAD('5', 3, '0')", "005"],
              ["RPAD(s, len, char)", "Remplissage à droite", "RPAD('5', 3, '0')", "500"],
              ["TRIM(s)", "Supprime les espaces", "TRIM('  hi  ')", "hi"],
              ["LTRIM(s)", "Supprime à gauche", "LTRIM('  hi')", "hi"],
              ["RTRIM(s)", "Supprime à droite", "RTRIM('hi  ')", "hi"],
              ["REPLACE(s, old, new)", "Remplace", "REPLACE('ABC', 'B', 'X')", "AXC"],
              ["CONCAT(a, b)", "Concatène (2 args)", "CONCAT('A', 'B')", "AB"],
            ],
          },
          {
            type: "tip",
            body: "SUBSTR utilise des positions en base 1 (le premier caractère est à la position 1, pas 0). Une position négative compte depuis la fin : SUBSTR('Oracle', -3) retourne 'cle'.",
          },
          {
            type: "warning",
            body: "CONCAT n'accepte que 2 arguments. Pour concaténer plus de chaînes, utilisez l'opérateur || : 'a' || 'b' || 'c'. L'examen teste cette limitation.",
          },
        ],
        keyPoints: [
          "UPPER, LOWER, INITCAP pour la casse",
          "SUBSTR en base 1, position négative = depuis la fin",
          "INSTR retourne la position (base 1), 0 si non trouvé",
          "CONCAT limite à 2 arguments, || pour plus",
          "TRIM supprime les espaces (ou caractères spécifiés)",
        ],
        flashcards: [
          {
            id: "fc-m4-1",
            front: "Que retourne SUBSTR('Oracle', -3) ?",
            back: "'cle'. Les positions négatives comptent depuis la fin de la chaîne.",
            category: "Fonctions caractères",
          },
          {
            id: "fc-m4-2",
            front: "Combien d'arguments accepte CONCAT ?",
            back: "Exactement 2. Pour concaténer plus de chaînes, utilisez l'opérateur ||.",
            category: "Fonctions caractères",
          },
          {
            id: "fc-m4-3",
            front: "Que retourne INSTR si la sous-chaîne n'est pas trouvée ?",
            back: "0 (pas -1). Les positions dans Oracle commencent à 1, donc 0 signifie 'non trouvé'.",
            category: "Fonctions caractères",
          },
        ],
        exercises: [
          {
            id: "ex-m4-1",
            prompt: "Affichez le nom en majuscules et les 3 premières lettres du prénom de chaque employé.",
            starterCode: "SELECT \nFROM employees;\n",
            solution: `SELECT UPPER(last_name) AS nom, SUBSTR(first_name, 1, 3) AS prenom_court
FROM employees;`,
            hint: "Utilisez UPPER et SUBSTR",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m4l2",
        title: "Fonctions numériques et de dates",
        duration: 30,
        objectives: [
          "Utiliser ROUND, TRUNC, MOD, CEIL, FLOOR",
          "Manipuler les dates avec SYSDATE, ADD_MONTHS, MONTHS_BETWEEN",
          "Comprendre l'arithmétique des dates Oracle",
        ],
        content: [
          {
            type: "table",
            title: "Fonctions numériques",
            headers: ["Fonction", "Description", "Exemple", "Résultat"],
            rows: [
              ["ROUND(n, d)", "Arrondit à d décimales", "ROUND(45.923, 2)", "45.92"],
              ["TRUNC(n, d)", "Tronque à d décimales", "TRUNC(45.923, 2)", "45.92"],
              ["MOD(a, b)", "Modulo", "MOD(10, 3)", "1"],
              ["CEIL(n)", "Plus petit entier supérieur", "CEIL(45.1)", "46"],
              ["FLOOR(n)", "Plus grand entier inférieur", "FLOOR(45.9)", "45"],
              ["ABS(n)", "Valeur absolue", "ABS(-5)", "5"],
              ["POWER(a, b)", "Puissance", "POWER(2, 10)", "1024"],
              ["SQRT(n)", "Racine carrée", "SQRT(16)", "4"],
            ],
          },
          {
            type: "code",
            title: "ROUND vs TRUNC",
            code: `SELECT
    ROUND(45.923, 2) AS rounded,   -- 45.92
    TRUNC(45.923, 2) AS truncated,  -- 45.92
    ROUND(45.927, 2) AS rounded2,   -- 45.93
    TRUNC(45.927, 2) AS truncated2, -- 45.92
    ROUND(45.5)     AS rounded_int,  -- 46
    TRUNC(45.5)     AS trunc_int    -- 45
FROM dual;`,
          },
          {
            type: "table",
            title: "Fonctions de dates",
            headers: ["Fonction", "Description", "Exemple", "Résultat"],
            rows: [
              ["SYSDATE", "Date et heure actuelles", "SELECT SYSDATE FROM dual", "2026-07-03"],
              ["SYSTIMESTAMP", "Timestamp avec timezone", "SELECT SYSTIMESTAMP FROM dual", "2026-07-03 ..."],
              ["ADD_MONTHS(d, n)", "Ajoute n mois", "ADD_MONTHS(SYSDATE, 6)", "+6 mois"],
              ["MONTHS_BETWEEN(d1, d2)", "Mois entre 2 dates", "MONTHS_BETWEEN(d1, d2)", "12.3"],
              ["LAST_DAY(d)", "Dernier jour du mois", "LAST_DAY(SYSDATE)", "2026-07-31"],
              ["NEXT_DAY(d, day)", "Prochain jour de la semaine", "NEXT_DAY(SYSDATE, 'FRIDAY')", "2026-07-10"],
              ["EXTRACT(part FROM d)", "Extrait une partie", "EXTRACT(YEAR FROM SYSDATE)", "2026"],
              ["TRUNC(d, fmt)", "Tronque une date", "TRUNC(SYSDATE, 'MM')", "2026-07-01"],
            ],
          },
          {
            type: "text",
            title: "Arithmétique des dates",
            body: "Oracle permet l'arithmétique directe sur les dates : soustraire deux dates donne le nombre de jours entre elles. Ajouter un nombre à une date ajoute des jours. Pour les heures, divisez par 24.",
          },
          {
            type: "code",
            title: "Arithmétique des dates",
            code: `-- Différence en jours
SELECT SYSDATE - hire_date AS jours_anciennete
FROM employees;

-- Ajouter des jours
SELECT SYSDATE + 30 AS dans_30_jours FROM dual;

-- Ajouter des heures (1 heure = 1/24 jour)
SELECT SYSDATE + 2/24 AS dans_2_heures FROM dual;

-- Ajouter des minutes (1 minute = 1/24/60)
SELECT SYSDATE + 30/(24*60) AS dans_30_min FROM dual;

-- Mois entre deux dates
SELECT MONTHS_BETWEEN(SYSDATE, hire_date) AS mois
FROM employees;`,
          },
          {
            type: "tip",
            body: "MONTHS_BETWEEN retourne un nombre décimal. Si les deux dates tombent le même jour du mois, le résultat est entier. Sinon, la fraction représente la partie de mois supplémentaire.",
          },
        ],
        keyPoints: [
          "ROUND arrondit, TRUNC tronque (vers zéro)",
          "SYSDATE = date actuelle, SYSTIMESTAMP = avec timezone",
          "Soustraire 2 dates = nombre de jours",
          "Ajouter n à une date = +n jours ; 1 heure = 1/24",
          "ADD_MONTHS, MONTHS_BETWEEN, LAST_DAY, NEXT_DAY pour les mois",
        ],
        flashcards: [
          {
            id: "fc-m4-4",
            front: "Que retourne SYSDATE - hire_date ?",
            back: "Le nombre de jours entre les deux dates (un nombre décimal).",
            category: "Fonctions dates",
          },
          {
            id: "fc-m4-5",
            front: "Comment ajouter 2 heures à une date ?",
            back: "SYSDATE + 2/24. L'arithmétique des dates fonctionne en jours, donc 1 heure = 1/24 de jour.",
            category: "Fonctions dates",
          },
          {
            id: "fc-m4-6",
            front: "Différence entre ROUND(45.5) et TRUNC(45.5) ?",
            back: "ROUND(45.5) = 46 (arrondi), TRUNC(45.5) = 45 (tronqué vers zéro).",
            category: "Fonctions numériques",
          },
        ],
        exercises: [
          {
            id: "ex-m4-2",
            prompt: "Calculez le nombre de mois entre la date d'embauche et aujourd'hui pour chaque employé.",
            starterCode: "SELECT \nFROM employees;\n",
            solution: `SELECT MONTHS_BETWEEN(SYSDATE, hire_date) AS mois_anciennete
FROM employees;`,
            hint: "Utilisez MONTHS_BETWEEN",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m4l3",
        title: "Fonctions de conversion et gestion des NULL",
        duration: 35,
        objectives: [
          "Convertir entre types avec TO_CHAR, TO_NUMBER, TO_DATE",
          "Gérer les NULL avec NVL, NVL2, COALESCE, NULLIF",
          "Comprendre les masques de format",
        ],
        content: [
          {
            type: "text",
            title: "Fonctions de conversion",
            body: "Oracle fournit des fonctions explicites de conversion de types. Bien qu'Oracle fasse des conversions implicites, les conversions explicites sont recommandées pour la performance et la fiabilité.",
          },
          {
            type: "code",
            title: "TO_CHAR, TO_NUMBER, TO_DATE",
            code: `-- TO_CHAR : nombre → chaîne
SELECT TO_CHAR(1234.56, '999,999.99') FROM dual;
-- Résultat : '  1,234.56'

SELECT TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS') FROM dual;
-- Résultat : '03/07/2026 14:30:00'

-- TO_NUMBER : chaîne → nombre
SELECT TO_NUMBER('1,234.56', '999,999.99') FROM dual;
-- Résultat : 1234.56

-- TO_DATE : chaîne → date
SELECT TO_DATE('2026-07-03', 'YYYY-MM-DD') FROM dual;
-- Résultat : 03-JUL-26`,
          },
          {
            type: "table",
            title: "Masques de format de date",
            headers: ["Masque", "Description", "Exemple"],
            rows: [
              ["YYYY", "Année 4 chiffres", "2026"],
              ["YY", "Année 2 chiffres", "26"],
              ["MM", "Mois (01-12)", "07"],
              ["MON", "Mois abrégé", "JUL"],
              ["MONTH", "Mois complet", "JULY"],
              ["DD", "Jour (01-31)", "03"],
              ["DY", "Jour abrégé", "FRI"],
              ["DAY", "Jour complet", "FRIDAY"],
              ["HH24", "Heure (00-23)", "14"],
              ["HH12", "Heure (01-12)", "02"],
              ["MI", "Minutes (00-59)", "30"],
              ["SS", "Secondes (00-59)", "00"],
            ],
          },
          {
            type: "table",
            title: "Fonctions de gestion des NULL",
            headers: ["Fonction", "Description", "Exemple"],
            rows: [
              ["NVL(expr, val)", "Remplace NULL par val", "NVL(commission, 0)"],
              ["NVL2(expr, val1, val2)", "val1 si non-NULL, val2 sinon", "NVL2(comm, comm, 0)"],
              ["COALESCE(e1, e2, ...)", "Première valeur non-NULL", "COALESCE(comm, bonus, 0)"],
              ["NULLIF(e1, e2)", "NULL si e1=e2, sinon e1", "NULLIF(salary, 0)"],
              ["DECODE(expr, ...)", "IF/THEN/ELSE", "DECODE(dept, 10, 'IT', 'Autre')"],
            ],
          },
          {
            type: "code",
            title: "Gestion des NULL en pratique",
            code: `-- NVL : remplacer NULL
SELECT last_name, NVL(commission_pct, 0) AS commission
FROM employees;

-- NVL2 : trois cas
SELECT last_name,
    NVL2(commission_pct, 'Avec commission', 'Sans commission') AS statut
FROM employees;

-- COALESCE : première valeur non-NULL
SELECT COALESCE(phone, mobile, email, 'No contact') AS contact
FROM employees;

-- NULLIF : NULL si égalité
SELECT NULLIF(department_id, 50) AS dept
FROM employees;
-- Retourne NULL si dept = 50, sinon la valeur`,
          },
          {
            type: "warning",
            body: "NVL accepte exactement 2 arguments. COALESCE accepte un nombre illaire et est standard SQL. Préférez COALESCE pour la portabilité. L'examen teste la différence : NVL évalue TOUS les arguments, COALESCE utilise short-circuit evaluation.",
          },
          {
            type: "tip",
            body: "CASE est plus puissant et lisible que DECODE. CASE est standard SQL, DECODE est spécifique Oracle. CASE supporte des conditions complexes (> , <, LIKE), DECODE ne fait que l'égalité. Préférez CASE en production.",
          },
        ],
        keyPoints: [
          "TO_CHAR, TO_NUMBER, TO_DATE pour les conversions explicites",
          "NVL = 2 args, COALESCE = N args (standard SQL)",
          "NVL2 : 3 args (non-NULL → val1, NULL → val2)",
          "NULLIF : NULL si égalité, sinon la première valeur",
          "CASE > DECODE (standard, lisible, conditions complexes)",
        ],
        flashcards: [
          {
            id: "fc-m4-7",
            front: "Différence entre NVL et COALESCE ?",
            back: "NVL accepte 2 arguments et évalue toujours les deux. COALESCE accepte N arguments, est standard SQL, et utilise short-circuit evaluation (n'évalue que ce qui est nécessaire).",
            category: "Fonctions NULL",
          },
          {
            id: "fc-m4-8",
            front: "Que fait NULLIF(a, b) ?",
            back: "Retourne NULL si a = b, sinon retourne a. Utile pour éviter la division par zéro : NULLIF(count, 0).",
            category: "Fonctions NULL",
          },
          {
            id: "fc-m4-9",
            front: "CASE vs DECODE ?",
            back: "CASE est standard SQL, supporte des conditions complexes (>, <, LIKE) et est plus lisible. DECODE est spécifique Oracle et ne fait que l'égalité. Préférez CASE.",
            category: "Fonctions NULL",
          },
        ],
        exercises: [
          {
            id: "ex-m4-3",
            prompt: "Affichez le salaire avec 'N/A' si NULL, en utilisant NVL.",
            starterCode: "SELECT \nFROM employees;\n",
            solution: `SELECT NVL(TO_CHAR(salary), 'N/A') AS salaire
FROM employees;`,
            hint: "NVL a besoin du même type pour les deux arguments",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m5",
    number: 5,
    title: "Group Functions and GROUP BY",
    description: "Agréger les données avec GROUP BY, HAVING et les fonctions de groupe.",
    icon: "BarChart3",
    category: "Fondamentaux",
    estimatedHours: 3,
    lessons: [
      {
        id: "m5l1",
        title: "Fonctions d'agrégation et GROUP BY",
        duration: 35,
        objectives: [
          "Utiliser COUNT, SUM, AVG, MIN, MAX",
          "Grouper les données avec GROUP BY",
          "Filtrer les groupes avec HAVING",
          "Comprendre le comportement des NULL dans les agrégations",
        ],
        content: [
          {
            type: "text",
            title: "Fonctions d'agrégation",
            body: "Les fonctions d'agrégation opèrent sur un ensemble de lignes pour retourner une seule valeur. Elles sont essentielles pour les rapports et statistiques.",
          },
          {
            type: "table",
            title: "Fonctions d'agrégation",
            headers: ["Fonction", "Description", "Ignore NULL ?", "Exemple"],
            rows: [
              ["COUNT(*)", "Compte toutes les lignes", "Non (compte tout)", "COUNT(*)"],
              ["COUNT(expr)", "Compte les non-NULL", "Oui", "COUNT(commission)"],
              ["COUNT(DISTINCT expr)", "Compte les valeurs distinctes", "Oui", "COUNT(DISTINCT dept)"],
              ["SUM(expr)", "Somme", "Oui", "SUM(salary)"],
              ["AVG(expr)", "Moyenne", "Oui", "AVG(salary)"],
              ["MIN(expr)", "Minimum", "Oui", "MIN(salary)"],
              ["MAX(expr)", "Maximum", "Oui", "MAX(salary)"],
            ],
          },
          {
            type: "warning",
            body: "COUNT(*) compte toutes les lignes y compris celles avec NULL. COUNT(column) ignore les NULL de cette colonne. AVG ignore aussi les NULL : AVG de [10, 20, NULL] = 15, pas 10. C'est un piège classique de l'examen.",
          },
          {
            type: "code",
            title: "GROUP BY et HAVING",
            code: `-- Salaire moyen par département
SELECT department_id, AVG(salary) AS salaire_moyen
FROM employees
GROUP BY department_id;

-- Top départements par masse salariale
SELECT department_id, SUM(salary) AS total
FROM employees
GROUP BY department_id
HAVING SUM(salary) > 100000
ORDER BY total DESC;

-- Plusieurs colonnes de regroupement
SELECT department_id, job_id, COUNT(*), AVG(salary)
FROM employees
GROUP BY department_id, job_id
ORDER BY department_id, job_id;`,
          },
          {
            type: "diagram",
            title: "Fonctionnement de GROUP BY",
            body: `EMPLOYEES                    GROUP BY department_id

ID  NOM     DEPT  SALAIRE      DEPT  COUNT  AVG(salary)
1   Alice   10    5000         ─────────────────────────
2   Bob     20    4500    →    10    2      5250  (Alice+Charlie)
3   Charlie 10    5500         20    2      4750  (Bob+Diana)
4   Diana   20    5000         30    1      6000  (Eve)
5   Eve     30    6000`,
          },
          {
            type: "text",
            title: "WHERE vs HAVING",
            body: "WHERE filtre les lignes AVANT le regroupement. HAVING filtre les groupes APRÈS le regroupement. HAVING peut utiliser les fonctions d'agrégation, WHERE ne le peut pas.",
          },
          {
            type: "code",
            title: "WHERE + HAVING combinés",
            code: `-- Salaire moyen par département
-- pour les employés gagnant plus de 3000
-- dont la moyenne dépasse 5000
SELECT department_id, AVG(salary) AS moy
FROM employees
WHERE salary > 3000          -- Filtre les lignes AVANT
GROUP BY department_id
HAVING AVG(salary) > 5000    -- Filtre les groupes APRÈS
ORDER BY moy DESC;`,
          },
          {
            type: "warning",
            body: "Règle d'or : toute colonne non-agrégée dans le SELECT doit apparaître dans le GROUP BY. Sinon, Oracle lève ORA-00979. Exception : les colonnes dans les fonctions d'agrégation.",
          },
        ],
        keyPoints: [
          "COUNT(*) compte tout, COUNT(col) ignore les NULL",
          "AVG, SUM, MIN, MAX ignorent les NULL",
          "WHERE filtre avant GROUP BY, HAVING filtre après",
          "Toute colonne non-agrégée du SELECT doit être dans GROUP BY",
          "HAVING peut utiliser les fonctions d'agrégation, WHERE non",
        ],
        flashcards: [
          {
            id: "fc-m5-1",
            front: "Différence entre COUNT(*) et COUNT(column) ?",
            back: "COUNT(*) compte toutes les lignes y compris les NULL. COUNT(column) ignore les lignes où column IS NULL.",
            category: "GROUP BY",
          },
          {
            id: "fc-m5-2",
            front: "Différence entre WHERE et HAVING ?",
            back: "WHERE filtre les lignes AVANT le GROUP BY et ne peut pas utiliser de fonctions d'agrégation. HAVING filtre les groupes APRÈS et peut utiliser les fonctions d'agrégation.",
            category: "GROUP BY",
          },
          {
            id: "fc-m5-3",
            front: "Que vaut AVG(10, 20, NULL) ?",
            back: "15. AVG ignore les NULL, donc (10+20)/2 = 15, pas (10+20+0)/3 = 10.",
            category: "GROUP BY",
          },
        ],
        exercises: [
          {
            id: "ex-m5-1",
            prompt: "Comptez le nombre d'employés par département, en ne gardant que les départements avec plus de 3 employés.",
            starterCode: "SELECT department_id, \nFROM employees\n\n",
            solution: `SELECT department_id, COUNT(*) AS nb
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 3;`,
            hint: "Utilisez GROUP BY et HAVING COUNT(*) > 3",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Joins",
    description: "Maîtriser toutes les jointures : INNER, LEFT, RIGHT, FULL, SELF, CROSS, NATURAL.",
    icon: "Combine",
    category: "Intermédiaire",
    estimatedHours: 4,
    lessons: [
      {
        id: "m6l1",
        title: "INNER JOIN et équijointures",
        duration: 30,
        objectives: [
          "Comprendre le principe des jointures",
          "Écrire des INNER JOIN avec syntaxe standard et Oracle",
          "Utiliser les alias de table",
        ],
        content: [
          {
            type: "text",
            title: "Les jointures",
            body: "Une jointure combine des lignes de deux ou plusieurs tables selon une condition de liaison. L'INNER JOIN ne retourne que les lignes qui ont une correspondance dans les deux tables.",
          },
          {
            type: "diagram",
            title: "INNER JOIN visuel",
            body: `  EMPLOYEES              DEPARTMENTS        INNER JOIN
┌──┬──────┬─────┐    ┌──┬────────┐     ┌──────┬────────┐
│ID│ NOM  │DEPT │    │ID│  NAME  │     │ NOM  │ DNAME  │
├──┼──────┼─────┤    ├──┼────────┤     ├──────┼────────┤
│ 1│Alice │ 10  │───→│10│   IT   │     │Alice │   IT   │
│ 2│Bob   │ 20  │───→│20│   HR   │     │Bob   │   HR   │
│ 3│Charlie│ 99 │    │30│ Sales  │     │Diana │ Sales  │
│ 4│Diana │ 30  │───→└──┴────────┘     └──────┴────────┘
└──┴──────┴─────┘     Charlie (dept 99 n'existe pas) → exclu
                      Dept 30 (Sales) → inclus car Diana`,
          },
          {
            type: "code",
            title: "Syntaxes de INNER JOIN",
            code: `-- Syntaxe standard SQL (recommandée)
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- Syntaxe Oracle classique (ancienne)
SELECT e.first_name, e.last_name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id;

-- Jointure sur plusieurs colonnes
SELECT *
FROM employees e
JOIN job_history j ON e.employee_id = j.employee_id
                  AND e.job_id = j.job_id;`,
          },
          {
            type: "tip",
            body: "La syntaxe INNER JOIN ... ON est préférée car elle sépare clairement la condition de jointure du filtrage. L'ancienne syntaxe Oracle mélange tout dans WHERE, rendant les requêtes complexes difficiles à lire.",
          },
          {
            type: "warning",
            body: "Si vous oubliez la condition de jointure dans l'ancienne syntaxe (WHERE), vous obtenez un produit cartésien (CROSS JOIN). La syntaxe standard INNER JOIN ... ON force la condition, évitant ce piège.",
          },
          {
            type: "code",
            title: "Jointures multiples",
            code: `-- Trois tables jointes
SELECT e.first_name, d.department_name, l.city
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN locations l   ON d.location_id = l.location_id
WHERE l.country_id = 'US'
ORDER BY d.department_name;`,
          },
        ],
        keyPoints: [
          "INNER JOIN ne retourne que les lignes avec correspondance",
          "Syntaxe standard : JOIN ... ON (recommandée)",
          "Ancienne syntaxe Oracle : FROM a, b WHERE a.id = b.id",
          "Les alias de table simplifient l'écriture",
          "Oublier la condition de jointure = produit cartésien",
        ],
        flashcards: [
          {
            id: "fc-m6-1",
            front: "Que retourne un INNER JOIN ?",
            back: "Uniquement les lignes qui ont une correspondance dans les DEUX tables. Les lignes sans correspondance sont exclues.",
            category: "JOIN",
          },
          {
            id: "fc-m6-2",
            front: "Quelle syntaxe de jointure est recommandée ?",
            back: "INNER JOIN ... ON (syntaxe standard SQL). Elle sépare la condition de jointure du filtrage, contrairement à l'ancienne syntaxe Oracle (FROM a, b WHERE ...).",
            category: "JOIN",
          },
        ],
        exercises: [
          {
            id: "ex-m6-1",
            prompt: "Affichez le nom des employés et le nom de leur département.",
            starterCode: "SELECT e.first_name, \nFROM employees e\n",
            solution: `SELECT e.first_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;`,
            hint: "Utilisez JOIN ... ON",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m6l2",
        title: "OUTER JOIN : LEFT, RIGHT, FULL",
        duration: 30,
        objectives: [
          "Comprendre LEFT, RIGHT et FULL OUTER JOIN",
          "Utiliser la syntaxe Oracle (+) vs standard",
          "Identifier les lignes non correspondantes",
        ],
        content: [
          {
            type: "diagram",
            title: "Types de OUTER JOIN",
            body: `LEFT JOIN              RIGHT JOIN             FULL JOIN
(table de gauche       (table de droite       (toutes les lignes
garde tout)            garde tout)            des deux tables)

  A     B               A     B               A     B
┌───┐ ┌───┐           ┌───┐ ┌───┐           ┌───┐ ┌───┐
│ 1 │→│ 1 │           │ 1 │→│ 1 │           │ 1 │→│ 1 │
│ 2 │→│ 2 │           │ 2 │→│ 2 │           │ 2 │→│ 2 │
│ 3 │  │   │           │   │  │ 3 │           │ 3 │  │   │
│   │  │ 4 │           │   │  │ 4 │           │   │  │ 4 │
└───┘ └───┘           └───┘ └───┘           └───┘ └───┘
  ↑ garde 3              ↑ garde 3,4            ↑ garde 3 et 4
    (NULL pour B)          (NULL pour A)          (NULL côté manquant)`,
          },
          {
            type: "code",
            title: "Syntaxes de OUTER JOIN",
            code: `-- LEFT OUTER JOIN : tous les employés, même sans département
SELECT e.first_name, d.department_name
FROM employees e
LEFT OUTER JOIN departments d ON e.department_id = d.department_id;

-- RIGHT OUTER JOIN : tous les départements, même sans employés
SELECT e.first_name, d.department_name
FROM employees e
RIGHT OUTER JOIN departments d ON e.department_id = d.department_id;

-- FULL OUTER JOIN : tous les employés ET tous les départements
SELECT e.first_name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;`,
          },
          {
            type: "code",
            title: "Ancienne syntaxe Oracle avec (+)",
            code: `-- LEFT OUTER JOIN (ancienne syntaxe)
SELECT e.first_name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id(+);
-- (+) sur departments = LEFT JOIN (garde tous les employés)

-- RIGHT OUTER JOIN (ancienne syntaxe)
SELECT e.first_name, d.department_name
FROM employees e, departments d
WHERE e.department_id(+) = d.department_id;
-- (+) sur employees = RIGHT JOIN (garde tous les départements)`,
          },
          {
            type: "warning",
            body: "Le (+) va du côté de la table qui peut manquer (qui recevra des NULL). L'ancienne syntaxe ne supporte pas le FULL OUTER JOIN. Le (+) ne peut pas être des deux côtés. L'examen teste cette syntaxe.",
          },
          {
            type: "tip",
            body: "Le mot OUTER est optionnel : LEFT JOIN = LEFT OUTER JOIN. Mais l'inclure améliore la lisibilité, surtout pour les débutants.",
          },
        ],
        keyPoints: [
          "LEFT JOIN garde toutes les lignes de gauche, NULL à droite si pas de match",
          "RIGHT JOIN garde toutes les lignes de droite, NULL à gauche si pas de match",
          "FULL JOIN garde toutes les lignes des deux tables",
          "Ancienne syntaxe : (+) du côté de la table qui peut manquer",
          "Le (+) ne peut pas être des deux côtés (pas de FULL JOIN)",
        ],
        flashcards: [
          {
            id: "fc-m6-3",
            front: "Dans l'ancienne syntaxe, où place-t-on le (+) ?",
            back: "Du côté de la table qui peut manquer (qui recevra des NULL). Pour un LEFT JOIN, le (+) va sur la table de droite.",
            category: "JOIN",
          },
          {
            id: "fc-m6-4",
            front: "L'ancienne syntaxe Oracle supporte-t-elle le FULL OUTER JOIN ?",
            back: "Non. Le (+) ne peut pas être des deux côtés. Pour un FULL JOIN, il faut utiliser la syntaxe standard FULL OUTER JOIN ... ON.",
            category: "JOIN",
          },
        ],
        exercises: [
          {
            id: "ex-m6-2",
            prompt: "Affichez tous les départements et leurs employés, y compris les départements sans employés.",
            starterCode: "SELECT d.department_name, e.first_name\nFROM \n",
            solution: `SELECT d.department_name, e.first_name
FROM departments d
LEFT OUTER JOIN employees e ON d.department_id = e.department_id;`,
            hint: "LEFT JOIN depuis departments",
            difficulty: "intermediate",
          },
        ],
      },
      {
        id: "m6l3",
        title: "SELF JOIN, CROSS JOIN et NATURAL JOIN",
        duration: 25,
        objectives: [
          "Réaliser des auto-jointures (SELF JOIN)",
          "Comprendre le produit cartésien (CROSS JOIN)",
          "Utiliser NATURAL JOIN et ses dangers",
        ],
        content: [
          {
            type: "text",
            title: "SELF JOIN",
            body: "Une auto-jointure relie une table à elle-même. C'est utile pour les structures hiérarchiques (employé → manager) ou les relations entre entités du même type.",
          },
          {
            type: "code",
            title: "SELF JOIN : employé et manager",
            code: `-- Afficher chaque employé avec son manager
SELECT e.first_name AS employe,
       m.first_name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id;

-- Avec LEFT JOIN pour inclure les employés sans manager
SELECT e.first_name AS employe,
       m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;`,
          },
          {
            type: "text",
            title: "CROSS JOIN (produit cartésien)",
            body: "Un CROSS JOIN combine chaque ligne de la première table avec chaque ligne de la seconde. Si table A a 100 lignes et table B a 50, le résultat a 5000 lignes. Utile pour générer des combinaisons, dangereux par accident.",
          },
          {
            type: "code",
            title: "CROSS JOIN",
            code: `-- Syntaxe explicite
SELECT e.first_name, d.department_name
FROM employees e
CROSS JOIN departments d;

-- Ancienne syntaxe (sans condition de jointure)
SELECT e.first_name, d.department_name
FROM employees e, departments d;
-- DANGER : produit cartésien involontaire !`,
          },
          {
            type: "text",
            title: "NATURAL JOIN",
            body: "NATURAL JOIN joint automatiquement sur toutes les colonnes de même nom dans les deux tables. Pratique mais DANGEREUX : si une colonne de même nom est ajoutée, la jointure change silencieusement.",
          },
          {
            type: "code",
            title: "NATURAL JOIN et USING",
            code: `-- NATURAL JOIN : joint sur toutes les colonnes de même nom
SELECT * FROM employees
NATURAL JOIN departments;
-- Joint sur department_id (et toute autre colonne de même nom)

-- USING : joint sur des colonnes spécifiques de même nom
SELECT e.first_name, d.department_name
FROM employees e
JOIN departments d USING (department_id);
-- Plus sûr que NATURAL JOIN`,
          },
          {
            type: "warning",
            body: "NATURAL JOIN est dangereux en production : l'ajout d'une colonne de même nom dans les deux tables modifie silencieusement la jointure. Préférez JOIN ... ON explicite. L'examen teste cette spécificité.",
          },
          {
            type: "tip",
            body: "Avec USING, ne préfixez pas la colonne de jointure avec l'alias : USING (department_id), pas USING (e.department_id). La colonne appartient aux deux tables.",
          },
        ],
        keyPoints: [
          "SELF JOIN : une table jointe à elle-même (alias différents)",
          "CROSS JOIN : produit cartésien (N×M lignes)",
          "NATURAL JOIN : joint sur toutes les colonnes de même nom (dangereux)",
          "USING (col) : joint sur une colonne de même nom (plus sûr)",
          "Avec USING, pas de préfixe d'alias sur la colonne",
        ],
        flashcards: [
          {
            id: "fc-m6-5",
            front: "Pourquoi NATURAL JOIN est-il dangereux ?",
            back: "Il joint automatiquement sur TOUTES les colonnes de même nom. L'ajout d'une colonne de même nom dans les deux tables modifie la jointure silencieusement, pouvant casser des requêtes en production.",
            category: "JOIN",
          },
          {
            id: "fc-m6-6",
            front: "Qu'est-ce qu'un CROSS JOIN ?",
            back: "Un produit cartésien : chaque ligne de la table A est combinée avec chaque ligne de la table B. Si A a 100 lignes et B en a 50, le résultat a 5000 lignes.",
            category: "JOIN",
          },
        ],
        exercises: [
          {
            id: "ex-m6-3",
            prompt: "Affichez chaque employé avec le nom de son manager (SELF JOIN).",
            starterCode: "SELECT e.first_name AS emp, \nFROM \n",
            solution: `SELECT e.first_name AS emp, m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;`,
            hint: "Joignez employees avec lui-même via manager_id",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m7",
    number: 7,
    title: "Subqueries",
    description: "Maîtriser les sous-requêtes : single-row, multiple-row, correlated, EXISTS.",
    icon: "GitBranch",
    category: "Intermédiaire",
    estimatedHours: 4,
    lessons: [
      {
        id: "m7l1",
        title: "Types de sous-requêtes",
        duration: 35,
        objectives: [
          "Distinguer single-row et multiple-row subqueries",
          "Choisir le bon opérateur selon le type",
          "Éviter les erreurs ORA-01427 et ORA-01797",
        ],
        content: [
          {
            type: "text",
            title: "Sous-requêtes (Subqueries)",
            body: "Une sous-requête est une requête imbriquée dans une autre. Elle permet d'utiliser le résultat d'une requête comme condition d'une autre. Il existe deux types principaux : single-row (retourne 1 ligne) et multiple-row (retourne plusieurs lignes).",
          },
          {
            type: "table",
            title: "Types de sous-requêtes",
            headers: ["Type", "Retourne", "Opérateurs", "Erreur si mismatch"],
            rows: [
              ["Single-row", "1 ligne, 1 colonne", "=, !=, >, <, >=, <=", "ORA-01427"],
              ["Multiple-row", "N lignes, 1 colonne", "IN, ANY, ALL, NOT IN", "ORA-01797"],
              ["Multiple-column", "N lignes, M colonnes", "IN (tuples)", "—"],
              ["Correlated", "Dépend de la requête externe", "EXISTS, IN", "—"],
            ],
          },
          {
            type: "code",
            title: "Single-row subquery",
            code: `-- Employés gagnant plus que la moyenne
SELECT first_name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees
);

-- Employé avec le salaire le plus élevé
SELECT first_name, salary
FROM employees
WHERE salary = (
    SELECT MAX(salary) FROM employees
);`,
          },
          {
            type: "code",
            title: "Multiple-row subquery",
            code: `-- Employés des départements localisés aux USA
SELECT first_name
FROM employees
WHERE department_id IN (
    SELECT department_id
    FROM departments
    WHERE location_id IN (
        SELECT location_id FROM locations WHERE country_id = 'US'
    )
);

-- Employés gagnant plus que TOUS les employés du dept 10
SELECT first_name, salary
FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department_id = 10
);

-- Employés gagnant plus qu'AU MOINS UN du dept 10
SELECT first_name, salary
FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department_id = 10
);`,
          },
          {
            type: "warning",
            body: "ORA-01427 : single-row subquery returns more than one row. Si une sous-requête censée retourner 1 ligne en retourne plusieurs, Oracle lève cette erreur. Utilisez IN, ANY, ALL ou ajoutez un filtre pour garantir une seule ligne.",
          },
          {
            type: "table",
            title: "ANY vs ALL",
            headers: ["Opérateur", "Signification", "Équivalent"],
            rows: [
              ["> ANY (subquery)", "Plus grand qu'AU MOINS UN", "> MIN de la sous-requête"],
              ["< ANY (subquery)", "Plus petit qu'AU MOINS UN", "< MAX de la sous-requête"],
              ["> ALL (subquery)", "Plus grand que TOUS", "> MAX de la sous-requête"],
              ["< ALL (subquery)", "Plus petit que TOUS", "< MIN de la sous-requête"],
            ],
          },
          {
            type: "tip",
            body: "> ALL est équivalent à > MAX(subquery). > ANY est équivalent à > MIN(subquery). Mémorisez cette équivalence pour l'examen : elle permet de vérifier rapidement vos réponses.",
          },
        ],
        keyPoints: [
          "Single-row : 1 ligne, opérateurs =, >, <, etc.",
          "Multiple-row : N lignes, opérateurs IN, ANY, ALL",
          "ANY = au moins un, ALL = tous",
          "> ALL = > MAX, > ANY = > MIN",
          "ORA-01427 si single-row subquery retourne plusieurs lignes",
        ],
        flashcards: [
          {
            id: "fc-m7-1",
            front: "Que signifie > ALL (subquery) ?",
            back: "Plus grand que TOUTES les valeurs de la sous-requête. Équivalent à > MAX(subquery).",
            category: "Subqueries",
          },
          {
            id: "fc-m7-2",
            front: "Que signifie > ANY (subquery) ?",
            back: "Plus grand qu'AU MOINS UNE valeur de la sous-requête. Équivalent à > MIN(subquery).",
            category: "Subqueries",
          },
          {
            id: "fc-m7-3",
            front: "Quelle erreur si une single-row subquery retourne plusieurs lignes ?",
            back: "ORA-01427 : single-row subquery returns more than one row. Solution : utiliser IN, ANY, ALL ou filtrer pour garantir une seule ligne.",
            category: "Subqueries",
          },
        ],
        exercises: [
          {
            id: "ex-m7-1",
            prompt: "Trouvez les employés gagnant plus que le salaire moyen de leur département.",
            starterCode: "SELECT e.first_name, e.salary\nFROM employees e\nWHERE \n",
            solution: `SELECT e.first_name, e.salary
FROM employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department_id = e.department_id
);`,
            hint: "C'est une sous-requête corrélée",
            difficulty: "advanced",
          },
        ],
      },
      {
        id: "m7l2",
        title: "Sous-requêtes corrélées et EXISTS",
        duration: 30,
        objectives: [
          "Comprendre les sous-requêtes corrélées",
          "Utiliser EXISTS et NOT EXISTS",
          "Différencier EXISTS vs IN en performance",
        ],
        content: [
          {
            type: "text",
            title: "Sous-requêtes corrélées",
            body: "Une sous-requête corrélée référence une colonne de la requête externe. Elle est ré-exécutée pour chaque ligne de la requête externe. EXISTS est l'opérateur principal pour ce pattern.",
          },
          {
            type: "code",
            title: "EXISTS vs IN",
            code: `-- EXISTS : employés qui ont au moins une entrée dans job_history
SELECT e.first_name
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM job_history j
    WHERE j.employee_id = e.employee_id
);

-- Équivalent avec IN
SELECT e.first_name
FROM employees e
WHERE e.employee_id IN (
    SELECT employee_id FROM job_history
);

-- NOT EXISTS : départements sans employés
SELECT d.department_name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1 FROM employees e
    WHERE e.department_id = d.department_id
);`,
          },
          {
            type: "table",
            title: "EXISTS vs IN",
            headers: ["Critère", "EXISTS", "IN"],
            rows: [
              ["Évaluation", "Ligne par ligne (correlated)", "Toutes les valeurs d'abord"],
              ["Optimal si", "Sous-requête retourne beaucoup de lignes", "Sous-requête retourne peu de lignes"],
              ["NULL handling", "Pas de problème", "NOT IN + NULL = problème"],
              ["Index", "Utilise l'index de la table externe", "Utilise l'index de la sous-requête"],
            ],
          },
          {
            type: "warning",
            body: "NOT IN avec NULL est dangereux : si la sous-requête retourne ne serait-ce qu'un NULL, NOT IN retourne 0 lignes. NOT EXISTS n'a pas ce problème. C'est un piège classique de l'examen.",
          },
          {
            type: "code",
            title: "Piège NOT IN avec NULL",
            code: `-- DANGEREUX : si commission_pct contient des NULL
SELECT department_name
FROM departments
WHERE department_id NOT IN (
    SELECT department_id FROM employees
    WHERE commission_pct IS NOT NULL
);
-- Si un seul department_id est NULL dans la sous-requête,
-- NOT IN retourne 0 lignes !

-- SÛR avec NOT EXISTS
SELECT d.department_name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1 FROM employees e
    WHERE e.department_id = d.department_id
    AND e.commission_pct IS NOT NULL
);`,
          },
        ],
        keyPoints: [
          "Sous-requête corrélée : référence la requête externe, ré-exécutée par ligne",
          "EXISTS : vrai si la sous-requête retourne au moins 1 ligne",
          "NOT EXISTS gère les NULL correctement, pas NOT IN",
          "EXISTS optimal si la sous-requête retourne beaucoup de lignes",
          "IN optimal si la sous-requête retourne peu de lignes",
        ],
        flashcards: [
          {
            id: "fc-m7-4",
            front: "Pourquoi NOT IN avec NULL est-il dangereux ?",
            back: "Si la sous-requête retourne ne serait-ce qu'un NULL, NOT IN retourne 0 lignes car NULL != valeur est UNKNOWN. NOT EXISTS n'a pas ce problème.",
            category: "Subqueries",
          },
          {
            id: "fc-m7-5",
            front: "Quand préférer EXISTS à IN ?",
            back: "Quand la sous-requête retourne beaucoup de lignes. EXISTS s'arrête à la première correspondance trouvée, alors que IN doit évaluer toute la liste.",
            category: "Subqueries",
          },
        ],
        exercises: [
          {
            id: "ex-m7-2",
            prompt: "Trouvez les départements qui n'ont aucun employé, en utilisant NOT EXISTS.",
            starterCode: "SELECT d.department_name\nFROM departments d\nWHERE \n",
            solution: `SELECT d.department_name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1 FROM employees e
    WHERE e.department_id = d.department_id
);`,
            hint: "NOT EXISTS avec une sous-requête corrélée",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m8",
    number: 8,
    title: "Set Operators",
    description: "Combiner des résultats avec UNION, UNION ALL, INTERSECT, MINUS.",
    icon: "Union",
    category: "Intermédiaire",
    estimatedHours: 2,
    lessons: [
      {
        id: "m8l1",
        title: "UNION, UNION ALL, INTERSECT, MINUS",
        duration: 30,
        objectives: [
          "Combiner des résultats avec les opérateurs ensemblistes",
          "Comprendre les règles de compatibilité",
          "Différencier UNION et UNION ALL",
        ],
        content: [
          {
            type: "diagram",
            title: "Opérateurs ensemblistes",
            body: `UNION          UNION ALL        INTERSECT        MINUS
A ∪ B          A ∪ B (avec     A ∩ B            A - B
(sans doublons)  doublons)

┌─────┐        ┌─────┐         ┌─────┐         ┌─────┐
│  1  │        │  1  │         │  1  │         │  1  │
│  2  │        │  2  │         │  2  │         │     │
│  3  │        │  3  │         │     │         │     │
└──┬──┘        └──┬──┘         └──┬──┘         └──┬──┘
   │              │               │               │
┌──┴──┐        ┌──┴──┐         ┌──┴──┐         ┌──┴──┐
│  2  │        │  2  │         │  2  │         │  2  │
│  3  │        │  3  │         │  3  │         │  3  │
│  4  │        │  4  │         │  4  │         │  4  │
└─────┘        └─────┘         └─────┘         └─────┘
= 1,2,3,4     = 1,2,2,3,3,4   = 2,3           = 1`,
          },
          {
            type: "code",
            title: "Syntaxe des opérateurs ensemblistes",
            code: `-- UNION : combine sans doublons (tri implicite)
SELECT job_id FROM employees
UNION
SELECT job_id FROM job_history;

-- UNION ALL : combine avec doublons (plus rapide)
SELECT job_id FROM employees
UNION ALL
SELECT job_id FROM job_history;

-- INTERSECT : lignes communes
SELECT department_id FROM employees
INTERSECT
SELECT department_id FROM departments;

-- MINUS : dans le premier mais pas dans le second
SELECT department_id FROM departments
MINUS
SELECT department_id FROM employees;`,
          },
          {
            type: "table",
            title: "Comparaison des opérateurs",
            headers: ["Opérateur", "Doublons", "Tri", "Performance"],
            rows: [
              ["UNION", "Éliminés", "Oui (implicite)", "Plus lent (tri + dédoublonnage)"],
              ["UNION ALL", "Conservés", "Non", "Plus rapide"],
              ["INTERSECT", "Éliminés", "Oui", "Moyen"],
              ["MINUS", "Éliminés", "Oui", "Moyen"],
            ],
          },
          {
            type: "warning",
            body: "Règles de compatibilité : les deux requêtes doivent avoir le MÊME nombre de colonnes, et les types correspondants colonne par colonne. Les noms de colonnes du résultat viennent de la PREMIÈRE requête. ORDER BY ne peut apparaître qu'à la fin globale.",
          },
          {
            type: "tip",
            body: "Préférez UNION ALL à UNION quand vous savez qu'il n'y a pas de doublons ou que vous les voulez. UNION ALL évite le tri et le dédoublonnage, ce qui le rend beaucoup plus rapide sur de gros volumes.",
          },
          {
            type: "code",
            title: "ORDER BY avec opérateurs ensemblistes",
            code: `-- ORDER BY à la fin, sur tout l'ensemble
SELECT employee_id, 'current' AS source FROM employees
UNION ALL
SELECT employee_id, 'history' AS source FROM job_history
ORDER BY employee_id, source;
-- Le tri s'applique au résultat combiné complet`,
          },
        ],
        keyPoints: [
          "UNION dédoublonne et trie, UNION ALL conserve tout (plus rapide)",
          "INTERSECT retourne les lignes communes",
          "MINUS retourne les lignes du premier non dans le second",
          "Même nombre de colonnes et types compatibles requis",
          "ORDER BY global à la fin uniquement",
        ],
        flashcards: [
          {
            id: "fc-m8-1",
            front: "Différence entre UNION et UNION ALL ?",
            back: "UNION élimine les doublons et trie (plus lent). UNION ALL conserve tous les doublons et ne trie pas (plus rapide). Préférez UNION ALL si pas de doublons.",
            category: "Set Operators",
          },
          {
            id: "fc-m8-2",
            front: "D'où viennent les noms de colonnes du résultat d'un UNION ?",
            back: "De la PREMIÈRE requête. Les noms de la deuxième requête sont ignorés.",
            category: "Set Operators",
          },
          {
            id: "fc-m8-3",
            front: "Où peut-on placer ORDER BY avec des opérateurs ensemblistes ?",
            back: "Uniquement à la fin, sur tout l'ensemble combiné. Pas de ORDER BY dans les requêtes individuelles.",
            category: "Set Operators",
          },
        ],
        exercises: [
          {
            id: "ex-m8-1",
            prompt: "Listez tous les job_id distincts présents dans employees ET job_history.",
            starterCode: "SELECT job_id FROM employees\n\nSELECT job_id FROM job_history;\n",
            solution: `SELECT job_id FROM employees
UNION
SELECT job_id FROM job_history;`,
            hint: "Utilisez UNION pour dédoublonner",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
  {
    id: "m9",
    number: 9,
    title: "Data Manipulation Language",
    description: "Insérer, modifier et supprimer des données avec INSERT, UPDATE, DELETE, MERGE.",
    icon: "Pencil",
    category: "Intermédiaire",
    estimatedHours: 3,
    lessons: [
      {
        id: "m9l1",
        title: "INSERT, UPDATE, DELETE",
        duration: 30,
        objectives: [
          "Insérer des données avec INSERT",
          "Modifier avec UPDATE",
          "Supprimer avec DELETE",
          "Comprendre les transactions",
        ],
        content: [
          {
            type: "code",
            title: "INSERT",
            code: `-- Insertion simple
INSERT INTO employees (employee_id, first_name, last_name, salary)
VALUES (207, 'Jean', 'Dupont', 5000);

-- Insertion sans liste de colonnes (toutes)
INSERT INTO departments
VALUES (280, 'Data Science', 100, 1700);

-- Insertion depuis une autre table
INSERT INTO emp_archive
SELECT * FROM employees WHERE hire_date < '2010-01-01';

-- Insertion multi-table (Oracle)
INSERT ALL
    INTO emp_sal (employee_id, salary) VALUES (emp_id, sal)
    INTO emp_dept (employee_id, dept_id) VALUES (emp_id, dept)
SELECT employee_id AS emp_id, salary AS sal, department_id AS dept
FROM employees WHERE department_id = 10;`,
          },
          {
            type: "code",
            title: "UPDATE",
            code: `-- Update simple
UPDATE employees
SET salary = salary * 1.10
WHERE department_id = 10;

-- Update multi-colonnes
UPDATE employees
SET salary = 6000,
    commission_pct = 0.15
WHERE employee_id = 101;

-- Update avec sous-requête
UPDATE employees
SET salary = (
    SELECT MAX(salary) FROM employees WHERE department_id = 10
)
WHERE employee_id = 200;`,
          },
          {
            type: "code",
            title: "DELETE",
            code: `-- Delete simple
DELETE FROM employees WHERE employee_id = 207;

-- Delete avec sous-requête
DELETE FROM employees
WHERE department_id IN (
    SELECT department_id FROM departments WHERE location_id = 1700
);

-- Delete toutes les lignes (transactionnel, annulable)
DELETE FROM employees;
ROLLBACK; -- Annule la suppression`,
          },
          {
            type: "warning",
            body: "Toujours utiliser WHERE avec UPDATE et DELETE en production. Sans WHERE, toutes les lignes sont affectées. En développement, utilisez BEGIN ... ROLLBACK pour tester en toute sécurité.",
          },
          {
            type: "table",
            title: "DELETE vs TRUNCATE",
            headers: ["Critère", "DELETE", "TRUNCATE"],
            rows: [
              ["Catégorie", "DML", "DDL"],
              ["Transactionnel", "Oui (annulable)", "Non (auto-commit)"],
              ["Vitesse", "Lent (ligne par ligne)", "Ultra-rapide"],
              ["WHERE", "Supporté", "Non supporté"],
              ["Triggers", "Déclenchés", "Non déclenchés"],
              ["Reset storage", "Non", "Oui (HIGH WATER MARK)"],
            ],
          },
        ],
        keyPoints: [
          "INSERT : une ou plusieurs lignes, avec ou sans liste de colonnes",
          "UPDATE : SET colonne = valeur, toujours avec WHERE",
          "DELETE : toujours avec WHERE, transactionnel (annulable)",
          "TRUNCATE est DDL (non annulable), DELETE est DML (annulable)",
          "INSERT ALL pour l'insertion multi-table (Oracle)",
        ],
        flashcards: [
          {
            id: "fc-m9-1",
            front: "DELETE déclenche-t-il les triggers ?",
            back: "Oui. DELETE est DML et déclenche les triggers de type DELETE. TRUNCATE est DDL et ne déclenche PAS les triggers.",
            category: "DML",
          },
          {
            id: "fc-m9-2",
            front: "Peut-on faire un ROLLBACK après un DELETE sans WHERE ?",
            back: "Oui. DELETE est transactionnel, même sans WHERE. ROLLBACK annule la suppression. TRUNCATE, en revanche, ne peut pas être annulé.",
            category: "DML",
          },
        ],
        exercises: [
          {
            id: "ex-m9-1",
            prompt: "Augmentez de 10% le salaire des employés du département 20.",
            starterCode: "UPDATE employees\nSET \n",
            solution: `UPDATE employees
SET salary = salary * 1.10
WHERE department_id = 20;`,
            hint: "SET salary = salary * 1.10 avec WHERE",
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "m9l2",
        title: "MERGE : l'upsert Oracle",
        duration: 25,
        objectives: [
          "Comprendre le principe de l'upsert",
          "Écrire des requêtes MERGE",
          "Utiliser MERGE pour la synchronisation de données",
        ],
        content: [
          {
            type: "text",
            title: "MERGE (upsert)",
            body: "MERGE combine INSERT et UPDATE en une seule opération. Si la ligne existe (condition de jointure satisfaite), on fait un UPDATE. Sinon, on fait un INSERT. C'est idéal pour synchroniser des données entre deux tables.",
          },
          {
            type: "code",
            title: "Syntaxe MERGE",
            code: `MERGE INTO employees e
USING new_employees n
ON (e.employee_id = n.employee_id)
WHEN MATCHED THEN
    UPDATE SET e.salary = n.salary, e.job_id = n.job_id
WHEN NOT MATCHED THEN
    INSERT (employee_id, first_name, last_name, salary, job_id)
    VALUES (n.employee_id, n.first_name, n.last_name, n.salary, n.job_id);`,
          },
          {
            type: "diagram",
            title: "Logique MERGE",
            body: `Source (new_employees)    Cible (employees)
┌────┬──────┐              ┌────┬──────┐
│ ID │ Nom  │              │ ID │ Nom  │
├────┼──────┤              ├────┼──────┤
│  1 │ Alice│── MATCH ──→  │  1 │ ?    │ → UPDATE
│  2 │ Bob  │── MATCH ──→  │  2 │ ?    │ → UPDATE
│  3 │ Carl │── NO MATCH   │    │      │ → INSERT (ID=3)
└────┴──────┘              └────┴──────┘`,
          },
          {
            type: "tip",
            body: "MERGE est plus efficace qu'une combinaison de INSERT + UPDATE séparés car il ne parcourt les données qu'une seule fois. Idéal pour les ETL et la synchronisation de tables.",
          },
          {
            type: "warning",
            body: "Dans MERGE, la clause WHEN MATCHED THEN UPDATE ne peut pas mettre à jour les colonnes utilisées dans la condition ON. Sinon, Oracle lève ORA-38104.",
          },
        ],
        keyPoints: [
          "MERGE = upsert (UPDATE si existe, INSERT sinon)",
          "ON définit la condition de correspondance",
          "WHEN MATCHED THEN UPDATE, WHEN NOT MATCHED THEN INSERT",
          "Ne pas updater les colonnes du ON (ORA-38104)",
          "Plus efficace que INSERT + UPDATE séparés",
        ],
        flashcards: [
          {
            id: "fc-m9-3",
            front: "Qu'est-ce que MERGE ?",
            back: "Un upsert : si la ligne existe (condition ON satisfaite), UPDATE. Sinon, INSERT. Combine les deux opérations en une seule passe.",
            category: "DML",
          },
          {
            id: "fc-m9-4",
            front: "Quelle erreur si on update une colonne du ON dans MERGE ?",
            back: "ORA-38104 : columns referenced in the ON clause cannot be updated. Les colonnes de la condition de jointure ne peuvent pas être modifiées.",
            category: "DML",
          },
        ],
        exercises: [
          {
            id: "ex-m9-2",
            prompt: "Écrivez un MERGE qui met à jour le salaire si l'employé existe, sinon l'insère.",
            starterCode: "MERGE INTO employees e\nUSING new_data n\nON \n",
            solution: `MERGE INTO employees e
USING new_data n
ON (e.employee_id = n.employee_id)
WHEN MATCHED THEN
    UPDATE SET e.salary = n.salary
WHEN NOT MATCHED THEN
    INSERT (employee_id, first_name, salary)
    VALUES (n.employee_id, n.first_name, n.salary);`,
            hint: "ON, WHEN MATCHED THEN UPDATE, WHEN NOT MATCHED THEN INSERT",
            difficulty: "advanced",
          },
        ],
      },
    ],
  },
  {
    id: "m10",
    number: 10,
    title: "DDL: Creating and Managing Tables",
    description: "Créer et gérer les structures : tables, contraintes, index, vues, séquences.",
    icon: "Table",
    category: "Avancé",
    estimatedHours: 4,
    lessons: [
      {
        id: "m10l1",
        title: "CREATE TABLE et contraintes",
        duration: 35,
        objectives: [
          "Créer des tables avec les bons types de données",
          "Définir des contraintes (PK, FK, UK, CHECK, NOT NULL)",
          "Comprendre les types de données Oracle",
        ],
        content: [
          {
            type: "table",
            title: "Types de données Oracle principaux",
            headers: ["Type", "Description", "Exemple"],
            rows: [
              ["VARCHAR2(n)", "Chaîne variable (max 4000 bytes)", "VARCHAR2(100)"],
              ["NUMBER(p, s)", "Nombre (précision, échelle)", "NUMBER(8,2)"],
              ["DATE", "Date + heure (sans secondes frac.)", "DATE"],
              ["TIMESTAMP", "Date + heure + fractions de seconde", "TIMESTAMP(6)"],
              ["CLOB", "Texte long (jusqu'à 4 GB)", "CLOB"],
              ["BLOB", "Binaire long (jusqu'à 4 GB)", "BLOB"],
              ["INTEGER", "Entier (= NUMBER(38))", "INTEGER"],
              ["CHAR(n)", "Chaîne fixe (complétée par espaces)", "CHAR(10)"],
            ],
          },
          {
            type: "code",
            title: "CREATE TABLE avec contraintes",
            code: `CREATE TABLE employees (
    employee_id   NUMBER        PRIMARY KEY,
    first_name    VARCHAR2(50)  NOT NULL,
    last_name     VARCHAR2(50)  NOT NULL,
    email         VARCHAR2(100) CONSTRAINT uk_email UNIQUE,
    salary        NUMBER(8,2)   DEFAULT 0,
    hire_date     DATE          DEFAULT SYSDATE,
    department_id NUMBER,
    CONSTRAINT fk_dept FOREIGN KEY (department_id)
        REFERENCES departments(department_id),
    CONSTRAINT chk_salary CHECK (salary >= 0)
);`,
          },
          {
            type: "table",
            title: "Types de contraintes",
            headers: ["Contrainte", "Rôle", "Niveau"],
            rows: [
              ["PRIMARY KEY", "Unicité + NOT NULL", "Table ou colonne"],
              ["FOREIGN KEY", "Intégrité référentielle", "Table ou colonne"],
              ["UNIQUE", "Unicité (NULL autorisé)", "Table ou colonne"],
              ["CHECK", "Condition personnalisée", "Table ou colonne"],
              ["NOT NULL", "Obligatoire", "Colonne uniquement"],
            ],
          },
          {
            type: "tip",
            body: "NOT NULL est techniquement un CHECK (col IS NOT NULL). C'est la seule contrainte qui ne peut se définir qu'au niveau colonne, pas au niveau table. Les autres peuvent se définir aux deux niveaux.",
          },
          {
            type: "code",
            title: "ALTER TABLE : modifications",
            code: `-- Ajouter une colonne
ALTER TABLE employees ADD (phone VARCHAR2(20));

-- Modifier une colonne
ALTER TABLE employees MODIFY (salary NUMBER(10,2));

-- Supprimer une colonne
ALTER TABLE employees DROP COLUMN phone;

-- Renommer une colonne
ALTER TABLE employees RENAME COLUMN phone TO phone_number;

-- Ajouter une contrainte
ALTER TABLE employees
ADD CONSTRAINT chk_age CHECK (EXTRACT(YEAR FROM hire_date) >= 1990);

-- Supprimer une contrainte
ALTER TABLE employees DROP CONSTRAINT chk_age;

-- Désactiver / réactiver une contrainte
ALTER TABLE employees DISABLE CONSTRAINT fk_dept;
ALTER TABLE employees ENABLE CONSTRAINT fk_dept;`,
          },
          {
            type: "warning",
            body: "VARCHAR2 vs CHAR : CHAR(n) complète toujours avec des espaces jusqu'à n caractères, gaspillant de l'espace. VARCHAR2(n) ne stocke que les caractères réels. Préférez toujours VARCHAR2. CHAR n'est utile que pour des codes de longueur fixe.",
          },
        ],
        keyPoints: [
          "VARCHAR2 (variable) > CHAR (fixe, complété par espaces)",
          "NUMBER(p, s) : p = précision (chiffres totaux), s = échelle (décimales)",
          "PRIMARY KEY = UNIQUE + NOT NULL",
          "NOT NULL est la seule contrainte niveau colonne uniquement",
          "ALTER TABLE pour ajouter, modifier, supprimer colonnes et contraintes",
        ],
        flashcards: [
          {
            id: "fc-m10-1",
            front: "Différence entre VARCHAR2 et CHAR ?",
            back: "VARCHAR2(n) stocke uniquement les caractères réels (variable). CHAR(n) complète avec des espaces jusqu'à n (fixe). Préférez VARCHAR2.",
            category: "DDL",
          },
          {
            id: "fc-m10-2",
            front: "Quelle contrainte ne peut se définir qu'au niveau colonne ?",
            back: "NOT NULL. C'est techniquement un CHECK (col IS NOT NULL) mais ne peut se définir qu'au niveau colonne, pas au niveau table.",
            category: "DDL",
          },
          {
            id: "fc-m10-3",
            front: "Que signifie NUMBER(8,2) ?",
            back: "Précision 8 (8 chiffres au total), échelle 2 (2 décimales). Donc 6 chiffres avant la virgule, 2 après. Exemple : 123456.78",
            category: "DDL",
          },
        ],
        exercises: [
          {
            id: "ex-m10-1",
            prompt: "Créez une table 'products' avec id (PK), name (obligatoire), price (positif), et category_id (FK vers categories).",
            starterCode: "CREATE TABLE products (\n\n);\n",
            solution: `CREATE TABLE products (
    id          NUMBER PRIMARY KEY,
    name        VARCHAR2(100) NOT NULL,
    price       NUMBER(10,2) CHECK (price > 0),
    category_id NUMBER,
    CONSTRAINT fk_cat FOREIGN KEY (category_id) REFERENCES categories(id)
);`,
            hint: "PRIMARY KEY, NOT NULL, CHECK, FOREIGN KEY",
            difficulty: "intermediate",
          },
        ],
      },
      {
        id: "m10l2",
        title: "Vues, séquences, index et synonymes",
        duration: 30,
        objectives: [
          "Créer des vues simples et complexes",
          "Utiliser les séquences pour générer des IDs",
          "Comprendre les index et leur impact",
          "Créer des synonymes",
        ],
        content: [
          {
            type: "code",
            title: "Vues (Views)",
            code: `-- Vue simple
CREATE OR REPLACE VIEW v_emp_dept AS
SELECT e.employee_id, e.first_name, e.last_name,
       d.department_name, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Vue avec WITH CHECK OPTION (empêche les insertions hors scope)
CREATE OR REPLACE VIEW v_it_employees AS
SELECT * FROM employees WHERE department_id = 10
WITH CHECK OPTION;

-- Vue avec WITH READ ONLY
CREATE OR REPLACE VIEW v_dept_stats AS
SELECT department_id, COUNT(*) AS nb, AVG(salary) AS avg_sal
FROM employees GROUP BY department_id
WITH READ ONLY;`,
          },
          {
            type: "table",
            title: "Vues simples vs complexes",
            headers: ["Critère", "Vue simple", "Vue complexe"],
            rows: [
              ["Jointure", "Non", "Oui"],
              ["Fonction de groupe", "Non", "Oui"],
              ["DISTINCT / GROUP BY", "Non", "Oui"],
              ["DML possible", "Oui", "Non (généralement)"],
              ["WITH CHECK OPTION", "Possible", "N/A"],
            ],
          },
          {
            type: "code",
            title: "Séquences",
            code: `-- Créer une séquence
CREATE SEQUENCE seq_emp
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Utiliser NEXTVAL et CURRVAL
INSERT INTO employees (employee_id, first_name)
VALUES (seq_emp.NEXTVAL, 'Jean');

SELECT seq_emp.CURRVAL FROM dual;

-- Options de séquence
CREATE SEQUENCE seq_id
START WITH 100
INCREMENT BY 5
MAXVALUE 1000
CACHE 20
CYCLE; -- Recommence à 1 après MAXVALUE`,
          },
          {
            type: "warning",
            body: "NEXTVAL doit être appelé avant CURRVAL dans la session. Sinon, Oracle lève ORA-08002. Les séquences avec CACHE peuvent avoir des trous en cas de crash (les valeurs en cache sont perdues).",
          },
          {
            type: "code",
            title: "Index",
            code: `-- Index simple
CREATE INDEX idx_emp_name ON employees(last_name);

-- Index composite
CREATE INDEX idx_emp_dept_sal ON employees(department_id, salary);

-- Index unique
CREATE UNIQUE INDEX idx_emp_email ON employees(email);

-- Index basé sur fonction
CREATE INDEX idx_emp_upper_name ON employees(UPPER(last_name));

-- Supprimer un index
DROP INDEX idx_emp_name;`,
          },
          {
            type: "tip",
            body: "Les index accélèrent les SELECT mais ralentissent les INSERT/UPDATE/DELETE (maintenance de l'index). Ne pas indexer chaque colonne : indexer les colonnes fréquemment filtrées dans WHERE, utilisées dans JOIN, ou pour ORDER BY.",
          },
          {
            type: "code",
            title: "Synonymes",
            code: `-- Synonyme privé
CREATE SYNONYM emp FOR hr.employees;

-- Synonyme public (accessible à tous)
CREATE PUBLIC SYNONYM emp FOR hr.employees;

-- Utilisation
SELECT * FROM emp; -- Au lieu de hr.employees`,
          },
        ],
        keyPoints: [
          "Vue simple = DML possible, vue complexe = généralement non",
          "WITH CHECK OPTION empêche les modifications hors scope de la vue",
          "NEXTVAL avant CURRVAL, CACHE peut causer des trous",
          "Index = plus rapides en lecture, plus lents en écriture",
          "Synonymes = alias pour simplifier l'accès aux objets",
        ],
        flashcards: [
          {
            id: "fc-m10-4",
            front: "Quand doit-on appeler NEXTVAL avant CURRVAL ?",
            back: "NEXTVAL doit être appelé au moins une fois dans la session avant CURRVAL. Sinon, Oracle lève ORA-08002.",
            category: "DDL",
          },
          {
            id: "fc-m10-5",
            front: "Que fait WITH CHECK OPTION sur une vue ?",
            back: "Empêche les INSERT ou UPDATE qui produiraient des lignes hors du scope de la vue (qui ne seraient pas visibles via la vue).",
            category: "DDL",
          },
          {
            id: "fc-m10-6",
            front: "Pourquoi ne pas indexer toutes les colonnes ?",
            back: "Les index accélèrent la lecture mais ralentissent les INSERT/UPDATE/DELETE car chaque index doit être maintenu. Indexer uniquement les colonnes fréquemment utilisées dans WHERE, JOIN, ORDER BY.",
            category: "DDL",
          },
        ],
        exercises: [
          {
            id: "ex-m10-2",
            prompt: "Créez une vue 'v_high_earners' montrant les employés gagnant plus de 10000, en lecture seule.",
            starterCode: "CREATE OR REPLACE VIEW v_high_earners AS\n\n",
            solution: `CREATE OR REPLACE VIEW v_high_earners AS
SELECT * FROM employees WHERE salary > 10000
WITH READ ONLY;`,
            hint: "WITH READ ONLY",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m11",
    number: 11,
    title: "Analytic Functions (Window Functions)",
    description: "Maîtriser les fonctions analytiques : ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER.",
    icon: "TrendingUp",
    category: "Avancé",
    estimatedHours: 4,
    lessons: [
      {
        id: "m11l1",
        title: "Fonctions analytiques et clause OVER",
        duration: 40,
        objectives: [
          "Comprendre la clause OVER() et PARTITION BY",
          "Utiliser ROW_NUMBER, RANK, DENSE_RANK",
          "Maîtriser LAG, LEAD pour comparer des lignes",
          "Comprendre les fenêtres glissantes",
        ],
        content: [
          {
            type: "text",
            title: "Fonctions analytiques",
            body: "Les fonctions analytiques (window functions) calculent des valeurs sur un ensemble de lignes liées à la ligne courante, sans regrouper les résultats (contrairement à GROUP BY). Elles sont essentielles pour les classements, moyennes mobiles, et comparaisons inter-lignes.",
          },
          {
            type: "code",
            title: "Syntaxe de base",
            code: `-- Structure générale
function() OVER (
    PARTITION BY col   -- Groupe de lignes
    ORDER BY col        -- Ordre dans le groupe
    ROWS/RANGE BETWEEN  -- Fenêtre
)

-- Exemple : classement par salaire dans chaque département
SELECT first_name, department_id, salary,
    RANK() OVER (
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS rang
FROM employees;`,
          },
          {
            type: "table",
            title: "ROW_NUMBER vs RANK vs DENSE_RANK",
            headers: ["Fonction", "Comportement avec ex aequo", "Exemple (salaires: 5000, 5000, 4000)"],
            rows: [
              ["ROW_NUMBER", "Numéros uniques (arbitraire)", "1, 2, 3"],
              ["RANK", "Même rang, saute le suivant", "1, 1, 3"],
              ["DENSE_RANK", "Même rang, ne saute pas", "1, 1, 2"],
            ],
          },
          {
            type: "code",
            title: "Comparaison ROW_NUMBER, RANK, DENSE_RANK",
            code: `SELECT first_name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,
    RANK()       OVER (ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees
WHERE department_id = 10;

-- Résultat avec salaires 5000, 5000, 4000 :
-- Alice   5000  1  1  1
-- Bob     5000  2  1  1
-- Charlie 4000  3  3  2`,
          },
          {
            type: "code",
            title: "LAG et LEAD",
            code: `-- LAG : valeur de la ligne précédente
SELECT first_name, salary,
    LAG(salary, 1) OVER (ORDER BY salary) AS salaire_precedent,
    salary - LAG(salary, 1) OVER (ORDER BY salary) AS difference
FROM employees;

-- LEAD : valeur de la ligne suivante
SELECT first_name, salary,
    LEAD(salary, 1) OVER (ORDER BY salary DESC) AS salaire_suivant
FROM employees;

-- LAG avec valeur par défaut
SELECT first_name, hire_date,
    LAG(hire_date, 1, '2000-01-01') OVER (ORDER BY hire_date) AS precedent
FROM employees;`,
          },
          {
            type: "code",
            title: "SUM/AVG avec fenêtre glissante",
            code: `-- Somme cumulée par département
SELECT first_name, department_id, salary,
    SUM(salary) OVER (
        PARTITION BY department_id
        ORDER BY hire_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS somme_cumulee
FROM employees;

-- Moyenne mobile sur 3 lignes
SELECT first_name, salary,
    AVG(salary) OVER (
        ORDER BY hire_date
        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
    ) AS moyenne_mobile
FROM employees;`,
          },
          {
            type: "diagram",
            title: "Fenêtre glissante",
            body: `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING

Ligne 1: [1, 2]           → AVG(lignes 1 et 2)
Ligne 2: [1, 2, 3]        → AVG(lignes 1, 2 et 3)
Ligne 3: [2, 3, 4]        → AVG(lignes 2, 3 et 4)
Ligne 4: [3, 4, 5]        → AVG(lignes 3, 4 et 5)
Ligne 5: [4, 5]           → AVG(lignes 4 et 5)

UNBOUNDED PRECEDING = depuis le début
UNBOUNDED FOLLOWING = jusqu'à la fin
CURRENT ROW         = ligne courante`,
          },
          {
            type: "tip",
            body: "Les fonctions analytiques s'exécutent APRÈS WHERE, GROUP BY et HAVING, mais AVANT ORDER BY. Pour filtrer sur le résultat d'une fonction analytique, utilisez une sous-requête (CTE recommandée).",
          },
        ],
        keyPoints: [
          "OVER() définit la fenêtre d'analyse",
          "PARTITION BY = groupe, ORDER BY = ordre dans le groupe",
          "ROW_NUMBER = unique, RANK = saute, DENSE_RANK = ne saute pas",
          "LAG = précédent, LEAD = suivant",
          "ROWS BETWEEN pour les fenêtres glissantes",
          "Les fonctions analytiques s'exécutent après HAVING, avant ORDER BY",
        ],
        flashcards: [
          {
            id: "fc-m11-1",
            front: "Différence entre RANK et DENSE_RANK ?",
            back: "RANK saute les rangs après un ex aequo (1, 1, 3). DENSE_RANK ne saute pas (1, 1, 2). ROW_NUMBER donne toujours des numéros uniques (1, 2, 3).",
            category: "Analytic Functions",
          },
          {
            id: "fc-m11-2",
            front: "Que font LAG et LEAD ?",
            back: "LAG accède à la ligne précédente, LEAD à la ligne suivante, sans self-join. Utile pour comparer des valeurs consécutives.",
            category: "Analytic Functions",
          },
          {
            id: "fc-m11-3",
            front: "Quand s'exécutent les fonctions analytiques ?",
            back: "Après WHERE, GROUP BY et HAVING, mais avant ORDER BY. Pour filtrer sur leur résultat, il faut une sous-requête (CTE).",
            category: "Analytic Functions",
          },
        ],
        exercises: [
          {
            id: "ex-m11-1",
            prompt: "Classez les employés par salaire dans chaque département (sans saut de rang).",
            starterCode: "SELECT first_name, department_id, salary,\n    \nFROM employees;\n",
            solution: `SELECT first_name, department_id, salary,
    DENSE_RANK() OVER (
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS rang
FROM employees;`,
            hint: "DENSE_RANK avec PARTITION BY",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m12",
    number: 12,
    title: "Regular Expressions",
    description: "Utiliser les expressions régulières dans Oracle : REGEXP_LIKE, REGEXP_SUBSTR, etc.",
    icon: "Regex",
    category: "Avancé",
    estimatedHours: 3,
    lessons: [
      {
        id: "m12l1",
        title: "REGEXP_LIKE, REGEXP_SUBSTR, REGEXP_REPLACE",
        duration: 35,
        objectives: [
          "Comprendre la syntaxe des regex Oracle",
          "Filtrer avec REGEXP_LIKE",
          "Extraire et remplacer avec REGEXP_SUBSTR et REGEXP_REPLACE",
        ],
        content: [
          {
            type: "table",
            title: "Fonctions REGEXP",
            headers: ["Fonction", "Description", "Retourne"],
            rows: [
              ["REGEXP_LIKE(s, pattern)", "Teste si pattern match", "BOOLEAN (WHERE)"],
              ["REGEXP_SUBSTR(s, pattern)", "Extrait la sous-chaîne match", "VARCHAR2"],
              ["REGEXP_REPLACE(s, pattern, repl)", "Remplace le pattern", "VARCHAR2"],
              ["REGEXP_INSTR(s, pattern)", "Position du match", "NUMBER"],
              ["REGEXP_COUNT(s, pattern)", "Compte les occurrences", "NUMBER"],
            ],
          },
          {
            type: "code",
            title: "REGEXP_LIKE",
            code: `-- Noms commençant par une voyelle
SELECT first_name FROM employees
WHERE REGEXP_LIKE(first_name, '^[AEIOU]', 'i');

-- Emails valides (simplifié)
SELECT email FROM employees
WHERE REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

-- Numéros de téléphone au format XXX-XXX-XXXX
SELECT phone FROM contacts
WHERE REGEXP_LIKE(phone, '[0-9]{3}-[0-9]{3}-[0-9]{4}');`,
          },
          {
            type: "code",
            title: "REGEXP_SUBSTR et REGEXP_REPLACE",
            code: `-- Extraire le domaine d'un email
SELECT email,
    REGEXP_SUBSTR(email, '@([^@]+)$', 1, 1, 'i', 1) AS domaine
FROM employees;

-- Remplacer tous les chiffres par des #
SELECT REGEXP_REPLACE(phone, '[0-9]', '#') AS masked
FROM contacts;

-- Extraire le 3e mot
SELECT
    REGEXP_SUBSTR(description, '[^ ]+', 1, 3) AS third_word
FROM products;`,
          },
          {
            type: "table",
            title: "Métacaractères regex",
            headers: ["Symbole", "Description", "Exemple"],
            rows: [
              ["^", "Début de chaîne", "^Hello"],
              ["$", "Fin de chaîne", "world$"],
              [".", "N'importe quel caractère", "a.c"],
              ["*", "0 ou plusieurs", "ab*"],
              ["+", "1 ou plusieurs", "ab+"],
              ["?", "0 ou 1", "ab?"],
              ["{n}", "Exactement n", "a{3}"],
              ["{n,m}", "Entre n et m", "a{2,4}"],
              ["[...]", "Classe de caractères", "[AEIOU]"],
              ["(...)", "Groupe capturant", "(abc)+"],
              ["|", "OU", "cat|dog"],
            ],
          },
          {
            type: "tip",
            body: "Le 6e paramètre de REGEXP_SUBSTR est 'subexpr' : il retourne un groupe capturant spécifique. REGEXP_SUBSTR(email, '@(.+)', 1, 1, 'i', 1) retourne le domaine sans le @.",
          },
        ],
        keyPoints: [
          "REGEXP_LIKE pour filtrer (dans WHERE)",
          "REGEXP_SUBSTR pour extraire",
          "REGEXP_REPLACE pour remplacer",
          "REGEXP_INSTR pour la position, REGEXP_COUNT pour compter",
          "Le paramètre subexpr (6e) retourne un groupe capturant",
        ],
        flashcards: [
          {
            id: "fc-m12-1",
            front: "Quelle fonction regex utilise-t-on dans WHERE ?",
            back: "REGEXP_LIKE. Elle retourne un booléen, contrairement à LIKE qui utilise des wildcards simples.",
            category: "Regex",
          },
          {
            id: "fc-m12-2",
            front: "Que fait le 6e paramètre de REGEXP_SUBSTR ?",
            back: "subexpr : il retourne un groupe capturant spécifique. Par exemple, REGEXP_SUBSTR(email, '@(.+)', 1, 1, 'i', 1) retourne le domaine sans le @.",
            category: "Regex",
          },
        ],
        exercises: [
          {
            id: "ex-m12-1",
            prompt: "Trouvez les employés dont le nom contient exactement 5 lettres.",
            starterCode: "SELECT first_name FROM employees\nWHERE \n",
            solution: `SELECT first_name FROM employees
WHERE REGEXP_LIKE(first_name, '^[A-Za-z]{5}$');`,
            hint: "REGEXP_LIKE avec ^[A-Za-z]{5}$",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m13",
    number: 13,
    title: "Managing Objects and Data Dictionary",
    description: "Interroger le dictionnaire de données et gérer les objets Oracle.",
    icon: "BookOpen",
    category: "Avancé",
    estimatedHours: 2,
    lessons: [
      {
        id: "m13l1",
        title: "Le dictionnaire de données Oracle",
        duration: 25,
        objectives: [
          "Interroger les vues du dictionnaire",
          "Comprendre USER_, ALL_, DBA_",
          "Utiliser les vues de métadonnées",
        ],
        content: [
          {
            type: "text",
            title: "Le dictionnaire de données",
            body: "Oracle stocke les métadonnées (structure des tables, contraintes, index, etc.) dans le dictionnaire de données, accessible via des vues préfixées par USER_, ALL_ ou DBA_.",
          },
          {
            type: "table",
            title: "Préfixes des vues du dictionnaire",
            headers: ["Préfixe", "Portée", "Exemple"],
            rows: [
              ["USER_", "Objets de l'utilisateur courant", "USER_TABLES"],
              ["ALL_", "Objets accessibles à l'utilisateur", "ALL_TABLES"],
              ["DBA_", "Tous les objets de la base (DBA only)", "DBA_TABLES"],
            ],
          },
          {
            type: "code",
            title: "Interroger le dictionnaire",
            code: `-- Mes tables
SELECT table_name FROM user_tables;

-- Toutes les tables accessibles
SELECT owner, table_name FROM all_tables;

-- Colonnes d'une table
SELECT column_name, data_type, nullable
FROM user_tab_columns
WHERE table_name = 'EMPLOYEES';

-- Contraintes d'une table
SELECT constraint_name, constraint_type
FROM user_constraints
WHERE table_name = 'EMPLOYEES';

-- Vues
SELECT view_name, text FROM user_views;

-- Séquences
SELECT sequence_name, last_number FROM user_sequences;

-- Index
SELECT index_name, table_name, uniqueness
FROM user_indexes;`,
          },
          {
            type: "table",
            title: "Vues courantes du dictionnaire",
            headers: ["Vue", "Description"],
            rows: [
              ["USER_TABLES", "Tables de l'utilisateur"],
              ["USER_TAB_COLUMNS", "Colonnes des tables"],
              ["USER_CONSTRAINTS", "Contraintes"],
              ["USER_INDEXES", "Index"],
              ["USER_VIEWS", "Vues"],
              ["USER_SEQUENCES", "Séquences"],
              ["USER_SYNONYMS", "Synonymes"],
              ["USER_OBJECTS", "Tous les objets"],
              ["CAT (USER_CATALOG)", "Liste des objets"],
            ],
          },
          {
            type: "tip",
            body: "Les noms d'objets dans le dictionnaire sont en MAJUSCULES par défaut (Oracle convertit les identificateurs non quotés). Toujours utiliser WHERE table_name = 'EMPLOYEES' (majuscules), pas 'employees'.",
          },
        ],
        keyPoints: [
          "USER_ = mes objets, ALL_ = accessibles, DBA_ = tous (privégié)",
          "USER_TABLES, USER_TAB_COLUMNS, USER_CONSTRAINTS sont les plus courantes",
          "Les noms d'objets sont en MAJUSCULES dans le dictionnaire",
          "CAT est un alias pour USER_CATALOG",
        ],
        flashcards: [
          {
            id: "fc-m13-1",
            front: "Différence entre USER_, ALL_ et DBA_ ?",
            back: "USER_ = objets possédés par l'utilisateur. ALL_ = objets accessibles (propres + avec droits). DBA_ = tous les objets de la base (requiert des privilèges DBA).",
            category: "Data Dictionary",
          },
          {
            id: "fc-m13-2",
            front: "Dans quelle casse sont les noms d'objets dans le dictionnaire ?",
            back: "En MAJUSCULES. Oracle convertit les identificateurs non quotés en majuscules. Toujours utiliser WHERE table_name = 'EMPLOYEES'.",
            category: "Data Dictionary",
          },
        ],
        exercises: [
          {
            id: "ex-m13-1",
            prompt: "Listez toutes les colonnes de la table EMPLOYEES avec leur type de données.",
            starterCode: "SELECT \nFROM \nWHERE \n",
            solution: `SELECT column_name, data_type
FROM user_tab_columns
WHERE table_name = 'EMPLOYEES';`,
            hint: "USER_TAB_COLUMNS avec table_name en majuscules",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
  {
    id: "m14",
    number: 14,
    title: "Exam Preparation and Strategy",
    description: "Stratégies, astuces et pièges pour réussir l'examen 1Z0-071.",
    icon: "GraduationCap",
    category: "Préparation",
    estimatedHours: 2,
    lessons: [
      {
        id: "m14l1",
        title: "Format de l'examen et stratégies",
        duration: 30,
        objectives: [
          "Connaître le format de l'examen 1Z0-071",
          "Maîtriser les stratégies de gestion du temps",
          "Identifier les pièges les plus fréquents",
        ],
        content: [
          {
            type: "text",
            title: "Format de l'examen 1Z0-071",
            body: "L'examen Oracle Database SQL (1Z0-071) dure 120 minutes, contient 63 questions à choix multiples, et requiert un score de 63% pour réussir. Il couvre les fondamentaux SQL, les jointures, sous-requêtes, fonctions analytiques et manipulation d'objets.",
          },
          {
            type: "table",
            title: "Domaines de l'examen",
            headers: ["Domaine", "Poids", "Description"],
            rows: [
              ["Relational Database Management", "8%", "Concepts relationnels"],
              ["Retrieving Data Using SELECT", "12%", "SELECT, WHERE, ORDER BY"],
              ["Restricting and Sorting", "12%", "Filtrage et tri"],
              ["Single-Row Functions", "12%", "Fonctions mono-ligne"],
              ["Group Functions", "12%", "Agrégations et GROUP BY"],
              ["Joins", "12%", "Tous types de jointures"],
              ["Subqueries", "12%", "Sous-requêtes"],
              ["Set Operators", "10%", "UNION, INTERSECT, MINUS"],
              ["Data Manipulation", "10%", "INSERT, UPDATE, DELETE, MERGE"],
            ],
          },
          {
            type: "text",
            title: "Stratégies de gestion du temps",
            body: "Avec 120 minutes pour 63 questions, vous avez environ 1m54s par question. Ne restez pas bloqué : marquez les questions difficiles et revenez-y. Répondez à toutes les questions (pas de pénalité pour les mauvaises réponses).",
          },
          {
            type: "table",
            title: "Pièges les plus fréquents",
            headers: ["Piège", "Solution"],
            rows: [
              ["NULL = NULL retourne FALSE", "Utiliser IS NULL"],
              ["COUNT(*) vs COUNT(col)", "Comprendre la différence NULL"],
              ["ROWNUM avant ORDER BY", "Utiliser FETCH FIRST ou sous-requête"],
              ["ORDER BY et alias du SELECT", "Seul ORDER BY peut les utiliser"],
              ["DDL auto-commit", "TRUNCATE non annulable"],
              ["NOT IN avec NULL", "Utiliser NOT EXISTS"],
              ["NVL vs COALESCE", "2 args vs N args"],
              ["(+) pour OUTER JOIN", "Côté de la table qui peut manquer"],
            ],
          },
          {
            type: "tip",
            body: "Lisez chaque question DEUX FOIS. Oracle aime inclure des détails subtils : 'Which two...' (choisir 2 réponses), 'Choose the best...' (une seule). Les distracteurs sont conçus pour paraître corrects. Éliminez d'abord les réponses clairement fausses.",
          },
          {
            type: "warning",
            body: "Attention aux questions 'Which statement is true/false' : lisez bien s'il faut choisir TRUE ou FALSE. Beaucoup de candidats échouent en sélectionnant la bonne réponse à la mauvaise question.",
          },
        ],
        keyPoints: [
          "63 questions, 120 minutes, 63% pour réussir",
          "Environ 1m54s par question",
          "Pas de pénalité pour mauvaise réponse → répondre à tout",
          "Lire chaque question deux fois",
          "Éliminer les distracteurs clairement faux d'abord",
        ],
        flashcards: [
          {
            id: "fc-m14-1",
            front: "Combien de questions et quel score pour réussir le 1Z0-071 ?",
            back: "63 questions en 120 minutes. Score minimum : 63% pour réussir.",
            category: "Examen",
          },
          {
            id: "fc-m14-2",
            front: "Y a-t-il une pénalité pour les mauvaises réponses ?",
            back: "Non. Pas de pénalité pour les mauvaises réponses. Il faut répondre à toutes les questions, même en devinant.",
            category: "Examen",
          },
        ],
        exercises: [],
      },
    ],
  },
  {
    id: "m15",
    number: 15,
    title: "Commandes SQL*Plus et SQLcl",
    description: "Maîtriser les commandes d'interface (CONNECT, DESCRIBE, SPOOL, SET, SHOW, scripts) utiles en pratique et en examen.",
    icon: "Terminal",
    category: "Outils Oracle",
    estimatedHours: 2,
    lessons: [
      {
        id: "m15l1",
        title: "Prise en main SQL*Plus / SQLcl",
        duration: 35,
        objectives: [
          "Comprendre la différence entre commandes SQL et commandes d'interface",
          "Utiliser CONNECT, DESC, SHOW, SET",
          "Exécuter des scripts et générer des rapports avec SPOOL",
        ],
        content: [
          {
            type: "text",
            title: "Pourquoi cette partie est importante",
            body: "Cette partie complète la maîtrise SQL par l'usage terrain. En entreprise, vous exécutez souvent vos scripts via SQL*Plus/SQLcl pour automatiser, diagnostiquer et produire des rapports. Ces commandes ne modifient pas la logique SQL, mais elles sont cruciales pour l'efficacité opérationnelle.",
          },
          {
            type: "table",
            title: "Commandes SQL*Plus / SQLcl essentielles",
            headers: ["Commande", "Rôle", "Exemple"],
            rows: [
              ["CONNECT", "Se connecter à la base", "CONNECT hr/hr@orcl"],
              ["DESC / DESCRIBE", "Afficher la structure d'un objet", "DESC employees"],
              ["SET", "Configurer l'affichage", "SET LINESIZE 200"],
              ["SHOW", "Afficher un paramètre/session", "SHOW USER"],
              ["SPOOL", "Rediriger la sortie vers fichier", "SPOOL rapport.txt"],
              ["@script.sql", "Exécuter un script SQL", "@init_schema.sql"],
              ["HOST", "Lancer une commande OS", "HOST dir"],
              ["EXIT", "Quitter l'outil", "EXIT"],
            ],
          },
          {
            type: "code",
            title: "Session type de travail",
            code: `-- 1) Connexion
CONNECT hr/hr@orcl

-- 2) Vérification utilisateur
SHOW USER

-- 3) Vérification structure table
DESC employees

-- 4) Exécution d'un script
@setup_data.sql

-- 5) Génération d'un rapport
SPOOL rapport_employees.txt
SELECT department_id, COUNT(*) AS total
FROM employees
GROUP BY department_id
ORDER BY department_id;
SPOOL OFF`,
          },
          {
            type: "tip",
            body: "Pour des exports lisibles, configurez l'affichage avant vos SELECT : SET PAGESIZE, SET LINESIZE, SET FEEDBACK, SET HEADING. Cela évite les sorties tronquées.",
          },
          {
            type: "warning",
            body: "Ne mélangez pas commandes SQL*Plus et SQL pur dans les réponses d'examen : CONNECT, SPOOL, SET, SHOW ne sont pas des commandes SQL standard.",
          },
        ],
        keyPoints: [
          "SQL*Plus/SQLcl = commandes d'interface, pas SQL standard",
          "CONNECT, DESC, SET, SHOW, SPOOL sont les plus utilisées",
          "SPOOL permet de produire des rapports exportables",
          "Les scripts se lancent avec @fichier.sql",
          "Toujours distinguer syntaxe SQL et syntaxe outil",
        ],
        flashcards: [
          {
            id: "fc-m15-1",
            front: "Quelle commande exécute un script dans SQL*Plus ?",
            back: "La commande @nom_script.sql (ou START).",
            category: "SQL*Plus",
          },
          {
            id: "fc-m15-2",
            front: "SPOOL fait quoi ?",
            back: "Redirige la sortie SQL*Plus vers un fichier (journal, rapport, export texte).",
            category: "SQL*Plus",
          },
        ],
        exercises: [
          {
            id: "ex-m15-1",
            prompt: "Écrivez une mini-session SQL*Plus pour vous connecter, afficher USER, décrire EMPLOYEES et lancer un script report.sql.",
            starterCode: "-- Votre session ici\n",
            solution: `CONNECT hr/hr@orcl
SHOW USER
DESC employees
@report.sql`,
            hint: "Utilisez CONNECT, SHOW USER, DESC, @script",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
  {
    id: "m16",
    number: 16,
    title: "Sécurité Oracle : utilisateurs, privilèges et rôles",
    description: "Gérer CREATE USER, GRANT, REVOKE, rôles et bonnes pratiques de sécurité SQL Oracle.",
    icon: "Shield",
    category: "Administration SQL",
    estimatedHours: 3,
    lessons: [
      {
        id: "m16l1",
        title: "Users, privileges, roles",
        duration: 40,
        objectives: [
          "Créer et gérer des utilisateurs Oracle",
          "Distinguer privilèges système et privilèges objet",
          "Utiliser les rôles pour simplifier la gestion des droits",
        ],
        content: [
          {
            type: "text",
            title: "Pourquoi cette partie est importante",
            body: "Un bon SQL engineer ne fait pas que requêter des données : il sécurise aussi les accès. Ce chapitre explique comment appliquer le principe du moindre privilège et structurer les droits proprement en environnement Oracle.",
          },
          {
            type: "table",
            title: "Types de privilèges",
            headers: ["Type", "Description", "Exemple"],
            rows: [
              ["Privilège système", "Droit global sur la base", "CREATE SESSION, CREATE TABLE"],
              ["Privilège objet", "Droit sur un objet précis", "GRANT SELECT ON hr.employees TO alice"],
              ["Rôle", "Groupe de privilèges", "CREATE ROLE analyste"],
            ],
          },
          {
            type: "code",
            title: "Cycle complet de sécurité",
            code: `-- Création utilisateur
CREATE USER alice IDENTIFIED BY "Mot2Passe_123";

-- Privilèges système minimaux
GRANT CREATE SESSION TO alice;
GRANT CREATE TABLE TO alice;

-- Privilège objet
GRANT SELECT, INSERT ON hr.employees TO alice;

-- Retrait d'un droit
REVOKE INSERT ON hr.employees FROM alice;

-- Création de rôle
CREATE ROLE reporting_role;
GRANT SELECT ON hr.employees TO reporting_role;
GRANT reporting_role TO alice;`,
          },
          {
            type: "warning",
            body: "Évitez les droits trop larges (comme GRANT ALL PRIVILEGES ou des rôles puissants non contrôlés). En production, appliquez toujours le moindre privilège et auditez les accès.",
          },
          {
            type: "tip",
            body: "WITH GRANT OPTION permet à l'utilisateur de redistribuer le privilège objet. À utiliser avec prudence : cela crée des chaînes de délégation parfois difficiles à contrôler.",
          },
        ],
        keyPoints: [
          "CREATE USER + GRANT CREATE SESSION = base de connexion",
          "Privilèges système ≠ privilèges objet",
          "Les rôles simplifient la gestion des droits",
          "REVOKE retire explicitement un droit accordé",
          "Appliquer le principe du moindre privilège",
        ],
        flashcards: [
          {
            id: "fc-m16-1",
            front: "Différence privilège système / objet ?",
            back: "Système = droit global (ex: CREATE TABLE). Objet = droit sur un objet précis (ex: SELECT sur HR.EMPLOYEES).",
            category: "Sécurité",
          },
          {
            id: "fc-m16-2",
            front: "Pourquoi utiliser des rôles ?",
            back: "Pour centraliser et simplifier l'attribution de droits à plusieurs utilisateurs de façon cohérente.",
            category: "Sécurité",
          },
        ],
        exercises: [
          {
            id: "ex-m16-1",
            prompt: "Créez un rôle lecture_only, accordez-lui SELECT sur HR.EMPLOYEES, puis attribuez-le à l'utilisateur BOB.",
            starterCode: "-- Votre script SQL ici\n",
            solution: `CREATE ROLE lecture_only;
GRANT SELECT ON hr.employees TO lecture_only;
GRANT lecture_only TO bob;`,
            hint: "CREATE ROLE puis GRANT ... TO role puis GRANT role TO user",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m17",
    number: 17,
    title: "Transactions TCL et cohérence des données",
    description: "Maîtriser COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION et les effets DDL/DML.",
    icon: "RefreshCcw",
    category: "Transactions",
    estimatedHours: 2,
    lessons: [
      {
        id: "m17l1",
        title: "COMMIT, ROLLBACK, SAVEPOINT en pratique",
        duration: 35,
        objectives: [
          "Piloter une transaction de bout en bout",
          "Utiliser SAVEPOINT pour rollback partiel",
          "Comprendre DDL auto-commit et ses impacts",
        ],
        content: [
          {
            type: "text",
            title: "Pourquoi cette partie est importante",
            body: "Les transactions garantissent la cohérence des données. Savoir exactement quand les données sont validées, annulables, ou implicitement commitées est indispensable pour éviter les incidents en production et répondre correctement aux questions pièges du 1Z0-071.",
          },
          {
            type: "code",
            title: "Transaction contrôlée",
            code: `-- Début logique de transaction (implicite après le 1er DML)
INSERT INTO employees (employee_id, first_name, salary)
VALUES (999, 'Test', 4000);

SAVEPOINT s1;

UPDATE employees
SET salary = salary + 500
WHERE employee_id = 999;

-- Annuler seulement l'UPDATE
ROLLBACK TO s1;

-- Valider l'INSERT
COMMIT;`,
          },
          {
            type: "code",
            title: "SET TRANSACTION",
            code: `-- Transaction en lecture seule
SET TRANSACTION READ ONLY;

SELECT * FROM employees WHERE department_id = 10;

-- Toute tentative DML sera refusée dans cette transaction`,
          },
          {
            type: "warning",
            body: "Un DDL (CREATE/ALTER/DROP/TRUNCATE) fait un COMMIT implicite avant et après exécution. Même si vous pensiez pouvoir rollback votre DML, c'est trop tard après DDL.",
          },
          {
            type: "table",
            title: "Comportement transactionnel",
            headers: ["Action", "Annulable ?", "Auto-commit ?"],
            rows: [
              ["INSERT/UPDATE/DELETE", "Oui (avant COMMIT)", "Non"],
              ["MERGE", "Oui (avant COMMIT)", "Non"],
              ["CREATE/ALTER/DROP", "Non", "Oui"],
              ["TRUNCATE", "Non", "Oui"],
            ],
          },
        ],
        keyPoints: [
          "COMMIT valide définitivement la transaction",
          "ROLLBACK annule les changements non commit",
          "SAVEPOINT permet un rollback partiel",
          "SET TRANSACTION configure le mode transactionnel",
          "DDL provoque un commit implicite",
        ],
        flashcards: [
          {
            id: "fc-m17-1",
            front: "Que fait ROLLBACK TO SAVEPOINT s1 ?",
            back: "Annule uniquement les changements effectués après le savepoint s1.",
            category: "Transactions",
          },
          {
            id: "fc-m17-2",
            front: "Peut-on rollback un TRUNCATE ?",
            back: "Non. TRUNCATE est DDL et déclenche un COMMIT implicite.",
            category: "Transactions",
          },
        ],
        exercises: [
          {
            id: "ex-m17-1",
            prompt: "Écrivez un script avec INSERT, SAVEPOINT, UPDATE, ROLLBACK TO SAVEPOINT, puis COMMIT.",
            starterCode: "-- Script transactionnel\n",
            solution: `INSERT INTO employees (employee_id, first_name, salary)
VALUES (1001, 'Demo', 3000);

SAVEPOINT before_raise;

UPDATE employees
SET salary = 3500
WHERE employee_id = 1001;

ROLLBACK TO before_raise;

COMMIT;`,
            hint: "Insérer, poser savepoint, modifier, rollback partiel, commit final",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "m18",
    number: 18,
    title: "Révision finale exhaustive 1Z0-071",
    description: "Synthèse complète, checklist finale et mini-guide de révision pour réussir l'examen.",
    icon: "ListChecks",
    category: "Préparation",
    estimatedHours: 3,
    lessons: [
      {
        id: "m18l1",
        title: "Checklist finale + pièges ultimes",
        duration: 45,
        objectives: [
          "Consolider tous les acquis du cours",
          "Réviser les pièges les plus testés",
          "Disposer d'une feuille de route finale avant examen",
        ],
        content: [
          {
            type: "text",
            title: "Explication d'ouverture",
            body: "Ce module fusionne l'approche pédagogique complète et l'annexe exhaustive des commandes Oracle SQL. L'objectif est de vous donner une vision définitive : quoi savoir, quoi pratiquer, et quoi éviter le jour J.",
          },
          {
            type: "table",
            title: "Checklist finale des commandes Oracle",
            headers: ["Famille", "Commandes clés", "Point d'attention examen"],
            rows: [
              ["DDL", "CREATE, ALTER, DROP, TRUNCATE, RENAME, COMMENT, ANALYZE, AUDIT, NOAUDIT, PURGE, FLASHBACK", "DDL = commit implicite"],
              ["DML", "SELECT, INSERT, UPDATE, DELETE, MERGE, INSERT ALL, SELECT FOR UPDATE, LOCK TABLE", "WHERE oublié = impact global"],
              ["DCL", "GRANT, REVOKE", "Système vs objet"],
              ["TCL", "COMMIT, ROLLBACK, SAVEPOINT, ROLLBACK TO SAVEPOINT, SET TRANSACTION", "Ordre et portée transactionnelle"],
              ["DQL", "SELECT (et ses clauses)", "WHERE/HAVING/ORDER BY"],
              ["SQL*Plus/SQLcl", "CONNECT, DESC, SET, SHOW, SPOOL, @, EXIT", "Pas du SQL standard"],
              ["Avancé Oracle", "CREATE VIEW, MATERIALIZED VIEW, INDEX, SYNONYM, SEQUENCE, TABLESPACE, EXPLAIN PLAN", "Contexte DBA/optimisation"],
            ],
          },
          {
            type: "table",
            title: "Pièges ultimes à mémoriser",
            headers: ["Piège", "Rappel correct"],
            rows: [
              ["WHERE col = NULL", "Toujours faux ; utiliser IS NULL"],
              ["ROWNUM + ORDER BY direct", "ROWNUM est assigné avant tri"],
              ["COUNT(col)", "Ignore les NULL"],
              ["Alias SELECT dans WHERE", "Impossible (ordre d'exécution)"],
              ["NOT IN avec NULL", "Peut retourner 0 ligne ; préférer NOT EXISTS"],
              ["NATURAL JOIN", "Dangereux en prod ; préférer JOIN ... ON explicite"],
              ["TRUNCATE + ROLLBACK", "Impossible"],
            ],
          },
          {
            type: "text",
            title: "Méthode de révision 5 jours",
            body: "Jour 1 : SELECT/WHERE/ORDER BY + fonctions mono-ligne.\nJour 2 : GROUP BY/HAVING + JOINs.\nJour 3 : Sous-requêtes + opérateurs ensemblistes.\nJour 4 : DML/DDL/TCL + dictionnaire.\nJour 5 : révision pièges + 2 examens blancs chronométrés.",
          },
          {
            type: "tip",
            body: "Pendant l'examen, marquez les questions ambiguës et avancez. Revenez dessus à la fin avec une seconde lecture focalisée sur les mots-clés (NOT, ONLY, BEST, TWO).",
          },
          {
            type: "warning",
            body: "Ne mémorisez pas seulement les syntaxes : comprenez l'ordre d'exécution SQL et la logique NULL. La plupart des erreurs viennent de là.",
          },
        ],
        keyPoints: [
          "Vision exhaustive DDL/DML/DCL/TCL/DQL + SQL*Plus",
          "Pièges majeurs : NULL, ROWNUM, GROUP BY, NOT IN",
          "Révision structurée en 5 jours",
          "Priorité à la compréhension logique, pas seulement la syntaxe",
        ],
        flashcards: [
          {
            id: "fc-m18-1",
            front: "Quel est le piège classique avec NOT IN ?",
            back: "Si la sous-requête contient un NULL, NOT IN peut retourner 0 ligne. Préférez NOT EXISTS.",
            category: "Révision",
          },
          {
            id: "fc-m18-2",
            front: "Pourquoi WHERE col = NULL est faux ?",
            back: "Parce que NULL n'est ni égal ni différent ; la comparaison retourne UNKNOWN. Il faut IS NULL.",
            category: "Révision",
          },
        ],
        exercises: [
          {
            id: "ex-m18-1",
            prompt: "Écrivez une requête top-5 salaires correcte (sans piège ROWNUM).",
            starterCode: "SELECT *\nFROM employees\n",
            solution: `SELECT *
FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;`,
            hint: "Utiliser FETCH FIRST ou une sous-requête avec ROWNUM",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
];
