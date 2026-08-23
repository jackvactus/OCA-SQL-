import type { QuizQuestion } from "./types";

/**
 * Banque Oracle Database Administration I — examen 1Z0-082.
 *
 * Construite à partir des 142 concepts corrigés de `docs/OCA/ocp 1/OCP.docx`
 * et `docs/OCA/BCK/op1/Reponses.docx`, qui forment une paire appariée
 * question ↔ réponse vérifiée.
 *
 * Les énoncés, options et explications sont **entièrement réécrits** : le
 * document source est un recueil d'examen tiers, seul le point de connaissance
 * testé et la réponse validée ont été repris. Voir `docs/ANALYSE-SOURCES-PEDAGOGIQUES.md`.
 *
 * `moduleId` référence une session du cursus OCP I (`lib/course-ocp1.ts`).
 * Proportion de questions à réponses multiples alignée sur l'examen réel (~70 %).
 */
export const ocp1Questions: QuizQuestion[] = [
  // ─── Session 1 — Architecture ───────────────────────────────────────────
  {
    id: "ocp1-q1",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quelles affirmations sont exactes concernant la relation entre une instance et une base de données ? (Choisissez trois réponses.)",
    options: [
      "Une instance peut ouvrir au plus une base de données à la fois",
      "Une base de données peut être ouverte par plusieurs instances en configuration RAC",
      "Une instance peut être démarrée sans qu'aucune base ne soit montée",
      "Une base de données ne peut exister sans instance en fonctionnement",
      "Une instance contient les fichiers de données",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Une instance est un ensemble de structures mémoire et de processus ; elle n'ouvre qu'une base à la fois. Une même base peut en revanche être ouverte par plusieurs instances en Real Application Clusters. L'état NOMOUNT prouve qu'une instance vit sans base montée. Les fichiers, eux, appartiennent à la base et subsistent instance arrêtée.",
    topic: "Instance et base",
    difficulty: "medium",
  },
  {
    id: "ocp1-q2",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quel processus d'arrière-plan écrit le contenu du redo log buffer dans les fichiers de journalisation ?",
    options: ["DBWn", "CKPT", "LGWR", "ARCn"],
    correctIndexes: [2],
    explanation:
      "LGWR vide le redo log buffer vers les redo logs, notamment à chaque COMMIT. DBWn écrit les blocs de données modifiés, CKPT met à jour les en-têtes de fichiers et ARCn archive les redo logs pleins en mode ARCHIVELOG.",
    topic: "Processus d'arrière-plan",
    difficulty: "easy",
  },
  {
    id: "ocp1-q3",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Que se passe-t-il au redémarrage après un SHUTDOWN ABORT ? (Choisissez deux réponses.)",
    options: [
      "SMON effectue une récupération d'instance",
      "La base s'ouvre dès la fin de la phase de roll forward",
      "Une restauration RMAN est obligatoire",
      "Les transactions validées avant l'arrêt sont perdues",
    ],
    correctIndexes: [0, 1],
    explanation:
      "SHUTDOWN ABORT laisse la base dans un état incohérent : SMON rejoue au démarrage tout le redo (roll forward) puis annule les transactions non validées (rollback). La base s'ouvre dès la fin du roll forward, le rollback se poursuivant en arrière-plan. Aucune restauration n'est nécessaire, et rien de ce qui était validé n'est perdu.",
    topic: "Récupération d'instance",
    difficulty: "medium",
  },
  {
    id: "ocp1-q4",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quelles affirmations sont exactes concernant un bloc Oracle ? (Choisissez trois réponses.)",
    options: [
      "Une ligne trop grande pour un bloc est chaînée sur plusieurs blocs",
      "L'en-tête du bloc contient son adresse (DBA)",
      "Des fragments d'une même ligne peuvent résider dans des blocs différents",
      "Un bloc Oracle correspond toujours à un bloc du système de fichiers",
      "PCTFREE réserve de l'espace pour les nouvelles insertions",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Le chaînage répartit une ligne trop volumineuse sur plusieurs blocs, dont les fragments sont donc dispersés. L'en-tête porte le Data Block Address. Un bloc Oracle regroupe en revanche plusieurs blocs du système de fichiers, et PCTFREE réserve l'espace des futures mises à jour — pas des insertions.",
    topic: "Structure des blocs",
    difficulty: "hard",
  },
  {
    id: "ocp1-q5",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Où réside la zone de tri d'une session connectée en serveur dédié ?",
    options: ["Dans le Shared Pool", "Dans le Large Pool", "Dans le Database Buffer Cache", "Dans la PGA du processus serveur"],
    correctIndexes: [3],
    explanation:
      "En serveur dédié, la zone de tri appartient à la PGA, privée au processus serveur. En serveur partagé, la zone globale utilisateur migre en revanche dans la SGA, plus précisément dans le Large Pool — d'où l'importance de le dimensionner dans ce mode.",
    topic: "SGA et PGA",
    difficulty: "medium",
  },
  {
    id: "ocp1-q6",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quels éléments sont enregistrés dans l'alert log ? (Choisissez trois réponses.)",
    options: [
      "Les interblocages (deadlocks) détectés",
      "Les paramètres d'initialisation dont la valeur diffère du défaut, au démarrage",
      "Les corruptions de blocs détectées",
      "Chaque instruction SQL exécutée par les utilisateurs",
      "Le détail des lignes modifiées par chaque UPDATE",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "L'alert log trace les événements structurants : démarrages et arrêts avec les paramètres non par défaut, interblocages, corruptions, erreurs internes, opérations de DDL sensibles. Il ne journalise ni les instructions ordinaires ni les données modifiées — c'est le rôle de l'audit et du redo.",
    topic: "Alert log",
    difficulty: "medium",
  },
  {
    id: "ocp1-q7",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quelle affirmation décrit correctement le principe du write-ahead logging ?",
    options: [
      "DBWn écrit les blocs de données avant que LGWR n'écrive le redo",
      "LGWR écrit le redo avant que DBWn n'écrive les blocs de données",
      "Le COMMIT attend que tous les blocs modifiés soient sur disque",
      "Le redo n'est écrit qu'au moment du checkpoint",
    ],
    correctIndexes: [1],
    explanation:
      "Le redo est toujours écrit avant les blocs de données. C'est ce qui permet à SMON de rejouer les transactions validées après une panne, sans que le COMMIT ait eu à attendre l'écriture des blocs — d'où de bonnes performances en écriture.",
    topic: "Write-ahead logging",
    difficulty: "medium",
  },
  {
    id: "ocp1-q8",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quels composants font partie de la SGA ? (Choisissez trois réponses.)",
    options: [
      "Le Database Buffer Cache",
      "Le Shared Pool",
      "Le Redo Log Buffer",
      "La zone de tri d'une session en serveur dédié",
      "Les fichiers de contrôle",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "La SGA est la mémoire partagée de l'instance : buffer cache, shared pool, redo log buffer, large pool, java pool et streams pool. La zone de tri en serveur dédié appartient à la PGA, et les fichiers de contrôle sont sur disque.",
    topic: "Composants de la SGA",
    difficulty: "easy",
  },
  {
    id: "ocp1-q9",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quel processus libère les ressources et les verrous après l'échec d'un processus utilisateur ?",
    options: ["PMON", "SMON", "CKPT", "MMON"],
    correctIndexes: [0],
    explanation:
      "PMON (Process Monitor) nettoie après un processus utilisateur défaillant : il annule sa transaction, libère ses verrous et restitue ses ressources. SMON gère la récupération d'instance et la maintenance de l'espace, CKPT les points de reprise, MMON les statistiques AWR et les alertes.",
    topic: "PMON et SMON",
    difficulty: "easy",
  },
  {
    id: "ocp1-q10",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-1",
    question: "Quelles affirmations sont exactes concernant la migration de lignes ? (Choisissez deux réponses.)",
    options: [
      "Elle survient quand une mise à jour fait grossir une ligne au-delà de l'espace libre de son bloc",
      "L'emplacement d'origine conserve un pointeur vers le nouvel emplacement",
      "Elle survient dès l'insertion d'une ligne trop grande pour un bloc",
      "Elle est sans effet sur les performances de lecture",
    ],
    correctIndexes: [0, 1],
    explanation:
      "La migration concerne une ligne qui grossit et ne tient plus dans son bloc : elle déménage, son emplacement d'origine gardant un pointeur. Toute lecture par index paie donc un accès supplémentaire. Une ligne trop grande dès l'insertion relève du chaînage, un phénomène distinct. PCTFREE prévient la migration.",
    topic: "Migration de lignes",
    difficulty: "hard",
  },

  // ─── Session 2 — Gestion de l'instance ──────────────────────────────────
  {
    id: "ocp1-q11",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quelles affirmations sont exactes concernant l'Automatic Diagnostic Repository ? (Choisissez trois réponses.)",
    options: [
      "Il prend en charge le diagnostic d'Oracle Clusterware",
      "Il prend en charge le diagnostic d'Automatic Storage Management",
      "Il est stocké hors de la base, dans une arborescence de fichiers",
      "Il réside dans un schéma de la base de données",
      "Il n'est consultable que si l'instance est ouverte",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "L'ADR est une arborescence de fichiers hors base : c'est précisément ce qui la rend consultable instance arrêtée, au moment où l'on en a le plus besoin. Elle couvre la base, ASM, Oracle Clusterware et Oracle Net. L'outil adrci permet de la parcourir et de constituer un paquet de diagnostic.",
    topic: "ADR",
    difficulty: "medium",
  },
  {
    id: "ocp1-q12",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Où Oracle place-t-il la racine de l'ADR si le paramètre DIAGNOSTIC_DEST n'est pas positionné ?",
    options: [
      "Dans $ORACLE_HOME/dbs",
      "Dans le répertoire désigné par la variable d'environnement ORACLE_BASE",
      "Dans $ORACLE_HOME/rdbms/admin",
      "Dans le répertoire courant de l'utilisateur",
    ],
    correctIndexes: [1],
    explanation:
      "La résolution suit trois étapes : le paramètre DIAGNOSTIC_DEST s'il est défini, sinon la variable ORACLE_BASE, sinon $ORACLE_HOME/log. La vue V$DIAG_INFO donne la valeur effectivement retenue.",
    topic: "DIAGNOSTIC_DEST",
    difficulty: "hard",
  },
  {
    id: "ocp1-q13",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quelle portée faut-il employer pour qu'un paramètre modifié soit à la fois actif immédiatement et conservé au redémarrage ?",
    options: ["SCOPE=MEMORY", "SCOPE=SPFILE", "SCOPE=BOTH", "SCOPE=SESSION"],
    correctIndexes: [2],
    explanation:
      "SCOPE=BOTH combine les deux effets, et c'est d'ailleurs le défaut quand l'instance a démarré depuis un SPFILE. MEMORY n'agit que jusqu'au prochain arrêt, SPFILE seulement à partir du prochain démarrage. Un paramètre statique n'accepte que SCOPE=SPFILE.",
    topic: "SPFILE et portées",
    difficulty: "medium",
  },
  {
    id: "ocp1-q14",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Que se passe-t-il exactement lors d'un ALTER DATABASE MOUNT ? (Choisissez deux réponses.)",
    options: [
      "Le fichier de contrôle est lu",
      "L'opération est tracée dans l'alert log",
      "Les fichiers de données sont ouverts",
      "Le dictionnaire de données devient interrogeable",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le montage lit le fichier de contrôle, qui décrit la structure physique de la base, et l'événement est consigné dans l'alert log. Les fichiers de données et les redo logs ne sont ouverts qu'à l'étape OPEN, tout comme le dictionnaire, qui réside dans le tablespace SYSTEM.",
    topic: "États de démarrage",
    difficulty: "medium",
  },
  {
    id: "ocp1-q15",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quel mode d'arrêt annule les transactions en cours sans attendre la déconnexion des utilisateurs, tout en produisant un arrêt propre ?",
    options: ["SHUTDOWN NORMAL", "SHUTDOWN TRANSACTIONAL", "SHUTDOWN IMMEDIATE", "SHUTDOWN ABORT"],
    correctIndexes: [2],
    explanation:
      "IMMEDIATE annule les transactions actives, déconnecte les sessions, écrit les buffers et pose un point de reprise : le redémarrage ne demandera aucune récupération. NORMAL attend la déconnexion de tous, TRANSACTIONAL la fin des transactions, et ABORT s'arrête net en laissant une récupération d'instance à faire.",
    topic: "Modes d'arrêt",
    difficulty: "medium",
  },
  {
    id: "ocp1-q16",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quelles vues sont interrogeables dès l'état NOMOUNT ? (Choisissez deux réponses.)",
    options: ["V$INSTANCE", "V$PARAMETER", "DBA_TABLES", "DBA_USERS"],
    correctIndexes: [0, 1],
    explanation:
      "Les vues dynamiques V$ lues en mémoire — V$INSTANCE, V$SGA, V$PARAMETER — sont disponibles dès NOMOUNT. Celles alimentées par le fichier de contrôle, comme V$DATAFILE, exigent MOUNT. Les vues du dictionnaire préfixées DBA_ résident dans SYSTEM et n'existent qu'à l'état OPEN.",
    topic: "Vues dynamiques",
    difficulty: "medium",
  },
  {
    id: "ocp1-q17",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quelle commande de SQL*Plus affiche les variables de substitution actuellement définies ?",
    options: ["SHOW ALL", "DEFINE", "SHOW PARAMETER", "LIST"],
    correctIndexes: [1],
    explanation:
      "DEFINE, sans argument, énumère les variables de substitution définies, dont celles créées par && qui persistent jusqu'à UNDEFINE. SHOW PARAMETER concerne les paramètres d'initialisation, LIST le contenu du tampon SQL.",
    topic: "Variables de substitution",
    difficulty: "medium",
  },
  {
    id: "ocp1-q18",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quelles affirmations sont exactes concernant l'optimiseur Oracle ? (Choisissez trois réponses.)",
    options: [
      "Il choisit le plan qu'il estime le moins coûteux",
      "Il détermine l'ordre de jointure le plus favorable",
      "Il peut ré-optimiser une instruction à partir des statistiques observées à l'exécution",
      "Il applique toujours l'ordre des tables écrit dans la clause FROM",
      "Il ignore les statistiques quand un index existe",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "L'optimiseur par coût évalue plusieurs plans, choisit l'ordre de jointure et la méthode d'accès. Depuis la 12c, l'optimisation adaptative lui permet de corriger un plan à partir de ce qu'il constate réellement à l'exécution. L'ordre du FROM ne le contraint pas, et les statistiques restent son entrée principale.",
    topic: "Optimiseur",
    difficulty: "hard",
  },
  {
    id: "ocp1-q19",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-2",
    question: "Quel outil en ligne de commande permet de parcourir l'ADR, lister les incidents et constituer un paquet de diagnostic ?",
    options: ["adrci", "opatch", "srvctl", "lsnrctl"],
    correctIndexes: [0],
    explanation:
      "adrci lit l'alert log (show alert), énumère les incidents (show incident) et fabrique un paquet destiné au support (ips pack). opatch applique des correctifs, srvctl pilote Oracle Restart et lsnrctl l'écouteur.",
    topic: "adrci",
    difficulty: "easy",
  },

  // ─── Session 3 — Sécurité ───────────────────────────────────────────────
  {
    id: "ocp1-q20",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelles analyses DBMS_PRIVILEGE_CAPTURE permet-il de conduire ? (Choisissez trois réponses.)",
    options: [
      "Les privilèges réellement utilisés par l'ensemble des utilisateurs, administratifs compris",
      "Les privilèges obtenus par l'intermédiaire d'un rôle et effectivement exercés",
      "Les privilèges capturés selon une condition portant sur le contexte de session",
      "Les privilèges qu'un utilisateur détient sur ses propres objets et qu'il a utilisés",
      "Le nombre de connexions par utilisateur et par jour",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Les quatre types de capture sont G_DATABASE (toute la base, administratifs inclus), G_ROLE (via des rôles donnés), G_CONTEXT (selon une condition de session) et leur combinaison. Les vues DBA_USED_PRIVS et DBA_UNUSED_PRIVS livrent le résultat, base de la révocation du superflu.",
    topic: "Analyse de privilèges",
    difficulty: "hard",
  },
  {
    id: "ocp1-q21",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Un utilisateur doit créer une table dans le tablespace SALES_Q1. Que lui faut-il ? (Choisissez trois réponses.)",
    options: [
      "Un quota sur SALES_Q1",
      "Le privilège CREATE SESSION",
      "Le privilège CREATE TABLE",
      "Le privilège DBA",
      "Le privilège ALTER TABLESPACE",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Trois conditions et pas une de plus : pouvoir se connecter (CREATE SESSION), pouvoir créer une table (CREATE TABLE), et disposer d'un quota sur le tablespace visé. Sans quota, la création échoue malgré le privilège — c'est le piège classique.",
    topic: "Quotas et privilèges",
    difficulty: "medium",
  },
  {
    id: "ocp1-q22",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Un utilisateur reçoit un privilège système WITH ADMIN OPTION. Que peut-il faire ? (Choisissez trois réponses.)",
    options: [
      "Exercer le privilège",
      "Le révoquer à ceux à qui il l'a accordé",
      "Le réaccorder à d'autres, WITH ADMIN OPTION comprise",
      "Le retirer à l'administrateur qui le lui a donné",
      "Le convertir en privilège objet",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "WITH ADMIN OPTION confère le droit de propager le privilège, option comprise, et de le révoquer à ses bénéficiaires. Point important pour l'examen : révoquer un privilège **système** ne casse pas en cascade les octrois dérivés — contrairement à un privilège **objet** donné WITH GRANT OPTION.",
    topic: "WITH ADMIN OPTION",
    difficulty: "hard",
  },
  {
    id: "ocp1-q23",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Un utilisateur atteint son quota sur un tablespace. Quelles solutions permettent la poursuite des insertions ? (Choisissez trois réponses.)",
    options: [
      "Augmenter son quota sur ce tablespace",
      "Lui accorder le privilège système UNLIMITED TABLESPACE",
      "Supprimer certains de ses objets pour libérer de l'espace",
      "Lui accorder le privilège CREATE TABLE",
      "Passer le tablespace en lecture seule",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Le quota se relève par ALTER USER … QUOTA, se contourne par UNLIMITED TABLESPACE — à éviter, car il annule tous les quotas et contredit le moindre privilège — ou se libère en supprimant des objets. CREATE TABLE ne joue aucun rôle ici, et le mode lecture seule interdirait toute écriture.",
    topic: "Gestion des quotas",
    difficulty: "medium",
  },
  {
    id: "ocp1-q24",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Pourquoi un utilisateur disposant de CREATE TABLE via un rôle ne peut-il pas créer une vue qui s'appuie sur cette table ?",
    options: [
      "Parce que la création d'une vue exige un privilège accordé directement, non hérité d'un rôle",
      "Parce qu'une vue exige toujours le privilège DBA",
      "Parce qu'un rôle ne peut jamais contenir de privilège système",
      "Parce que les vues ne peuvent porter que sur des tables du schéma SYS",
    ],
    correctIndexes: [0],
    explanation:
      "Les objets stockés — vues, procédures, déclencheurs — ne prennent en compte que les privilèges accordés directement à leur propriétaire. Les privilèges obtenus par rôle sont désactivés dans ce contexte, pour que l'objet reste valide même si le rôle est retiré.",
    topic: "Rôles et objets stockés",
    difficulty: "hard",
  },
  {
    id: "ocp1-q25",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelles limites d'un profil s'appliquent indépendamment du paramètre RESOURCE_LIMIT ? (Choisissez deux réponses.)",
    options: [
      "FAILED_LOGIN_ATTEMPTS",
      "PASSWORD_LIFE_TIME",
      "SESSIONS_PER_USER",
      "IDLE_TIME",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Les limites relatives au mot de passe s'appliquent toujours. Les limites de ressources — sessions, temps d'inactivité, CPU — ne prennent effet que si RESOURCE_LIMIT vaut TRUE, ce qui est le cas par défaut depuis la 12c.",
    topic: "Profils",
    difficulty: "medium",
  },
  {
    id: "ocp1-q26",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelles affirmations sont exactes concernant les synonymes ? (Choisissez trois réponses.)",
    options: [
      "Un synonyme peut désigner un objet appartenant à un autre utilisateur",
      "Un synonyme peut désigner une séquence",
      "Un synonyme public est visible de tous les utilisateurs",
      "Un synonyme accorde implicitement le privilège d'accès à l'objet visé",
      "Un synonyme ne peut désigner qu'une table",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Un synonyme est un simple alias : il vise tables, vues, séquences, procédures ou autres synonymes, y compris dans un autre schéma, et peut être public. Il ne confère en revanche aucun droit — sans privilège objet, l'accès échoue malgré le synonyme.",
    topic: "Synonymes",
    difficulty: "medium",
  },
  {
    id: "ocp1-q27",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelle commande verrouille un compte sans le supprimer ?",
    options: [
      "DROP USER marie",
      "ALTER USER marie ACCOUNT LOCK",
      "REVOKE CREATE SESSION FROM marie",
      "ALTER USER marie PASSWORD EXPIRE",
    ],
    correctIndexes: [1],
    explanation:
      "ACCOUNT LOCK interdit toute connexion en conservant le compte et ses objets ; ACCOUNT UNLOCK le rétablit. Révoquer CREATE SESSION produit un effet voisin mais moins explicite, PASSWORD EXPIRE force seulement un changement de mot de passe, et DROP supprime tout.",
    topic: "Gestion des comptes",
    difficulty: "easy",
  },
  {
    id: "ocp1-q28",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelles fonctionnalités de sécurité réseau Oracle propose-t-il au niveau de l'écouteur ? (Choisissez deux réponses.)",
    options: [
      "La restriction des adresses IP autorisées à se connecter",
      "L'activation de règles de contrôle d'accès prédéfinies",
      "Le chiffrement automatique de tous les tablespaces",
      "L'expiration automatique des mots de passe",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Oracle Net permet de filtrer par adresse via les paramètres de contrôle d'accès (valid node checking) et d'appliquer des règles prédéfinies. Le chiffrement des tablespaces relève de Transparent Data Encryption, et l'expiration des mots de passe des profils.",
    topic: "Sécurité réseau",
    difficulty: "hard",
  },
  {
    id: "ocp1-q29",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-3",
    question: "Quelle différence sépare WITH ADMIN OPTION de WITH GRANT OPTION lors d'une révocation ?",
    options: [
      "WITH ADMIN OPTION provoque une révocation en cascade, WITH GRANT OPTION non",
      "WITH GRANT OPTION provoque une révocation en cascade, WITH ADMIN OPTION non",
      "Les deux provoquent une révocation en cascade",
      "Aucune des deux ne provoque de révocation en cascade",
    ],
    correctIndexes: [1],
    explanation:
      "Révoquer un privilège **objet** accordé WITH GRANT OPTION retire aussi les octrois dérivés. Révoquer un privilège **système** accordé WITH ADMIN OPTION laisse au contraire subsister ce que le bénéficiaire avait redistribué : il faut le retirer explicitement.",
    topic: "Révocation en cascade",
    difficulty: "hard",
  },

  // ─── Session 4 — Stockage ───────────────────────────────────────────────
  {
    id: "ocp1-q30",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Une table est créée avec SEGMENT CREATION DEFERRED. Que se passe-t-il ?",
    options: [
      "Aucun segment n'est alloué tant qu'aucune ligne n'a été insérée",
      "Un extent minimal est réservé immédiatement",
      "La table est créée hors ligne",
      "La création échoue si le tablespace est plein",
    ],
    correctIndexes: [0],
    explanation:
      "La création différée de segment évite de consommer un extent pour une table qui restera peut-être vide — précieux sur les schémas applicatifs comptant des milliers de tables. Le segment naît à la première insertion.",
    topic: "Création différée de segment",
    difficulty: "medium",
  },
  {
    id: "ocp1-q31",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Quelles affirmations sont exactes concernant le tablespace UNDO ? (Choisissez trois réponses.)",
    options: [
      "Il permet d'annuler une transaction non validée",
      "Il assure la cohérence en lecture des requêtes longues",
      "Il alimente les technologies Flashback fondées sur l'undo",
      "Il contient les enregistrements de reprise utilisés après une panne d'instance",
      "Il peut être mis hors ligne pendant que la base est ouverte",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "L'undo stocke l'image d'avant modification : il sert au ROLLBACK, à la cohérence en lecture et aux fonctions Flashback. Les enregistrements de reprise, eux, vivent dans les redo logs. Le tablespace undo actif ne peut pas être mis hors ligne.",
    topic: "Tablespace UNDO",
    difficulty: "medium",
  },
  {
    id: "ocp1-q32",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Une requête longue échoue avec ORA-01555. Quelles corrections sont pertinentes ? (Choisissez trois réponses.)",
    options: [
      "Augmenter la valeur d'UNDO_RETENTION",
      "Agrandir le tablespace undo",
      "Activer RETENTION GUARANTEE sur le tablespace undo",
      "Augmenter la taille du buffer cache",
      "Passer la base en mode NOARCHIVELOG",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "ORA-01555 signale un undo écrasé avant la fin d'une requête. On allonge la rétention, on agrandit le tablespace, ou l'on garantit la rétention — cette dernière option faisant échouer les nouvelles transactions plutôt que d'écraser l'undo. Ni le buffer cache ni le mode d'archivage n'entrent en jeu.",
    topic: "ORA-01555",
    difficulty: "hard",
  },
  {
    id: "ocp1-q33",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Que faut-il activer avant de pouvoir exécuter ALTER TABLE … SHRINK SPACE ?",
    options: [
      "Le mode ARCHIVELOG",
      "Le row movement sur la table",
      "La compression avancée",
      "Le suivi des blocs modifiés",
    ],
    correctIndexes: [1],
    explanation:
      "La réduction déplace physiquement des lignes : ALTER TABLE … ENABLE ROW MOVEMENT est donc obligatoire. SHRINK SPACE COMPACT compacte sans abaisser la HWM ; l'ajout de CASCADE propage l'opération aux index dépendants.",
    topic: "SHRINK SPACE",
    difficulty: "medium",
  },
  {
    id: "ocp1-q34",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "À quoi sert l'allocation d'espace reprenable ? (Choisissez deux réponses.)",
    options: [
      "À suspendre une opération à court d'espace au lieu de la faire échouer",
      "À laisser à l'administrateur le temps d'agrandir le tablespace, l'opération reprenant ensuite",
      "À compresser automatiquement les segments saturés",
      "À déplacer les segments vers un autre tablespace",
    ],
    correctIndexes: [0, 1],
    explanation:
      "ALTER SESSION ENABLE RESUMABLE transforme une erreur d'espace en suspension : la session attend, l'administrateur agrandit, l'opération reprend là où elle s'était arrêtée. La vue DBA_RESUMABLE liste les sessions en attente. C'est la parade aux chargements nocturnes qui échouent à 90 %.",
    topic: "Allocation reprenable",
    difficulty: "hard",
  },
  {
    id: "ocp1-q35",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Quel tablespace ne peut jamais être mis hors ligne ?",
    options: ["SYSAUX", "TEMP", "SYSTEM", "USERS"],
    correctIndexes: [2],
    explanation:
      "SYSTEM héberge le dictionnaire de données : la base ne peut pas fonctionner sans lui. SYSAUX peut être mis hors ligne au prix de la perte de certaines fonctions (AWR notamment), et les tablespaces temporaires ou applicatifs le supportent sans difficulté.",
    topic: "Tablespaces système",
    difficulty: "easy",
  },
  {
    id: "ocp1-q36",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Quelle différence sépare COMPRESS BASIC de ROW STORE COMPRESS ADVANCED ?",
    options: [
      "BASIC ne compresse que les chargements en chemin direct, ADVANCED maintient la compression lors des DML ordinaires",
      "ADVANCED ne fonctionne que sur les index",
      "BASIC exige le mode ARCHIVELOG",
      "Les deux sont strictement équivalentes",
    ],
    correctIndexes: [0],
    explanation:
      "La compression de base ne s'applique qu'aux insertions en chemin direct : les lignes ajoutées ensuite par un INSERT ordinaire restent non compressées. La compression avancée maintient le gain à travers les DML, au prix d'une option supplémentaire.",
    topic: "Compression",
    difficulty: "hard",
  },
  {
    id: "ocp1-q37",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-4",
    question: "Quelles affirmations sont exactes concernant la hiérarchie logique du stockage ? (Choisissez deux réponses.)",
    options: [
      "Un segment est composé d'un ou plusieurs extents",
      "Un extent est un ensemble de blocs Oracle contigus",
      "Un tablespace est contenu dans un segment",
      "Un bloc Oracle correspond à un fichier de données",
    ],
    correctIndexes: [0, 1],
    explanation:
      "La hiérarchie descend de la base au tablespace, du tablespace au segment, du segment à l'extent, et de l'extent au bloc. Un extent regroupe des blocs contigus dans un même fichier de données ; c'est l'unité d'allocation.",
    topic: "Hiérarchie du stockage",
    difficulty: "easy",
  },

  // ─── Session 5 — Réseau ─────────────────────────────────────────────────
  {
    id: "ocp1-q38",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-5",
    question: "Une connexion échoue avec ORA-12154 : « TNS: could not resolve the connect identifier ». Quelle est la cause la plus probable ?",
    options: [
      "L'instance est arrêtée",
      "L'écouteur n'est pas démarré",
      "L'identifiant de connexion n'est pas résolu par la méthode de nommage configurée",
      "Le mot de passe est incorrect",
    ],
    correctIndexes: [2],
    explanation:
      "ORA-12154 se produit avant toute tentative de connexion réseau : le client n'a pas su traduire l'alias en adresse. Il faut vérifier tnsnames.ora, la variable TNS_ADMIN ou la méthode de nommage. Un écouteur arrêté produirait ORA-12541, une instance arrêtée ORA-01034.",
    topic: "Résolution de noms",
    difficulty: "medium",
  },
  {
    id: "ocp1-q39",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-5",
    question: "Dans quels cas un enregistrement statique dans listener.ora reste-t-il nécessaire ? (Choisissez deux réponses.)",
    options: [
      "Pour exécuter un STARTUP à distance sur une instance arrêtée",
      "Pour connecter l'instance auxiliaire d'une duplication RMAN, démarrée en NOMOUNT",
      "Pour toute connexion applicative ordinaire",
      "Pour permettre l'enregistrement dynamique par PMON",
    ],
    correctIndexes: [0, 1],
    explanation:
      "L'enregistrement dynamique par PMON suppose une instance déjà démarrée : elle ne peut donc pas s'annoncer si elle est arrêtée. D'où la nécessité d'une entrée statique pour les deux cas où l'on se connecte précisément à une instance qui ne tourne pas encore.",
    topic: "Écouteur",
    difficulty: "hard",
  },
  {
    id: "ocp1-q40",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-5",
    question: "Quelle méthode de résolution ne demande aucun fichier de configuration côté client ?",
    options: ["Local naming", "Easy Connect", "Directory naming", "External naming"],
    correctIndexes: [1],
    explanation:
      "Easy Connect se contente de la chaîne hote:port/service passée à la connexion. Le nommage local exige tnsnames.ora, le nommage par annuaire un LDAP, et le nommage externe un service tiers.",
    topic: "Méthodes de nommage",
    difficulty: "easy",
  },
  {
    id: "ocp1-q41",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-5",
    question: "Quelles affirmations sont exactes concernant le mode serveur partagé ? (Choisissez deux réponses.)",
    options: [
      "La zone globale utilisateur migre de la PGA vers la SGA",
      "Les sessions passent par des dispatchers plutôt que par un processus serveur dédié",
      "RMAN peut s'y connecter sans restriction",
      "Il supprime le besoin d'un écouteur",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le serveur partagé mutualise un pool de processus via des dispatchers, ce qui déplace la UGA dans le Large Pool de la SGA. RMAN et les tâches d'administration exigent en revanche une connexion en serveur dédié, et l'écouteur reste indispensable.",
    topic: "Serveur partagé",
    difficulty: "hard",
  },

  // ─── Session 6 — Déplacement de données ─────────────────────────────────
  {
    id: "ocp1-q42",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-6",
    question: "Quelles affirmations sont exactes concernant le pilote d'accès ORACLE_DATAPUMP des tables externes ? (Choisissez trois réponses.)",
    options: [
      "Il permet de décharger des données vers un fichier",
      "Il permet de recharger ces données dans une autre base",
      "Les fichiers produits sont réutilisables sur une autre instance",
      "Il autorise les UPDATE sur la table externe",
      "Il crée automatiquement des index sur la table externe",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "ORACLE_DATAPUMP écrit un fichier au format Data Pump depuis un CREATE TABLE … ORGANIZATION EXTERNAL … AS SELECT, fichier ensuite lisible par une autre base. La table externe demeure en lecture seule et n'accepte aucun index — c'est le pilote ORACLE_LOADER qui lit, lui, les fichiers plats.",
    topic: "Tables externes",
    difficulty: "hard",
  },
  {
    id: "ocp1-q43",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-6",
    question: "Quels sont les deux prérequis pour lire un fichier plat au moyen d'une table externe ? (Choisissez deux réponses.)",
    options: [
      "Un objet DIRECTORY pointant vers le répertoire du serveur",
      "Le privilège READ sur cet objet DIRECTORY",
      "Le rôle DBA",
      "Le mode ARCHIVELOG",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le DIRECTORY et le privilège READ suffisent — WRITE en plus si l'on souhaite des fichiers journaux et de rejet. Ni le rôle DBA ni le mode d'archivage n'interviennent. Le répertoire désigne un chemin du serveur, jamais du poste client.",
    topic: "Objets DIRECTORY",
    difficulty: "medium",
  },
  {
    id: "ocp1-q44",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-6",
    question: "Quelle option de Data Pump transfère directement d'une base à une autre, sans fichier intermédiaire ?",
    options: ["DUMPFILE", "NETWORK_LINK", "REMAP_SCHEMA", "ESTIMATE_ONLY"],
    correctIndexes: [1],
    explanation:
      "NETWORK_LINK s'appuie sur un lien de base : impdp lit la source à distance et écrit directement dans la cible. REMAP_SCHEMA change le schéma de destination, ESTIMATE_ONLY chiffre le volume sans exporter.",
    topic: "Data Pump",
    difficulty: "medium",
  },
  {
    id: "ocp1-q45",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-6",
    question: "Où Data Pump écrit-il ses fichiers d'export ?",
    options: [
      "Dans le répertoire courant du client",
      "Dans le répertoire du serveur désigné par l'objet DIRECTORY",
      "Dans $ORACLE_HOME/dbs",
      "Dans la zone de récupération rapide",
    ],
    correctIndexes: [1],
    explanation:
      "Data Pump s'exécute côté serveur : c'est le processus serveur qui écrit, dans le répertoire désigné par le DIRECTORY. C'est la différence majeure avec l'ancien utilitaire exp, qui écrivait côté client.",
    topic: "Data Pump côté serveur",
    difficulty: "medium",
  },
  {
    id: "ocp1-q46",
    track: "ocp-dba-i",
    moduleId: "ocp1-session-6",
    question: "Comment se rattacher à un travail Data Pump interrompu pour le poursuivre ?",
    options: [
      "En relançant expdp à l'identique",
      "Avec le paramètre ATTACH suivi du nom du travail",
      "Avec le paramètre RESUME",
      "Ce n'est pas possible : il faut tout recommencer",
    ],
    correctIndexes: [1],
    explanation:
      "Les travaux Data Pump sont reprenables par conception. ATTACH=nom_du_job ouvre la console interactive, où CONTINUE_CLIENT relance, STATUS interroge, PARALLEL ajuste le parallélisme et KILL_JOB abandonne.",
    topic: "Travaux Data Pump",
    difficulty: "medium",
  },
];
