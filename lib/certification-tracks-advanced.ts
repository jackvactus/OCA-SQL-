import type { CertificationTrack } from "./certification-tracks";

/**
 * Parcours de spécialisation Oracle Database 19c.
 *
 * Les domaines reproduisent les **sujets d'examen officiels** publiés par
 * Oracle University, dans leur formulation anglaise d'origine : c'est le
 * libellé qui figure sur la fiche d'examen et sur le relevé de score.
 *
 * Formats relevés sur les fiches officielles :
 *   1Z0-084 — 55 questions · 90 min · 60 %
 *   1Z0-076 — 74 questions · 120 min · 61 %
 *   1Z0-078 — 77 questions · 120 min · 65 %
 */
export const advancedTracks: CertificationTrack[] = [
  {
    id: "ocp-tuning",
    shortLabel: "Tuning",
    examCode: "1Z0-084",
    certification: "Oracle Database 19c Performance Management and Tuning Certified Professional",
    examTitle: "Oracle Database 19c: Performance Management and Tuning",
    title: {
      fr: "Gestion et optimisation des performances Oracle 19c",
      en: "Oracle Database 19c performance management and tuning",
    },
    summary: {
      fr: "Appliquer une méthodologie d'optimisation plutôt que de régler à l'intuition : modèle de temps, événements d'attente, vues V$, Statspack, AWR, ASH et ADDM, plans d'exécution, statistiques, conseillers, puis réglage du shared pool, du buffer cache, du PGA et des fonctionnalités In-Memory.",
      en: "Apply a tuning methodology rather than tuning by intuition: the time model, wait events, V$ views, Statspack, AWR, ASH and ADDM, execution plans, statistics, advisors, then shared pool, buffer cache, PGA and In-Memory tuning.",
    },
    audience: {
      fr: "Administrateurs confirmés maîtrisant l'administration quotidienne, le langage SQL, les plans d'exécution et les statistiques.",
      en: "Experienced administrators comfortable with day-to-day administration, SQL, execution plans and statistics.",
    },
    questions: 55,
    durationMinutes: 90,
    passScorePercent: 60,
    priceUsd: 245,
    status: "available",
    accent: "rose",
    prerequisite: {
      fr: "Aucun formellement. L'examen suppose une connaissance approfondie de l'architecture Oracle Database et une pratique quotidienne de l'administration.",
      en: "None formally. The exam assumes deep knowledge of the Oracle Database architecture and daily administration practice.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-19c-performance-management-and-tuning/pexam_1Z0-084",
    officialLearningUrl: "https://mylearn.oracle.com/ou/learning-path/oracle-database-19c-administration/88357",
    groups: [
      {
        label: { fr: "Méthode, diagnostic et instrumentation", en: "Method, diagnosis and instrumentation" },
        domains: [
          { title: "Basic Tuning and Diagnostic Methods", moduleIds: [], sessionIds: ["tun-session-1"] },
          { title: "Tuning Methodologies and Lifecycle Tuning Phases", moduleIds: [], sessionIds: ["tun-session-1"] },
          { title: "Describing the Time Model", moduleIds: [], sessionIds: ["tun-session-1"] },
          { title: "Explaining Wait Events", moduleIds: [], sessionIds: ["tun-session-3"] },
          { title: "Diagnosing Performance Issues Using V$ Views", moduleIds: [], sessionIds: ["tun-session-3"] },
          { title: "Installing, Configuring and Using Statspack", moduleIds: [], sessionIds: ["tun-session-9"] },
          { title: "Using the Alert Log and Trace Files to Monitor Performance", moduleIds: [], sessionIds: ["tun-session-9"] },
        ],
      },
      {
        label: { fr: "Métriques, alertes et outils AWR", en: "Metrics, alerts and AWR-based tools" },
        domains: [
          { title: "Monitoring Performance Using Metric Thresholds and Alerts", moduleIds: [], sessionIds: ["tun-session-3"] },
          { title: "Using AWR Baselines to Monitor Performance", moduleIds: [], sessionIds: ["tun-session-2"] },
          { title: "Diagnosing Performance Issues Using ADDM", moduleIds: [], sessionIds: ["tun-session-2"] },
          { title: "Diagnosing Performance Issues Using ASH Reports", moduleIds: [], sessionIds: ["tun-session-2"] },
          { title: "Using Automated Maintenance Tasks to Manage Performance", moduleIds: [], sessionIds: ["tun-session-5"] },
          { title: "Implementing Real-Time Database Operations Monitoring", moduleIds: [], sessionIds: ["tun-session-9"] },
          { title: "Configuring and Using Database Application Performance Monitoring Services", moduleIds: [], sessionIds: ["tun-session-9"] },
        ],
      },
      {
        label: { fr: "Instructions SQL et optimiseur", en: "SQL statements and the optimizer" },
        domains: [
          { title: "Understanding the Phases of SQL Statement Processing", moduleIds: [], sessionIds: ["tun-session-4"] },
          { title: "Interpreting Execution Plans", moduleIds: [], sessionIds: ["tun-session-4"] },
          { title: "Using SQL Trace and Optimizer Trace Output to Identify Poorly Performing SQL", moduleIds: [], sessionIds: ["tun-session-9"] },
          { title: "Tracking Adaptive and Dynamic Execution Plans", moduleIds: [], sessionIds: ["tun-session-4"] },
          { title: "Monitoring Automatic Reoptimization and SQL Plan Directives", moduleIds: [], sessionIds: ["tun-session-4"] },
          { title: "Explaining How Statistics Influence the Optimizer", moduleIds: [], sessionIds: ["tun-session-5"] },
          { title: "Setting Parameters to Influence the Optimizer", moduleIds: [], sessionIds: ["tun-session-5"] },
        ],
      },
      {
        label: { fr: "Réduire le coût des opérations SQL", en: "Reducing the cost of SQL operations" },
        domains: [
          { title: "Shrinking Segments", moduleIds: [], sessionIds: ["tun-session-8"] },
          { title: "Managing Chaining and Migration", moduleIds: [], sessionIds: ["tun-session-8"] },
          { title: "Configuring Index and Table Performance Options", moduleIds: [], sessionIds: ["tun-session-8"] },
          { title: "Configuring Table Compression", moduleIds: [], sessionIds: ["tun-session-8"] },
          { title: "Diagnosing and Resolving Space-Related Issues", moduleIds: [], sessionIds: ["tun-session-8"] },
        ],
      },
      {
        label: { fr: "Gestion des performances SQL et tests réels", en: "SQL performance management and real application testing" },
        domains: [
          { title: "Managing Optimizer Statistics", moduleIds: [], sessionIds: ["tun-session-5"] },
          { title: "Using the Optimizer Statistics Advisor", moduleIds: [], sessionIds: ["tun-session-5"] },
          { title: "Using the SQL Access and SQL Tuning Advisors", moduleIds: [], sessionIds: ["tun-session-6"] },
          { title: "Using SQL Plan Management to Tune SQL Statements", moduleIds: [], sessionIds: ["tun-session-6"] },
          { title: "Using SQL Performance Analyzer to Test Database Changes", moduleIds: [], sessionIds: ["tun-session-6"] },
          { title: "Using Database Replay to Verify the Impact of System Changes", moduleIds: [], sessionIds: ["tun-session-6"] },
        ],
      },
      {
        label: { fr: "Mémoire, cache et In-Memory", en: "Memory, cache and In-Memory" },
        domains: [
          { title: "Diagnosing and Resolving Shared Pool Performance Issues", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Managing and Tuning the Result Cache", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Diagnosing and Resolving Buffer Cache Performance Issues", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Diagnosing Database I/O Issues", moduleIds: [], sessionIds: ["tun-session-8"] },
          { title: "Configuring Large Table Caching and Database Smart Flash Cache", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Diagnosing and Resolving PGA and Temporary Tablespace Issues", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Configuring Automatic Shared Memory and Automatic Memory Management", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Configuring and Using the In-Memory Column Store", moduleIds: [], sessionIds: ["tun-session-10"] },
          { title: "Using the In-Memory Column Store with Other Database Features", moduleIds: [], sessionIds: ["tun-session-10"] },
        ],
      },
    ],
  },

  {
    id: "ocp-dataguard",
    shortLabel: "Data Guard",
    examCode: "1Z0-076",
    certification: "Oracle Database 19c Data Guard Administration Certified Professional",
    examTitle: "Oracle Database 19c: Data Guard Administration",
    title: {
      fr: "Administration Data Guard Oracle 19c",
      en: "Oracle Database 19c Data Guard administration",
    },
    summary: {
      fr: "Créer une solution de haute disponibilité et de reprise après sinistre : bases de secours physiques, logiques et instantanées, Active Data Guard, Broker, modes de protection, transitions de rôle, Fast-Start Failover, Far Sync et continuité applicative.",
      en: "Build a high-availability and disaster-recovery solution: physical, logical and snapshot standby databases, Active Data Guard, the Broker, protection modes, role transitions, Fast-Start Failover, Far Sync and Application Continuity.",
    },
    audience: {
      fr: "Administrateurs responsables de la reprise après sinistre. Oracle recommande 4 à 5 ans d'expérience en administration, dont 2 à 3 avec Data Guard.",
      en: "Administrators responsible for disaster recovery. Oracle recommends 4 to 5 years of administration experience, including 2 to 3 with Data Guard.",
    },
    questions: 74,
    durationMinutes: 120,
    passScorePercent: 61,
    priceUsd: 245,
    status: "available",
    accent: "violet",
    prerequisite: {
      fr: "Aucun formellement. Oracle recommande 4 à 5 ans d'expérience en administration de bases, dont 2 à 3 ans avec Data Guard.",
      en: "None formally. Oracle recommends 4 to 5 years of database administration experience, including 2 to 3 years with Data Guard.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-19c-data-guard-administration/pexam_1Z0-076",
    officialLearningUrl: "https://mylearn.oracle.com/ou/learning-path/oracle-database-19c-administration/88357",
    groups: [
      {
        label: { fr: "Principes et réseau", en: "Fundamentals and networking" },
        domains: [
          { title: "Describing the Oracle Data Guard Architecture", moduleIds: [], sessionIds: ["dg-session-1"] },
          { title: "Explaining the Relevance of Physical, Logical and Snapshot Standby Databases", moduleIds: [], sessionIds: ["dg-session-1"] },
          { title: "Explaining the Benefits of Implementing Oracle Data Guard", moduleIds: [], sessionIds: ["dg-session-1"] },
          { title: "Explaining the Use of Data Guard with Oracle Multitenant Databases", moduleIds: [], sessionIds: ["dg-session-1"] },
          { title: "Understanding Oracle Net Services Basics", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Implementing Data Guard Best Practices in the Network Configuration", moduleIds: [], sessionIds: ["dg-session-2"] },
        ],
      },
      {
        label: { fr: "Création des bases de secours", en: "Creating standby databases" },
        domains: [
          { title: "Configuring the Primary Database and Oracle Net Services for Standby Creation and Role Transition", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Creating a Physical Standby with RMAN DUPLICATE ... FOR STANDBY FROM ACTIVE DATABASE", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Describing Nologging Database Enhancements", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Demonstrating the Use of the DBMS_DBCOMP.DBCOMP PL/SQL Procedure", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Explaining Standby Creation Using DBCA", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Determining When to Create a Logical Standby Database", moduleIds: [], sessionIds: ["dg-session-3"] },
          { title: "Creating a Logical Standby Database and Managing SQL Apply Filtering", moduleIds: [], sessionIds: ["dg-session-3"] },
          { title: "Creating and Converting a Snapshot Standby Database", moduleIds: [], sessionIds: ["dg-session-3"] },
        ],
      },
      {
        label: { fr: "Active Data Guard et transport", en: "Active Data Guard and transport" },
        domains: [
          { title: "Performing Real-Time Query Against a Physical Standby Database", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Describing the Workload Supported on Active Data Guard Instances", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Using Far Sync to Extend Zero Data Loss to Intercontinental Configurations", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Describing Real-Time Cascade", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Describing and Changing the Data Protection Modes", moduleIds: [], sessionIds: ["dg-session-4"] },
        ],
      },
      {
        label: { fr: "Data Guard Broker", en: "Data Guard Broker" },
        domains: [
          { title: "Describing the Data Guard Broker Architecture and Components", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Explaining the Benefits and Configurations of the Data Guard Broker", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Creating and Managing a Data Guard Broker Configuration", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Using DGMGRL and Enterprise Manager to Manage the Configuration", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Listing the New Data Guard Broker VALIDATE Commands", moduleIds: [], sessionIds: ["dg-session-5"] },
        ],
      },
      {
        label: { fr: "Transitions de rôle et Flashback", en: "Role transitions and Flashback" },
        domains: [
          { title: "Explaining Database Roles and Performing a Switchover", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Performing a Failover", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Explaining How to Preserve Physical Standby Sessions Through Role Transition", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Configuring Fast-Start Failover and Managing the Observer", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Reinstating the Former Primary Database Manually", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Configuring Flashback Database and Explaining Its Benefits with Data Guard", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Explaining Replicated Restore Points and Automatic Flashback", moduleIds: [], sessionIds: ["dg-session-6"] },
        ],
      },
      {
        label: { fr: "Sauvegarde, correctifs, optimisation et exploitation", en: "Backup, patching, tuning and operations" },
        domains: [
          { title: "Using RMAN to Back Up and Restore Files in a Data Guard Configuration", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Offloading Backups to a Physical Standby Database", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Enabling RMAN Block Change Tracking on a Physical Standby", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Recovering the Primary Database Over the Network", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Using Automatic Block Media Recovery", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Patching and Upgrading Databases Using Rolling Upgrades", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Monitoring and Tuning Redo Transport and SQL Apply", moduleIds: [], sessionIds: ["dg-session-8"] },
          { title: "Describing Tunable Automatic Outage Resolution", moduleIds: [], sessionIds: ["dg-session-8"] },
          { title: "Managing Physical Standby Files After Structural Changes on the Primary", moduleIds: [], sessionIds: ["dg-session-8"] },
          { title: "Configuring Client Connectivity and Failover Procedures", moduleIds: [], sessionIds: ["dg-session-8"] },
          { title: "Using Application Continuity in a Data Guard Environment", moduleIds: [], sessionIds: ["dg-session-8"] },
        ],
      },
    ],
  },

  {
    id: "ocp-rac",
    shortLabel: "RAC / ASM",
    examCode: "1Z0-078",
    certification: "Oracle Database 19c RAC, ASM and Grid Infrastructure Certified Professional",
    examTitle: "Oracle Database 19c: RAC, ASM and Grid Infrastructure Administration",
    title: {
      fr: "RAC, ASM et Grid Infrastructure Oracle 19c",
      en: "Oracle Database 19c RAC, ASM and Grid Infrastructure",
    },
    summary: {
      fr: "L'infrastructure en cluster : Grid Infrastructure et Clusterware, OCR et voting disks, stockage ASM avec groupes de disques et redondance, ACFS, Real Application Clusters, Cache Fusion, SCAN, services et bascule applicative. Le seuil de réussite le plus élevé de la filière — 65 %.",
      en: "Clustered infrastructure: Grid Infrastructure and Clusterware, OCR and voting disks, ASM storage with disk groups and redundancy, ACFS, Real Application Clusters, Cache Fusion, SCAN, services and application failover. The highest pass mark in the track — 65%.",
    },
    audience: {
      fr: "Administrateurs exploitant des bases critiques en cluster, et architectes d'infrastructure Oracle.",
      en: "Administrators running mission-critical clustered databases, and Oracle infrastructure architects.",
    },
    questions: 77,
    durationMinutes: 120,
    passScorePercent: 65,
    priceUsd: 245,
    status: "available",
    accent: "teal",
    prerequisite: {
      fr: "Aucun formellement. C'est l'examen au seuil le plus élevé de la filière Database — 65 %.",
      en: "None formally. It carries the highest pass mark in the Database track — 65%.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-19c-rac-asm-and-grid-infrastructure-administration/pexam_1Z0-078",
    officialLearningUrl: "https://mylearn.oracle.com/ou/learning-path/oracle-database-19c-administration/88357",
    groups: [
      {
        label: { fr: "Grid Infrastructure et Clusterware", en: "Grid Infrastructure and Clusterware" },
        domains: [
          { title: "Explaining Oracle Clusterware and Grid Infrastructure Architecture", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Installing and Configuring Grid Infrastructure for a Cluster", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Administering Oracle Clusterware with CRSCTL and SRVCTL", moduleIds: [], sessionIds: ["rac-session-2"] },
          { title: "Managing the Oracle Cluster Registry and Voting Disks", moduleIds: [], sessionIds: ["rac-session-2"] },
          { title: "Managing Cluster Nodes, Resources and Startup Sequence", moduleIds: [], sessionIds: ["rac-session-2"] },
          { title: "Patching and Upgrading Grid Infrastructure", moduleIds: [], sessionIds: ["rac-session-6"] },
        ],
      },
      {
        label: { fr: "Automatic Storage Management", en: "Automatic Storage Management" },
        domains: [
          { title: "Explaining ASM Architecture, Instances and Processes", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Creating and Administering ASM Disk Groups", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Managing ASM Redundancy and Failure Groups", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Managing ASM Rebalance Operations", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Using ASM Files, Directories, Aliases and Templates", moduleIds: [], sessionIds: ["rac-session-4"] },
          { title: "Administering the ASM Cluster File System (ACFS)", moduleIds: [], sessionIds: ["rac-session-4"] },
          { title: "Using ASMCMD and Monitoring ASM", moduleIds: [], sessionIds: ["rac-session-4"] },
        ],
      },
      {
        label: { fr: "Real Application Clusters", en: "Real Application Clusters" },
        domains: [
          { title: "Explaining RAC Architecture and Cache Fusion", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Creating and Administering a RAC Database", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Managing Database Services in a RAC Environment", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Configuring SCAN Listeners, VIPs and Client Connectivity", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Configuring Transparent Application Failover and Application Continuity", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Monitoring and Tuning RAC Global Cache Performance", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Backing Up and Recovering a RAC Database", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Troubleshooting Cluster and RAC Problems", moduleIds: [], sessionIds: ["rac-session-6"] },
        ],
      },
    ],
  },
];
