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
  | "sandbox_query_executed"
  | "admin_role_changed"
  | "admin_user_activated"
  | "admin_user_deactivated";

/** Libellés bilingues des actions journalisées. */
export const ACTIVITY_ACTION_LABELS_EN: Record<ActivityAction, string> = {
  register: "Account created",
  login: "Signed in",
  logout: "Signed out",
  lesson_completed: "Lesson completed",
  quiz_completed: "Quiz completed",
  exam_started: "Exam started",
  exam_completed: "Exam completed",
  flashcard_reviewed: "Flashcard reviewed",
  bookmark_added: "Bookmark added",
  bookmark_removed: "Bookmark removed",
  sandbox_query_executed: "SQL query run",
  admin_role_changed: "Role changed by an administrator",
  admin_user_activated: "Account re-enabled by an administrator",
  admin_user_deactivated: "Account disabled by an administrator",
};

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
  admin_role_changed: "Rôle modifié par un administrateur",
  admin_user_activated: "Compte réactivé par un administrateur",
  admin_user_deactivated: "Compte désactivé par un administrateur",
};

/** Libellé d'une action dans la langue demandée. */
export function activityLabel(action: ActivityAction | string, locale: "fr" | "en"): string {
  const table = locale === "en" ? ACTIVITY_ACTION_LABELS_EN : ACTIVITY_ACTION_LABELS;
  return table[action as ActivityAction] ?? action;
}
