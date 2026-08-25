import type { Bilingual, CourseSession } from "./course-oca-sql";
import { courseSessions as ocaSessions, courseMeta as ocaMeta } from "./course-oca-sql";
import { ocp1Sessions } from "./course-ocp1";
import { ocp2Sessions } from "./course-ocp2";
import type { TrackId } from "./certification-tracks";
import { sessionExtras } from "./course-extras";
import { sessionLabs } from "./course-labs";

/** Rattache à chaque session ses points à retenir et ses questions de contrôle. */
function withExtras(sessions: CourseSession[]): CourseSession[] {
  return sessions.map((session) => {
    const extras = sessionExtras[session.id];
    const labs = sessionLabs[session.id];
    if (!extras && !labs) return session;
    return {
      ...session,
      ...(extras ? { keyTakeaways: extras.keyTakeaways, selfCheck: extras.selfCheck } : {}),
      ...(labs ? { labs } : {}),
    };
  });
}

/** Registre des trois cursus de la plateforme. */
export interface Curriculum {
  id: TrackId;
  examCode: string;
  shortLabel: string;
  title: Bilingual;
  subtitle: Bilingual;
  accent: "primary" | "sky" | "amber";
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
