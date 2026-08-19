import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import {
  BookOpen,
  Bookmark,
  BookmarkX,
  Brain,
  Code2,
  GraduationCap,
  History,
  Layers,
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { listActivity } from "@/lib/activity";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/activity-types";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";

const PAGE_SIZE = 20;

const ACTION_ICONS: Record<ActivityAction, typeof History> = {
  register: UserPlus,
  login: LogIn,
  logout: LogOut,
  lesson_completed: BookOpen,
  quiz_completed: Brain,
  exam_started: GraduationCap,
  exam_completed: GraduationCap,
  flashcard_reviewed: Layers,
  bookmark_added: Bookmark,
  bookmark_removed: BookmarkX,
  sandbox_query_executed: Code2,
  admin_role_changed: ShieldAlert,
  admin_user_activated: ShieldCheck,
  admin_user_deactivated: ShieldX,
};

function describeMetadata(action: ActivityAction, metadata: Record<string, unknown>): string | null {
  switch (action) {
    case "lesson_completed":
      return typeof metadata.lessonId === "string" ? `Leçon : ${metadata.lessonId}` : null;
    case "quiz_completed":
      return typeof metadata.correct === "number" && typeof metadata.total === "number"
        ? `Score : ${metadata.correct}/${metadata.total}`
        : null;
    case "exam_completed":
      return typeof metadata.score === "number" && typeof metadata.total === "number"
        ? `Score : ${metadata.score}/${metadata.total}`
        : null;
    case "flashcard_reviewed":
      return typeof metadata.cardId === "string" ? `Carte : ${metadata.cardId}` : null;
    case "sandbox_query_executed":
      return typeof metadata.query === "string" ? metadata.query : null;
    case "admin_role_changed":
      return typeof metadata.newRole === "string" ? `Nouveau rôle : ${metadata.newRole}` : null;
    case "admin_user_activated":
    case "admin_user_deactivated":
      return typeof metadata.changedBy === "string" ? `Par : ${metadata.changedBy}` : null;
    default:
      return null;
  }
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: { offset?: string };
}) {
  const user = await getSessionUser();
  if (!user) return null;

  const locale = getLocale();
  const t = dictionary[locale];
  const dateLocale = locale === "fr" ? fr : enUS;

  const offset = Math.max(Number(searchParams.offset) || 0, 0);
  const entries = await listActivity(user.id, PAGE_SIZE + 1, offset);
  const hasMore = entries.length > PAGE_SIZE;
  const page = entries.slice(0, PAGE_SIZE);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6 text-primary" />
          {t.activity.title}
        </h1>
        <p className="mt-1 text-muted-foreground">{t.activity.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.activity.logTitle}</CardTitle>
          <CardDescription>{t.activity.logDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {page.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t.activity.noActivity}</p>
          ) : (
            <ul className="divide-y divide-border">
              {page.map((entry) => {
                const action = entry.action as ActivityAction;
                const Icon = ACTION_ICONS[action] ?? History;
                const label = ACTIVITY_ACTION_LABELS[action] ?? entry.action;
                const detail = describeMetadata(action, entry.metadata ?? {});
                return (
                  <li key={entry.id} className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <p className="text-sm font-medium">{label}</p>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                      </div>
                      {detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p>}
                    </div>
                  </li>
                );
              })}
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
          <Link href={`/activity?offset=${Math.max(offset - PAGE_SIZE, 0)}`}>
            <Button variant="outline">{t.common.previous}</Button>
          </Link>
        )}
        {!hasMore ? (
          <Button variant="outline" disabled>
            {t.common.next}
          </Button>
        ) : (
          <Link href={`/activity?offset=${offset + PAGE_SIZE}`}>
            <Button variant="outline">{t.common.next}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
