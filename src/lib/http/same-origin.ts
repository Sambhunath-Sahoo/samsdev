/** Blocks cross-site writes: the Origin header must match the host the request was sent to. */
export function isSameOrigin(originHeader: string | null, hostHeader: string | null): boolean {
  if (!originHeader || !hostHeader) return false;
  try {
    return new URL(originHeader).host === hostHeader;
  } catch {
    return false;
  }
}

/** Reads the host the visitor used, honouring the proxy header Vercel sets. */
export function requestHost(request: Request): string | null {
  return request.headers.get("x-forwarded-host") ?? request.headers.get("host");
}
