import { pool, query } from "@/lib/db";
import { defaultProgress, type ProgressData } from "@/lib/progress-types";

export * from "@/lib/progress-types";

interface ProgressRow {
  completed_lessons: ProgressData["completedLessons"];
  quiz_results: ProgressData["quizResults"];
  exam_results: ProgressData["examResults"];
  flashcard_progress: ProgressData["flashcardProgress"];
  study_time: number;
  streak: number;
  last_study_date: string;
  xp: number;
  bookmarks: ProgressData["bookmarks"];
}

function rowToProgress(row: ProgressRow): ProgressData {
  return {
    completedLessons: row.completed_lessons,
    quizResults: row.quiz_results,
    examResults: row.exam_results,
    flashcardProgress: row.flashcard_progress,
    studyTime: row.study_time,
    streak: row.streak,
    lastStudyDate: row.last_study_date,
    xp: row.xp,
    bookmarks: row.bookmarks,
  };
}

export async function getProgress(userId: string): Promise<ProgressData> {
  const result = await query<ProgressRow>(
    `select completed_lessons, quiz_results, exam_results, flashcard_progress,
            study_time, streak, last_study_date, xp, bookmarks
     from user_progress where user_id = $1`,
    [userId],
  );
  if (result.rows.length === 0) {
    await query(`insert into user_progress (user_id) values ($1) on conflict do nothing`, [userId]);
    return { ...defaultProgress };
  }
  return rowToProgress(result.rows[0]);
}

/**
 * Read-modify-write under a row lock so concurrent mutations (e.g. two
 * progress-affecting requests in flight at once) can't clobber each other.
 */
export async function updateProgress(
  userId: string,
  mutate: (prev: ProgressData) => ProgressData,
): Promise<ProgressData> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(
      `insert into user_progress (user_id) values ($1) on conflict do nothing`,
      [userId],
    );
    const result = await client.query<ProgressRow>(
      `select completed_lessons, quiz_results, exam_results, flashcard_progress,
              study_time, streak, last_study_date, xp, bookmarks
       from user_progress where user_id = $1 for update`,
      [userId],
    );
    const next = mutate(rowToProgress(result.rows[0]));
    await client.query(
      `update user_progress set
         completed_lessons = $2, quiz_results = $3, exam_results = $4, flashcard_progress = $5,
         study_time = $6, streak = $7, last_study_date = $8, xp = $9, bookmarks = $10, updated_at = now()
       where user_id = $1`,
      [
        userId,
        JSON.stringify(next.completedLessons),
        JSON.stringify(next.quizResults),
        JSON.stringify(next.examResults),
        JSON.stringify(next.flashcardProgress),
        next.studyTime,
        next.streak,
        next.lastStudyDate,
        next.xp,
        JSON.stringify(next.bookmarks),
      ],
    );
    await client.query("commit");
    return next;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
