import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { AuthStatsProvider } from "./auth-stats-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthStatsProvider moduleCount={modules.length} questionCount={quizQuestions.length}>
      {children}
    </AuthStatsProvider>
  );
}
