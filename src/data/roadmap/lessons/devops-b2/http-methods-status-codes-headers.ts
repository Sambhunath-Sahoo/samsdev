import type { LessonEntry } from "@/types/roadmap";

export const HTTP_METHODS_STATUS_CODES_HEADERS: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "HTTP methods, status codes and headers (curl -v)",
    slug: "http-methods-status-codes-headers",
    lesson: {
      summary: "Read an HTTP exchange with curl -v and know what each method, status class and common header is telling you.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Reading curl -v" },
        { type: "p", text: "`curl -v` prints the whole conversation. Lines starting with `*` are curl's own notes (DNS, connect, TLS), `>` lines are what you sent, and `<` lines are what came back. When a request misbehaves, this output usually shows the cause in the first ten lines." },
        {
          type: "code",
          language: "bash",
          code: `curl -v https://example.com/api/items 2>&1 | head -30
# * Trying 203.0.113.10:443...        <- DNS worked, TCP connecting
# * SSL connection using TLSv1.3      <- handshake finished
# > GET /api/items HTTP/2             <- your request line
# > Host: example.com
# < HTTP/2 301                        <- the response status
# < location: https://example.com/api/items/`,
        },
        { type: "h2", text: "Methods" },
        { type: "p", text: "The method states the intent. Two properties matter for operations: whether it is **safe** (does not change server state) and whether it is **idempotent** (repeating it has the same effect as doing it once). Proxies, retries and load balancers rely on these properties." },
        {
          type: "table",
          head: ["Method", "Use", "Safe", "Idempotent"],
          rows: [
            ["`GET`", "Read a resource", "Yes", "Yes"],
            ["`HEAD`", "Same as GET, headers only", "Yes", "Yes"],
            ["`POST`", "Create or trigger an action", "No", "No"],
            ["`PUT`", "Replace a resource", "No", "Yes"],
            ["`PATCH`", "Partially change a resource", "No", "Not guaranteed"],
            ["`DELETE`", "Remove a resource", "No", "Yes"],
            ["`OPTIONS`", "Ask what is allowed (CORS preflight)", "Yes", "Yes"],
          ],
        },
        { type: "h2", text: "Status codes by class" },
        {
          type: "list",
          items: [
            "**2xx** success: `200` OK, `201` created, `204` success with no body.",
            "**3xx** redirect: `301` and `308` permanent, `302` and `307` temporary, `304` not modified (your cache is still valid).",
            "**4xx** the client is at fault: `400` bad request, `401` not authenticated, `403` authenticated but not allowed, `404` not found, `429` too many requests.",
            "**5xx** the server is at fault: `500` app error, `502` the proxy got a bad answer from the app, `503` unavailable, `504` the proxy timed out waiting for the app.",
          ],
        },
        { type: "p", text: "For a reverse proxy setup, the 5xx split is the most useful. A `502` means the proxy reached nothing useful (the app is down or listening on another port). A `504` means the app is up but too slow. Different cause, different first step." },
        { type: "h2", text: "Headers worth knowing" },
        {
          type: "code",
          language: "bash",
          code: `curl -sI https://example.com
# content-type: text/html; charset=utf-8     what the body is
# cache-control: max-age=3600                how long caches may keep it
# location: /new-path                        where a 3xx wants you to go
# set-cookie: sid=abc; HttpOnly; Secure      server sets a cookie
# strict-transport-security: max-age=31536000   browser must use HTTPS`,
        },
        { type: "p", text: "On requests, `Authorization` carries credentials, `Accept` says which formats you want, `Content-Type` describes your body, and `User-Agent` identifies the client. Behind a proxy, the app often reads `X-Forwarded-For` and `X-Forwarded-Proto` to learn the real client IP and scheme, because the connection it sees comes from the proxy." },
        { type: "callout", tone: "gotcha", title: "401 and 403 are not the same", text: "`401` means the server does not know who you are, so check the token or cookie. `403` means it knows you and refuses, so check roles and permissions. Mixing them up sends you to the wrong layer. Also, a `301` is cached hard by browsers, so test redirects with curl, not the browser." },
        { type: "p", text: "Common mistakes: retrying a `POST` automatically and creating duplicates, treating every 4xx as a server bug, and ignoring `Content-Type` when a client cannot parse a response that is actually HTML from an error page." },
      ],
      references: [
        { title: "HTTP request methods - HTTP | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods" },
        { title: "HTTP response status codes - HTTP | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" },
        { title: "HTTP headers - HTTP | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers" },
        { title: "RFC 9110: HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110.html" },
      ],
    },
    points: [
      {
        id: "devops.http-methods.safe-idempotent",
        title: "Safe and idempotent methods",
        detail: "GET and HEAD do not change state. PUT and DELETE are idempotent, so repeating them is harmless. POST is neither, so automatic retries can create duplicates.",
        question: "Why is it risky for a client to retry a failed POST automatically?",
      },
      {
        id: "devops.http-methods.status-classes",
        title: "Status code classes",
        detail: "2xx is success, 3xx redirect, 4xx a client error and 5xx a server error. Knowing the class tells you which side to investigate first.",
        question: "What is the difference between a 401 and a 403?",
      },
      {
        id: "devops.http-methods.502-vs-504",
        title: "502 versus 504 behind a proxy",
        detail: "A 502 means the proxy could not get a valid answer from the app, usually because it is down or on the wrong port. A 504 means the app did not answer in time.",
        question: "A proxy returns 504. Is the app down or slow?",
      },
      {
        id: "devops.http-methods.curl-v",
        title: "Reading curl -v output",
        detail: "Lines with `*` show connection and TLS steps, `>` lines are the request and `<` lines are the response. The first lines show whether DNS, TCP and TLS worked.",
        question: "In curl -v output, which marker shows the headers your client sent?",
      },
    ],
  },
};
