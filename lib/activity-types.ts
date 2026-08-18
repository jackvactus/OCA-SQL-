export type ActivityAction =
  | "register"
  | "login"
  | "logout"
  | "lesson_completed"
  | "quiz_completed"
  | "exam_started"
  | "exam_completed"
  | "flashcard_reviewed"
  | "bookmark_added"
  | "bookmark_removed"
  | "sandbox_query_executed";

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  register: "Compte créé",
  login: "Connexion",
  logout: "Déconnexion",
  lesson_completed: "Leçon terminée",
  quiz_completed: "Quiz complété",
  exam_started: "Examen démarré",
  exam_completed: "Examen terminé",
  flashcard_reviewed: "Flashcard révisée",
  bookmark_added: "Signet ajouté",
  bookmark_removed: "Signet retiré",
  sandbox_query_executed: "Requête SQL exécutée",
};
