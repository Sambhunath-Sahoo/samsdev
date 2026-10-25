import type { LessonEntry } from "@/types/roadmap";

export const TRANSACTIONS_AND_ACID: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Transactions and ACID",
    slug: "transactions-and-acid",
    lesson: {
      summary: "A transaction makes several statements succeed or fail together, and ACID names the four guarantees a database gives around that.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Commit, rollback and boundaries" },
        { type: "p", text: "A transaction groups statements so they take effect together or not at all. You open one with `BEGIN`, run the statements, then `COMMIT` to make them permanent or `ROLLBACK` to discard them. On an error inside the block, the correct move is rollback, not carrying on." },
        {
          type: "code",
          language: "sql",
          title: "A transfer as one unit",
          code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
INSERT INTO ledger (from_id, to_id, amount) VALUES (1, 2, 100);
COMMIT;   -- or ROLLBACK if any statement failed`,
        },
        { type: "p", text: "Draw the boundary around the smallest set of changes that must be consistent with each other: debit, credit and ledger row here. Everything else stays outside. Never hold a transaction open across an HTTP call or a user prompt. An open transaction holds locks and keeps old row versions alive, so a slow payment API inside it blocks other writers and delays vacuum." },
        { type: "h2", text: "ACID in plain terms" },
        { type: "table", head: ["Letter", "Promise", "Example"], rows: [
          ["Atomicity", "All statements apply or none do", "Debit without credit never survives a crash"],
          ["Consistency", "A commit moves the database from one valid state to another, by your declared rules", "A `CHECK (balance >= 0)` or foreign key violation aborts the transaction"],
          ["Isolation", "Concurrent transactions do not see each other's half-finished work, to a degree set by the isolation level", "Another session never reads the debit before the credit"],
          ["Durability", "Once commit returns, the data survives a crash", "Power loss after commit does not lose the transfer"],
        ] },
        { type: "p", text: "Be precise about consistency. The database enforces only the constraints you wrote. It cannot know that total money must stay constant unless you encode it. Consistency in ACID is partly your job, which is why it is the letter people explain worst. Atomicity here also differs from atomic in concurrent programming: it is about all-or-nothing on failure, not about excluding other threads. That is isolation." },
        { type: "h2", text: "Durability and the write-ahead log" },
        { type: "p", text: "Writing every changed data page to disk at commit would be slow, because the pages are scattered. Databases instead append a compact record of the change to a write-ahead log (WAL) and flush that log sequentially. Commit returns once the log record is on stable storage. The data pages are written later in the background." },
        { type: "p", text: "After a crash, recovery replays the log to redo committed changes that never reached the data files and undoes or ignores uncommitted ones. The rule that makes this work is that the log is written before the data page it describes, hence write-ahead. The same log feeds replication and point-in-time recovery in PostgreSQL." },
        { type: "list", items: [
          "`synchronous_commit = on` (PostgreSQL default): commit waits for the WAL flush.",
          "`off`: commit returns early. A crash can lose the last few hundred milliseconds of commits, but never corrupts the database.",
          "Disk write caches that lie about flushing break durability silently, so check hardware and fsync settings.",
        ] },
        { type: "callout", tone: "gotcha", title: "ACID is not one switch", text: "Most databases ship with isolation weaker than Serializable, so \"it is in a transaction\" does not mean concurrent requests cannot interfere. Many NoSQL stores give atomicity only for one document or key. Ask what the guarantee covers: one row, one partition, or the whole database." },
        { type: "p", text: "In an interview, avoid reciting the four words. Pick a concrete failure for each: crash between debit and credit, a concurrent reader, a constraint violation, a power cut after commit. Then say which layer provides it: the WAL for durability and atomicity, locks or MVCC for isolation." },
      ],
      references: [
        { title: "PostgreSQL: Transactions (tutorial)", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html" },
        { title: "PostgreSQL: Reliability and the Write-Ahead Log", url: "https://www.postgresql.org/docs/current/wal-intro.html" },
        { title: "ACID (Wikipedia)", url: "https://en.wikipedia.org/wiki/ACID" },
        { title: "Write-ahead logging (Wikipedia)", url: "https://en.wikipedia.org/wiki/Write-ahead_logging" },
      ],
    },
  },
};
