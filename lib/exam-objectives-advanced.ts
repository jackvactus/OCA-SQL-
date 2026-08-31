import type { DomainObjectives } from "./exam-objectives";
import { SRC_TUNING, SRC_DG, SRC_RAC, SRC_GRID } from "./exam-sources";

/**
 * Objectifs officiels des trois examens de spécialisation Oracle Database 19c.
 *
 *   1Z0-084 — Performance Management and Tuning  · 55 q · 90 min  · 60 %
 *   1Z0-076 — Data Guard Administration          · 74 q · 120 min · 61 %
 *   1Z0-078 — RAC, ASM and Grid Infrastructure   · 77 q · 120 min · 65 %
 *
 * Les domaines sont repris dans l'ordre des fiches d'examen Oracle University,
 * en anglais d'origine, avec la traduction française à côté.
 */
export const advancedObjectives: Record<string, DomainObjectives> = {
  /* ====================================================================
   * 1Z0-084 — Oracle Database 19c: Performance Management and Tuning
   * ================================================================== */
  "1Z0-084|Basic Tuning Diagnostics": {
    titleFr: "Méthodes de réglage et de diagnostic de base",
    source: SRC_TUNING,
    objectives: [
      { en: "Tuning methodologies", fr: "Méthodologies d'optimisation" },
      { en: "Lifecycle tuning phases", fr: "Phases d'optimisation du cycle de vie" },
      { en: "Describing the time model", fr: "Décrire le modèle de temps" },
      { en: "Explaining wait events", fr: "Expliquer les événements d'attente" },
      { en: "Diagnosing performance issues using V$ views", fr: "Diagnostiquer les problèmes de performance avec les vues V$" },
    ],
  },
  "1Z0-084|Using Statspack": {
    titleFr: "Utiliser Statspack",
    source: SRC_TUNING,
    objectives: [
      { en: "Installing and configuring Statspack", fr: "Installer et configurer Statspack" },
      { en: "Diagnosing performance issues using Statspack", fr: "Diagnostiquer les problèmes de performance avec Statspack" },
    ],
  },
  "1Z0-084|Using Log and Trace Files to Monitor Performance": {
    titleFr: "Surveiller les performances par les journaux et les traces",
    source: SRC_TUNING,
    objectives: [
      { en: "Using the alert log to monitor performance", fr: "Utiliser le journal d'alertes pour surveiller les performances" },
      { en: "Using trace files to monitor performance", fr: "Utiliser les fichiers de trace pour surveiller les performances" },
    ],
  },
  "1Z0-084|Using Metrics, Alerts and Baselines": {
    titleFr: "Indicateurs, alertes et lignes de base",
    source: SRC_TUNING,
    objectives: [
      { en: "Monitoring performance using metric thresholds and alerts", fr: "Surveiller les performances par seuils d'indicateurs et alertes" },
      { en: "Using AWR baselines to monitor performance", fr: "Utiliser les lignes de base AWR pour surveiller les performances" },
    ],
  },
  "1Z0-084|Using AWR-Based Tools": {
    titleFr: "Utiliser les outils fondés sur AWR",
    source: SRC_TUNING,
    objectives: [
      { en: "Diagnosing performance issues using ADDM", fr: "Diagnostiquer les problèmes de performance avec ADDM" },
      { en: "Diagnosing performance issues using ASH reports", fr: "Diagnostiquer les problèmes de performance avec les rapports ASH" },
      { en: "Using automated maintenance tasks to manage performance", fr: "Utiliser les tâches de maintenance automatisées" },
    ],
  },
  "1Z0-084|Performing Oracle Database Application Monitoring": {
    titleFr: "Surveiller les applications de base de données",
    source: SRC_TUNING,
    objectives: [
      { en: "Implementing real-time database operations monitoring", fr: "Mettre en œuvre la surveillance temps réel des opérations" },
      { en: "Configuring and using database application performance monitoring services", fr: "Configurer et utiliser les services de surveillance applicative" },
    ],
  },
  "1Z0-084|Identifying Problem SQL Statements": {
    titleFr: "Identifier les instructions SQL problématiques",
    source: SRC_TUNING,
    objectives: [
      { en: "Understanding the phases of SQL statement processing", fr: "Comprendre les phases de traitement d'une instruction SQL" },
      { en: "Interpreting execution plans", fr: "Interpréter les plans d'exécution" },
      { en: "Using SQL Trace formatted output or Optimizer trace to identify poorly performing SQL statements", fr: "Exploiter la sortie de SQL Trace ou la trace de l'optimiseur pour repérer le SQL lent" },
      { en: "Tracking adaptive/dynamic execution plans", fr: "Suivre les plans d'exécution adaptatifs et dynamiques" },
      { en: "Monitoring automatic reoptimization and SQL plan directives", fr: "Surveiller la réoptimisation automatique et les directives de plan" },
    ],
  },
  "1Z0-084|Influencing the Optimizer": {
    titleFr: "Influencer l'optimiseur",
    source: SRC_TUNING,
    objectives: [
      { en: "Explaining how statistics influence the optimizer", fr: "Expliquer comment les statistiques influencent l'optimiseur" },
      { en: "Setting parameters to influence the optimizer", fr: "Régler les paramètres qui influencent l'optimiseur" },
    ],
  },
  "1Z0-084|Reducing the Cost of SQL Operations": {
    titleFr: "Réduire le coût des opérations SQL",
    source: SRC_TUNING,
    objectives: [
      { en: "Shrinking segments", fr: "Compacter les segments" },
      { en: "Managing chained and migrated rows", fr: "Gérer le chaînage et la migration de lignes" },
      { en: "Configuring index and table performance options", fr: "Configurer les options de performance des index et des tables" },
      { en: "Configuring table compression", fr: "Configurer la compression de tables" },
      { en: "Diagnosing and resolving space-related issues", fr: "Diagnostiquer et résoudre les problèmes d'espace" },
    ],
  },
  "1Z0-084|Using Real Application Testing": {
    titleFr: "Utiliser Real Application Testing",
    source: SRC_TUNING,
    objectives: [
      { en: "Using SQL Performance Analyzer to test the impact of database changes", fr: "Tester l'impact d'un changement avec SQL Performance Analyzer" },
      { en: "Using Database Replay to verify the performance impact of system changes", fr: "Vérifier l'impact d'un changement système avec Database Replay" },
    ],
  },
  "1Z0-084|Managing SQL Performance": {
    titleFr: "Gérer la performance du SQL",
    source: SRC_TUNING,
    objectives: [
      { en: "Managing optimizer statistics", fr: "Gérer les statistiques de l'optimiseur" },
      { en: "Using the Optimizer Statistics Advisor", fr: "Utiliser l'Optimizer Statistics Advisor" },
      { en: "Using SQL Access and SQL Tuning advisors to tune SQL", fr: "Optimiser le SQL avec SQL Access Advisor et SQL Tuning Advisor" },
      { en: "Using SQL Plan Management to tune SQL", fr: "Optimiser le SQL avec SQL Plan Management" },
    ],
  },
  "1Z0-084|Tuning the Shared Pool": {
    titleFr: "Optimiser le shared pool",
    source: SRC_TUNING,
    objectives: [
      { en: "Diagnosing and resolving shared pool performance issues", fr: "Diagnostiquer et résoudre les problèmes du shared pool" },
      { en: "Managing and tuning the result cache", fr: "Gérer et optimiser le result cache" },
    ],
  },
  "1Z0-084|Tuning the Buffer Cache": {
    titleFr: "Optimiser le buffer cache",
    source: SRC_TUNING,
    objectives: [
      { en: "Diagnosing and resolving buffer cache performance issues", fr: "Diagnostiquer et résoudre les problèmes du buffer cache" },
      { en: "Diagnosing database I/O issues", fr: "Diagnostiquer les problèmes d'entrées-sorties" },
      { en: "Configuring large table caching", fr: "Configurer la mise en cache des grandes tables" },
      { en: "Configuring the Flash Cache", fr: "Configurer le Database Smart Flash Cache" },
    ],
  },
  "1Z0-084|Tuning PGA": {
    titleFr: "Optimiser la PGA",
    source: SRC_TUNING,
    objectives: [
      { en: "Diagnosing and resolving PGA performance issues", fr: "Diagnostiquer et résoudre les problèmes de PGA" },
      { en: "Diagnosing and resolving temporary tablespace performance issues", fr: "Diagnostiquer et résoudre les problèmes de tablespace temporaire" },
    ],
  },
  "1Z0-084|Using Automatic Memory Management": {
    titleFr: "Utiliser la gestion automatique de la mémoire",
    source: SRC_TUNING,
    objectives: [
      { en: "Configuring Automatic Shared Memory Management", fr: "Configurer la gestion automatique de la mémoire partagée (ASMM)" },
      { en: "Configuring Automatic Memory Management", fr: "Configurer la gestion automatique de la mémoire (AMM)" },
    ],
  },
  "1Z0-084|Using In-Memory Features": {
    titleFr: "Utiliser les fonctionnalités In-Memory",
    source: SRC_TUNING,
    objectives: [
      { en: "Configuring and using the In-Memory column store to improve SQL performance", fr: "Configurer et utiliser le magasin de colonnes In-Memory" },
      { en: "Using the In-Memory column store with other database features", fr: "Combiner In-Memory avec les autres fonctionnalités de la base" },
    ],
  },

  /* ====================================================================
   * 1Z0-076 — Oracle Database 19c: Data Guard Administration
   * ================================================================== */
  "1Z0-076|Oracle Data Guard Basics": {
    titleFr: "Principes de base d'Oracle Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Describe Oracle Data Guard architecture", fr: "Décrire l'architecture d'Oracle Data Guard" },
      { en: "Explain the relevance of physical, logical and snapshot standby databases", fr: "Expliquer la pertinence des bases de secours physiques, logiques et instantanées" },
      { en: "Explain the benefits of implementing Oracle Data Guard", fr: "Expliquer les bénéfices d'une mise en œuvre de Data Guard" },
      { en: "Explain the use of Data Guard with Oracle multitenant databases", fr: "Expliquer l'usage de Data Guard avec les bases multitenant" },
    ],
  },
  "1Z0-076|Managing Oracle Net Services in a Data Guard Environment": {
    titleFr: "Gérer Oracle Net Services en environnement Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Understand Oracle Net Services basics", fr: "Comprendre les bases d'Oracle Net Services" },
      { en: "Implement Data Guard best practices in the network configuration", fr: "Appliquer les bonnes pratiques Data Guard à la configuration réseau" },
    ],
  },
  "1Z0-076|Creating a Physical Standby Database using SQL and RMAN commands": {
    titleFr: "Créer une base de secours physique avec SQL et RMAN",
    source: SRC_DG,
    objectives: [
      { en: "Configure the primary database and Oracle Net Services to support the creation of the physical standby database and role transition", fr: "Préparer la base principale et Oracle Net pour la création et la transition de rôle" },
      { en: "Create a physical standby database using the RMAN DUPLICATE TARGET DATABASE FOR STANDBY FROM ACTIVE DATABASE command", fr: "Créer une base de secours physique par DUPLICATE … FOR STANDBY FROM ACTIVE DATABASE" },
      { en: "Describe the Nologging Database enhancements", fr: "Décrire les améliorations NOLOGGING de la base" },
      { en: "Demonstrate the use of the DBMS_DBCOMP.DBCOMP PL/SQL procedure", fr: "Mettre en œuvre la procédure DBMS_DBCOMP.DBCOMP" },
      { en: "Explain the creation of a standby database using DBCA", fr: "Expliquer la création d'une base de secours avec DBCA" },
    ],
  },
  "1Z0-076|Using Oracle Active Data Guard: Supported Workloads in Read-Only Standby Databases": {
    titleFr: "Active Data Guard : charges prises en charge en lecture seule",
    source: SRC_DG,
    objectives: [
      { en: "Perform a real-time query to access data on a physical standby database", fr: "Interroger en temps réel une base de secours physique" },
      { en: "Describe the supported workload in Active Data Guard (read-only) instances", fr: "Décrire la charge de travail prise en charge en Active Data Guard" },
    ],
  },
  "1Z0-076|Creating and Managing a Snapshot Standby Database": {
    titleFr: "Créer et gérer une base de secours instantanée",
    source: SRC_DG,
    objectives: [
      { en: "Create a snapshot standby database to satisfy the requirement for a temporary, updatable snapshot of a physical standby database", fr: "Créer une base instantanée pour disposer d'une copie modifiable temporaire" },
      { en: "Convert a snapshot standby database to a physical standby database", fr: "Reconvertir une base instantanée en base de secours physique" },
    ],
  },
  "1Z0-076|Creating a Logical Standby Database": {
    titleFr: "Créer une base de secours logique",
    source: SRC_DG,
    objectives: [
      { en: "Determine when to create a logical standby database", fr: "Déterminer quand créer une base de secours logique" },
      { en: "Create a logical standby database", fr: "Créer une base de secours logique" },
      { en: "Manage SQL Apply filtering", fr: "Gérer le filtrage de SQL Apply" },
    ],
  },
  "1Z0-076|Oracle Data Guard Broker Basics": {
    titleFr: "Principes du Data Guard Broker",
    source: SRC_DG,
    objectives: [
      { en: "Describe the Data Guard broker architecture", fr: "Décrire l'architecture du Broker" },
      { en: "Describe the Data Guard broker components", fr: "Décrire les composants du Broker" },
      { en: "Explain the benefits of the Data Guard broker", fr: "Expliquer les bénéfices du Broker" },
      { en: "Describe Data Guard broker configurations", fr: "Décrire les configurations du Broker" },
    ],
  },
  "1Z0-076|Creating a Data Guard Broker Configuration": {
    titleFr: "Créer une configuration Data Guard Broker",
    source: SRC_DG,
    objectives: [
      { en: "Create a Data Guard broker configuration", fr: "Créer une configuration Broker" },
      { en: "Manage the Data Guard broker configuration", fr: "Gérer la configuration Broker" },
      { en: "List the new Data Guard Broker commands", fr: "Connaître les nouvelles commandes du Broker" },
    ],
  },
  "1Z0-076|Monitoring a Data Guard Broker Configuration": {
    titleFr: "Surveiller une configuration Data Guard Broker",
    source: SRC_DG,
    objectives: [
      { en: "Use Enterprise Manager to manage your Data Guard configuration", fr: "Piloter la configuration depuis Enterprise Manager" },
      { en: "Use DGMGRL to manage your Data Guard configuration", fr: "Piloter la configuration depuis DGMGRL" },
      { en: "List the new Data Guard Broker VALIDATE commands", fr: "Connaître les commandes VALIDATE du Broker" },
    ],
  },
  "1Z0-076|Configuring Data Protection Modes": {
    titleFr: "Configurer les modes de protection des données",
    source: SRC_DG,
    objectives: [
      { en: "Describe the data protection modes", fr: "Décrire les modes de protection des données" },
      { en: "Change the data protection mode of your configuration", fr: "Modifier le mode de protection de la configuration" },
    ],
  },
  "1Z0-076|Performing Role Transitions": {
    titleFr: "Réaliser les transitions de rôle",
    source: SRC_DG,
    objectives: [
      { en: "Explain database roles", fr: "Expliquer les rôles de base de données" },
      { en: "Perform a switchover", fr: "Réaliser un switchover" },
      { en: "Perform a failover", fr: "Réaliser un failover" },
      { en: "Explain how to keep physical standby sessions during role transition", fr: "Maintenir les sessions de la base de secours pendant la transition" },
    ],
  },
  "1Z0-076|Using Flashback Database in a Data Guard Configuration": {
    titleFr: "Flashback Database dans une configuration Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Configure Flashback Database", fr: "Configurer Flashback Database" },
      { en: "Explain the benefits of using Flashback Database in a Data Guard configuration", fr: "Expliquer l'intérêt de Flashback dans une configuration Data Guard" },
      { en: "Explain how replicated restore points work", fr: "Expliquer le fonctionnement des points de restauration répliqués" },
      { en: "Explain how automatic flashback works", fr: "Expliquer le fonctionnement du flashback automatique" },
    ],
  },
  "1Z0-076|Enabling Fast-Start Failover": {
    titleFr: "Activer le Fast-Start Failover",
    source: SRC_DG,
    objectives: [
      { en: "Configure fast-start failover", fr: "Configurer le Fast-Start Failover" },
      { en: "View information about the fast-start failover configuration", fr: "Consulter les informations de configuration du FSFO" },
      { en: "Manage the observer", fr: "Gérer l'observateur" },
      { en: "Perform role changes in a fast-start failover configuration", fr: "Réaliser des transitions de rôle en mode FSFO" },
      { en: "Reinstate the primary database manually", fr: "Réinstancier manuellement l'ancienne base principale" },
    ],
  },
  "1Z0-076|Backup and Recovery Considerations in an Oracle Data Guard Configuration": {
    titleFr: "Sauvegarde et restauration en configuration Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Use Recovery Manager (RMAN) to back up and restore files in a Data Guard configuration", fr: "Sauvegarder et restaurer avec RMAN dans une configuration Data Guard" },
      { en: "Offload backups to a physical standby database", fr: "Décharger les sauvegardes sur la base de secours physique" },
      { en: "Enable RMAN block change tracking for a physical standby database", fr: "Activer le suivi des blocs modifiés côté secours" },
      { en: "Recover your primary database over the network", fr: "Récupérer la base principale par le réseau" },
      { en: "Synchronize the standby database with the primary database in one command", fr: "Resynchroniser la base de secours en une seule commande" },
      { en: "Using automatic block media recovery", fr: "Utiliser la récupération automatique de blocs" },
    ],
  },
  "1Z0-076|Upgrading and Patching Databases in a Data Guard Configuration": {
    titleFr: "Mise à niveau et correctifs en configuration Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Patch and upgrade databases using traditional patching methods", fr: "Corriger et mettre à niveau par les méthodes classiques" },
      { en: "Perform rolling upgrades", fr: "Réaliser des mises à niveau progressives" },
    ],
  },
  "1Z0-076|Optimizing and Tuning a Data Guard Configuration": {
    titleFr: "Optimiser et régler une configuration Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Monitor the configuration performance", fr: "Surveiller les performances de la configuration" },
      { en: "Optimize redo transport for best performance", fr: "Optimiser le transport du redo" },
      { en: "Optimize SQL Apply", fr: "Optimiser SQL Apply" },
      { en: "Describe tunable automatic outage resolution", fr: "Décrire la résolution automatique réglable des pannes" },
      { en: "List the diagnostic tools in the Active Data Guard (read-only) environment", fr: "Connaître les outils de diagnostic en environnement Active Data Guard" },
    ],
  },
  "1Z0-076|Managing Physical Standby Files after Structural Changes to the Primary Database": {
    titleFr: "Gérer les fichiers de secours après un changement structurel",
    source: SRC_DG,
    objectives: [
      { en: "Describe the primary database changes that may or may not require manual intervention on a physical standby database", fr: "Distinguer les changements exigeant ou non une intervention manuelle côté secours" },
    ],
  },
  "1Z0-076|Using Oracle Active Data Guard: Far Sync and Real-Time Cascade": {
    titleFr: "Active Data Guard : Far Sync et cascade temps réel",
    source: SRC_DG,
    objectives: [
      { en: "Use Far Sync to extend zero data loss to intercontinental configurations", fr: "Étendre le zéro perte aux configurations intercontinentales avec Far Sync" },
      { en: "Describe how to create a Far Sync instance using RMAN", fr: "Décrire la création d'une instance Far Sync avec RMAN" },
      { en: "Describe real-time cascade", fr: "Décrire la cascade en temps réel" },
    ],
  },
  "1Z0-076|Enhanced Client Connectivity in a Data Guard Environment": {
    titleFr: "Connectivité client en environnement Data Guard",
    source: SRC_DG,
    objectives: [
      { en: "Configure client connectivity in a Data Guard configuration", fr: "Configurer la connectivité client dans une configuration Data Guard" },
      { en: "Implement failover procedures to automatically redirect clients to a new primary database", fr: "Rediriger automatiquement les clients vers la nouvelle base principale" },
      { en: "Using Application Continuity in a Data Guard environment", fr: "Utiliser Application Continuity en environnement Data Guard" },
    ],
  },

  /* ====================================================================
   * 1Z0-078 — Oracle Database 19c: RAC, ASM and Grid Infrastructure
   * Volet Real Application Clusters
   * ================================================================== */
  "1Z0-078|RAC Databases and Architecture": {
    titleFr: "Bases de données et architecture RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Describe the benefits of Oracle RAC", fr: "Décrire les bénéfices d'Oracle RAC" },
      { en: "Explain the necessity of global resources", fr: "Expliquer la nécessité des ressources globales" },
      { en: "Describe global cache coordination", fr: "Décrire la coordination globale du cache" },
    ],
  },
  "1Z0-078|Installing and Configuring Oracle RAC": {
    titleFr: "Installer et configurer Oracle RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Install the Oracle Database software", fr: "Installer le logiciel Oracle Database" },
      { en: "Create a cluster database", fr: "Créer une base de données en cluster" },
      { en: "Convert a single instance Oracle database to RAC", fr: "Convertir une base mono-instance en RAC" },
    ],
  },
  "1Z0-078|Oracle RAC Administration": {
    titleFr: "Administrer Oracle RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Define redo log files in a RAC environment", fr: "Définir les fichiers de journalisation en environnement RAC" },
      { en: "Define undo tablespaces in a RAC environment", fr: "Définir les tablespaces d'annulation en environnement RAC" },
      { en: "Start and stop RAC databases and instances", fr: "Démarrer et arrêter bases et instances RAC" },
      { en: "Modify initialization parameters in a RAC environment", fr: "Modifier les paramètres d'initialisation en RAC" },
    ],
  },
  "1Z0-078|Managing Backup and Recovery for RAC": {
    titleFr: "Sauvegarde et restauration en RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Configure the RAC database to use ARCHIVELOG mode and the fast recovery area", fr: "Configurer le mode ARCHIVELOG et la zone de récupération rapide" },
      { en: "Configure RMAN for the RAC environment", fr: "Configurer RMAN pour l'environnement RAC" },
    ],
  },
  "1Z0-078|Global Resource Management": {
    titleFr: "Gestion des ressources globales",
    source: SRC_RAC,
    objectives: [
      { en: "Explain the need for global concurrency control", fr: "Expliquer la nécessité d'un contrôle global de la concurrence" },
      { en: "Describe the Global Resource Directory", fr: "Décrire le Global Resource Directory" },
      { en: "Explain how global resources are managed", fr: "Expliquer la gestion des ressources globales" },
      { en: "Explain global enqueue and instance lock management", fr: "Expliquer la gestion des files d'attente globales et des verrous d'instance" },
      { en: "Explain global buffer cache management", fr: "Expliquer la gestion globale du buffer cache" },
      { en: "Explain how to use Affinity to reduce global resource contention", fr: "Réduire la contention globale par l'affinité" },
    ],
  },
  "1Z0-078|RAC Database Monitoring and Tuning": {
    titleFr: "Surveiller et optimiser une base RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Identify RAC-specific tuning components", fr: "Identifier les composants d'optimisation propres à RAC" },
      { en: "Determine RAC-specific wait events, global enqueues and system statistics", fr: "Repérer les attentes, files d'attente globales et statistiques propres à RAC" },
      { en: "Implement the most common RAC tuning practices", fr: "Appliquer les pratiques d'optimisation RAC courantes" },
      { en: "Use the Cluster Database Performance pages", fr: "Exploiter les pages de performance de la base en cluster" },
      { en: "Use the Automatic Workload Repository (AWR) in RAC", fr: "Utiliser AWR en RAC" },
      { en: "Use the Automatic Database Diagnostic Monitor (ADDM) in RAC", fr: "Utiliser ADDM en RAC" },
      { en: "RAC database run-time SGA management", fr: "Gérer la SGA d'une base RAC à l'exécution" },
    ],
  },
  "1Z0-078|Managing High Availability of Services": {
    titleFr: "Haute disponibilité des services",
    source: SRC_RAC,
    objectives: [
      { en: "Configure and manage services in a RAC environment", fr: "Configurer et gérer les services en environnement RAC" },
      { en: "Use services with client applications", fr: "Utiliser les services depuis les applications clientes" },
      { en: "Configure service aggregation and tracing", fr: "Configurer l'agrégation et le traçage des services" },
    ],
  },
  "1Z0-078|Managing High Availability of Connections and Applications": {
    titleFr: "Haute disponibilité des connexions et des applications",
    source: SRC_RAC,
    objectives: [
      { en: "Configure client-side connect-time load balancing and failover", fr: "Configurer l'équilibrage et la bascule côté client à la connexion" },
      { en: "Configure server-side connect-time load balancing", fr: "Configurer l'équilibrage côté serveur à la connexion" },
      { en: "Use the Load Balancing Advisory (LBA)", fr: "Utiliser le Load Balancing Advisory" },
      { en: "Explain the benefits of Fast Application Notification (FAN)", fr: "Expliquer les bénéfices de Fast Application Notification" },
      { en: "Configure Transparent Application Failover (TAF)", fr: "Configurer Transparent Application Failover" },
      { en: "Colocation tag for client routing", fr: "Étiquette de colocalisation pour le routage client" },
      { en: "Transparent Application Continuity", fr: "Transparent Application Continuity" },
      { en: "Dynamic fallback services", fr: "Services de repli dynamiques" },
    ],
  },
  "1Z0-078|Upgrading and Patching Oracle RAC": {
    titleFr: "Mise à niveau et correctifs Oracle RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Plan for rolling patches and rolling upgrades", fr: "Planifier correctifs et mises à niveau progressifs" },
      { en: "Install a patchset with the Oracle Universal Installer (OUI) utility", fr: "Installer un patchset avec Oracle Universal Installer" },
      { en: "Install a patch with the opatch utility", fr: "Installer un correctif avec opatch" },
    ],
  },
  "1Z0-078|Managing Oracle RAC One Node": {
    titleFr: "Gérer Oracle RAC One Node",
    source: SRC_RAC,
    objectives: [
      { en: "Convert an Oracle RAC One Node database to a RAC database", fr: "Convertir une base RAC One Node en base RAC" },
      { en: "Use DBCA to convert a single instance database to a RAC One Node database", fr: "Convertir une base mono-instance en RAC One Node avec DBCA" },
    ],
  },
  "1Z0-078|Using Oracle Database Quality of Service (QoS) Management": {
    titleFr: "Gestion de la qualité de service (QoS)",
    source: SRC_RAC,
    objectives: [
      { en: "Explain the purpose and benefits of using QoS", fr: "Expliquer l'objectif et les bénéfices de la QoS" },
      { en: "Explain how QoS works", fr: "Expliquer le fonctionnement de la QoS" },
    ],
  },
  "1Z0-078|Using Multitenant Architecture in a RAC Environment": {
    titleFr: "Architecture multitenant en environnement RAC",
    source: SRC_RAC,
    objectives: [
      { en: "Describe the multitenant architecture in RAC and non-RAC environments", fr: "Décrire l'architecture multitenant en RAC et hors RAC" },
      { en: "Create a RAC multitenant container database (CDB)", fr: "Créer une CDB en cluster RAC" },
      { en: "Create a pluggable database (PDB) in a RAC cluster database (CDB)", fr: "Créer une PDB dans une CDB en cluster" },
      { en: "Use default CDB and PDB services", fr: "Utiliser les services CDB et PDB par défaut" },
      { en: "Create PDB services to associate PDB services with server pools", fr: "Associer des services PDB à des pools de serveurs" },
      { en: "Automated PDB patching and relocation", fr: "Correctifs et relocalisation automatisés de PDB" },
    ],
  },

  /* --------------------------------------------------------------------
   * 1Z0-078 — Volet Grid Infrastructure, Clusterware et ASM
   * ------------------------------------------------------------------ */
  "1Z0-078|Introduction to Clusterware": {
    titleFr: "Introduction au Clusterware",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the principles and purposes of clusters", fr: "Expliquer les principes et objectifs d'un cluster" },
      { en: "Describe cluster hardware best practices", fr: "Décrire les bonnes pratiques matérielles" },
      { en: "Describe how Grid Plug and Play affects Clusterware", fr: "Décrire l'impact du Grid Plug and Play" },
    ],
  },
  "1Z0-078|Oracle Clusterware Architecture": {
    titleFr: "Architecture d'Oracle Clusterware",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the principles of Oracle Clusterware architecture", fr: "Expliquer l'architecture d'Oracle Clusterware" },
      { en: "Describe Oracle Clusterware startup details", fr: "Décrire la séquence de démarrage de Clusterware" },
    ],
  },
  "1Z0-078|Flex Clusters": {
    titleFr: "Clusters Flex",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the architecture and components of Flex Cluster", fr: "Expliquer l'architecture et les composants d'un Flex Cluster" },
      { en: "Describe the effect of a node failure in a Flex Cluster", fr: "Décrire l'effet d'une panne de nœud dans un Flex Cluster" },
    ],
  },
  "1Z0-078|Grid Infrastructure Pre-Installation Planning and Tasks": {
    titleFr: "Planification et préparation de l'installation",
    source: SRC_GRID,
    objectives: [
      { en: "Plan for Grid Infrastructure installation", fr: "Planifier l'installation de Grid Infrastructure" },
      { en: "Verify system and network requirements", fr: "Vérifier les prérequis système et réseau" },
      { en: "Create groups and users", fr: "Créer les groupes et les utilisateurs" },
      { en: "Create directories", fr: "Créer les répertoires" },
    ],
  },
  "1Z0-078|Grid Infrastructure Installation": {
    titleFr: "Installation de Grid Infrastructure",
    source: SRC_GRID,
    objectives: [
      { en: "Install Grid Infrastructure", fr: "Installer Grid Infrastructure" },
      { en: "Verify the installation", fr: "Vérifier l'installation" },
      { en: "Configure ASM disk groups", fr: "Configurer les groupes de disques ASM" },
      { en: "Optionally install the Grid Infrastructure Management Repository", fr: "Installer, en option, le Grid Infrastructure Management Repository" },
    ],
  },
  "1Z0-078|Managing Cluster Nodes": {
    titleFr: "Gérer les nœuds du cluster",
    source: SRC_GRID,
    objectives: [
      { en: "Perform the prerequisite steps to extend a cluster", fr: "Réaliser les étapes préalables à l'extension d'un cluster" },
      { en: "Delete a node from a cluster", fr: "Retirer un nœud du cluster" },
      { en: "Use DBCA to ADD new nodes to extend the cluster", fr: "Étendre le cluster en ajoutant des nœuds" },
    ],
  },
  "1Z0-078|Traditional Cluster Software Management": {
    titleFr: "Gestion traditionnelle du logiciel de cluster",
    source: SRC_GRID,
    objectives: [
      { en: "Perform the prerequisite steps to extend a cluster", fr: "Effectuer les tâches quotidiennes d'administration de Clusterware" },
      { en: "Perform an Oracle Cluster Registry (OCR) backup and restore", fr: "Sauvegarder et restaurer l'Oracle Cluster Registry" },
      { en: "Manage network settings", fr: "Gérer les paramètres réseau" },
      { en: "Explain the scope and capabilities of what-if command evaluation", fr: "Expliquer la portée de l'évaluation de scénarios hypothétiques" },
      { en: "Cluster secure communication", fr: "Sécuriser la communication du cluster" },
    ],
  },
  "1Z0-078|Policy-Based Cluster Management": {
    titleFr: "Gestion de cluster fondée sur des politiques",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the architecture and components of policy-based cluster management", fr: "Expliquer l'architecture de la gestion par politiques" },
      { en: "Administer server categorization", fr: "Administrer la catégorisation des serveurs" },
      { en: "Administer a policy set", fr: "Administrer un jeu de politiques" },
      { en: "Activate a policy", fr: "Activer une politique" },
    ],
  },
  "1Z0-078|Upgrading and Patching Grid Infrastructure": {
    titleFr: "Mise à niveau et correctifs de Grid Infrastructure",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the types of patches and upgrades available", fr: "Expliquer les types de correctifs et de mises à niveau" },
      { en: "Plan for rolling patches and rolling upgrades", fr: "Planifier correctifs et mises à niveau progressifs" },
      { en: "Compare software versions with the active version", fr: "Comparer les versions logicielles avec la version active" },
      { en: "Install a patchset with Oracle Universal Installer (OUI)", fr: "Installer un patchset avec Oracle Universal Installer" },
      { en: "Install a patch with the opatch utility", fr: "Installer un correctif avec opatch" },
      { en: "Patching Oracle Grid Infrastructure with zero downtime", fr: "Corriger Grid Infrastructure sans interruption de service" },
    ],
  },
  "1Z0-078|Troubleshooting Oracle Clusterware": {
    titleFr: "Dépanner Oracle Clusterware",
    source: SRC_GRID,
    objectives: [
      { en: "Locate the Oracle Clusterware log files and use diagcollection.pl", fr: "Localiser les journaux Clusterware et utiliser diagcollection.pl" },
      { en: "Enable resource debugging", fr: "Activer le débogage des ressources" },
      { en: "Enable component level debugging", fr: "Activer le débogage au niveau des composants" },
      { en: "Troubleshoot the Oracle Cluster Registry (OCR) file", fr: "Dépanner le fichier OCR" },
    ],
  },
  "1Z0-078|Making Applications Highly Available with Oracle Clusterware": {
    titleFr: "Rendre les applications hautement disponibles",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the high availability components of Oracle Clusterware", fr: "Expliquer les composants de haute disponibilité de Clusterware" },
      { en: "Explain policy-managed and administrator-managed databases", fr: "Distinguer bases gérées par politique et par administrateur" },
      { en: "Create an application Virtual IP (VIP)", fr: "Créer une VIP applicative" },
      { en: "Manage application resources", fr: "Gérer les ressources applicatives" },
    ],
  },
  "1Z0-078|Introduction to Automatic Storage Management (ASM) Administration": {
    titleFr: "Introduction à l'administration ASM",
    source: SRC_GRID,
    objectives: [
      { en: "Explain the Automatic Storage Management (ASM) architecture", fr: "Expliquer l'architecture d'ASM" },
      { en: "Describe the ASM components", fr: "Décrire les composants d'ASM" },
    ],
  },
  "1Z0-078|Administering ASM Instances": {
    titleFr: "Administrer les instances ASM",
    source: SRC_GRID,
    objectives: [
      { en: "Explain and apply initialization parameters for ASM instances", fr: "Expliquer et appliquer les paramètres d'initialisation ASM" },
      { en: "Manage ASM instances and associated processes", fr: "Gérer les instances ASM et leurs processus" },
      { en: "Monitor ASM instances using the V$ASM dynamic performance views", fr: "Surveiller les instances ASM avec les vues V$ASM" },
    ],
  },
  "1Z0-078|Flex ASM": {
    titleFr: "Flex ASM",
    source: SRC_GRID,
    objectives: [
      { en: "Describe the architecture and components of Flex ASM", fr: "Décrire l'architecture et les composants de Flex ASM" },
      { en: "Install and configure Flex ASM", fr: "Installer et configurer Flex ASM" },
      { en: "Manage Flex ASM", fr: "Gérer Flex ASM" },
    ],
  },
  "1Z0-078|Administering ASM Disk Groups": {
    titleFr: "Administrer les groupes de disques ASM",
    source: SRC_GRID,
    objectives: [
      { en: "Create and delete ASM disk groups", fr: "Créer et supprimer des groupes de disques ASM" },
      { en: "Set the attributes of an existing ASM disk group", fr: "Définir les attributs d'un groupe de disques existant" },
      { en: "Perform ongoing maintenance tasks on ASM disk groups", fr: "Réaliser les tâches de maintenance courantes" },
      { en: "Explain key performance and scalability considerations for ASM disk groups", fr: "Expliquer les enjeux de performance et de montée en charge" },
    ],
  },
  "1Z0-078|Administering ASM Files, Directories and Templates": {
    titleFr: "Administrer fichiers, répertoires et modèles ASM",
    source: SRC_GRID,
    objectives: [
      { en: "Use different client tools to access ASM files", fr: "Accéder aux fichiers ASM avec les outils clients" },
      { en: "Describe the format of a fully qualified ASM file name", fr: "Décrire le format d'un nom de fichier ASM complet" },
      { en: "Explain how ASM files, directories and aliases are created and managed", fr: "Expliquer la création et la gestion des fichiers, répertoires et alias" },
      { en: "Describe and manage disk group templates", fr: "Décrire et gérer les modèles de groupes de disques" },
    ],
  },
  "1Z0-078|Administering Oracle CloudFS": {
    titleFr: "Administrer Oracle CloudFS",
    source: SRC_GRID,
    objectives: [
      { en: "Administer ASM Dynamic Volume Manager", fr: "Administrer ASM Dynamic Volume Manager" },
      { en: "Manage ASM volumes", fr: "Gérer les volumes ASM" },
      { en: "Implement ASM Cluster File System (ACFS)", fr: "Mettre en œuvre le système de fichiers en cluster ACFS" },
      { en: "Use ACFS snapshots", fr: "Utiliser les instantanés ACFS" },
    ],
  },
  "1Z0-078|Oracle CloudFS Advanced Topics": {
    titleFr: "Oracle CloudFS — sujets avancés",
    source: SRC_GRID,
    objectives: [
      { en: "Configure ACFS auditing", fr: "Configurer l'audit ACFS" },
      { en: "Implement ACFS encryption", fr: "Mettre en œuvre le chiffrement ACFS" },
      { en: "Configure and manage ACFS replication", fr: "Configurer et gérer la réplication ACFS" },
      { en: "Implement ACFS tagging", fr: "Mettre en œuvre l'étiquetage ACFS" },
      { en: "Configure NFS high availability", fr: "Configurer la haute disponibilité NFS" },
    ],
  },
};
