import type { LessonEntry } from "@/types/roadmap";

export const DATABASE_INDEXES: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "Indexes",
    slug: "database-indexes",
    lesson: {
      summary: "How a B-tree index finds rows, how to shape composite, covering and partial indexes, and what every index costs on writes.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "How a B-tree index helps and when it does not" },
        { type: "p", text: "A B-tree index is a sorted copy of one or more columns, each entry pointing at its row in the table (the heap). Because it is sorted and shallow, finding `user_id = 42` takes three or four page reads instead of scanning the table. The same order serves ranges, `ORDER BY` and `LIMIT`, so `ORDER BY created_at DESC LIMIT 20` can read 20 index entries and stop." },
        { type: "p", text: "It does not help when the filter keeps a large fraction of the table, when the column is wrapped in a function or cast (`WHERE date(created_at) = ...`), when the pattern starts with a wildcard (`LIKE '%x'`), or on a tiny table where a scan is already one page. Stale statistics can also push the planner to a bad choice; `ANALYZE` refreshes them." },
        { type: "h2", text: "Composite, covering and partial indexes" },
        { type: "p", text: "A **composite** index sorts by its first column, then the second within it, and so on. Column order is the design decision. Put equality columns first, then the range or sort column. An index on `(customer_id, created_at)` serves `WHERE customer_id = ? ORDER BY created_at`, but an index on `(created_at, customer_id)` does not." },
        { type: "p", text: "A **covering** index holds every column the query needs, so the database answers from the index alone (an index-only scan) and never visits the heap. In PostgreSQL, `INCLUDE` adds payload columns that are stored but not searchable. Index-only scans also depend on the visibility map, so a table that is rarely vacuumed gains less." },
        { type: "p", text: "A **partial** index covers only rows matching a condition, making it smaller and cheaper to maintain when the interesting rows are few." },
        {
          type: "code",
          language: "sql",
          code: `-- Composite: equality column first, then the sort column
CREATE INDEX idx_orders_cust_created ON orders (customer_id, created_at DESC);

-- Covering: answers from the index alone
CREATE INDEX idx_orders_cust_cover ON orders (customer_id, created_at) INCLUDE (total_cents);

-- Partial: only the 2% of rows still waiting
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- Unique among active rows only (soft deletes)
CREATE UNIQUE INDEX uq_user_email ON users (lower(email)) WHERE deleted_at IS NULL;`,
        },
        {
          type: "table",
          head: ["Type", "Use it when", "Cost"],
          rows: [
            ["Single column", "One column filters most queries", "Cheapest"],
            ["Composite", "Queries filter or sort on the same column set", "Order must match queries; redundant prefixes"],
            ["Covering (`INCLUDE`)", "A hot query reads a few columns", "Bigger index"],
            ["Partial", "Queries target a small, fixed slice", "Only helps queries repeating the predicate"],
          ],
        },
        { type: "h2", text: "The cost of indexes on writes" },
        { type: "p", text: "Every index must be updated whenever a row is inserted or deleted, and when an indexed column changes. A table with 8 indexes does nine writes for one insert, each possibly a page split, all logged to the write-ahead log. Indexes also take disk and compete for cache, and extra ones slow `VACUUM`." },
        { type: "p", text: "Rough effect: a write-heavy table such as an events log may run noticeably faster with two indexes than with eight. A read-heavy catalogue can afford many. Decide per table from the workload." },
        { type: "list", items: ["Drop indexes that are never used (`pg_stat_user_indexes` shows scans per index).", "Drop a single-column index that is a prefix of a composite one; the composite already serves it.", "Build indexes on busy tables with `CREATE INDEX CONCURRENTLY` so writes are not blocked.", "Index foreign key columns in PostgreSQL, which does not do so automatically, so deletes and joins on the parent are fast."] },
        { type: "callout", tone: "gotcha", title: "Do not index everything 'just in case'", text: "Each speculative index taxes every write forever. Start from slow queries and their plans, add the smallest index that fixes one, and confirm with EXPLAIN that it is used." },
      ],
      references: [
        { title: "PostgreSQL documentation: Multicolumn Indexes", url: "https://www.postgresql.org/docs/current/indexes-multicolumn.html" },
        { title: "PostgreSQL documentation: Index-Only Scans and Covering Indexes", url: "https://www.postgresql.org/docs/current/indexes-index-only-scans.html" },
        { title: "PostgreSQL documentation: Partial Indexes", url: "https://www.postgresql.org/docs/current/indexes-partial.html" },
        { title: "PostgreSQL documentation: B-Tree Indexes", url: "https://www.postgresql.org/docs/current/btree.html" },
        { title: "Use The Index, Luke: SQL indexing and tuning for developers", url: "https://use-the-index-luke.com/" },
      ],
    },
  },
};
