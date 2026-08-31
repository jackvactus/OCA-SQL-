"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { TrackId } from "@/lib/certification-tracks";
import { certificationTracks } from "@/lib/certification-tracks";
import { TRACK_COOKIE } from "@/lib/current-track";

interface TrackContextValue {
  trackId: TrackId;
  track: (typeof certificationTracks)[number];
  setTrack: (id: TrackId) => void;
}

const TrackContext = createContext<TrackContextValue | null>(null);

export function TrackProvider({
  trackId: initial,
  children,
}: {
  trackId: TrackId;
  children: React.ReactNode;
}) {
  const [trackId, setTrackId] = useState<TrackId>(initial);

  const setTrack = useCallback((id: TrackId) => {
    // Même cookie que celui lu par `getCurrentTrack()` côté serveur : un seul
    // endroit de vérité, pas de route d'API à maintenir.
    document.cookie = `${TRACK_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
    setTrackId(id);
  }, []);

  const value = useMemo<TrackContextValue>(
    () => ({
      trackId,
      track: certificationTracks.find((t) => t.id === trackId) ?? certificationTracks[0],
      setTrack,
    }),
    [trackId, setTrack],
  );

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
}

/**
 * Parcours en cours.
 *
 * Renvoie le parcours par défaut hors de l'espace connecté, où le fournisseur
 * n'est pas monté — plutôt que de lever, ce qui casserait la page publique.
 */
export function useCurrentTrack(): TrackContextValue {
  const context = useContext(TrackContext);
  if (context) return context;
  return {
    trackId: certificationTracks[0].id,
    track: certificationTracks[0],
    setTrack: () => {},
  };
}
