import type { Locale } from "./i18n/locale";

/**
 * Ressources externes recommandées, en un seul endroit.
 *
 * Regrouper ces liens ici évite qu'ils soient recopiés de page en page — c'est
 * exactement ainsi qu'un identifiant de catalogue fabriqué s'était retrouvé
 * dupliqué sur trois parcours (voir `docs/AUDIT-2026-08-31-C.md`).
 *
 * Chaque entrée dit **ce qu'on y trouve**, pas seulement où elle mène : un
 * lien sans contexte oblige l'apprenant à ouvrir l'onglet pour comprendre s'il
 * l'intéresse.
 */

export interface ExternalResource {
  id: string;
  url: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  /** `oracle` pour un site officiel Oracle, `practice` pour un outil tiers. */
  kind: "oracle" | "practice";
}

/** Portail officiel des certifications Oracle. */
export const ORACLE_CERTIFICATION: ExternalResource = {
  id: "oracle-certification",
  url: "https://www.oracle.com/education/certification/",
  label: {
    fr: "Certifications Oracle — portail officiel",
    en: "Oracle Certification — official portal",
  },
  description: {
    fr: "Le point d'entrée d'Oracle : catalogue des certifications, inscription aux épreuves, conditions de passage et suivi des accréditations obtenues.",
    en: "Oracle's own entry point: certification catalogue, exam registration, sitting conditions and tracking of the credentials you hold.",
  },
  kind: "oracle",
};

/** Parcours de certification de la famille Oracle Database. */
export const ORACLE_DATABASE_PATH: ExternalResource = {
  id: "oracle-database-path",
  url: "https://education.oracle.com/oracle-certification-path/pFamily_32",
  label: {
    fr: "Parcours Oracle Database",
    en: "Oracle Database path",
  },
  description: {
    fr: "L'arbre des certifications Oracle Database : ce qui précède, ce qui suit, et les équivalences entre versions.",
    en: "The Oracle Database certification tree: what comes before, what comes after, and the equivalences between releases.",
  },
  kind: "oracle",
};

/** Environnement SQL en ligne, sans installation. */
export const FREESQL: ExternalResource = {
  id: "freesql",
  url: "https://freesql.com/",
  label: {
    fr: "FreeSQL — console SQL en ligne",
    en: "FreeSQL — online SQL console",
  },
  description: {
    fr: "Écrire et exécuter du SQL depuis le navigateur, sans rien installer. Utile pour vérifier une syntaxe ou reproduire un exemple du cours quand aucune base Oracle n'est à portée.",
    en: "Write and run SQL straight from the browser, with nothing to install. Handy for checking a syntax point or reproducing a course example when no Oracle database is within reach.",
  },
  kind: "practice",
};

/** Ressources proposées sur la page d'un parcours de certification. */
export const TRACK_RESOURCES: ExternalResource[] = [
  ORACLE_CERTIFICATION,
  ORACLE_DATABASE_PATH,
];

/** Ressources proposées là où l'on pratique le SQL. */
export const PRACTICE_RESOURCES: ExternalResource[] = [FREESQL];

/** Libellé ou description dans la langue courante. */
export function pickResource(
  value: { fr: string; en: string },
  locale: Locale,
): string {
  return locale === "en" ? value.en : value.fr;
}
