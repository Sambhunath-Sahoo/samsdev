import type { LessonEntry } from "@/types/roadmap";

export const PARTITIONING: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Partitioning",
    slug: "partitioning",
    lesson: {
      summary: "Split one big table into smaller pieces by range, list or hash, and know how that differs from sharding across machines.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What partitioning is" },
        { type: "p", text: "Partitioning divides one logical table into several smaller physical pieces, each holding a subset of the rows. Queries still use the single table name; the database decides which pieces to read. The benefits are practical: smaller indexes that fit in memory, queries that skip irrelevant pieces (**partition pruning**), and cheap bulk operations such as dropping a whole old piece instead of running a slow `DELETE`." },
        { type: "h2", text: "Range, list and hash partitioning" },
        {
          type: "table",
          head: ["Method", "Rule", "Good for", "Watch out for"],
          rows: [
            ["Range", "Rows go by a value range, such as a month of `created_at`", "Time series, logs, retention by dropping old partitions", "A hot latest partition takes all the writes"],
            ["List", "Rows go by an explicit value, such as `region = 'EU'`", "Data split by country, tenant tier or category", "Uneven sizes; a new value needs a new partition"],
            ["Hash", "`hash(key) mod N` picks the partition", "Even spread of load by an id", "Range queries touch every partition; changing N moves data"],
          ],
        },
        { type: "code", language: "sql", title: "Postgres: monthly range partitions", code: `CREATE TABLE events (
  id         bigint GENERATED ALWAYS AS IDENTITY,
  user_id    bigint      NOT NULL,
  created_at timestamptz NOT NULL,
  payload    jsonb,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_10 PARTITION OF events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

-- retention: instant, no row-by-row delete
DROP TABLE events_2025_10;` },
        { type: "p", text: "Two details in that example are common stumbling blocks. First, in Postgres a primary key or unique constraint on a partitioned table must include the partition key, which is why `created_at` is in the key. Second, partitions do not create themselves: someone has to create next month's partition before it is needed, with a scheduled job or an extension such as `pg_partman`. A missing partition makes inserts fail." },
        { type: "p", text: "A worked number: a table with 2 billion event rows and a 90-day retention rule. Unpartitioned, deleting day 91 is a huge `DELETE` that bloats the table and generates a flood of log. Partitioned by day, a query for the last hour reads one partition of about 22 million rows, and retention is a `DROP` that takes milliseconds." },
        { type: "callout", tone: "gotcha", title: "Pruning needs the key in the WHERE clause", text: "A query that filters only by `user_id` on a table partitioned by `created_at` cannot skip anything and scans every partition's index. Choose the partition key from your most common filter, and check with `EXPLAIN` that partitions are actually being pruned." },
        { type: "h2", text: "Partitioning vs sharding" },
        { type: "p", text: "Terminology is loose, so say what you mean. In most database documentation, **partitioning** means splitting a table inside one database server. **Sharding** means spreading data across several servers, each holding a subset and running independently. Some systems (Cassandra, DynamoDB, Kafka) call their unit of distribution a partition even though it lives on different nodes; there the word means what sharding means elsewhere." },
        { type: "list", items: [
          "**Partitioning**: one machine, one connection string, the database handles routing. Solves table size, index size and retention. Does not add CPU or disk beyond the machine.",
          "**Sharding**: many machines, the application or a proxy routes. Solves capacity limits of a single server, at the price of cross-shard joins and transactions.",
          "They combine: each shard can hold partitioned tables.",
        ] },
        { type: "p", text: "Reach for partitioning first. It is cheap, has no application changes, and often fixes the pain that people blame on needing a shard. In an interview, a good answer says: partition by time to keep indexes small and make retention cheap, shard by tenant or user id only when one machine cannot hold the data or write load." },
      ],
      references: [
        { title: "PostgreSQL: Table Partitioning", url: "https://www.postgresql.org/docs/current/ddl-partitioning.html" },
        { title: "Partition (database)", url: "https://en.wikipedia.org/wiki/Partition_(database)" },
        { title: "Shard (database architecture)", url: "https://en.wikipedia.org/wiki/Shard_(database_architecture)" },
      ],
    },
  },
};
