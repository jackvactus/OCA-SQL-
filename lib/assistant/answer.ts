import type { AssistantAnswer, AssistantContext } from "./types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  POINT D'EXTENSION — c'est ici que se branche la logique de réponse.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Tout le reste est fourni : le point lumineux, le panneau, le rendu du SQL
 * avec exécution dans le bac à sable, la transcription persistée, l'audit et
 * la limitation de débit. Il ne manque que la production de la réponse.
 *
 * ---------------------------------------------------------------------------
 * COMMENT LA BRANCHER
 * ---------------------------------------------------------------------------
 *
 * Remplacez le corps de `answerQuestion` ci-dessous. La fonction s'exécute
 * **côté serveur** (appelée depuis `app/api/assistant/ask/route.ts`) : une clé
 * d'API lue dans `process.env` n'atteint jamais le navigateur.
 *
 *   export async function answerQuestion(
 *     question: string,
 *     context: AssistantContext,
 *   ): Promise<AssistantAnswer> {
 *     const reponse = await fetch("https://…", {
 *       method: "POST",
 *       headers: {
 *         "content-type": "application/json",
 *         authorization: `Bearer ${process.env.ASSISTANT_API_KEY}`,
 *       },
 *       body: JSON.stringify({ question, contexte: context }),
 *     });
 *     const donnees = await reponse.json();
 *     return {
 *       text: donnees.texte,
 *       sources: donnees.sources ?? [],
 *       sql: donnees.sql ?? [],
 *     };
 *   }
 *
 * ---------------------------------------------------------------------------
 * CE QUE VOUS AVEZ SOUS LA MAIN POUR ANCRER LES RÉPONSES
 * ---------------------------------------------------------------------------
 *
 * Répondre à partir du contenu de la plateforme plutôt que de la mémoire d'un
 * modèle évite l'invention — décisive sur une plateforme de certification, où
 * une réponse fausse mais assurée coûte un examen.
 *
 *   import { curricula, findSession } from "@/lib/curricula";
 *       → 57 sessions, 173 chapitres, leurs blocs de cours
 *   import { allQuestions } from "@/lib/quiz-banks";
 *       → 792 questions avec leurs explications
 *   import { certificationTracks } from "@/lib/certification-tracks";
 *   import { objectivesFor } from "@/lib/exam-objectives";
 *       → les 455 objectifs officiels des six examens
 *   import { modules } from "@/lib/modules-data";
 *       → les 18 modules et leurs leçons
 *   import { runQuery, schema } from "@/lib/sql-sandbox";
 *       → pour VÉRIFIER une requête avant de la proposer
 *
 * Le dernier point mérite qu'on s'y arrête : exécuter la requête suggérée
 * avant de la renvoyer, et ne la marquer `runnable` que si elle passe, évite
 * de proposer du SQL qui échouera sous les yeux de l'apprenant.
 *
 * ---------------------------------------------------------------------------
 * CONTRAT À RESPECTER
 * ---------------------------------------------------------------------------
 *
 *  - Répondre dans `context.locale`.
 *  - Citer ses sources : une réponse sans lien vérifiable n'a pas sa place ici.
 *  - Ne jamais renvoyer `unavailable: false` avec un texte inventé. En cas de
 *    doute, dire qu'on ne sait pas.
 *  - La fonction peut lever : la route traduit l'erreur proprement.
 */
export async function answerQuestion(
  question: string,
  context: AssistantContext,
): Promise<AssistantAnswer> {
  // Les deux paramètres sont volontairement inutilisés tant que rien n'est
  // branché — les nommer documente la signature attendue.
  void question;

  const en = context.locale === "en";

  return {
    unavailable: true,
    text: en
      ? "No answering logic is connected yet. The assistant interface, transcript and audit trail are in place; what remains is to implement `answerQuestion` in lib/assistant/answer.ts — the file explains how, and lists the platform content available to ground answers."
      : "Aucune logique de réponse n'est encore branchée. L'interface de l'assistant, la transcription et la piste d'audit sont en place ; il reste à implémenter `answerQuestion` dans lib/assistant/answer.ts — le fichier explique comment, et liste les contenus de la plateforme sur lesquels ancrer les réponses.",
    sources: [],
    sql: [],
  };
}

/** Vrai si une logique de réponse est branchée — l'interface s'y adapte. */
export function isAssistantConfigured(): boolean {
  // À faire passer à `true` en même temps que l'implémentation ci-dessus, ou
  // à dériver d'une variable d'environnement :
  //   return Boolean(process.env.ASSISTANT_API_KEY);
  return false;
}
