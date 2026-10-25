import type { LessonEntry } from "@/types/roadmap";

export const PESSIMISTIC_LOCKING: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Pessimistic locking",
    slug: "pessimistic-locking",
    lesson: {
      summary: "Pessimistic locking takes a row lock before reading so no one else can change the row until you commit.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "SELECT ... FOR UPDATE" },
        { type: "p", text: "`SELECT ... FOR UPDATE` reads rows and locks them against other writers and other `FOR UPDATE` readers until your transaction ends. Plain reads are not blocked in PostgreSQL, because MVCC serves them from an older version. The lock is released only at `COMMIT` or `ROLLBACK`, so it must live inside a transaction." },
        {
          type: "code",
          language: "sql",
          title: "Reserve stock safely",
          code: `BEGIN;
SELECT quantity FROM inventory WHERE sku = 'A1' FOR UPDATE;  -- others wait here
-- app code decides: quantity >= 3 ?
UPDATE inventory SET quantity = quantity - 3 WHERE sku = 'A1';
INSERT INTO reservations (sku, qty, user_id) VALUES ('A1', 3, :uid);
COMMIT;`,
        },
        { type: "p", text: "A second transaction doing the same `FOR UPDATE` waits until the first commits, then sees the new quantity. The check-then-act race is gone because the check happens under the lock. The cost is that writers to that row are serialized, and anything slow inside the transaction makes everyone queue." },
        { type: "p", text: "Variants matter: `FOR NO KEY UPDATE` is weaker and does not block foreign-key checks from child inserts, and `FOR SHARE` lets many readers lock a row against modification without blocking one another. Lock only rows you actually need, and always in the same order to avoid deadlocks." },
        { type: "h2", text: "SKIP LOCKED, NOWAIT and lock timeouts" },
        { type: "p", text: "By default a locked row makes you wait, with no limit. You have three ways to change that." },
        { type: "list", items: [
          "`NOWAIT`: error immediately if a row is locked. Good for \"someone is already doing this, tell the user\".",
          "`SKIP LOCKED`: silently skip locked rows and return the others. This turns a table into a work queue, since each worker takes different rows.",
          "`SET lock_timeout = '2s'`: wait up to a bound, then fail with an error instead of queuing indefinitely.",
        ] },
        {
          type: "code",
          language: "sql",
          title: "Many workers, one jobs table",
          code: `BEGIN;
SELECT id, payload FROM jobs
WHERE status = 'pending'
ORDER BY id
LIMIT 10
FOR UPDATE SKIP LOCKED;
-- process, mark done
UPDATE jobs SET status = 'done' WHERE id = ANY(:ids);
COMMIT;`,
        },
        { type: "p", text: "`SKIP LOCKED` gives an inconsistent view by design, so it suits queues and not accounting. If a worker crashes, its transaction rolls back and the rows become visible again." },
        { type: "h2", text: "Choosing between optimistic, pessimistic and atomic updates" },
        { type: "table", head: ["Situation", "Pick", "Why"], rows: [
          ["Increment a counter, decrement stock, flip a flag", "Atomic `UPDATE ... SET n = n - 1 WHERE n > 0`", "No read in the app, no lock held across code"],
          ["Edit form open for minutes, conflicts rare", "Optimistic version check", "Holds nothing while the human thinks"],
          ["Short critical section, app logic between read and write, hot rows", "Pessimistic `FOR UPDATE`", "Waiting is cheaper than constant retries"],
          ["Several workers pulling jobs", "`FOR UPDATE SKIP LOCKED`", "Workers never block each other"],
        ] },
        { type: "p", text: "Start from the atomic update, since it is the simplest and cheapest. Move to optimistic when you need app logic and conflicts are rare, and to pessimistic when conflicts are common or a failed attempt is expensive, such as a charge to an external payment service." },
        { type: "callout", tone: "gotcha", title: "Locks and slow code", text: "Holding `FOR UPDATE` while calling an external API turns that API's latency into your lock hold time. Under load the waiting queue grows, connections run out and the whole service stalls. Do the slow call before or after the transaction, not inside it." },
        { type: "p", text: "In an interview, justify the choice with the contention level and how long the lock is held, and mention timeouts so a stuck holder cannot block the system." },
      ],
      references: [
        { title: "PostgreSQL: SELECT (The Locking Clause)", url: "https://www.postgresql.org/docs/current/sql-select.html" },
        { title: "PostgreSQL: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
        { title: "Pessimistic Offline Lock (Martin Fowler)", url: "https://martinfowler.com/eaaCatalog/pessimisticOfflineLock.html" },
      ],
    },
  },
};
