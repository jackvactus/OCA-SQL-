/**
 * Oracle 1Z0-071 — banque Q&R professionnelle
 * Sources : modules du site + documents OCA (1Z0-071 / SQL 2)
 * 230 questions — réponses vérifiées (Oracle SQL), multi-réponses type examen.
 */
import type { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  // ─── Module 1 — Fondamentaux ───────────────────────────────────────────
  {
    id: "q1",
    moduleId: "m1",
    question: "Quelle commande SQL est auto-validante (COMMIT implicite) ?",
    options: ["DELETE", "INSERT", "TRUNCATE", "SELECT"],
    correctIndexes: [2],
    explanation:
      "TRUNCATE est une commande DDL : Oracle exécute un COMMIT implicite avant et après. DELETE et INSERT sont du DML transactionnel (annulables). SELECT ne modifie pas les données.",
    topic: "DDL vs DML",
    difficulty: "easy",
  },
  {
    id: "q2",
    moduleId: "m1",
    question: "Quelle est la différence essentielle entre TRUNCATE et DELETE ?",
    options: [
      "TRUNCATE est plus lent que DELETE",
      "TRUNCATE est DDL (non annulable), DELETE est DML (annulable)",
      "TRUNCATE déclenche les triggers, DELETE non",
      "TRUNCATE supporte WHERE, DELETE non",
    ],
    correctIndexes: [1],
    explanation:
      "TRUNCATE (DDL) : rapide, auto-commit, ne déclenche pas les triggers, pas de WHERE. DELETE (DML) : transactionnel, déclenche les triggers, filtre possible avec WHERE.",
    topic: "DDL vs DML",
    difficulty: "easy",
  },
  {
    id: "q3",
    moduleId: "m1",
    question: "Quelle contrainte ne peut être définie qu'au niveau colonne ?",
    options: ["PRIMARY KEY", "FOREIGN KEY", "CHECK", "NOT NULL"],
    correctIndexes: [3],
    explanation:
      "NOT NULL est la seule contrainte exclusivement au niveau colonne. PRIMARY KEY, FOREIGN KEY, UNIQUE et CHECK peuvent être définies au niveau table ou colonne.",
    topic: "Contraintes",
    difficulty: "medium",
  },
  {
    id: "q4",
    moduleId: "m1",
    question:
      "Chaque étudiant peut suivre plusieurs projets et chaque projet peut avoir plusieurs étudiants. Quelles deux affirmations sont vraies pour le modèle ERD ?",
    options: [
      "Il suffit d'une relation 1:N entre STUDENTS et PROJECTS",
      "Il faut une relation N:N résolue en deux relations 1:N",
      "STUDENT_ID doit être clé primaire de STUDENTS et clé étrangère de PROJECTS",
      "Une table associative avec la clé composite (STUDENT_ID, PROJECT_ID) est nécessaire",
    ],
    correctIndexes: [1, 3],
    explanation:
      "Une relation many-to-many se résout par une table d'association (clé composite des deux FK). Placer la FK d'un côté seulement ne modélise qu'une relation 1:N.",
    topic: "Modèle relationnel",
    difficulty: "medium",
  },
  {
    id: "q5",
    moduleId: "m1",
    question: "Quelles trois affirmations sont vraies concernant les contraintes ?",
    options: [
      "Une contrainte peut être désactivée même si la colonne contient des données",
      "Toutes les contraintes peuvent être définies au niveau colonne et au niveau table",
      "Une clé étrangère ne peut jamais contenir de NULL",
      "Une colonne UNIQUE peut contenir des NULL",
      "Une contrainte n'est appliquée que pour INSERT",
      "Une clé primaire peut être composite (plusieurs colonnes)",
    ],
    correctIndexes: [0, 3, 5],
    explanation:
      "On peut DISABLE une contrainte avec des données présentes. UNIQUE autorise les NULL. Une PK peut être composite. Contre-exemples : NOT NULL n'existe qu'au niveau colonne ; une FK peut être NULL ; les contraintes s'appliquent aussi à UPDATE.",
    topic: "Contraintes",
    difficulty: "hard",
  },
  {
    id: "q6",
    moduleId: "m1",
    question: "Quelles deux affirmations sont vraies sur les contraintes de clé ?",
    options: [
      "Une table ne peut avoir qu'une seule PRIMARY KEY et une seule FOREIGN KEY",
      "Une table ne peut avoir qu'une seule PRIMARY KEY mais plusieurs FOREIGN KEY",
      "Seule la PRIMARY KEY peut être définie au niveau colonne et table",
      "La FOREIGN KEY et la PRIMARY KEY parent doivent avoir le même nom",
      "PRIMARY KEY et FOREIGN KEY peuvent être définies au niveau colonne et table",
    ],
    correctIndexes: [1, 4],
    explanation:
      "Une seule PRIMARY KEY par table, mais autant de FOREIGN KEY que nécessaire. Les deux types de contraintes se définissent au niveau colonne ou table. Les noms de colonnes parent/enfant n'ont pas besoin d'être identiques.",
    topic: "Contraintes",
    difficulty: "medium",
  },

  // ─── Module 2 — SELECT ─────────────────────────────────────────────────
  {
    id: "q7",
    moduleId: "m2",
    question: "Que retourne : SELECT * FROM employees WHERE commission = NULL ?",
    options: [
      "Tous les employés sans commission",
      "Tous les employés avec commission NULL",
      "Aucune ligne",
      "Une erreur de syntaxe",
    ],
    correctIndexes: [2],
    explanation:
      "NULL ne se compare jamais avec =. La condition vaut UNKNOWN → aucune ligne. Il faut écrire commission IS NULL.",
    topic: "NULL",
    difficulty: "easy",
  },
  {
    id: "q8",
    moduleId: "m2",
    question: "Quel est l'ordre d'exécution logique des clauses SQL ?",
    options: [
      "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
      "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
      "FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY",
      "SELECT → WHERE → FROM → GROUP BY → HAVING → ORDER BY",
    ],
    correctIndexes: [1],
    explanation:
      "Ordre logique : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. L'écriture commence par SELECT, mais l'évaluation commence par FROM.",
    topic: "Ordre des clauses",
    difficulty: "medium",
  },
  {
    id: "q9",
    moduleId: "m2",
    question: "Peut-on utiliser un alias de colonne du SELECT dans la clause WHERE ?",
    options: [
      "Oui, toujours",
      "Non, jamais",
      "Oui, uniquement avec AS",
      "Oui, si l'alias est entre guillemets doubles",
    ],
    correctIndexes: [1],
    explanation:
      "WHERE s'exécute avant SELECT : l'alias n'existe pas encore. ORDER BY, lui, peut utiliser les alias car il s'exécute en dernier.",
    topic: "Alias",
    difficulty: "medium",
  },
  {
    id: "q10",
    moduleId: "m2",
    question: "Que fait SELECT DISTINCT department_id FROM employees ?",
    options: [
      "Retourne tous les department_id y compris les doublons",
      "Retourne chaque department_id une seule fois",
      "Lève une erreur s'il y a des NULL",
      "Retourne le nombre de department_id distincts",
    ],
    correctIndexes: [1],
    explanation:
      "DISTINCT élimine les doublons. Les NULL comptent comme une valeur distincte (une seule ligne NULL).",
    topic: "DISTINCT",
    difficulty: "easy",
  },
  {
    id: "q11",
    moduleId: "m2",
    question: "Que fait l'opérateur || en Oracle ?",
    options: [
      "Division entière",
      "Concaténation de chaînes",
      "OU logique",
      "Comparaison d'égalité",
    ],
    correctIndexes: [1],
    explanation:
      "|| concatène des chaînes. 'Hello' || ' ' || 'World' → 'Hello World'. CONCAT() n'accepte que 2 arguments ; || est illimité.",
    topic: "Opérateurs",
    difficulty: "easy",
  },
  {
    id: "q12",
    moduleId: "m2",
    question:
      "Vous devez écrire une requête qui redemande les noms de colonnes à chaque exécution, mais ne demande le nom de table qu'une seule fois. Quelle syntaxe convient ?",
    options: [
      "SELECT &col1, '&col2' FROM &table WHERE &&condition = '&cond'",
      "SELECT &col1, &col2 FROM \"&table\" WHERE &condition = &cond",
      "SELECT &col1, &col2 FROM &&table WHERE &condition = &cond",
      "SELECT &col1, &col2 FROM &&table WHERE &condition = &&cond",
    ],
    correctIndexes: [2],
    explanation:
      "En SQL*Plus/SQLcl, &var invite à chaque usage ; &&var définit une variable de substitution permanente pour la session. &&table = invite une fois ; &col1/&col2/&condition = invite à chaque exécution.",
    topic: "Variables de substitution",
    difficulty: "hard",
  },

  // ─── Module 3 — ORDER BY ───────────────────────────────────────────────
  {
    id: "q13",
    moduleId: "m3",
    question: "Dans Oracle, où apparaissent les NULL avec ORDER BY ASC par défaut ?",
    options: ["En premier", "En dernier", "Au milieu", "Cela dépend du type de colonne"],
    correctIndexes: [1],
    explanation:
      "Par défaut Oracle place les NULL en dernier en ASC (et en premier en DESC). Contrôle explicite : NULLS FIRST / NULLS LAST.",
    topic: "ORDER BY et NULL",
    difficulty: "medium",
  },
  {
    id: "q14",
    moduleId: "m3",
    question: "Que se passe-t-il avec WHERE ROWNUM <= 5 ORDER BY salary DESC ?",
    options: [
      "Retourne correctement les 5 plus hauts salaires",
      "Prend 5 lignes arbitraires puis les trie",
      "Lève une erreur",
      "Retourne les 5 plus bas salaires",
    ],
    correctIndexes: [1],
    explanation:
      "ROWNUM est assigné avant ORDER BY. Pour un vrai Top-N : sous-requête triée, ou FETCH FIRST ... ROWS ONLY (12c+).",
    topic: "ROWNUM",
    difficulty: "hard",
  },
  {
    id: "q15",
    moduleId: "m3",
    question: "Que fait FETCH FIRST 5 ROWS WITH TIES ?",
    options: [
      "Retourne exactement 5 lignes",
      "Retourne 5 lignes plus les ex aequo de la 5e",
      "Retourne 5 lignes aléatoires",
      "Lève une erreur de syntaxe",
    ],
    correctIndexes: [1],
    explanation:
      "WITH TIES inclut toutes les lignes ayant la même valeur de tri que la dernière ligne retenue. ONLY (défaut) coupe strictement à N lignes.",
    topic: "FETCH FIRST",
    difficulty: "medium",
  },
  {
    id: "q16",
    moduleId: "m3",
    question: "Quel est le comportement par défaut de ORDER BY sur des chaînes ?",
    options: [
      "Le tri ignore la casse",
      "Le tri est sensible à la casse",
      "Les NULL sont exclus du tri",
      "Seules les colonnes du SELECT sont autorisées dans ORDER BY",
    ],
    correctIndexes: [1],
    explanation:
      "Le tri caractère est sensible à la casse (selon NLS_SORT). Les NULL sont inclus. ORDER BY peut référencer des colonnes absentes du SELECT (hors opérateurs ensemblistes).",
    topic: "ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q17",
    moduleId: "m3",
    question:
      "SELECT first_name, department_id, salary FROM employees ORDER BY department_id, first_name, salary DESC; Quelles deux affirmations sont vraies ?",
    options: [
      "salary est trié en DESC pour les employés ayant le même department_id et le même first_name",
      "first_name est trié en ASC pour un même department_id",
      "salary est trié en DESC pour tout un même department_id, indépendamment de first_name",
      "Toutes les colonnes sont triées en DESC",
      "first_name est trié en DESC pour un même department_id",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Les clés de tri s'appliquent dans l'ordre : d'abord department_id ASC, puis first_name ASC, puis salary DESC uniquement en cas d'égalité sur les deux premières clés.",
    topic: "ORDER BY multi-colonnes",
    difficulty: "medium",
  },

  // ─── Module 4 — Fonctions ──────────────────────────────────────────────
  {
    id: "q18",
    moduleId: "m4",
    question: "Que retourne SUBSTR('Oracle', -3) ?",
    options: ["Ora", "cle", "acle", "Une erreur"],
    correctIndexes: [1],
    explanation:
      "Une position négative compte depuis la fin. -3 commence 3 caractères avant la fin → 'cle'.",
    topic: "SUBSTR",
    difficulty: "medium",
  },
  {
    id: "q19",
    moduleId: "m4",
    question: "Combien d'arguments la fonction CONCAT accepte-t-elle ?",
    options: ["1", "2", "3", "Illimité"],
    correctIndexes: [1],
    explanation:
      "CONCAT(a, b) prend exactement 2 arguments. Pour plus de chaînes, utilisez ||.",
    topic: "CONCAT",
    difficulty: "easy",
  },
  {
    id: "q20",
    moduleId: "m4",
    question: "Que retourne INSTR('Hello World', 'o', 6) ?",
    options: ["5", "7", "0", "Une erreur"],
    correctIndexes: [1],
    explanation:
      "Recherche de 'o' à partir de la position 6 → le 'o' de 'World' est en position 7.",
    topic: "INSTR",
    difficulty: "medium",
  },
  {
    id: "q21",
    moduleId: "m4",
    question: "Que retourne SYSDATE - hire_date ?",
    options: [
      "Le nombre de mois entre les dates",
      "Le nombre de jours entre les dates",
      "Le nombre d'années",
      "Une erreur de type",
    ],
    correctIndexes: [1],
    explanation:
      "La soustraction de deux DATE donne un nombre de jours (décimal). Pour les mois : MONTHS_BETWEEN.",
    topic: "Arithmétique de dates",
    difficulty: "easy",
  },
  {
    id: "q22",
    moduleId: "m4",
    question: "Comment ajouter 2 heures à une date ?",
    options: [
      "SYSDATE + 2",
      "SYSDATE + 2/24",
      "SYSDATE + 2/24/60",
      "ADD_HOURS(SYSDATE, 2)",
    ],
    correctIndexes: [1],
    explanation:
      "L'unité est le jour : 1 heure = 1/24. Donc SYSDATE + 2/24. (ADD_HOURS n'existe pas en SQL Oracle standard.)",
    topic: "Arithmétique de dates",
    difficulty: "medium",
  },
  {
    id: "q23",
    moduleId: "m4",
    question: "Quelle est la différence entre NVL et COALESCE ?",
    options: [
      "Ce sont des synonymes",
      "NVL accepte 2 arguments, COALESCE en accepte N",
      "NVL est standard SQL, COALESCE est Oracle",
      "COALESCE est toujours plus rapide",
    ],
    correctIndexes: [1],
    explanation:
      "NVL(expr, remplacement) : 2 args, évalue toujours les deux. COALESCE : N args, short-circuit, standard SQL.",
    topic: "Fonctions NULL",
    difficulty: "medium",
  },
  {
    id: "q24",
    moduleId: "m4",
    question: "Que fait NULLIF(a, b) ?",
    options: [
      "Retourne NULL si a est NULL",
      "Retourne NULL si a = b, sinon a",
      "Retourne b si a est NULL",
      "Retourne a si a = b",
    ],
    correctIndexes: [1],
    explanation:
      "NULLIF(a, b) → NULL lorsque a = b, sinon a. Utile pour éviter une division par zéro : expr / NULLIF(denom, 0).",
    topic: "Fonctions NULL",
    difficulty: "medium",
  },
  {
    id: "q25",
    moduleId: "m4",
    question: "Que fait DECODE ?",
    options: [
      "Décode du Base64",
      "Équivalent d'un IF/THEN/ELSE",
      "Convertit un type de données",
      "Décompresse des données",
    ],
    correctIndexes: [1],
    explanation:
      "DECODE(expr, v1, r1, v2, r2, …, défaut) est spécifique Oracle. CASE est l'équivalent standard, plus lisible et plus puissant.",
    topic: "DECODE",
    difficulty: "medium",
  },
  {
    id: "q26",
    moduleId: "m4",
    question: "Que retourne SELECT TRUNC(ROUND(156.00, -1), -1) FROM DUAL ?",
    options: ["150", "200", "160", "16", "100"],
    correctIndexes: [2],
    explanation:
      "ROUND(156, -1) = 160 (arrondi à la dizaine). TRUNC(160, -1) = 160. Résultat : 160.",
    topic: "ROUND / TRUNC",
    difficulty: "hard",
  },
  {
    id: "q27",
    moduleId: "m4",
    question:
      "Afficher une hausse de crédit de 15 % ; si pas de crédit, afficher 'Not Available'. Quelle requête est correcte ?",
    options: [
      "SELECT NVL(TO_CHAR(cust_credit_limit * .15), 'Not Available') FROM customers",
      "SELECT TO_CHAR(NVL(cust_credit_limit * .15), 'Not Available') FROM customers",
      "SELECT NVL(cust_credit_limit * .15, 'Not Available') FROM customers",
      "SELECT NVL(cust_credit_limit, 'Not Available') * .15 FROM customers",
    ],
    correctIndexes: [0],
    explanation:
      "Il faut convertir le nombre en chaîne avant NVL pour homogénéiser les types. Sinon NVL mélange NUMBER et VARCHAR2 → erreur. L'option A convertit d'abord avec TO_CHAR.",
    topic: "NVL / TO_CHAR",
    difficulty: "hard",
  },
  {
    id: "q28",
    moduleId: "m4",
    question:
      "SELECT TO_CHAR(list_price, '$9,999') FROM product_information; Quelles deux affirmations sont vraies ?",
    options: [
      "11235.90 s'affiche comme #######",
      "1123.90 s'affiche comme $1,123",
      "1123.90 s'affiche comme $1,124",
      "11235.90 s'affiche comme $1,123",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Le masque '$9,999' n'a que 4 chiffres : 11235 déborde → dièses. 1123.90 est arrondi à l'entier le plus proche → $1,124.",
    topic: "TO_CHAR numérique",
    difficulty: "hard",
  },
  {
    id: "q29",
    moduleId: "m4",
    question: "Quelles deux affirmations sont vraies sur le travail avec les dates ?",
    options: [
      "Le format RR calcule le siècle à partir de SYSDATE mais permet aussi de saisir le siècle",
      "Le format RR calcule le siècle et interdit de saisir le siècle",
      "Le stockage interne des dates est en format caractère",
      "Le stockage interne des dates est en format numérique",
    ],
    correctIndexes: [0, 3],
    explanation:
      "DATE est stocké en format numérique interne (7 octets). RR déduit le siècle mais accepte aussi un siècle explicite (YYYY).",
    topic: "Dates",
    difficulty: "medium",
  },
  {
    id: "q30",
    moduleId: "m4",
    question:
      "Pour stocker une durée de prêt ≤ 30 jours avec arithmétique DATE native (sans conversion), quel type choisir ?",
    options: [
      "DATE",
      "NUMBER",
      "TIMESTAMP",
      "INTERVAL DAY TO SECOND",
      "INTERVAL YEAR TO MONTH",
    ],
    correctIndexes: [3],
    explanation:
      "INTERVAL DAY TO SECOND stocke une durée en jours/heures/minutes/secondes et s'additionne directement à une DATE. YEAR TO MONTH est trop grossier pour ≤ 30 jours.",
    topic: "Types INTERVAL",
    difficulty: "hard",
  },

  // ─── Module 5 — GROUP BY ───────────────────────────────────────────────
  {
    id: "q31",
    moduleId: "m5",
    question: "Quelle est la différence entre COUNT(*) et COUNT(column) ?",
    options: [
      "Aucune différence",
      "COUNT(*) compte toutes les lignes ; COUNT(column) ignore les NULL",
      "COUNT(*) est toujours plus rapide",
      "COUNT(column) compte toutes les lignes",
    ],
    correctIndexes: [1],
    explanation:
      "COUNT(*) inclut les lignes avec NULL. COUNT(col) ignore les NULL de col. Piège classique de l'examen.",
    topic: "COUNT",
    difficulty: "easy",
  },
  {
    id: "q32",
    moduleId: "m5",
    question: "Que vaut AVG d'une colonne contenant [10, 20, NULL] ?",
    options: ["10", "15", "20", "NULL"],
    correctIndexes: [1],
    explanation:
      "AVG ignore les NULL : (10+20)/2 = 15, pas (10+20+0)/3.",
    topic: "AVG et NULL",
    difficulty: "medium",
  },
  {
    id: "q33",
    moduleId: "m5",
    question: "Quelle clause filtre les groupes APRÈS le regroupement ?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correctIndexes: [1],
    explanation:
      "HAVING filtre après GROUP BY et accepte les agrégats. WHERE filtre les lignes avant l'agrégation.",
    topic: "HAVING",
    difficulty: "easy",
  },
  {
    id: "q34",
    moduleId: "m5",
    question:
      "Que se passe-t-il si une colonne non agrégée du SELECT n'est pas dans le GROUP BY ?",
    options: [
      "Oracle retourne NULL pour cette colonne",
      "Oracle lève ORA-00979",
      "Oracle prend la première valeur",
      "Oracle l'agrège automatiquement",
    ],
    correctIndexes: [1],
    explanation:
      "ORA-00979: not a GROUP BY expression. Toute colonne non agrégée du SELECT doit figurer dans le GROUP BY.",
    topic: "Règles GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q35",
    moduleId: "m5",
    question: "Peut-on utiliser une fonction d'agrégation dans WHERE ?",
    options: [
      "Oui, toujours",
      "Non : il faut utiliser HAVING",
      "Oui, seulement COUNT",
      "Oui, avec une sous-requête uniquement dans le FROM",
    ],
    correctIndexes: [1],
    explanation:
      "WHERE s'exécute avant GROUP BY → pas d'agrégats. Filtrer sur un agrégat : HAVING (ou sous-requête).",
    topic: "WHERE vs HAVING",
    difficulty: "medium",
  },
  {
    id: "q36",
    moduleId: "m5",
    question: "Quelles deux affirmations sont vraies sur GROUP BY ?",
    options: [
      "On peut utiliser un alias de colonne dans le GROUP BY",
      "WHERE après GROUP BY exclut des lignes après création des groupes",
      "GROUP BY est obligatoire dès qu'on utilise une fonction d'agrégation",
      "WHERE avant GROUP BY exclut des lignes avant la création des groupes",
      "Les colonnes non agrégées du SELECT doivent figurer dans le GROUP BY",
    ],
    correctIndexes: [3, 4],
    explanation:
      "WHERE filtre avant le regroupement. Les colonnes non agrégées du SELECT doivent être dans GROUP BY. Les alias du SELECT ne sont pas utilisables dans GROUP BY. Une agrégation sans GROUP BY sur toute la table est valide (une seule ligne résultat).",
    topic: "GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q37",
    moduleId: "m5",
    question: "Quelles trois affirmations sont vraies sur les fonctions de groupe ?",
    options: [
      "Elles s'appliquent à des colonnes ou des expressions",
      "Elles peuvent être imbriquées (ex. MAX(AVG(salary)))",
      "Elles exigent obligatoirement un GROUP BY",
      "Une seule colonne par SELECT peut être agrégée",
      "Elles peuvent coexister avec des fonctions mono-ligne dans le SELECT",
    ],
    correctIndexes: [0, 1, 4],
    explanation:
      "Les group functions acceptent colonnes/expressions, peuvent s'imbriquer (avec GROUP BY approprié), et se combinent avec des fonctions mono-ligne. Elles n'exigent pas toujours GROUP BY (agrégat global).",
    topic: "Fonctions de groupe",
    difficulty: "medium",
  },
  {
    id: "q38",
    moduleId: "m5",
    question:
      "SELECT TO_CHAR(order_date,'rr'), SUM(order_total) FROM orders GROUP BY TO_CHAR(order_date,'yyyy'); Quel résultat ?",
    options: [
      "Exécution OK mais résultat incorrect",
      "Exécution OK et résultat correct",
      "Erreur : TO_CHAR invalide",
      "Erreur : conversions SELECT et GROUP BY incohérentes",
    ],
    correctIndexes: [3],
    explanation:
      "Le SELECT groupe par 'rr' (année sur 2 chiffres) mais le GROUP BY utilise 'yyyy'. Les expressions doivent correspondre → ORA-00979.",
    topic: "GROUP BY / TO_CHAR",
    difficulty: "hard",
  },
  {
    id: "q39",
    moduleId: "m5",
    question: "Comment compter correctement les produits dont LIST_PRICE est NULL ?",
    options: [
      "SELECT COUNT(DISTINCT list_price) FROM product_information WHERE list_price IS NULL",
      "SELECT COUNT(NVL(list_price, 0)) FROM product_information WHERE list_price IS NULL",
      "SELECT COUNT(list_price) FROM product_information WHERE list_price = NULL",
      "SELECT COUNT(*) FROM product_information WHERE list_price IS NULL",
    ],
    correctIndexes: [1, 3],
    explanation:
      "COUNT(list_price) ignore les NULL → 0 ligne comptée même après WHERE IS NULL. COUNT(*) compte les lignes. COUNT(NVL(list_price,0)) transforme NULL en 0 donc compte aussi. COUNT(DISTINCT list_price) sur des NULL vaut 0. list_price = NULL ne retourne aucune ligne.",
    topic: "COUNT et NULL",
    difficulty: "hard",
  },

  // ─── Module 6 — Jointures ──────────────────────────────────────────────
  {
    id: "q40",
    moduleId: "m6",
    question: "Que retourne un INNER JOIN ?",
    options: [
      "Toutes les lignes des deux tables",
      "Uniquement les lignes avec correspondance des deux côtés",
      "Toutes les lignes de la table de gauche",
      "Toutes les lignes de la table de droite",
    ],
    correctIndexes: [1],
    explanation:
      "INNER JOIN ne conserve que les correspondances. Les lignes orphelines sont exclues des deux côtés.",
    topic: "INNER JOIN",
    difficulty: "easy",
  },
  {
    id: "q41",
    moduleId: "m6",
    question: "Dans l'ancienne syntaxe Oracle, où place-t-on le (+) pour un LEFT JOIN ?",
    options: [
      "Sur la table de gauche",
      "Sur la table de droite (celle qui peut manquer)",
      "Sur les deux tables",
      "Uniquement dans le SELECT",
    ],
    correctIndexes: [1],
    explanation:
      "Le (+) marque le côté qui peut recevoir des NULL. Pour garder toutes les lignes de gauche : (+) sur les colonnes de droite.",
    topic: "Syntaxe Oracle JOIN",
    difficulty: "hard",
  },
  {
    id: "q42",
    moduleId: "m6",
    question: "L'ancienne syntaxe (+) permet-elle le FULL OUTER JOIN ?",
    options: [
      "Oui, avec (+) des deux côtés",
      "Non : (+) ne peut pas être des deux côtés",
      "Oui, via une vue matérielle",
      "Oui, uniquement en 19c+",
    ],
    correctIndexes: [1],
    explanation:
      "Le (+) d'un seul côté seulement. Pour un FULL OUTER JOIN : syntaxe ANSI FULL OUTER JOIN ... ON.",
    topic: "Syntaxe Oracle JOIN",
    difficulty: "medium",
  },
  {
    id: "q43",
    moduleId: "m6",
    question: "Pourquoi NATURAL JOIN est-il risqué ?",
    options: [
      "Il est plus lent que INNER JOIN",
      "Il joint sur toutes les colonnes de même nom (changement silencieux possible)",
      "Il ne peut pas utiliser les index",
      "Il exige des privilèges DBA",
    ],
    correctIndexes: [1],
    explanation:
      "NATURAL JOIN joint automatiquement sur tous les noms communs. Ajouter une colonne homonyme change la jointure sans modifier le SQL.",
    topic: "NATURAL JOIN",
    difficulty: "medium",
  },
  {
    id: "q44",
    moduleId: "m6",
    question: "Qu'est-ce qu'un CROSS JOIN ?",
    options: [
      "Une jointure sur des colonnes croisées",
      "Un produit cartésien (N × M lignes)",
      "Une jointure optimisée par le CBO",
      "Une jointure avec condition complexe",
    ],
    correctIndexes: [1],
    explanation:
      "Chaque ligne de A combinée avec chaque ligne de B. 100 × 50 = 5000 lignes.",
    topic: "CROSS JOIN",
    difficulty: "easy",
  },
  {
    id: "q45",
    moduleId: "m6",
    question: "Quelle syntaxe de jointure est recommandée ?",
    options: [
      "FROM a, b WHERE a.id = b.id",
      "FROM a JOIN b ON a.id = b.id",
      "FROM a NATURAL JOIN b",
      "FROM a CROSS JOIN b",
    ],
    correctIndexes: [1],
    explanation:
      "JOIN ... ON (ANSI) sépare clairement condition de jointure et filtres WHERE. Préférable à la virgule Oracle.",
    topic: "Syntaxe JOIN",
    difficulty: "easy",
  },
  {
    id: "q46",
    moduleId: "m6",
    question:
      "Quels deux éléments sont le minimum requis pour une self-join ?",
    options: [
      "Uniquement des conditions d'équijoin",
      "Interdiction des outer joins",
      "Une condition de jointure sur laquelle la table se joint à elle-même",
      "Aucune autre condition que la self-join",
      "Deux alias distincts pour la même table",
    ],
    correctIndexes: [2, 4],
    explanation:
      "Il faut deux alias et une condition de jointure. Les outer joins et filtres supplémentaires restent autorisés.",
    topic: "Self-join",
    difficulty: "medium",
  },
  {
    id: "q47",
    moduleId: "m6",
    question:
      "SELECT employee_id, first_name, department_name FROM employees NATURAL JOIN departments; Le résultat n'est pas celui attendu. Pourquoi ?",
    options: [
      "Il manque le préfixe de table dans le SELECT",
      "NATURAL JOIN exige forcément USING",
      "L'ordre des tables dans le FROM est incorrect",
      "Les deux tables partagent plus d'une colonne de même nom et type",
    ],
    correctIndexes: [3],
    explanation:
      "EMPLOYEES et DEPARTMENTS partagent DEPARTMENT_ID et souvent MANAGER_ID. NATURAL JOIN joint sur les deux → résultat incorrect. Préférer JOIN ... USING (department_id) ou ON.",
    topic: "NATURAL JOIN",
    difficulty: "hard",
  },
  {
    id: "q48",
    moduleId: "m6",
    question:
      "Pour lister chaque produit et le nombre de ventes (y compris 0), quels JOIN sont adaptés ?",
    options: ["FULL OUTER JOIN", "JOIN (INNER)", "LEFT OUTER JOIN", "RIGHT OUTER JOIN"],
    correctIndexes: [0, 2],
    explanation:
      "Depuis PRODUCTS p ... SALES s : LEFT JOIN (ou FULL) conserve les produits sans vente. INNER exclut les non vendus. RIGHT depuis PRODUCTS serait équivalent à LEFT si on inverse les tables.",
    topic: "OUTER JOIN",
    difficulty: "medium",
  },

  // ─── Module 7 — Sous-requêtes ──────────────────────────────────────────
  {
    id: "q49",
    moduleId: "m7",
    question: "Que signifie > ALL (sous-requête) ?",
    options: [
      "Plus grand qu'au moins une valeur",
      "Plus grand que toutes les valeurs",
      "Plus grand que la moyenne",
      "Plus grand que la première valeur",
    ],
    correctIndexes: [1],
    explanation:
      "> ALL ≡ > MAX(...). > ANY ≡ > MIN(...).",
    topic: "ALL / ANY",
    difficulty: "medium",
  },
  {
    id: "q50",
    moduleId: "m7",
    question:
      "Quelle erreur si une sous-requête mono-ligne retourne plusieurs lignes ?",
    options: ["ORA-00942", "ORA-01427", "ORA-01797", "ORA-00904"],
    correctIndexes: [1],
    explanation:
      "ORA-01427: single-row subquery returns more than one row. Solution : IN / ANY / ALL, ou garantir une seule ligne.",
    topic: "Erreurs sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "q51",
    moduleId: "m7",
    question: "Pourquoi NOT IN avec NULL est-il dangereux ?",
    options: [
      "Plus lent que NOT EXISTS",
      "Si la sous-requête contient un NULL, NOT IN ne retourne aucune ligne",
      "Incompatible avec les index",
      "Lève toujours une erreur",
    ],
    correctIndexes: [1],
    explanation:
      "x NOT IN (1, NULL) → UNKNOWN pour toute ligne. Préférer NOT EXISTS.",
    topic: "NOT IN et NULL",
    difficulty: "hard",
  },
  {
    id: "q52",
    moduleId: "m7",
    question: "Quand préférer EXISTS à IN ?",
    options: [
      "Quand la sous-requête retourne peu de lignes",
      "Quand la sous-requête retourne beaucoup de lignes",
      "Quand il n'y a pas d'index",
      "Toujours",
    ],
    correctIndexes: [1],
    explanation:
      "EXISTS s'arrête à la première correspondance (idéal si beaucoup de lignes). IN convient mieux à un petit ensemble.",
    topic: "EXISTS vs IN",
    difficulty: "medium",
  },
  {
    id: "q53",
    moduleId: "m7",
    question: "Qu'est-ce qu'une sous-requête corrélée ?",
    options: [
      "Une sous-requête multi-colonnes",
      "Une sous-requête qui référence la requête externe",
      "Une sous-requête dans le FROM uniquement",
      "Une sous-requête avec JOIN",
    ],
    correctIndexes: [1],
    explanation:
      "Elle dépend d'une colonne de la requête externe et est réévaluée pour chaque ligne candidate.",
    topic: "Sous-requête corrélée",
    difficulty: "medium",
  },
  {
    id: "q54",
    moduleId: "m7",
    question:
      "Séquence d'évaluation d'une sous-requête corrélée : 1) WHERE externe 2) ligne candidate externe 3) répétition 4) résultat interne. Quel ordre ?",
    options: ["4, 2, 1, 3", "4, 1, 2, 3", "2, 4, 1, 3", "2, 1, 4, 3"],
    correctIndexes: [2],
    explanation:
      "On fetch la ligne externe (2), on exécute l'interne avec cette valeur (4), on évalue le WHERE externe (1), on répète (3) → 2, 4, 1, 3.",
    topic: "Sous-requête corrélée",
    difficulty: "hard",
  },
  {
    id: "q55",
    moduleId: "m7",
    question: "Quelles deux affirmations sont vraies sur EXISTS dans une sous-requête corrélée ?",
    options: [
      "Il teste si les valeurs de l'interne existent dans l'externe",
      "L'externe lit tout le résultat interne jusqu'à la fin",
      "Il teste si les valeurs de l'externe existent dans le résultat interne",
      "L'externe s'arrête dès la première correspondance trouvée par l'interne",
    ],
    correctIndexes: [2, 3],
    explanation:
      "EXISTS vérifie l'existence d'au moins une ligne interne pour la ligne externe courante, et short-circuit à la première.",
    topic: "EXISTS",
    difficulty: "medium",
  },
  {
    id: "q56",
    moduleId: "m7",
    question: "Quelles trois affirmations sont vraies sur les sous-requêtes ?",
    options: [
      "Une requête principale peut contenir plusieurs sous-requêtes",
      "Une sous-requête peut avoir plusieurs requêtes principales",
      "Sous-requête et principale doivent lire la même table",
      "Sous-requête et principale peuvent lire des tables différentes",
      "Une seule colonne peut être comparée",
      "Plusieurs colonnes/expressions peuvent être comparées",
    ],
    correctIndexes: [0, 3, 5],
    explanation:
      "Multi-sous-requêtes OK ; tables différentes OK ; comparaisons multi-colonnes OK (ex. WHERE (a,b) IN (SELECT ...)).",
    topic: "Sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "q57",
    moduleId: "m7",
    question: "Quelles deux affirmations sont vraies sur les sous-requêtes ?",
    options: [
      "Une sous-requête peut apparaître des deux côtés d'un opérateur de comparaison",
      "Seulement deux sous-requêtes par niveau",
      "Une sous-requête peut retourner zéro ou plusieurs lignes",
      "Les sous-requêtes ne sont autorisées que dans SELECT",
      "Pas de limite de niveaux dans le WHERE d'un SELECT",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Sous-requête des deux côtés possible ; 0..N lignes selon le contexte. Il y a une limite pratique de nesting ; elles ne sont pas limitées au seul SELECT (aussi INSERT/UPDATE/DELETE, etc.).",
    topic: "Sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "q58",
    moduleId: "m7",
    question: "Définition d'une sous-requête non corrélée ?",
    options: [
      "Ensemble de requêtes où le résultat interne sert en général de critère à l'externe",
      "Requêtes séquentielles qui doivent toutes lire la même table",
      "Requêtes séquentielles qui retournent toujours une seule valeur",
      "SELECT embarqué uniquement dans une autre clause SELECT",
    ],
    correctIndexes: [0],
    explanation:
      "Non corrélée : l'interne s'exécute indépendamment, son résultat alimente l'externe.",
    topic: "Sous-requête non corrélée",
    difficulty: "easy",
  },
  {
    id: "q59",
    moduleId: "m7",
    question:
      "Commandes après le dernier ordre du client 101 : quelle requête est correcte ?",
    options: [
      "WHERE order_date > ANY (SELECT order_date FROM orders WHERE customer_id = 101)",
      "WHERE order_date > ALL (SELECT MAX(order_date) FROM orders) AND customer_id = 101",
      "WHERE order_date > ALL (SELECT order_date FROM orders WHERE customer_id = 101)",
      "WHERE order_date > IN (SELECT order_date FROM orders WHERE customer_id = 101)",
    ],
    correctIndexes: [2],
    explanation:
      "> ALL (dates du client 101) ≡ strictement après sa dernière commande. > ANY prendrait dès qu'une date est dépassée. > IN est une syntaxe invalide.",
    topic: "ALL",
    difficulty: "hard",
  },

  // ─── Module 8 — Opérateurs ensemblistes ────────────────────────────────
  {
    id: "q60",
    moduleId: "m8",
    question: "Différence entre UNION et UNION ALL ?",
    options: [
      "UNION est plus rapide",
      "UNION élimine les doublons (et trie) ; UNION ALL conserve tout",
      "UNION ALL élimine les doublons",
      "Aucune différence",
    ],
    correctIndexes: [1],
    explanation:
      "UNION déduplique (coût de tri/hash). UNION ALL est plus rapide si les doublons sont acceptables.",
    topic: "UNION",
    difficulty: "easy",
  },
  {
    id: "q61",
    moduleId: "m8",
    question: "D'où viennent les noms de colonnes d'un UNION ?",
    options: [
      "De la deuxième requête",
      "De la première requête",
      "De la fusion des deux",
      "Oracle génère des noms automatiques",
    ],
    correctIndexes: [1],
    explanation:
      "Les en-têtes proviennent du premier SELECT. Les alias suivants sont ignorés pour le nommage.",
    topic: "UNION colonnes",
    difficulty: "medium",
  },
  {
    id: "q62",
    moduleId: "m8",
    question: "Où placer ORDER BY avec des opérateurs ensemblistes ?",
    options: [
      "Dans chaque SELECT individuellement",
      "Uniquement à la fin, sur l'ensemble combiné",
      "Avant le premier SELECT",
      "N'importe où",
    ],
    correctIndexes: [1],
    explanation:
      "Un seul ORDER BY final est autorisé. Un ORDER BY au milieu lève une erreur.",
    topic: "Set operators / ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q63",
    moduleId: "m8",
    question: "Que fait MINUS ?",
    options: [
      "Retourne les lignes communes",
      "Retourne les lignes du premier SELECT absentes du second",
      "Calcule une différence numérique",
      "Retourne toutes les lignes des deux SELECT",
    ],
    correctIndexes: [1],
    explanation:
      "MINUS = différence d'ensembles (avec déduplication et tri).",
    topic: "MINUS",
    difficulty: "easy",
  },
  {
    id: "q64",
    moduleId: "m8",
    question: "Que fait INTERSECT ?",
    options: [
      "Retourne toutes les lignes des deux requêtes",
      "Retourne les lignes communes aux deux requêtes",
      "Retourne les lignes uniques du premier SELECT",
      "Retourne uniquement le premier SELECT",
    ],
    correctIndexes: [1],
    explanation:
      "INTERSECT = intersection, doublons éliminés, résultat trié.",
    topic: "INTERSECT",
    difficulty: "easy",
  },
  {
    id: "q65",
    moduleId: "m8",
    question: "Quelle affirmation est vraie sur UNION ?",
    options: [
      "Par défaut, la sortie n'est pas triée",
      "Les NULL ne sont pas ignorés lors de la détection des doublons",
      "Les noms de colonnes doivent être identiques dans tous les SELECT",
      "Le nombre de colonnes peut différer entre SELECT",
    ],
    correctIndexes: [1],
    explanation:
      "UNION considère NULL = NULL pour la déduplication. La sortie est triée par défaut. Les noms peuvent différer ; le nombre et les types compatibles doivent correspondre.",
    topic: "UNION",
    difficulty: "medium",
  },
  {
    id: "q66",
    moduleId: "m8",
    question:
      "Clients actuels vs historique des adresses : trouver ceux qui n'ont jamais changé d'adresse. Quel opérateur ?",
    options: ["INTERSECT", "UNION ALL", "MINUS", "UNION"],
    correctIndexes: [2],
    explanation:
      "CUSTOMERS MINUS CUST_HISTORY (sur les clés/adresses pertinentes) isole ceux présents actuellement sans entrée d'historique de changement.",
    topic: "MINUS",
    difficulty: "medium",
  },
  {
    id: "q67",
    moduleId: "m8",
    question:
      "Quelles clauses ORDER BY peuvent compléter : SELECT cust_id, cust_last_name \"Last name\" ... UNION SELECT cust_id CUST_NO, cust_last_name ... ?",
    options: [
      'ORDER BY "Last name"',
      "ORDER BY 2, cust_id",
      "ORDER BY CUST_NO",
      "ORDER BY 2, 1",
      'ORDER BY "CUST_NO"',
    ],
    correctIndexes: [0, 1, 3],
    explanation:
      "On peut trier par alias/position du premier SELECT (\"Last name\", 2, cust_id). CUST_NO est un alias du second SELECT → invalide pour ORDER BY sur l'ensemble.",
    topic: "UNION / ORDER BY",
    difficulty: "hard",
  },

  // ─── Module 9 — DML ────────────────────────────────────────────────────
  {
    id: "q68",
    moduleId: "m9",
    question: "DELETE déclenche-t-il les triggers ?",
    options: [
      "Oui : DELETE est DML et déclenche les triggers",
      "Non, jamais",
      "Seulement les triggers AFTER",
      "Seulement s'il y a un WHERE",
    ],
    correctIndexes: [0],
    explanation:
      "DELETE (DML) déclenche les triggers DELETE. TRUNCATE (DDL) ne les déclenche pas.",
    topic: "DELETE",
    difficulty: "medium",
  },
  {
    id: "q69",
    moduleId: "m9",
    question: "Peut-on faire un ROLLBACK après un DELETE sans WHERE ?",
    options: [
      "Non : suppression définitive",
      "Oui : DELETE est transactionnel",
      "Seulement avec le rôle DBA",
      "Seulement avant le prochain SELECT",
    ],
    correctIndexes: [1],
    explanation:
      "Tant qu'il n'y a pas de COMMIT (explicite ou implicite via DDL), ROLLBACK restaure les lignes.",
    topic: "Transactions",
    difficulty: "medium",
  },
  {
    id: "q70",
    moduleId: "m9",
    question: "Qu'est-ce que MERGE ?",
    options: [
      "Une jointure spéciale",
      "Un upsert : UPDATE si correspondance, INSERT sinon",
      "Une fusion physique de tablespaces",
      "Un type de contrainte",
    ],
    correctIndexes: [1],
    explanation:
      "MERGE synchronise une table cible à partir d'une source en une passe (WHEN MATCHED / WHEN NOT MATCHED).",
    topic: "MERGE",
    difficulty: "medium",
  },
  {
    id: "q71",
    moduleId: "m9",
    question: "Quelle erreur si on UPDATE une colonne du ON dans MERGE ?",
    options: ["ORA-00904", "ORA-38104", "ORA-01427", "ORA-00979"],
    correctIndexes: [1],
    explanation:
      "ORA-38104 : columns referenced in the ON Clause cannot be updated.",
    topic: "MERGE",
    difficulty: "hard",
  },
  {
    id: "q72",
    moduleId: "m9",
    question: "Quelle affirmation est vraie sur les transactions ?",
    options: [
      "Une suite de DML terminée par SAVEPOINT forme une transaction",
      "Chaque instruction DDL forme une transaction à elle seule",
      "Une suite de DDL terminée par COMMIT forme une transaction",
      "DDL + DML jusqu'au COMMIT forment toujours une seule transaction",
    ],
    correctIndexes: [1],
    explanation:
      "Chaque DDL provoque un COMMIT implicite : c'est une transaction en soi. SAVEPOINT ne termine pas une transaction.",
    topic: "Transactions",
    difficulty: "medium",
  },
  {
    id: "q73",
    moduleId: "m9",
    question: "Quelle affirmation est vraie sur le DML ?",
    options: [
      "Le DML désactive automatiquement les FK lors de la modification de PK parent",
      "Chaque instruction DML forme une transaction par défaut",
      "Une transaction peut contenir une ou plusieurs instructions DML",
      "Le DML désactive les FK à la suppression PK seulement avec ON DELETE CASCADE",
    ],
    correctIndexes: [2],
    explanation:
      "Une transaction regroupe un ou plusieurs DML jusqu'à COMMIT/ROLLBACK. Un DML seul ne « commit » pas automatiquement.",
    topic: "DML",
    difficulty: "medium",
  },
  {
    id: "q74",
    moduleId: "m9",
    question: "Quelles deux affirmations sont vraies sur le DML ?",
    options: [
      "INSERT ... VALUES ajoute plusieurs lignes par exécution",
      "UPDATE ... SET peut modifier plusieurs lignes selon des conditions",
      "DELETE ne peut filtrer que sur une seule condition",
      "INSERT ... VALUES ajoute une ligne selon plusieurs conditions",
      "DELETE peut supprimer plusieurs lignes selon plusieurs conditions",
      "UPDATE ne peut modifier qu'avec une seule condition",
    ],
    correctIndexes: [1, 4],
    explanation:
      "UPDATE/DELETE peuvent affecter N lignes via WHERE (conditions combinées). INSERT VALUES classique = une ligne (sauf INSERT multi-row / INSERT SELECT).",
    topic: "DML",
    difficulty: "medium",
  },
  {
    id: "q75",
    moduleId: "m9",
    question: "Quelle instruction UPDATE est valide ?",
    options: [
      "UPDATE orders SET order_date = '12-mar-2007', order_total IS NULL WHERE order_id = 2455",
      "UPDATE orders SET order_date = '12-mar-2007', AND order_total = TO_NUMBER(NULL) WHERE order_id = 2455",
      "UPDATE orders SET order_date = '12-mar-2007', order_total = NULL WHERE order_id = 2455",
      "UPDATE orders SET order_date = TO_DATE('12-mar-2007','dd-mon-yyyy'), SET order_total = TO_NUMBER(NULL) WHERE order_id = 2455",
    ],
    correctIndexes: [2],
    explanation:
      "Syntaxe correcte : colonnes séparées par des virgules, affectation avec =. IS NULL n'est pas une affectation ; un second SET est invalide.",
    topic: "UPDATE",
    difficulty: "medium",
  },
  {
    id: "q76",
    moduleId: "m9",
    question:
      "Quelle tâche peut être réalisée par une seule instruction DML ?",
    options: [
      "Vider une colonne PK uniquement",
      "Vider une colonne UNIQUE",
      "Ajouter une colonne avec DEFAULT tout en insérant une ligne",
      "Ajouter une contrainte de colonne tout en insérant une ligne",
    ],
    correctIndexes: [1],
    explanation:
      "UPDATE col = NULL est du DML et fonctionne sur une colonne UNIQUE (si la contrainte le permet). Ajouter une colonne/contrainte = DDL. Vider une PK viole en général NOT NULL/PK.",
    topic: "DML",
    difficulty: "hard",
  },

  // ─── Module 10 — DDL / objets ──────────────────────────────────────────
  {
    id: "q77",
    moduleId: "m10",
    question: "Différence entre VARCHAR2 et CHAR ?",
    options: [
      "VARCHAR2 est toujours plus rapide",
      "VARCHAR2 stocke la longueur réelle ; CHAR complète avec des espaces",
      "CHAR supporte Unicode, VARCHAR2 non",
      "Aucune différence",
    ],
    correctIndexes: [1],
    explanation:
      "CHAR(n) est paddé à n. VARCHAR2(n) stocke uniquement les caractères saisis. Préférer VARCHAR2.",
    topic: "Types de données",
    difficulty: "easy",
  },
  {
    id: "q78",
    moduleId: "m10",
    question: "Que signifie NUMBER(8,2) ?",
    options: [
      "8 chiffres avant la virgule, 2 après",
      "8 chiffres au total, dont 2 décimales",
      "8 octets, 2 décimales",
      "8 caractères, 2 décimales",
    ],
    correctIndexes: [1],
    explanation:
      "NUMBER(p,s) : p = précision totale, s = échelle. NUMBER(8,2) → 6 chiffres avant + 2 après (ex. 123456.78).",
    topic: "NUMBER",
    difficulty: "medium",
  },
  {
    id: "q79",
    moduleId: "m10",
    question: "Quand appeler NEXTVAL avant CURRVAL ?",
    options: [
      "Avant chaque CURRVAL",
      "Au moins une fois dans la session avant le premier CURRVAL",
      "Jamais : CURRVAL est autonome",
      "Seulement si la séquence vient d'être créée",
    ],
    correctIndexes: [1],
    explanation:
      "Sinon ORA-08002 : sequence CURRVAL is not yet defined in this session.",
    topic: "Séquences",
    difficulty: "medium",
  },
  {
    id: "q80",
    moduleId: "m10",
    question: "Que fait WITH CHECK OPTION sur une vue ?",
    options: [
      "Vérifie les contraintes de la table de base",
      "Empêche INSERT/UPDATE produisant des lignes hors du prédicat de la vue",
      "Active le cache de la vue",
      "Vérifie les droits de l'utilisateur",
    ],
    correctIndexes: [1],
    explanation:
      "WITH CHECK OPTION force les DML via la vue à respecter le WHERE de la vue.",
    topic: "Vues",
    difficulty: "medium",
  },
  {
    id: "q81",
    moduleId: "m10",
    question: "Pourquoi ne pas indexer toutes les colonnes ?",
    options: [
      "Les index occupent trop de mémoire uniquement",
      "Les index ralentissent INSERT/UPDATE/DELETE",
      "Les index ne marchent que sur des nombres",
      "Limite de 5 index par table",
    ],
    correctIndexes: [1],
    explanation:
      "Chaque modification doit maintenir les index. Indexer les colonnes vraiment filtrées/jointes/triées.",
    topic: "Index",
    difficulty: "medium",
  },
  {
    id: "q82",
    moduleId: "m10",
    question:
      "ALTER TABLE orders SET UNUSED (order_date); Quelle affirmation est vraie ?",
    options: [
      "DESCRIBE affiche encore ORDER_DATE",
      "ROLLBACK restaure ORDER_DATE",
      "La colonne doit être vide pour réussir",
      "On peut ensuite ajouter une nouvelle colonne ORDER_DATE",
    ],
    correctIndexes: [3],
    explanation:
      "SET UNUSED marque la colonne invisible (plus dans DESC), opération DDL non annulable par ROLLBACK. Le nom est libéré → on peut recréer ORDER_DATE.",
    topic: "ALTER TABLE",
    difficulty: "medium",
  },
  {
    id: "q83",
    moduleId: "m10",
    question:
      "DROP TABLE products PURGE; puis FLASHBACK TABLE products TO BEFORE DROP; Résultat ?",
    options: [
      "Récupère uniquement la structure",
      "Récupère structure, données et index",
      "Récupère structure et données sans index",
      "Impossible de récupérer structure, données ou index",
    ],
    correctIndexes: [3],
    explanation:
      "PURGE contourne la corbeille (recycle bin) : aucun FLASHBACK TO BEFORE DROP possible.",
    topic: "DROP / FLASHBACK",
    difficulty: "medium",
  },
  {
    id: "q84",
    moduleId: "m10",
    question: "DROP TABLE products; (sans PURGE) — quelles implications ?",
    options: [
      "Les données sont effacées mais la structure reste",
      "Données et structure sont supprimées",
      "Vues et synonymes restent mais sont invalidés",
      "La transaction en cours de la session est validée (COMMIT)",
      "Les index restent mais sont invalidés",
    ],
    correctIndexes: [1, 2, 3],
    explanation:
      "DROP est DDL : COMMIT implicite, table + données + index/contraintes associés disparaissent (ou vont au recycle bin). Vues/synonymes dépendants restent mais invalidés. Les index ne « restent » pas invalidés : ils sont droppés avec la table.",
    topic: "DROP TABLE",
    difficulty: "hard",
  },
  {
    id: "q85",
    moduleId: "m10",
    question: "Quelles trois affirmations sont vraies sur les types de données ?",
    options: [
      "Une seule colonne LONG par table",
      "TIMESTAMP ne stocke que l'heure avec fractions de secondes",
      "BLOB stocke des binaires dans un fichier OS",
      "La largeur minimale de VARCHAR2 est 1",
      "CHAR est complété par des blancs jusqu'à la largeur définie",
    ],
    correctIndexes: [0, 3, 4],
    explanation:
      "LONG : max 1/table. VARCHAR2 min 1. CHAR blank-padded. TIMESTAMP stocke date+heure. BLOB est dans la base ; BFILE pointe un fichier OS.",
    topic: "Types de données",
    difficulty: "medium",
  },
  {
    id: "q86",
    moduleId: "m10",
    question:
      "CREATE TABLE ... (qty NUMBER DEFAULT 1, slsdate DATE DEFAULT SYSDATE, payment VARCHAR2(30) DEFAULT 'CASH') — quelle syntaxe est correcte ?",
    options: [
      "DEFAULT = 1 et DEFAULT = \"CASH\"",
      "DEFAULT = 1 et DEFAULT CASH (sans quotes)",
      "DEFAULT = 1 avec guillemets autour de SYSDATE",
      "DEFAULT 1, DEFAULT SYSDATE, DEFAULT 'CASH' (sans =)",
    ],
    correctIndexes: [3],
    explanation:
      "La syntaxe Oracle est DEFAULT expression (pas DEFAULT =). Les littéraux caractère prennent des quotes simples.",
    topic: "CREATE TABLE / DEFAULT",
    difficulty: "medium",
  },
  {
    id: "q87",
    moduleId: "m10",
    question:
      "Pourquoi ORD_ITEMS échoue avec CHECK (expiry_date > SYSDATE) ?",
    options: [
      "SYSDATE est interdit dans une contrainte CHECK",
      "BETWEEN est interdit dans CHECK",
      "CHECK interdit le type DATE",
      "Une colonne ne peut pas être à la fois PK composite et FK",
    ],
    correctIndexes: [0],
    explanation:
      "CHECK ne peut pas appeler SYSDATE/USER/… (fonctions non déterministes). Une colonne peut être FK et faire partie d'une PK composite.",
    topic: "CHECK",
    difficulty: "hard",
  },
  {
    id: "q88",
    moduleId: "m10",
    question:
      "CREATE TABLE new_sales (prod_id, cust_id, order_date DEFAULT SYSDATE) AS SELECT prod_id, cust_id, time_id FROM sales; Quelle affirmation ?",
    options: [
      "La table est créée et les NOT NULL des colonnes sources sont hérités",
      "Échec : DEFAULT interdit dans CTAS",
      "Échec : noms CREATE et SELECT doivent correspondre",
      "La table est créée et les FK sont héritées",
    ],
    correctIndexes: [0],
    explanation:
      "CTAS autorise DEFAULT dans la liste de colonnes. NOT NULL est recopié ; PK/FK/CHECK/etc. ne le sont pas (sauf NOT NULL).",
    topic: "CTAS",
    difficulty: "hard",
  },
  {
    id: "q89",
    moduleId: "m10",
    question:
      "CREATE TABLE sales1 (...) AS SELECT ... FROM sales WHERE 1 = 2; Quelles deux affirmations ?",
    options: [
      "Échec car les noms de colonnes ne matchent pas",
      "Hérite des NOT NULL des colonnes sélectionnées",
      "Échec à cause du WHERE invalide",
      "Créée sans aucune ligne",
      "Hérite des PK et UNIQUE",
    ],
    correctIndexes: [1, 3],
    explanation:
      "WHERE 1=2 crée la structure vide. NOT NULL est hérité ; PK/UK/FK/CHECK ne le sont pas. Les noms peuvent différer entre liste CREATE et SELECT.",
    topic: "CTAS",
    difficulty: "medium",
  },

  // ─── Module 11 — Analytiques ───────────────────────────────────────────
  {
    id: "q90",
    moduleId: "m11",
    question: "Différence entre RANK et DENSE_RANK ?",
    options: [
      "RANK est plus rapide",
      "RANK saute des rangs après ex aequo ; DENSE_RANK ne saute pas",
      "DENSE_RANK saute des rangs ; RANK non",
      "Aucune différence",
    ],
    correctIndexes: [1],
    explanation:
      "RANK : 1,1,3. DENSE_RANK : 1,1,2. ROW_NUMBER : toujours unique 1,2,3.",
    topic: "RANK",
    difficulty: "medium",
  },
  {
    id: "q91",
    moduleId: "m11",
    question: "Que font LAG et LEAD ?",
    options: [
      "Ils trient le résultat",
      "LAG lit la ligne précédente ; LEAD la suivante",
      "Ils calculent une moyenne mobile",
      "Ils créent un numéro de ligne",
    ],
    correctIndexes: [1],
    explanation:
      "Accès à une autre ligne de la fenêtre sans self-join.",
    topic: "LAG / LEAD",
    difficulty: "medium",
  },
  {
    id: "q92",
    moduleId: "m11",
    question: "Quand s'exécutent les fonctions analytiques ?",
    options: [
      "Avant WHERE",
      "Après WHERE, GROUP BY et HAVING ; avant ORDER BY final",
      "Après ORDER BY",
      "Avant FROM",
    ],
    correctIndexes: [1],
    explanation:
      "Pour filtrer sur le résultat analytique, encapsuler dans une sous-requête/CTE.",
    topic: "Ordre d'exécution",
    difficulty: "hard",
  },
  {
    id: "q93",
    moduleId: "m11",
    question: "Que fait ROW_NUMBER() ?",
    options: [
      "Compte le nombre de lignes de la table",
      "Attribue un numéro unique à chaque ligne (même en cas d'ex aequo)",
      "Rang avec sauts",
      "Rang sans sauts",
    ],
    correctIndexes: [1],
    explanation:
      "ROW_NUMBER ne partage jamais le même numéro entre deux lignes.",
    topic: "ROW_NUMBER",
    difficulty: "medium",
  },

  // ─── Module 12 — Regex ─────────────────────────────────────────────────
  {
    id: "q94",
    moduleId: "m12",
    question: "Quelle fonction regex s'utilise dans un WHERE ?",
    options: ["REGEXP_SUBSTR", "REGEXP_LIKE", "REGEXP_REPLACE", "REGEXP_INSTR"],
    correctIndexes: [1],
    explanation:
      "REGEXP_LIKE retourne une condition booléenne. Les autres retournent une valeur.",
    topic: "REGEXP_LIKE",
    difficulty: "easy",
  },
  {
    id: "q95",
    moduleId: "m12",
    question: "Que fait le 6e paramètre de REGEXP_SUBSTR ?",
    options: [
      "Position de départ",
      "Numéro d'occurrence",
      "subexpr : groupe capturant à retourner",
      "Mode de correspondance",
    ],
    correctIndexes: [2],
    explanation:
      "subexpr extrait un groupe entre parenthèses du motif.",
    topic: "REGEXP_SUBSTR",
    difficulty: "hard",
  },

  // ─── Module 13 — Dictionnaire ──────────────────────────────────────────
  {
    id: "q96",
    moduleId: "m13",
    question: "Différence entre USER_, ALL_ et DBA_ ?",
    options: [
      "USER_ plus rapide, ALL_ plus complet, DBA_ réservé DBA",
      "USER_ = mes objets ; ALL_ = accessibles ; DBA_ = tous (privilège)",
      "Ce sont des synonymes",
      "USER_ = tables, ALL_ = vues, DBA_ = index",
    ],
    correctIndexes: [1],
    explanation:
      "Périmètre croissant : possessions → accessibles → totalité de l'instance (si droits).",
    topic: "Dictionnaire de données",
    difficulty: "medium",
  },
  {
    id: "q97",
    moduleId: "m13",
    question: "Dans quelle casse sont stockés les noms d'objets non quotés ?",
    options: ["Minuscules", "Majuscules", "Telle que saisie", "CamelCase"],
    correctIndexes: [1],
    explanation:
      "Oracle plie en MAJUSCULES. Filtrer avec table_name = 'EMPLOYEES'.",
    topic: "Dictionnaire de données",
    difficulty: "medium",
  },
  {
    id: "q98",
    moduleId: "m13",
    question:
      "Dans USER_CONSTRAINTS, quelles deux affirmations sont vraies ?",
    options: [
      "R_CONSTRAINT_NAME est un autre nom de la contrainte locale",
      "constraint_type = 'C' indique une contrainte CHECK (y compris NOT NULL)",
      "STATUS indique si la table est utilisée",
      "DELETE_RULE décrit le comportement sur les lignes enfants si la parent est supprimée",
    ],
    correctIndexes: [1, 3],
    explanation:
      "'C' = check/not null. DELETE_RULE (CASCADE/SET NULL/NO ACTION) concerne les FK. R_CONSTRAINT_NAME référence la contrainte parent. STATUS = ENABLED/DISABLED de la contrainte.",
    topic: "USER_CONSTRAINTS",
    difficulty: "hard",
  },

  // ─── Module 14 — Examen ────────────────────────────────────────────────
  {
    id: "q99",
    moduleId: "m14",
    question: "Format typique de l'examen 1Z0-071 ?",
    options: [
      "50 questions, 70 %",
      "63 questions, 63 %",
      "70 questions, 60 %",
      "63 questions, 70 %",
    ],
    correctIndexes: [1],
    explanation:
      "63 questions à choix multiples, score de passage 63 %. Durée officielle typique : 100 minutes (selon fiche Oracle en vigueur).",
    topic: "Format examen",
    difficulty: "easy",
  },
  {
    id: "q100",
    moduleId: "m14",
    question: "Y a-t-il une pénalité pour les mauvaises réponses ?",
    options: [
      "Oui, −1 par erreur",
      "Non, aucune pénalité",
      "Oui, seulement pour les questions non répondues",
      "Cela dépend du type de question",
    ],
    correctIndexes: [1],
    explanation:
      "Pas de malus : mieux vaut répondre à tout, même en devinant.",
    topic: "Stratégie",
    difficulty: "easy",
  },

  // ─── Module 15 — SQL*Plus / outils ─────────────────────────────────────
  {
    id: "q101",
    moduleId: "m15",
    question:
      "En SQL*Plus / SQLcl, quelle affirmation est vraie ?",
    options: [
      "DESCRIBE et SPOOL sont des commandes SQL standard exécutées par le serveur",
      "DESCRIBE, SET, SHOW et SPOOL sont des commandes d'interface client",
      "SPOOL envoie le résultat uniquement vers une table Oracle",
      "SET AUTOCOMMIT OFF est ignoré car Oracle commit toujours",
    ],
    correctIndexes: [1],
    explanation:
      "DESC/DESCRIBE, SET, SHOW, SPOOL, CONNECT sont des commandes du client (SQL*Plus/SQLcl), pas du moteur SQL. SPOOL écrit dans un fichier OS.",
    topic: "SQL*Plus",
    difficulty: "easy",
  },

  // ─── Module 16+ — Privilèges / sécurité / objets avancés ───────────────
  {
    id: "q102",
    moduleId: "m16",
    question:
      "GRANT ALL ON orders, order_items TO PUBLIC; Quelle correction ?",
    options: [
      "Remplacer PUBLIC par des utilisateurs nommés",
      "Remplacer ALL par une liste de privilèges",
      "Ajouter WITH GRANT OPTION",
      "Séparer en deux GRANT (une table chacun)",
    ],
    correctIndexes: [3],
    explanation:
      "GRANT object privilege ne porte que sur un seul objet à la fois.",
    topic: "GRANT",
    difficulty: "medium",
  },
  {
    id: "q103",
    moduleId: "m16",
    question: "Quelle instruction octroie correctement un privilège système ?",
    options: [
      "GRANT EXECUTE ON prod TO PUBLIC",
      "GRANT CREATE VIEW ON table1 TO user1",
      "GRANT CREATE TABLE TO user1, user2",
      "GRANT CREATE SESSION TO ALL",
    ],
    correctIndexes: [2],
    explanation:
      "Les privilèges système (CREATE TABLE, CREATE SESSION…) s'octroient sans ON objet. EXECUTE ON prod est un privilège objet. TO ALL n'existe pas (utiliser PUBLIC).",
    topic: "Privilèges système",
    difficulty: "medium",
  },
  {
    id: "q104",
    moduleId: "m10",
    question: "Quelle affirmation est vraie sur les tables externes ?",
    options: [
      "REJECT LIMIT par défaut = UNLIMITED",
      "Données et métadonnées sont toutes hors base",
      "ORACLE_LOADER et ORACLE_DATAPUMP sont strictement équivalents",
      "CTAS peut charger une table régulière depuis une table externe",
    ],
    correctIndexes: [3],
    explanation:
      "Les métadonnées sont dans le dictionnaire ; les données restent dans les fichiers. CTAS depuis external table est un pattern classique d'import.",
    topic: "External tables",
    difficulty: "medium",
  },
  {
    id: "q105",
    moduleId: "m9",
    question:
      "INSERT ALL WHEN ... THEN INTO ... SELECT ... ; Comment les lignes sont-elles évaluées ?",
    options: [
      "Chaque ligne est testée par toutes les clauses WHEN, indépendamment des autres",
      "Dès qu'un WHEN est vrai, les WHEN suivants sont ignorés pour cette ligne",
      "Si un WHEN est faux, les suivants ne sont pas évalués",
      "Erreur obligatoire sans clause ELSE",
    ],
    correctIndexes: [0],
    explanation:
      "INSERT ALL multi-WHEN (unconditional all) évalue toutes les conditions WHEN pour chaque ligne. Ce n'est pas un IF-ELSE exclusif (contrairement à INSERT FIRST).",
    topic: "INSERT ALL",
    difficulty: "hard",
  },
  {
    id: "q106",
    moduleId: "m2",
    question:
      "Quelles deux tâches exigent une sous-requête ou une jointure en une seule instruction ?",
    options: [
      "Nombre de clients par ville dont le crédit > moyenne globale du crédit",
      "Crédit moyen des hommes à Tokyo ou Sydney",
      "Clients sans crédit nés avant 1980",
      "Nombre de clients mariés par ville",
      "Clients dont le crédit égale celui des clients de Tokyo",
    ],
    correctIndexes: [0, 4],
    explanation:
      "Comparer à une moyenne globale ou au crédit d'un autre ensemble nécessite sous-requête/jointure. Les autres se font avec WHERE/GROUP BY simples.",
    topic: "Sous-requêtes",
    difficulty: "hard",
  },
  {
    id: "q107",
    moduleId: "m4",
    question:
      "SELECT member_id AS \"MEMBER ID\", due_date AS \"DUE DATE\", '$2' AS \"LATE FEE\" FROM books_transactions; Résultat ?",
    options: [
      "Échec : alias invalides",
      "Échec : espaces entre quotes invalides",
      "Une seule colonne avec l'alias final",
      "Trois colonnes ; seul le dernier en-tête est remplacé par l'alias littéral $2",
    ],
    correctIndexes: [3],
    explanation:
      "Les alias entre guillemets doubles sont valides (espaces OK). '$2' est un littéral chaîne affiché comme valeur de la 3e colonne.",
    topic: "Alias / littéraux",
    difficulty: "medium",
  },
  {
    id: "q108",
    moduleId: "m2",
    question:
      "SELECT member_id, ' ', first_name, ' ', last_name \"ID FIRSTNAME LASTNAME\" FROM members; Résultat ?",
    options: [
      "Échec : alias invalide",
      "Échec : espaces entre quotes invalides",
      "Une seule colonne avec cet alias",
      "Plusieurs colonnes ; seul le dernier en-tête prend l'alias",
    ],
    correctIndexes: [3],
    explanation:
      "Chaque expression du SELECT est une colonne. L'alias ne s'applique qu'à last_name. Les ' ' sont des colonnes littérales.",
    topic: "SELECT / alias",
    difficulty: "medium",
  },
  {
    id: "q109",
    moduleId: "m8",
    question:
      "... ORDER BY department_id UNION SELECT ... Quelle issue ?",
    options: [
      "Échec : il faut un ORDER BY positionnel",
      "Succès avec tri croissant sur DEPARTMENT_ID",
      "Succès en ignorant ORDER BY",
      "Échec : ORDER BY doit être à la fin de tout l'ensemble",
    ],
    correctIndexes: [3],
    explanation:
      "ORDER BY au milieu d'une chaîne d'opérateurs ensemblistes est illégal.",
    topic: "UNION / ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q110",
    moduleId: "m7",
    question: "Quelles deux affirmations sur l'exécution des sous-requêtes corrélées ?",
    options: [
      "L'interne s'exécute après qu'une ligne externe est disponible",
      "L'interne s'exécute entièrement avant l'externe",
      "L'externe ne s'exécute qu'une fois pour tout le résultat interne",
      "Chaque ligne externe est évaluée par rapport au résultat interne",
    ],
    correctIndexes: [0, 3],
    explanation:
      "Pour chaque ligne externe, l'interne est (conceptuellement) réexécutée ; le prédicat externe utilise ce résultat.",
    topic: "Sous-requête corrélée",
    difficulty: "medium",
  },
  {
    id: "q111",
    moduleId: "m10",
    question:
      "Quelles deux syntaxes créent EMPLOYEES avec EMPLOYEE_ID et LOGIN_ID uniques et NOT NULL ?",
    options: [
      "UNIQUE composite seul, sans NOT NULL",
      "PRIMARY KEY composite (employee_id, login_id)",
      "PK sur employee_id seul + UNIQUE sur login_id (login_id peut être NULL en UK seule si non NN)",
      "UNIQUE composite + NOT NULL sur chaque colonne",
      "NOT NULL sur chaque colonne + UNIQUE composite",
    ],
    correctIndexes: [1, 4],
    explanation:
      "PK composite ⇒ UNIQUE + NOT NULL sur les deux. Sinon : NOT NULL explicite sur chaque colonne + UNIQUE (employee_id, login_id).",
    topic: "Contraintes",
    difficulty: "hard",
  },
  {
    id: "q112",
    moduleId: "m3",
    question:
      "ORDER BY amount_sold FETCH FIRST 5 PERCENT ROWS ONLY; Que produit la requête ?",
    options: [
      "5 % des produits au plus fort amount_sold",
      "Les 5 premières % de lignes physiques du segment",
      "5 % des lignes au plus faible amount_sold",
      "Erreur : ORDER BY doit être en dernier",
    ],
    correctIndexes: [2],
    explanation:
      "ORDER BY amount_sold (ASC par défaut) puis FETCH FIRST 5 PERCENT → les plus petits montants. ORDER BY précède correctement FETCH.",
    topic: "FETCH FIRST",
    difficulty: "medium",
  },
  {
    id: "q113",
    moduleId: "m9",
    question:
      "MERGE INTO orders_master o USING monthly_orders m ON (o.order_id = m.order_id) WHEN MATCHED THEN UPDATE SET o.order_total = m.order_total DELETE WHERE (m.order_total IS NULL) WHEN NOT MATCHED THEN INSERT VALUES (...). Données : master 1/1000,2/2000,3/3000,4/NULL ; monthly 2/2500,3/NULL. Résultat dans master ?",
    options: [
      "IDs 1, 2, 3, 4",
      "IDs 1, 2, 4",
      "IDs 1, 2, 3",
      "IDs 1, 2",
    ],
    correctIndexes: [1],
    explanation:
      "2 est mis à jour (2500). 3 est matché puis DELETE car m.order_total IS NULL. 1 et 4 inchangés. → 1, 2, 4.",
    topic: "MERGE",
    difficulty: "hard",
  },
  {
    id: "q114",
    moduleId: "m2",
    question: "Quelles deux conditions WHERE utilisent correctement les conversions ?",
    options: [
      "WHERE order_date IN (TO_DATE('OCT 21 2003','MON DD YYYY'), TO_CHAR('NOV 21 2003','MON DD YYYY'))",
      "WHERE order_date > TO_CHAR(ADD_MONTHS(SYSDATE,6),'MON DD YYYY')",
      "WHERE TO_CHAR(order_date,'MON DD YYYY') = 'JAN 20 2003'",
      "WHERE order_date > TO_DATE('JUL 10 2006','MON DD YYYY')",
    ],
    correctIndexes: [2, 3],
    explanation:
      "Comparer DATE à DATE (TO_DATE) ou formater la DATE en chaîne pour comparer à une chaîne. TO_CHAR sur une chaîne ou comparer DATE à une chaîne formatée côté droit est incorrect.",
    topic: "Conversion de types",
    difficulty: "hard",
  },
  {
    id: "q115",
    moduleId: "m6",
    question:
      "Self-join sur PROJ_TASK_DETAILS : lister chaque tâche, son BASED_ON, et le responsable de la tâche dépendante — y compris tâches sans dépendance. Quelle jointure ?",
    options: [
      "JOIN sur p.task_id = d.task_id",
      "FULL OUTER JOIN sur p.based_on = d.task_id",
      "INNER JOIN sur p.based_on = d.task_id",
      "LEFT OUTER JOIN sur p.based_on = d.task_id",
    ],
    correctIndexes: [3],
    explanation:
      "LEFT JOIN depuis la tâche (p) vers la dépendance (d) conserve les tâches sans BASED_ON.",
    topic: "Self-join / OUTER",
    difficulty: "hard",
  },
  {
    id: "q116",
    moduleId: "m1",
    question: "Quelles deux tâches peuvent être faites en SQL Oracle (pas PL/SQL/OS) ?",
    options: [
      "Changer le mot de passe d'un utilisateur existant",
      "Se connecter à une instance",
      "Interroger des tables via database links",
      "Démarrer une instance",
      "Exécuter des commandes OS dans la session",
    ],
    correctIndexes: [0, 2],
    explanation:
      "ALTER USER ... IDENTIFIED BY ... et SELECT via DB link sont du SQL. CONNECT/startup/host sont des commandes outil ou privileges SYSDBA, hors SQL pur de session standard.",
    topic: "Périmètre SQL",
    difficulty: "medium",
  },
  {
    id: "q117",
    moduleId: "m10",
    question:
      "CREATE TABLE citizens (citizen_id CHAR(10) PRIMARY KEY, ..., city VARCHAR2(30) DEFAULT 'SEATTLE' NOT NULL, CONSTRAINT cnames CHECK (first_name <> last_name)); Résultat ?",
    options: [
      "Échec : DEFAULT et NOT NULL incompatibles",
      "Succès ; CITY ne peut valoir que 'SEATTLE' ou NULL",
      "Échec : CHECK invalide",
      "Succès ; un index est créé pour CITIZEN_ID",
    ],
    correctIndexes: [3],
    explanation:
      "DEFAULT + NOT NULL est valide. PRIMARY KEY crée un index unique. CITY peut recevoir d'autres valeurs explicites ; NULL est interdit par NOT NULL.",
    topic: "CREATE TABLE",
    difficulty: "medium",
  },
  {
    id: "q118",
    moduleId: "m9",
    question:
      "UPDATE (SELECT order_date, order_total, customer_id FROM orders) SET order_date = '22-mar-2007' WHERE customer_id IN (...); Quelle affirmation ?",
    options: [
      "Échec : sous-requête interdite dans WHERE d'un UPDATE",
      "Échec : deux tables dans un UPDATE",
      "Exécution OK ; seules les colonnes du SELECT sont modifiables",
      "Échec : SELECT interdit à la place du nom de table",
    ],
    correctIndexes: [2],
    explanation:
      "UPDATE sur une sous-requête/inline view est autorisé ; seules les colonnes projetées peuvent être mises à jour (vue clé-préservée).",
    topic: "UPDATE",
    difficulty: "hard",
  },
  {
    id: "q119",
    moduleId: "m2",
    question:
      "IN (1000,2000,3000) vs OR de trois égalités — quelle affirmation ?",
    options: [
      "La requête 2 est plus rapide seulement s'il y a des NULL",
      "Aucune différence de performance significative attendue",
      "La requête 2 se dégrade forcément",
      "La requête 2 s'améliore forcément",
    ],
    correctIndexes: [1],
    explanation:
      "Oracle réécrit généralement IN en disjonctions équivalentes. Pas de gain/perte systématique.",
    topic: "IN vs OR",
    difficulty: "easy",
  },
  {
    id: "q120",
    moduleId: "m14",
    question:
      "Sur une question « Which two statements are true ? », quelle stratégie est la plus sûre ?",
    options: [
      "Choisir la première option plausible et passer",
      "Sélectionner exactement deux réponses après élimination des distracteurs",
      "Sélectionner toutes les options pour maximiser le score",
      "Ne répondre que s'il y a une seule évidence",
    ],
    correctIndexes: [1],
    explanation:
      "Les questions multi-réponses exigent le bon ensemble. Trop ou trop peu de cases = faux. Pas de pénalité, mais la précision du set compte.",
    topic: "Stratégie examen",
    difficulty: "easy",
  },

  // ─── Questions supplémentaires (PDF OCA 1Z0-071 / SQL 2) ───
{
    id: "q121",
    moduleId: "m10",
    question: "Evaluate the following ALTER TABLE statement: ALTER TABLE orders SET UNUSED order_date; Which statement is true?",
    options: [
      "The DESCRIBE command would still display the ORDER_DATE column.",
      "ROLLBACK can be used to get back the ORDER_DATE column in the ORDERS table.",
      "The ORDER_DATE column should be empty for the ALTER TABLE command to execute successfully.",
      "After executing the ALTER TABLE command, you can add a new column called ORDER_DATE to the ORDERS table."
    ],
    correctIndexes: [3],
    explanation: "SET UNUSED rend la colonne invisible (plus dans DESC), DDL non annulable. Le nom est libéré : on peut recréer ORDER_DATE.",
    topic: "ALTER TABLE",
    difficulty: "medium",
  },
  {
    id: "q122",
    moduleId: "m1",
    question: "Examine the business rule: Each student can take up multiple projects and each project can have multiple students. You need to design an Entity Relationship Model (ERD) for optimal data storage and allow for generating reports in this format: STUDENT_ID FIRST_NAME LAST_NAME PROJECT_ID PROJECT_NAME PROJECT_TASK Which two statements are true in this scenario?",
    options: [
      "The ERD must have a 1: M relationship between the students and projects entitles.",
      "The ERD must have a M:M relationship between the students and projects entities that must be resolved into 1:M relationships.",
      "STUDENT_ID must be the primary key in the STUDENTS entity and foreign key in the projects entity.",
      "PROJECT_ID must be the primary key in the projects entity and foreign key in the STUDENTS entity.",
      "An associative table must be created with a composite key of STUDENT_ID and PROJECT_ID; which is the foreign key linked to the STUDENTS and PROJECTS entities."
    ],
    correctIndexes: [1, 4],
    explanation: "Relation N:N → table associative avec clé composite des deux FK.",
    topic: "Modèle relationnel",
    difficulty: "medium",
  },
  {
    id: "q123",
    moduleId: "m10",
    question: "The first DROP operation is performed on PRODUCTS table using the following command: DROP TABLE products PURGE; Then you performed the FLASHBACK operation by using the following command: FLASHBACK TABLE products TO BEFORE DROP; Which statement describes the outcome of the FLASHBACK command?",
    options: [
      "It recovers only the table structure.",
      "It recovers the table structure, data, and the indexes.",
      "It recovers the table structure and data but not the related indexes.",
      "It is not possible to recover the table structure, data, or the related indexes."
    ],
    correctIndexes: [3],
    explanation: "PURGE contourne le recycle bin : FLASHBACK TO BEFORE DROP impossible.",
    topic: "DROP / FLASHBACK",
    difficulty: "medium",
  },
  {
    id: "q124",
    moduleId: "m7",
    question: "The following are the steps for a correlated subquery, listed in random order: 1) The WHERE clause of the outer query is evaluated. 2) The candidate row is fetched from the table specified in the outer query. 3) The procedure is repeated for the subsequent rows of the table, till all the rows are processed. 4) Rows are returned by the inner query, after being evaluated with the value from the candidate row in the outer query. Identify the option that contains the steps in the correct sequence in which the Oracle server evaluates a correlated subquery.",
    options: [
      "4,2,1,3",
      "4,1,2,3",
      "2,4,1,3",
      "2,1,4,3"
    ],
    correctIndexes: [2],
    explanation: "Ordre : ligne externe (2) → interne (4) → WHERE externe (1) → répétition (3).",
    topic: "Sous-requête corrélée",
    difficulty: "hard",
  },
  {
    id: "q125",
    moduleId: "m16",
    question: "The user SCOTT who is the owner of ORDERS and ORDER_ITEMS tables issues the following GRANT command: GRANT ALL ON orders, order_items TO PUBLIC; What correction needs to be done to the above statement?",
    options: [
      "PUBLIC should be replaced with specific usernames.",
      "ALL should be replaced with a list of specific privileges.",
      "WITH GRANT OPTION should be added to the statement.",
      "Separate GRANT statements are required for ORDERS and ORDER_ITEMS tables."
    ],
    correctIndexes: [3],
    explanation: "Un GRANT objet ne porte que sur un seul objet à la fois.",
    topic: "GRANT",
    difficulty: "medium",
  },
  {
    id: "q126",
    moduleId: "m16",
    question: "Which statement correctly grants a system privilege?",
    options: [
      "GRANT EXECUTE ON prod TO PUBLIC;",
      "GRANT CREATE VIEW ON table 1 TO user;",
      "GRANT CREATE TABLE TO user1, user2;",
      "GRANT CREATE SESSION TO ALL;"
    ],
    correctIndexes: [2],
    explanation: "CREATE TABLE est un privilège système (sans ON objet). TO ALL n'existe pas.",
    topic: "Privilèges système",
    difficulty: "medium",
  },
  {
    id: "q127",
    moduleId: "m10",
    question: "Which statement is true regarding external tables?",
    options: [
      "The default REJECT LIMIT for external tables is UNLIMITED.",
      "The data and metadata for an external table are stored outside the database.",
      "ORACLE_LOADER and ORACLE_DATAPUMP have exactly the same functionality when used with an external table.",
      "The CREATE TABLE AS SELECT statement can be used to unload data into regular table in the database from an external table."
    ],
    correctIndexes: [3],
    explanation: "CTAS depuis une external table charge une table régulière. Métadonnées dans le dictionnaire.",
    topic: "External tables",
    difficulty: "medium",
  },
  {
    id: "q128",
    moduleId: "m10",
    question: "Which three statements are true regarding the data types?",
    options: [
      "Only one LONG column can be used per table.",
      "A TIMESTAMP data type column stores only time values with fractional seconds.",
      "The BLOB data type column is used to store binary data in an operating system file.",
      "The minimum column width that can be specified for a varchar2 data type column is one.",
      "The value for a CHAR data type column is blank-padded to the maximum defined column width."
    ],
    correctIndexes: [0, 3, 4],
    explanation: "Une seule LONG/table ; VARCHAR2 min 1 ; CHAR blank-padded. TIMESTAMP = date+heure ; BLOB ≠ fichier OS.",
    topic: "Types de données",
    difficulty: "medium",
  },
  {
    id: "q129",
    moduleId: "m10",
    question: "You issue the following command to drop the PRODUCTS table: SQL>DROP TABLE products; What is the implication of this command? (Choose all that apply.)",
    options: [
      "All data in the table are deleted but the table structure will remain",
      "All data along with the table structure is deleted",
      "All views and synonyms will remain but they are invalidated",
      "The pending transaction in the session is committed",
      "All indexes on the table will remain but they are invalidated"
    ],
    correctIndexes: [1, 2, 3],
    explanation: "DROP : données+structure, COMMIT implicite, vues/synonymes invalidés. Les index ne restent pas.",
    topic: "DROP TABLE",
    difficulty: "hard",
  },
  {
    id: "q130",
    moduleId: "m1",
    question: "Which three statements are true regarding constraints? (Choose three.)",
    options: [
      "A constraint can be disabled even if the constraint column contains data.",
      "All the constraints can be defined at the column level as well as the table level",
      "A foreign key cannot contain NULL values.",
      "A column with the UNIQUE constraint can contain NULL",
      "A constraint is enforced only for the INSERT operation on a table.",
      "You can have more than one column in a table as part of a primary key."
    ],
    correctIndexes: [0, 3, 5],
    explanation: "DISABLE possible avec données ; UNIQUE accepte NULL ; PK composite OK. NOT NULL ≠ niveau table.",
    topic: "Contraintes",
    difficulty: "hard",
  },
  {
    id: "q131",
    moduleId: "m7",
    question: "Which two statements are true regarding the EXISTS operator used in the correlated subqueries?",
    options: [
      "It is used to test whether the values retrieved by the inner query exist in the result of the outer query.",
      "The outer query continues evaluating the result set of the inner query until all the values in the result set are processed.",
      "It is used to test whether the values retrieved by the outer query exist in the result set of the inner query.",
      "The outer query stops evaluating the result set of the inner query when the first value is found."
    ],
    correctIndexes: [2, 3],
    explanation: "EXISTS teste l'existence pour la ligne externe et s'arrête à la première correspondance.",
    topic: "EXISTS",
    difficulty: "medium",
  },
  {
    id: "q132",
    moduleId: "m1",
    question: "Which two tasks can be performed by using Oracle SQL statements?",
    options: [
      "changing the password for an existing database",
      "connecting to a database instance",
      "querying data from tables across databases",
      "starting up a database instance",
      "executing operating system (OS) commands in a session"
    ],
    correctIndexes: [0, 2],
    explanation: "ALTER USER (mot de passe) et SELECT via DB link sont du SQL. CONNECT/startup/host ne le sont pas.",
    topic: "Périmètre SQL",
    difficulty: "medium",
  },
  {
    id: "q133",
    moduleId: "m10",
    question: "Which two statements are true about sequences created in a single instance database? (Choose two.)",
    options: [
      "CURRVAL is used to refer to the last sequence number that has been generated",
      "DELETE <sequencename> would remove a sequence from the database",
      "The numbers generated by a sequence can be used only for one table",
      "When the MAXVALUE limit for a sequence is reached, you can increase the MAXVALUE limit by using the ALTER SEQUENCE statement",
      "When a database instance shuts down abnormally, the sequence numbers that have been cached but not used would be available once again when the database instance is restarted."
    ],
    correctIndexes: [0, 4],
    explanation: "CURRVAL référence le dernier numéro généré dans la session. Les numéros en cache non utilisés peuvent être perdus après un arrêt anormal. Une séquence n'est pas liée à une seule table ; on la supprime avec DROP SEQUENCE, pas DELETE.",
    topic: "Séquences",
    difficulty: "medium",
  },
  {
    id: "q134",
    moduleId: "m5",
    question: "Which statements are true regarding the WHERE and HAVING clauses in a SELECT statement? (Choose all that apply.)",
    options: [
      "The HAVING clause can be used with aggregate functions in subqueries.",
      "The WHERE clause can be used to exclude rows after dividing them into groups.",
      "The WHERE clause can be used to exclude rows before dividing them into groups.",
      "The aggregate functions and columns used in the HAVING clause must be specified in the SELECT list of the query.",
      "The WHERE and HAVING clauses can be used in the same statement only if they are applied to different columns in the table."
    ],
    correctIndexes: [0, 2],
    explanation: "WHERE filtre les lignes avant le regroupement. HAVING peut utiliser des agrégats (y compris dans des sous-requêtes). WHERE ne filtre pas après GROUP BY. HAVING n'exige pas que ses expressions soient dans le SELECT.",
    topic: "WHERE / HAVING",
    difficulty: "medium",
  },
  {
    id: "q135",
    moduleId: "m2",
    question: "Examine the structure of the BOOKS_TRANSACTIONS table: You want to display the member IDs, due date, and late fee as $2 for all transactions. Which SQL statement must you execute?",
    options: [
      "select member_id as member_id, due_date as due_date, $2 as late_fee from books_transactions;",
      "select member_id 'member_id', due_date 'due_date', '$2 as late_fee' from books_transactions;",
      "select member_id as \"member_id\", due_date as \"due_date\", '$2' as \"late_fee\" from books_transactions;",
      "select member_id as \"member_id\", due_date as \"due_date\", $2 as \"late_fee\" from books_transactions;"
    ],
    correctIndexes: [2],
    explanation: "Alias entre guillemets doubles OK ; '$2' est un littéral chaîne valide.",
    topic: "Alias / littéraux",
    difficulty: "medium",
  },
  {
    id: "q136",
    moduleId: "m7",
    question: "Which three statements are true regarding the usage of the WITH clause in complex correlated Subqueries?",
    options: [
      "It can be used with the SELECT clause",
      "The WITH clause can hold more than one query",
      "If the query block name and the table name were the same, then the table name would take precedence",
      "The query name in the WITH clause is visible to the other query blocks in the WITH clause as well as to the main query block"
    ],
    correctIndexes: [0, 1, 3],
    explanation: "WITH définit des sous-requêtes nommées réutilisables ; utile pour factoriser ; peut référencer d'autres CTE.",
    topic: "WITH / CTE",
    difficulty: "hard",
  },
  {
    id: "q137",
    moduleId: "m9",
    question: "INSERT ALL WHEN order_total < 10000 THEN INTO small_orders WHEN order_total > 10000 AND order_total < 20000 THEN INTO medium_orders WHEN order_total > 20000 THEN INTO large_orders SELECT order_id, order_total, sales_rep_id, customer_id FROM orders; Which statement is true regarding the evaluation of rows returned by the subquery in the INSERT statement?",
    options: [
      "They are evaluated by all the three WHEN clauses regardless of the results of the evaluation of any other WHEN clause.",
      "They are evaluated by first WHEN clause. If the condition is true, then the row would be evaluated by the subsequent WHEN clauses",
      "They are evaluated by first WHEN clause. If the condition is false, then the row would be evaluated by the subsequent WHEN clauses",
      "The INSERT statement would give an error because the ELSE clause is not present for support in case none of the WHEN clauses are true"
    ],
    correctIndexes: [0],
    explanation: "INSERT ALL multi-WHEN évalue toutes les conditions WHEN pour chaque ligne (pas IF exclusif).",
    topic: "INSERT ALL",
    difficulty: "hard",
  },
  {
    id: "q138",
    moduleId: "m4",
    question: "Which three statements are true regarding single-row functions? (Choose three.)",
    options: [
      "They can accept only one argument.",
      "They can be nested up to only two levels.",
      "They can return multiple values of more than one data type.",
      "They can be used in SELECT, WHERE, and ORDER BY clauses.",
      "They can modify the data type of the argument that is referenced.",
      "They can accept a column name, expression, variable name, or a user-supplied constant as arguments."
    ],
    correctIndexes: [3, 4, 5],
    explanation: "Les fonctions mono-ligne s'utilisent dans SELECT/WHERE/ORDER BY, peuvent changer le type (TO_CHAR…), et acceptent colonne/expression/constante. Elles n'acceptent pas « un seul argument » ni une limite de 2 niveaux d'imbrication.",
    topic: "Fonctions mono-ligne",
    difficulty: "medium",
  },
  {
    id: "q139",
    moduleId: "m17",
    question: "Which three statements indicate the end of a transaction? (Choose three.)",
    options: [
      "after a COMMIT is issued",
      "after a ROLLBACK is issued",
      "after a SAVEPOINT is issued",
      "after a SELECT statement is issued",
      "after a CREATE statement is issued"
    ],
    correctIndexes: [0, 1, 4],
    explanation: "COMMIT, ROLLBACK et toute instruction DDL (ex. CREATE) terminent une transaction. SAVEPOINT et SELECT ne la terminent pas.",
    topic: "Fin de transaction",
    difficulty: "medium",
  },
  {
    id: "q140",
    moduleId: "m16",
    question: "Which statement correctly differentiates a system privilege from an object privilege?",
    options: [
      "System privileges can be granted only by the DBA whereas object privileges can be granted by DBAs or the owner of the object.",
      "System privileges give the rights to only create user schemas whereas object privileges give rights to manipulate objects in a schema.",
      "Users require system privileges to gain access to the database whereas they require object privileges to create objects in the database.",
      "A system privilege is the right to perform specific activities in a database whereas an object privilege is a right to perform activities on a specific object in the database."
    ],
    correctIndexes: [3],
    explanation: "Privilège système = droit d'activité au niveau base (CREATE SESSION, CREATE TABLE…). Privilège objet = droit sur un objet précis (SELECT ON hr.employees).",
    topic: "Privilèges",
    difficulty: "medium",
  },
  {
    id: "q141",
    moduleId: "m7",
    question: "A subquery is called a single-row subquery when ____.",
    options: [
      "The inner query returns a single value to the main query",
      "The inner query uses an aggregate function and returns one or more values",
      "There is only one inner query in the main query and the inner query returns one or more values",
      "The inner query returns one or more values and the main query returns a single value as output"
    ],
    correctIndexes: [0],
    explanation: "Une sous-requête mono-ligne retourne au plus une ligne / une valeur, utilisable avec =, <, >. Si plusieurs lignes → ORA-01427.",
    topic: "Sous-requête mono-ligne",
    difficulty: "easy",
  },
  {
    id: "q142",
    moduleId: "m7",
    question: "Which three statements are true regarding subqueries? (Choose three.)",
    options: [
      "The ORDER BY clause can be used in the subquery.",
      "A subquery can be used in the FROM clause of a SELECT statement.",
      "If the subquery returns NULL; the main query may still return result rows.",
      "A subquery can be placed in a WHERE clause, GROUP BY clause, or a HAVING clause.",
      "Logical operators, such as AND, OR and NOT, cannot be used in the WHERE clause of a subquery."
    ],
    correctIndexes: [0, 1, 2],
    explanation: "ORDER BY est autorisé dans une sous-requête (selon contexte). Une sous-requête peut apparaître dans le FROM. Si elle retourne NULL, la requête principale peut encore renvoyer des lignes selon le prédicat.",
    topic: "Sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "q143",
    moduleId: "m3",
    question: "Examine the following query: SQL> SELECT prod_id, amount_sold FROM sales ORDER BY amount_sold FETCH FIRST 5 PERCENT ROWS ONLY; What is the output of this query?",
    options: [
      "It displays 5 percent of the products with the highest amount sold.",
      "It displays the first 5 percent of the rows from the SALES table.",
      "It displays 5 percent of the products with the lowest amount sold.",
      "It results in an error because the ORDER BY clause should be the last clause."
    ],
    correctIndexes: [2],
    explanation: "ORDER BY amount_sold ASC + FETCH FIRST 5 PERCENT → les plus petits montants.",
    topic: "FETCH FIRST",
    difficulty: "medium",
  },
  {
    id: "q144",
    moduleId: "m7",
    question: "Which two statements are true regarding multiple-row subqueries? (Choose two.)",
    options: [
      "They can contain group functions.",
      "They always contain a subquery within a subquery.",
      "They use the < ALL operator to imply less than the maximum.",
      "They can be used to retrieve multiple rows from a single table only.",
      "They should not be used with the NOT IN operator in the main query if NULL is likely to be a part of the result of the subquery"
    ],
    correctIndexes: [0, 2],
    explanation: "Utilisent IN/ANY/ALL ; peuvent retourner plusieurs lignes. = seul est interdit si multi-lignes.",
    topic: "Multi-row subquery",
    difficulty: "medium",
  },
  {
    id: "q145",
    moduleId: "m9",
    question: "Which two statements are true about Data Manipulation Language (DML) statements?",
    options: [
      "An INSERT INTO…VALUES.. statement can add multiple rows per execution to a table.",
      "An UPDATE… SET… statement can modify multiple rows based on multiple conditions on a table.",
      "A DELETE FROM….. statement can remove rows based on only a single condition on a table.",
      "An INSERT INTO… VALUES….. statement can add a single row based on multiple conditions on a table.",
      "A DELETE FROM….. statement can remove multiple rows based on multiple conditions on a table.",
      "An UPDATE….SET…. statement can modify multiple rows based on only a single condition on a table."
    ],
    correctIndexes: [1, 4],
    explanation: "UPDATE/DELETE peuvent affecter N lignes via WHERE. INSERT VALUES classique = 1 ligne.",
    topic: "DML",
    difficulty: "medium",
  },
  {
    id: "q146",
    moduleId: "m5",
    question: "Which three statements are true regarding group functions? (Choose three.)",
    options: [
      "They can be used on columns or expressions.",
      "They can be passed as an argument to another group function.",
      "They can be used only with a SQL statement that has the GROUP BY clause.",
      "They can be used on only one column in the SELECT clause of a SQL statement.",
      "They can be used along with the single-row function in the SELECT clause of a SQL statement."
    ],
    correctIndexes: [0, 1, 4],
    explanation: "Colonnes/expressions ; imbricables ; combinables avec fonctions mono-ligne.",
    topic: "Fonctions de groupe",
    difficulty: "medium",
  },
  {
    id: "q147",
    moduleId: "m4",
    question: "Evaluate the following query: SQL> SELECT TRUNC (ROUND(156.00, -1),-1) FROM DUAL; What would be the outcome?",
    options: [
      "150",
      "200",
      "160",
      "16",
      "100"
    ],
    correctIndexes: [2],
    explanation: "ROUND(156,-1)=160 ; TRUNC(160,-1)=160.",
    topic: "ROUND / TRUNC",
    difficulty: "hard",
  },
  {
    id: "q148",
    moduleId: "m8",
    question: "Which statement is true regarding the INTERSECT operator?",
    options: [
      "The names of columns in all SELECT statements must be identical.",
      "It ignores NULL values.",
      "Reversing the order of the intersected tables alters the result.",
      "The number of columns and data types must be identical for all SELECT statements in the query."
    ],
    correctIndexes: [3],
    explanation: "INTERSECT exige le même nombre de colonnes et des types compatibles. Les noms n'ont pas besoin d'être identiques. Les NULL ne sont pas « ignorés ». L'ordre des opérandes n'altère pas le résultat ensembliste.",
    topic: "INTERSECT",
    difficulty: "medium",
  },
  {
    id: "q149",
    moduleId: "m6",
    question: "Which statement is true about an inner join specified in the WHERE clause of a query?",
    options: [
      "It must have primary-key and foreign-key constraints defined on the columns used in the join condition.",
      "It requires the column names to be the same in all tables used for the join conditions.",
      "It is applicable for equijoin and non equijoin conditions.",
      "It is applicable for only equijoin conditions."
    ],
    correctIndexes: [2],
    explanation: "Une jointure dans le WHERE peut être équijoin ou non-équijoin. Pas besoin de contraintes PK/FK ni d'homonymie des colonnes.",
    topic: "INNER JOIN",
    difficulty: "medium",
  },
  {
    id: "q150",
    moduleId: "m17",
    question: "Which statement is true about transactions?",
    options: [
      "A set of Data Manipulation Language (DML) statements executed in a sequence ending with a SAVEPOINT forms a single transaction.",
      "Each Data Definition Language (DDL) statement executed forms a single transaction.",
      "A set of DDL statements executed in a sequence ending with a COMMIT forms a single transaction.",
      "A combination of DDL and DML statements executed in a sequence ending with a COMMIT forms a single transaction."
    ],
    correctIndexes: [1],
    explanation: "Chaque DDL forme sa propre transaction (COMMIT implicite).",
    topic: "Transactions",
    difficulty: "medium",
  },
  {
    id: "q151",
    moduleId: "m10",
    question: "Which statements are correct regarding indexes? (Choose all that apply.)",
    options: [
      "A non-deferrable PRIMARY KEY or UNIQUE KEY constraint in a table automatically creates a unique index.",
      "Indexes should be created on columns that are frequently referenced as part of any expression.",
      "When a table is dropped, the corresponding indexes are automatically dropped.",
      "For each DML operation performed, the corresponding indexes are automatically updated."
    ],
    correctIndexes: [0, 2, 3],
    explanation: "PK/UK non différées créent un index unique. DROP TABLE supprime les index. Chaque DML maintient les index. Indexer une colonne « fréquemment dans une expression » n'est pas une bonne règle générale.",
    topic: "Index",
    difficulty: "medium",
  },
  {
    id: "q152",
    moduleId: "m5",
    question: "Which two statements are true regarding the GROUP BY clause in a SQL statement? (Choose two.)",
    options: [
      "You can use column alias in the GROUP BY clause.",
      "Using the WHERE clause after the GROUP BY clause excludes the rows after creating groups.",
      "The GROUP BY clause is mandatory if you are using an aggregate function in the SELECT clause.",
      "Using the WHERE clause before the GROUP BY clause excludes the rows before creating groups.",
      "If the SELECT clause has an aggregate function, then those individual columns without an aggregate function in the SELECT clause should be included in the GROUP BY cause."
    ],
    correctIndexes: [3, 4],
    explanation: "WHERE avant GROUP BY ; colonnes non agrégées du SELECT dans GROUP BY.",
    topic: "GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q153",
    moduleId: "m4",
    question: "Which three tasks can be performed using SQL functions built into Oracle Database?",
    options: [
      "displaying a date in a non default format",
      "finding the number of characters in an expression",
      "substituting a character string in a text expression with a specified string",
      "combining more than two columns or expressions into a single column in the output"
    ],
    correctIndexes: [0, 1, 2],
    explanation: "Conversion, caractères, dates, nombres, NULL — pas le démarrage d'instance.",
    topic: "Fonctions SQL",
    difficulty: "medium",
  },
  {
    id: "q154",
    moduleId: "m10",
    question: "Which three statements are true about the ALTER TABLE….DROP COLUMN…. command?",
    options: [
      "A column can be dropped only if it does not contain any data.",
      "A column can be dropped only if another column exists in the table.",
      "A dropped column can be rolled back.",
      "The column in a composite PRIMARY KEY with the CASCADE option can be dropped.",
      "A parent key column in the table cannot be dropped."
    ],
    correctIndexes: [1, 3, 4],
    explanation: "On ne peut pas supprimer la dernière colonne d'une table. DROP COLUMN est DDL (pas de ROLLBACK). Une colonne de PK composite peut être droppée avec CASCADE. Une colonne parent key ne se droppe pas sans gérer la FK.",
    topic: "ALTER DROP COLUMN",
    difficulty: "hard",
  },
  {
    id: "q155",
    moduleId: "m9",
    question: "Which task can be performed by using a single Data Manipulation Language (DML) statement?",
    options: [
      "adding a column constraint when inserting a row into a table",
      "adding a column with a default value when inserting a row into a table",
      "removing all data only from one single column on which a unique constraint is defined",
      "removing all data only from one single column on which a primary key constraint is defined."
    ],
    correctIndexes: [1],
    explanation: "UPDATE col=NULL sur colonne UNIQUE est du DML valide. Ajouter colonne/contrainte = DDL.",
    topic: "DML",
    difficulty: "hard",
  },
  {
    id: "q156",
    moduleId: "m5",
    question: "Which two statements are true regarding the COUNT function?",
    options: [
      "A SELECT statement using the COUNT function with a DISTINCT keyword cannot have a WHERE clause.",
      "COUNT (DISTINCT inv_amt) returns the number of rows excluding rows containing duplicates and NULL values in the INV_AMT column.",
      "COUNT (cust_id) returns the number of rows including rows with duplicate customer IDs and NULL value in the CUST_ID column.",
      "COUNT (*) returns the number of rows including duplicate rows and rows containing NULL value in any of the columns.",
      "The COUNT function can be used only for CHAR, VARCHAR2, and NUMBER data types."
    ],
    correctIndexes: [1, 3],
    explanation: "COUNT(DISTINCT col) ignore doublons et NULL. COUNT(*) compte toutes les lignes (doublons et NULL inclus). COUNT(col) ignore les NULL. WHERE est autorisé avec COUNT.",
    topic: "COUNT",
    difficulty: "medium",
  },
  {
    id: "q157",
    moduleId: "m3",
    question: "Which statement is true regarding the default behavior of the ORDER BY clause?",
    options: [
      "In a character sort, the values are case-sensitive.",
      "NULL values are not considered at all by the sort operation.",
      "Only those columns that are specified in the SELECT list can be used in the ORDER BY clause.",
      "Numeric values are displayed from the maximum to the minimum value if they have decimal positions."
    ],
    correctIndexes: [0],
    explanation: "Tri caractère sensible à la casse par défaut (selon NLS_SORT).",
    topic: "ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q158",
    moduleId: "m1",
    question: "Which normal form is a table in if it has no multi-valued attributes and no partial dependencies?",
    options: [
      "Second normal form",
      "First normal form",
      "Third normal form",
      "Fourth normal form"
    ],
    correctIndexes: [0],
    explanation: "Pas d'attribut multi-valué (1NF) + pas de dépendance partielle ⇒ deuxième forme normale (2NF).",
    topic: "Formes normales",
    difficulty: "medium",
  },
  {
    id: "q159",
    moduleId: "m2",
    question: "Evaluate the following two queries: SELECT cust_last_name, cust_city FROM customers WHERE cust_credit_limit IN (1000, 2000, 3000); SQL> SELECT cust_last_name, cust_city FROM customers WHERE cust_credit_limit = 1000 or cust_credit_limit = 2000 or cust_credit_limit = 3000 Which statement is true regarding the above two queries?",
    options: [
      "Performance would improve in query 2 only if there are null values in the CUST_CREDIT_LIMIT column.",
      "There would be no change in performance.",
      "Performance would degrade in query 2.",
      "Performance would improve in query 2."
    ],
    correctIndexes: [1],
    explanation: "IN et OR équivalents ; pas de différence de perf systématique.",
    topic: "IN vs OR",
    difficulty: "easy",
  },
  {
    id: "q160",
    moduleId: "m15",
    question: "You must write a query that prompts users for column names and conditions every time it is executed. (Choose the best answer.) The user must be prompted only once for the table name. Which statement achieves those objectives?",
    options: [
      "SELECT &col1, '&col2'FROM &tableWHERE &&condition = '&cond';",
      "SELECT &col1, &col2 FROM \"&table\"WHERE &condition =&cond;",
      "SELECT &col1, &col2 FROM &&tableWHERE &condition = &cond;",
      "SELECT &col1, &col2 FROM &&tableWHERE &condition = &&cond"
    ],
    correctIndexes: [2],
    explanation: "&&table invite une seule fois ; &col invite à chaque exécution.",
    topic: "Variables substitution",
    difficulty: "hard",
  },
  {
    id: "q161",
    moduleId: "m10",
    question: "Evaluate this ALTER TABLE statement: (Choose the best answer.) ALTER TABLE orders SET UNUSED (order_date); Which statement is true?",
    options: [
      "After executing the ALTER TABLE command, a new column called ORDER_DATE can be added to the ORDERS table.",
      "The ORDER_DATE column must be empty for the ALTER TABLE command to execute successfully.",
      "ROLLBACK can be used to restore the ORDER_DATE column.",
      "The DESCRIBE command would still display the ORDER_DATE column."
    ],
    correctIndexes: [0],
    explanation: "Après SET UNUSED, on peut ajouter une colonne du même nom.",
    topic: "ALTER TABLE",
    difficulty: "medium",
  },
  {
    id: "q162",
    moduleId: "m9",
    question: "Which task can be performed by using a single Data Manipulation Language (DML) statement?",
    options: [
      "Removing all data only from a single column on which a primary key constraint is defined.",
      "Removing all data from a single column on which a unique constraint is defined.",
      "Adding a column with a default value while inserting a row into a table.",
      "Adding a column constraint while inserting a row into a table."
    ],
    correctIndexes: [1],
    explanation: "Vider une colonne UNIQUE via UPDATE est un seul DML.",
    topic: "DML",
    difficulty: "hard",
  },
  {
    id: "q163",
    moduleId: "m1",
    question: "Which two statements are true regarding constraints?",
    options: [
      "A foreign key column cannot contain null values.",
      "A column with the UNIQUE constraint can contain null values.",
      "A constraint is enforced only for INSERT operation on the table.",
      "A constraint can be disabled even if the constraint column contains data.",
      "All constraints can be defined at the column level and at the table level."
    ],
    correctIndexes: [1, 3],
    explanation: "UNIQUE accepte NULL ; une contrainte peut être désactivée avec des données.",
    topic: "Contraintes",
    difficulty: "medium",
  },
  {
    id: "q164",
    moduleId: "m8",
    question: "View the Exhibit and examine the structure of the CUSTOMERS and CUST_HISTORY tables. The CUSTOMERS table contains the current location of all currently active customers. The CUST_HISTORY table stores historical details relating to any changes in the location of all current as well as previous customers who are no longer active with the company. You need to find those customers who have never changed their address. Which SET operator would you use to get the required output?",
    options: [
      "INTERSECT",
      "UNION ALL",
      "MINUS",
      "UNION"
    ],
    correctIndexes: [2],
    explanation: "MINUS isole les clients sans historique de changement d'adresse.",
    topic: "MINUS",
    difficulty: "medium",
  },
  {
    id: "q165",
    moduleId: "m10",
    question: "You must create a SALES table with these column specifications and data types: (Choose the best answer.) SALESID: Number STOREID: Number ITEMID: Number QTY: Number, should be set to 1 when no value is specified SLSDATE: Date, should be set to current date when no value is specified PAYMENT: Characters up to 30 characters, should be set to CASH when no value is specified Which statement would create the table?",
    options: [
      "CREATE TABLE Sales(SALESID NUMBER (4),STOREID NUMBER (4),ITEMID NUMBER (4),QTY NUMBER DEFAULT = 1,SLSDATE DATE DEFAULTSYSDATE,PAYMENT VARCHAR2(30) DEFAULT = \"CASH\");",
      "CREATE TABLE Sales(SALESID NUMBER (4),STOREID NUMBER (4),ITEMID NUMBER (4),QTY NUMBER DEFAULT = 1,SLSDATE DATE DEFAULT'SYSDATE',PAYMENT VARCHAR2(30) DEFAULT CASH);",
      "CREATE TABLE Sales(SALESID NUMBER (4),STOREID NUMBER (4),ITEMID NUMBER (4),qty NUMBER DEFAULT = 1,SLSDATE DATE DEFAULTSYSDATE,PAYMENT VARCHAR2(30) DEFAULT = \"CASH\");",
      "Create Table sales(salesid NUMBER (4),Storeid NUMBER (4),Itemid NUMBER (4),QTY NUMBER DEFAULT 1,Slsdate DATE DEFAULT SYSDATE,payment VARCHAR2(30) DEFAULT 'CASH');"
    ],
    correctIndexes: [3],
    explanation: "DEFAULT expr sans '=' ; littéraux caractère entre quotes simples.",
    topic: "DEFAULT",
    difficulty: "medium",
  },
  {
    id: "q166",
    moduleId: "m8",
    question: "Which statement is true regarding the UNION operator?",
    options: [
      "By default, the output is not sorted.",
      "Null values are not ignored during duplicate checking.",
      "Names of all columns must be identical across all select statements.",
      "The number of columns selected in all select statements need not be the same."
    ],
    correctIndexes: [1],
    explanation: "NULL participent à la déduplication UNION (NULL=NULL).",
    topic: "UNION",
    difficulty: "medium",
  },
  {
    id: "q167",
    moduleId: "m17",
    question: "Which statement is true about transactions?",
    options: [
      "A set of Data Manipulation Language (DML) statements executed in a sequence ending with a SAVEPOINT forms a single transaction.",
      "Each Data Definition Language (DDL) statement executed forms a single transaction.",
      "A set of DDL statements executed in a sequence ending with a COMMIT forms a single transaction.",
      "A combination of DDL and DML statements executed in a sequence ending with a COMMIT forms a single transaction."
    ],
    correctIndexes: [1],
    explanation: "Chaque DDL = une transaction.",
    topic: "Transactions",
    difficulty: "medium",
  },
  {
    id: "q168",
    moduleId: "m5",
    question: "Which two statements are true regarding the SQL GROUP BY clause?",
    options: [
      "You can use a column alias in the GROUP BY clause.",
      "Using the WHERE clause after the GROUP BY clause excludes rows after creating groups.",
      "The GROUP BY clause is mandatory if you are using an aggregating function in the SELECT clause.",
      "Using the WHERE clause before the GROUP BY clause excludes rows before creating groups.",
      "If the SELECT clause has an aggregating function, then columns without an aggregating function in the SELECT clause should be included in the GROUP BYclause."
    ],
    correctIndexes: [3, 4],
    explanation: "WHERE avant GROUP BY ; colonnes non agrégées dans GROUP BY.",
    topic: "GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q169",
    moduleId: "m3",
    question: "Which statement is true regarding the default behavior of the ORDER BY clause?",
    options: [
      "In a character sort, the values are case-sensitive.",
      "NULL values are not considered at all by the sort operation.",
      "Only those columns that are specified in the SELECT list can be used in the ORDER BY clause.",
      "Numeric values are displayed from the maximum to the minimum value if they have decimal positions."
    ],
    correctIndexes: [0],
    explanation: "Tri caractère sensible à la casse.",
    topic: "ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q170",
    moduleId: "m5",
    question: "Which three statements are true regarding group functions? (Choose three.)",
    options: [
      "They can be used on columns or expressions.",
      "They can be passed as an argument to another group function.",
      "They can be used only with a SQL statement that has the GROUP BY clause.",
      "They can be used on only one column in the SELECT clause of a SQL statement.",
      "They can be used along with the single-row function in the SELECT clause of a SQL statement."
    ],
    correctIndexes: [0, 1, 4],
    explanation: "Colonnes/expressions ; imbricables ; avec mono-ligne.",
    topic: "Fonctions de groupe",
    difficulty: "medium",
  },
  {
    id: "q171",
    moduleId: "m4",
    question: "You must create a table for a banking application. (Choose the best answer.) One of the columns in the table has these requirements: 1: A column to store the duration of a short team loan 2: The data should be stored in a format supporting DATE arithmetic with DATE datatypes without using conversion functions. 3: The maximum loan period is 30 days. 4: Interest must be calculated based on the number of days for which the loan remains unpaid. Which data type would you use?",
    options: [
      "Date",
      "Number",
      "Timestamp",
      "Interval day to second",
      "Interval year to month"
    ],
    correctIndexes: [3],
    explanation: "INTERVAL DAY TO SECOND pour une durée ≤ 30 jours avec arithmétique DATE.",
    topic: "INTERVAL",
    difficulty: "hard",
  },
  {
    id: "q172",
    moduleId: "m6",
    question: "Which two are the minimal requirements for a self-join? (Choose two.)",
    options: [
      "Only equijoin conditions may be used in the query.",
      "Outer joins must not be used in the query.",
      "There must be a condition on which the self-join is performed.",
      "No other condition except the self-join may be specified.",
      "The table used for the self-join must have two different alias names in the query."
    ],
    correctIndexes: [2, 4],
    explanation: "Condition de jointure + deux alias distincts.",
    topic: "Self-join",
    difficulty: "medium",
  },
  {
    id: "q173",
    moduleId: "m7",
    question: "A non-correlated subquery can be defined as . (Choose the best answer.)",
    options: [
      "A set of one or more sequential queries in which generally the result of the inner query is used as the search value in the outer query.",
      "A set of sequential queries, all of which must return values from the same table.",
      "A set of sequential queries, all of which must always return a single value.",
      "A SELECT statement that can be embedded in a clause of another SELECT statement only."
    ],
    correctIndexes: [0],
    explanation: "Résultat interne utilisé comme critère de l'externe.",
    topic: "Sous-requête non corrélée",
    difficulty: "easy",
  },
  {
    id: "q174",
    moduleId: "m10",
    question: "You issue the following command to drop the PRODUCTS table: (Choose all that apply.) SQL > DROP TABLE products; Which three statements are true about the implication of this command?",
    options: [
      "All data along with the table structure is deleted.",
      "A pending transaction in the session is committed.",
      "All indexes on the table remain but they are invalidated.",
      "All views and synonyms on the table remain but they are invalidated.",
      "All data in the table is deleted but the table structure remains."
    ],
    correctIndexes: [0, 1, 3],
    explanation: "Structure+données supprimées ; COMMIT implicite ; vues invalidées.",
    topic: "DROP TABLE",
    difficulty: "hard",
  },
  {
    id: "q175",
    moduleId: "m4",
    question: "Evaluate the following query: SQL> SELECT TRUNC (ROUND (156.00, -1),-1) FROM DUAL; What would be the outcome?",
    options: [
      "150",
      "200",
      "160",
      "16",
      "100"
    ],
    correctIndexes: [2],
    explanation: "Résultat 160.",
    topic: "ROUND / TRUNC",
    difficulty: "hard",
  },
  {
    id: "q176",
    moduleId: "m2",
    question: "Examine the structure of the PROMOTIONS table: (Choose the best answer.) Management requires a report of unique promotion costs in each promotion category. Which query would satisfy this requirement?",
    options: [
      "SELECT DISTINCT promo_category, promo_cost FROM promotions ORDER BY 1",
      "SELECT promo_category, DISTINCT promo_cost FROM promotions",
      "SELECT DISTINCT promo_cost, promo_category FROM promotions",
      "SELECT DISTINCT promo_cost, DISTINCT promo_category FROM promotions;"
    ],
    correctIndexes: [0],
    explanation: "DISTINCT s'applique à toute la liste SELECT ; une seule fois.",
    topic: "DISTINCT",
    difficulty: "medium",
  },
  {
    id: "q177",
    moduleId: "m5",
    question: "Which two statements are true regarding the GROUP BY clause in a SQL statement? (Choose two.)",
    options: [
      "You can use column alias in the GROUP BY clause.",
      "Using the WHERE clause after the GROUP BY clause excludes the rows after creating groups.",
      "The GROUP BY clause is mandatory if you are using an aggregate function in the SELECT clause.",
      "Using the WHERE clause before the GROUP BY clause excludes the rows before creating groups.",
      "If the SELECT clause has an aggregate function, then those individual columns without an aggregate function in the SELECT clause should be included in theGROUP BY cause."
    ],
    correctIndexes: [3, 4],
    explanation: "WHERE avant ; colonnes non agrégées dans GROUP BY.",
    topic: "GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q178",
    moduleId: "m7",
    question: "Which two statements are true regarding subqueries? (Choose two.)",
    options: [
      "A subquery can appear on either side of a comparison operator.",
      "Only two subqueries can be placed at one level.",
      "A subquery can retrieve zero or more rows.",
      "A subquery can be used only in SQL query statements.",
      "There is no limit on the number of subquery levels in the WHERE clause of a SELECT statement."
    ],
    correctIndexes: [0, 2],
    explanation: "Des deux côtés d'un comparateur ; 0..N lignes.",
    topic: "Sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "q179",
    moduleId: "m3",
    question: "Which statement is true regarding the default behaviour of the ORDER by clause?",
    options: [
      "Numeric values are displayed in descending order if they have decimal positions.",
      "Only columns that are specified in the SELECT list can be used in the ORDER by clause.",
      "In a character sort, the values are case-sensitive.",
      "NULLs are not including in the sort operation"
    ],
    correctIndexes: [2],
    explanation: "Tri caractère sensible à la casse.",
    topic: "ORDER BY",
    difficulty: "medium",
  },
  {
    id: "q180",
    moduleId: "m17",
    question: "Which statement is true about Data Manipulation Language (DML)?",
    options: [
      "DML automatically disables foreign ley constraints when modifying primary key values in the parent table.",
      "Each DML statement forms a transaction by default.",
      "A transaction can consist of one or more DML statements.",
      "DML disables foreign key constraints when deleting primary key values in the parent table, only when the ON DELETE CASCADE option is set for the foreignkey constraint."
    ],
    correctIndexes: [2],
    explanation: "Une transaction = un ou plusieurs DML.",
    topic: "DML / transactions",
    difficulty: "medium",
  },
  {
    id: "q181",
    moduleId: "m4",
    question: "Which two statements are true regarding working with dates? (Choose two.)",
    options: [
      "The RR date format automatically calculates the century from the SYSDATE function but allows the session user to enter the century.",
      "The RR date format automatically calculates the century from the SYSDATE function and does not allow a session user to enter the century.",
      "The default internal storage of dates is in character format.",
      "The default internal storage of dates is in numeric format."
    ],
    correctIndexes: [0, 3],
    explanation: "RR calcule le siècle ; stockage DATE numérique interne.",
    topic: "Dates",
    difficulty: "medium",
  },
  {
    id: "q182",
    moduleId: "m10",
    question: "You issued this command: CHOOSE THREE SQL > DROP TABLE employees; Which three statements are true?",
    options: [
      "Sequences used in the EMPLOYEES table become invalid.",
      "If there is an uncommitted transaction in the session, it is committed.",
      "All indexes and constraints defined on the table being dropped are also dropped.",
      "The space used by the EMPLOYEES table is always reclaimed immediately.",
      "The EMPLOYEES table can be recovered using the ROLLBACK command.",
      "The EMPLOYEES table may be moved to the recycle bin."
    ],
    correctIndexes: [1, 2, 5],
    explanation: "COMMIT implicite ; index/contraintes droppés ; table peut aller au recycle bin.",
    topic: "DROP TABLE",
    difficulty: "hard",
  },
  {
    id: "q183",
    moduleId: "m2",
    question: "Evaluate the following two queries: SQL> SELECT cust_last_name, cust_city FROM customers WHERE cust_credit_limit IN (1000, 2000, 3000); SQL> SELECT cust_last_name, cust_city FROM customers WHERE cust_credit_limit = 1000 or cust_credit_limit = 2000 or cust_credit_limit = 3000 Which statement is true regarding the above two queries?",
    options: [
      "Performance would improve in query 2 only if there are null values in the CUST_CREDIT_LIMIT column.",
      "There would be no change in performance.",
      "Performance would degrade in query 2.",
      "Performance would improve in query 2."
    ],
    correctIndexes: [1],
    explanation: "Pas de différence de performance attendue.",
    topic: "IN vs OR",
    difficulty: "easy",
  },
  {
    id: "q184",
    moduleId: "m7",
    question: "Which two statements are true regarding the execution of the correlated subqueries? (Choose two.)",
    options: [
      "The nested query executes after the outer query returns the row.",
      "The nested query executes first and then the outer query executes.",
      "The outer query executes only once for the result returned by the inner query.",
      "Each row returned by the outer query is evaluated for the results returned by the inner query. ...... Pow ered by TC PDF (ww w.tcpdf.org)"
    ],
    correctIndexes: [0, 3],
    explanation: "Interne après ligne externe ; chaque ligne externe évaluée.",
    topic: "Sous-requête corrélée",
    difficulty: "medium",
  },
  {
    id: "q185",
    moduleId: "m17",
    question: "Quels trois événements terminent une transaction Oracle ?",
    options: [
      "COMMIT",
      "ROLLBACK",
      "SAVEPOINT",
      "Une instruction DDL",
      "SELECT"
    ],
    correctIndexes: [0, 1, 3],
    explanation: "COMMIT et ROLLBACK terminent explicitement. Tout DDL provoque un COMMIT implicite. SAVEPOINT ne termine pas ; SELECT non plus.",
    topic: "Fin de transaction",
    difficulty: "medium",
  },
  {
    id: "q186",
    moduleId: "m17",
    question: "SAVEPOINT mark1 ; puis ROLLBACK TO mark1 ; Que se passe-t-il ?",
    options: [
      "Toute la transaction est annulée et terminée",
      "Seules les modifications après mark1 sont annulées ; la transaction continue",
      "Erreur : ROLLBACK TO n'existe pas",
      "Équivalent à COMMIT"
    ],
    correctIndexes: [1],
    explanation: "ROLLBACK TO annule partiellement jusqu'au savepoint sans terminer la transaction. Les verrous après le savepoint sont libérés.",
    topic: "SAVEPOINT",
    difficulty: "medium",
  },
  {
    id: "q187",
    moduleId: "m17",
    question: "Après un ALTER TABLE réussi au milieu d'une série de DML non commités, que deviennent les DML précédents ?",
    options: [
      "Ils restent non validés",
      "Ils sont validés (COMMIT implicite du DDL)",
      "Ils sont annulés",
      "Ils passent en SAVEPOINT automatique"
    ],
    correctIndexes: [1],
    explanation: "Le DDL force un COMMIT implicite avant/après : les DML antérieurs sont définitivement validés.",
    topic: "DDL et transactions",
    difficulty: "hard",
  },
  {
    id: "q188",
    moduleId: "m17",
    question: "Quelle affirmation est vraie sur la cohérence en lecture Oracle (MVCC) ?",
    options: [
      "Un SELECT voit toujours les modifications non commitées des autres sessions",
      "Un SELECT voit une image cohérente basée sur SCN (pas les DML non commités d'autrui)",
      "Oracle utilise uniquement des verrous de lecture partagés bloquants",
      "READ COMMITTED est impossible en Oracle"
    ],
    correctIndexes: [1],
    explanation: "Oracle fournit une lecture cohérente via undo/SCN : vous ne lisez pas les dirty data des autres transactions.",
    topic: "Cohérence",
    difficulty: "hard",
  },
  {
    id: "q189",
    moduleId: "m17",
    question: "DELETE FROM emp ; ROLLBACK ; Résultat ?",
    options: [
      "Table vide définitivement",
      "Lignes restaurées (si pas de COMMIT entre-temps)",
      "Erreur : DELETE sans WHERE interdit ROLLBACK",
      "Équivalent à TRUNCATE"
    ],
    correctIndexes: [1],
    explanation: "DELETE est DML transactionnel. ROLLBACK restaure. TRUNCATE serait DDL non annulable.",
    topic: "ROLLBACK",
    difficulty: "easy",
  },
  {
    id: "q190",
    moduleId: "m18",
    question: "Parmi ces pièges 1Z0-071, lesquels sont corrects ? (3)",
    options: [
      "commission = NULL ne retourne aucune ligne",
      "COUNT(col) ignore les NULL",
      "ROWNUM est appliqué après ORDER BY",
      "NOT IN avec NULL peut tout exclure",
      "TRUNCATE est annulable par ROLLBACK"
    ],
    correctIndexes: [0, 1, 3],
    explanation: "ROWNUM est avant ORDER BY. TRUNCATE (DDL) n'est pas annulable. Les trois autres sont des pièges classiques vrais.",
    topic: "Révision pièges",
    difficulty: "hard",
  },
  {
    id: "q191",
    moduleId: "m18",
    question: "Pour un Top-N correct des 5 plus hauts salaires, quelle approche est valide ?",
    options: [
      "WHERE ROWNUM <= 5 ORDER BY salary DESC",
      "Sous-requête : SELECT * FROM (SELECT ... ORDER BY salary DESC) WHERE ROWNUM <= 5",
      "FETCH FIRST 5 ROWS ONLY après ORDER BY salary DESC",
      "GROUP BY salary HAVING ROWNUM <= 5"
    ],
    correctIndexes: [1, 2],
    explanation: "Sous-requête triée + ROWNUM, ou FETCH FIRST après ORDER BY. ROWNUM avant ORDER BY est faux.",
    topic: "Top-N",
    difficulty: "hard",
  },
  {
    id: "q192",
    moduleId: "m18",
    question: "Quelle combinaison décrit le mieux le format actuel 1Z0-071 ?",
    options: [
      "50 Q / 70 % / 90 min",
      "63 Q / 63 % / 120 min",
      "70 Q / 60 % / 100 min",
      "63 Q / 70 % / 100 min"
    ],
    correctIndexes: [1],
    explanation: "Référence courante : 63 questions, score de passage 63 %, durée 120 minutes (vérifier la fiche Oracle du jour).",
    topic: "Format examen",
    difficulty: "easy",
  },
  {
    id: "q193",
    moduleId: "m18",
    question: "Quelles deux affirmations aident à réussir l'examen ?",
    options: [
      "Il y a une pénalité de −1 par erreur",
      "Répondre à toutes les questions (pas de malus)",
      "Lire attentivement « which two » vs « which statement »",
      "Toujours choisir NATURAL JOIN"
    ],
    correctIndexes: [1, 2],
    explanation: "Pas de pénalité. Le nombre de réponses attendues change tout. NATURAL JOIN est souvent un piège.",
    topic: "Stratégie",
    difficulty: "easy",
  },
  {
    id: "q194",
    moduleId: "m18",
    question: "UNION vs UNION ALL — quelle affirmation pour l'examen ?",
    options: [
      "UNION ALL élimine les doublons",
      "UNION élimine les doublons et trie ; UNION ALL conserve tout",
      "Les deux exigent le même nom de colonnes",
      "ORDER BY est obligatoire"
    ],
    correctIndexes: [1],
    explanation: "Piège fréquent : croire qu'UNION ALL déduplique, ou que les alias doivent matcher.",
    topic: "Set operators",
    difficulty: "easy",
  },
  {
    id: "q195",
    moduleId: "m11",
    question: "NTILE(4) OVER (ORDER BY salary) fait quoi ?",
    options: [
      "Calcule le quartile moyen",
      "Répartit les lignes en 4 groupes (buckets) aussi égaux que possible",
      "Retourne toujours 4 lignes",
      "Équivalent à RANK"
    ],
    correctIndexes: [1],
    explanation: "NTILE(n) partitionne le jeu ordonné en n seaux.",
    topic: "NTILE",
    difficulty: "medium",
  },
  {
    id: "q196",
    moduleId: "m11",
    question: "FIRST_VALUE(salary) OVER (PARTITION BY dept_id ORDER BY hire_date) retourne ?",
    options: [
      "Le salaire max du département",
      "Le salaire de la première ligne de la fenêtre (plus ancien hire_date ici)",
      "La moyenne des salaires",
      "Une erreur sans GROUP BY"
    ],
    correctIndexes: [1],
    explanation: "FIRST_VALUE lit la première ligne de la window définie par PARTITION/ORDER.",
    topic: "FIRST_VALUE",
    difficulty: "medium",
  },
  {
    id: "q197",
    moduleId: "m11",
    question: "Peut-on mettre une fonction analytique dans WHERE ?",
    options: [
      "Oui, toujours",
      "Non : il faut une sous-requête/CTE puis filtrer",
      "Oui, seulement RANK",
      "Oui, avec HAVING"
    ],
    correctIndexes: [1],
    explanation: "Les analytiques s'évaluent après WHERE. Pour filtrer sur RANK/ROW_NUMBER, encapsuler.",
    topic: "Analytiques / WHERE",
    difficulty: "hard",
  },
  {
    id: "q198",
    moduleId: "m12",
    question: "REGEXP_REPLACE('a1b2c3', '[0-9]', '') retourne ?",
    options: [
      "a1b2c3",
      "abc",
      "123",
      "Une erreur"
    ],
    correctIndexes: [1],
    explanation: "Remplace chaque chiffre par vide → 'abc'.",
    topic: "REGEXP_REPLACE",
    difficulty: "easy",
  },
  {
    id: "q199",
    moduleId: "m12",
    question: "REGEXP_INSTR('Oracle SQL', 'SQL') retourne ?",
    options: [
      "0",
      "8",
      "7",
      "1"
    ],
    correctIndexes: [1],
    explanation: "Position 1-based du début de 'SQL' dans 'Oracle SQL' = 8.",
    topic: "REGEXP_INSTR",
    difficulty: "medium",
  },
  {
    id: "q200",
    moduleId: "m12",
    question: "Quel motif valide un email simple domain.com ?",
    options: [
      "LIKE '%@%.%'",
      "REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')",
      "email = EMAIL",
      "INSTR(email,'@') = 0"
    ],
    correctIndexes: [1],
    explanation: "REGEXP_LIKE avec ancrages ^$ est l'approche robuste ; LIKE est trop permissif.",
    topic: "REGEXP_LIKE",
    difficulty: "medium",
  },
  {
    id: "q201",
    moduleId: "m13",
    question: "Quelle vue listerait toutes les tables accessibles (pas seulement les vôtres) ?",
    options: [
      "USER_TABLES",
      "ALL_TABLES",
      "DBA_TABLES uniquement",
      "V$TABLES"
    ],
    correctIndexes: [1],
    explanation: "ALL_TABLES = objets accessibles. USER_ = possédés. DBA_ = tout (si privilège).",
    topic: "ALL_TABLES",
    difficulty: "easy",
  },
  {
    id: "q202",
    moduleId: "m13",
    question: "Pour lister les contraintes FK d'une table EMP, on interroge typiquement ?",
    options: [
      "USER_TABLES",
      "USER_CONSTRAINTS / USER_CONS_COLUMNS",
      "V$SESSION",
      "ALL_INDEXES uniquement"
    ],
    correctIndexes: [1],
    explanation: "USER_CONSTRAINTS (CONSTRAINT_TYPE='R') et USER_CONS_COLUMNS décrivent les FK.",
    topic: "USER_CONSTRAINTS",
    difficulty: "medium",
  },
  {
    id: "q203",
    moduleId: "m13",
    question: "COMMENT ON TABLE employees IS 'Employés HR'; à quoi sert ?",
    options: [
      "Crée un trigger",
      "Ajoute un commentaire de dictionnaire (USER_TAB_COMMENTS)",
      "Modifie une colonne",
      "Accorde un privilège"
    ],
    correctIndexes: [1],
    explanation: "Les commentaires d'objets/colonnes sont stockés dans le dictionnaire.",
    topic: "COMMENT",
    difficulty: "easy",
  },
  {
    id: "q204",
    moduleId: "m15",
    question: "Quelle commande SQL*Plus enregistre la sortie dans un fichier ?",
    options: [
      "SPOOL rapport.txt … SPOOL OFF",
      "SAVE rapport.txt",
      "DUMP rapport.txt",
      "EXPORT rapport.txt"
    ],
    correctIndexes: [0],
    explanation: "SPOOL redirige l'affichage client vers un fichier OS.",
    topic: "SPOOL",
    difficulty: "easy",
  },
  {
    id: "q205",
    moduleId: "m15",
    question: "DESC employees ; est-ce du SQL serveur ?",
    options: [
      "Oui, Oracle parse DESC comme SELECT",
      "Non : commande client SQL*Plus/SQLcl",
      "Oui, synonyme de SHOW TABLE",
      "Uniquement en PL/SQL"
    ],
    correctIndexes: [1],
    explanation: "DESCRIBE est une commande d'interface, pas une instruction SQL du moteur.",
    topic: "DESCRIBE",
    difficulty: "easy",
  },
  {
    id: "q206",
    moduleId: "m15",
    question: "SET DEFINE OFF sert à ?",
    options: [
      "Désactiver le parseur SQL",
      "Désactiver l'interprétation des & variables de substitution",
      "Couper AUTOCOMMIT",
      "Masquer les en-têtes"
    ],
    correctIndexes: [1],
    explanation: "Utile quand le script contient des & littéraux (ex. chaînes) à ne pas substituer.",
    topic: "SET DEFINE",
    difficulty: "medium",
  },
  {
    id: "q207",
    moduleId: "m16",
    question: "GRANT SELECT ON hr.employees TO alice WITH GRANT OPTION ; permet à alice de ?",
    options: [
      "Uniquement lire employees",
      "Lire et retransmettre SELECT sur employees à d'autres",
      "Devenir DBA",
      "Modifier la structure de employees"
    ],
    correctIndexes: [1],
    explanation: "WITH GRANT OPTION autorise le bénéficiaire à GRANT le même privilège objet.",
    topic: "WITH GRANT OPTION",
    difficulty: "medium",
  },
  {
    id: "q208",
    moduleId: "m16",
    question: "Quelle affirmation sur les rôles est vraie ?",
    options: [
      "Un rôle ne peut pas contenir de privilèges système",
      "Les rôles regroupent privilèges pour simplifier GRANT/REVOKE",
      "REVOKE d'un rôle supprime l'utilisateur",
      "PUBLIC est un utilisateur réel"
    ],
    correctIndexes: [1],
    explanation: "Les rôles factorisent les droits. PUBLIC est un groupe conventionnel, pas un user.",
    topic: "Rôles",
    difficulty: "easy",
  },
  {
    id: "q209",
    moduleId: "m16",
    question: "REVOKE SELECT ON emp FROM bob ; après GRANT via un rôle ?",
    options: [
      "Retire toujours l'accès immédiatement",
      "Peut ne pas suffire si l'accès vient encore d'un rôle actif",
      "Supprime le rôle",
      "Équivaut à DROP USER"
    ],
    correctIndexes: [1],
    explanation: "Il faut aussi retirer/désactiver le rôle qui porte le privilège.",
    topic: "REVOKE",
    difficulty: "hard",
  },
  {
    id: "q210",
    moduleId: "m10",
    question: "Quelles deux affirmations sont vraies sur les séquences (instance unique) ?",
    options: [
      "NEXTVAL/CURRVAL utilisables dans la clause VALUES d'un INSERT",
      "Une séquence est forcément liée à une seule table",
      "Les trous de numéros sont possibles (rollback, cache)",
      "CURRVAL fonctionne sans aucun NEXTVAL préalable dans la session"
    ],
    correctIndexes: [0, 2],
    explanation: "Séquence indépendante des tables ; trous possibles ; CURRVAL exige un NEXTVAL préalable dans la session.",
    topic: "Séquences",
    difficulty: "medium",
  },
  {
    id: "q211",
    moduleId: "m4",
    question: "Quelles trois affirmations sont vraies sur les fonctions mono-ligne ?",
    options: [
      "Elles agissent sur chaque ligne et retournent une valeur",
      "Elles peuvent apparaître dans SELECT, WHERE, ORDER BY",
      "Elles remplacent GROUP BY",
      "Elles manipulent caractères, nombres, dates, conversions, NULL",
      "Elles exigent forcément une clause HAVING"
    ],
    correctIndexes: [0, 1, 3],
    explanation: "Single-row ≠ group functions. Pas de remplacement de GROUP BY/HAVING.",
    topic: "Fonctions mono-ligne",
    difficulty: "medium",
  },
  {
    id: "q212",
    moduleId: "m7",
    question: "Quelles trois affirmations sont vraies concernant la clause WITH (CTE) ?",
    options: [
      "Elle nomme des sous-requêtes réutilisables dans la requête",
      "Elle peut améliorer la lisibilité des requêtes complexes",
      "Elle remplace obligatoirement tous les JOIN",
      "Une CTE peut référencer une CTE précédente de la même clause WITH",
      "Elle est interdite avec SELECT"
    ],
    correctIndexes: [0, 1, 3],
    explanation: "WITH factorise et clarifie ; chaînage de CTE possible. Ce n'est pas un substitut aux jointures.",
    topic: "WITH / CTE",
    difficulty: "medium",
  },
  {
    id: "q213",
    moduleId: "m10",
    question: "Quelles affirmations sont correctes sur les index ?",
    options: [
      "Un index peut accélérer les recherches WHERE/JOIN",
      "Indexer toutes les colonnes est toujours optimal",
      "Les index ralentissent souvent INSERT/UPDATE/DELETE",
      "Un index UNIQUE renforce l'unicité"
    ],
    correctIndexes: [0, 2, 3],
    explanation: "Index = trade-off lecture/écriture. Pas d'indexage systématique de tout.",
    topic: "Index",
    difficulty: "medium",
  },
  {
    id: "q214",
    moduleId: "m1",
    question: "Une table sans attribut multi-valué ni dépendance partielle est au moins en ?",
    options: [
      "0NF",
      "2NF",
      "4NF uniquement",
      "Forme dénormalisée"
    ],
    correctIndexes: [1],
    explanation: "1NF = atomique ; 2NF = 1NF + pas de dépendance partielle (clés composites).",
    topic: "Normalisation",
    difficulty: "medium",
  },
  {
    id: "q215",
    moduleId: "m1",
    question: "Dans un environnement de formation Oracle typique, quel outil sert surtout d'IDE graphique pour écrire et exécuter du SQL ?",
    options: [
      "SQL*Plus uniquement",
      "Oracle SQL Developer",
      "EXPLAIN PLAN seul",
      "RMAN"
    ],
    correctIndexes: [1],
    explanation: "SQL Developer = IDE graphique. SQL*Plus = ligne de commande. Les deux parlent le même SQL ; RMAN est pour la sauvegarde/restauration.",
    topic: "Environnement",
    difficulty: "easy",
  },
  {
    id: "q216",
    moduleId: "m4",
    question: "Quelle forme de CASE permet des conditions comme salary < 5000 ?",
    options: [
      "CASE simple uniquement (WHEN valeur)",
      "CASE recherché (searched CASE)",
      "DECODE uniquement",
      "NVL2"
    ],
    correctIndexes: [1],
    explanation: "Le CASE recherché utilise WHEN condition THEN … et accepte <, >, BETWEEN, LIKE. Le CASE simple ne fait que l'égalité sur une expression.",
    topic: "CASE",
    difficulty: "easy",
  },
  {
    id: "q217",
    moduleId: "m4",
    question: "Quelle affirmation est vraie concernant CASE et DECODE ?",
    options: [
      "DECODE est standard SQL et gère les conditions complexes",
      "CASE est standard SQL ; DECODE est spécifique Oracle et limité à l'égalité",
      "CASE et DECODE sont strictement équivalents",
      "DECODE remplace toujours NVL"
    ],
    correctIndexes: [1],
    explanation: "CASE = standard, conditions libres. DECODE = Oracle, égalité. Préférez CASE en production.",
    topic: "CASE",
    difficulty: "medium",
  },
  {
    id: "q218",
    moduleId: "m4",
    question: "Quelle fonction retourne la date/heure selon le fuseau de la session client ?",
    options: ["SYSDATE", "CURRENT_DATE", "DBTIMEZONE", "TRUNC(SYSDATE)"],
    correctIndexes: [1],
    explanation: "CURRENT_DATE / CURRENT_TIMESTAMP = session. SYSDATE / SYSTIMESTAMP = serveur.",
    topic: "Dates",
    difficulty: "easy",
  },
  {
    id: "q219",
    moduleId: "m4",
    question: "Que retourne LAST_DAY(DATE '2026-02-10') ?",
    options: [
      "10-FEB-26",
      "01-MAR-26",
      "28-FEB-26 (ou 29 si année bissextile)",
      "Le prochain lundi"
    ],
    correctIndexes: [2],
    explanation: "LAST_DAY retourne le dernier jour du mois de la date donnée. NEXT_DAY sert pour un jour de semaine nommé.",
    topic: "Dates",
    difficulty: "medium",
  },
  {
    id: "q220",
    moduleId: "m5",
    question: "Quelle est la différence principale entre DISTINCT et GROUP BY ?",
    options: [
      "Ils sont toujours interchangeables",
      "DISTINCT dédoublonne ; GROUP BY regroupe pour permettre les agrégats",
      "GROUP BY ne peut pas être utilisé avec AVG",
      "DISTINCT exige HAVING"
    ],
    correctIndexes: [1],
    explanation: "DISTINCT élimine les doublons. GROUP BY crée des groupes et autorise SUM/AVG/COUNT par groupe (+ HAVING).",
    topic: "GROUP BY",
    difficulty: "easy",
  },
  {
    id: "q221",
    moduleId: "m6",
    question: "Dans WHERE e.department_id = d.department_id(+), que signifie le (+) ?",
    options: [
      "RIGHT OUTER JOIN (garde departments)",
      "LEFT OUTER JOIN (garde employees) : departments peut manquer",
      "FULL OUTER JOIN",
      "INNER JOIN obligatoire"
    ],
    correctIndexes: [1],
    explanation: "Le (+) marque le côté optionnel (NULL possibles). Ici sur departments → équivalent LEFT JOIN depuis employees.",
    topic: "JOIN",
    difficulty: "medium",
  },
  {
    id: "q222",
    moduleId: "m6",
    question: "Pourquoi e.col(+) = d.col(+) est incorrect pour un FULL OUTER JOIN ?",
    options: [
      "Parce que (+) accélère trop la jointure",
      "Parce que Oracle interdit (+) des deux côtés ; FULL JOIN = syntaxe ANSI uniquement",
      "Parce que FULL JOIN n'existe pas en SQL",
      "Parce qu'il faut utiliser NATURAL JOIN"
    ],
    correctIndexes: [1],
    explanation: "L'ancienne syntaxe (+) ne peut pas être des deux côtés. Pour un FULL OUTER JOIN, utiliser la syntaxe ANSI.",
    topic: "JOIN",
    difficulty: "medium",
  },
  {
    id: "q223",
    moduleId: "m10",
    question: "À quoi sert CREATE INDEX idx ON emp(UPPER(last_name)) ?",
    options: [
      "À forcer UPPER dans tous les INSERT",
      "À accélérer les recherches du type WHERE UPPER(last_name) = '…'",
      "À remplacer une PRIMARY KEY",
      "À supprimer les doublons automatiquement"
    ],
    correctIndexes: [1],
    explanation: "Index fonctionnel : l'expression de l'index doit correspondre à celle du prédicat pour être utilisable.",
    topic: "Index",
    difficulty: "medium",
  },
  {
    id: "q224",
    moduleId: "m10",
    question: "Avec ON DELETE CASCADE sur une FK, que se passe-t-il si on DELETE le parent ?",
    options: [
      "Erreur ORA toujours",
      "Les lignes enfants sont aussi supprimées",
      "Les FK enfants passent à NULL uniquement",
      "Seul le parent est marqué DELETED"
    ],
    correctIndexes: [1],
    explanation: "CASCADE propage la suppression aux enfants. SET NULL mettrait la FK à NULL. Sans option, le DELETE parent est souvent bloqué s'il reste des enfants.",
    topic: "Contraintes",
    difficulty: "easy",
  },
  {
    id: "q225",
    moduleId: "m10",
    question: "Quelles opérations ALTER TABLE sur colonnes sont correctes ?",
    options: [
      "ADD, MODIFY, DROP COLUMN, RENAME COLUMN",
      "Seulement ADD",
      "RENAME COLUMN est interdit en Oracle",
      "DROP COLUMN nécessite toujours CASCADE CONSTRAINTS"
    ],
    correctIndexes: [0],
    explanation: "Oracle permet ADD, MODIFY, DROP COLUMN et RENAME COLUMN. CASCADE CONSTRAINTS n'est requis que si des contraintes dépendantes bloquent le DROP.",
    topic: "DDL",
    difficulty: "easy",
  },
  {
    id: "q226",
    moduleId: "m18",
    question: "Pourquoi SELECT salary*12 AS annuel FROM emp WHERE annuel > 60000 échoue-t-il ?",
    options: [
      "Parce que * est interdit",
      "Parce que l'alias SELECT n'est pas encore défini au moment du WHERE (ordre d'exécution)",
      "Parce que 60000 est trop grand",
      "Parce qu'il faut GROUP BY annuel"
    ],
    correctIndexes: [1],
    explanation: "Ordre logique : WHERE avant SELECT. L'alias annuel n'existe qu'après SELECT ; utilisable dans ORDER BY (ou via sous-requête).",
    topic: "Ordre d'exécution",
    difficulty: "medium",
  },
  {
    id: "q227",
    moduleId: "m18",
    question: "Quelle requête donne correctement les 5 plus hauts salaires ?",
    options: [
      "SELECT * FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC",
      "SELECT * FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY",
      "SELECT * FROM employees WHERE ROWNUM = 5",
      "SELECT TOP 5 * FROM employees ORDER BY salary DESC"
    ],
    correctIndexes: [1],
    explanation: "ROWNUM filtre avant ORDER BY → faux top-N. FETCH FIRST (12c+) ou sous-requête triée puis ROWNUM est correct. TOP n'existe pas en Oracle.",
    topic: "ROWNUM",
    difficulty: "medium",
  },
  {
    id: "q228",
    moduleId: "m5",
    question: "SELECT department_id, last_name, AVG(salary) FROM employees GROUP BY department_id provoque ?",
    options: [
      "Un résultat correct",
      "ORA-00979 (last_name non agrégé / hors GROUP BY)",
      "ORA-01427",
      "Un FULL OUTER JOIN implicite"
    ],
    correctIndexes: [1],
    explanation: "Règle GROUP BY strict Oracle : toute colonne du SELECT non agrégée doit figurer dans le GROUP BY.",
    topic: "GROUP BY",
    difficulty: "medium",
  },
  {
    id: "q229",
    moduleId: "m4",
    question: "Que fait NUMTODSINTERVAL(90, 'MINUTE') ?",
    options: [
      "Ajoute 90 minutes à SYSDATE automatiquement",
      "Convertit 90 minutes en INTERVAL DAY TO SECOND",
      "Retourne un NUMBER",
      "Extrait les minutes d'une date"
    ],
    correctIndexes: [1],
    explanation: "NUMTODSINTERVAL convertit un nombre en intervalle jour/heure/minute/seconde. L'arithmétique date + intervalle se fait ensuite explicitement.",
    topic: "Intervalles",
    difficulty: "medium",
  },
  {
    id: "q230",
    moduleId: "m14",
    question: "Selon l'ordre d'exécution SQL, laquelle s'exécute en premier ?",
    options: ["SELECT", "WHERE", "FROM", "ORDER BY"],
    correctIndexes: [2],
    explanation: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → FETCH. SELECT s'écrit en premier mais s'exécute après HAVING.",
    topic: "Ordre d'exécution",
    difficulty: "easy",
  },
];

/** Nombre de questions à réponses multiples (examen type « choose two/three »). */
export const multiAnswerCount = quizQuestions.filter(
  (q) => q.correctIndexes.length > 1,
).length;

/** Compare la sélection utilisateur à l'ensemble exact des bonnes réponses. */
export function isAnswerCorrect(
  question: QuizQuestion,
  selected: number[],
): boolean {
  if (selected.length !== question.correctIndexes.length) return false;
  const a = [...selected].sort((x, y) => x - y);
  const b = [...question.correctIndexes].sort((x, y) => x - y);
  return a.every((v, i) => v === b[i]);
}

export function requiredAnswerCount(question: QuizQuestion): number {
  return question.correctIndexes.length;
}
