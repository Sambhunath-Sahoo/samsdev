import { cache } from "react";
import { getCompletedPointIds } from "@/lib/roadmap/progress-store";

/** The visitor's ticked point ids. Cached per request so the layout and the page share one database read. */
export const loadCompleted = cache(async (userId: string | undefined): Promise<{ ids: string[]; failed: boolean }> => {
  if (!userId) return { ids: [], failed: false };
  try {
    return { ids: await getCompletedPointIds(userId), failed: false };
  } catch (error) {
    console.error("[roadmap] could not load progress", error);
    return { ids: [], failed: true };
  }
});
