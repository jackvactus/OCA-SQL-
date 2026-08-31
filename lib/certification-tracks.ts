import type { Locale } from "./i18n/locale";
import { advancedTracks } from "./certification-tracks-advanced";
import { objectivesFor, type DomainObjectives } from "./exam-objectives";

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

export type TrackId =
  | "oca-sql"
  | "ocp-dba-i"
  | "ocp-dba-ii"
  | "ocp-tuning"
  | "ocp-dataguard"
  | "ocp-rac";
export type TrackStatus = "available" | "syllabus";

export interface TrackDomain {
  /** Libellé officiel du domaine d'examen (anglais, tel qu'imprimé par Oracle). */
  title: string;
  /** Modules du site couvrant ce domaine. */
  moduleIds: string[];
  /** Sessions du cursus couvrant ce domaine (`lib/curricula.ts`). */
  sessionIds?: string[];
}

/** Un domaine est couvert dès qu'un module OU une session le traite. */
export function isDomainCovered(domain: TrackDomain): boolean {
  return domain.moduleIds.length > 0 || (domain.sessionIds?.length ?? 0) > 0;
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
  /** Tarif public de l'épreuve, en dollars américains. */
  priceUsd: number;
  /** Prérequis officiels. Oracle a supprimé l'obligation de passer l'OCA. */
  prerequisite?: { fr: string; en: string };
  status: TrackStatus;
  accent: string;
  officialExamUrl: string;
  officialLearningUrl: string;
  groups: TrackGroup[];
}

