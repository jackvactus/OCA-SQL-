import { redirect } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth/session";
import { listUsers } from "@/lib/admin";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { UserRowActions } from "./user-row-actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const locale = getLocale();
  const t = dictionary[locale];
  const users = await listUsers(searchParams.q);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Users className="h-6 w-6 text-primary" />
          {t.admin.usersTitle}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {users.length} {t.admin.usersCount}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.admin.searchTitle}</CardTitle>
          <CardDescription>{t.admin.searchDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <Input name="q" placeholder={t.admin.searchPlaceholder} defaultValue={searchParams.q ?? ""} />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.colUser}</TableHead>
                <TableHead>{t.admin.colRole}</TableHead>
                <TableHead>{t.admin.colStatus}</TableHead>
                <TableHead>{t.admin.colProgress}</TableHead>
                <TableHead>{t.admin.colJoined}</TableHead>
                <TableHead className="text-right">{t.admin.colActions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    {t.admin.noUsers}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/admin/users/${user.id}`} className="hover:underline">
                        <div className="font-medium">{user.display_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role === "admin" ? t.admin.roleAdmin : t.admin.roleUser}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "secondary" : "destructive"}>
                        {user.is_active ? t.admin.statusActive : t.admin.statusDisabled}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.completed_lessons_count} {t.appShell.lessonsShort} · {user.xp} XP
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserRowActions
                        userId={user.id}
                        role={user.role}
                        isActive={user.is_active}
                        isSelf={user.id === admin.id}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
