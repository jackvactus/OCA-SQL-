import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { ArrowLeft, BookOpen, Brain, GraduationCap, History, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { requireAdmin } from "@/lib/auth/session";
import { getUserById } from "@/lib/admin";
import { getProgress } from "@/lib/progress";
import { listActivity } from "@/lib/activity";
import { modules } from "@/lib/modules-data";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/activity-types";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";

const ACTIVITY_PAGE_SIZE = 15;

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { offset?: string };
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const user = await getUserById(params.id);
  if (!user) notFound();

  const locale = getLocale();
  const t = dictionary[locale];
  const dateLocale = locale === "fr" ? fr : enUS;

  const progress = await getProgress(user.id);
  const offset = Math.max(Number(searchParams.offset) || 0, 0);
  const activity = await listActivity(user.id, ACTIVITY_PAGE_SIZE + 1, offset);
  const hasMore = activity.length > ACTIVITY_PAGE_SIZE;
  const activityPage = activity.slice(0, ACTIVITY_PAGE_SIZE);

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const quizCount = Object.keys(progress.quizResults).length;
  const quizAvg =
    quizCount > 0
      ? Math.round(
          (Object.values(progress.quizResults).reduce((sum, r) => sum + (r.correct / r.total) * 100, 0) /
            quizCount) *
            10,
        ) / 10
      : 0;
  const examCount = progress.examResults.length;
  const bestExam =
    examCount > 0 ? Math.max(...progress.examResults.map((e) => Math.round((e.score / e.total) * 100))) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-8">
      <div>
        <Link
          href="/admin/users"
          className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.admin.backToUsers}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{user.display_name || user.email}</h1>
          <Badge variant={user.role === "admin" ? "default" : "outline"}>
            {user.role === "admin" ? t.admin.roleAdmin : t.admin.roleUser}
          </Badge>
          <Badge variant={user.is_active ? "secondary" : "destructive"}>
            {user.is_active ? t.admin.statusActive : t.admin.statusDisabled}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.email} · {t.admin.joinedOn}{" "}
          {new Date(user.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label={t.admin.statLessons}
          value={`${progress.completedLessons.length}/${totalLessons}`}
        />
        <StatCard
          icon={Brain}
          label={t.admin.statQuiz}
          value={String(quizCount)}
          sub={quizCount > 0 ? `${quizAvg}% ${t.admin.quizAvg}` : undefined}
        />
        <StatCard
          icon={GraduationCap}
          label={t.admin.statExams}
          value={String(examCount)}
          sub={examCount > 0 ? `${bestExam}% ${t.admin.examBest}` : undefined}
        />
        <StatCard
          icon={Trophy}
          label={t.admin.statXp}
          value={String(progress.xp)}
          sub={`${progress.streak} ${t.admin.streakDays}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.admin.moduleProgressTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {modules.map((module) => {
            const completed = module.lessons.filter((l) =>
              progress.completedLessons.includes(l.id),
            ).length;
            const total = module.lessons.length;
            const percent = total > 0 ? (completed / total) * 100 : 0;
            return (
              <div key={module.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {module.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{module.title}</p>
                  <Progress value={percent} className="mt-1 h-1.5" />
                </div>
                <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">
                  {completed}/{total}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            {t.admin.userActivityPrefix} {user.display_name || user.email}
          </CardTitle>
          <CardDescription>{t.admin.userActivityDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {activityPage.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t.activity.noActivity}</p>
          ) : (
            <ul className="divide-y divide-border">
              {activityPage.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-medium">
                    {ACTIVITY_ACTION_LABELS[entry.action as ActivityAction] ?? entry.action}
                  </span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: dateLocale })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {offset === 0 ? (
          <Button variant="outline" disabled>
            {t.common.previous}
          </Button>
        ) : (
          <Link href={`/admin/users/${user.id}?offset=${Math.max(offset - ACTIVITY_PAGE_SIZE, 0)}`}>
            <Button variant="outline">{t.common.previous}</Button>
          </Link>
        )}
        {!hasMore ? (
          <Button variant="outline" disabled>
            {t.common.next}
          </Button>
        ) : (
          <Link href={`/admin/users/${user.id}?offset=${offset + ACTIVITY_PAGE_SIZE}`}>
            <Button variant="outline">{t.common.next}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
