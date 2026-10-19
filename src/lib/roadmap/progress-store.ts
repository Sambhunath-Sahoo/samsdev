import { getSql } from "@/lib/db";

export async function getCompletedPointIds(userId: string): Promise<string[]> {
  const sql = getSql();
  const rows = await sql`SELECT point_id FROM roadmap_progress WHERE user_id = ${userId}`;
  return rows.map((row) => String(row.point_id));
}

export async function setPointCompleted(userId: string, pointId: string, completed: boolean): Promise<void> {
  const sql = getSql();
  if (completed) {
    await sql`INSERT INTO roadmap_progress (user_id, point_id) VALUES (${userId}, ${pointId}) ON CONFLICT (user_id, point_id) DO NOTHING`;
    return;
  }
  await sql`DELETE FROM roadmap_progress WHERE user_id = ${userId} AND point_id = ${pointId}`;
}
