import { auth } from "@/auth";
import { apiError, apiOk } from "@/lib/http/api-response";
import { getCompletedPointIds, setPointCompleted } from "@/lib/roadmap/progress-store";
import { isSameOrigin, requestHost } from "@/lib/http/same-origin";
import { parseProgressUpdate } from "@/lib/roadmap/validate-progress-request";

const SERVER_ERROR_MESSAGE = "Could not reach the progress store. Try again in a moment.";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return apiError("Sign in to see your progress.", 401);

  try {
    return apiOk({ completed: await getCompletedPointIds(userId) });
  } catch (error) {
    console.error("[roadmap-progress] read failed", error);
    return apiError(SERVER_ERROR_MESSAGE, 500);
  }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request.headers.get("origin"), requestHost(request))) {
    return apiError("Cross-site requests are not allowed.", 403);
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return apiError("Sign in to save your progress.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON.", 400);
  }

  const update = parseProgressUpdate(body);
  if (!update.ok) return apiError(update.error, 400);

  try {
    await setPointCompleted(userId, update.pointId, update.completed);
    return apiOk({ pointId: update.pointId, completed: update.completed });
  } catch (error) {
    console.error("[roadmap-progress] write failed", error);
    return apiError(SERVER_ERROR_MESSAGE, 500);
  }
}
