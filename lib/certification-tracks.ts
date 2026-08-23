import type { Locale } from "./i18n/locale";

/**
 * Parcours de certification Oracle Database proposés par la plateforme.
 *
 * Les intitulés de certification, codes d'examen, formats (nombre de questions,
 * durée, seuil de réussite) et libellés de domaines proviennent des fiches
 * d'examen officielles Oracle University. Les domaines sont conservés dans leur
 * formulation anglaise d'origine : c'est le libellé qui figure sur la fiche
 * d'examen et sur le relevé de score, le traduire induirait le candidat en erreur.
 *
 * `moduleIds` indique quels modules du site couvrent réellement le domaine.
 * Un tableau vide signifie « pas encore couvert » — l'affichage l'indique
 * explicitement plutôt que de laisser croire à une couverture complète.
 */

export type TrackId = "oca-sql" | "ocp-dba-i" | "ocp-dba-ii";
export type TrackStatus = "available" | "syllabus";

export interface TrackDomain {
  /** Libellé officiel du domaine d'examen (anglais, tel qu'imprimé par Oracle). */
  title: string;
  /** Modules du site couvrant ce domaine. Vide ⇒ domaine non couvert. */
  moduleIds: string[];
}

export interface TrackGroup {
  label: { fr: string; en: string };
  domains: TrackDomain[];
}

export interface CertificationTrack {
  id: TrackId;
  /** Raccourci employé par les candidats francophones (OCA SQL, OCP I, OCP II). */
  shortLabel: string;
  examCode: string;
  /** Intitulé exact de la certification délivrée par Oracle. */
  certification: string;
  /** Intitulé exact de l'examen. */
  examTitle: string;
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  audience: { fr: string; en: string };
  questions: number;
  durationMinutes: number;
  passScorePercent: number;
  status: TrackStatus;
  accent: string;
  officialExamUrl: string;
  officialLearningUrl: string;
  groups: TrackGroup[];
}

