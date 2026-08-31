import type { CertificationTrack } from "./certification-tracks";

/**
 * Parcours de spécialisation Oracle Database 19c.
 *
 * Les domaines reproduisent **exactement** les sujets d'examen officiels
 * publiés par Oracle University, dans leur formulation anglaise d'origine et
 * dans leur ordre de publication : c'est le libellé qui figure sur la fiche
 * d'examen et sur le relevé de score. Leur traduction française et leurs
 * objectifs détaillés vivent dans `lib/exam-objectives-advanced.ts`.
 *
 * Formats relevés sur les fiches officielles :
 *   1Z0-084 — 55 questions · 90 min  · 60 %  · 16 domaines
 *   1Z0-076 — 74 questions · 120 min · 61 %  · 19 domaines
 *   1Z0-078 — 77 questions · 120 min · 65 %  · 30 domaines (RAC + Grid Infrastructure)
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
      fr: "Appliquer une méthodologie d'optimisation plutôt que de régler à l'intuition : modèle de temps, événements d'attente, vues V$, Statspack, AWR, ASH et ADDM, plans d'exécution, statistiques, conseillers, réduction du coût des opérations SQL, Real Application Testing, puis réglage du shared pool, du buffer cache, de la PGA et des fonctionnalités In-Memory.",
      en: "Apply a tuning methodology rather than tuning by intuition: the time model, wait events, V$ views, Statspack, AWR, ASH and ADDM, execution plans, statistics, advisors, reducing the cost of SQL operations, Real Application Testing, then shared pool, buffer cache, PGA and In-Memory tuning.",
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
    officialDocsUrl: "https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/",
    groups: [
      {
        label: { fr: "Diagnostic et instrumentation", en: "Diagnosis and instrumentation" },
        domains: [
          { title: "Basic Tuning Diagnostics", moduleIds: [], sessionIds: ["tun-session-1", "tun-session-3"] },
          { title: "Using Statspack", moduleIds: [], sessionIds: ["tun-session-9"] },
          { title: "Using Log and Trace Files to Monitor Performance", moduleIds: [], sessionIds: ["tun-session-9"] },
          { title: "Using Metrics, Alerts and Baselines", moduleIds: [], sessionIds: ["tun-session-3", "tun-session-2"] },
          { title: "Using AWR-Based Tools", moduleIds: [], sessionIds: ["tun-session-2"] },
          { title: "Performing Oracle Database Application Monitoring", moduleIds: [], sessionIds: ["tun-session-9"] },
        ],
      },
      {
        label: { fr: "SQL, optimiseur et plans", en: "SQL, optimizer and plans" },
        domains: [
          { title: "Identifying Problem SQL Statements", moduleIds: [], sessionIds: ["tun-session-4", "tun-session-9"] },
          { title: "Influencing the Optimizer", moduleIds: [], sessionIds: ["tun-session-5"] },
          { title: "Reducing the Cost of SQL Operations", moduleIds: [], sessionIds: ["tun-session-11"] },
          { title: "Using Real Application Testing", moduleIds: [], sessionIds: ["tun-session-12"] },
          { title: "Managing SQL Performance", moduleIds: [], sessionIds: ["tun-session-5", "tun-session-6"] },
        ],
      },
      {
        label: { fr: "Mémoire, caches et In-Memory", en: "Memory, caches and In-Memory" },
        domains: [
          { title: "Tuning the Shared Pool", moduleIds: [], sessionIds: ["tun-session-7", "tun-session-10"] },
          { title: "Tuning the Buffer Cache", moduleIds: [], sessionIds: ["tun-session-7", "tun-session-13", "tun-session-8"] },
          { title: "Tuning PGA", moduleIds: [], sessionIds: ["tun-session-13"] },
          { title: "Using Automatic Memory Management", moduleIds: [], sessionIds: ["tun-session-7"] },
          { title: "Using In-Memory Features", moduleIds: [], sessionIds: ["tun-session-10"] },
        ],
      },
    ],
  },

  {
    id: "ocp-dataguard",
    shortLabel: "Data Guard",
    examCode: "1Z0-076",
    certification: "Oracle Database 19c Data Guard Administrator Certified Professional",
    examTitle: "Oracle Database 19c: Data Guard Administration",
    title: {
      fr: "Administration Oracle Data Guard 19c",
      en: "Oracle Data Guard 19c administration",
    },
    summary: {
      fr: "Concevoir et exploiter une solution de haute disponibilité et de reprise après sinistre : architecture, bases de secours physiques, logiques et instantanées, Oracle Net, modes de protection, Active Data Guard, Far Sync, cascade temps réel, Broker, transitions de rôle, Fast-Start Failover, Flashback, sauvegarde déchargée, mise à niveau progressive, optimisation et continuité applicative.",
      en: "Design and operate a high-availability and disaster-recovery solution: architecture, physical, logical and snapshot standbys, Oracle Net, protection modes, Active Data Guard, Far Sync, real-time cascade, the Broker, role transitions, Fast-Start Failover, Flashback, offloaded backup, rolling upgrades, tuning and application continuity.",
    },
    audience: {
      fr: "Administrateurs de bases de données responsables de la reprise après sinistre, avec 4 à 5 ans d'expérience dont 2 à 3 sur Data Guard.",
      en: "Database administrators responsible for disaster recovery, with 4–5 years of experience including 2–3 on Data Guard.",
    },
    questions: 74,
    durationMinutes: 120,
    passScorePercent: 61,
    priceUsd: 245,
    status: "available",
    accent: "violet",
    prerequisite: {
      fr: "Aucun formellement. Oracle recommande 4 à 5 ans d'administration de bases de données, dont 2 à 3 ans de pratique de Data Guard.",
      en: "None formally. Oracle recommends 4–5 years of database administration, including 2–3 years of hands-on Data Guard.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-19c-data-guard-administration/pexam_1Z0-076",
    officialDocsUrl: "https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/",
    groups: [
      {
        label: { fr: "Concepts et mise en place", en: "Concepts and setup" },
        domains: [
          { title: "Oracle Data Guard Basics", moduleIds: [], sessionIds: ["dg-session-1"] },
          { title: "Managing Oracle Net Services in a Data Guard Environment", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Creating a Physical Standby Database using SQL and RMAN commands", moduleIds: [], sessionIds: ["dg-session-2"] },
          { title: "Using Oracle Active Data Guard: Supported Workloads in Read-Only Standby Databases", moduleIds: [], sessionIds: ["dg-session-9"] },
          { title: "Creating and Managing a Snapshot Standby Database", moduleIds: [], sessionIds: ["dg-session-1", "dg-session-3"] },
          { title: "Creating a Logical Standby Database", moduleIds: [], sessionIds: ["dg-session-3"] },
        ],
      },
      {
        label: { fr: "Broker, protection et transitions de rôle", en: "Broker, protection and role transitions" },
        domains: [
          { title: "Oracle Data Guard Broker Basics", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Creating a Data Guard Broker Configuration", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Monitoring a Data Guard Broker Configuration", moduleIds: [], sessionIds: ["dg-session-5"] },
          { title: "Configuring Data Protection Modes", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Performing Role Transitions", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Using Flashback Database in a Data Guard Configuration", moduleIds: [], sessionIds: ["dg-session-6"] },
          { title: "Enabling Fast-Start Failover", moduleIds: [], sessionIds: ["dg-session-6"] },
        ],
      },
      {
        label: { fr: "Exploitation, optimisation et clients", en: "Operations, tuning and clients" },
        domains: [
          { title: "Backup and Recovery Considerations in an Oracle Data Guard Configuration", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Upgrading and Patching Databases in a Data Guard Configuration", moduleIds: [], sessionIds: ["dg-session-7"] },
          { title: "Optimizing and Tuning a Data Guard Configuration", moduleIds: [], sessionIds: ["dg-session-8", "dg-session-10"] },
          { title: "Managing Physical Standby Files after Structural Changes to the Primary Database", moduleIds: [], sessionIds: ["dg-session-8"] },
          { title: "Using Oracle Active Data Guard: Far Sync and Real-Time Cascade", moduleIds: [], sessionIds: ["dg-session-4"] },
          { title: "Enhanced Client Connectivity in a Data Guard Environment", moduleIds: [], sessionIds: ["dg-session-11"] },
        ],
      },
    ],
  },

  {
    id: "ocp-rac",
    shortLabel: "RAC & Grid",
    examCode: "1Z0-078",
    certification: "Oracle Database 19c RAC, ASM and Grid Infrastructure Administrator Certified Professional",
    examTitle: "Oracle Database 19c: RAC, ASM and Grid Infrastructure Administration",
    title: {
      fr: "RAC, ASM et Grid Infrastructure Oracle 19c",
      en: "Oracle Database 19c RAC, ASM and Grid Infrastructure",
    },
    summary: {
      fr: "Installer, configurer, sauvegarder, surveiller et optimiser un cluster Oracle : Clusterware et Grid Infrastructure, Flex Clusters, gestion par politiques, ASM et Flex ASM, Oracle CloudFS et ACFS, puis Real Application Clusters — Cache Fusion, ressources globales, services, haute disponibilité des connexions, RAC One Node, qualité de service et multitenant en cluster.",
      en: "Install, configure, back up, monitor and tune an Oracle cluster: Clusterware and Grid Infrastructure, Flex Clusters, policy-based management, ASM and Flex ASM, Oracle CloudFS and ACFS, then Real Application Clusters — Cache Fusion, global resources, services, connection high availability, RAC One Node, quality of service and multitenant in a cluster.",
    },
    audience: {
      fr: "Administrateurs système de production et administrateurs de bases de données ayant 12 à 18 mois de pratique de RAC, ASM et Grid Infrastructure.",
      en: "Production system administrators and DBAs with 12–18 months of hands-on RAC, ASM and Grid Infrastructure experience.",
    },
    questions: 77,
    durationMinutes: 120,
    passScorePercent: 65,
    priceUsd: 245,
    status: "available",
    accent: "teal",
    prerequisite: {
      fr: "Aucun formellement. Oracle recommande 12 à 18 mois d'expérience sur RAC, ASM et Grid Infrastructure.",
      en: "None formally. Oracle recommends 12–18 months of experience with RAC, ASM and Grid Infrastructure.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-19c-rac-asm-and-grid-infrastructure-administration/pexam_1Z0-078",
    officialDocsUrl: "https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/",
    groups: [
      {
        label: { fr: "Clusterware et Grid Infrastructure", en: "Clusterware and Grid Infrastructure" },
        domains: [
          { title: "Introduction to Clusterware", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Oracle Clusterware Architecture", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Flex Clusters", moduleIds: [], sessionIds: ["rac-session-12"] },
          { title: "Grid Infrastructure Pre-Installation Planning and Tasks", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Grid Infrastructure Installation", moduleIds: [], sessionIds: ["rac-session-1"] },
          { title: "Managing Cluster Nodes", moduleIds: [], sessionIds: ["rac-session-2"] },
          { title: "Traditional Cluster Software Management", moduleIds: [], sessionIds: ["rac-session-2"] },
          { title: "Policy-Based Cluster Management", moduleIds: [], sessionIds: ["rac-session-12"] },
          { title: "Upgrading and Patching Grid Infrastructure", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Troubleshooting Oracle Clusterware", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Making Applications Highly Available with Oracle Clusterware", moduleIds: [], sessionIds: ["rac-session-12"] },
        ],
      },
      {
        label: { fr: "ASM, Flex ASM et Oracle CloudFS", en: "ASM, Flex ASM and Oracle CloudFS" },
        domains: [
          { title: "Introduction to Automatic Storage Management (ASM) Administration", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Administering ASM Instances", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Flex ASM", moduleIds: [], sessionIds: ["rac-session-7"] },
          { title: "Administering ASM Disk Groups", moduleIds: [], sessionIds: ["rac-session-3"] },
          { title: "Administering ASM Files, Directories and Templates", moduleIds: [], sessionIds: ["rac-session-4"] },
          { title: "Administering Oracle CloudFS", moduleIds: [], sessionIds: ["rac-session-4"] },
          { title: "Oracle CloudFS Advanced Topics", moduleIds: [], sessionIds: ["rac-session-7"] },
        ],
      },
      {
        label: { fr: "Real Application Clusters", en: "Real Application Clusters" },
        domains: [
          { title: "RAC Databases and Architecture", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Installing and Configuring Oracle RAC", moduleIds: [], sessionIds: ["rac-session-8"] },
          { title: "Oracle RAC Administration", moduleIds: [], sessionIds: ["rac-session-8"] },
          { title: "Managing Backup and Recovery for RAC", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Global Resource Management", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "RAC Database Monitoring and Tuning", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Managing High Availability of Services", moduleIds: [], sessionIds: ["rac-session-5"] },
          { title: "Managing High Availability of Connections and Applications", moduleIds: [], sessionIds: ["rac-session-9"] },
          { title: "Upgrading and Patching Oracle RAC", moduleIds: [], sessionIds: ["rac-session-6"] },
          { title: "Managing Oracle RAC One Node", moduleIds: [], sessionIds: ["rac-session-10"] },
          { title: "Using Oracle Database Quality of Service (QoS) Management", moduleIds: [], sessionIds: ["rac-session-10"] },
          { title: "Using Multitenant Architecture in a RAC Environment", moduleIds: [], sessionIds: ["rac-session-11"] },
        ],
      },
    ],
  },
];
