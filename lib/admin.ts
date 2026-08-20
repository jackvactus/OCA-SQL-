import { query } from "@/lib/db";
import type { UserRole } from "@/lib/auth/jwt";
import { logActivity, type ActivityLogEntry } from "@/lib/activity";

export interface AdminUserRow {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  completed_lessons_count: number;
  xp: number;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export async function getUserById(id: string): Promise<AdminUserDetail | null> {
  const result = await query<AdminUserDetail>(
    `select id, email, display_name, role, is_active, created_at from users where id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listUsers(search?: string): Promise<AdminUserRow[]> {
  const result = await query<AdminUserRow>(
    `select
       u.id, u.email, u.display_name, u.role, u.is_active, u.created_at,
       coalesce(jsonb_array_length(p.completed_lessons), 0) as completed_lessons_count,
       coalesce(p.xp, 0) as xp
     from users u
     left join user_progress p on p.user_id = u.id
     where $1::text is null or u.email ilike '%' || $1 || '%' or u.display_name ilike '%' || $1 || '%'
     order by u.created_at desc`,
    [search?.trim() || null],
  );
  return result.rows;
}

interface UpdateUserInput {
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Applies a role/active change and logs it against the target user's own
 * activity trail. Self-lockout (an admin editing their own role/active
 * flag) is rejected by the caller (the API route) before this runs.
 */
export async function updateUser(
  targetId: string,
  changes: UpdateUserInput,
  actor: { id: string; email: string },
  request?: Request,
): Promise<AdminUserRow | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (changes.role !== undefined) {
    values.push(changes.role);
    sets.push(`role = $${values.length}`);
  }
  if (changes.isActive !== undefined) {
    values.push(changes.isActive);
    sets.push(`is_active = $${values.length}`);
  }
  if (sets.length === 0) return null;

  values.push(targetId);
  const result = await query<{ id: string; email: string }>(
    `update users set ${sets.join(", ")}, updated_at = now() where id = $${values.length} returning id, email`,
    values,
  );
  const updated = result.rows[0];
  if (!updated) return null;

  if (changes.role !== undefined) {
    await logActivity(
      targetId,
      "admin_role_changed",
      { newRole: changes.role, changedBy: actor.email },
      request,
    );
  }
  if (changes.isActive !== undefined) {
    await logActivity(
      targetId,
      changes.isActive ? "admin_user_activated" : "admin_user_deactivated",
      { changedBy: actor.email },
      request,
    );
  }

  const users = await listUsers();
  return users.find((u) => u.id === targetId) ?? null;
}

export async function listAllActivity(
  limit: number,
  offset: number,
  filters: { action?: string; search?: string } = {},
): Promise<{ entries: (ActivityLogEntry & { email: string; user_id: string })[]; total: number }> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.action) {
    values.push(filters.action);
    conditions.push(`a.action = $${values.length}`);
  }
  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`u.email ilike $${values.length}`);
  }
  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";

  const countResult = await query<{ count: string }>(
    `select count(*) from activity_log a join users u on u.id = a.user_id ${where}`,
    values,
  );

  values.push(limit, offset);
  const result = await query<ActivityLogEntry & { email: string; user_id: string }>(
    `select a.id, a.action, a.metadata, a.created_at, u.email, u.id as user_id
     from activity_log a
     join users u on u.id = a.user_id
     ${where}
     order by a.created_at desc
     limit $${values.length - 1} offset $${values.length}`,
    values,
  );

  return { entries: result.rows, total: Number(countResult.rows[0]?.count ?? 0) };
}

export interface AdminOverviewStats {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  totalActivityEvents: number;
  engagedUsersLast7Days: number;
  averageLessonsCompleted: number;
  signupsLast7Days: { day: string; count: number }[];
  topActions: { action: string; count: number }[];
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const [userCounts, activityCount, learning, signups, topActions] = await Promise.all([
    query<{ total: string; active: string; admins: string }>(
      `select
         count(*) as total,
         count(*) filter (where is_active) as active,
         count(*) filter (where role = 'admin') as admins
       from users`,
    ),
    query<{ count: string }>(`select count(*) from activity_log`),
    query<{ engaged: string; average_lessons: string }>(
      `select
         (select count(distinct user_id) from activity_log where created_at > now() - interval '7 days') as engaged,
         coalesce((select avg(jsonb_array_length(completed_lessons)) from user_progress), 0) as average_lessons`,
    ),
    query<{ day: string; count: string }>(
      `select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)
       from users
       where created_at > now() - interval '7 days'
       group by 1 order by 1`,
    ),
    query<{ action: string; count: string }>(
      `select action, count(*) from activity_log group by action order by count(*) desc limit 5`,
    ),
  ]);

  return {
    totalUsers: Number(userCounts.rows[0]?.total ?? 0),
    activeUsers: Number(userCounts.rows[0]?.active ?? 0),
    adminCount: Number(userCounts.rows[0]?.admins ?? 0),
    totalActivityEvents: Number(activityCount.rows[0]?.count ?? 0),
    engagedUsersLast7Days: Number(learning.rows[0]?.engaged ?? 0),
    averageLessonsCompleted: Math.round(Number(learning.rows[0]?.average_lessons ?? 0) * 10) / 10,
    signupsLast7Days: signups.rows.map((r) => ({ day: r.day, count: Number(r.count) })),
    topActions: topActions.rows.map((r) => ({ action: r.action, count: Number(r.count) })),
  };
}

export interface PublicStats {
  totalUsers: number;
  totalLessonsCompleted: number;
  dailyActivity: { day: string; count: number }[];
}

/** PII-free aggregates safe to expose without authentication, for the landing page's live panel. */
export async function getPublicStats(): Promise<PublicStats> {
  const [userCount, lessonsCompleted, dailyActivity] = await Promise.all([
    query<{ count: string }>(`select count(*) from users`),
    query<{ total: string }>(
      `select coalesce(sum(jsonb_array_length(completed_lessons)), 0) as total from user_progress`,
    ),
    query<{ day: string; count: string }>(
      `select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)
       from activity_log
       where created_at > now() - interval '14 days'
       group by 1 order by 1`,
    ),
  ]);

  return {
    totalUsers: Number(userCount.rows[0]?.count ?? 0),
    totalLessonsCompleted: Number(lessonsCompleted.rows[0]?.total ?? 0),
    dailyActivity: dailyActivity.rows.map((r) => ({ day: r.day, count: Number(r.count) })),
  };
}
