import type { LessonEntry } from "@/types/roadmap";

export const DATABASE_MIGRATIONS: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "Migrations",
    slug: "database-migrations",
    lesson: {
      summary: "Change a live schema without downtime: versioned scripts, awareness of locks, and the expand and contract sequence.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Versioned migrations" },
        { type: "p", text: "A migration is a script that moves the schema from one version to the next. Keep them as ordered files in the repository (`0007_add_orders_status.sql`), apply them with a tool such as Flyway, Liquibase, Alembic, Prisma Migrate or Django migrations, and let the tool record which have run in a table. Every environment then reaches the same schema by running the same files in the same order. Never edit a migration that has already run anywhere. Add a new one." },
        { type: "p", text: "Run migrations as a separate deploy step, not on application startup across ten instances at once. Keep them small, and test them against a copy of production-sized data, because a script that takes 50 ms on a laptop can run for an hour on 500 million rows." },
        { type: "h2", text: "Why some migrations lock a table" },
        { type: "p", text: "Many `ALTER TABLE` forms take an `ACCESS EXCLUSIVE` lock in PostgreSQL, which blocks every read and write on the table until they finish. Worse, the lock request queues: if one long query is running, your `ALTER` waits behind it, and every new query then queues behind your `ALTER`. A migration that merely waits can freeze the whole table." },
        { type: "list", items: ["Rewriting the table (some column type changes) holds the lock for the full rewrite.", "Adding a constraint or `SET NOT NULL` normally scans the whole table while locked.", "A plain `CREATE INDEX` blocks writes for the build.", "A fast statement stuck behind a long transaction still causes an outage."] },
        { type: "callout", tone: "gotcha", title: "Always set a lock timeout", text: "Run `SET lock_timeout = '3s';` before risky DDL. If it cannot get the lock quickly, it fails and you retry, instead of silently blocking production traffic." },
        { type: "h2", text: "Safe patterns for adding columns, indexes and constraints" },
        {
          type: "table",
          head: ["Change", "Unsafe", "Safer"],
          rows: [
            ["Add column with default", "Old versions rewrote the table", "PostgreSQL 11+ adds a constant default instantly; backfill big computed values in batches"],
            ["Add NOT NULL column", "Fails or rewrites if rows exist", "Add nullable, backfill in batches, then enforce"],
            ["Set NOT NULL", "Full scan under lock", "Add `CHECK (col IS NOT NULL) NOT VALID`, `VALIDATE`, then `SET NOT NULL`"],
            ["Add index", "Blocks writes", "`CREATE INDEX CONCURRENTLY`"],
            ["Add foreign key or check", "Scans under a strong lock", "Add `NOT VALID`, then `VALIDATE CONSTRAINT`, which allows normal writes"],
            ["Rename or drop column", "Breaks running code", "Expand and contract"],
          ],
        },
        {
          type: "code",
          language: "sql",
          code: `SET lock_timeout = '3s';

ALTER TABLE orders ADD COLUMN shipped_at timestamptz;          -- instant, nullable

CREATE INDEX CONCURRENTLY idx_orders_shipped ON orders (shipped_at);

ALTER TABLE orders ADD CONSTRAINT fk_orders_cust
  FOREIGN KEY (customer_id) REFERENCES customers(id) NOT VALID; -- brief lock
ALTER TABLE orders VALIDATE CONSTRAINT fk_orders_cust;          -- long scan, writes continue`,
        },
        { type: "p", text: "`CREATE INDEX CONCURRENTLY` cannot run inside a transaction block and, if it fails, leaves an invalid index you must drop and retry." },
        { type: "h2", text: "Expand and contract for zero downtime" },
        { type: "p", text: "During a rolling deploy, old and new application versions run at the same time against one database. So the schema must work for both. Never change something in a way the old code cannot read. Split a breaking change into steps, each deployed separately. Example: rename `users.name` to `users.full_name`." },
        { type: "list", ordered: true, items: ["**Expand:** add `full_name` as a nullable column. Old code ignores it.", "Deploy code that writes to **both** columns and reads the old one.", "**Backfill** old rows into `full_name` in small batches.", "Deploy code that reads `full_name`.", "Stop writing the old column.", "**Contract:** drop `name` in a later migration, once nothing uses it."] },
        { type: "p", text: "It takes several deploys instead of one, and that is the price of not taking the site down. The same sequence handles changing a column type or splitting a table. In interviews, state the rule: every migration must be compatible with both the previous and the next application version, and rollback should be possible at every step." },
      ],
      references: [
        { title: "PostgreSQL documentation: ALTER TABLE", url: "https://www.postgresql.org/docs/current/sql-altertable.html" },
        { title: "PostgreSQL documentation: CREATE INDEX (building indexes concurrently)", url: "https://www.postgresql.org/docs/current/sql-createindex.html" },
        { title: "PostgreSQL documentation: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
        { title: "Martin Fowler: Evolutionary Database Design", url: "https://martinfowler.com/articles/evodb.html" },
        { title: "Martin Fowler: Parallel Change", url: "https://martinfowler.com/bliki/ParallelChange.html" },
      ],
    },
  },
};
