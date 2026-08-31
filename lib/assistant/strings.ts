import type { Locale } from "../i18n/locale";

/**
 * Textes de l'assistant.
 *
 * Gardés ici plutôt que dans `lib/i18n/dictionary.ts` : l'assistant est une
 * brique autonome, et son point d'extension se branche sans avoir à traverser
 * un dictionnaire de 800 lignes.
 */
const FR = {
  open: "Ouvrir l'assistant",
  close: "Fermer l'assistant",
  title: "Assistant",
  subtitle: "Il répond à partir du contenu de la plateforme",
  placeholder: "Posez votre question sur le cours ou sur SQL…",
  send: "Envoyer",
  thinking: "Recherche en cours…",
  shortcut: "Ctrl + K",
  emptyTitle: "Que voulez-vous éclaircir ?",
  emptyBody:
    "Une notion du cours, une question ratée, une requête qui ne rend pas ce que vous attendez.",
  suggestions: [
    "Quelle est la différence entre WHERE et HAVING ?",
    "Pourquoi NOT IN ne renvoie rien avec un NULL ?",
    "Que couvre le domaine « Restricting and Sorting Data » ?",
  ],
  sources: "Sources",
  runInSandbox: "Exécuter dans le bac à sable",
  copy: "Copier",
  copied: "Copié",
  notRunnable: "Non exécutable sur le schéma du bac à sable",
  unavailableBadge: "Non configuré",
  errorGeneric: "La réponse n'a pas pu être obtenue. Réessayez.",
  errorRate: "Trop de questions d'affilée. Patientez un instant.",
  clear: "Effacer l'affichage",
  auditLink: "Voir la transcription complète",
  auditNote: "Chaque échange est transcrit et conservé.",
  you: "Vous",
  assistant: "Assistant",
  // Page d'audit
  auditTitle: "Transcription de l'assistant",
  auditSubtitle:
    "Tout ce que l'assistant a répondu, conservé et horodaté. Les requêtes proposées sont regroupées à part et restent exécutables.",
  auditEmpty: "Aucun échange pour l'instant.",
  auditAll: "Conversation",
  auditSql: "SQL proposé",
  auditSqlEmpty: "Aucune requête n'a encore été proposée.",
  auditCount: (n: number) => `${n} échange${n > 1 ? "s" : ""}`,
  auditContext: "Posée depuis",
};

export type AssistantStrings = typeof FR;

const EN: AssistantStrings = {
  open: "Open the assistant",
  close: "Close the assistant",
  title: "Assistant",
  subtitle: "It answers from the platform's own content",
  placeholder: "Ask about the course or about SQL…",
  send: "Send",
  thinking: "Looking it up…",
  shortcut: "Ctrl + K",
  emptyTitle: "What would you like cleared up?",
  emptyBody:
    "A point from the course, a question you got wrong, a query that isn't returning what you expect.",
  suggestions: [
    "What is the difference between WHERE and HAVING?",
    "Why does NOT IN return nothing when a NULL is involved?",
    "What does the “Restricting and Sorting Data” domain cover?",
  ],
  sources: "Sources",
  runInSandbox: "Run in the sandbox",
  copy: "Copy",
  copied: "Copied",
  notRunnable: "Not runnable against the sandbox schema",
  unavailableBadge: "Not configured",
  errorGeneric: "The answer could not be retrieved. Try again.",
  errorRate: "Too many questions in a row. Give it a moment.",
  clear: "Clear the view",
  auditLink: "See the full transcript",
  auditNote: "Every exchange is transcribed and kept.",
  you: "You",
  assistant: "Assistant",
  auditTitle: "Assistant transcript",
  auditSubtitle:
    "Everything the assistant has answered, kept and time-stamped. Suggested queries are grouped separately and stay runnable.",
  auditEmpty: "No exchanges yet.",
  auditAll: "Conversation",
  auditSql: "Suggested SQL",
  auditSqlEmpty: "No query has been suggested yet.",
  auditCount: (n: number) => `${n} exchange${n > 1 ? "s" : ""}`,
  auditContext: "Asked from",
};

export function assistantStrings(locale: Locale): AssistantStrings {
  return locale === "en" ? EN : FR;
}
