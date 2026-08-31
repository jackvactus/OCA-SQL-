import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCurrentTrack } from "@/lib/get-current-track";
import { AppLayout } from "@/components/app-layout";
import { TrackProvider } from "@/components/track-provider";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // Le parcours en cours est lu ici, une fois, et descendu par contexte : sans
  // lui, tous les boutons « continuer » retombaient sur les modules SQL, quel
  // que soit le parcours suivi.
  const trackId = getCurrentTrack();

  return (
    <TrackProvider trackId={trackId}>
      <AppLayout user={user}>{children}</AppLayout>
    </TrackProvider>
  );
}
