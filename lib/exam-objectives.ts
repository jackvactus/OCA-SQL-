/**
 * Objectifs d'examen officiels Oracle University.
 *
 * Chaque entrée reprend, pour un domaine d'examen donné, la liste d'objectifs
 * détaillés publiée sur la fiche officielle de l'épreuve. La formulation
 * anglaise est celle d'Oracle — c'est le libellé imprimé sur le relevé de score,
 * le traduire seul induirait le candidat en erreur. La traduction française est
 * fournie à côté, jamais à la place.
 *
 * Clé : `<code examen>|<titre officiel du domaine>`.
 * `source` nomme le cours Oracle University dont provient le domaine.
 */

export interface ExamObjective {
  /** Formulation officielle Oracle (anglais). */
  en: string;
  /** Traduction française de travail. */
  fr: string;
}

export interface DomainObjectives {
  /** Traduction française du libellé de domaine. */
  titleFr: string;
  /** Cours Oracle University cité par la fiche d'examen. */
  source: string;
  objectives: ExamObjective[];
}

/* Cours Oracle University cités par les fiches d'examen. */
export const SRC_ADMIN = "Oracle Database: Administration Workshop";
export const SRC_SQL = "Oracle Database: Introduction to SQL";
export const SRC_MULTITENANT = "Oracle Database: Managing Multitenant Architecture";
export const SRC_BACKUP = "Oracle Database: Backup and Recovery Workshop";
export const SRC_DEPLOY = "Oracle Database: Deploy, Patch and Upgrade Workshop";
export const SRC_19C = "Oracle Database 19c: New Features for Administrators";
export const SRC_TUNING = "Oracle Database 19c: Performance Management and Tuning";
export const SRC_DG = "Oracle Database 19c: Data Guard Administration";
export const SRC_RAC = "Oracle Database 19c: Clusterware Administration / RAC Administration";

