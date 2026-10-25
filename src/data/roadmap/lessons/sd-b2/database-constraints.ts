import type { LessonEntry } from "@/types/roadmap";

export const DATABASE_CONSTRAINTS: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "Constraints",
    slug: "database-constraints",
    lesson: {
      summary: "Let the database enforce the rules that must never break: foreign keys, uniqueness and checks, safely under concurrency.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why constraints belong in the database" },
        { type: "p", text: "Application code has bugs, many services write to the same tables, and someone will run a script by hand. A constraint is a rule the database checks on every write, from every client, inside the transaction. Data that violates it cannot get in. That is a stronger guarantee than any validation you write in one service." },
        { type: "h2", text: "Foreign keys and referential integrity" },
        { type: "p", text: "A foreign key says a column must match a row in another table. It stops orphans: an order pointing at a customer that does not exist. It also decides what happens when the parent changes." },
        {
          type: "code",
          language: "sql",
          code: `CREATE TABLE orders (
  id          bigint PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status      text   NOT NULL CHECK (status IN ('pending','paid','shipped','cancelled')),
  total_cents integer NOT NULL CHECK (total_cents >= 0)
);

CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku      text   NOT NULL,
  qty      integer NOT NULL CHECK (qty > 0),
  PRIMARY KEY (order_id, sku)
);`,
        },
        { type: "p", text: "`RESTRICT` refuses to delete a customer who has orders. `CASCADE` deletes dependent rows along with the parent, right for line items, dangerous for anything you may want to keep. `SET NULL` clears the reference. Foreign keys cost a lookup on every insert, and PostgreSQL does not index the referencing column for you, so add an index on `orders(customer_id)` or deletes on `customers` scan the whole orders table." },
        { type: "p", text: "Large sharded systems sometimes drop foreign keys because they cannot span shards. That is a trade-off you make knowingly, and then you need checks and cleanup jobs in code." },
        { type: "h2", text: "Unique constraints and race-free uniqueness" },
        { type: "p", text: "The tempting way to enforce unique emails is wrong:" },
        {
          type: "code",
          language: "python",
          title: "Racy: check then insert",
          code: `if not db.exists("SELECT 1 FROM users WHERE email = %s", email):   # two requests both see 'none'
    db.execute("INSERT INTO users (email) VALUES (%s)", email)         # both insert: duplicate`,
        },
        { type: "p", text: "Two concurrent requests can both pass the check before either inserts. Only a **unique constraint** closes the gap, because the database serialises the conflict. Let the insert decide, and handle the error:" },
        {
          type: "code",
          language: "sql",
          code: `ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

INSERT INTO users (email) VALUES ('a@b.com')
ON CONFLICT (email) DO NOTHING
RETURNING id;      -- no row returned means it already existed`,
        },
        { type: "p", text: "The same idea gives idempotency keys for payments: a unique index on the key turns a retried request into a harmless conflict. Remember to normalise first (`lower(email)`) and consider partial uniqueness for soft-deleted rows." },
        { type: "h2", text: "Database constraints versus application validation" },
        { type: "p", text: "You need both, for different jobs. The application gives fast, friendly feedback ('that email is invalid') and checks things the database cannot, like calling another service. The database is the last line of defence that guarantees invariants no matter who writes." },
        {
          type: "table",
          head: ["", "Application validation", "Database constraint"],
          rows: [
            ["Good for", "Error messages, complex rules, external checks", "Integrity that must always hold"],
            ["Bypassed by", "Other services, scripts, bugs", "Nothing"],
            ["Safe under concurrency", "No, unless backed by the database", "Yes"],
            ["Changing the rule", "Deploy code", "Migration, may need a table scan"],
          ],
        },
        { type: "callout", tone: "tip", title: "Catch the violation and translate it", text: "Map the database error code (for example PostgreSQL's unique violation) to a clean 409 response. Do not leak the raw SQL error to users." },
      ],
      references: [
        { title: "PostgreSQL documentation: Constraints", url: "https://www.postgresql.org/docs/current/ddl-constraints.html" },
        { title: "PostgreSQL documentation: INSERT (ON CONFLICT)", url: "https://www.postgresql.org/docs/current/sql-insert.html" },
        { title: "PostgreSQL documentation: SET CONSTRAINTS", url: "https://www.postgresql.org/docs/current/sql-set-constraints.html" },
        { title: "PostgreSQL documentation: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
      ],
    },
  },
};
