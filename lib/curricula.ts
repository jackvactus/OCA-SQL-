import type { Bilingual, CourseSession } from "./course-oca-sql";
import { courseSessions as ocaSessions, courseMeta as ocaMeta } from "./course-oca-sql";
import { ocp1Sessions } from "./course-ocp1";
import { ocp2Sessions } from "./course-ocp2";
import { tuningSessions } from "./course-tuning";
import { tuningSessionsB } from "./course-tuning-b";
import { dataGuardSessions } from "./course-dataguard";
import { dataGuardSessionsB } from "./course-dataguard-b";
import { racSessions } from "./course-rac";
import { racSessionsB } from "./course-rac-b";
import type { TrackId } from "./certification-tracks";
import { sessionExtras } from "./course-extras";
import { sessionLabs } from "./course-labs";
import { advancedSessionExtras } from "./course-extras-advanced";
import { advancedSessionExtrasB } from "./course-extras-advanced-b";
import { advancedSessionLabs } from "./course-labs-advanced";
import { advancedSessionLabsB } from "./course-labs-advanced-b";

/** Extras et TP de tous les cursus, fondamentaux et specialisations confondus. */
const allExtras = { ...sessionExtras, ...advancedSessionExtras, ...advancedSessionExtrasB };
const allLabs = { ...sessionLabs, ...advancedSessionLabs, ...advancedSessionLabsB };

/** Rattache à chaque session ses points à retenir et ses questions de contrôle. */
function withExtras(sessions: CourseSession[]): CourseSession[] {
  return sessions.map((session) => {
    const extras = allExtras[session.id];
    const labs = allLabs[session.id];
    if (!extras && !labs) return session;
    return {
      ...session,
      ...(extras ? { keyTakeaways: extras.keyTakeaways, selfCheck: extras.selfCheck } : {}),
      ...(labs ? { labs } : {}),
    };
  });
}

/** Couleur d'accent d'un cursus, alignee sur `certificationTracks`. */
export type CurriculumAccent = "primary" | "sky" | "amber" | "rose" | "violet" | "teal";

/** Registre des six cursus de la plateforme. */
export interface Curriculum {
  id: TrackId;
  examCode: string;
  shortLabel: string;
  title: Bilingual;
  subtitle: Bilingual;
  accent: CurriculumAccent;
  sessions: CourseSession[];
}

