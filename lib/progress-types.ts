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

export const defaultProgress: ProgressData = {
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

export function applyCompleteLesson(prev: ProgressData, lessonId: string): ProgressData {
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
}

export function applyRecordQuiz(
  prev: ProgressData,
  quizId: string,
  correct: number,
  total: number,
): ProgressData {
  return {
    ...prev,
    quizResults: {
      ...prev.quizResults,
      [quizId]: { correct, total, date: new Date().toISOString() },
    },
    xp: prev.xp + correct * 10,
  };
}

export function applyRecordExam(
  prev: ProgressData,
  score: number,
  total: number,
  time: number,
): ProgressData {
  return {
    ...prev,
    examResults: [...prev.examResults, { date: new Date().toISOString(), score, total, time }],
    xp: prev.xp + Math.round((score / total) * 200),
  };
}

export function applyUpdateFlashcard(prev: ProgressData, cardId: string, quality: number): ProgressData {
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
}

export function applyToggleBookmark(prev: ProgressData, id: string): { data: ProgressData; added: boolean } {
  const added = !prev.bookmarks.includes(id);
  return {
    data: {
      ...prev,
      bookmarks: added ? [...prev.bookmarks, id] : prev.bookmarks.filter((b) => b !== id),
    },
    added,
  };
}

export function applyAddStudyTime(prev: ProgressData, minutes: number): ProgressData {
  return { ...prev, studyTime: prev.studyTime + minutes };
}
