"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { withPointCompleted } from "@/lib/roadmap/progress-set";

interface Progress {
  readonly isSignedIn: boolean;
  readonly completed: ReadonlySet<string>;
  readonly errorMessage: string | null;
  readonly setItem: (id: string, completed: boolean) => Promise<void>;
}

const ProgressContext = createContext<Progress | null>(null);

export function useProgress(): Progress {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}

async function saveItem(endpoint: string, idKey: string, id: string, completed: boolean): Promise<string | null> {
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ [idKey]: id, completed }),
    });
    if (response.ok) return null;
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "Could not save your progress.";
  } catch {
    return "Could not save your progress. Check your connection.";
  }
}

/**
 * Holds one visitor's ticked ids and saves each change to `endpoint` as `{ [idKey]: id, completed }`.
 * Updates the screen first, then rolls back if the save fails.
 */
export function ProgressProvider({
  endpoint,
  idKey,
  isSignedIn,
  initialCompleted,
  children,
}: {
  endpoint: string;
  idKey: string;
  isSignedIn: boolean;
  initialCompleted: readonly string[];
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState<ReadonlySet<string>>(() => new Set(initialCompleted));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setItem = useCallback(
    async (id: string, isCompleted: boolean) => {
      if (!isSignedIn) return;
      setErrorMessage(null);
      setCompleted((current) => withPointCompleted(current, id, isCompleted));
      const failure = await saveItem(endpoint, idKey, id, isCompleted);
      if (failure) {
        setCompleted((current) => withPointCompleted(current, id, !isCompleted));
        setErrorMessage(failure);
      }
    },
    [endpoint, idKey, isSignedIn],
  );

  const value = useMemo(() => ({ isSignedIn, completed, errorMessage, setItem }), [isSignedIn, completed, errorMessage, setItem]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
