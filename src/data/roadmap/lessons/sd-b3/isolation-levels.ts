import type { LessonEntry } from "@/types/roadmap";

export const ISOLATION_LEVELS: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Isolation levels",
    slug: "isolation-levels",
    lesson: {
      summary: "Isolation levels trade performance against the anomalies concurrent transactions can cause, and Serializable requires you to retry.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The anomalies" },
        { type: "p", text: "Isolation is not all or nothing. The SQL standard defines levels by which anomalies they permit. Know the anomalies first, and the levels follow." },
        { type: "table", head: ["Anomaly", "What happens"], rows: [
          ["Dirty read", "You read another transaction's uncommitted change, which may be rolled back"],
          ["Non-repeatable read", "You read a row twice in one transaction and get different values because someone committed in between"],
          ["Phantom read", "You run the same range query twice and new rows appear or vanish"],
          ["Lost update", "Two transactions read, then write, and one overwrites the other"],
          ["Write skew", "Two transactions read overlapping data, each writes a different row, and together they break a rule neither broke alone"],
        ] },
        { type: "p", text: "Write skew deserves an example. Two doctors are on call and the rule is at least one must stay. Both check the count (2), both see it is safe to leave, both set themselves off call. Each wrote a different row, so there is no write conflict, yet the rule is broken." },
        { type: "h2", text: "The levels" },
        { type: "table", head: ["Level", "Dirty read", "Non-repeatable", "Phantom", "Write skew"], rows: [
          ["Read Uncommitted", "Possible in the standard; PostgreSQL treats it as Read Committed", "Possible", "Possible", "Possible"],
          ["Read Committed", "No", "Possible", "Possible", "Possible"],
          ["Repeatable Read", "No", "No", "Standard allows; PostgreSQL prevents", "Possible"],
          ["Serializable", "No", "No", "No", "No"],
        ] },
        { type: "p", text: "**Read Committed** is the PostgreSQL default. Each statement sees a snapshot of data committed before that statement began. It is fast and fine for most reads, but two statements in one transaction can see different data." },
        { type: "p", text: "**Repeatable Read** takes one snapshot at the first statement and keeps it for the whole transaction, so repeated reads agree. In PostgreSQL this is snapshot isolation, and a write to a row that someone else changed since your snapshot fails with a serialization error. MySQL InnoDB defaults to Repeatable Read, but implements it differently, using next-key locks, so check your engine's documentation instead of assuming the table." },
        { type: "p", text: "**Serializable** guarantees the outcome equals some one-at-a-time order of the transactions. PostgreSQL does this with Serializable Snapshot Isolation, which watches read-write dependencies and aborts a transaction when it detects a dangerous pattern." },
        { type: "h2", text: "Serializable and the retry contract" },
        { type: "p", text: "Serializable does not make concurrent transactions wait politely. It lets them run and then aborts one with SQLSTATE `40001` (serialization_failure) when a conflict could produce a non-serial result. Using it comes with a contract: the application must retry the whole transaction on `40001`." },
        {
          type: "code",
          language: "ts",
          title: "Retry wrapper",
          code: `async function withRetry<T>(run: () => Promise<T>, attempts = 5): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await run(); // BEGIN ISOLATION LEVEL SERIALIZABLE ... COMMIT
    } catch (err) {
      const retryable = err.code === "40001" || err.code === "40P01";
      if (!retryable || i >= attempts) throw err;
      await sleep(Math.random() * 25 * 2 ** i); // jittered backoff
    }
  }
}`,
        },
        { type: "p", text: "Retry the entire transaction, including the reads, because the decision it made was based on a stale view. Keep transactions short and make the code inside safe to re-run, with no emails sent or external calls made until after commit." },
        { type: "callout", tone: "tip", title: "Choosing a level", text: "Stay on Read Committed and fix specific races with atomic updates or row locks. Use Repeatable Read for reports that need a consistent snapshot. Use Serializable when the invariant spans several rows and you would rather not reason about every interleaving, and accept the retries." },
        { type: "p", text: "In an interview, do not recite the standard's table as if every engine matched it. Say which database you mean, name the anomaly your scenario needs prevented, and pick the weakest level or the cheapest lock that stops it." },
      ],
      references: [
        { title: "PostgreSQL: Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html" },
        { title: "PostgreSQL: Serialization Failure Handling", url: "https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html" },
        { title: "Isolation (database systems) (Wikipedia)", url: "https://en.wikipedia.org/wiki/Isolation_(database_systems)" },
        { title: "A Critique of ANSI SQL Isolation Levels (Berenson et al.)", url: "https://arxiv.org/abs/cs/0701157" },
      ],
    },
  },
};
