import type { LessonEntry } from "@/types/roadmap";

export const OPTIMISTIC_LOCKING: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Optimistic locking",
    slug: "optimistic-locking",
    lesson: {
      summary: "Optimistic locking takes no lock while you work and instead rejects the write if the row changed since you read it.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The idea" },
        { type: "p", text: "Pessimistic locking assumes conflicts are likely and blocks others up front. Optimistic locking assumes they are rare. You read freely, do your work, and at write time check that nobody else changed the row. If someone did, your write fails and you handle the conflict." },
        { type: "p", text: "It fits the case where the time between read and write is long or includes a human, such as an edit form open for five minutes. Holding a database lock that long is out of the question, but silently overwriting a colleague's edit is also wrong." },
        { type: "h2", text: "Version column and compare-and-set" },
        { type: "p", text: "Add a `version` integer to the row. Every read returns it. Every update includes it in the `WHERE` clause and increments it. This is a compare-and-set done in SQL." },
        {
          type: "code",
          language: "sql",
          title: "Versioned update",
          code: `-- read
SELECT id, title, body, version FROM articles WHERE id = 42;   -- version = 7

-- write: succeeds only if nobody changed it since version 7
UPDATE articles
SET title = :title, body = :body, version = version + 1
WHERE id = 42 AND version = 7;
-- 1 row affected -> saved.  0 rows affected -> conflict.`,
        },
        { type: "p", text: "The check and the write are one statement, so the database applies them atomically and two writers cannot both pass. The affected row count is the signal. Nothing is locked between the read and the write." },
        { type: "p", text: "A timestamp column (`updated_at`) can serve as the version, but integers are safer: clocks can collide at coarse resolution and two updates in the same millisecond look identical. In HTTP APIs the version is often exposed as an `ETag`, with `If-Match` on the update and a `412 Precondition Failed` (or `409`) on conflict. ORMs such as JPA (`@Version`) and ActiveRecord offer it built in." },
        { type: "h2", text: "Handling conflicts and when optimistic wins" },
        { type: "p", text: "A conflict is not an error to hide. Decide what the caller does:" },
        { type: "list", items: [
          "**Retry automatically** when the change is a pure function of fresh data: re-read, recompute, write again, a few times at most.",
          "**Tell the user** and show the current version when a human made the edit, so they can merge or overwrite deliberately.",
          "**Fail the request** with 409 and let the client decide, which is the usual API behavior.",
        ] },
        { type: "table", head: ["", "Optimistic", "Pessimistic"], rows: [
          ["Conflicts", "Rare", "Frequent"],
          ["Cost when no conflict", "Almost nothing", "Lock acquire and release on every write"],
          ["Cost when conflict", "Wasted work, then retry", "Waiting, possible deadlocks"],
          ["Fits long user think time", "Yes", "No"],
          ["Holds locks", "No", "Yes, until commit"],
        ] },
        { type: "p", text: "Optimistic wins when reads dominate, rows are spread out so two writers rarely hit the same one, and the work between read and write is slow. It loses on a hot row. If 200 requests per second increment one counter, nearly all of them conflict and retry, and throughput collapses. An atomic `SET n = n + 1` handles that case far better." },
        { type: "callout", tone: "gotcha", title: "Every writer must play along", text: "The check only protects you if every code path that updates the row includes the version. One batch job or admin script that does a plain `UPDATE` without it defeats the scheme, and it will not show up in tests." },
        { type: "p", text: "In an interview, state the compare-and-set statement, the affected-rows check, and what you do on conflict. Mention that it needs no lock, and name the hot-row case as its weakness." },
      ],
      references: [
        { title: "Optimistic Offline Lock (Martin Fowler)", url: "https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html" },
        { title: "Optimistic concurrency control (Wikipedia)", url: "https://en.wikipedia.org/wiki/Optimistic_concurrency_control" },
        { title: "PostgreSQL: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
      ],
    },
  },
};