export const curricula: Curriculum[] = [
  {
    id: "oca-sql",
    examCode: "1Z0-071",
    shortLabel: "OCA SQL",
    title: ocaMeta.title,
    subtitle: ocaMeta.subtitle,
    accent: "primary",
    sessions: withExtras(ocaSessions),
  },
  {
    id: "ocp-dba-i",
    examCode: "1Z0-082",
    shortLabel: "OCP I",
    title: {
      fr: "Administration Oracle Database I",
      en: "Oracle Database Administration I",
    },
    subtitle: {
      fr: "Architecture, instance, sécurité, stockage, réseau et déplacement de données — le volet administration du 1Z0-082.",
      en: "Architecture, instance, security, storage, networking and data movement — the administration half of 1Z0-082.",
    },
    accent: "sky",
    sessions: withExtras(ocp1Sessions),
  },
  {
    id: "ocp-dba-ii",
    examCode: "1Z0-083",
    shortLabel: "OCP II",
    title: {
      fr: "Administration Oracle Database II",
      en: "Oracle Database Administration II",
    },
    subtitle: {
      fr: "Multitenant, RMAN, Flashback, duplication, mises à niveau et optimisation — l'intégralité du 1Z0-083.",
      en: "Multitenant, RMAN, Flashback, duplication, upgrades and tuning — the whole of 1Z0-083.",
    },
    accent: "amber",
    sessions: withExtras(ocp2Sessions),
  },
  {
    id: "ocp-tuning",
    examCode: "1Z0-084",
    shortLabel: "Tuning",
    title: {
      fr: "Gestion et optimisation des performances Oracle 19c",
      en: "Oracle Database 19c performance management and tuning",
    },
    subtitle: {
      fr: "Methodologie, modele de temps, AWR, ASH, ADDM, plans d'execution, statistiques, conseillers, memoire, Statspack et In-Memory — l'integralite du 1Z0-084.",
      en: "Methodology, time model, AWR, ASH, ADDM, execution plans, statistics, advisors, memory, Statspack and In-Memory — the whole of 1Z0-084.",
    },
    accent: "rose",
    sessions: withExtras([...tuningSessions, ...tuningSessionsB]),
  },
  {
    id: "ocp-dataguard",
    examCode: "1Z0-076",
    shortLabel: "Data Guard",
    title: {
      fr: "Administration Oracle Data Guard 19c",
      en: "Oracle Data Guard 19c administration",
    },
    subtitle: {
      fr: "Architecture, creation d'une base de secours, modes de protection, Active Data Guard, Far Sync, Broker, transitions de role, Flashback et continuite applicative — l'integralite du 1Z0-076.",
      en: "Architecture, standby creation, protection modes, Active Data Guard, Far Sync, the Broker, role transitions, Flashback and application continuity — the whole of 1Z0-076.",
    },
    accent: "violet",
    sessions: withExtras([...dataGuardSessions, ...dataGuardSessionsB]),
  },
  {
    id: "ocp-rac",
    examCode: "1Z0-078",
    shortLabel: "RAC & Grid",
    title: {
      fr: "Clusterware, ASM et Real Application Clusters 19c",
      en: "Clusterware, ASM and Real Application Clusters 19c",
    },
    subtitle: {
      fr: "Grid Infrastructure, CRSCTL et SRVCTL, OCR et voting disks, ASM, ACFS, Cache Fusion, services, SCAN, correctifs progressifs et depannage — l'integralite du 1Z0-078.",
      en: "Grid Infrastructure, CRSCTL and SRVCTL, OCR and voting disks, ASM, ACFS, Cache Fusion, services, SCAN, rolling patches and troubleshooting — the whole of 1Z0-078.",
    },
    accent: "teal",
    sessions: withExtras([...racSessions, ...racSessionsB]),
  },
];

export function getCurriculum(id: string): Curriculum | undefined {
  return curricula.find((curriculum) => curriculum.id === id);
}

/** Retrouve une session et le cursus auquel elle appartient. */
export function findSession(
  sessionId: string,
): { curriculum: Curriculum; session: CourseSession; index: number } | undefined {
  for (const curriculum of curricula) {
    const index = curriculum.sessions.findIndex((session) => session.id === sessionId);
    if (index >= 0) {
      return { curriculum, session: curriculum.sessions[index], index };
    }
  }
  return undefined;
}

export function curriculumStats(curriculum: Curriculum) {
  const topics = curriculum.sessions.reduce((sum, session) => sum + session.topics.length, 0);
  const minutes = curriculum.sessions.reduce((sum, session) => sum + session.estimatedMinutes, 0);
  const blocks = curriculum.sessions.reduce(
    (sum, session) => sum + session.topics.reduce((n, topic) => n + topic.blocks.length, 0),
    0,
  );
  const labs = curriculum.sessions.reduce((sum, session) => sum + (session.labs?.length ?? 0), 0);
  const labMinutes = curriculum.sessions.reduce(
    (sum, session) => sum + (session.labs ?? []).reduce((n, lab) => n + lab.minutes, 0),
    0,
  );
  return {
    sessions: curriculum.sessions.length,
    topics,
    blocks,
    labs,
    hours: Math.round((minutes / 60) * 10) / 10,
    labHours: Math.round((labMinutes / 60) * 10) / 10,
  };
}

export const allSessionIds = curricula.flatMap((curriculum) =>
  curriculum.sessions.map((session) => session.id),
);
