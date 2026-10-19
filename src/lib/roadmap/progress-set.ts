/** Returns a new set with the point added or removed. Never mutates the input. */
export function withPointCompleted(current: ReadonlySet<string>, pointId: string, completed: boolean): ReadonlySet<string> {
  const next = new Set(current);
  if (completed) next.add(pointId);
  else next.delete(pointId);
  return next;
}
