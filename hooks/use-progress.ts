"use client";

import { useState, useEffect, useCallback } from "react";

export interface ProgressData {
  completedLessons: string[];
  quizResults: Record<string, { correct: number; total: number; date: string }>;
  examResults: Array<{ date: string; score: number; total: number; time: number }>;
  flashcardProgress: Record<string, { ease: number; interval: number; due: string; reps: number }>;
  studyTime: number;
  streak: number;
  lastStudyDate: string;
  xp: number;
  bookmarks: string[];
}

const defaultProgress: ProgressData = {
  completedLessons: [],
  quizResults: {},
  examResults: [],
  flashcardProgress: {},
  studyTime: 0,
  streak: 0,
  lastStudyDate: "",
  xp: 0,
  bookmarks: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("oracle-progress");
      if (stored) {
        setProgress({ ...defaultProgress, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const save = useCallback((data: ProgressData) => {
    try {
      localStorage.setItem("oracle-progress", JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback(
    (updater: (prev: ProgressData) => ProgressData) => {
      setProgress((prev) => {
        const next = updater(prev);
        save(next);
        return next;
      });
    },
    [save],
  );

  const completeLesson = useCallback(
    (lessonId: string) => {
      update((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let streak = prev.streak;
        if (prev.lastStudyDate === today) {
          // already studied today
        } else if (prev.lastStudyDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }
        return {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          xp: prev.xp + 50,
          streak,
          lastStudyDate: today,
        };
      });
    },
    [update],
  );

  const recordQuiz = useCallback(
    (quizId: string, correct: number, total: number) => {
      update((prev) => ({
        ...prev,
        quizResults: {
          ...prev.quizResults,
          [quizId]: { correct, total, date: new Date().toISOString() },
        },
        xp: prev.xp + correct * 10,
      }));
    },
    [update],
  );

  const recordExam = useCallback(
    (score: number, total: number, time: number) => {
      update((prev) => ({
        ...prev,
        examResults: [
          ...prev.examResults,
          { date: new Date().toISOString(), score, total, time },
        ],
        xp: prev.xp + Math.round((score / total) * 200),
      }));
    },
    [update],
  );

  const updateFlashcard = useCallback(
    (cardId: string, quality: number) => {
      update((prev) => {
        const existing = prev.flashcardProgress[cardId] || {
          ease: 2.5,
          interval: 1,
          due: new Date().toISOString(),
          reps: 0,
        };
        let { ease, interval, reps } = existing;
        reps += 1;
        if (quality < 3) {
          interval = 1;
        } else {
          if (reps === 1) interval = 1;
          else if (reps === 2) interval = 6;
          else interval = Math.round(interval * ease);
          ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        }
        const due = new Date(Date.now() + interval * 86400000).toISOString();
        return {
          ...prev,
          flashcardProgress: {
            ...prev.flashcardProgress,
            [cardId]: { ease, interval, due, reps },
          },
          xp: prev.xp + 5,
        };
      });
    },
    [update],
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks.includes(id)
          ? prev.bookmarks.filter((b) => b !== id)
          : [...prev.bookmarks, id],
      }));
    },
    [update],
  );

  const addStudyTime = useCallback(
    (minutes: number) => {
      update((prev) => ({ ...prev, studyTime: prev.studyTime + minutes }));
    },
    [update],
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
