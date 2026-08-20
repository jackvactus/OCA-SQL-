import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { workbookQuizQuestions } from "@/lib/quiz-data-en-workbook";
import { AuthStatsProvider } from "./auth-stats-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthStatsProvider moduleCount={modules.length} questionCount={Math.max(quizQuestions.length, workbookQuizQuestions.length)}>
      {children}
    </AuthStatsProvider>
  );
}
