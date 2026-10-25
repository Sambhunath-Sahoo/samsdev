import type { LessonEntry } from "@/types/roadmap";

export const SQL_FUNDAMENTALS_AND_INDEXING: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "SQL fundamentals and indexing",
    slug: "sql-fundamentals-and-indexing",
    lesson: {
      summary: "The relational model in one pass, and why an index is the difference between reading ten rows and reading ten million.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What a relational database gives you" },
        { type: "p", text: "A relational database stores rows in tables with a fixed schema, links them with keys, and lets you ask questions in SQL without saying how to find the answer. The engine's planner picks the access path. You get **transactions** (a group of changes that all happen or none do), **constraints** that reject bad data, and joins that combine tables at query time." },
        { type: "p", text: "That is why it is the default choice. Most products need correct data, flexible queries nobody planned in advance, and multi-row updates that must not half-apply. A relational database does all three out of the box." },
        { type: "h2", text: "The queries you must be fluent in" },
        {
          type: "code",
          language: "sql",
          title: "Join and aggregate",
          code: `-- Orders per customer in the last 30 days, biggest first
SELECT c.id, c.email, count(*) AS orders, sum(o.total_cents) AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= now() - interval '30 days'
GROUP BY c.id, c.email
HAVING count(*) >= 2
ORDER BY revenue DESC
LIMIT 20;`,
        },
        { type: "p", text: "Know the difference between `INNER JOIN` (only matching rows) and `LEFT JOIN` (keep every left row, with nulls where nothing matches), between `WHERE` (filters rows before grouping) and `HAVING` (filters groups after), and why `COUNT(col)` skips nulls while `COUNT(*)` does not." },
        { type: "h2", text: "Why indexes exist" },
        { type: "p", text: "Without an index, `WHERE email = 'a@b.com'` forces a **sequential scan**: the database reads every row of the table. On 10 million rows of about 200 bytes each, that is roughly 2 GB of reading for one lookup. A B-tree index on `email` is a sorted structure with a wide fan-out, so the lookup touches three or four pages, then one row. Milliseconds instead of seconds." },
        { type: "p", text: "The same sorted structure also serves range filters (`created_at > ...`), `ORDER BY` without a separate sort, and prefix matches. It does not help when the filter is not selective: if 40% of rows match, the planner will correctly prefer a sequential scan, because jumping around the index and heap for that many rows is slower." },
        {
          type: "code",
          language: "sql",
          code: `CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);

-- Served by the index: equality on the first column, range or order on the second
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 10;`,
        },
        { type: "h2", text: "Rules that decide whether an index is used" },
        {
          type: "table",
          head: ["Query shape", "Index on (a, b) helps?", "Why"],
          rows: [
            ["`WHERE a = 1`", "Yes", "Leading column matches"],
            ["`WHERE a = 1 AND b > 5`", "Yes", "Equality, then range on the next column"],
            ["`WHERE b = 5`", "Poor", "Skips the leading column; the sort order is no use"],
            ["`WHERE lower(a) = 'x'`", "No", "The function hides the column; index the expression instead"],
            ["`WHERE a LIKE '%foo'`", "No", "No usable sorted prefix"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Indexes are not free", text: "Every index is a second copy of some columns that must be updated on each insert, update and delete, and it takes disk and memory. A table with ten indexes writes eleven structures per row. Add indexes for queries you actually run, and drop the ones that never get used." },
        { type: "h2", text: "In an interview" },
        { type: "list", items: ["Name the exact query before proposing an index: the columns in `WHERE`, `JOIN` and `ORDER BY` decide its shape.", "Mention selectivity: an index on a boolean or a status with three values rarely helps alone.", "Say what it costs: slower writes and more storage.", "Do not claim an index always speeds things up; show you know when the planner ignores it."] },
      ],
      references: [
        { title: "PostgreSQL documentation: Index Types", url: "https://www.postgresql.org/docs/current/indexes-types.html" },
        { title: "PostgreSQL documentation: Multicolumn Indexes", url: "https://www.postgresql.org/docs/current/indexes-multicolumn.html" },
        { title: "Use The Index, Luke: SQL indexing and tuning for developers", url: "https://use-the-index-luke.com/" },
        { title: "PostgreSQL documentation: CREATE INDEX", url: "https://www.postgresql.org/docs/current/sql-createindex.html" },
      ],
    },
    points: [
      { id: "sd.sql-fundamentals-and-indexing.joins-and-aggregation", title: "Joins and aggregation", detail: "A join combines rows from two tables on a key; `GROUP BY` collapses rows into groups and aggregate functions summarise each group. `WHERE` filters before grouping and `HAVING` after.", question: "What is the difference between an inner join and a left join, and between WHERE and HAVING?" },
      { id: "sd.sql-fundamentals-and-indexing.sequential-scan-vs-index", title: "Sequential scan versus index lookup", detail: "A sequential scan reads the whole table; a B-tree lookup reads a handful of pages. When a filter matches a large share of rows, the planner picks the scan on purpose because random index lookups cost more.", question: "Why can the database ignore an index you created, and is that a bug?" },
      { id: "sd.sql-fundamentals-and-indexing.column-order-and-functions", title: "Column order and functions on columns", detail: "A composite index is sorted by its first column, so queries must use that leading column to benefit. Wrapping an indexed column in a function hides it from the index unless you index the expression.", question: "Given an index on (a, b), which of WHERE b = 1 and WHERE a = 1 can use it, and why?" },
    ],
  },
};
