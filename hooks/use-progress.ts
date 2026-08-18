"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { ProgressData } from "@/lib/progress-types";
import {
  applyAddStudyTime,
  applyCompleteLesson,
  applyRecordExam,
  applyRecordQuiz,
  applyToggleBookmark,
  applyUpdateFlashcard,
} from "@/lib/progress-types";
import {
  ensureProgressLoaded,
  getProgressSnapshot,
  isProgressLoaded,
  subscribeProgress,
  updateProgressState,
} from "@/lib/progress-store";

export type { ProgressData };

async function postProgress(url: string, body: unknown, onUnauthorized: () => void) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    onUnauthorized();
  }
  return res;
}

export function useProgress() {
  const router = useRouter();
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressSnapshot);
  const loaded = useSyncExternalStore(subscribeProgress, isProgressLoaded, () => false);

  const handleUnauthorized = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    ensureProgressLoaded(handleUnauthorized);
  }, [handleUnauthorized]);

  const completeLesson = useCallback(
    (lessonId: string) => {
      updateProgressState((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        return applyCompleteLesson(prev, lessonId);
      });
      postProgress("/api/progress/lesson", { lessonId }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  const recordQuiz = useCallback(
    (quizId: string, correct: number, total: number) => {
      updateProgressState((prev) => applyRecordQuiz(prev, quizId, correct, total));
      postProgress("/api/progress/quiz", { quizId, correct, total }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  const recordExam = useCallback(
    (score: number, total: number, time: number) => {
      updateProgressState((prev) => applyRecordExam(prev, score, total, time));
      postProgress("/api/progress/exam", { score, total, time }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  const updateFlashcard = useCallback(
    (cardId: string, quality: number) => {
      updateProgressState((prev) => applyUpdateFlashcard(prev, cardId, quality));
      postProgress("/api/progress/flashcard", { cardId, quality }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      updateProgressState((prev) => applyToggleBookmark(prev, id).data);
      postProgress("/api/progress/bookmark", { id }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  const addStudyTime = useCallback(
    (minutes: number) => {
      updateProgressState((prev) => applyAddStudyTime(prev, minutes));
      postProgress("/api/progress/study-time", { minutes }, handleUnauthorized);
    },
    [handleUnauthorized],
  );

  return {
    progress,
    loaded,
    completeLesson,
    recordQuiz,
    recordExam,
    updateFlashcard,
    toggleBookmark,
    addStudyTime,
  };
}