export const certificationTracks: CertificationTrack[] = [
  {
    id: "oca-sql",
    shortLabel: "OCA SQL",
    examCode: "1Z0-071",
    certification: "Oracle Database SQL Certified Associate",
    examTitle: "Oracle Database SQL",
    title: {
      fr: "Oracle Database SQL",
      en: "Oracle Database SQL",
    },
    summary: {
      fr: "Le socle de toute la filière Oracle : langage SQL, modèle relationnel, fonctions, jointures, sous-requêtes, DML, DDL et objets de schéma. C'est le parcours entièrement couvert par la plateforme.",
      en: "The foundation of the whole Oracle path: the SQL language, the relational model, functions, joins, subqueries, DML, DDL and schema objects. This is the track the platform covers end to end.",
    },
    audience: {
      fr: "Développeurs, analystes de données et futurs administrateurs qui débutent sur Oracle.",
      en: "Developers, data analysts and future administrators starting out on Oracle.",
    },
    questions: 63,
    durationMinutes: 120,
    passScorePercent: 63,
    status: "available",
    accent: "primary",
    officialExamUrl: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071",
    officialLearningUrl: "https://mylearn.oracle.com/ou/learning-path/oracle-database-sql/117252",
    groups: [
      {
        label: { fr: "Fondamentaux du langage", en: "Language fundamentals" },
        domains: [
          { title: "Relational Database Concepts", moduleIds: ["m1"] },
          { title: "Retrieving Data using the SQL SELECT Statement", moduleIds: ["m2"] },
          { title: "Restricting and Sorting Data", moduleIds: ["m3"] },
          { title: "Using Single-Row Functions to Customize Output", moduleIds: ["m4"] },
          { title: "Using Conversion Functions and Conditional Expressions", moduleIds: ["m4"] },
        ],
      },
      {
        label: { fr: "Agrégation et requêtes multi-tables", en: "Aggregation and multi-table queries" },
        domains: [
          { title: "Reporting Aggregated Data Using the Group Functions", moduleIds: ["m5"] },
          { title: "Displaying Data from Multiple Tables Using Joins", moduleIds: ["m6"] },
          { title: "Using Subqueries to Solve Queries", moduleIds: ["m7"] },
          { title: "Using SET Operators", moduleIds: ["m8"] },
        ],
      },
      {
        label: { fr: "Manipulation et objets de schéma", en: "Data manipulation and schema objects" },
        domains: [
          { title: "Managing Tables using DML statements", moduleIds: ["m9", "m17"] },
          { title: "Using DDL to Create and Manage Tables", moduleIds: ["m10"] },
          { title: "Managing Views", moduleIds: ["m13"] },
          { title: "Managing Sequences, Synonyms and Indexes", moduleIds: ["m13"] },
          { title: "Managing Objects with Data Dictionary Views", moduleIds: ["m13"] },
        ],
      },
      {
        label: { fr: "Sécurité, temps et sujets avancés", en: "Security, time and advanced topics" },
        domains: [
          { title: "Controlling User Access", moduleIds: ["m16"] },
          { title: "Managing Data in Different Time Zones", moduleIds: ["m4"] },
          { title: "Using Advanced Functions and Regular Expressions", moduleIds: ["m11", "m12"] },
        ],
      },
    ],
  },
  {
    id: "ocp-dba-i",
    shortLabel: "OCP I",
    examCode: "1Z0-082",
    certification: "Oracle Database Administration 2019 Certified Professional",
    examTitle: "Oracle Database Administration I",
    title: {
      fr: "Administration Oracle Database I",
      en: "Oracle Database Administration I",
    },
    summary: {
      fr: "Premier des deux examens de la certification Professional. Il combine une moitié SQL — déjà couverte par vos modules — et une moitié administration : architecture de l'instance, stockage, réseau, utilisateurs et transfert de données.",
      en: "The first of the two exams in the Professional certification. It combines a SQL half — already covered by your modules — with an administration half: instance architecture, storage, networking, users and data movement.",
    },
    audience: {
      fr: "Administrateurs de bases de données débutants et développeurs souhaitant élargir leur périmètre.",
      en: "Junior database administrators and developers broadening their scope.",
    },
    questions: 72,
    durationMinutes: 120,
    passScorePercent: 60,
    status: "syllabus",
    accent: "sky",
    officialExamUrl: "https://education.oracle.com/oracle-database-administration-i/pexam_1Z0-082",
    officialLearningUrl: "https://mylearn.oracle.com/ou/course/oracle-database-19c-administration-workshop/102757",
    groups: [
      {
        label: {
          fr: "Volet SQL — couvert par vos modules",
          en: "SQL half — covered by your modules",
        },
        domains: [
          { title: "Retrieving Data using the SQL SELECT Statement", moduleIds: ["m2"] },
          { title: "Restricting and Sorting Data", moduleIds: ["m3"] },
          { title: "Using Single-Row Functions to Customize Output", moduleIds: ["m4"] },
          { title: "Using Conversion Functions and Conditional Expressions", moduleIds: ["m4"] },
          { title: "Reporting Aggregated Data Using Group Functions", moduleIds: ["m5"] },
          { title: "Displaying Data from Multiple Tables Using Joins", moduleIds: ["m6"] },
          { title: "Using Subqueries to Solve Queries", moduleIds: ["m7"] },
          { title: "Using SET Operators", moduleIds: ["m8"] },
          { title: "Managing Tables using DML statements", moduleIds: ["m9"] },
          { title: "Understanding Data Definition Language", moduleIds: ["m10"] },
          { title: "Managing Views", moduleIds: ["m13"] },
          { title: "Managing Sequences, Synonyms, Indexes", moduleIds: ["m13"] },
          { title: "Managing Schema Objects", moduleIds: ["m10", "m13"] },
          { title: "Managing Data in Different Time Zones", moduleIds: ["m4"] },
          { title: "Managing Users, Roles and Privileges", moduleIds: ["m16"] },
          { title: "Managing Undo", moduleIds: ["m17"] },
          { title: "Accessing an Oracle Database with Oracle supplied Tools", moduleIds: ["m15"] },
        ],
      },
      {
        label: {
          fr: "Volet administration — à préparer sur les ressources Oracle",
          en: "Administration half — to prepare on Oracle resources",
        },
        domains: [
          { title: "Understanding Oracle Database Architecture", moduleIds: [] },
          { title: "Managing Database Instances", moduleIds: [] },
          { title: "Managing Storage", moduleIds: [] },
          { title: "Managing Tablespaces and Datafiles", moduleIds: [] },
          { title: "Configuring Oracle Net Services", moduleIds: [] },
          { title: "Moving Data", moduleIds: [] },
        ],
      },
    ],
  },
  {
    id: "ocp-dba-ii",
    shortLabel: "OCP II",
    examCode: "1Z0-083",
    certification: "Oracle Database Administration 2019 Certified Professional",
    examTitle: "Oracle Database Administration II",
    title: {
      fr: "Administration Oracle Database II",
      en: "Oracle Database Administration II",
    },
    summary: {
      fr: "Second examen de la certification Professional, exclusivement orienté administration : architecture multitenant (CDB/PDB), sauvegarde et restauration RMAN, technologies Flashback, mises à niveau, Grid Infrastructure et optimisation.",
      en: "The second exam of the Professional certification, purely administration-focused: multitenant architecture (CDB/PDB), RMAN backup and recovery, Flashback technologies, upgrades, Grid Infrastructure and tuning.",
    },
    audience: {
      fr: "Administrateurs confirmés visant la certification Professional complète.",
      en: "Experienced administrators aiming for the full Professional certification.",
    },
    questions: 68,
    durationMinutes: 120,
    passScorePercent: 57,
    status: "syllabus",
    accent: "amber",
    officialExamUrl: "https://education.oracle.com/oracle-database-administration-ii/pexam_1Z0-083",
    officialLearningUrl: "https://mylearn.oracle.com/ou/course/oracle-database-19c-managing-multitenant-architecture/102756",
    groups: [
      {
        label: { fr: "Architecture multitenant", en: "Multitenant architecture" },
        domains: [
          { title: "Creating CDBs and Regular PDBs", moduleIds: [] },
          { title: "Manage CDBs and PDBs", moduleIds: [] },
          { title: "Manage Application PDBs", moduleIds: [] },
          { title: "Manage Security in Multitenant databases", moduleIds: [] },
          { title: "Upgrading and Transporting CDBs and Regular PDBs", moduleIds: [] },
        ],
      },
      {
        label: { fr: "Sauvegarde, restauration et Flashback", en: "Backup, recovery and Flashback" },
        domains: [
          { title: "Backup Strategies and Terminology", moduleIds: [] },
          { title: "Restore and Recovery Concepts", moduleIds: [] },
          { title: "Configuring and Using RMAN", moduleIds: [] },
          { title: "Backup and Duplicate", moduleIds: [] },
          { title: "Diagnosing Failures", moduleIds: [] },
          { title: "Performing Recovery", moduleIds: [] },
          { title: "Recovery and Flashback", moduleIds: [] },
          { title: "Using Flashback Technologies", moduleIds: [] },
          { title: "Duplicating a Database", moduleIds: [] },
          { title: "RMAN Troubleshooting and Tuning", moduleIds: [] },
        ],
      },
      {
        label: { fr: "Installation, mise à niveau et exploitation", en: "Installation, upgrade and operations" },
        domains: [
          { title: "Install Grid Infrastructure and Oracle Database", moduleIds: [] },
          { title: "Patching Grid Infrastructure and Oracle Database", moduleIds: [] },
          { title: "Upgrading to Oracle Grid Infrastructure", moduleIds: [] },
          { title: "Creating an Oracle Database by using DBCA", moduleIds: [] },
          { title: "Upgrade the Oracle Database", moduleIds: [] },
          { title: "Oracle Restart", moduleIds: [] },
          { title: "Transporting Data", moduleIds: [] },
          { title: "Monitoring and Tuning Database Performance", moduleIds: [] },
          { title: "Tuning SQL Statements", moduleIds: ["m11"] },
        ],
      },
    ],
  },
];

export function getTrack(id: string): CertificationTrack | undefined {
  return certificationTracks.find((track) => track.id === id);
}

export function allDomains(track: CertificationTrack): TrackDomain[] {
  return track.groups.flatMap((group) => group.domains);
}

/** Part des domaines d'examen effectivement couverts par des modules du site. */
export function trackCoverage(track: CertificationTrack): {
  covered: number;
  total: number;
  percent: number;
} {
  const domains = allDomains(track);
  const covered = domains.filter((domain) => domain.moduleIds.length > 0).length;
  return {
    covered,
    total: domains.length,
    percent: domains.length === 0 ? 0 : Math.round((covered / domains.length) * 100),
  };
}

export function pick(value: { fr: string; en: string }, locale: Locale): string {
  return locale === "en" ? value.en : value.fr;
}
