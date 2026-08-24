import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { listAllActivity } from "@/lib/admin";
import { activityLabel, type ActivityAction } from "@/lib/activity-types";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";

const PAGE_SIZE = 25;

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: { offset?: string };
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const locale = getLocale();
  const t = dictionary[locale];
  const dateLocale = locale === "fr" ? fr : enUS;

  const offset = Math.max(Number(searchParams.offset) || 0, 0);
  const { entries, total } = await listAllActivity(PAGE_SIZE, offset);
  const hasMore = offset + PAGE_SIZE < total;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Activity className="h-6 w-6 text-primary" />
          {t.admin.globalActivityTitle}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {total} {t.admin.globalActivitySubtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.admin.globalActivityCardTitle}</CardTitle>
          <CardDescription>{t.admin.globalActivityCardDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t.activity.noActivity}</p>
          ) : (
            <ul className="divide-y divide-border">
              {entries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {activityLabel(entry.action, locale)}
                    </p>
                    <Link
                      href={`/admin/users/${entry.user_id}`}
                      className="truncate text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                      {entry.email}
                    </Link>
                  </div>
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
          <Link href={`/admin/activity?offset=${Math.max(offset - PAGE_SIZE, 0)}`}>
            <Button variant="outline">{t.common.previous}</Button>
          </Link>
        )}
        {!hasMore ? (
          <Button variant="outline" disabled>
            {t.common.next}
          </Button>
        ) : (
          <Link href={`/admin/activity?offset=${offset + PAGE_SIZE}`}>
            <Button variant="outline">{t.common.next}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
