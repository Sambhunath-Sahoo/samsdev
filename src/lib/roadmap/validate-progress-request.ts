import { isKnownPointId } from "./point-ids";

export type ProgressUpdateResult =
  | { readonly ok: true; readonly pointId: string; readonly completed: boolean }
  | { readonly ok: false; readonly error: string };

export function parseProgressUpdate(body: unknown): ProgressUpdateResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Request body must be a JSON object." };
  const { pointId, completed } = body as Record<string, unknown>;
  if (!isKnownPointId(pointId)) return { ok: false, error: "Unknown pointId." };
  if (typeof completed !== "boolean") return { ok: false, error: "completed must be true or false." };
  return { ok: true, pointId, completed };
}
