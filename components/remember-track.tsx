"use client";

import { useEffect } from "react";

import type { TrackId } from "@/lib/certification-tracks";
import { useCurrentTrack } from "@/components/track-provider";

/**
 * Mémorise le parcours consulté.
 *
 * Déposé sur la page d'un parcours et sur celle d'une session de cursus, il
 * suffit à ce que les boutons « continuer » du tableau de bord et de la liste
 * des cours ramènent ensuite au bon domaine — et non systématiquement au SQL.
 *
 * Ne rend rien : c'est un effet de bord assumé, pas un élément d'interface.
 */
export function RememberTrack({ trackId }: { trackId: TrackId }) {
  const { trackId: courant, setTrack } = useCurrentTrack();

  useEffect(() => {
    if (courant !== trackId) setTrack(trackId);
  }, [trackId, courant, setTrack]);

  return null;
}
