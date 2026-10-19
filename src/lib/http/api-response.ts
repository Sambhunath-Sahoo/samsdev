export interface ApiEnvelope<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
}

export function apiOk<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data, error: null } satisfies ApiEnvelope<T>, { status });
}

export function apiError(error: string, status: number): Response {
  return Response.json({ success: false, data: null, error } satisfies ApiEnvelope<never>, { status });
}
