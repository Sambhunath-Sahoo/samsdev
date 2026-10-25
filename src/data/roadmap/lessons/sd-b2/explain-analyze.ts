import type { LessonEntry } from "@/types/roadmap";

export const EXPLAIN_ANALYZE: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "EXPLAIN ANALYZE",
    slug: "explain-analyze",
    lesson: {
      summary: "See how PostgreSQL actually runs a query, and read a plan from the inside out to find the node that costs the time.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "EXPLAIN versus EXPLAIN ANALYZE" },
        { type: "p", text: "`EXPLAIN` shows the plan the planner chose, with **estimated** costs and row counts, without running the query. `EXPLAIN ANALYZE` actually **runs** the query and adds the real timings and row counts next to the estimates. Comparing the two is the whole skill." },
        { type: "callout", tone: "gotcha", title: "ANALYZE really executes the statement", text: "Run on an `UPDATE` or `DELETE`, it changes data. Wrap it: `BEGIN; EXPLAIN ANALYZE UPDATE ...; ROLLBACK;`. Be careful on production, because a slow query stays slow while you measure it." },
        { type: "p", text: "Add `BUFFERS` to see how many pages came from cache (`shared hit`) versus disk (`read`). A query that is fast on a warm cache and slow on a cold one will show up here." },
        {
          type: "code",
          language: "sql",
          code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 10;`,
        },
        { type: "h2", text: "Reading a plan" },
        { type: "p", text: "A plan is a tree. Indented child nodes run first and feed their parent, so read from the most indented line outward. Each node shows `cost=startup..total`, estimated `rows`, and, with ANALYZE, `actual time`, actual `rows` and `loops`." },
        {
          type: "code",
          language: "text",
          title: "Before an index",
          code: `Limit  (cost=185000.4..185000.5 rows=10) (actual time=612.1..612.2 rows=10 loops=1)
  ->  Sort  (cost=185000.4..185050.9 rows=20200) (actual time=612.1..612.1 rows=10 loops=1)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort
        ->  Seq Scan on orders  (cost=0.00..183500.0 rows=20200)
                                (actual time=0.1..598.4 rows=19840 loops=1)
              Filter: (customer_id = 42)
              Rows Removed by Filter: 9980160
Execution Time: 612.4 ms`,
        },
        { type: "p", text: "The `Seq Scan` read 10 million rows and discarded 9,980,160. That is the cost. After `CREATE INDEX ON orders (customer_id, created_at DESC)` the plan becomes an `Index Scan` with no `Sort`, and execution drops to about a millisecond because the index delivers rows already ordered and `LIMIT` stops after 10." },
        { type: "h2", text: "What to look for" },
        {
          type: "table",
          head: ["Signal in the plan", "Meaning", "Typical response"],
          rows: [
            ["Seq Scan on a large table with a selective filter", "No usable index", "Add or fix an index"],
            ["Large `Rows Removed by Filter`", "Reading much and keeping little", "Index the filter"],
            ["Estimated rows far from actual rows", "Stale or poor statistics", "`ANALYZE`; extended statistics"],
            ["Nested Loop with large `loops`", "Inner side repeated many times", "Index the join column; check estimates"],
            ["Sort with `external merge Disk`", "Sort spilled to disk", "Index for the order, raise `work_mem`"],
            ["Hash Join / Merge Join", "Normal for big joins", "Fine unless inputs are huge"],
            ["Bitmap Heap Scan", "Many matches, fetched in page order", "Normal in the middle range"],
          ],
        },
        { type: "p", text: "A node's `actual time` includes its children, so subtract them to see what that node itself cost, and multiply by `loops` when a node runs repeatedly. Look for the node with the biggest self time and the biggest estimate error." },
        { type: "list", items: ["Run it on realistic data volumes; a plan on 100 rows says nothing about 100 million.", "Run it twice and note cold versus warm cache.", "Fix one thing at a time and re-run.", "Remember a plan can change as data grows or statistics update, so keep slow-query monitoring on."] },
        { type: "p", text: "In interviews, say you would look at the plan before changing anything, name the scan and join types you expect, and explain that a gap between estimated and actual rows points at statistics, not at the query text." },
      ],
      references: [
        { title: "PostgreSQL documentation: Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html" },
        { title: "PostgreSQL documentation: EXPLAIN", url: "https://www.postgresql.org/docs/current/sql-explain.html" },
        { title: "PostgreSQL documentation: Statistics Used by the Planner", url: "https://www.postgresql.org/docs/current/planner-stats.html" },
      ],
    },
  },
};
