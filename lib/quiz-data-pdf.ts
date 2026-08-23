import type { QuizQuestion } from "./types";

/**
 * Banque issue de l'exploitation des deux PDF de `docs/` :
 *  - `docs/réponses docx.pdf` — 71 réponses corrigées et expliquées en français,
 *    qui fixent le point de connaissance testé et la réponse validée ;
 *  - `docs/1Z0-071.pdf` — utilisé uniquement comme cartographie thématique
 *    (répartition des sujets), jamais comme source de formulation.
 *
 * Les énoncés et les distracteurs sont **réécrits intégralement** : aucune phrase
 * n'est reprise d'un document d'examen tiers. Voir `docs/ANALYSE-SOURCES-PEDAGOGIQUES.md`.
 *
 * Caractéristiques : 71 questions · 26 à réponses multiples (37 %) ·
 * position de la bonne réponse équilibrée · explication détaillée systématique.
 */
export const pdfSourcedQuestions: QuizQuestion[] = [
  // ─── Environnement, outils et architecture ──────────────────────────────
  {
    id: "pdf-q1",
    moduleId: "m15",
    question:
      "Dans SQL*Plus, quelle syntaxe mémorise la valeur saisie pour toute la session au lieu de la redemander à chaque exécution ?",
    options: ["&nom", "&&nom", "@nom", ":nom"],
    correctIndexes: [1],
    explanation:
      "&nom crée une variable de substitution temporaire : SQL*Plus redemande la valeur à chaque exécution du script. && la définit durablement (DEFINE implicite) : la valeur est réutilisée jusqu'à UNDEFINE ou la fin de la session. @ exécute un script et : introduit une variable de liaison.",
    topic: "Variables de substitution",
    difficulty: "medium",
  },
  {
    id: "pdf-q2",
    moduleId: "m15",
    question:
      "Quel outil d'administration graphique est fourni par défaut avec Oracle Database, sans déploiement supplémentaire ?",
    options: [
      "Enterprise Manager Database Express",
      "Oracle Forms Builder",
      "Oracle Data Integrator",
      "Oracle Reports",
    ],
    correctIndexes: [0],
    explanation:
      "EM Database Express est intégré à l'instance et s'utilise directement depuis un navigateur : c'est l'outil graphique de base pour la surveillance, la configuration et le diagnostic. Les autres produits cités sont des logiciels distincts, à installer séparément.",
    topic: "Outils Oracle",
    difficulty: "easy",
  },
  {
    id: "pdf-q3",
    moduleId: "m15",
    question:
      "Que faut-il réunir pour lire un fichier plat du serveur au moyen d'une table externe ? (Choisissez deux réponses.)",
    options: [
      "Un objet DIRECTORY et le privilège READ sur cet objet",
      "Le rôle DBA",
      "Une définition de table dont les colonnes correspondent au format du fichier",
      "Une base ouverte en mode ARCHIVELOG",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Une table externe s'appuie sur un objet DIRECTORY pointant vers un répertoire du serveur, avec le privilège READ (et WRITE pour les fichiers journaux et de rejet). Il faut également décrire la structure attendue dans la définition de la table. Ni le rôle DBA ni le mode ARCHIVELOG ne sont requis.",
    topic: "Tables externes",
    difficulty: "hard",
  },
  {
    id: "pdf-q4",
    moduleId: "m1",
    question: "Que se passe-t-il lorsqu'un bloc demandé par une requête est absent du buffer cache ?",
    options: [
      "La requête échoue avec une erreur",
      "Oracle lit le bloc sur disque puis le charge dans le buffer cache",
      "Oracle renvoie NULL pour les lignes concernées",
      "Le bloc est reconstruit à partir des fichiers de journalisation",
    ],
    correctIndexes: [1],
    explanation:
      "Le buffer cache de la SGA conserve les blocs les plus sollicités. Lorsqu'un bloc en est absent, le processus serveur effectue une lecture physique sur disque et le place dans le cache, afin que les accès suivants soient servis en mémoire.",
    topic: "Architecture Oracle",
    difficulty: "medium",
  },
  {
    id: "pdf-q5",
    moduleId: "m1",
    question:
      "Un étudiant participe à plusieurs projets et un projet réunit plusieurs étudiants. Quelles affirmations sont exactes ? (Choisissez deux réponses.)",
    options: [
      "La relation est de type plusieurs-à-plusieurs",
      "Elle se résout par une table associative portant deux clés étrangères",
      "Il suffit d'ajouter projet_id comme clé étrangère dans ETUDIANTS",
      "Il faut stocker la liste des projets dans une colonne séparée par des virgules",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Une relation plusieurs-à-plusieurs ne se représente pas directement en relationnel : on la décompose en deux relations un-à-plusieurs à l'aide d'une table associative dont la clé primaire est le couple (etudiant_id, projet_id), chaque colonne étant également clé étrangère. Une liste dans une colonne violerait la première forme normale.",
    topic: "Modèle relationnel",
    difficulty: "easy",
  },

  // ─── SELECT, projection et alias ────────────────────────────────────────
  {
    id: "pdf-q6",
    moduleId: "m2",
    question: "Dans quel ordre Oracle évalue-t-il logiquement les clauses d'une requête ?",
    options: [
      "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
      "FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY",
      "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
      "WHERE → FROM → GROUP BY → SELECT → HAVING → ORDER BY",
    ],
    correctIndexes: [2],
    explanation:
      "L'ordre logique est FROM, WHERE, GROUP BY, HAVING, SELECT puis ORDER BY. C'est exactement ce qui explique qu'un alias défini dans le SELECT soit utilisable dans ORDER BY — évalué après — mais jamais dans WHERE, évalué avant.",
    topic: "Ordre d'évaluation",
    difficulty: "medium",
  },
  {
    id: "pdf-q7",
    moduleId: "m2",
    question: "Quelle condition ne retourne jamais aucune ligne, quelles que soient les données ?",
    options: [
      "WHERE commission_pct = NULL",
      "WHERE commission_pct IS NULL",
      "WHERE commission_pct IS NOT NULL",
      "WHERE NVL(commission_pct, 0) = 0",
    ],
    correctIndexes: [0],
    explanation:
      "NULL n'est égal à rien, pas même à lui-même : toute comparaison avec = NULL s'évalue à UNKNOWN et aucune ligne n'est retenue. Le test correct est IS NULL. La même logique s'applique à != NULL, tout aussi inopérant.",
    topic: "Traitement de NULL",
    difficulty: "easy",
  },
  {
    id: "pdf-q8",
    moduleId: "m2",
    question: "Que renvoie SELECT DISTINCT service_id, job_id FROM employes ;",
    options: [
      "Les couples (service_id, job_id) distincts",
      "Les service_id distincts, puis séparément les job_id distincts",
      "Uniquement les service_id distincts",
      "Une erreur : DISTINCT n'accepte qu'une seule colonne",
    ],
    correctIndexes: [0],
    explanation:
      "DISTINCT porte toujours sur l'ensemble de la liste de projection : c'est la combinaison des colonnes qui est dédupliquée, jamais chaque colonne isolément. Un même service_id apparaîtra donc plusieurs fois s'il est associé à des postes différents.",
    topic: "DISTINCT",
    difficulty: "easy",
  },
  {
    id: "pdf-q9",
    moduleId: "m2",
    question:
      "La requête WHERE nom = 'dupont' ne renvoie rien alors que la table contient bien 'DUPONT'. Pourquoi ?",
    options: [
      "La comparaison de chaînes distingue les majuscules des minuscules",
      "Il manque l'opérateur LIKE",
      "La valeur doit être entourée de guillemets doubles",
      "Un index est nécessaire sur la colonne",
    ],
    correctIndexes: [0],
    explanation:
      "Les comparaisons de chaînes sont sensibles à la casse. On la neutralise avec UPPER(nom) = 'DUPONT' ou LOWER(nom) = 'dupont' — en gardant à l'esprit qu'une fonction appliquée à la colonne empêche l'usage d'un index classique, sauf index basé sur fonction.",
    topic: "Comparaison de chaînes",
    difficulty: "easy",
  },
  {
    id: "pdf-q10",
    moduleId: "m2",
    question: "Dans quel cas un alias de colonne doit-il être délimité par des guillemets doubles ?",
    options: [
      "Lorsqu'il est écrit entièrement en majuscules",
      "Lorsqu'il contient un espace ou doit conserver sa casse exacte",
      "Lorsqu'il dépasse dix caractères",
      "Jamais : Oracle interdit les guillemets sur un alias",
    ],
    correctIndexes: [1],
    explanation:
      "Sans guillemets, Oracle convertit l'alias en majuscules et refuse tout espace. Les guillemets doubles préservent la casse et autorisent espaces et caractères spéciaux : SELECT salaire * 12 AS \"Salaire annuel\". Les apostrophes simples désigneraient une constante littérale, pas un alias.",
    topic: "Alias de colonne",
    difficulty: "easy",
  },
  {
    id: "pdf-q11",
    moduleId: "m2",
    question: "Que produit SELECT nom \"Nom de famille\" FROM employes ;",
    options: [
      "Une erreur : le mot-clé AS est obligatoire",
      "La colonne nom, affichée sous l'en-tête « Nom de famille »",
      "Une colonne constante contenant la chaîne « Nom de famille »",
      "Une erreur : les guillemets doubles sont interdits ici",
    ],
    correctIndexes: [1],
    explanation:
      "Le mot-clé AS est facultatif : un alias peut suivre directement l'expression. Les guillemets doubles préservent la casse et permettent l'espace dans l'en-tête. Avec des apostrophes simples, on obtiendrait une colonne littérale et non un alias.",
    topic: "Alias sans AS",
    difficulty: "easy",
  },

  // ─── Tri et limitation de lignes ────────────────────────────────────────
  {
    id: "pdf-q12",
    moduleId: "m3",
    question: "Quelles expressions sont acceptées dans une clause ORDER BY ? (Choisissez trois réponses.)",
    options: [
      "Un alias de colonne défini dans le SELECT",
      "La position numérique d'une colonne du SELECT",
      "Un alias de table employé seul",
      "Le nom d'une colonne de la table absente du SELECT",
      "Une clause WHERE imbriquée",
    ],
    correctIndexes: [0, 1, 3],
    explanation:
      "ORDER BY est évalué en dernier : il voit donc les alias du SELECT, accepte la position numérique (ORDER BY 2) et peut trier sur une colonne de la table qui ne figure pas dans la projection — sauf si la requête emploie DISTINCT ou un opérateur ensembliste, qui restreignent le tri aux colonnes projetées.",
    topic: "ORDER BY",
    difficulty: "medium",
  },
  {
    id: "pdf-q13",
    moduleId: "m3",
    question:
      "Pour SELECT nom, salaire * 12 AS annuel FROM employes, quelles clauses de tri sont valides ? (Choisissez deux réponses.)",
    options: [
      "ORDER BY 'annuel'",
      "ORDER BY 2",
      "ORDER BY annuel",
      "ORDER BY employes.annuel",
    ],
    correctIndexes: [1, 2],
    explanation:
      "ORDER BY accepte la position de la colonne dans le SELECT (2) comme son alias (annuel). En revanche un alias ne peut jamais être qualifié par un nom de table, et 'annuel' entre apostrophes est une constante littérale : le tri porterait sur une valeur identique pour toutes les lignes, donc sur rien.",
    topic: "ORDER BY, alias et position",
    difficulty: "medium",
  },
  {
    id: "pdf-q14",
    moduleId: "m3",
    question:
      "Quelles affirmations sont exactes pour ORDER BY service_id, salaire DESC ? (Choisissez deux réponses.)",
    options: [
      "service_id est trié en ordre croissant",
      "salaire est trié en ordre décroissant à l'intérieur de chaque service",
      "DESC s'applique aux deux colonnes",
      "Les valeurs NULL de salaire apparaissent nécessairement en dernier",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Chaque expression de tri porte son propre sens : en l'absence de mot-clé, ASC est implicite, et DESC ne concerne que l'expression qu'il suit. Par défaut Oracle place les NULL en dernier en ordre croissant mais en premier en ordre décroissant — d'où l'intérêt de NULLS FIRST et NULLS LAST.",
    topic: "ORDER BY multi-critères",
    difficulty: "medium",
  },
  {
    id: "pdf-q15",
    moduleId: "m3",
    question:
      "Par défaut, comment ORDER BY nom classe-t-il 'alpha', 'Beta' et 'Alpha' dans une base dont le tri est binaire ?",
    options: [
      "Les majuscules précèdent les minuscules, car le tri suit les codes des caractères",
      "Le tri ignore la casse",
      "Les minuscules passent systématiquement en premier",
      "L'ordre obtenu est imprévisible",
    ],
    correctIndexes: [0],
    explanation:
      "Le tri par défaut est binaire : il compare les codes des caractères, où les majuscules précèdent les minuscules. Pour un classement insensible à la casse, on trie sur UPPER(nom) ou on positionne les paramètres NLS_SORT et NLS_COMP.",
    topic: "Tri et casse",
    difficulty: "medium",
  },
  {
    id: "pdf-q16",
    moduleId: "m3",
    question: "Quelle clause retourne les 10 % de lignes ayant les salaires les plus élevés ?",
    options: [
      "LIMIT 10 PERCENT",
      "TOP 10 PERCENT",
      "FETCH FIRST 10 PERCENT ROWS ONLY",
      "WHERE ROWNUM <= 10 PERCENT",
    ],
    correctIndexes: [2],
    explanation:
      "Depuis la version 12c, Oracle propose la clause de limitation de lignes OFFSET … FETCH FIRST n [PERCENT] ROWS ONLY, à placer après ORDER BY. LIMIT et TOP appartiennent à d'autres SGBD et sont refusés par Oracle ; ROWNUM n'accepte pas de pourcentage et s'applique avant le tri.",
    topic: "Limitation de lignes",
    difficulty: "medium",
  },

  // ─── Fonctions mono-ligne, conversion, dates ────────────────────────────
  {
    id: "pdf-q17",
    moduleId: "m4",
    question:
      "Que renvoie NVL(TO_CHAR(commission_pct), 'Aucune commission') lorsque commission_pct vaut NULL ?",
    options: ["NULL", "0", "'Aucune commission'", "Une erreur de conversion de type"],
    correctIndexes: [2],
    explanation:
      "NVL substitue la seconde expression lorsque la première est NULL. Les deux arguments doivent être de types compatibles : c'est précisément le rôle du TO_CHAR ici, puisque la valeur de remplacement est une chaîne de caractères.",
    topic: "NVL",
    difficulty: "easy",
  },
  {
    id: "pdf-q18",
    moduleId: "m4",
    question:
      "TO_CHAR(salaire, '9999') affiche ####. Quelles explications sont correctes ? (Choisissez deux réponses.)",
    options: [
      "Le modèle de format est trop court pour la valeur à représenter",
      "Il faut élargir le masque, par exemple '99999'",
      "La colonne salaire est nécessairement de type VARCHAR2",
      "TO_CHAR n'accepte pas de modèle numérique",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Lorsque le modèle de format ne comporte pas assez de positions pour représenter le nombre, Oracle remplit toute la largeur disponible avec des #. Il faut donc allonger le masque, en prévoyant aussi une position pour le signe si des valeurs négatives sont possibles.",
    topic: "Masques numériques TO_CHAR",
    difficulty: "medium",
  },
  {
    id: "pdf-q19",
    moduleId: "m4",
    question: "Quelles conversions sont écrites correctement ? (Choisissez deux réponses.)",
    options: [
      "TO_DATE('15-01-2026', 'DD-MM-YYYY')",
      "TO_DATE('15-01-2026', 'JJ-MM-AAAA')",
      "TO_CHAR(date_embauche, 'DD/MM/YYYY')",
      "TO_CHAR('15-01-2026', 'DD-MM-YYYY')",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Les modèles de format Oracle sont exprimés en anglais : DD, MM, YYYY — jamais JJ ni AAAA. TO_DATE convertit une chaîne en date, TO_CHAR fait l'inverse : lui passer une chaîne en premier argument avec un masque de date est une erreur de type.",
    topic: "TO_DATE et TO_CHAR",
    difficulty: "medium",
  },
  {
    id: "pdf-q20",
    moduleId: "m4",
    question:
      "Quelle expression affiche « Dupont a 18 mois d'ancienneté » à partir des colonnes nom et date_embauche ?",
    options: [
      "CONCAT(nom, MONTHS_BETWEEN(SYSDATE, date_embauche))",
      "nom + ' a ' + ROUND(MONTHS_BETWEEN(SYSDATE, date_embauche)) + ' mois'",
      "nom || ' a ' || MONTHS_BETWEEN(SYSDATE, date_embauche) || ' mois d''ancienneté'",
      "nom || ' a ' || ROUND(MONTHS_BETWEEN(SYSDATE, date_embauche)) || ' mois d''ancienneté'",
    ],
    correctIndexes: [3],
    explanation:
      "L'opérateur de concaténation Oracle est ||, jamais +. MONTHS_BETWEEN renvoie un nombre décimal : ROUND est indispensable pour obtenir un entier lisible. CONCAT n'accepte que deux arguments, ce qui obligerait à l'imbriquer. Enfin, une apostrophe dans un littéral se double.",
    topic: "Concaténation et fonctions de date",
    difficulty: "medium",
  },
  {
    id: "pdf-q21",
    moduleId: "m4",
    question: "Que renvoie SELECT TRUNC(ROUND(156.78, -1), -2) FROM DUAL ;",
    options: ["156", "150", "100", "200"],
    correctIndexes: [2],
    explanation:
      "ROUND(156.78, -1) arrondit à la dizaine la plus proche et donne 160. TRUNC(160, -2) tronque ensuite à la centaine, sans arrondi, et renvoie 100. Un second argument négatif désigne toujours une position à gauche de la virgule.",
    topic: "ROUND et TRUNC",
    difficulty: "hard",
  },
  {
    id: "pdf-q22",
    moduleId: "m4",
    question: "Quel type de données représente le mieux une durée exprimée en années et en mois ?",
    options: ["DATE", "TIMESTAMP", "NUMBER", "INTERVAL YEAR TO MONTH"],
    correctIndexes: [3],
    explanation:
      "Les types INTERVAL représentent des durées et non des instants. INTERVAL YEAR TO MONTH convient aux durées exprimées en années et en mois, INTERVAL DAY TO SECOND aux durées plus fines. DATE et TIMESTAMP désignent, eux, des points dans le temps.",
    topic: "Types INTERVAL",
    difficulty: "medium",
  },
  {
    id: "pdf-q23",
    moduleId: "m4",
    question:
      "Quelles affirmations sont exactes concernant le modèle d'année RR ? (Choisissez deux réponses.)",
    options: [
      "Il déduit le siècle à partir de l'année courante du système",
      "Il est strictement équivalent à YY",
      "Saisi en 2026, '49' est interprété comme 2049",
      "RR n'est utilisable qu'avec TO_CHAR",
    ],
    correctIndexes: [0, 2],
    explanation:
      "RR déduit le siècle de l'année courante : les valeurs 00 à 49 basculent dans le siècle en cours, 50 à 99 dans le précédent. YY, lui, applique systématiquement le siècle courant. Les deux modèles s'emploient aussi bien avec TO_DATE qu'avec TO_CHAR.",
    topic: "Modèle d'année RR",
    difficulty: "hard",
  },

  // ─── Fonctions de groupe et GROUP BY ────────────────────────────────────
  {
    id: "pdf-q24",
    moduleId: "m5",
    question: "Comment COUNT(commission_pct) se comporte-t-il face aux valeurs NULL ?",
    options: [
      "Il les compte comme des zéros",
      "Il les ignore ; NVL(commission_pct, 0) permet de les inclure",
      "Il renvoie NULL dès qu'une valeur est NULL",
      "Il déclenche une erreur",
    ],
    correctIndexes: [1],
    explanation:
      "Toutes les fonctions de groupe ignorent les NULL, à la seule exception de COUNT(*) qui compte les lignes. Pour tenir compte des valeurs manquantes, il faut les substituer explicitement, par exemple COUNT(NVL(commission_pct, 0)).",
    topic: "COUNT et valeurs NULL",
    difficulty: "medium",
  },
  {
    id: "pdf-q25",
    moduleId: "m5",
    question:
      "SELECT service_id, job_id, AVG(salaire) FROM employes GROUP BY service_id ; échoue. Quelles corrections sont valides ? (Choisissez deux réponses.)",
    options: [
      "Ajouter job_id à la clause GROUP BY",
      "Retirer job_id de la liste du SELECT",
      "Remplacer GROUP BY par HAVING",
      "Déplacer AVG(salaire) dans la clause WHERE",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Toute colonne de la projection qui n'est pas encapsulée dans une fonction de groupe doit figurer dans le GROUP BY. On corrige donc soit en ajoutant job_id au regroupement, soit en le retirant du SELECT. HAVING filtre des groupes, il ne les définit pas, et une fonction de groupe est interdite dans WHERE.",
    topic: "Règles du GROUP BY",
    difficulty: "medium",
  },
  {
    id: "pdf-q26",
    moduleId: "m5",
    question:
      "Quelles affirmations sont exactes concernant les fonctions de groupe ? (Choisissez trois réponses.)",
    options: [
      "Elles ignorent les valeurs NULL, à l'exception de COUNT(*)",
      "MAX(AVG(salaire)) est valide avec un GROUP BY approprié",
      "Elles peuvent être placées dans la clause WHERE",
      "AVG et SUM n'acceptent que des données numériques",
      "MIN et MAX ne s'appliquent qu'à des nombres",
    ],
    correctIndexes: [0, 1, 3],
    explanation:
      "Les fonctions de groupe écartent les NULL, COUNT(*) faisant exception puisqu'il compte des lignes. L'imbrication est autorisée sur deux niveaux au maximum, avec un GROUP BY cohérent. AVG et SUM exigent des valeurs numériques, tandis que MIN et MAX acceptent aussi chaînes et dates. Enfin, une fonction de groupe ne peut jamais apparaître dans WHERE : c'est le rôle de HAVING.",
    topic: "Fonctions de groupe",
    difficulty: "medium",
  },
  {
    id: "pdf-q27",
    moduleId: "m5",
    question:
      "SELECT service_id, MAX(salaire) FROM employes GROUP BY service_id HAVING salaire > 5000 ; échoue. Pourquoi ?",
    options: [
      "HAVING ne peut pas suivre GROUP BY",
      "MAX est incompatible avec GROUP BY",
      "service_id devrait être agrégé",
      "HAVING ne peut filtrer que sur une expression de groupe, pas sur la colonne brute salaire",
    ],
    correctIndexes: [3],
    explanation:
      "HAVING s'applique après le regroupement : les valeurs individuelles ne sont plus accessibles. Il faut écrire HAVING MAX(salaire) > 5000, ou déplacer le filtre dans WHERE si l'intention est de sélectionner les lignes avant regroupement.",
    topic: "HAVING",
    difficulty: "medium",
  },
  {
    id: "pdf-q28",
    moduleId: "m5",
    question:
      "Quelles clauses peuvent filtrer sur le résultat d'une fonction de groupe ? (Choisissez deux réponses.)",
    options: [
      "WHERE COUNT(*) > 5",
      "HAVING COUNT(*) > 5",
      "WHERE SUM(salaire) > 100000",
      "HAVING SUM(salaire) > 100000",
    ],
    correctIndexes: [1, 3],
    explanation:
      "WHERE s'applique aux lignes avant regroupement : toute fonction de groupe y est interdite et provoque ORA-00934. HAVING intervient après le GROUP BY et peut donc filtrer sur COUNT, SUM, AVG, MIN ou MAX.",
    topic: "WHERE et HAVING",
    difficulty: "easy",
  },

  // ─── Jointures ──────────────────────────────────────────────────────────
  {
    id: "pdf-q29",
    moduleId: "m6",
    question:
      "Comment joindre deux tables sur deux colonnes de même nom avec la syntaxe ANSI ?",
    options: [
      "JOIN … USING (service_id AND lieu_id)",
      "JOIN … USING (service_id, lieu_id)",
      "JOIN … USING service_id, lieu_id",
      "JOIN … ON USING (service_id, lieu_id)",
    ],
    correctIndexes: [1],
    explanation:
      "USING accepte une liste de colonnes séparées par des virgules, entre parenthèses. Les colonnes citées ne doivent jamais être préfixées d'un alias, ni dans le USING ni dans la projection : elles deviennent une colonne unique dans le résultat.",
    topic: "Jointure USING",
    difficulty: "medium",
  },
  {
    id: "pdf-q30",
    moduleId: "m6",
    question:
      "Vous devez lister tous les services, y compris ceux sans employé. Quelles écritures conviennent ? (Choisissez deux réponses.)",
    options: [
      "FROM services s LEFT OUTER JOIN employes e ON e.service_id = s.service_id",
      "FROM services s JOIN employes e ON e.service_id = s.service_id",
      "FROM services s, employes e WHERE s.service_id = e.service_id(+)",
      "FROM services s, employes e WHERE s.service_id(+) = e.service_id",
    ],
    correctIndexes: [0, 2],
    explanation:
      "LEFT OUTER JOIN conserve toutes les lignes de la table de gauche. Dans la syntaxe Oracle historique, l'opérateur (+) se place du côté susceptible de manquer — donc du côté employes. Une jointure interne éliminerait les services vides, et la dernière écriture inverserait le sens de la jointure.",
    topic: "Jointures externes",
    difficulty: "medium",
  },
  {
    id: "pdf-q31",
    moduleId: "m6",
    question:
      "Quelles écritures produisent la même jointure interne entre employes et services ? (Choisissez deux réponses.)",
    options: [
      "FROM employes e JOIN services s ON e.service_id = s.service_id",
      "FROM employes e, services s WHERE e.service_id = s.service_id",
      "FROM employes e JOIN services s WHERE e.service_id = s.service_id",
      "FROM employes e NATURAL JOIN services s USING (service_id)",
    ],
    correctIndexes: [0, 1],
    explanation:
      "La syntaxe ANSI (JOIN … ON) et la syntaxe Oracle historique (condition dans le WHERE) donnent le même résultat. En revanche JOIN exige ON ou USING — jamais WHERE — et NATURAL JOIN ne peut pas être combiné avec USING.",
    topic: "Syntaxes de jointure",
    difficulty: "medium",
  },
  {
    id: "pdf-q32",
    moduleId: "m6",
    question:
      "Vous affichez chaque employé avec le nom de son manager, issu de la même table. Quelles affirmations sont exactes ? (Choisissez deux réponses.)",
    options: [
      "Un alias distinct est obligatoire pour chaque occurrence de la table",
      "Une jointure sur une seule table est impossible",
      "La condition relie manager_id à employee_id de la seconde occurrence",
      "Il faut obligatoirement créer une vue intermédiaire",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Une auto-jointure référence deux fois la même table : les alias sont indispensables pour distinguer les deux rôles, par exemple e et m. La condition relie e.manager_id à m.employee_id. Une jointure externe permet en outre de conserver les employés sans manager.",
    topic: "Auto-jointure",
    difficulty: "medium",
  },
  {
    id: "pdf-q33",
    moduleId: "m6",
    question: "Quel est le rôle d'un RIGHT OUTER JOIN ?",
    options: [
      "Conserver toutes les lignes de la table citée à droite du JOIN",
      "Conserver toutes les lignes de la table de gauche",
      "Ne conserver que les lignes ayant une correspondance",
      "Trier le résultat selon la table de droite",
    ],
    correctIndexes: [0],
    explanation:
      "RIGHT OUTER JOIN préserve l'intégralité des lignes de la table de droite et complète par des NULL les colonnes de gauche restées sans correspondance. A RIGHT JOIN B équivaut exactement à B LEFT JOIN A.",
    topic: "RIGHT OUTER JOIN",
    difficulty: "easy",
  },
  {
    id: "pdf-q34",
    moduleId: "m6",
    question: "Quelle requête liste tous les services avec leur nombre d'employés, y compris zéro ?",
    options: [
      "FROM services s JOIN employes e ON e.service_id = s.service_id … COUNT(e.employee_id)",
      "FROM services s, employes e WHERE s.service_id = e.service_id … COUNT(*)",
      "FROM employes e LEFT JOIN services s ON e.service_id = s.service_id … COUNT(e.employee_id)",
      "FROM services s LEFT JOIN employes e ON e.service_id = s.service_id … COUNT(e.employee_id)",
    ],
    correctIndexes: [3],
    explanation:
      "Le LEFT JOIN doit partir de la table à préserver, ici services. COUNT(e.employee_id) ne compte que les valeurs non NULL et renvoie donc 0 pour un service vide, alors que COUNT(*) compterait la ligne complétée par des NULL et afficherait 1.",
    topic: "Jointure externe et agrégats",
    difficulty: "hard",
  },
  {
    id: "pdf-q35",
    moduleId: "m6",
    question:
      "Dans A LEFT JOIN B ON …, où faut-il placer un filtre portant sur B pour conserver toutes les lignes de A ?",
    options: [
      "Dans la clause WHERE",
      "Dans la clause ON",
      "Dans la clause HAVING",
      "Peu importe : le résultat est identique",
    ],
    correctIndexes: [1],
    explanation:
      "Un prédicat sur B placé dans le WHERE élimine les lignes où B vaut NULL et transforme donc la jointure externe en jointure interne. Placé dans le ON, il n'intervient que dans la recherche de correspondance et préserve bien toutes les lignes de A.",
    topic: "Filtres et jointures externes",
    difficulty: "hard",
  },
  {
    id: "pdf-q36",
    moduleId: "m6",
    question: "Pourquoi NATURAL JOIN est-il déconseillé dans du code de production ?",
    options: [
      "Il est systématiquement plus lent qu'une jointure explicite",
      "Il ne fonctionne qu'entre deux tables",
      "Il est incompatible avec ORDER BY",
      "Il joint sur toutes les colonnes de même nom, y compris celles ajoutées ultérieurement",
    ],
    correctIndexes: [3],
    explanation:
      "NATURAL JOIN déduit la condition de jointure des noms de colonnes identiques. Toute évolution du schéma — l'ajout d'une colonne CREATED_AT dans les deux tables, par exemple — modifie silencieusement le sens de la requête. Une jointure ON explicite reste stable dans le temps.",
    topic: "NATURAL JOIN",
    difficulty: "medium",
  },

  // ─── Sous-requêtes ──────────────────────────────────────────────────────
  {
    id: "pdf-q37",
    moduleId: "m7",
    question:
      "Quelles affirmations sont exactes à propos des sous-requêtes de comparaison ? (Choisissez deux réponses.)",
    options: [
      "WHERE salaire > (SELECT AVG(salaire) FROM employes) compare chaque ligne à la moyenne globale",
      "Une sous-requête mono-ligne peut renvoyer plusieurs lignes sans provoquer d'erreur",
      "WHERE salaire IN (SELECT salaire FROM employes WHERE service_id = 60) retient les employés dont le salaire coïncide avec l'un de ceux du service 60",
      "AVG ne peut pas être utilisé à l'intérieur d'une sous-requête",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Une sous-requête placée après un opérateur de comparaison simple doit être scalaire : AVG s'y prête parfaitement puisqu'il renvoie une valeur unique. IN accepte au contraire une sous-requête multi-lignes. Une sous-requête mono-ligne qui renvoie plusieurs lignes déclenche ORA-01427.",
    topic: "Sous-requêtes de comparaison",
    difficulty: "medium",
  },
  {
    id: "pdf-q38",
    moduleId: "m7",
    question:
      "Où une sous-requête peut-elle légalement apparaître dans une instruction SELECT ? (Choisissez trois réponses.)",
    options: [
      "Dans la clause WHERE",
      "Dans la clause FROM, sous forme de vue en ligne",
      "Dans la liste du SELECT, comme expression scalaire",
      "Dans le nom de la table cible d'un GRANT",
      "Dans un ORDER BY propre à chaque branche d'un UNION",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Les sous-requêtes sont admises dans WHERE et HAVING, dans FROM sous forme de vue en ligne, et dans la liste du SELECT dès lors qu'elles sont scalaires — au plus une ligne et une colonne. Les branches d'un opérateur ensembliste ne peuvent pas porter leur propre ORDER BY : un seul tri final est autorisé.",
    topic: "Emplacement des sous-requêtes",
    difficulty: "medium",
  },
  {
    id: "pdf-q39",
    moduleId: "m7",
    question: "Qu'est-ce qui caractérise une sous-requête non corrélée ?",
    options: [
      "Elle s'exécute une seule fois, indépendamment de la requête principale",
      "Elle s'exécute une fois par ligne de la requête principale",
      "Elle ne peut jamais renvoyer plusieurs lignes",
      "Elle doit obligatoirement se trouver dans la clause FROM",
    ],
    correctIndexes: [0],
    explanation:
      "Une sous-requête non corrélée ne référence aucune colonne de la requête externe : Oracle l'évalue une seule fois et réutilise son résultat. La sous-requête corrélée, à l'inverse, dépend de la ligne courante et se trouve réévaluée à chaque itération.",
    topic: "Sous-requêtes non corrélées",
    difficulty: "medium",
  },
  {
    id: "pdf-q40",
    moduleId: "m7",
    question:
      "Quelles affirmations décrivent une sous-requête corrélée ? (Choisissez deux réponses.)",
    options: [
      "Elle référence une colonne de la requête externe",
      "Elle est évaluée une fois pour chaque ligne candidate de la requête externe",
      "Elle est toujours plus performante qu'une jointure",
      "Elle ne peut pas être combinée avec EXISTS",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Une sous-requête corrélée dépend de la ligne en cours de traitement : Oracle la réévalue à chaque itération, ce qui la rend souvent plus coûteuse qu'une jointure équivalente. Elle s'associe naturellement à EXISTS et NOT EXISTS, qui testent la seule présence d'une ligne.",
    topic: "Sous-requête corrélée",
    difficulty: "medium",
  },
  {
    id: "pdf-q41",
    moduleId: "m7",
    question: "Quelle contrainte s'applique à une sous-requête placée dans la liste du SELECT ?",
    options: [
      "Elle doit renvoyer au moins deux colonnes",
      "Elle doit porter sur la même table que la requête principale",
      "Elle doit renvoyer au plus une ligne et exactement une colonne",
      "Elle y est purement et simplement interdite",
    ],
    correctIndexes: [2],
    explanation:
      "Une sous-requête dans la projection doit être scalaire : au plus une ligne, exactement une colonne. Si elle ne renvoie aucune ligne, le résultat vaut NULL ; si elle en renvoie plusieurs, Oracle lève ORA-01427.",
    topic: "Sous-requête scalaire",
    difficulty: "medium",
  },
  {
    id: "pdf-q42",
    moduleId: "m7",
    question:
      "Quels opérateurs acceptent une sous-requête renvoyant plusieurs lignes ? (Choisissez deux réponses.)",
    options: ["IN", "= employé seul", "ANY", "> employé seul"],
    correctIndexes: [0, 2],
    explanation:
      "IN, ANY (ou SOME) et ALL sont conçus pour les sous-requêtes multi-lignes. Les opérateurs simples =, >, < exigent une sous-requête scalaire, sauf lorsqu'ils sont combinés à ANY ou ALL : > ANY (…) est valide, > (…) sur plusieurs lignes ne l'est pas.",
    topic: "Sous-requêtes multi-lignes",
    difficulty: "medium",
  },
  {
    id: "pdf-q43",
    moduleId: "m7",
    question:
      "Quelles affirmations sont exactes concernant les opérateurs ANY et ALL ? (Choisissez trois réponses.)",
    options: [
      "> ALL (sous-requête) revient à « supérieur au maximum »",
      "< ALL (sous-requête) revient à « inférieur au minimum »",
      "> ANY (sous-requête) revient à « supérieur au minimum »",
      "ANY et ALL n'acceptent qu'une sous-requête mono-ligne",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "ALL exige que la comparaison soit vraie pour toutes les valeurs renvoyées : > ALL revient donc à dépasser le maximum et < ALL à passer sous le minimum. ANY se contente d'une seule valeur satisfaisante : > ANY signifie « supérieur au minimum ». Les deux opérateurs sont précisément faits pour les sous-requêtes multi-lignes.",
    topic: "Opérateurs ANY et ALL",
    difficulty: "hard",
  },

  // ─── Opérateurs ensemblistes ────────────────────────────────────────────
  {
    id: "pdf-q44",
    moduleId: "m8",
    question: "Que renvoie une requête de la forme SELECT … FROM a MINUS SELECT … FROM b ?",
    options: [
      "Les lignes présentes dans les deux requêtes",
      "Toutes les lignes des deux requêtes",
      "Les lignes de la première requête absentes de la seconde",
      "Les lignes de la seconde requête absentes de la première",
    ],
    correctIndexes: [2],
    explanation:
      "MINUS renvoie les lignes distinctes de la première requête qui n'apparaissent pas dans la seconde. L'ordre des deux requêtes est donc significatif, contrairement à INTERSECT et UNION qui sont commutatifs.",
    topic: "Opérateur MINUS",
    difficulty: "easy",
  },
  {
    id: "pdf-q45",
    moduleId: "m8",
    question: "Comment UNION traite-t-il les lignes contenant des valeurs NULL ?",
    options: [
      "Il échoue dès qu'une colonne contient NULL",
      "Il élimine les doublons et considère deux NULL de même position comme identiques",
      "Il conserve tous les doublons",
      "Il remplace automatiquement NULL par zéro",
    ],
    correctIndexes: [1],
    explanation:
      "UNION supprime les doublons. Pour cette comparaison, Oracle traite deux NULL de même position comme équivalents — comportement différent de l'opérateur =, où NULL = NULL vaut UNKNOWN. UNION ALL, lui, ne déduplique pas et se révèle donc plus rapide.",
    topic: "Opérateur UNION",
    difficulty: "medium",
  },
  {
    id: "pdf-q46",
    moduleId: "m8",
    question:
      "Où placer un ORDER BY dans une requête composée de deux SELECT reliés par UNION ?",
    options: [
      "Dans le premier SELECT",
      "Dans chacun des deux SELECT",
      "Nulle part : UNION interdit tout tri",
      "Une seule fois, après la dernière requête",
    ],
    correctIndexes: [3],
    explanation:
      "Un opérateur ensembliste n'admet qu'un seul ORDER BY, obligatoirement placé après la dernière requête : il porte sur le résultat global. Les colonnes s'y désignent par les noms ou les alias du premier SELECT, ou par leur position.",
    topic: "Opérateurs ensemblistes et tri",
    difficulty: "medium",
  },

  // ─── DML et transactions ────────────────────────────────────────────────
  {
    id: "pdf-q47",
    moduleId: "m9",
    question: "Quelle instruction met correctement la colonne commission_pct à NULL ?",
    options: [
      "UPDATE employes SET commission_pct IS NULL;",
      "UPDATE employes SET commission_pct = 'NULL';",
      "UPDATE employes SET commission_pct = NULL;",
      "UPDATE employes SET commission_pct := NULL;",
    ],
    correctIndexes: [2],
    explanation:
      "Dans une clause SET, l'affectation s'écrit avec =, y compris pour NULL. IS NULL est un opérateur de comparaison réservé à WHERE ; 'NULL' désignerait la chaîne de quatre caractères ; := appartient à PL/SQL, pas au SQL.",
    topic: "UPDATE et valeurs NULL",
    difficulty: "easy",
  },
  {
    id: "pdf-q48",
    moduleId: "m9",
    question: "Comment se comporte un INSERT ALL conditionnel comportant plusieurs clauses WHEN ?",
    options: [
      "Seule la première condition vraie est appliquée",
      "Toutes les conditions sont évaluées et chacune de celles qui sont vraies insère une ligne",
      "Les conditions sont ignorées et toutes les tables sont alimentées",
      "Une erreur est levée si deux conditions sont vraies simultanément",
    ],
    correctIndexes: [1],
    explanation:
      "INSERT ALL évalue chaque clause WHEN indépendamment : une même ligne source peut donc alimenter plusieurs tables cibles. C'est précisément ce qui le distingue d'INSERT FIRST, qui s'arrête à la première condition vérifiée.",
    topic: "INSERT ALL",
    difficulty: "hard",
  },
  {
    id: "pdf-q49",
    moduleId: "m9",
    question:
      "Quelles instructions peuvent modifier plusieurs lignes en une seule exécution ? (Choisissez deux réponses.)",
    options: [
      "UPDATE employes SET salaire = salaire * 1.05 WHERE service_id = 60",
      "INSERT INTO archives SELECT * FROM employes WHERE date_depart IS NOT NULL",
      "INSERT INTO employes VALUES (1, 'Dupont')",
      "DESCRIBE employes",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Un UPDATE agit sur toutes les lignes vérifiant son WHERE. INSERT … SELECT insère autant de lignes que la sous-requête en renvoie. INSERT … VALUES n'en insère qu'une seule, et DESCRIBE est une commande SQL*Plus qui ne modifie aucune donnée.",
    topic: "DML multi-lignes",
    difficulty: "easy",
  },
  {
    id: "pdf-q50",
    moduleId: "m9",
    question: "Que réalise une instruction MERGE ?",
    options: [
      "Elle fusionne physiquement deux tables en une seule",
      "Elle met à jour les lignes correspondantes et insère les autres, en une seule instruction",
      "Elle supprime les doublons d'une table",
      "Elle joint deux tables sans les modifier",
    ],
    correctIndexes: [1],
    explanation:
      "MERGE réalise un « upsert » : la clause ON définit la correspondance, WHEN MATCHED met à jour — voire supprime — les lignes existantes, et WHEN NOT MATCHED insère les nouvelles. Une seule lecture de la source suffit, d'où son intérêt pour les chargements incrémentaux.",
    topic: "Instruction MERGE",
    difficulty: "medium",
  },
  {
    id: "pdf-q51",
    moduleId: "m17",
    question: "Vous exécutez un INSERT, puis un CREATE TABLE, puis un ROLLBACK. Que subsiste-t-il ?",
    options: [
      "Rien : tout est annulé",
      "L'INSERT et la nouvelle table sont conservés",
      "Seule la nouvelle table est conservée",
      "Seul l'INSERT est conservé",
    ],
    correctIndexes: [1],
    explanation:
      "Toute instruction DDL déclenche un COMMIT implicite avant et après son exécution. Le CREATE TABLE valide donc définitivement l'INSERT en attente : le ROLLBACK qui suit n'a plus rien à annuler.",
    topic: "COMMIT implicite du DDL",
    difficulty: "medium",
  },
  {
    id: "pdf-q52",
    moduleId: "m17",
    question: "Qu'est-ce qui délimite une transaction en Oracle ?",
    options: [
      "Chaque instruction DML forme sa propre transaction",
      "Une transaction ne peut contenir qu'un seul INSERT",
      "Elle débute au premier DML et s'achève par COMMIT, ROLLBACK ou une instruction DDL",
      "Elle se termine automatiquement au bout de dix instructions",
    ],
    correctIndexes: [2],
    explanation:
      "Une transaction regroupe autant d'instructions DML que nécessaire. Elle s'achève par un COMMIT ou un ROLLBACK explicite, par le COMMIT implicite d'une instruction DDL ou DCL, ou par une déconnexion : normale, elle valide ; anormale, elle annule.",
    topic: "Délimitation des transactions",
    difficulty: "medium",
  },

  // ─── DDL, contraintes et objets ─────────────────────────────────────────
  {
    id: "pdf-q53",
    moduleId: "m10",
    question: "Que provoque exactement ALTER TABLE commandes SET UNUSED (date_commande) ?",
    options: [
      "La colonne devient inaccessible mais l'espace n'est pas libéré immédiatement",
      "La colonne est supprimée et l'espace rendu sur-le-champ",
      "La colonne reste visible dans DESCRIBE",
      "L'opération peut être annulée par ROLLBACK",
    ],
    correctIndexes: [0],
    explanation:
      "SET UNUSED marque la colonne comme inutilisée : elle disparaît de DESCRIBE et des SELECT, mais les données restent physiquement présentes jusqu'à ALTER TABLE … DROP UNUSED COLUMNS. C'est du DDL : l'opération est auto-validée et ne peut pas être annulée.",
    topic: "SET UNUSED",
    difficulty: "hard",
  },
  {
    id: "pdf-q54",
    moduleId: "m10",
    question:
      "Quelles affirmations sont vraies concernant les contraintes Oracle ? (Choisissez deux réponses.)",
    options: [
      "Une contrainte UNIQUE interdit toute valeur NULL",
      "Une colonne UNIQUE peut contenir plusieurs valeurs NULL",
      "Une contrainte ne peut jamais être désactivée après création",
      "Une contrainte peut être désactivée par ALTER TABLE … DISABLE CONSTRAINT",
    ],
    correctIndexes: [1, 3],
    explanation:
      "UNIQUE garantit l'unicité des valeurs renseignées mais tolère plusieurs NULL, deux NULL n'étant jamais considérés comme égaux. Toute contrainte peut par ailleurs être désactivée puis réactivée par ALTER TABLE … DISABLE / ENABLE CONSTRAINT, pratique courante lors des chargements de masse.",
    topic: "Contraintes UNIQUE",
    difficulty: "medium",
  },
  {
    id: "pdf-q55",
    moduleId: "m10",
    question: "Quelle définition de colonne est syntaxiquement valide en Oracle ?",
    options: [
      "quantite NUMBER DEFAULT = 1",
      "date_vente DATE DEFAULT 'SYSDATE'",
      "paiement VARCHAR2(30) DEFAULT \"ESPECES\"",
      "paiement VARCHAR2(30) DEFAULT 'ESPECES'",
    ],
    correctIndexes: [3],
    explanation:
      "DEFAULT s'écrit sans signe égal. Les littéraux de caractères se délimitent par des apostrophes simples, les guillemets doubles désignant un identifiant. Enfin, SYSDATE doit rester non quoté pour être évalué comme une fonction et non comme une chaîne de sept caractères.",
    topic: "Clause DEFAULT",
    difficulty: "medium",
  },
  {
    id: "pdf-q56",
    moduleId: "m10",
    question: "La définition statut VARCHAR2(10) DEFAULT 'EN_COURS' NOT NULL est-elle valide ?",
    options: [
      "Oui : DEFAULT s'applique quand la colonne est omise et NOT NULL interdit un NULL explicite",
      "Non : DEFAULT et NOT NULL sont incompatibles",
      "Oui, mais DEFAULT doit être déclaré après NOT NULL",
      "Non : DEFAULT est réservé aux colonnes numériques",
    ],
    correctIndexes: [0],
    explanation:
      "Les deux clauses se complètent : DEFAULT fournit la valeur lorsque la colonne n'est pas citée dans l'INSERT, tandis que NOT NULL rejette une insertion explicite de NULL. La syntaxe impose DEFAULT avant les contraintes de colonne.",
    topic: "DEFAULT et NOT NULL",
    difficulty: "medium",
  },
  {
    id: "pdf-q57",
    moduleId: "m10",
    question:
      "Quelles affirmations sont exactes concernant les clés d'une table ? (Choisissez deux réponses.)",
    options: [
      "Une table peut posséder plusieurs clés primaires",
      "Une table possède au plus une clé primaire",
      "Une clé primaire peut contenir des valeurs NULL",
      "Une table peut posséder plusieurs clés étrangères",
    ],
    correctIndexes: [1, 3],
    explanation:
      "Une table n'admet qu'une seule clé primaire, obligatoirement unique et non NULL. Rien ne limite en revanche le nombre de clés étrangères : une table de faits en référence couramment plusieurs.",
    topic: "Clés primaires et étrangères",
    difficulty: "easy",
  },
  {
    id: "pdf-q58",
    moduleId: "m10",
    question:
      "Quelles affirmations sont exactes sur les contraintes CHECK et FOREIGN KEY ? (Choisissez deux réponses.)",
    options: [
      "Une contrainte CHECK peut faire appel à SYSDATE",
      "Une contrainte CHECK peut porter sur plusieurs colonnes de la même ligne",
      "Une clé étrangère peut référencer une colonne dépourvue de contrainte d'unicité",
      "Une clé étrangère peut référencer la table qui la porte",
    ],
    correctIndexes: [1, 3],
    explanation:
      "CHECK évalue une condition sur les colonnes d'une même ligne ; elle ne peut appeler ni fonction non déterministe comme SYSDATE, ni sous-requête. Une clé étrangère doit pointer vers une colonne PRIMARY KEY ou UNIQUE, y compris dans la même table : c'est le cas d'une hiérarchie manager_id → employee_id.",
    topic: "CHECK et FOREIGN KEY",
    difficulty: "hard",
  },
  {
    id: "pdf-q59",
    moduleId: "m10",
    question:
      "Comment garantir qu'un couple (etudiant_id, projet_id) est unique et jamais NULL ? (Choisissez deux réponses.)",
    options: [
      "Déclarer une clé primaire composite sur les deux colonnes",
      "Déclarer une contrainte UNIQUE sur le couple et NOT NULL sur chaque colonne",
      "Déclarer une clé primaire sur chaque colonne séparément",
      "Créer un index non unique sur le couple",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Une clé primaire composite impose à la fois l'unicité du couple et l'absence de NULL. La combinaison UNIQUE + NOT NULL offre exactement la même garantie. Deux clés primaires distinctes sont impossibles, et un index non unique n'impose aucune règle.",
    topic: "Clés composites",
    difficulty: "medium",
  },
  {
    id: "pdf-q60",
    moduleId: "m10",
    question: "Quelle instruction ajoute correctement une colonne à une table existante ?",
    options: [
      "ALTER TABLE employes ADD COLUMN email VARCHAR2(100);",
      "ALTER TABLE employes MODIFY email VARCHAR2(100);",
      "ALTER TABLE employes ADD (email VARCHAR2(100));",
      "ALTER TABLE employes NEW COLUMN email VARCHAR2(100);",
    ],
    correctIndexes: [2],
    explanation:
      "En Oracle, l'ajout s'écrit ADD suivi de la définition entre parenthèses, sans le mot-clé COLUMN — contrairement à d'autres SGBD. MODIFY sert à modifier une colonne existante, et la nouvelle colonne est toujours ajoutée en dernière position.",
    topic: "ALTER TABLE",
    difficulty: "easy",
  },
  {
    id: "pdf-q61",
    moduleId: "m10",
    question: "Quelles contraintes CREATE TABLE … AS SELECT reprend-il de la table source ?",
    options: [
      "Uniquement les contraintes NOT NULL explicites",
      "Toutes les contraintes, index compris",
      "Les clés primaires et étrangères",
      "Aucune contrainte, pas même NOT NULL",
    ],
    correctIndexes: [0],
    explanation:
      "CTAS recopie les noms de colonnes, les types de données et les contraintes NOT NULL explicites. Les clés primaires, uniques et étrangères, les valeurs DEFAULT, les index et les triggers ne sont pas repris : il faut les recréer manuellement.",
    topic: "CREATE TABLE AS SELECT",
    difficulty: "hard",
  },
  {
    id: "pdf-q62",
    moduleId: "m10",
    question: "Après CREATE TABLE copie AS SELECT * FROM employes ; quelle affirmation est vraie ?",
    options: [
      "La table copie possède la même clé primaire que employes",
      "La table copie contient les données mais pas la clé primaire d'origine",
      "La table copie est créée vide",
      "Les triggers de employes sont recopiés",
    ],
    correctIndexes: [1],
    explanation:
      "CTAS crée la structure et charge les données en une seule opération, mais ne reprend ni clé primaire, ni clé étrangère, ni index, ni trigger, ni valeur DEFAULT. Seules les contraintes NOT NULL explicites suivent la copie.",
    topic: "CTAS et contraintes",
    difficulty: "medium",
  },
  {
    id: "pdf-q63",
    moduleId: "m10",
    question:
      "À quoi sert CREATE TABLE modele AS SELECT * FROM employes WHERE 1 = 2 ; ? (Choisissez deux réponses.)",
    options: [
      "À créer une table vide reprenant la même structure de colonnes",
      "À copier toutes les lignes de employes",
      "À obtenir une structure dépourvue de clé primaire et d'index",
      "À créer une vue sur employes",
    ],
    correctIndexes: [0, 2],
    explanation:
      "La condition 1 = 2 n'est jamais vraie : aucune ligne n'est copiée, mais la structure — noms, types, contraintes NOT NULL — est bien créée. C'est la manière classique de dupliquer un squelette de table, sans clés, index ni triggers.",
    topic: "CTAS structure seule",
    difficulty: "medium",
  },
  {
    id: "pdf-q64",
    moduleId: "m10",
    question:
      "Que provoque DROP TABLE commandes, sans PURGE, sur une base dont la corbeille est active ? (Choisissez trois réponses.)",
    options: [
      "La table disparaît de USER_TABLES",
      "Les données restent récupérables par FLASHBACK TABLE … TO BEFORE DROP",
      "Les index associés sont supprimés en même temps",
      "L'opération peut être annulée par ROLLBACK",
      "L'espace est immédiatement rendu au tablespace",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "DROP TABLE retire l'objet du dictionnaire et supprime ses index et triggers. Sans PURGE, la table est déplacée dans la corbeille et demeure récupérable par FLASHBACK TABLE … TO BEFORE DROP : l'espace n'est donc pas libéré immédiatement. S'agissant de DDL, l'opération est auto-validée et ne peut pas être annulée.",
    topic: "DROP TABLE et corbeille",
    difficulty: "hard",
  },
  {
    id: "pdf-q65",
    moduleId: "m10",
    question: "Quelle commande supprime une table sans aucune possibilité de récupération ?",
    options: [
      "DROP TABLE commandes",
      "TRUNCATE TABLE commandes",
      "DELETE FROM commandes",
      "DROP TABLE commandes PURGE",
    ],
    correctIndexes: [3],
    explanation:
      "PURGE contourne la corbeille : l'objet est détruit immédiatement et FLASHBACK TABLE … TO BEFORE DROP devient impossible. Un DROP simple laisse la table récupérable, TRUNCATE vide la table en la conservant, et DELETE reste annulable tant qu'aucun COMMIT n'est intervenu.",
    topic: "DROP … PURGE",
    difficulty: "medium",
  },

  // ─── Vues, dictionnaire et objets de schéma ─────────────────────────────
  {
    id: "pdf-q66",
    moduleId: "m13",
    question: "Sur quelle vue une instruction INSERT est-elle directement possible ?",
    options: [
      "Une vue comportant DISTINCT",
      "Une vue simple sur une seule table, sans fonction de groupe ni DISTINCT",
      "Une vue comportant GROUP BY",
      "Une vue comportant ROWNUM",
    ],
    correctIndexes: [1],
    explanation:
      "Une vue n'est modifiable que si elle est « simple » : une seule table de base, aucune fonction de groupe, aucun GROUP BY, DISTINCT, ROWNUM ni opérateur ensembliste. Dans tous les autres cas, il faut passer par un trigger INSTEAD OF.",
    topic: "Vues modifiables",
    difficulty: "medium",
  },
  {
    id: "pdf-q67",
    moduleId: "m13",
    question: "Quel effet la clause WITH CHECK OPTION produit-elle sur une vue ?",
    options: [
      "Elle interdit toute modification à travers la vue",
      "Elle vérifie l'existence des tables sous-jacentes",
      "Elle rend la vue matérialisée",
      "Elle empêche d'insérer ou de modifier une ligne qui sortirait du périmètre de la vue",
    ],
    correctIndexes: [3],
    explanation:
      "WITH CHECK OPTION garantit qu'une ligne insérée ou modifiée à travers la vue reste visible par cette vue. Sans elle, un UPDATE pourrait faire « disparaître » une ligne du périmètre. WITH READ ONLY, à l'inverse, interdit toute modification.",
    topic: "WITH CHECK OPTION",
    difficulty: "medium",
  },
  {
    id: "pdf-q68",
    moduleId: "m13",
    question: "Quelle vue du dictionnaire liste les objets supprimés encore récupérables ?",
    options: ["USER_RECYCLEBIN", "USER_DROPPED_OBJECTS", "ALL_TRASH", "USER_FLASHBACK"],
    correctIndexes: [0],
    explanation:
      "USER_RECYCLEBIN — accessible aussi par le synonyme RECYCLEBIN — répertorie les objets présents dans la corbeille, avec leur nom d'origine et leur nom système de la forme BIN$… . PURGE RECYCLEBIN vide définitivement cet espace.",
    topic: "Corbeille et dictionnaire",
    difficulty: "medium",
  },

  // ─── Analyse de requêtes et pièges d'examen ─────────────────────────────
  {
    id: "pdf-q69",
    moduleId: "m18",
    question:
      "Une requête s'exécute sans erreur mais ne renvoie rien alors que la table contient des données. Quelle est la cause la plus probable ?",
    options: [
      "Une condition logiquement contradictoire, par exemple un AND entre deux valeurs exclusives",
      "Une erreur de syntaxe non détectée",
      "L'absence de COMMIT dans la session",
      "Une table inexistante",
    ],
    correctIndexes: [0],
    explanation:
      "Une requête syntaxiquement correcte peut être sémantiquement fausse. Le cas classique est le AND appliqué à deux prédicats qui ne peuvent pas être vrais simultanément (service_id = 10 AND service_id = 20), là où un OR était attendu. Une faute de syntaxe ou une table absente produiraient une erreur, pas un résultat vide.",
    topic: "Analyse de résultat",
    difficulty: "medium",
  },
  {
    id: "pdf-q70",
    moduleId: "m18",
    question:
      "Un rapport doit lister les employés des services 10 et 20. La condition service_id = 10 AND service_id = 20 ne renvoie rien. Quelle correction convient ?",
    options: [
      "Remplacer AND par une virgule",
      "Ajouter DISTINCT à la requête",
      "Écrire WHERE service_id IN (10, 20)",
      "Écrire WHERE service_id BETWEEN 10 AND 20",
    ],
    correctIndexes: [2],
    explanation:
      "Une colonne ne peut pas prendre deux valeurs simultanément : le AND rend la condition toujours fausse. IN (10, 20) — équivalent à service_id = 10 OR service_id = 20 — traduit l'intention. BETWEEN 10 AND 20 inclurait en outre tous les services intermédiaires.",
    topic: "Logique des prédicats",
    difficulty: "easy",
  },
  {
    id: "pdf-q71",
    moduleId: "m18",
    question: "Quelle paire d'écritures produit toujours strictement le même résultat ?",
    options: [
      "WHERE salaire BETWEEN 1000 AND 2000 et WHERE salaire > 1000 AND salaire < 2000",
      "WHERE nom LIKE 'A%' et WHERE nom = 'A%'",
      "WHERE commission IS NULL et WHERE commission = NULL",
      "WHERE salaire IN (1000, 2000) et WHERE salaire = 1000 OR salaire = 2000",
    ],
    correctIndexes: [3],
    explanation:
      "IN est une écriture condensée d'une série de OR sur l'égalité. BETWEEN inclut ses deux bornes, contrairement à > … AND < ; LIKE interprète % comme un joker alors que = le prend au pied de la lettre ; enfin, = NULL ne renvoie jamais aucune ligne.",
    topic: "Équivalences de prédicats",
    difficulty: "medium",
  },
];
