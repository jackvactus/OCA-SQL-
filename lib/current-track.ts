import { certificationTracks, type TrackId } from "./certification-tracks";
import { curricula } from "./curricula";
import type { Locale } from "./i18n/locale";
import type { ProgressData } from "./progress-types";

/**
 * Parcours de certification en cours.
 *
 * Rien ne mémorisait jusqu'ici le parcours choisi : le bouton « continuer »
 * pointait en dur vers `/courses`, c'est-à-dire les modules SQL. Un apprenant
 * inscrit sur Data Guard ou RAC était donc systématiquement ramené au SQL.
 *
 * Le parcours est stocké dans un cookie, comme la locale : lisible par les
 * composants serveur via `getCurrentTrack()` et par le client via
 * `useCurrentTrack()`, sans route d'API.
 */

export const TRACK_COOKIE = "track";
export const DEFAULT_TRACK: TrackId = "oca-sql";

const IDS = new Set<string>(certificationTracks.map((track) => track.id));

export function isTrackId(value: string | undefined | null): value is TrackId {
  return typeof value === "string" && IDS.has(value);
}

/** Où reprendre : une destination et ce qu'elle représente. */
export interface NextStep {
  /** Chemin interne vers la leçon ou la session à suivre. */
  href: string;
  /** Intitulé de l'étape, dans la langue demandée. */
  label: string;
  /** Vrai si tout le parcours est terminé — la destination est alors la vue d'ensemble. */
  complete: boolean;
}

/**
 * Détermine où reprendre **dans le parcours donné**.
 *
 * Le parcours OCA SQL s'appuie sur les 18 modules ; les cinq autres sur les
 * sessions de leur cursus. Une session terminée est enregistrée dans
 * `completedLessons` sous son propre identifiant, exactement comme une leçon.
 */
export function resolveNextStep(
  track: TrackId,
  progress: ProgressData,
  locale: Locale,
  modules: { id: string; title: string; lessons: { id: string }[] }[],
): NextStep {
  const en = locale === "en";

  if (track === "oca-sql") {
    const suivant = modules.find(
      (module) => !module.lessons.every((l) => progress.completedLessons.includes(l.id)),
    );
    if (suivant) {
      return { href: `/courses/${suivant.id}`, label: suivant.title, complete: false };
    }
    return {
      href: "/courses",
      label: en ? "All modules completed" : "Tous les modules sont terminés",
      complete: true,
    };
  }

  const curriculum = curricula.find((c) => c.id === track);
  if (!curriculum) {
    // Parcours inconnu — on ne devine pas, on renvoie vers le choix.
    return {
      href: "/tracks",
      label: en ? "Choose a track" : "Choisir un parcours",
      complete: false,
    };
  }

  const suivante = curriculum.sessions.find(
    (session) => !progress.completedLessons.includes(session.id),
  );
  if (suivante) {
    return {
      href: `/curriculum/${suivante.id}`,
      label: `${en ? "Session" : "Session"} ${suivante.number} — ${
        en ? suivante.title.en : suivante.title.fr
      }`,
      complete: false,
    };
  }

  return {
    href: "/curriculum",
    label: en ? "All sessions completed" : "Toutes les sessions sont terminées",
    complete: true,
  };
}

/** Avancement du parcours, en nombre d'étapes terminées. */
export function trackProgress(
  track: TrackId,
  progress: ProgressData,
  modules: { id: string; lessons: { id: string }[] }[],
): { done: number; total: number; percent: number } {
  const ids =
    track === "oca-sql"
      ? modules.flatMap((m) => m.lessons.map((l) => l.id))
      : (curricula.find((c) => c.id === track)?.sessions ?? []).map((s) => s.id);

  const done = ids.filter((id) => progress.completedLessons.includes(id)).length;
  return {
    done,
    total: ids.length,
    percent: ids.length === 0 ? 0 : Math.round((done / ids.length) * 100),
  };
}
