import { redirect } from "next/navigation";
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
import { UserRowActions } from "./user-row-actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const users = await listUsers(searchParams.q);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Users className="h-6 w-6 text-primary" />
          Utilisateurs
        </h1>
        <p className="mt-1 text-muted-foreground">{users.length} compte(s) au total</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rechercher</CardTitle>
          <CardDescription>Par e-mail ou nom affiché</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <Input name="q" placeholder="ex: jean@exemple.com" defaultValue={searchParams.q ?? ""} />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.display_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "secondary" : "destructive"}>
                        {user.is_active ? "Actif" : "Désactivé"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.completed_lessons_count} leçons · {user.xp} XP
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
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
