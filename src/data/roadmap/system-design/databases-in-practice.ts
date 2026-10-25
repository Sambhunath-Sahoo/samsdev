import type { RoadmapSection } from "@/types/roadmap";

export const DATABASES_IN_PRACTICE: RoadmapSection = {
  title: "Databases in practice",
  goal: "Run a relational database under real load, and change its schema, without incidents.",
  doneWhen: [
    "Read an EXPLAIN ANALYZE plan and name the slow node, the missing index or the bad estimate.",
    "Size a connection pool and explain what happens when it is exhausted.",
    "Ship a column rename or a new NOT NULL column with no downtime using expand and contract.",
  ],
  subsections: [
    {
      title: "Connection pooling",
      points: [
        {
          id: "sd.databases.connection-pool-basics",
          title: "Why databases need a connection pool",
          detail:
            "Opening a connection costs a TCP and TLS handshake, authentication and, in PostgreSQL, a dedicated server process. A pool keeps a fixed set of open connections and lends them to requests. Without one, a traffic spike or many app instances can exceed `max_connections` and the database starts refusing new clients.",
          question: "Fifty app instances each open 20 connections to a database with max_connections of 200. What goes wrong and how do you fix it?",
        },
        {
          id: "sd.databases.pool-sizing-and-exhaustion",
          title: "Pool sizing, exhaustion and external poolers",
          detail:
            "A bigger pool is not faster: past roughly a few connections per CPU core the database just context-switches, so a small pool plus a queue usually beats a large one. If every connection is checked out by slow queries or transactions held open, new requests wait for a free one and then time out. An external pooler such as PgBouncer multiplexes many clients onto few server connections, but in transaction mode it breaks session state like prepared statements and `SET` variables.",
          question: "Requests hang waiting for a connection although database CPU is low. What do you look at first?",
        },
      ],
    },
    {
      title: "N+1 queries",
      points: [
        {
          id: "sd.databases.n-plus-one-problem",
          title: "Recognising the N+1 query",
          detail:
            "N+1 means one query fetches a list and then one more query per row fetches related data, for example loading 100 orders and then running `SELECT * FROM users WHERE id = ?` 100 times. Each query is fast, so it passes in development, but round trips add up and a list of 5,000 rows becomes 5,001 queries. ORMs hide it behind lazy-loaded properties, so look at the query count per request, not the code.",
          question: "An endpoint is fast with 10 rows and slow with 1,000, and CPU is idle. How do you confirm an N+1 and what would you look at in the logs?",
        },
        {
          id: "sd.databases.fixing-n-plus-one",
          title: "Fixing N+1: joins, batching and dataloaders",
          detail:
            "Fetch related rows in one query with a join, or in two queries using `WHERE user_id IN (...)` for the collected ids, which ORMs call eager loading or preloading. A dataloader batches and de-duplicates lookups made within one tick, which is the standard fix in GraphQL resolvers. Prefer the two-query form when a join would multiply parent rows by many children.",
          question: "How does a dataloader turn 100 resolver calls into a single database query?",
        },
      ],
    },
    {
      title: "Indexes",
      points: [
        {
          id: "sd.databases.index-btree-and-selectivity",
          title: "How a B-tree index helps and when it does not",
          detail:
            "A B-tree index keeps column values in sorted order so the database can jump to a value or a range without scanning the table. It helps most on selective columns, where a filter returns a small fraction of rows. An index on a boolean or a status column where 90% of rows share one value is rarely used, and the planner correctly chooses a sequential scan.",
          question: "Why might the database ignore an index on the `is_active` column of a table where most rows are active?",
        },
        {
          id: "sd.databases.composite-and-covering-indexes",
          title: "Composite, covering and partial indexes",
          detail:
            "A composite index on `(tenant_id, created_at)` serves queries filtering on `tenant_id` alone or on both, but not on `created_at` alone, because column order matters: put equality columns first, then the range or sort column. A covering index adds extra columns, for example `INCLUDE (total)` in PostgreSQL, so the query is answered from the index without touching the table. A partial index such as `WHERE deleted_at IS NULL` stays small by indexing only the rows you query.",
          question: "You have an index on (a, b). Which of these can use it: WHERE b = 1, WHERE a = 1, WHERE a = 1 ORDER BY b?",
        },
        {
          id: "sd.databases.index-write-cost",
          title: "The cost of indexes on writes",
          detail:
            "Every index must be updated on each insert, delete and on any update that changes an indexed column, and it takes disk and memory. A table with ten indexes writes slower and may block HOT updates in PostgreSQL. Add indexes for measured queries and drop unused ones, which `pg_stat_user_indexes` shows through its `idx_scan` counter. Create indexes on a live table with `CREATE INDEX CONCURRENTLY` to avoid blocking writes.",
          question: "Inserts into a table got slower after the team added four indexes. How do you decide which to keep?",
        },
      ],
    },
    {
      title: "Query optimization",
      points: [
        {
          id: "sd.databases.query-optimization-patterns",
          title: "Common query anti-patterns",
          detail:
            "Wrapping an indexed column in a function, as in `WHERE lower(email) = ...` or `WHERE date(created_at) = ...`, stops a plain index from being used unless you index the expression. Other frequent problems are `SELECT *` that pulls wide columns, a leading wildcard `LIKE '%abc'`, large `OFFSET` pagination, and filtering in application code instead of SQL. Fix them by rewriting the predicate to a range, adding an expression index, or using keyset pagination.",
          question: "Why does `ORDER BY id LIMIT 20 OFFSET 100000` get slower on later pages and what do you use instead?",
        },
        {
          id: "sd.databases.keyset-pagination",
          title: "Keyset pagination",
          detail:
            "Instead of skipping rows with OFFSET, remember the last row of the previous page and ask for the next ones after it: `WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20`. With a matching index each page costs the same regardless of depth. The trade-off is that you can only move forward and backward, not jump to page 50.",
          question: "What index and query shape give constant-time paging for a feed sorted by newest first?",
        },
      ],
    },
    {
      title: "EXPLAIN ANALYZE",
      points: [
        {
          id: "sd.databases.explain-vs-explain-analyze",
          title: "EXPLAIN versus EXPLAIN ANALYZE",
          detail:
            "`EXPLAIN` shows the plan the optimizer chose with estimated costs and row counts without running the query. `EXPLAIN ANALYZE` actually executes it and adds real timings and row counts per node. Because it really runs, wrap data-changing statements in a transaction and roll back, as in `BEGIN; EXPLAIN ANALYZE UPDATE ...; ROLLBACK;`. Adding `BUFFERS` shows how many pages were read from cache or disk.",
          question: "Why is it dangerous to run EXPLAIN ANALYZE on a DELETE in production and how do you do it safely?",
        },
        {
          id: "sd.databases.reading-a-query-plan",
          title: "Reading a plan",
          detail:
            "Read from the innermost node outward and look at the node where actual time is largest. Seq Scan on a big table with a selective filter suggests a missing index; Index Scan or Index Only Scan is usually good. A large gap between estimated and actual rows points to stale statistics, so run `ANALYZE`. Also watch for Sort or Hash spilling to disk, and nested loops over many rows.",
          question: "A plan estimates 10 rows but returns 2 million and picks a nested loop. What is likely wrong and how do you fix it?",
        },
      ],
    },
    {
      title: "Constraints",
      points: [
        {
          id: "sd.databases.foreign-key-constraints",
          title: "Foreign keys and referential integrity",
          detail:
            "A foreign key guarantees that `orders.user_id` always points at an existing user, so orphan rows cannot appear even if application code has a bug. You choose what happens on delete: `RESTRICT` blocks it, `CASCADE` deletes children, `SET NULL` clears the reference. PostgreSQL does not index the referencing column automatically, so add an index on it or parent deletes and joins will scan the child table.",
          question: "Deleting a user is very slow and locks up the orders table. What foreign key detail do you check?",
        },
        {
          id: "sd.databases.unique-constraints",
          title: "Unique constraints and race-free uniqueness",
          detail:
            "Checking `SELECT ... WHERE email = ?` before inserting is a race: two requests can both see no row and both insert. A `UNIQUE` constraint, backed by a unique index, makes the database reject the second insert with a violation you catch and turn into a friendly error. Use `INSERT ... ON CONFLICT DO NOTHING` or `DO UPDATE` for upserts, and a partial unique index for rules such as one active subscription per user.",
          question: "How do you guarantee two signups with the same email cannot both succeed under concurrent requests?",
        },
        {
          id: "sd.databases.constraints-vs-app-validation",
          title: "Database constraints versus application validation",
          detail:
            "Application validation gives friendly messages and catches mistakes early, but only the database can enforce a rule against every writer, including scripts, other services and concurrent requests. Use both: validate in code for user experience and declare `NOT NULL`, `CHECK`, foreign key and unique constraints as the last line of defence. Adding a constraint to a large existing table is itself a migration risk, so add it as `NOT VALID` first and validate later.",
          question: "Your app already validates input. Give two reasons you still add `CHECK` and `UNIQUE` constraints in the database.",
        },
      ],
    },
    {
      title: "Migrations",
      points: [
        {
          id: "sd.databases.database-migrations",
          title: "Versioned migrations",
          detail:
            "A migration is a numbered, committed script that moves the schema from one version to the next, and a tool such as Flyway, Liquibase, Prisma Migrate or Alembic records which ones have run. Never edit a migration that has already been applied elsewhere; add a new one. Run them as an explicit deploy step, and keep schema changes separate from large data backfills.",
          question: "Why must you never edit a migration file after it has run in production?",
        },
        {
          id: "sd.databases.migration-locking-hazards",
          title: "Why some migrations lock a table",
          detail:
            "Many `ALTER TABLE` forms take an exclusive lock, and every query behind that lock queues up, so even a fast statement can cause an outage if it waits behind a long-running transaction. Rewriting a whole table, as older PostgreSQL did when adding a column with a default, holds the lock for the duration. Set a short `lock_timeout` and retry, and check which operations rewrite or fully lock on your database version.",
          question: "A one-second ALTER TABLE took the site down for a minute. How can that happen?",
        },
        {
          id: "sd.databases.zero-downtime-expand-contract",
          title: "Expand and contract for zero downtime",
          detail:
            "Because old and new app versions run side by side during a deploy, each schema change must work with both. Expand and contract splits a rename of `name` to `full_name` into steps: add the new nullable column, deploy code that writes both, backfill old rows in small batches, deploy code that reads the new column, then drop the old one in a later release. Each step is backward compatible and can be rolled back.",
          question: "Walk through renaming a column on a busy table without any downtime, listing each deploy.",
        },
        {
          id: "sd.databases.zero-downtime-safe-patterns",
          title: "Safe patterns for adding columns, indexes and constraints",
          detail:
            "Add a nullable column first, backfill in batches of a few thousand rows, and only then enforce `NOT NULL`, using a `CHECK ... NOT VALID` plus `VALIDATE CONSTRAINT` to avoid a long exclusive lock. Build indexes with `CREATE INDEX CONCURRENTLY`. Never drop or rename a column that the running code still reads, and separate the code deploy from the destructive migration.",
          question: "How do you add a NOT NULL column with a default to a table of 200 million rows without blocking writes?",
        },
      ],
    },
  ],
};
