import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminOverviewStats, listUsers } from "@/lib/admin";
import { modules } from "@/lib/modules-data";
import { activityLabel, type ActivityAction } from "@/lib/activity-types";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { AdminOverviewChart } from "./overview-chart";

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const locale = getLocale();
  const t = dictionary[locale];
  const [stats, users] = await Promise.all([getAdminOverviewStats(), listUsers()]);
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);

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

      <div className="grid gap-4 sm:grid-cols-2">
        <InsightCard
          icon={Activity}
          label={t.admin.engagedUsers}
          value={stats.engagedUsersLast7Days}
          description={t.admin.engagedUsersDesc}
        />
        <InsightCard
          icon={BookOpen}
          label={t.admin.averageLessons}
          value={stats.averageLessonsCompleted}
          description={t.admin.averageLessonsDesc}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              {t.admin.monitoringTitle}
            </CardTitle>
            <CardDescription>{t.admin.monitoringDesc}</CardDescription>
          </div>
          <Link href="/admin/users" className="text-sm font-medium text-primary hover:underline">
            {t.admin.monitoringViewAll}
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.colUser}</TableHead>
                <TableHead>{t.admin.colStatus}</TableHead>
                <TableHead className="min-w-48">{t.admin.colProgress}</TableHead>
                <TableHead>{t.admin.statXp}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    {t.admin.monitoringEmpty}
                  </TableCell>
                </TableRow>
              ) : (
                users.slice(0, 8).map((user) => {
                  const progress = totalLessons > 0 ? Math.min(100, Math.round((user.completed_lessons_count / totalLessons) * 100)) : 0;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Link href={`/admin/users/${user.id}`} className="hover:underline">
                          <div className="font-medium">{user.display_name || user.email}</div>
                          {user.display_name && <div className="text-xs text-muted-foreground">{user.email}</div>}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "secondary" : "destructive"}>
                          {user.is_active ? t.admin.statusActive : t.admin.statusDisabled}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className="w-12 text-right text-xs font-medium tabular-nums">{progress}%</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {user.completed_lessons_count}/{totalLessons} {t.appShell.lessonsShort}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">{user.xp}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                    {activityLabel(item.action, locale)}
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

function InsightCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="border-primary/20 bg-primary/[0.04]">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
