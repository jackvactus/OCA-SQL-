import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminOverviewStats } from "@/lib/admin";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/activity-types";
import { AdminOverviewChart } from "./overview-chart";

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const stats = await getAdminOverviewStats();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Administration
        </h1>
        <p className="mt-1 text-muted-foreground">
          Vue d&apos;ensemble de la plateforme — utilisateurs, activité et santé du système.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Utilisateurs" value={stats.totalUsers} />
        <StatCard label="Comptes actifs" value={stats.activeUsers} />
        <StatCard label="Administrateurs" value={stats.adminCount} />
        <StatCard label="Événements journalisés" value={stats.totalActivityEvents} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Nouvelles inscriptions (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart data={stats.signupsLast7Days} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions les plus fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topActions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour le moment.</p>
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
                <h3 className="font-semibold">Gestion des utilisateurs</h3>
                <p className="text-sm text-muted-foreground">Rôles, statuts, progression</p>
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
                <h3 className="font-semibold">Journal d&apos;activité global</h3>
                <p className="text-sm text-muted-foreground">Toutes les actions, tous les comptes</p>
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
