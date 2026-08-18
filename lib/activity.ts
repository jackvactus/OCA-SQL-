import { query } from "@/lib/db";
import type { ActivityAction } from "@/lib/activity-types";

export type { ActivityAction } from "@/lib/activity-types";

export interface ActivityLogEntry {
  id: string;
  action: ActivityAction;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function logActivity(
  userId: string,
  action: ActivityAction,
  metadata: Record<string, unknown> = {},
  request?: Request,
) {
  const ip =
    request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request?.headers.get("x-real-ip") ??
    null;
  const userAgent = request?.headers.get("user-agent") ?? null;

  await query(
    `insert into activity_log (user_id, action, metadata, ip_address, user_agent)
     values ($1, $2, $3, $4, $5)`,
    [userId, action, JSON.stringify(metadata), ip, userAgent],
  );
}

export async function listActivity(userId: string, limit: number, offset: number) {
  const result = await query<ActivityLogEntry>(
    `select id, action, metadata, created_at
     from activity_log
     where user_id = $1
     order by created_at desc
     limit $2 offset $3`,
    [userId, limit, offset],
  );
  return result.rows;
}
