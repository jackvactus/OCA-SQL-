import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { listAllActivity } from "@/lib/admin";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/activity-types";

const PAGE_SIZE = 25;

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: { offset?: string };
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const offset = Math.max(Number(searchParams.offset) || 0, 0);
  const { entries, total } = await listAllActivity(PAGE_SIZE, offset);
  const hasMore = offset + PAGE_SIZE < total;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Activity className="h-6 w-6 text-primary" />
          Journal d&apos;activité global
        </h1>
        <p className="mt-1 text-muted-foreground">{total} événement(s) enregistré(s) au total</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toutes les actions, tous les comptes</CardTitle>
          <CardDescription>Les événements les plus récents apparaissent en premier.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucune activité enregistrée.</p>
          ) : (
            <ul className="divide-y divide-border">
              {entries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {ACTIVITY_ACTION_LABELS[entry.action as ActivityAction] ?? entry.action}
                    </p>
                    <Link
                      href={`/admin/users/${entry.user_id}`}
                      className="truncate text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                      {entry.email}
                    </Link>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: fr })}
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
            Précédent
          </Button>
        ) : (
          <Link href={`/admin/activity?offset=${Math.max(offset - PAGE_SIZE, 0)}`}>
            <Button variant="outline">Précédent</Button>
          </Link>
        )}
        {!hasMore ? (
          <Button variant="outline" disabled>
            Suivant
          </Button>
        ) : (
          <Link href={`/admin/activity?offset=${offset + PAGE_SIZE}`}>
            <Button variant="outline">Suivant</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
