import type { RoadmapSection } from "@/types/roadmap";

export const CONCURRENCY_AND_TRANSACTIONS: RoadmapSection = {
  title: "Concurrency and transactions",
  goal: "What goes wrong when two requests touch the same data, and the tools that prevent it.",
  doneWhen: [
    "Name the anomaly each isolation level allows and pick a level for a given workload.",
    "Fix a lost update with an atomic statement, optimistic versioning or a row lock, and justify the choice.",
    "Explain how a deadlock forms and two ways to stop it from recurring.",
  ],
  subsections: [
    {
      title: "Race conditions",
      points: [
        {
          id: "sd.concurrency.race-conditions-check-then-act",
          title: "Check-then-act races",
          detail:
            "A race condition exists when the result depends on how concurrent operations interleave. The classic form is check-then-act: two requests both run `SELECT count(*) FROM seats WHERE booked = false`, both see a free seat, and both book it. The check and the action must become one atomic step, for example a single `UPDATE seats SET booked = true WHERE id = 7 AND booked = false` and then reading the affected row count.",
          question: "Two users click Book on the last seat at the same moment. Walk through how it gets double-booked and how you stop it.",
        },
        {
          id: "sd.concurrency.lost-updates",
          title: "Lost updates and read-modify-write",
          detail:
            "A lost update happens when two transactions read the same value, each computes a new one in application code, and the later write silently overwrites the earlier one. A balance read as 100 then written as 90 by one request and 80 by another leaves 80 instead of 70. Push the arithmetic into the database with `UPDATE accounts SET balance = balance - 10 WHERE id = 1`, or guard the write with a version check or a row lock.",
          question: "A counter incremented from app code under load ends up lower than the number of requests. Why, and what are three fixes?",
        },
      ],
    },
    {
      title: "Deadlocks",
      points: [
        {
          id: "sd.concurrency.deadlock-circular-wait",
          title: "How a deadlock forms",
          detail:
            "A deadlock is a cycle of waiting: transaction A holds a lock on row 1 and wants row 2, while B holds row 2 and wants row 1. Neither can proceed. Databases such as PostgreSQL and MySQL InnoDB detect the cycle, abort one transaction as the victim and return an error like SQLSTATE 40P01, so the application must be ready to retry.",
          question: "Two transfers, A to B and B to A, run at once and one fails with a deadlock error. What happened and what should the caller do?",
        },
        {
          id: "sd.concurrency.deadlock-prevention",
          title: "Preventing and handling deadlocks",
          detail:
            "The most reliable fix is a consistent lock order, for example always locking the lower account id first in a transfer. Also keep transactions short, avoid user interaction or network calls while holding locks, and lock all needed rows up front. Add bounded retry with jitter for the victim, and use a lock timeout so a stuck waiter fails instead of piling up.",
          question: "How would you restructure a money-transfer function so that it can never deadlock with itself?",
        },
      ],
    },
    {
      title: "Transactions and ACID",
      points: [
        {
          id: "sd.concurrency.database-transactions",
          title: "Transactions: commit, rollback and boundaries",
          detail:
            "A transaction groups several statements so they take effect together or not at all: `BEGIN`, the statements, then `COMMIT`, or `ROLLBACK` on any error. Keep the boundary around the smallest unit that must be consistent, such as debit, credit and ledger entry. Never hold a transaction open across an HTTP call or a user prompt, because open transactions hold locks and block cleanup.",
          question: "Why is calling a payment provider's API inside an open database transaction a bad idea?",
        },
        {
          id: "sd.concurrency.acid-properties",
          title: "ACID in plain terms",
          detail:
            "Atomicity: all of a transaction's changes apply or none do. Consistency: a commit moves the database from one state satisfying its constraints to another, and the application defines the invariants. Isolation: concurrent transactions do not see each other's partial work, to a degree set by the isolation level. Durability: once commit returns, the data survives a crash, which databases achieve by flushing a write-ahead log.",
          question: "Which ACID letter is the database actually enforcing and which one depends on your own schema and code?",
        },
        {
          id: "sd.concurrency.durability-and-wal",
          title: "Durability and the write-ahead log",
          detail:
            "A database writes each change to a sequential log and flushes it to disk before acknowledging commit, then applies it to data pages later. After a crash it replays the log to recover committed work and discards the uncommitted. Settings such as PostgreSQL `synchronous_commit = off` trade a small window of lost recent commits for lower latency.",
          question: "The server loses power right after COMMIT returns. Why is your row still there?",
        },
      ],
    },
    {
      title: "Isolation levels",
      points: [
        {
          id: "sd.concurrency.isolation-anomalies",
          title: "The anomalies isolation levels guard against",
          detail:
            "A dirty read sees another transaction's uncommitted data. A non-repeatable read gets different values for the same row on two reads in one transaction. A phantom read gets a different set of rows for the same predicate. Write skew is subtler: two transactions each read an overlapping set, then update different rows, and together break a rule, such as two on-call doctors both going off duty because each saw the other still on.",
          question: "Describe write skew with a concrete example and say which isolation level prevents it.",
        },
        {
          id: "sd.concurrency.isolation-levels-compared",
          title: "Read Committed, Repeatable Read and Serializable",
          detail:
            "The SQL standard names Read Uncommitted, Read Committed, Repeatable Read and Serializable, from weakest to strongest. PostgreSQL defaults to Read Committed, which prevents dirty reads but allows non-repeatable reads, phantoms and write skew. PostgreSQL's Repeatable Read is snapshot isolation, which also blocks phantoms but still allows write skew. MySQL InnoDB defaults to Repeatable Read, which uses gap locks. Only Serializable rules out all of these anomalies.",
          question: "Your database is on Read Committed. Name an anomaly you can still hit and one fix that does not require changing the level.",
        },
        {
          id: "sd.concurrency.serializable-and-retries",
          title: "Serializable and the retry contract",
          detail:
            "Serializable gives the outcome of some one-at-a-time order of the transactions. PostgreSQL implements it with serializable snapshot isolation, which tracks read and write dependencies and aborts a transaction with SQLSTATE 40001 when it would form an unsafe cycle. It costs throughput and requires the application to retry on that error, so use it for the few critical paths that need it.",
          question: "What must application code do differently when a transaction runs at Serializable?",
        },
      ],
    },
    {
      title: "Optimistic locking",
      points: [
        {
          id: "sd.concurrency.optimistic-version-column",
          title: "Version column and compare-and-set",
          detail:
            "Optimistic locking assumes conflicts are rare and checks at write time instead of locking. Add an integer `version` column, read it with the row, and write with `UPDATE docs SET body = $1, version = version + 1 WHERE id = $2 AND version = $3`. If zero rows are affected, someone else changed the row first. HTTP exposes the same idea through ETag and `If-Match`.",
          question: "How does an UPDATE with `WHERE version = ?` stop two editors from overwriting each other without taking any locks?",
        },
        {
          id: "sd.concurrency.optimistic-conflict-handling",
          title: "Handling conflicts and when optimistic wins",
          detail:
            "On a failed version check you either retry the whole read-modify-write cycle automatically, which suits counters and idempotent merges, or surface a conflict to the user, which suits document editing. Optimistic locking works best for read-heavy data with low contention. Under heavy contention on a few hot rows, most attempts fail and retries waste work, so a pessimistic lock performs better.",
          question: "A hot inventory row is updated by hundreds of requests per second. Does optimistic locking still make sense?",
        },
      ],
    },
    {
      title: "Pessimistic locking",
      points: [
        {
          id: "sd.concurrency.pessimistic-select-for-update",
          title: "SELECT ... FOR UPDATE",
          detail:
            "Pessimistic locking takes the lock before changing the data. Inside a transaction, `SELECT balance FROM accounts WHERE id = 1 FOR UPDATE` locks that row, so another transaction trying to lock or update it waits until the first commits or rolls back. It removes the race at the cost of blocking, so lock only the rows you need, in a consistent order, for as short a time as possible.",
          question: "Show how SELECT ... FOR UPDATE fixes the double-spend of an account balance, and what happens to the second transaction.",
        },
        {
          id: "sd.concurrency.pessimistic-skip-locked-and-nowait",
          title: "SKIP LOCKED, NOWAIT and lock timeouts",
          detail:
            "`FOR UPDATE SKIP LOCKED` skips rows other transactions have locked, which turns a table into a simple job queue where many workers each claim different rows without blocking. `NOWAIT` fails immediately if the row is locked, and a setting such as `lock_timeout` bounds how long a statement may wait. These keep one slow transaction from stalling everyone behind it.",
          question: "Ten workers poll a jobs table. How do you make sure each job is claimed by exactly one worker without workers blocking each other?",
        },
        {
          id: "sd.concurrency.choosing-a-locking-strategy",
          title: "Choosing between optimistic, pessimistic and atomic updates",
          detail:
            "Prefer a single atomic statement when the change can be expressed in SQL, such as `SET stock = stock - 1 WHERE stock > 0`. Use optimistic versioning when conflicts are rare and the work between read and write is long or involves a user. Use pessimistic row locks when contention is high or the read-modify-write cannot be a single statement. Locks only protect within one database, so across services you need a different mechanism.",
          question: "Pick a locking approach for a flash sale with 5,000 buyers for 100 items, and explain why.",
        },
      ],
    },
  ],
};
