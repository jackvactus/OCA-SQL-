import { cookies } from "next/headers";
import { DEFAULT_TRACK, TRACK_COOKIE, isTrackId } from "./current-track";
import type { TrackId } from "./certification-tracks";

/** Réservé au serveur — lit le parcours de certification en cours. */
export function getCurrentTrack(): TrackId {
  const value = cookies().get(TRACK_COOKIE)?.value;
  return isTrackId(value) ? value : DEFAULT_TRACK;
}
