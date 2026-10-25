import type { LessonEntry } from "@/types/roadmap";

export const QUERY_OPTIMIZATION: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "Query optimization",
    slug: "query-optimization",
    lesson: {
      summary: "A short list of query mistakes that cause most slow endpoints, and keyset pagination as the replacement for deep OFFSET.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Method first" },
        { type: "p", text: "Do not tune by guessing. Find the slowest queries (for PostgreSQL, the `pg_stat_statements` extension ranks them by total time), read each plan with `EXPLAIN ANALYZE`, change one thing, and measure again. Most wins come from a small set of anti-patterns." },
        { type: "h2", text: "Common query anti-patterns" },
        {
          type: "table",
          head: ["Anti-pattern", "Why it hurts", "Fix"],
          rows: [
            ["`SELECT *`", "Reads and ships columns you ignore; blocks index-only scans", "List needed columns"],
            ["Function on an indexed column: `WHERE lower(email) = ?`", "Index on `email` is unusable", "Index the expression, or store normalised"],
            ["Leading wildcard: `LIKE '%term'`", "No sorted prefix to seek", "Full-text or trigram index"],
            ["Type mismatch: comparing a text column to a number", "Implicit cast can disable the index", "Match the column type"],
            ["`OR` across different columns", "May force a scan", "Rewrite as `UNION ALL` or add suitable indexes"],
            ["Big `OFFSET`", "Reads and discards all skipped rows", "Keyset pagination"],
            ["Query inside a loop", "N+1 round trips", "Join or batch"],
            ["`COUNT(*)` on a huge table on every request", "Counts every row", "Cache, approximate, or maintain a counter"],
            ["Fetching rows to filter in code", "Moves data you discard", "Filter and aggregate in SQL"],
          ],
        },
        { type: "p", text: "Also check that your statistics are fresh and that you return only what the screen needs. A query returning 50,000 rows to an API that shows 20 is slow no matter how well it is indexed." },
        { type: "h2", text: "Keyset pagination" },
        { type: "p", text: "`LIMIT 20 OFFSET 100000` makes the database produce 100,020 rows and throw away 100,000 of them. Page 5,000 is thousands of times slower than page 1, and rows inserted meanwhile make items repeat or vanish between pages." },
        { type: "p", text: "**Keyset** (or cursor) pagination remembers the last row of the previous page and asks for rows after it. It uses an index to jump straight there, so each page costs the same. The sort must be total, so add a unique tiebreaker such as `id`." },
        {
          type: "code",
          language: "sql",
          title: "Keyset pagination with a tiebreaker",
          code: `CREATE INDEX idx_posts_created_id ON posts (created_at DESC, id DESC);

-- First page
SELECT id, title, created_at FROM posts
ORDER BY created_at DESC, id DESC LIMIT 20;

-- Next page: the client sends the last row's (created_at, id) as a cursor
SELECT id, title, created_at FROM posts
WHERE (created_at, id) < ('2026-03-01 10:15:00+00', 9812)
ORDER BY created_at DESC, id DESC LIMIT 20;`,
        },
        { type: "p", text: "The API returns an opaque `next_cursor` (an encoded `created_at` and `id`) instead of a page number." },
        {
          type: "table",
          head: ["", "OFFSET", "Keyset"],
          rows: [
            ["Cost of page N", "Grows with N", "Constant"],
            ["Stable under inserts", "No", "Yes"],
            ["Jump to page 50", "Yes", "No, only next or previous"],
            ["Needs", "Nothing special", "Index matching the sort, a unique tiebreaker"],
          ],
        },
        { type: "callout", tone: "tip", title: "Use OFFSET where it is fine", text: "For admin screens with small tables or users who must jump to page 7, OFFSET is acceptable. Use keyset for feeds, infinite scroll and exports, where depth is unbounded." },
        { type: "p", text: "In interviews, mention a cap on page size, a stable sort order, and the trade-off that keyset gives up random page access. Say you would verify the improvement with the query plan, not assume it." },
      ],
      references: [
        { title: "Use The Index, Luke: Paging through results (no offset)", url: "https://use-the-index-luke.com/no-offset" },
        { title: "PostgreSQL documentation: Performance Tips", url: "https://www.postgresql.org/docs/current/performance-tips.html" },
        { title: "PostgreSQL documentation: LIMIT and OFFSET", url: "https://www.postgresql.org/docs/current/queries-limit.html" },
        { title: "PostgreSQL documentation: pg_stat_statements", url: "https://www.postgresql.org/docs/current/pgstatstatements.html" },
      ],
    },
  },
};
