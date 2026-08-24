import type { QuizQuestion } from "./types";

/**
 * Complément de la banque 1Z0-083 — couvre les concepts corrigés de
 * `docs/OCA/oca db3/OCP3.docx` + `Vendor.docx` non traités dans
 * `lib/quiz-data-ocp2.ts`. Une question par concept distinct.
 */
export const ocp2QuestionsB: QuizQuestion[] = [
  // ─── Surveillance et diagnostic ─────────────────────────────────────────
  {
    id: "ocp2-q50", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles vues servent au suivi des événements d'attente ? (Choisissez trois réponses.)",
    options: ["V$SESSION_EVENT", "V$SERVICE_EVENT", "V$SESSION_WAIT", "V$CONTROLFILE", "V$LOGFILE"],
    correctIndexes: [0, 1, 2],
    explanation: "V$SESSION_EVENT cumule les attentes d'une session depuis sa connexion, V$SESSION_WAIT donne l'attente en cours, V$SERVICE_EVENT agrège par service. Les deux dernières vues décrivent des fichiers, sans rapport avec les attentes.",
    topic: "Vues d'attente", difficulty: "medium",
  },
  {
    id: "ocp2-q51", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant les alertes sans état (stateless) ? (Choisissez deux réponses.)",
    options: ["Elles peuvent être effacées manuellement", "Elles peuvent être effacées automatiquement après un délai", "Elles disparaissent dès que leur cause cesse", "Elles n'apparaissent jamais dans DBA_ALERT_HISTORY"],
    correctIndexes: [0, 1],
    explanation: "Une alerte sans état décrit un événement ponctuel — reprise de journal, corruption — qui n'a pas de « cause persistante » à disparaître. Elle rejoint directement l'historique et s'y purge manuellement ou selon la politique de rétention.",
    topic: "Alertes sans état", difficulty: "hard",
  },
  {
    id: "ocp2-q52", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Un excès de hard parse est constaté. Quel conseiller consulter en priorité ?",
    options: ["Le Memory Advisor pour le shared pool", "Le Segment Advisor", "Le Undo Advisor", "Le SQL Access Advisor"],
    correctIndexes: [0],
    explanation: "Un hard parse excessif traduit un shared pool trop petit — ou des instructions non partageables faute de variables de liaison. Le Memory Advisor chiffre le gain attendu d'un shared pool agrandi.",
    topic: "Memory Advisor", difficulty: "hard",
  },
  {
    id: "ocp2-q53", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant le Statistics Advisor ? (Choisissez trois réponses.)",
    options: ["Il fait partie du paquetage DBMS_ADVISOR", "Il formule des recommandations sur la collecte de statistiques", "Il s'exécute automatiquement chaque nuit", "Il remplace DBMS_STATS", "Il ne fonctionne qu'en multitenant"],
    correctIndexes: [0, 1, 2],
    explanation: "Introduit en 12.2, le Statistics Advisor analyse la façon dont les statistiques sont collectées et signale les écarts aux bonnes pratiques. Il tourne dans la fenêtre de maintenance nocturne, mais ne collecte rien lui-même : c'est toujours DBMS_STATS qui agit.",
    topic: "Statistics Advisor", difficulty: "hard",
  },
  {
    id: "ocp2-q54", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant SQL Performance Analyzer ? (Choisissez deux réponses.)",
    options: ["Il prédit l'impact d'un changement sur un jeu d'instructions capturé", "Il fournit une comparaison avant/après, instruction par instruction", "Il applique automatiquement les corrections", "Il remplace les baselines de SQL Plan Management"],
    correctIndexes: [0, 1],
    explanation: "SPA rejoue un SQL Tuning Set avant puis après un changement — mise à niveau, paramètre, statistiques — et classe les instructions par régression ou amélioration. Il constate ; c'est à l'administrateur de décider, éventuellement en figeant un plan par baseline.",
    topic: "SQL Performance Analyzer", difficulty: "hard",
  },
  {
    id: "ocp2-q55", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant la démarche d'optimisation guidée par le modèle de temps Oracle ? (Choisissez deux réponses.)",
    options: ["Le modèle de temps aide à identifier les axes de réglage les plus rentables", "L'optimisation doit s'arrêter lorsque les niveaux de service sont atteints", "Il faut poursuivre l'optimisation jusqu'à saturation du processeur", "Le modèle de temps remplace AWR"],
    correctIndexes: [0, 1],
    explanation: "Le Time Model décompose le temps passé par la base et désigne le poste dominant. La règle d'arrêt est contractuelle : une fois les SLA tenus, poursuivre coûte plus qu'il ne rapporte.",
    topic: "Modèle de temps", difficulty: "medium",
  },
  {
    id: "ocp2-q56", track: "ocp-dba-ii", moduleId: "ocp2-session-9",
    question: "Quelles affirmations sont exactes concernant la collecte de statistiques en multitenant ? (Choisissez deux réponses.)",
    options: ["Depuis CDB$ROOT, la collecte couvre toutes les PDB ouvertes, hors PDB$SEED", "Depuis une PDB ouverte en lecture-écriture, la collecte ne couvre que cette PDB", "PDB$SEED est toujours incluse", "La collecte n'est possible que depuis la racine"],
    correctIndexes: [0, 1],
    explanation: "DBMS_STATS agit dans le périmètre du conteneur courant. Lancé depuis la racine, il parcourt les PDB ouvertes — la semence, en lecture seule, est exclue. Lancé depuis une PDB, il reste local.",
    topic: "Statistiques et conteneurs", difficulty: "hard",
  },

  // ─── Multitenant ────────────────────────────────────────────────────────
  {
    id: "ocp2-q57", track: "ocp-dba-ii", moduleId: "ocp2-session-1",
    question: "LOCAL_UNDO_ENABLED passe à FALSE. Quelles conséquences ? (Choisissez deux réponses.)",
    options: ["Les PDB, nouvelles comme existantes, utilisent l'undo de CDB$ROOT", "Les PDB déjà ouvertes doivent être refermées puis rouvertes pour appliquer le changement", "Chaque PDB conserve son tablespace d'undo", "Le changement est immédiat, sans réouverture"],
    correctIndexes: [0, 1],
    explanation: "Le mode d'undo est une propriété de la CDB, modifiable en mode UPGRADE. Repasser en undo partagé renvoie toutes les PDB vers l'undo de la racine, et chacune doit être rouverte pour en tenir compte — au prix de la perte du PITR isolé et du clonage à chaud.",
    topic: "Bascule du mode undo", difficulty: "hard",
  },
  {
    id: "ocp2-q58", track: "ocp-dba-ii", moduleId: "ocp2-session-2",
    question: "Quelles affirmations sont exactes concernant le manifeste XML produit par un débranchement ? (Choisissez deux réponses.)",
    options: ["Sa compatibilité doit être vérifiée par DBMS_PDB.CHECK_PLUG_COMPATIBILITY", "Il ne contient pas nécessairement l'emplacement actuel des fichiers de données", "Il contient une copie des données de la PDB", "Il rend les fichiers de données inutiles"],
    correctIndexes: [0, 1],
    explanation: "Le manifeste ne décrit que les métadonnées : version, jeu de caractères, options, liste des fichiers. Si ceux-ci ont été déplacés depuis, les chemins qu'il porte sont périmés — d'où les clauses SOURCE_FILE_NAME_CONVERT et FILE_NAME_CONVERT au branchement.",
    topic: "Manifeste de débranchement", difficulty: "hard",
  },
  {
    id: "ocp2-q59", track: "ocp-dba-ii", moduleId: "ocp2-session-2",
    question: "Quelles affirmations sont exactes concernant la gestion du parallélisme entre PDB ? (Choisissez deux réponses.)",
    options: ["Une PDB sans limite peut mobiliser tous les processus parallèles de la CDB", "Une part minimale peut être garantie à une PDB par le Resource Manager", "Le parallélisme est réparti à parts égales d'office", "Le parallélisme est désactivé en multitenant"],
    correctIndexes: [0, 1],
    explanation: "Sans plan de ressources, une PDB gourmande peut consommer tout le parallélisme et affamer les autres. Le CDB Resource Plan attribue des parts et des limites — c'est l'outil d'isolation des performances entre locataires.",
    topic: "Resource Manager en CDB", difficulty: "hard",
  },
  {
    id: "ocp2-q60", track: "ocp-dba-ii", moduleId: "ocp2-session-5",
    question: "Un fichier de données de PDB2 doit être restauré. Quelles conditions permettent l'opération ? (Choisissez deux réponses.)",
    options: ["La CDB peut rester ouverte", "PDB2 doit être fermée", "Toutes les PDB doivent être fermées", "La CDB doit être en NOMOUNT"],
    correctIndexes: [0, 1],
    explanation: "C'est l'atout du multitenant pour l'exploitation : seule la PDB concernée s'arrête, la CDB et les autres locataires continuent de servir. Un fichier critique de la racine imposerait, lui, un arrêt complet.",
    topic: "Restauration d'une PDB", difficulty: "hard",
  },

  // ─── Sauvegarde et récupération ─────────────────────────────────────────
  {
    id: "ocp2-q61", track: "ocp-dba-ii", moduleId: "ocp2-session-4",
    question: "Quelles affirmations sont exactes concernant le duplexage d'un jeu de sauvegarde ? (Choisissez deux réponses.)",
    options: ["Un jeu écrit sur disque peut être duplexé vers un autre emplacement disque", "Un jeu peut être duplexé de disque vers bande", "Le duplexage s'applique aux copies d'image", "Le duplexage double le temps de lecture de la source"],
    correctIndexes: [0, 1],
    explanation: "BACKUP COPIES ou CONFIGURE DATAFILE BACKUP COPIES produit plusieurs exemplaires en une seule lecture de la source — d'où un coût bien inférieur à deux sauvegardes successives. Le duplexage ne concerne que les jeux de sauvegarde, pas les copies d'image.",
    topic: "Duplexage", difficulty: "hard",
  },
  {
    id: "ocp2-q62", track: "ocp-dba-ii", moduleId: "ocp2-session-4",
    question: "Quelles affirmations sont exactes concernant BACKUP RECOVERY FILES ? (Choisissez deux réponses.)",
    options: ["Elle sauvegarde les fichiers de récupération de la FRA non encore sauvegardés", "La destination peut être le disque ou une unité SBT", "Elle supprime le contenu de la FRA", "Elle ne concerne que les fichiers de contrôle"],
    correctIndexes: [0, 1],
    explanation: "La commande balaie la zone de récupération rapide et sauvegarde ce qui ne l'est pas encore : archives, copies, jeux de sauvegarde. C'est la manière courante d'externaliser la FRA vers la bande avant d'en purger le contenu obsolète.",
    topic: "BACKUP RECOVERY FILES", difficulty: "hard",
  },
  {
    id: "ocp2-q63", track: "ocp-dba-ii", moduleId: "ocp2-session-4",
    question: "Quelles affirmations sont exactes concernant la configuration RMAN et la zone de récupération rapide ? (Choisissez trois réponses.)",
    options: ["La configuration RMAN persistante est stockée dans le fichier de contrôle", "Les sauvegardes devenues obsolètes dans la FRA sont supprimées automatiquement quand l'espace manque", "Une politique de rétention doit être définie pour que la notion d'obsolescence ait un sens", "La FRA supprime les sauvegardes dès qu'elles sont obsolètes, sans attendre", "La configuration RMAN est stockée dans le SPFILE"],
    correctIndexes: [0, 1, 2],
    explanation: "La configuration vit dans le fichier de contrôle — d'où l'importance de son autobackup. La FRA ne purge pas de façon proactive : elle attend la pression sur l'espace, puis supprime en priorité ce que la politique de rétention désigne comme obsolète.",
    topic: "FRA et rétention", difficulty: "hard",
  },
  {
    id: "ocp2-q64", track: "ocp-dba-ii", moduleId: "ocp2-session-6",
    question: "Quand les journaux flashback sont-ils supprimés ?",
    options: ["Après expiration de la fenêtre de rétention, de façon proactive et avant toute pression sur l'espace", "Uniquement quand la zone de récupération est pleine", "À chaque redémarrage de l'instance", "Jamais, sauf suppression manuelle"],
    correctIndexes: [0],
    explanation: "Contrairement aux sauvegardes obsolètes, les journaux flashback dépassant DB_FLASHBACK_RETENTION_TARGET sont supprimés sans attendre la saturation. Seul un point de restauration garanti empêche cette purge — d'où le risque de remplir la FRA si on l'oublie.",
    topic: "Purge des journaux flashback", difficulty: "hard",
  },
  {
    id: "ocp2-q65", track: "ocp-dba-ii", moduleId: "ocp2-session-5",
    question: "Que révèlent les temps rapportés par la commande VALIDATE de RMAN ? (Choisissez deux réponses.)",
    options: ["Ils identifient si le goulet d'étranglement se situe en lecture ou en écriture", "Une valeur SHORT_WAITS élevée suggère un problème d'E/S asynchrone", "Ils mesurent le taux de compression", "Ils indiquent le nombre de blocs corrompus uniquement"],
    correctIndexes: [0, 1],
    explanation: "V$BACKUP_ASYNC_IO et V$BACKUP_SYNC_IO décomposent le temps entre lecture, validation et écriture. Un nombre élevé d'attentes courtes signale que l'E/S asynchrone ne fonctionne pas comme prévu et que le processus tourne à vide.",
    topic: "Diagnostic RMAN", difficulty: "hard",
  },

  // ─── Transport et duplication ───────────────────────────────────────────
  {
    id: "ocp2-q66", track: "ocp-dba-ii", moduleId: "ocp2-session-7",
    question: "Quelles affirmations sont exactes concernant RMAN CONVERT lors d'un transport entre plateformes ? (Choisissez trois réponses.)",
    options: ["La conversion peut être exécutée sur la plateforme source", "La conversion peut être exécutée sur la plateforme de destination", "Elle est nécessaire lorsque les deux plateformes n'ont pas le même ordre des octets", "Elle est nécessaire même entre plateformes de même endianness", "Elle convertit aussi le jeu de caractères"],
    correctIndexes: [0, 1, 2],
    explanation: "CONVERT s'exécute d'un côté ou de l'autre, au choix — souvent sur la machine la moins chargée. Elle n'a d'objet qu'en cas d'endianness différente ; sinon la copie brute suffit. Le jeu de caractères, lui, doit être compatible dès le départ.",
    topic: "RMAN CONVERT", difficulty: "hard",
  },
  {
    id: "ocp2-q67", track: "ocp-dba-ii", moduleId: "ocp2-session-7",
    question: "Quelles affirmations sont exactes concernant la duplication RMAN ? (Choisissez trois réponses.)",
    options: ["Elle peut fonctionner en mode pull, l'auxiliaire tirant les données", "Elle peut fonctionner en mode push, la source poussant les données", "Elle peut ne dupliquer qu'un sous-ensemble de la base", "Elle exige l'arrêt de la base source", "Elle impose que la cible porte le même nom que la source"],
    correctIndexes: [0, 1, 2],
    explanation: "La duplication active accepte les deux sens de transfert, le mode push exploitant mieux la bande passante sur les liens rapides. Les clauses SKIP TABLESPACE et TABLESPACE limitent le périmètre. La source reste ouverte, et la cible porte un nom distinct.",
    topic: "Modes de duplication", difficulty: "hard",
  },

  // ─── Installation, correctifs, mise à niveau ────────────────────────────
  {
    id: "ocp2-q68", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Quelles affirmations sont exactes concernant opatchauto ? (Choisissez trois réponses.)",
    options: ["Il applique les correctifs sur la pile Grid Infrastructure et base", "Il opère en mode non-rolling par défaut", "Il sait appliquer des correctifs intermédiaires (one-off)", "Il remplace datapatch", "Il ne fonctionne que sur une base autonome"],
    correctIndexes: [0, 1, 2],
    explanation: "opatchauto orchestre l'application sur toute la pile, en arrêtant les services concernés — d'où le mode non-rolling par défaut, le mode rolling devant être demandé et n'ayant de sens qu'en cluster. Il ne dispense jamais de datapatch pour le volet SQL.",
    topic: "opatchauto", difficulty: "hard",
  },
  {
    id: "ocp2-q69", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Quelles affirmations sont exactes concernant les comptes et groupes d'installation ? (Choisissez deux réponses.)",
    options: ["Le groupe primaire du propriétaire doit être le groupe Oracle Inventory (oinstall)", "Le propriétaire Grid détient les binaires d'Oracle Restart et d'ASM", "Le propriétaire de la base doit être root", "Un seul compte peut détenir toutes les installations, sans groupe dédié"],
    correctIndexes: [0, 1],
    explanation: "oinstall en groupe primaire garantit que l'inventaire central reste accessible à toutes les installations. La séparation des rôles — un compte grid, un compte oracle — est la configuration recommandée. root n'est employé que pour les scripts de post-installation.",
    topic: "Comptes d'installation", difficulty: "medium",
  },
  {
    id: "ocp2-q70", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Quelles affirmations sont exactes concernant une installation silencieuse ? (Choisissez deux réponses.)",
    options: ["L'exécution d'orainstRoot.sh peut être automatisée via sudo ou root", "Le mot de passe sudo peut être fourni dans le fichier de réponses", "Le fichier de réponses stocke les mots de passe de la base en clair, sans risque", "L'installation silencieuse interdit la création d'une base"],
    correctIndexes: [0, 1],
    explanation: "Le fichier de réponses accepte les paramètres d'élévation de privilèges, ce qui permet une installation entièrement automatisée. Il contient en revanche des secrets : il doit être protégé puis supprimé après usage.",
    topic: "Installation silencieuse", difficulty: "hard",
  },
  {
    id: "ocp2-q71", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Que permet la commande rhpctl move database ? (Choisissez deux réponses.)",
    options: ["Basculer une base vers une version plus récente", "Basculer une base vers un home déjà corrigé", "Déplacer les fichiers de données vers un autre disque", "Convertir une base non-CDB en PDB"],
    correctIndexes: [0, 1],
    explanation: "Rapid Home Provisioning déplace une base d'un Oracle Home vers un autre — mise à niveau ou home patché — en réduisant l'indisponibilité et en gardant un retour arrière possible. Il ne touche ni aux fichiers de données ni à l'architecture multitenant.",
    topic: "Rapid Home Provisioning", difficulty: "hard",
  },
  {
    id: "ocp2-q72", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Quelles variables d'environnement interviennent avant l'installation ? (Choisissez trois réponses.)",
    options: ["ORACLE_BASE, qui fixe la racine de l'arborescence OFA", "TNS_ADMIN, qui localise les fichiers de configuration Oracle Net", "ORACLE_HOME, qui désigne les binaires", "DB_RECOVERY_FILE_DEST, qui définit la FRA", "UNDO_TABLESPACE, qui nomme le tablespace d'undo"],
    correctIndexes: [0, 1, 2],
    explanation: "Ces trois variables relèvent du système d'exploitation et précèdent l'installation. Les deux dernières propositions sont des paramètres d'initialisation de la base, définis bien plus tard.",
    topic: "Variables d'environnement", difficulty: "medium",
  },
  {
    id: "ocp2-q73", track: "ocp-dba-ii", moduleId: "ocp2-session-8",
    question: "Quelles affirmations sont exactes concernant le choix du jeu de caractères ? (Choisissez deux réponses.)",
    options: ["Un jeu mono-octet est plus performant en stockage et en traitement", "Unicode (AL32UTF8) permet de stocker toutes les langues", "Le jeu de caractères se change facilement après création", "Un jeu mono-octet suffit pour une application multilingue"],
    correctIndexes: [0, 1],
    explanation: "AL32UTF8 est le choix par défaut et le seul viable pour du multilingue, au prix d'un stockage variable de 1 à 4 octets par caractère. Le changer après coup est une opération lourde et risquée : la décision se prend à la création.",
    topic: "Jeux de caractères", difficulty: "medium",
  },
];
