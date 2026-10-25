import type { LessonEntry } from "@/types/roadmap";

export const DEADLOCKS: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Deadlocks",
    slug: "deadlocks",
    lesson: {
      summary: "A deadlock is a cycle of transactions each waiting for a lock another holds; lock in a fixed order and be ready to retry.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "How a deadlock forms" },
        { type: "p", text: "A deadlock needs a cycle of waiting. Transaction A holds a lock on row 1 and asks for row 2. Transaction B holds row 2 and asks for row 1. Each waits for the other forever, because a lock is only released at commit or rollback and neither can reach it." },
        {
          type: "code",
          language: "sql",
          title: "Two transfers in opposite directions",
          code: `-- Session A: transfer 1 -> 2          -- Session B: transfer 2 -> 1
BEGIN;                                 BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;   -- A locks row 1
                                       UPDATE accounts SET balance = balance - 5 WHERE id = 2;  -- B locks row 2
UPDATE accounts SET balance = balance + 10 WHERE id = 2;   -- A waits for B
                                       UPDATE accounts SET balance = balance + 5 WHERE id = 1;  -- B waits for A: cycle`,
        },
        { type: "p", text: "Four conditions must hold together: exclusive locks, holding one while waiting for another, no preemption, and a circular wait. Break any one and deadlock cannot occur. In practice you break the circular wait." },
        { type: "h2", text: "What the database does" },
        { type: "p", text: "PostgreSQL and MySQL InnoDB both detect the cycle. PostgreSQL checks after a transaction has waited for `deadlock_timeout`, one second by default, then aborts one transaction with SQLSTATE `40P01`. InnoDB detects deadlocks immediately by default and rolls back the transaction that is cheaper to undo. The other transaction then proceeds." },
        { type: "p", text: "That means a deadlock is not data corruption. It is an error the application must expect, like a dropped connection. The aborted transaction was rolled back completely, so the correct response is to run it again from the start." },
        { type: "h2", text: "Preventing and handling them" },
        { type: "list", ordered: true, items: [
          "**Consistent lock order.** In a transfer, always lock the account with the lower id first, whatever the direction. Now a cycle cannot form between two transfers.",
          "**Lock everything up front.** Take all the rows you need in one statement, such as `SELECT ... WHERE id IN (1, 2) ORDER BY id FOR UPDATE`, instead of discovering them one by one.",
          "**Keep transactions short.** No HTTP calls, no user prompts, no sleeps while holding locks. Less time held means fewer chances to collide.",
          "**Retry the victim.** Catch `40P01` (or MySQL error 1213), roll back, wait a randomized short delay and retry a bounded number of times.",
          "**Set timeouts.** `lock_timeout` makes a waiter fail instead of queuing indefinitely behind a stuck transaction.",
        ] },
        {
          type: "code",
          language: "sql",
          title: "Order-safe transfer",
          code: `BEGIN;
SELECT id FROM accounts WHERE id IN (:from, :to) ORDER BY id FOR UPDATE;
UPDATE accounts SET balance = balance - :amt WHERE id = :from;
UPDATE accounts SET balance = balance + :amt WHERE id = :to;
COMMIT;`,
        },
        { type: "h2", text: "Other places they hide" },
        { type: "p", text: "Foreign keys take shared locks on parent rows, so inserting children in many concurrent transactions while updating parents can cycle. Batch jobs that update many rows in different orders are a frequent source: sort the batch by primary key first. Application-level deadlocks also happen, for example two services each holding a distributed lock and waiting on the other." },
        { type: "table", head: ["Approach", "Trade-off"], rows: [
          ["Fixed lock order", "Cheap and reliable, but every code path must follow it"],
          ["Retry on detection", "Always needed as a backstop, costs wasted work"],
          ["Lock timeout", "Bounds waiting, but a timeout is not the same as a deadlock and may fire on slow queries"],
        ] },
        { type: "callout", tone: "gotcha", title: "Retrying without backoff", text: "If the victim retries instantly with the same access pattern, it often collides again and again. Add jitter to the delay and cap the attempts, otherwise a deadlock turns into a retry storm." },
        { type: "p", text: "In an interview, say the word cycle, draw the two sessions, then give the fixed ordering as the fix and retry as the safety net. Saying \"increase the timeout\" is the answer interviewers hear and discount." },
      ],
      references: [
        { title: "PostgreSQL: Explicit Locking (Deadlocks)", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
        { title: "Deadlock (Wikipedia)", url: "https://en.wikipedia.org/wiki/Deadlock" },
        { title: "PostgreSQL: SELECT (locking clause)", url: "https://www.postgresql.org/docs/current/sql-select.html" },
      ],
    },
  },
};
