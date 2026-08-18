"use client";

import { defaultProgress, type ProgressData } from "@/lib/progress-types";

// A tiny external store shared by every mounted useProgress() instance
// (the persistent AppLayout shell plus whichever page is active). This
// keeps them all reading the same data, so:
//  - only one GET /api/progress fires per session instead of one per
//    mounted instance, and
//  - an update made from one instance (e.g. completing a lesson on
//    /courses) is reflected immediately in the others (e.g. the XP/streak
//    widget in the sidebar) without waiting for a fresh fetch.

type Listener = () => void;

let state: ProgressData = defaultProgress;
let loaded = false;
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeProgress(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProgressSnapshot() {
  return state;
}

export function isProgressLoaded() {
  return loaded;
}

export function ensureProgressLoaded(onUnauthorized: () => void) {
  if (loaded || fetchPromise) return fetchPromise ?? Promise.resolve();

  fetchPromise = fetch("/api/progress")
    .then((res) => {
      if (res.status === 401) {
        onUnauthorized();
        return null;
      }
      return res.json();
    })
    .then((data: ProgressData | null) => {
      if (data) state = { ...defaultProgress, ...data };
    })
    .catch(() => {
      // keep default progress on failure
    })
    .finally(() => {
      loaded = true;
      fetchPromise = null;
      emit();
    });

  return fetchPromise;
}

export function updateProgressState(updater: (prev: ProgressData) => ProgressData) {
  state = updater(state);
  emit();
}

export function resetProgressStore() {
  state = defaultProgress;
  loaded = false;
  fetchPromise = null;
  emit();
}