const foundationTracks: CertificationTrack[] = [
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
    priceUsd: 245,
    status: "available",
    accent: "primary",
    prerequisite: {
      fr: "Aucun. C'est le point d'entrée recommandé de la filière Oracle Database.",
      en: "None. This is the recommended entry point into the Oracle Database path.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071",
    officialLearningUrl: "https://mylearn.oracle.com/ou/learning-path/oracle-database-sql/117252",
    groups: [
      {
        label: { fr: "Fondamentaux du langage", en: "Language fundamentals" },
        domains: [
          { title: "Relational Database Concepts", moduleIds: ["m1"], sessionIds: ["session-1"] },
          { title: "Retrieving Data using the SQL SELECT Statement", moduleIds: ["m2"], sessionIds: ["session-1"] },
          { title: "Restricting and Sorting Data", moduleIds: ["m3"], sessionIds: ["session-2"] },
          { title: "Using Single-Row Functions to Customize Output", moduleIds: ["m4", "m12"], sessionIds: ["session-1"] },
          { title: "Using Conversion Functions and Conditional Expressions", moduleIds: ["m4"], sessionIds: ["session-1"] },
        ],
      },
      {
        label: { fr: "Agrégation et requêtes multi-tables", en: "Aggregation and multi-table queries" },
        domains: [
          { title: "Reporting Aggregated Data Using Group Functions", moduleIds: ["m5"], sessionIds: ["session-2"] },
          { title: "Displaying Data from Multiple Tables", moduleIds: ["m6"], sessionIds: ["session-2"] },
          { title: "Using Subqueries to Solve Queries", moduleIds: ["m7"], sessionIds: ["session-3"] },
          { title: "Using SET Operators", moduleIds: ["m8"], sessionIds: ["session-3"] },
        ],
      },
      {
        label: { fr: "Manipulation et objets de schéma", en: "Data manipulation and schema objects" },
        domains: [
          { title: "Managing Tables using DML statements", moduleIds: ["m9", "m17"], sessionIds: ["session-4"] },
          { title: "Use DDL to manage tables and their relationships", moduleIds: ["m10"], sessionIds: ["session-5"] },
          { title: "Managing Views", moduleIds: ["m13"], sessionIds: ["session-6"] },
          { title: "Managing Indexes Synonyms and Sequences", moduleIds: ["m13"], sessionIds: ["session-6"] },
        ],
      },
      {
        label: { fr: "Sécurité, dictionnaire et fuseaux horaires", en: "Security, dictionary and time zones" },
        domains: [
          { title: "Controlling User Access", moduleIds: ["m16"], sessionIds: ["session-6"] },
          { title: "Managing Objects with Data Dictionary Views", moduleIds: ["m13"], sessionIds: ["session-6"] },
          { title: "Managing Data in Different Time Zones", moduleIds: ["m4"], sessionIds: ["session-1"] },
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
    priceUsd: 245,
    status: "available",
    accent: "sky",
    prerequisite: {
      fr: "Aucun. Oracle a supprimé l'obligation de détenir la certification Associate au préalable.",
      en: "None. Oracle removed the requirement to hold the Associate certification first.",
    },
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
          { title: "Managing Users, Roles and Privileges", moduleIds: ["m16"], sessionIds: ["ocp1-session-3"] },
          { title: "Managing Undo", moduleIds: ["m17"], sessionIds: ["ocp1-session-4"] },
          { title: "Accessing an Oracle Database with Oracle supplied Tools", moduleIds: ["m15"], sessionIds: ["ocp1-session-2"] },
        ],
      },
      {
        label: {
          fr: "Volet administration — à préparer sur les ressources Oracle",
          en: "Administration half — to prepare on Oracle resources",
        },
        domains: [
          { title: "Understanding Oracle Database Architecture", moduleIds: [], sessionIds: ["ocp1-session-1"] },
          { title: "Managing Database Instances", moduleIds: [], sessionIds: ["ocp1-session-2"] },
          { title: "Managing Storage", moduleIds: [], sessionIds: ["ocp1-session-4"] },
          { title: "Managing Tablespaces and Datafiles", moduleIds: [], sessionIds: ["ocp1-session-4"] },
          { title: "Configuring Oracle Net Services", moduleIds: [], sessionIds: ["ocp1-session-5"] },
          { title: "Moving Data", moduleIds: [], sessionIds: ["ocp1-session-6"] },
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
    priceUsd: 245,
    status: "available",
    accent: "amber",
    prerequisite: {
      fr: "Aucun formellement, mais l'examen suppose acquis le programme de l'Administration I.",
      en: "None formally, but the exam assumes the Administration I syllabus is already mastered.",
    },
    officialExamUrl: "https://education.oracle.com/oracle-database-administration-ii/pexam_1Z0-083",
    officialLearningUrl: "https://mylearn.oracle.com/ou/course/oracle-database-19c-managing-multitenant-architecture/102756",
    groups: [
      {
        label: { fr: "Architecture multitenant", en: "Multitenant architecture" },
        domains: [
          { title: "Creating CDBs and Regular PDBs", moduleIds: [], sessionIds: ["ocp2-session-2"] },
          { title: "Manage CDBs and PDBs", moduleIds: [], sessionIds: ["ocp2-session-2"] },
          { title: "Manage Application PDBs", moduleIds: [], sessionIds: ["ocp2-session-2"] },
          { title: "Manage Security in Multitenant databases", moduleIds: [], sessionIds: ["ocp2-session-3"] },
          { title: "Upgrading and Transporting CDBs and Regular PDBs", moduleIds: [], sessionIds: ["ocp2-session-8"] },
        ],
      },
      {
        label: { fr: "Sauvegarde, restauration et Flashback", en: "Backup, recovery and Flashback" },
        domains: [
          { title: "Backup Strategies and Terminology", moduleIds: [], sessionIds: ["ocp2-session-4"] },
          { title: "Restore and Recovery Concepts", moduleIds: [], sessionIds: ["ocp2-session-5"] },
          { title: "Configuring and Using RMAN", moduleIds: [], sessionIds: ["ocp2-session-4"] },
          { title: "Backup and Duplicate", moduleIds: [], sessionIds: ["ocp2-session-4"] },
          { title: "Diagnosing Failures", moduleIds: [], sessionIds: ["ocp2-session-5"] },
          { title: "Performing Recovery", moduleIds: [], sessionIds: ["ocp2-session-5"] },
          { title: "Recovery and Flashback", moduleIds: [], sessionIds: ["ocp2-session-6"] },
          { title: "Using Flashback Technologies", moduleIds: [], sessionIds: ["ocp2-session-6"] },
          { title: "Duplicating a Database", moduleIds: [], sessionIds: ["ocp2-session-7"] },
          { title: "RMAN Troubleshooting and Tuning", moduleIds: [], sessionIds: ["ocp2-session-5"] },
        ],
      },
      {
        label: { fr: "Installation, mise à niveau et exploitation", en: "Installation, upgrade and operations" },
        domains: [
          { title: "Install Grid Infrastructure and Oracle Database", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Patching Grid Infrastructure and Oracle Database", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Upgrading to Oracle Grid Infrastructure", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Creating an Oracle Database by using DBCA", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Upgrade the Oracle Database", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Oracle Restart", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Transporting Data", moduleIds: [], sessionIds: ["ocp2-session-7"] },
          { title: "Monitoring and Tuning Database Performance", moduleIds: [], sessionIds: ["ocp2-session-9"] },
          { title: "Tuning SQL Statements", moduleIds: ["m11"], sessionIds: ["ocp2-session-9"] },
        ],
      },
      {
        label: { fr: "Nouveautes 18c / 19c", en: "18c / 19c new features" },
        domains: [
          { title: "Oracle Database 18c: New Features", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Installing Grid Infrastructure for a Standalone server", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "General Database Enhancements", moduleIds: [], sessionIds: ["ocp2-session-8"] },
          { title: "Using Availability Enhancements", moduleIds: [], sessionIds: ["ocp2-session-6"] },
          { title: "Using Diagnosability Enhancements", moduleIds: [], sessionIds: ["ocp2-session-5"] },
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

/**
 * Objectifs d'examen officiels rattaches a un domaine, s'ils sont publies par
 * Oracle pour cette epreuve (`lib/exam-objectives.ts`).
 */
export function domainObjectives(
  track: CertificationTrack,
  domain: TrackDomain,
): DomainObjectives | undefined {
  return objectivesFor(track.examCode, domain.title);
}

/** Nombre total d'objectifs officiels detailles publies pour un parcours. */
export function objectiveCount(track: CertificationTrack): number {
  return allDomains(track).reduce(
    (sum, domain) => sum + (domainObjectives(track, domain)?.objectives.length ?? 0),
    0,
  );
}

/** Part des domaines d'examen effectivement couverts par des modules du site. */
export function trackCoverage(track: CertificationTrack): {
  covered: number;
  total: number;
  percent: number;
} {
  const domains = allDomains(track);
  const covered = domains.filter(isDomainCovered).length;
  return {
    covered,
    total: domains.length,
    percent: domains.length === 0 ? 0 : Math.round((covered / domains.length) * 100),
  };
}

export function pick(value: { fr: string; en: string }, locale: Locale): string {
  return locale === "en" ? value.en : value.fr;
}

/**
 * Les six parcours, dans l'ordre de progression professionnelle :
 * SQL → administration → administration avancée → spécialisations.
 */
export const certificationTracks: CertificationTrack[] = [
  ...foundationTracks,
  ...advancedTracks,
];
