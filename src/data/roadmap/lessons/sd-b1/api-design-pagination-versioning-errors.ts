import type { LessonEntry } from "@/types/roadmap";

export const API_DESIGN_PAGINATION_VERSIONING_ERRORS: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "API design: pagination, versioning, error formats",
    slug: "api-design-pagination-versioning-errors",
    lesson: {
      summary: "An API is a contract you cannot easily take back, so decide how it pages, changes and fails before the first client depends on it.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Versioning and compatible changes" },
        { type: "p", text: "Clients you do not control will never upgrade on your schedule. Most change should be **backward compatible** so no version bump is needed: adding a new optional field, a new endpoint or a new enum value that clients ignore safely. Breaking changes are removing or renaming fields, changing a type, tightening validation, or changing meaning." },
        { type: "list", items: ["URL version: `/v2/orders`. Obvious and easy to route, but copies the whole surface.", "Header or media type: `Accept: application/vnd.shop.v2+json`. Cleaner URLs, harder to test in a browser.", "Date-based version pinned per account, as Stripe does: each client sees the behaviour from the day they integrated until they opt in."] },
        { type: "p", text: "Whatever you choose, make clients tolerant (ignore unknown fields), announce deprecations with a date and a `Sunset` header, and watch usage per version before you remove one." },
        { type: "h2", text: "Pagination in an API contract" },
        { type: "p", text: "Never return an unbounded list. The two main styles trade simplicity against stability." },
        { type: "table", head: ["Style", "Request", "Strength", "Weakness"], rows: [["Offset and limit", "`?limit=20&offset=40`", "Jump to any page, easy to build", "Slow at large offsets, rows shift or repeat when data changes"], ["Cursor (keyset)", "`?limit=20&after=eyJpZCI6MTIzfQ`", "Fast, stable under inserts", "No jump to page N, cursor is opaque"]] },
        { type: "code", language: "json", title: "Cursor page", code: `{
  "data": [ { "id": 124, "total": 1800 }, { "id": 125, "total": 950 } ],
  "page": { "next_cursor": "eyJpZCI6MTI1fQ", "has_more": true }
}` },
        { type: "p", text: "Behind a cursor sits a keyset query such as `WHERE id > 125 ORDER BY id LIMIT 20`, which uses the index instead of scanning and discarding 40,000 rows like `OFFSET 40000` does. Cap `limit` server side, and make the sort order deterministic by adding a unique tiebreaker column." },
        { type: "h2", text: "A consistent error format" },
        { type: "p", text: "Use real status codes (400 invalid input, 401 not authenticated, 403 not allowed, 404 missing, 409 conflict, 422 semantic validation, 429 rate limited, 5xx server fault) and one error body shape everywhere. RFC 9457 defines `application/problem+json` for exactly this." },
        { type: "code", language: "json", title: "Problem details", code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.shop.example/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "quantity must be at least 1",
  "errors": [ { "field": "quantity", "code": "min", "min": 1 } ],
  "request_id": "req_8f2c"
}` },
        { type: "p", text: "Give clients a stable machine-readable code to branch on, a human message for logs, and a request id to quote to support. Do not leak stack traces or internals, and tell clients when it is safe to retry, using `Retry-After` on 429 and 503." },
        { type: "callout", tone: "gotcha", title: "Changing a contract quietly", text: "Teams ship 'harmless' changes that break clients: renaming a field, making an optional field required, or switching an ID from integer to string. Treat the schema as public from day one, and run contract tests against recorded client requests." },
      ],
      references: [
        { title: "RFC 9457: Problem Details for HTTP APIs", url: "https://www.rfc-editor.org/rfc/rfc9457" },
        { title: "Web API design best practices (Microsoft Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
        { title: "Google Cloud API Design Guide", url: "https://cloud.google.com/apis/design" },
        { title: "Stripe API: Pagination", url: "https://docs.stripe.com/api/pagination" },
        { title: "Stripe API: Versioning", url: "https://docs.stripe.com/api/versioning" },
      ],
    },
  },
};
