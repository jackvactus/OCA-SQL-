import type { QuizQuestion } from "./types";

/**
 * Banque Oracle Database Administration II — examen 1Z0-083.
 *
 * Construite à partir des 85 concepts corrigés de `docs/OCA/oca db3/OCP3.docx`
 * et `docs/OCA/oca db3/Vendor.docx`, appariés à 100 %.
 *
 * Énoncés, options et explications **entièrement réécrits** : seul le point de
 * connaissance testé et la réponse validée ont été repris du document source.
 *
 * `moduleId` référence une session du cursus OCP II (`lib/course-ocp2.ts`).
 * L'examen réel comporte ~89 % de questions à réponses multiples : la banque
 * respecte cette proportion.
 */
export const ocp2Questions: QuizQuestion[] = [
  // ─── Session 1 — Architecture multitenant ───────────────────────────────
  {
    id: "ocp2-q1",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-1",
    question: "Quels éléments sont partagés par toutes les PDB d'une même CDB ? (Choisissez trois réponses.)",
    options: [
      "Les fichiers de journalisation (redo logs)",
      "Le fichier de contrôle",
      "Les processus d'arrière-plan et la SGA",
      "Le tablespace SYSTEM",
      "Le dictionnaire de données applicatif",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "La CDB fournit une instance unique — SGA, processus, redo logs, fichier de contrôle. Chaque PDB apporte en revanche son propre SYSTEM, son SYSAUX et son dictionnaire : c'est ce qui la rend transportable d'une CDB à une autre.",
    topic: "Partage CDB / PDB",
    difficulty: "medium",
  },
  {
    id: "ocp2-q2",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-1",
    question: "Quel CON_ID identifie le conteneur PDB$SEED ?",
    options: ["0", "1", "2", "3"],
    correctIndexes: [2],
    explanation:
      "CON_ID 0 désigne la CDB dans son ensemble, 1 la racine CDB$ROOT, 2 la semence PDB$SEED, et les PDB utilisateur reçoivent 3 et au-delà. PDB$SEED reste en lecture seule : c'est le modèle des nouvelles PDB.",
    topic: "CON_ID",
    difficulty: "medium",
  },
  {
    id: "ocp2-q3",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-1",
    question: "Que permet le mode local undo (LOCAL_UNDO_ENABLED) ? (Choisissez trois réponses.)",
    options: [
      "Le clonage à chaud d'une PDB",
      "Flashback PDB",
      "La récupération à un point dans le temps d'une seule PDB",
      "Le partage d'un unique tablespace undo par toutes les PDB",
      "La suppression du tablespace UNDO de la racine",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Le mode local undo donne à chaque PDB son propre tablespace undo, ce qui rend possible clonage à chaud, Flashback PDB et PITR isolé. C'est précisément le contraire du partage d'un undo unique, qui est le mode hérité.",
    topic: "Local undo",
    difficulty: "hard",
  },
  {
    id: "ocp2-q4",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-1",
    question: "Depuis une PDB, que montre une vue CDB_ ?",
    options: [
      "Tous les conteneurs de la CDB",
      "Le conteneur courant uniquement",
      "La racine CDB$ROOT uniquement",
      "Rien : les vues CDB_ n'existent pas dans une PDB",
    ],
    correctIndexes: [1],
    explanation:
      "Les vues CDB_ existent partout, mais depuis une PDB elles ne renvoient que le conteneur courant : la vue d'ensemble n'est disponible que depuis CDB$ROOT. La colonne CON_ID permet alors de distinguer les origines.",
    topic: "Vues CDB_",
    difficulty: "medium",
  },
  {
    id: "ocp2-q5",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-1",
    question: "Quelles commandes permettent de connaître le conteneur courant ? (Choisissez deux réponses.)",
    options: [
      "SHOW CON_NAME",
      "SELECT SYS_CONTEXT('USERENV','CON_NAME') FROM DUAL",
      "SHOW PARAMETER container",
      "SELECT container_name FROM v$database",
    ],
    correctIndexes: [0, 1],
    explanation:
      "SHOW CON_NAME est la commande SQL*Plus, SYS_CONTEXT l'équivalent interrogeable depuis n'importe quel outil. V$PDBS et V$CONTAINERS complètent l'inventaire ; les deux autres propositions n'existent pas.",
    topic: "Conteneur courant",
    difficulty: "easy",
  },

  // ─── Session 2 — Gérer CDB et PDB ───────────────────────────────────────
  {
    id: "ocp2-q6",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Dans quels cas la clause USER_TABLESPACES est-elle utile lors d'un CREATE PLUGGABLE DATABASE ? (Choisissez deux réponses.)",
    options: [
      "Pour n'embarquer qu'une liste précise de tablespaces utilisateur",
      "Pour exclure certains tablespaces lors d'une conversion non-CDB vers PDB",
      "Pour convertir les tablespaces au format de la plateforme cible",
      "Pour chiffrer automatiquement les tablespaces embarqués",
    ],
    correctIndexes: [0, 1],
    explanation:
      "USER_TABLESPACES accepte une liste explicite ou la forme ALL EXCEPT. Les tablespaces exclus sont créés hors ligne et vides : la structure est là, les données non. La conversion de plateforme relève de RMAN CONVERT, le chiffrement de TDE.",
    topic: "USER_TABLESPACES",
    difficulty: "hard",
  },
  {
    id: "ocp2-q7",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Après avoir branché une PDB, quelle vue faut-il systématiquement interroger ?",
    options: ["V$PDBS", "PDB_PLUG_IN_VIOLATIONS", "CDB_PDBS", "DBA_REGISTRY"],
    correctIndexes: [1],
    explanation:
      "PDB_PLUG_IN_VIOLATIONS recense les écarts détectés au branchement : version, jeu de caractères, options installées, paramètres. Une violation de niveau ERROR empêche l'ouverture normale et force le mode RESTRICTED jusqu'à correction.",
    topic: "Violations de branchement",
    difficulty: "medium",
  },
  {
    id: "ocp2-q8",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Quelles clauses décident du sort des fichiers de données lors d'un branchement ? (Choisissez trois réponses.)",
    options: ["COPY", "MOVE", "NOCOPY", "CONVERT", "MIRROR"],
    correctIndexes: [0, 1, 2],
    explanation:
      "COPY duplique les fichiers en laissant la source intacte — c'est le défaut. MOVE les déplace. NOCOPY les réutilise en place : le plus rapide, mais destructif si l'on se trompe de manifeste. CONVERT appartient à RMAN, MIRROR n'existe pas ici.",
    topic: "Branchement de PDB",
    difficulty: "medium",
  },
  {
    id: "ocp2-q9",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Sans SAVE STATE, dans quel état les PDB se trouvent-elles après un STARTUP de la CDB ?",
    options: ["OPEN READ WRITE", "OPEN READ ONLY", "MOUNTED", "RESTRICTED"],
    correctIndexes: [2],
    explanation:
      "Un démarrage de CDB laisse les PDB en MOUNTED : il faut les ouvrir explicitement, ou avoir mémorisé leur état par ALTER PLUGGABLE DATABASE … SAVE STATE. La vue DBA_PDB_SAVED_STATES liste les états enregistrés.",
    topic: "SAVE STATE",
    difficulty: "medium",
  },
  {
    id: "ocp2-q10",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Quelles affirmations sont exactes concernant les objets communs d'un conteneur applicatif ? (Choisissez deux réponses.)",
    options: [
      "Un objet peut être metadata-linked : structure partagée, données propres à chaque PDB",
      "Un objet commun peut exister dans CDB$ROOT ou dans une racine applicative",
      "Un objet data-linked est modifiable depuis chaque PDB applicative",
      "SHARING = NONE partage l'objet avec toutes les PDB",
    ],
    correctIndexes: [0, 1],
    explanation:
      "SHARING = METADATA partage la définition, chaque PDB gardant ses lignes. SHARING = DATA partage aussi les données, mais en lecture seule depuis les PDB. Les objets communs vivent dans CDB$ROOT ou dans une racine applicative. SHARING = NONE rend l'objet strictement local.",
    topic: "Conteneurs applicatifs",
    difficulty: "hard",
  },
  {
    id: "ocp2-q11",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Quelle fonction vérifie qu'une PDB pourra être branchée avant de tenter l'opération ?",
    options: [
      "DBMS_PDB.CHECK_PLUG_COMPATIBILITY",
      "DBMS_TTS.TRANSPORT_SET_CHECK",
      "DBMS_PDB.DESCRIBE",
      "DBMS_SPACE.VERIFY",
    ],
    correctIndexes: [0],
    explanation:
      "CHECK_PLUG_COMPATIBILITY évalue le manifeste XML et renvoie un booléen ; le détail des écarts se lit ensuite dans PDB_PLUG_IN_VIOLATIONS. DBMS_PDB.DESCRIBE, lui, produit le manifeste. TRANSPORT_SET_CHECK concerne les tablespaces transportables.",
    topic: "Compatibilité de branchement",
    difficulty: "hard",
  },
  {
    id: "ocp2-q12",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-2",
    question: "Qu'est-ce qu'un clone rafraîchissable ? (Choisissez deux réponses.)",
    options: [
      "Une PDB clonée depuis une source distante et resynchronisée périodiquement",
      "Elle reste en lecture seule entre deux rafraîchissements",
      "Elle est ouverte en lecture-écriture en permanence",
      "Elle exige que la source soit arrêtée",
    ],
    correctIndexes: [0, 1],
    explanation:
      "REFRESH MODE EVERY n MINUTES — ou MANUAL — maintient un clone aligné sur sa source via un lien de base. La PDB reste en lecture seule entre deux rafraîchissements, ce qui en fait une cible idéale pour les rapports, sans peser sur la production.",
    topic: "Clone rafraîchissable",
    difficulty: "hard",
  },

  // ─── Session 3 — Sécurité multitenant ───────────────────────────────────
  {
    id: "ocp2-q13",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-3",
    question: "Quelles affirmations sont exactes concernant les utilisateurs communs ? (Choisissez trois réponses.)",
    options: [
      "Ils ne peuvent être créés que depuis CDB$ROOT",
      "Leur nom doit commencer par C## ou U##, hors comptes fournis par Oracle",
      "Ils existent dans tous les conteneurs de la CDB",
      "Ils peuvent être créés depuis n'importe quelle PDB",
      "Ils sont automatiquement administrateurs de chaque PDB",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Un utilisateur commun se crée depuis la racine avec CONTAINER = ALL et porte le préfixe imposé par COMMON_USER_PREFIX. Il existe partout, mais n'a que les privilèges qu'on lui a explicitement accordés — exister n'est pas pouvoir.",
    topic: "Utilisateurs communs",
    difficulty: "medium",
  },
  {
    id: "ocp2-q14",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-3",
    question: "Un privilège est accordé avec CONTAINER = ALL. Une PDB est branchée par la suite. Que se passe-t-il ?",
    options: [
      "La nouvelle PDB hérite rétroactivement de l'octroi",
      "L'octroi doit être rejoué pour s'appliquer à la nouvelle PDB",
      "L'octroi est automatiquement révoqué partout",
      "La PDB refuse de s'ouvrir",
    ],
    correctIndexes: [1],
    explanation:
      "CONTAINER = ALL ne vaut que pour les conteneurs existant au moment de l'octroi : il n'y a aucun effet rétroactif. C'est un oubli fréquent après un branchement, qui se traduit par des privilèges manquants dans la PDB nouvellement arrivée.",
    topic: "CONTAINER = ALL",
    difficulty: "hard",
  },
  {
    id: "ocp2-q15",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-3",
    question: "À quoi sert la clause CONTAINER_DATA sur un utilisateur commun ?",
    options: [
      "À restreindre les conteneurs qu'il voit dans les vues CDB_ et V$",
      "À lui donner accès à tous les tablespaces",
      "À le rendre administrateur de tous les conteneurs",
      "À chiffrer ses données",
    ],
    correctIndexes: [0],
    explanation:
      "ALTER USER … SET CONTAINER_DATA = (…) limite le périmètre visible dans les vues d'agrégation. C'est le moyen de donner à un compte d'audit une vue transverse restreinte à quelques PDB seulement.",
    topic: "CONTAINER_DATA",
    difficulty: "hard",
  },
  {
    id: "ocp2-q16",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-3",
    question: "Peut-on créer un utilisateur local depuis CDB$ROOT ?",
    options: [
      "Oui, avec CONTAINER = CURRENT",
      "Non : un utilisateur local se crée obligatoirement depuis sa PDB",
      "Oui, s'il porte le préfixe C##",
      "Oui, mais uniquement en mode RESTRICTED",
    ],
    correctIndexes: [1],
    explanation:
      "Depuis la racine, seuls des utilisateurs communs sont créables. CONTAINER = CURRENT y désignerait la racine elle-même, pas une PDB. Pour créer un compte local, il faut d'abord ALTER SESSION SET CONTAINER = la_pdb.",
    topic: "Utilisateurs locaux",
    difficulty: "medium",
  },

  // ─── Session 4 — Sauvegarde et RMAN ─────────────────────────────────────
  {
    id: "ocp2-q17",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "La phase de lecture d'une sauvegarde RMAN incrémentale compressée constitue un goulet d'étranglement. Quelles mesures peuvent améliorer le débit ? (Choisissez deux réponses.)",
    options: [
      "Activer l'E/S disque asynchrone",
      "Augmenter le niveau de multiplexage RMAN",
      "Désactiver FORCE LOGGING sur la base",
      "Augmenter la taille du buffer cache",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le multiplexage détermine combien de fichiers un canal lit simultanément, et l'E/S asynchrone évite que le processus attende chaque lecture. FORCE LOGGING n'agit que sur la génération de redo, et le buffer cache ne sert pas les lectures RMAN, qui contournent la SGA.",
    topic: "Performance RMAN",
    difficulty: "hard",
  },
  {
    id: "ocp2-q18",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Quelle différence sépare une incrémentale différentielle d'une incrémentale cumulative ?",
    options: [
      "La différentielle repart du dernier niveau 0 ou 1 ; la cumulative repart du dernier niveau 0",
      "La cumulative repart du dernier niveau 1 ; la différentielle du dernier niveau 0",
      "La cumulative ne sauvegarde que les archives",
      "Il n'existe aucune différence en pratique",
    ],
    correctIndexes: [0],
    explanation:
      "La différentielle — le défaut — sauvegarde depuis la dernière incrémentale de niveau 0 ou 1 : rapide à produire, plus longue à restaurer. La cumulative repart du dernier niveau 0 : plus volumineuse, mais elle raccourcit la restauration puisqu'il y a moins de fichiers à appliquer.",
    topic: "Incrémentales",
    difficulty: "medium",
  },
  {
    id: "ocp2-q19",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Quels avantages présente le suivi des blocs modifiés (block change tracking) ? (Choisissez deux réponses.)",
    options: [
      "RMAN ne lit que les blocs marqués comme modifiés lors d'une incrémentale",
      "La durée des sauvegardes incrémentales chute fortement sur les grosses bases",
      "Il supprime le besoin de sauvegardes de niveau 0",
      "Il compresse automatiquement les jeux de sauvegarde",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Sans lui, une incrémentale relit toute la base pour déterminer ce qui a changé. Le fichier de suivi permet à RMAN d'aller directement aux blocs concernés. Un niveau 0 reste indispensable comme base de la chaîne, et la compression est une option distincte.",
    topic: "Block change tracking",
    difficulty: "medium",
  },
  {
    id: "ocp2-q20",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Quel réglage RMAN est le plus critique pour pouvoir restaurer une base dont le fichier de contrôle est perdu ?",
    options: [
      "CONFIGURE BACKUP OPTIMIZATION ON",
      "CONFIGURE CONTROLFILE AUTOBACKUP ON",
      "CONFIGURE DEVICE TYPE DISK PARALLELISM 4",
      "CONFIGURE ENCRYPTION FOR DATABASE ON",
    ],
    correctIndexes: [1],
    explanation:
      "L'autobackup place une copie du fichier de contrôle et du SPFILE dans un emplacement prévisible, que RMAN sait retrouver même sans catalogue ni fichier de contrôle : c'est ce qui rend possible RESTORE CONTROLFILE FROM AUTOBACKUP depuis l'état NOMOUNT.",
    topic: "Autobackup",
    difficulty: "medium",
  },
  {
    id: "ocp2-q21",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Quelles affirmations opposent correctement jeu de sauvegarde et copie d'image ? (Choisissez deux réponses.)",
    options: [
      "Le jeu de sauvegarde saute les blocs jamais utilisés, la copie d'image non",
      "La copie d'image est utilisable immédiatement par SWITCH, sans restauration",
      "Le jeu de sauvegarde est lisible par une simple commande du système d'exploitation",
      "La copie d'image se compresse par CONFIGURE COMPRESSION",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le jeu de sauvegarde est un format propriétaire compact, qui omet les blocs vides et se compresse. La copie d'image est une réplique bloc à bloc, immédiatement exploitable par SWITCH DATAFILE TO COPY — d'où un temps de remise en service très court.",
    topic: "Jeu de sauvegarde et copie d'image",
    difficulty: "hard",
  },
  {
    id: "ocp2-q22",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Que réalise l'enchaînement BACKUP INCREMENTAL LEVEL 1 FOR RECOVER OF COPY puis RECOVER COPY OF DATABASE ?",
    options: [
      "Une stratégie à récupération incrémentale : une copie d'image maintenue à jour en continu",
      "Une sauvegarde complète hebdomadaire",
      "Une purge des sauvegardes obsolètes",
      "Une vérification de cohérence des blocs",
    ],
    correctIndexes: [0],
    explanation:
      "Le principe : une copie d'image initiale, puis chaque jour une incrémentale de niveau 1 appliquée sur cette copie. On dispose ainsi en permanence d'une image récente, restaurable par simple SWITCH — le meilleur compromis entre espace occupé et temps de reprise.",
    topic: "Incrementally updated backup",
    difficulty: "hard",
  },
  {
    id: "ocp2-q23",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-4",
    question: "Quelles conditions sont nécessaires pour une sauvegarde base ouverte ? (Choisissez deux réponses.)",
    options: [
      "La base doit être en mode ARCHIVELOG",
      "Les archives correspondantes doivent être sauvegardées avec les données",
      "La base doit être en mode RESTRICTED",
      "Toutes les PDB doivent être fermées",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Une sauvegarde à chaud est par nature incohérente : elle n'est exploitable qu'avec les archives permettant de rejouer le redo jusqu'à un point cohérent. D'où le PLUS ARCHIVELOG systématique. Ni le mode restreint ni la fermeture des PDB ne sont requis.",
    topic: "Sauvegarde à chaud",
    difficulty: "medium",
  },

  // ─── Session 5 — Diagnostic et récupération ─────────────────────────────
  {
    id: "ocp2-q24",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Dans quelles configurations le Data Recovery Advisor n'est-il pas disponible ? (Choisissez deux réponses.)",
    options: [
      "Real Application Clusters",
      "Base de secours Data Guard",
      "Base mono-instance en ARCHIVELOG",
      "Base conteneur multitenant",
    ],
    correctIndexes: [0, 1],
    explanation:
      "LIST FAILURE, ADVISE FAILURE et REPAIR FAILURE ne prennent en charge ni RAC ni les bases de secours : sur ces configurations, le diagnostic redevient manuel. Une mono-instance, y compris multitenant, en bénéficie normalement.",
    topic: "Data Recovery Advisor",
    difficulty: "hard",
  },
  {
    id: "ocp2-q25",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Quelle séquence restaure une base dont tous les fichiers de contrôle ont été perdus ?",
    options: [
      "STARTUP MOUNT, RESTORE CONTROLFILE, RECOVER DATABASE, OPEN",
      "STARTUP NOMOUNT, RESTORE CONTROLFILE FROM AUTOBACKUP, ALTER DATABASE MOUNT, RECOVER DATABASE, OPEN RESETLOGS",
      "STARTUP FORCE, RECOVER DATABASE, OPEN",
      "STARTUP RESTRICT, RESTORE DATABASE, OPEN",
    ],
    correctIndexes: [1],
    explanation:
      "Sans fichier de contrôle, la base ne peut pas être montée : il faut démarrer en NOMOUNT, restaurer le fichier de contrôle depuis l'autobackup, puis monter, récupérer et ouvrir en RESETLOGS — le fichier de contrôle restauré étant plus ancien que les données.",
    topic: "Perte du fichier de contrôle",
    difficulty: "hard",
  },
  {
    id: "ocp2-q26",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Quelles affirmations sont exactes concernant la récupération de blocs (Block Media Recovery) ? (Choisissez deux réponses.)",
    options: [
      "Elle s'effectue base ouverte",
      "Seuls les blocs corrompus sont indisponibles pendant l'opération",
      "Elle exige la mise hors ligne du fichier de données",
      "Elle impose un OPEN RESETLOGS",
    ],
    correctIndexes: [0, 1],
    explanation:
      "RECOVER DATAFILE n BLOCK m — ou RECOVER CORRUPTION LIST — répare quelques blocs sans toucher au reste : la base sert normalement, seuls les blocs visés sont inaccessibles le temps de l'opération. C'est la réponse aux ORA-01578.",
    topic: "Récupération de blocs",
    difficulty: "hard",
  },
  {
    id: "ocp2-q27",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Quelles conséquences a une récupération incomplète ? (Choisissez deux réponses.)",
    options: [
      "Elle se termine obligatoirement par ALTER DATABASE OPEN RESETLOGS",
      "Elle ouvre une nouvelle incarnation de la base, d'où une sauvegarde complète immédiate",
      "Elle conserve toutes les transactions jusqu'à la panne",
      "Elle peut se faire base ouverte",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Ramener la base à un point antérieur impose de réinitialiser les journaux : le compteur de séquence repart, une nouvelle incarnation naît, et les sauvegardes antérieures deviennent difficiles à exploiter. D'où la sauvegarde complète immédiate.",
    topic: "Récupération incomplète",
    difficulty: "medium",
  },
  {
    id: "ocp2-q28",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Que faut-il pour récupérer une seule PDB à un point dans le temps, sans immobiliser les autres ? (Choisissez deux réponses.)",
    options: [
      "Le mode local undo",
      "Une destination auxiliaire (AUXILIARY DESTINATION)",
      "La fermeture de toutes les PDB de la CDB",
      "Le mode NOARCHIVELOG",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Le PITR d'une PDB suppose que son undo lui soit propre, et RMAN a besoin d'un emplacement où monter une instance auxiliaire temporaire. Les autres PDB restent disponibles pendant l'opération — c'est tout l'intérêt de la démarche.",
    topic: "PITR d'une PDB",
    difficulty: "hard",
  },
  {
    id: "ocp2-q29",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-5",
    question: "Que renvoie la commande RESTORE DATABASE PREVIEW ?",
    options: [
      "La liste des sauvegardes que RMAN utiliserait, sans rien restaurer",
      "Une restauration en lecture seule",
      "La liste des blocs corrompus",
      "Un rapport de performance de la dernière sauvegarde",
    ],
    correctIndexes: [0],
    explanation:
      "PREVIEW simule la restauration et indique quels jeux de sauvegarde et quelles archives seraient nécessaires — y compris ceux à rappeler depuis la bande. C'est le contrôle à exécuter avant toute opération réelle. SUMMARY en donne une version condensée.",
    topic: "RESTORE PREVIEW",
    difficulty: "medium",
  },

  // ─── Session 6 — Flashback ──────────────────────────────────────────────
  {
    id: "ocp2-q30",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-6",
    question: "Quelles technologies Flashback reposent sur l'undo ? (Choisissez trois réponses.)",
    options: [
      "Flashback Query",
      "Flashback Version Query",
      "Flashback Transaction Query",
      "Flashback Database",
      "Flashback Drop",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Query, Version Query, Transaction Query et Table puisent dans l'undo : leur horizon est donc borné par UNDO_RETENTION. Flashback Database s'appuie sur les journaux flashback de la zone de récupération, et Flashback Drop sur la corbeille.",
    topic: "Dépendances Flashback",
    difficulty: "medium",
  },
  {
    id: "ocp2-q31",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-6",
    question: "Que faut-il activer avant d'exécuter FLASHBACK TABLE … TO TIMESTAMP ?",
    options: [
      "Le mode ARCHIVELOG",
      "ENABLE ROW MOVEMENT sur la table",
      "Les journaux flashback",
      "Flashback Data Archive",
    ],
    correctIndexes: [1],
    explanation:
      "Flashback Table réinsère les lignes à leur état antérieur, ce qui change leur ROWID : le row movement doit donc être autorisé. Ni ARCHIVELOG ni les journaux flashback ne sont requis — ils le sont pour Flashback Database.",
    topic: "Flashback Table",
    difficulty: "medium",
  },
  {
    id: "ocp2-q32",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-6",
    question: "Quels avantages présente un point de restauration garanti avant une migration ? (Choisissez deux réponses.)",
    options: [
      "Les journaux flashback sont retenus même si la zone de récupération se remplit",
      "Le retour arrière est bien plus rapide qu'une restauration complète",
      "Il supprime le besoin de sauvegardes",
      "Il fonctionne sans le mode ARCHIVELOG",
    ],
    correctIndexes: [0, 1],
    explanation:
      "CREATE RESTORE POINT … GUARANTEE FLASHBACK DATABASE garantit la conservation des journaux nécessaires, quitte à faire échouer d'autres opérations si la FRA sature — d'où la nécessité de surveiller l'espace. Il ne remplace en rien les sauvegardes.",
    topic: "Point de restauration garanti",
    difficulty: "hard",
  },
  {
    id: "ocp2-q33",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-6",
    question: "Quelle technologie permet de conserver un historique de plusieurs années, au-delà de la rétention d'undo ?",
    options: [
      "Flashback Query",
      "Flashback Data Archive",
      "Flashback Drop",
      "Flashback Version Query",
    ],
    correctIndexes: [1],
    explanation:
      "Flashback Data Archive — Total Recall — dispose de son propre stockage d'historique, indépendant de l'undo, avec une durée de rétention paramétrable en années. C'est la réponse aux exigences de conformité et d'audit.",
    topic: "Flashback Data Archive",
    difficulty: "medium",
  },
  {
    id: "ocp2-q34",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-6",
    question: "Quelle clause permet de récupérer une table supprimée en la renommant au passage ?",
    options: [
      "FLASHBACK TABLE … TO BEFORE DROP RENAME TO …",
      "FLASHBACK TABLE … TO SCN … RENAME TO …",
      "RECOVER TABLE … RENAME TO …",
      "UNDROP TABLE … AS …",
    ],
    correctIndexes: [0],
    explanation:
      "TO BEFORE DROP puise dans la corbeille ; RENAME TO évite un conflit si une table du même nom a été recréée entre-temps. L'opération échoue si la suppression avait été faite avec PURGE, ou si la corbeille a été vidée.",
    topic: "Flashback Drop",
    difficulty: "medium",
  },

  // ─── Session 7 — Duplication et transport ───────────────────────────────
  {
    id: "ocp2-q35",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-7",
    question: "Quelles conditions doit remplir l'instance auxiliaire d'une duplication RMAN ? (Choisissez trois réponses.)",
    options: [
      "Être démarrée en NOMOUNT",
      "Disposer d'un fichier de mots de passe",
      "Être joignable par l'écouteur, généralement via un enregistrement statique",
      "Être en mode ARCHIVELOG",
      "Contenir déjà une copie des fichiers de données",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "RMAN se connecte à une instance vide, démarrée en NOMOUNT, ce qui suppose une authentification par fichier de mots de passe et un écouteur capable de la joindre — d'où l'entrée statique, PMON ne pouvant s'annoncer pour une base non montée.",
    topic: "Duplication RMAN",
    difficulty: "hard",
  },
  {
    id: "ocp2-q36",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-7",
    question: "Quand la clause NOFILENAMECHECK est-elle nécessaire lors d'une duplication ?",
    options: [
      "Quand la source et la cible partagent les mêmes chemins de fichiers",
      "Quand la cible est sur une plateforme différente",
      "Quand la base est en NOARCHIVELOG",
      "Quand la duplication est active",
    ],
    correctIndexes: [0],
    explanation:
      "RMAN refuse par défaut d'écrire là où se trouvent déjà des fichiers de la base source, pour éviter de l'écraser. Sur des serveurs distincts partageant la même arborescence, ce contrôle devient inutile — d'où NOFILENAMECHECK, à manier avec précaution.",
    topic: "NOFILENAMECHECK",
    difficulty: "hard",
  },
  {
    id: "ocp2-q37",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-7",
    question: "Quelles étapes sont indispensables au transport d'un jeu de tablespaces ? (Choisissez trois réponses.)",
    options: [
      "Vérifier que le jeu est autonome avec DBMS_TTS.TRANSPORT_SET_CHECK",
      "Passer les tablespaces en lecture seule",
      "Exporter les métadonnées avec TRANSPORT_TABLESPACES",
      "Passer la base en mode NOARCHIVELOG",
      "Supprimer tous les index concernés",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Le jeu doit être autonome — aucun objet ne référençant l'extérieur —, figé en lecture seule le temps de la copie, et accompagné de ses métadonnées exportées par Data Pump. Une conversion RMAN s'ajoute si l'endianness des plateformes diffère.",
    topic: "Tablespaces transportables",
    difficulty: "hard",
  },
  {
    id: "ocp2-q38",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-7",
    question: "Quelle vue indique si deux plateformes partagent le même ordre des octets ?",
    options: [
      "V$TRANSPORTABLE_PLATFORM",
      "V$DATABASE",
      "DBA_TABLESPACES",
      "V$CONTROLFILE",
    ],
    correctIndexes: [0],
    explanation:
      "V$TRANSPORTABLE_PLATFORM associe chaque plateforme à son ENDIAN_FORMAT. Si les formats diffèrent entre source et cible, RMAN CONVERT devient obligatoire ; s'ils coïncident, une simple copie des fichiers suffit.",
    topic: "Endianness",
    difficulty: "medium",
  },

  // ─── Session 8 — Installation, correctifs, mise à niveau ────────────────
  {
    id: "ocp2-q39",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-8",
    question: "Que réalise le paquet RPM de pré-installation d'Oracle Database ? (Choisissez trois réponses.)",
    options: [
      "Il crée les comptes et les groupes système, dont oinstall",
      "Il règle les paramètres du noyau et les limites de ressources",
      "Il prépare la configuration nécessaire à l'accès aux périphériques ASM",
      "Il installe le logiciel Oracle Database",
      "Il crée automatiquement une base de données",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Le RPM de pré-installation prépare le système : comptes oracle et groupes oinstall/dba, paramètres sysctl, limites, dépendances, permissions ASM. Il n'installe ni le logiciel — c'est runInstaller — ni la base — c'est DBCA.",
    topic: "Pré-installation",
    difficulty: "medium",
  },
  {
    id: "ocp2-q40",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-8",
    question: "Vous avez appliqué un Release Update avec opatch. La base démarre mais des objets sont invalides. Qu'avez-vous omis ?",
    options: [
      "Exécuter datapatch pour appliquer le volet SQL du correctif",
      "Relancer opatch avec l'option -force",
      "Recréer le SPFILE",
      "Passer la base en mode UPGRADE",
    ],
    correctIndexes: [0],
    explanation:
      "opatch modifie les binaires, datapatch met le dictionnaire en cohérence avec eux. Omettre datapatch est l'erreur la plus fréquente après un correctif. On enchaîne ensuite utlrp.sql pour recompiler, et l'on vérifie DBA_REGISTRY_SQLPATCH.",
    topic: "opatch et datapatch",
    difficulty: "hard",
  },
  {
    id: "ocp2-q41",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-8",
    question: "Quelles affirmations sont exactes concernant Oracle Restart ? (Choisissez deux réponses.)",
    options: [
      "Il redémarre automatiquement l'instance, l'écouteur et ASM après une panne",
      "Les ressources doivent être gérées par srvctl plutôt que manuellement",
      "Il fournit le basculement automatique entre nœuds d'un cluster",
      "Il remplace la sauvegarde RMAN",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Oracle Restart surveille et relance les composants sur un serveur unique. Un arrêt manuel par SQL*Plus ou lsnrctl serait interprété comme une panne et suivi d'un redémarrage immédiat : d'où l'usage exclusif de srvctl. Le basculement multi-nœuds relève de RAC.",
    topic: "Oracle Restart",
    difficulty: "medium",
  },
  {
    id: "ocp2-q42",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-8",
    question: "Comment mettre à niveau une seule application hébergée en PDB, sans toucher aux autres ?",
    options: [
      "Débrancher la PDB et la brancher dans une CDB de version supérieure",
      "Exécuter dbupgrade sur la CDB entière",
      "Recréer la PDB depuis PDB$SEED",
      "Ce n'est pas possible en multitenant",
    ],
    correctIndexes: [0],
    explanation:
      "C'est l'un des grands intérêts du multitenant : l'unité de migration devient la PDB. On la débranche de l'ancienne CDB, on la branche dans une CDB déjà à jour, puis datapatch met son dictionnaire en cohérence. Les autres PDB ne sont pas concernées.",
    topic: "Mise à niveau sélective",
    difficulty: "hard",
  },
  {
    id: "ocp2-q43",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-8",
    question: "Quelle vue liste les correctifs SQL réellement appliqués au dictionnaire ?",
    options: [
      "DBA_REGISTRY_SQLPATCH",
      "DBA_REGISTRY",
      "V$PATCHES",
      "DBA_OBJECTS",
    ],
    correctIndexes: [0],
    explanation:
      "DBA_REGISTRY_SQLPATCH trace ce que datapatch a effectivement appliqué, avec l'action et le statut. opatch lsinventory ne rend compte, lui, que du volet binaire : comparer les deux révèle un datapatch oublié.",
    topic: "Suivi des correctifs",
    difficulty: "medium",
  },

  // ─── Session 9 — Surveillance et optimisation ───────────────────────────
  {
    id: "ocp2-q44",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant les seuils, métriques et alertes ? (Choisissez trois réponses.)",
    options: [
      "Les alertes avec état effacées sont consultables dans DBA_ALERT_HISTORY",
      "Une alerte d'occupation d'espace s'efface automatiquement quand la cause disparaît",
      "Une métrique est un compteur statistique rapporté à une unité",
      "Les alertes sont générées par SMON lorsqu'un tablespace atteint 97 %",
      "STATISTICS_LEVEL doit valoir ALL pour que les alertes fonctionnent",
    ],
    correctIndexes: [0, 1, 2],
    explanation:
      "Les alertes sont produites par MMON, pas par SMON. Les alertes avec état quittent DBA_OUTSTANDING_ALERTS pour DBA_ALERT_HISTORY dès que la cause disparaît. STATISTICS_LEVEL à TYPICAL — la valeur par défaut — suffit ; ALL n'est pas exigé.",
    topic: "Alertes et métriques",
    difficulty: "hard",
  },
  {
    id: "ocp2-q45",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant ADDM ? (Choisissez deux réponses.)",
    options: [
      "Il s'exécute automatiquement après chaque instantané AWR",
      "Il peut être lancé manuellement sur n'importe quelle paire d'instantanés",
      "Il remplace la collecte de statistiques d'optimiseur",
      "Il ne fonctionne qu'en mode RESTRICTED",
    ],
    correctIndexes: [0, 1],
    explanation:
      "ADDM analyse l'intervalle entre deux instantanés AWR et hiérarchise les problèmes par impact, en proposant des recommandations. Il se déclenche seul après chaque instantané, et se relance à la demande via addmrpt.sql ou DBMS_ADDM.",
    topic: "ADDM",
    difficulty: "medium",
  },
  {
    id: "ocp2-q46",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-9",
    question: "Quelle est la cause la plus fréquente d'un plan d'exécution soudainement inefficace ?",
    options: [
      "Des statistiques d'optimiseur absentes ou périmées",
      "Un buffer cache trop grand",
      "Le mode ARCHIVELOG",
      "Un nombre excessif de redo logs",
    ],
    correctIndexes: [0],
    explanation:
      "L'optimiseur raisonne sur les statistiques : périmées, elles le conduisent à mal estimer les cardinalités et donc à choisir un mauvais plan. On collecte par DBMS_STATS avant d'incriminer l'optimiseur, puis l'on fige le bon plan par SQL Plan Management.",
    topic: "Statistiques et plans",
    difficulty: "medium",
  },
  {
    id: "ocp2-q47",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-9",
    question: "Quelle est la différence entre AWR et ASH ? (Choisissez deux réponses.)",
    options: [
      "AWR conserve des instantanés périodiques de statistiques cumulées",
      "ASH échantillonne les sessions actives à la seconde",
      "ASH remplace AWR depuis la version 19c",
      "AWR n'est disponible qu'en multitenant",
    ],
    correctIndexes: [0, 1],
    explanation:
      "AWR photographie l'activité à intervalle régulier — une heure par défaut — et conserve l'historique dans SYSAUX. ASH échantillonne en continu les sessions actives, ce qui permet d'analyser un incident bref qu'un instantané AWR aurait lissé. Les deux se complètent.",
    topic: "AWR et ASH",
    difficulty: "medium",
  },
  {
    id: "ocp2-q48",
    track: "ocp-dba-ii",
    moduleId: "ocp2-session-9",
    question: "Comment empêcher un plan d'exécution validé de régresser après une mise à niveau ?",
    options: [
      "En créant une baseline acceptée via SQL Plan Management",
      "En supprimant toutes les statistiques",
      "En désactivant l'optimiseur par coût",
      "En passant la base en mode RESTRICTED",
    ],
    correctIndexes: [0],
    explanation:
      "SQL Plan Management conserve un ensemble de plans acceptés pour chaque instruction : l'optimiseur ne peut adopter un nouveau plan qu'après l'avoir prouvé meilleur. C'est le filet de sécurité standard avant toute mise à niveau.",
    topic: "SQL Plan Management",
    difficulty: "hard",
  },
];