export const examObjectives: Record<string, DomainObjectives> = {
  /* ====================================================================
   * 1Z0-082 — Oracle Database Administration I
   * 72 questions · 120 minutes · 60 %
   * ================================================================== */
  "1Z0-082|Understanding Oracle Database Architecture": {
    titleFr: "Comprendre l'architecture d'Oracle Database",
    source: SRC_ADMIN,
    objectives: [
      { en: "Understanding Oracle Database Instance Configurations", fr: "Comprendre les configurations d'instance Oracle Database" },
      { en: "Understanding Oracle Database Memory and Process Structures", fr: "Comprendre les structures mémoire et les processus" },
      { en: "Understanding Logical and Physical Database Structures", fr: "Comprendre les structures logiques et physiques de la base" },
      { en: "Understanding Oracle Database Server Architecture", fr: "Comprendre l'architecture du serveur Oracle Database" },
    ],
  },
  "1Z0-082|Managing Database Instances": {
    titleFr: "Gérer les instances de base de données",
    source: SRC_ADMIN,
    objectives: [
      { en: "Starting Up Oracle Database Instances", fr: "Démarrer une instance Oracle Database" },
      { en: "Shutting Down Oracle Database Instances", fr: "Arrêter une instance Oracle Database" },
      { en: "Using Data Dictionary Views", fr: "Utiliser les vues du dictionnaire de données" },
      { en: "Using Dynamic Performance Views", fr: "Utiliser les vues dynamiques de performance" },
      { en: "Using the Automatic Diagnostic Repository (ADR)", fr: "Utiliser le référentiel de diagnostic automatique (ADR)" },
      { en: "Using the Alert Log and Trace Files", fr: "Exploiter le journal d'alertes et les fichiers de trace" },
      { en: "Managing Initialization Parameter Files", fr: "Gérer les fichiers de paramètres d'initialisation" },
    ],
  },
  "1Z0-082|Managing Users, Roles and Privileges": {
    titleFr: "Gérer les utilisateurs, rôles et privilèges",
    source: SRC_ADMIN,
    objectives: [
      { en: "Managing Oracle Database Users, Privileges, and Roles", fr: "Gérer les utilisateurs, privilèges et rôles de la base" },
      { en: "Applying the Principal of Least Privilege", fr: "Appliquer le principe du moindre privilège" },
      { en: "Creating and Assigning Profiles", fr: "Créer et affecter des profils" },
      { en: "Managing User Authentication Methods", fr: "Gérer les méthodes d'authentification des utilisateurs" },
      { en: "Assigning Quotas to Users", fr: "Attribuer des quotas aux utilisateurs" },
    ],
  },
  "1Z0-082|Managing Storage": {
    titleFr: "Gérer le stockage",
    source: SRC_ADMIN,
    objectives: [
      { en: "Deploying Oracle Database Space Management Features", fr: "Déployer les fonctions de gestion de l'espace" },
      { en: "Managing Different Types of Segments", fr: "Gérer les différents types de segments" },
      { en: "Understanding Block Space Management", fr: "Comprendre la gestion de l'espace dans les blocs" },
      { en: "Managing Resumable Space Allocation", fr: "Gérer l'allocation d'espace reprenable" },
      { en: "Shrinking Segments", fr: "Compacter les segments (shrink)" },
      { en: "Deferred Segment Creation", fr: "Création différée des segments" },
      { en: "Using Space-Saving Features", fr: "Utiliser les fonctions d'économie d'espace" },
      { en: "Using Table and Row Compression", fr: "Utiliser la compression de tables et de lignes" },
    ],
  },
  "1Z0-082|Managing Tablespaces and Datafiles": {
    titleFr: "Gérer les tablespaces et les fichiers de données",
    source: SRC_ADMIN,
    objectives: [
      { en: "Viewing Tablespace Information", fr: "Consulter les informations sur les tablespaces" },
      { en: "Creating, Altering and Dropping Tablespaces", fr: "Créer, modifier et supprimer des tablespaces" },
      { en: "Managing Table Data Storage", fr: "Gérer le stockage des données des tables" },
      { en: "Implementing Oracle Managed Files", fr: "Mettre en œuvre Oracle Managed Files" },
      { en: "Moving and Renaming Online Data Files", fr: "Déplacer et renommer des fichiers de données en ligne" },
    ],
  },
  "1Z0-082|Managing Undo": {
    titleFr: "Gérer l'undo",
    source: SRC_ADMIN,
    objectives: [
      { en: "Understanding Transactions and Undo Data", fr: "Comprendre les transactions et les données d'annulation" },
      { en: "Storing Undo Information", fr: "Stocker les informations d'annulation" },
      { en: "Configuring Undo Retention", fr: "Configurer la rétention d'undo" },
      { en: "Comparing Undo Data and Redo Data", fr: "Comparer données d'annulation et données de rétablissement" },
      { en: "Understanding Temporary Undo", fr: "Comprendre l'undo temporaire" },
    ],
  },
  "1Z0-082|Moving Data": {
    titleFr: "Déplacer les données",
    source: SRC_ADMIN,
    objectives: [
      { en: "Using External Tables", fr: "Utiliser les tables externes" },
      { en: "Using Oracle Data Pump", fr: "Utiliser Oracle Data Pump" },
      { en: "Using SQL*Loader", fr: "Utiliser SQL*Loader" },
    ],
  },
  "1Z0-082|Accessing an Oracle Database with Oracle supplied Tools": {
    titleFr: "Accéder à la base avec les outils fournis par Oracle",
    source: SRC_ADMIN,
    objectives: [
      { en: "Using the Database Configuration Assistant (DBCA)", fr: "Utiliser l'assistant de configuration de base de données (DBCA)" },
      { en: "Using Oracle Enterprise Manager Cloud Control", fr: "Utiliser Enterprise Manager Cloud Control" },
      { en: "Using Oracle Enterprise Manager Database Express", fr: "Utiliser Enterprise Manager Database Express" },
      { en: "Using SQL Developer", fr: "Utiliser SQL Developer" },
      { en: "Using SQL Plus", fr: "Utiliser SQL*Plus" },
    ],
  },
  "1Z0-082|Configuring Oracle Net Services": {
    titleFr: "Configurer Oracle Net Services",
    source: SRC_ADMIN,
    objectives: [
      { en: "Using Oracle Net Services Administration Tools", fr: "Utiliser les outils d'administration d'Oracle Net Services" },
      { en: "Configuring the Oracle Net Listener", fr: "Configurer le listener Oracle Net" },
      { en: "Connecting to an Oracle Database Instance", fr: "Se connecter à une instance Oracle Database" },
      { en: "Configuring Communication Between Database Instances", fr: "Configurer la communication entre instances" },
      { en: "Comparing Dedicated and Shared Server Configurations", fr: "Comparer les configurations serveur dédié et serveur partagé" },
      { en: "Administering Naming Methods", fr: "Administrer les méthodes de résolution de noms" },
    ],
  },
  "1Z0-082|Retrieving Data using the SQL SELECT Statement": {
    titleFr: "Extraire des données avec l'instruction SELECT",
    source: SRC_SQL,
    objectives: [
      { en: "Using The SQL SELECT Statement", fr: "Utiliser l'instruction SELECT" },
      { en: "Using Column aliases", fr: "Utiliser les alias de colonnes" },
      { en: "Using the DESCRIBE command", fr: "Utiliser la commande DESCRIBE" },
      { en: "Using concatenation operator, literal character strings, alternative quote operator, and the DISTINCT keyword", fr: "Opérateur de concaténation, chaînes littérales, opérateur de quote alternatif et mot-clé DISTINCT" },
      { en: "Using Arithmetic expressions and NULL values in the SELECT statement", fr: "Expressions arithmétiques et valeurs NULL dans le SELECT" },
    ],
  },
  "1Z0-082|Restricting and Sorting Data": {
    titleFr: "Restreindre et trier les données",
    source: SRC_SQL,
    objectives: [
      { en: "Applying Rules of Precedence for Operators in an Expression", fr: "Appliquer les règles de priorité des opérateurs dans une expression" },
      { en: "Limiting Rows Returned in a SQL Statement", fr: "Limiter le nombre de lignes renvoyées par une requête" },
      { en: "Using Substitution Variables", fr: "Utiliser les variables de substitution" },
      { en: "Using the DEFINE and VERIFY Commands", fr: "Utiliser les commandes DEFINE et VERIFY" },
    ],
  },
  "1Z0-082|Using Single-Row Functions to Customize Output": {
    titleFr: "Personnaliser le résultat avec les fonctions mono-ligne",
    source: SRC_SQL,
    objectives: [
      { en: "Manipulating Strings with Character Functions in SQL SELECT and WHERE Clauses", fr: "Manipuler les chaînes avec les fonctions caractère dans SELECT et WHERE" },
      { en: "Manipulating Numbers with the ROUND, TRUNC and MOD Functions", fr: "Manipuler les nombres avec ROUND, TRUNC et MOD" },
      { en: "Manipulating Dates with the Date Function", fr: "Manipuler les dates avec les fonctions de date" },
      { en: "Performing Arithmetic with Date Data", fr: "Effectuer des opérations arithmétiques sur les dates" },
    ],
  },
  "1Z0-082|Using Conversion Functions and Conditional Expressions": {
    titleFr: "Fonctions de conversion et expressions conditionnelles",
    source: SRC_SQL,
    objectives: [
      { en: "Understanding Implicit and Explicit Data Type Conversion", fr: "Comprendre la conversion implicite et explicite des types de données" },
      { en: "Using the TO_CHAR, TO_NUMBER, and TO_DATE Conversion Functions", fr: "Utiliser les fonctions TO_CHAR, TO_NUMBER et TO_DATE" },
      { en: "Applying the NVL, NULLIF, and COALESCE Functions to Data", fr: "Appliquer les fonctions NVL, NULLIF et COALESCE aux données" },
      { en: "Nesting Multiple Functions", fr: "Imbriquer plusieurs fonctions" },
    ],
  },
  "1Z0-082|Reporting Aggregated Data Using Group Functions": {
    titleFr: "Restituer des données agrégées avec les fonctions de groupe",
    source: SRC_SQL,
    objectives: [
      { en: "Using Group Functions", fr: "Utiliser les fonctions de groupe" },
      { en: "Creating Groups of Data", fr: "Créer des groupes de données" },
      { en: "Restricting Group Results", fr: "Restreindre les résultats de groupe" },
    ],
  },
  "1Z0-082|Displaying Data from Multiple Tables Using Joins": {
    titleFr: "Afficher les données de plusieurs tables avec les jointures",
    source: SRC_SQL,
    objectives: [
      { en: "Using Various Types of Joins", fr: "Utiliser les différents types de jointures" },
      { en: "Using Self-Joins", fr: "Utiliser les auto-jointures" },
      { en: "Using Non-Equijoins", fr: "Utiliser les non-équijointures" },
      { en: "Using OUTER Joins", fr: "Utiliser les jointures externes" },
    ],
  },
  "1Z0-082|Using Subqueries to Solve Queries": {
    titleFr: "Résoudre des requêtes à l'aide de sous-requêtes",
    source: SRC_SQL,
    objectives: [
      { en: "Using Single Row Subqueries", fr: "Utiliser les sous-requêtes mono-ligne" },
      { en: "Using Multiple Row Subqueries", fr: "Utiliser les sous-requêtes multi-lignes" },
    ],
  },
  "1Z0-082|Using SET Operators": {
    titleFr: "Utiliser les opérateurs ensemblistes",
    source: SRC_SQL,
    objectives: [
      { en: "Matching the SELECT Statements", fr: "Faire correspondre les instructions SELECT" },
      { en: "Using The UNION and UNION ALL Operators", fr: "Utiliser les opérateurs UNION et UNION ALL" },
      { en: "Using The INTERSECT Operator", fr: "Utiliser l'opérateur INTERSECT" },
      { en: "Using The MINUS Operator", fr: "Utiliser l'opérateur MINUS" },
      { en: "Using the ORDER BY Clause in Set Operations", fr: "Utiliser la clause ORDER BY dans les opérations ensemblistes" },
    ],
  },
  "1Z0-082|Managing Tables using DML statements": {
    titleFr: "Gérer les tables avec les instructions DML",
    source: SRC_SQL,
    objectives: [
      { en: "Using Data Manipulation Language", fr: "Utiliser le langage de manipulation de données" },
      { en: "Managing Database Transactions", fr: "Gérer les transactions de la base de données" },
      { en: "Controlling transactions", fr: "Contrôler les transactions" },
    ],
  },
  "1Z0-082|Understanding Data Definition Language": {
    titleFr: "Comprendre le langage de définition de données",
    source: SRC_SQL,
    objectives: [{ en: "Using Data Definition Language", fr: "Utiliser le langage de définition de données" }],
  },
  "1Z0-082|Managing Views": {
    titleFr: "Gérer les vues",
    source: SRC_SQL,
    objectives: [{ en: "Managing Views", fr: "Créer, modifier et supprimer des vues" }],
  },
  "1Z0-082|Managing Sequences, Synonyms, Indexes": {
    titleFr: "Gérer les séquences, synonymes et index",
    source: SRC_SQL,
    objectives: [
      { en: "Managing Sequences", fr: "Gérer les séquences" },
      { en: "Managing Synonyms", fr: "Gérer les synonymes" },
      { en: "Managing Indexes", fr: "Gérer les index" },
    ],
  },
  "1Z0-082|Managing Schema Objects": {
    titleFr: "Gérer les objets de schéma",
    source: SRC_SQL,
    objectives: [
      { en: "Managing Constraints", fr: "Gérer les contraintes" },
      { en: "Creating and Using Temporary Tables", fr: "Créer et utiliser des tables temporaires" },
    ],
  },
  "1Z0-082|Managing Data in Different Time Zones": {
    titleFr: "Gérer les données dans différents fuseaux horaires",
    source: SRC_SQL,
    objectives: [
      { en: "Using CURRENT_DATE, CURRENT_TIMESTAMP, and LOCALTIMESTAMP", fr: "Utiliser CURRENT_DATE, CURRENT_TIMESTAMP et LOCALTIMESTAMP" },
      { en: "Using INTERVAL Data Types", fr: "Utiliser les types de données INTERVAL" },
    ],
  },

  /* ====================================================================
   * 1Z0-083 — Oracle Database Administration II
   * 68 questions · 120 minutes · 57 %
   * ================================================================== */
  "1Z0-083|Creating CDBs and Regular PDBs": {
    titleFr: "Créer des CDB et des PDB classiques",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Configure and create a CDB", fr: "Configurer et créer une CDB" },
      { en: "Create a new PDB from the CDB seed", fr: "Créer une PDB à partir de la graine de la CDB" },
      { en: "Explore the structure of PDBs", fr: "Explorer la structure des PDB" },
    ],
  },
  "1Z0-083|Manage CDBs and PDBs": {
    titleFr: "Gérer les CDB et les PDB",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Manage PDB service names and connections", fr: "Gérer les noms de service et les connexions des PDB" },
      { en: "Manage startup, shutdown and availability of CDBs and PDBs", fr: "Gérer le démarrage, l'arrêt et la disponibilité des CDB et des PDB" },
      { en: "Change the different modes and settings of PDBs", fr: "Modifier les différents modes et paramètres des PDB" },
      { en: "Evaluate the impact of parameter value changes", fr: "Évaluer l'impact des modifications de valeurs de paramètres" },
      { en: "Performance management in CDBs and PDBs", fr: "Gérer les performances dans les CDB et les PDB" },
      { en: "Control CDB and PDB resource usage with the Oracle Resource Manager", fr: "Contrôler l'utilisation des ressources CDB et PDB avec Resource Manager" },
    ],
  },
  "1Z0-083|Manage Application PDBs": {
    titleFr: "Gérer les PDB applicatives",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Explain the purpose of application root and application seed", fr: "Expliquer le rôle de la racine et de la graine applicatives" },
      { en: "Define and create application PDBs", fr: "Définir et créer des PDB applicatives" },
      { en: "Install, upgrade and patch applications", fr: "Installer, mettre à niveau et corriger les applications" },
      { en: "Create and administer application PDBs", fr: "Créer et administrer les PDB applicatives" },
      { en: "Clone PDBs and application containers", fr: "Cloner des PDB et des conteneurs applicatifs" },
      { en: "Plug and unplug operations with PDBs and application containers", fr: "Brancher et débrancher PDB et conteneurs applicatifs" },
      { en: "Comparison of local undo mode and shared undo mode", fr: "Comparer le mode undo local et le mode undo partagé" },
    ],
  },
  "1Z0-083|Manage Security in Multitenant databases": {
    titleFr: "Gérer la sécurité en environnement multitenant",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Manage security in multitenant databases", fr: "Gérer la sécurité dans les bases multitenant" },
      { en: "Manage PDB lockdown profiles", fr: "Gérer les profils de verrouillage (lockdown) des PDB" },
      { en: "Audit users in CDBs and PDBs", fr: "Auditer les utilisateurs dans les CDB et les PDB" },
      { en: "Manage other types of policies in application containers", fr: "Gérer les autres types de politiques dans les conteneurs applicatifs" },
    ],
  },
  "1Z0-083|Backup and Duplicate": {
    titleFr: "Sauvegarde et duplication",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Perform Backup and Recover CDBs and PDBs", fr: "Sauvegarder et restaurer des CDB et des PDB" },
      { en: "Duplicate an active PDB", fr: "Dupliquer une PDB active" },
      { en: "Duplicate a database", fr: "Dupliquer une base de données" },
    ],
  },
  "1Z0-083|Recovery and Flashback": {
    titleFr: "Récupération et Flashback",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Restore and Recovering Databases with RMAN", fr: "Restaurer et récupérer des bases de données avec RMAN" },
      { en: "Perform CDB and PDB flashback", fr: "Effectuer un flashback de CDB et de PDB" },
    ],
  },
  "1Z0-083|Upgrading and Transporting CDBs and Regular PDBs": {
    titleFr: "Mettre à niveau et transporter CDB et PDB classiques",
    source: SRC_MULTITENANT,
    objectives: [
      { en: "Upgrade an Oracle Database", fr: "Mettre à niveau une base de données Oracle" },
      { en: "Transport Data", fr: "Transporter des données" },
    ],
  },
  "1Z0-083|Backup Strategies and Terminology": {
    titleFr: "Stratégies et terminologie de sauvegarde",
    source: SRC_BACKUP,
    objectives: [
      { en: "Perform Full and Incremental Backups and Recoveries", fr: "Effectuer des sauvegardes et restaurations complètes et incrémentielles" },
      { en: "Compress and Encrypt RMAN Backups", fr: "Compresser et chiffrer les sauvegardes RMAN" },
      { en: "Use a media manager", fr: "Utiliser un gestionnaire de médias" },
      { en: "Create multi-section backups of exceptionally large files", fr: "Créer des sauvegardes multi-sections de fichiers très volumineux" },
      { en: "Create duplexed backup sets", fr: "Créer des ensembles de sauvegarde duplexés" },
      { en: "Create archival backups", fr: "Créer des sauvegardes d'archivage" },
      { en: "Backup of recovery files", fr: "Sauvegarder les fichiers de récupération" },
      { en: "Backup non-database files", fr: "Sauvegarder les fichiers non liés à la base" },
      { en: "Back up ASM metadata", fr: "Sauvegarder les métadonnées ASM" },
    ],
  },
  "1Z0-083|Restore and Recovery Concepts": {
    titleFr: "Concepts de restauration et de récupération",
    source: SRC_BACKUP,
    objectives: [
      { en: "Employ the best Oracle Database recovery technology for your failure situation", fr: "Choisir la technologie de récupération adaptée à la panne rencontrée" },
      { en: "Describe and use Recovery technology for Crash, Complete, and Point-in-time recovery", fr: "Décrire et employer la récupération après incident, complète et à un instant donné" },
    ],
  },
  "1Z0-083|Configuring and Using RMAN": {
    titleFr: "Configurer et utiliser RMAN",
    source: SRC_BACKUP,
    objectives: [
      { en: "Configure RMAN and the Database for Recover", fr: "Configurer RMAN et la base en vue de la récupération" },
      { en: "Configure and Use an RMAN recovery catalog", fr: "Configurer et utiliser un catalogue de récupération RMAN" },
    ],
  },
  "1Z0-083|Diagnosing Failures": {
    titleFr: "Diagnostiquer les pannes",
    source: SRC_BACKUP,
    objectives: [
      { en: "Detect and repair database and database block corruption", fr: "Détecter et réparer la corruption de base et de blocs" },
      { en: "Diagnosing Database Issues", fr: "Diagnostiquer les incidents de base de données" },
    ],
  },
  "1Z0-083|Performing Recovery": {
    titleFr: "Effectuer une récupération",
    source: SRC_BACKUP,
    objectives: [
      { en: "Restore and Recovering Databases with RMAN", fr: "Restaurer et récupérer des bases de données avec RMAN" },
      { en: "Perform Non-RMAN database recovery", fr: "Effectuer une récupération sans RMAN" },
    ],
  },
  "1Z0-083|Using Flashback Technologies": {
    titleFr: "Utiliser les technologies Flashback",
    source: SRC_BACKUP,
    objectives: [
      { en: "Configure your Database to support Flashback", fr: "Configurer la base pour prendre en charge Flashback" },
      { en: "Perform flashback operations", fr: "Réaliser les opérations Flashback" },
    ],
  },
  "1Z0-083|Duplicating a Database": {
    titleFr: "Dupliquer une base de données",
    source: SRC_BACKUP,
    objectives: [{ en: "Duplicate Databases", fr: "Dupliquer des bases de données" }],
  },
  "1Z0-083|Transporting Data": {
    titleFr: "Transporter des données",
    source: SRC_BACKUP,
    objectives: [{ en: "Transport Data", fr: "Transporter des données entre bases et plateformes" }],
  },
  "1Z0-083|RMAN Troubleshooting and Tuning": {
    titleFr: "Dépannage et optimisation de RMAN",
    source: SRC_BACKUP,
    objectives: [
      { en: "Interpret RMAN message output", fr: "Interpréter la sortie des messages RMAN" },
      { en: "Diagnose RMAN performance issues", fr: "Diagnostiquer les problèmes de performance de RMAN" },
    ],
  },
  "1Z0-083|Install Grid Infrastructure and Oracle Database": {
    titleFr: "Installer Grid Infrastructure et Oracle Database",
    source: SRC_DEPLOY,
    objectives: [
      { en: "Install Grid Infrastructure for a Standalone server", fr: "Installer Grid Infrastructure pour un serveur autonome" },
      { en: "Install Oracle Database software", fr: "Installer le logiciel Oracle Database" },
    ],
  },
  "1Z0-083|Patching Grid Infrastructure and Oracle Database": {
    titleFr: "Appliquer les correctifs à Grid Infrastructure et à la base",
    source: SRC_DEPLOY,
    objectives: [
      { en: "Patch Grid Infrastructure and Oracle Database", fr: "Corriger Grid Infrastructure et Oracle Database" },
    ],
  },
  "1Z0-083|Upgrading to Oracle Grid Infrastructure": {
    titleFr: "Migrer vers Oracle Grid Infrastructure",
    source: SRC_DEPLOY,
    objectives: [{ en: "Upgrade Oracle Grid Infrastructure", fr: "Mettre à niveau Oracle Grid Infrastructure" }],
  },
  "1Z0-083|Installing Grid Infrastructure for a Standalone server": {
    titleFr: "Installer Grid Infrastructure pour un serveur autonome",
    source: SRC_DEPLOY,
    objectives: [{ en: "Rapid Home Provisioning", fr: "Approvisionnement rapide de homes (Rapid Home Provisioning)" }],
  },
  "1Z0-083|Oracle Database 18c: New Features": {
    titleFr: "Oracle Database 18c : nouvelles fonctionnalités",
    source: SRC_DEPLOY,
    objectives: [{ en: "Image and RPM based Database Installation", fr: "Installation de base par image et par RPM" }],
  },
  "1Z0-083|Creating an Oracle Database by using DBCA": {
    titleFr: "Créer une base Oracle avec DBCA",
    source: SRC_DEPLOY,
    objectives: [
      { en: "Create, delete and configure databases using DBCA", fr: "Créer, supprimer et configurer des bases de données avec DBCA" },
    ],
  },
  "1Z0-083|Oracle Restart": {
    titleFr: "Oracle Restart",
    source: SRC_DEPLOY,
    objectives: [
      { en: "Configure and use Oracle Restart to manage components", fr: "Configurer et utiliser Oracle Restart pour gérer les composants" },
    ],
  },
  "1Z0-083|Upgrade the Oracle Database": {
    titleFr: "Mettre à niveau la base Oracle",
    source: SRC_DEPLOY,
    objectives: [
      { en: "Plan for Upgrading an Oracle Database", fr: "Planifier la mise à niveau d'une base Oracle" },
      { en: "Upgrade an Oracle Database", fr: "Mettre à niveau une base de données Oracle" },
      { en: "Perform Post-Upgrade tasks", fr: "Effectuer les tâches post-mise à niveau" },
    ],
  },
  "1Z0-083|General Database Enhancements": {
    titleFr: "Améliorations générales de la base de données",
    source: SRC_19C,
    objectives: [
      { en: "Install Oracle Database software", fr: "Installer le logiciel Oracle Database" },
      { en: "Create, delete and configure databases using DBCA", fr: "Créer, supprimer et configurer des bases avec DBCA" },
      { en: "Creating CDBs and Regular PDBs", fr: "Créer des CDB et des PDB classiques" },
      { en: "Use Miscellaneous 19c New Features", fr: "Exploiter les nouveautés diverses de la 19c" },
    ],
  },
  "1Z0-083|Using Availability Enhancements": {
    titleFr: "Exploiter les améliorations de disponibilité",
    source: SRC_19C,
    objectives: [
      { en: "Use an RMAN recovery catalog", fr: "Utiliser un catalogue de récupération RMAN" },
      { en: "Use Flashback Database", fr: "Utiliser Flashback Database" },
    ],
  },
  "1Z0-083|Using Diagnosability Enhancements": {
    titleFr: "Exploiter les améliorations de diagnostic",
    source: SRC_19C,
    objectives: [{ en: "Use new Diagnosability Features", fr: "Utiliser les nouvelles fonctionnalités de diagnostic" }],
  },
  "1Z0-083|Monitoring and Tuning Database Performance": {
    titleFr: "Surveiller et optimiser les performances de la base",
    source: SRC_ADMIN,
    objectives: [
      { en: "Understanding and Using the Performance Tuning Methodology", fr: "Comprendre et utiliser la méthodologie d'optimisation des performances" },
      { en: "Performing Performance Planning", fr: "Réaliser un plan de performance" },
      { en: "Managing Memory Components", fr: "Gérer les composants mémoire" },
      { en: "Understanding the Automatic Workload Repository (AWR)", fr: "Comprendre le référentiel de charge de travail automatique (AWR)" },
      { en: "Understanding the Automatic Database Diagnostic Monitor (ADDM)", fr: "Comprendre le moniteur de diagnostic automatique (ADDM)" },
      { en: "Understanding the Advisory Framework", fr: "Comprendre le cadre consultatif (advisors)" },
      { en: "Monitoring Wait Events, Sessions, and Services", fr: "Surveiller les événements d'attente, les sessions et les services" },
      { en: "Managing Metric Thresholds and Alerts", fr: "Gérer les seuils d'indicateurs et les alertes" },
    ],
  },
  "1Z0-083|Tuning SQL Statements": {
    titleFr: "Optimiser les instructions SQL",
    source: SRC_ADMIN,
    objectives: [
      { en: "Understanding the Oracle Optimizer", fr: "Comprendre l'optimiseur Oracle" },
      { en: "Understanding the SQL Tuning Process", fr: "Comprendre le processus d'optimisation SQL" },
      { en: "Using the SQL Tuning Advisor", fr: "Utiliser SQL Tuning Advisor" },
      { en: "Using the SQL Access Advisor", fr: "Utiliser SQL Access Advisor" },
      { en: "Managing Optimizer Statistics", fr: "Gérer les statistiques de l'optimiseur" },
    ],
  },
};

/** Objectifs officiels d'un domaine, ou `undefined` s'ils ne sont pas publiés. */
export function objectivesFor(examCode: string, domainTitle: string): DomainObjectives | undefined {
  return examObjectives[`${examCode}|${domainTitle}`];
}
