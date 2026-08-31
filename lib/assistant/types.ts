import type { TrackId } from "../certification-tracks";
import type { Locale } from "../i18n/locale";

/**
 * Contrat de l'assistant.
 *
 * L'interface, la transcription et l'audit sont fournis ; la production de la
 * réponse est un **point d'extension** à remplir (`lib/assistant/answer.ts`).
 * Ce fichier fixe la forme des échanges pour que les deux moitiés puissent
 * évoluer séparément.
 */

/** Ce que l'assistant sait de l'endroit d'où la question est posée. */
export interface AssistantContext {
  /** Chemin de la page, par exemple `/curriculum/dg-session-4`. */
  path: string;
  /** Parcours de certification en cours. */
  track: TrackId;
  locale: Locale;
  /** Identifiant de session ou de module affiché, quand il y en a un. */
  subject?: string;
}

/** Renvoi vers un contenu de la plateforme, pour que la réponse soit vérifiable. */
export interface AssistantSource {
  /** Intitulé lisible : « Session 4 — Modes de protection ». */
  label: string;
  /** Lien interne. */
  href: string;
  /** Nature de la source, pour l'icône et le tri. */
  kind: "session" | "module" | "question" | "reference" | "external";
}

/** Extrait SQL joint à une réponse, exécutable dans le bac à sable. */
export interface AssistantSql {
  /** Requête complète, prête à coller. */
  query: string;
  /** Ce que l'extrait démontre — pas ce qu'il fait. */
  caption?: string;
  /**
   * Vrai si la requête s'exécute sur le schéma HR simulé du bac à sable.
   * Une requête d'administration — `V$SESSION`, `DBA_TABLES` — ne s'y exécute
   * pas : le bouton « exécuter » doit alors rester absent plutôt que d'échouer.
   */
  runnable: boolean;
}

export interface AssistantAnswer {
  /** Réponse en texte, dans la langue du contexte. */
  text: string;
  sources: AssistantSource[];
  sql: AssistantSql[];
  /**
   * Vrai quand aucune logique de réponse n'est branchée.
   *
   * L'interface affiche alors un message explicite au lieu d'inventer : une
   * réponse fabriquée sur une plateforme de certification est pire que pas de
   * réponse du tout.
   */
  unavailable?: boolean;
}

export interface AssistantExchange {
  id: string;
  question: string;
  answer: AssistantAnswer;
  createdAt: string;
}
