import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AppLayout } from "@/components/app-layout";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <AppLayout user={user}>{children}</AppLayout>;
}
