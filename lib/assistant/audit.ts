import { query } from "@/lib/db";
import type { AssistantAnswer, AssistantContext, AssistantExchange, AssistantSource, AssistantSql } from "./types";

/**
 * Transcription et audit des échanges avec l'assistant.
 *
 * Un assistant qui répond sur un contenu de certification doit laisser une
 * trace : on doit pouvoir relire ce qu'il a affirmé, d'où la question a été
 * posée, et quelles requêtes il a proposées. Sans cela, une réponse fausse
 * disparaît avec la fermeture du panneau et reste introuvable.
 *
 * La transcription est écrite côté serveur, jamais depuis le navigateur : un
 * client ne peut donc pas fabriquer une ligne d'historique.
 */

/** Un échange plus le contexte d'où il a été posé. */
export interface AuditedExchange extends AssistantExchange {
  path: string | null;
  track: string | null;
  locale: string;
}

interface Ligne {
  id: string;
  question: string;
  answer_text: string;
  sources: unknown;
  sql_snippets: unknown;
  unavailable: boolean;
  path: string | null;
  track: string | null;
  locale: string;
  created_at: string;
}

/**
 * Les colonnes `jsonb` reviennent typées `unknown` : on les repasse par un
 * filtre plutôt que de les caster. Une ligne écrite par une version antérieure
 * du schéma ne doit pas faire planter la page de transcription.
 *
 * Exportées pour être testées : c'est justement le comportement sur des
 * données malformées qui mérite une vérification.
 */
export function lireSources(valeur: unknown): AssistantSource[] {
  if (!Array.isArray(valeur)) return [];
  return valeur.filter(
    (s): s is AssistantSource =>
      typeof s === "object" && s !== null && typeof (s as AssistantSource).href === "string",
  );
}

export function lireSql(valeur: unknown): AssistantSql[] {
  if (!Array.isArray(valeur)) return [];
  return valeur.filter(
    (s): s is AssistantSql =>
      typeof s === "object" && s !== null && typeof (s as AssistantSql).query === "string",
  );
}

function versEchange(ligne: Ligne): AuditedExchange {
  return {
    id: ligne.id,
    question: ligne.question,
    answer: {
      text: ligne.answer_text,
      sources: lireSources(ligne.sources),
      sql: lireSql(ligne.sql_snippets),
      unavailable: ligne.unavailable,
    },
    createdAt: ligne.created_at,
    path: ligne.path,
    track: ligne.track,
    locale: ligne.locale,
  };
}

/** Écrit un échange dans la transcription et renvoie sa forme persistée. */
export async function recordExchange(
  userId: string,
  question: string,
  answer: AssistantAnswer,
  context: AssistantContext,
): Promise<AuditedExchange> {
  const result = await query<Ligne>(
    `insert into assistant_messages
       (user_id, question, answer_text, sources, sql_snippets, unavailable, path, track, locale)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning id, question, answer_text, sources, sql_snippets, unavailable, path, track, locale, created_at`,
    [
      userId,
      question,
      answer.text,
      JSON.stringify(answer.sources ?? []),
      JSON.stringify(answer.sql ?? []),
      answer.unavailable === true,
      context.path,
      context.track,
      context.locale,
    ],
  );
  return versEchange(result.rows[0]);
}

/** Transcription d'un apprenant, la plus récente d'abord. */
export async function listExchanges(
  userId: string,
  limit = 100,
  offset = 0,
): Promise<AuditedExchange[]> {
  const result = await query<Ligne>(
    `select id, question, answer_text, sources, sql_snippets, unavailable, path, track, locale, created_at
     from assistant_messages
     where user_id = $1
     order by created_at desc
     limit $2 offset $3`,
    [userId, limit, offset],
  );
  return result.rows.map(versEchange);
}

/** Supprime la transcription d'un apprenant — la trace lui appartient. */
export async function clearExchanges(userId: string): Promise<number> {
  const result = await query("delete from assistant_messages where user_id = $1", [userId]);
  return result.rowCount ?? 0;
}
