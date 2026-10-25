import type { LessonEntry } from "@/types/roadmap";

export const DENORMALIZATION_AND_VERTICAL_PARTITIONING: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Denormalization and vertical partitioning",
    slug: "denormalization-and-vertical-partitioning",
    lesson: {
      summary: "Two ways to reshape a table for read speed: copy data to avoid joins, or split a wide table into hot and cold parts.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Normalised first, then bend the rules" },
        { type: "p", text: "A normalised schema stores each fact once. A customer's name lives in `customers`, and orders point to it by id. Updates touch one row and the data cannot disagree with itself. The cost is that reading an order with its customer name needs a join. Usually that is cheap. Sometimes a query runs so often, or over so many rows, that the join becomes the bottleneck." },
        { type: "h2", text: "Denormalization" },
        { type: "p", text: "Denormalization means deliberately storing the same fact in more than one place so a hot read needs no join. Three common forms:" },
        { type: "list", items: ["**Copied column:** store `customer_name` on `orders` so the order list needs no join.", "**Derived value:** store `comment_count` on `posts` instead of running `COUNT(*)` on every page view.", "**Precomputed aggregate or summary table:** a `daily_revenue` table filled by a job, read by dashboards."] },
        {
          type: "code",
          language: "sql",
          title: "Counter kept in step inside one transaction",
          code: `BEGIN;
INSERT INTO comments (post_id, user_id, body) VALUES (7, 42, 'Nice post');
UPDATE posts SET comment_count = comment_count + 1 WHERE id = 7;
COMMIT;`,
        },
        { type: "p", text: "Now the read is a single-row lookup, but you own a new problem: keeping copies consistent. If a customer renames themselves, every copied name is stale. Options are to update all copies in the same transaction, to refresh them asynchronously and accept a short lag, or to decide the copy is a historical snapshot and should never change (an invoice should keep the address it was sent to)." },
        { type: "h2", text: "Vertical partitioning" },
        { type: "p", text: "This is the other direction: split one wide table into several narrower ones that share a primary key. Put the columns read on every request in one table and the large or rarely used ones in another." },
        {
          type: "code",
          language: "sql",
          code: `-- Hot: small rows, read constantly, fits in memory
CREATE TABLE products (id bigint PRIMARY KEY, name text, price_cents int, stock int);

-- Cold: big text and JSON, read only on the detail page
CREATE TABLE product_details (
  product_id bigint PRIMARY KEY REFERENCES products(id),
  description text, specs jsonb
);`,
        },
        { type: "p", text: "Smaller rows mean more rows per page, so more of the hot data stays in the buffer cache and scans touch fewer pages. If one table has 2 KB rows and you only need 100 bytes of each for a listing, you read twenty times more than necessary. PostgreSQL already stores very large values out of line with TOAST, so the gain is mostly for medium-sized columns. The same idea also separates data by access pattern or sensitivity, such as moving personal data into its own locked-down table." },
        { type: "p", text: "Do not confuse this with **horizontal** partitioning (sharding), which splits a table by rows across tables or machines." },
        {
          type: "table",
          head: ["", "Denormalization", "Vertical partitioning"],
          rows: [
            ["Goal", "Remove joins on hot reads", "Shrink hot rows and cache more"],
            ["Data duplicated?", "Yes", "No"],
            ["Main risk", "Copies drift apart", "Extra join when you need both halves"],
            ["Good when", "Read-heavy, same join repeated", "Wide rows, few columns used per query"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Denormalize after measuring", text: "Interviewers dislike a schema that is denormalized from the start with no evidence. Show the slow query and its plan first. Often the fix is a missing index, and a copied column would only have added a consistency bug." },
      ],
      references: [
        { title: "Wikipedia: Denormalization", url: "https://en.wikipedia.org/wiki/Denormalization" },
        { title: "PostgreSQL documentation: Table Partitioning", url: "https://www.postgresql.org/docs/current/ddl-partitioning.html" },
        { title: "PostgreSQL documentation: TOAST", url: "https://www.postgresql.org/docs/current/storage-toast.html" },
        { title: "Martin Fowler: CQRS", url: "https://martinfowler.com/bliki/CQRS.html" },
      ],
    },
    points: [
      { id: "sd.denormalization-and-vertical-partitioning.when-to-denormalize", title: "When to denormalize", detail: "Copy or precompute a value only when a measured hot read is dominated by a join or an aggregate. Start normalised, find the slow query, then trade write complexity for read speed.", question: "A product page runs COUNT(*) over millions of reviews on every view. What are your options and their costs?" },
      { id: "sd.denormalization-and-vertical-partitioning.keeping-copies-consistent", title: "Keeping duplicated data consistent", detail: "Update copies in the same transaction, refresh them asynchronously with an accepted delay, or treat them as immutable snapshots. Pick one explicitly, because silent drift is the usual failure.", question: "A user renames themselves and their old name is copied into 5 million rows. How do you handle it?" },
      { id: "sd.denormalization-and-vertical-partitioning.hot-cold-split", title: "Hot and cold column split", detail: "Move large or rarely read columns into a table that shares the primary key. Hot rows get smaller, so more of them fit in memory and scans read fewer pages.", question: "How does moving a 5 KB description column to another table speed up a listing query?" },
    ],
  },
};
