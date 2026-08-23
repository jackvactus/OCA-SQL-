import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { workbookQuizQuestions } from "@/lib/quiz-data-en-workbook";
import { getLocale } from "@/lib/i18n/get-locale";
import { AuthStatsProvider } from "./auth-stats-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Le compteur affiché doit correspondre à la banque réellement servie dans la
  // langue courante, pas au maximum des deux — sinon l'annonce est inexacte.
  const bank = getLocale() === "en" ? workbookQuizQuestions : quizQuestions;

  return (
    <AuthStatsProvider moduleCount={modules.length} questionCount={bank.length}>
      {children}
    </AuthStatsProvider>
  );
}
