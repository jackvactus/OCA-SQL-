import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminOverviewStats } from "@/lib/admin";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/activity-types";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { AdminOverviewChart } from "./overview-chart";

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const t = dictionary[getLocale()];
  const stats = await getAdminOverviewStats();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="h-6 w-6 text-primary" />
          {t.admin.title}
        </h1>
        <p className="mt-1 text-muted-foreground">{t.admin.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.admin.statUsers} value={stats.totalUsers} />
        <StatCard label={t.admin.statActive} value={stats.activeUsers} />
        <StatCard label={t.admin.statAdmins} value={stats.adminCount} />
        <StatCard label={t.admin.statEvents} value={stats.totalActivityEvents} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t.admin.signupsChartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart
              data={stats.signupsLast7Days}
              noDataLabel={t.admin.noSignups}
              signupsLabel={t.admin.signupsLabel}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.admin.topActionsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topActions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.admin.noData}</p>
            ) : (
              stats.topActions.map((item) => (
                <div key={item.action} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ACTIVITY_ACTION_LABELS[item.action as ActivityAction] ?? item.action}
                  </span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/admin/users">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t.admin.usersCardTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.admin.usersCardDesc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>
        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/admin/activity">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t.admin.activityCardTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.admin.activityCardDesc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
