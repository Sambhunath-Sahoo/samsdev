import type { LessonEntry } from "@/types/roadmap";

export const RACE_CONDITIONS: LessonEntry = {
  track: "system-design",
  section: "Concurrency and transactions",
  subsection: {
    title: "Race conditions",
    slug: "race-conditions",
    lesson: {
      summary: "A race condition is a bug whose outcome depends on timing; the cure is to make the check and the change one atomic step.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What a race condition is" },
        { type: "p", text: "A race condition exists when the result of a program depends on how two or more concurrent operations interleave. Each step is correct on its own. The bug lives in the gap between steps, which is why it passes every test on your laptop and appears under production load." },
        { type: "p", text: "In a web backend the concurrency is everywhere: many requests, many app instances, many database connections, all touching the same rows. You do not need threads in your own code to have a race. Two requests handled by two Node processes are enough." },
        { type: "h2", text: "Check-then-act" },
        { type: "p", text: "The most common shape is check-then-act. You look at the state, decide, then change it, and assume nothing moved in between. Booking the last seat shows it well." },
        {
          type: "code",
          language: "sql",
          title: "Broken: the check and the act are separate",
          code: `-- request A and request B both run this
SELECT count(*) FROM seats WHERE id = 7 AND booked = false;   -- both see 1
-- app code: "one seat is free, go ahead"
UPDATE seats SET booked = true, user_id = :me WHERE id = 7;   -- both succeed`,
        },
        { type: "p", text: "Both requests read the seat as free before either writes. Both updates succeed, and the second silently replaces the first user. Nobody saw an error." },
        {
          type: "code",
          language: "sql",
          title: "Fixed: one atomic statement",
          code: `UPDATE seats
SET booked = true, user_id = :me
WHERE id = 7 AND booked = false;
-- affected rows = 1 -> you got it; affected rows = 0 -> someone else did`,
        },
        { type: "p", text: "The condition now travels with the write, and the database applies it under a row lock, so only one request can match. Reading the affected row count is how the caller learns whether it won. The same idea works as a unique constraint: insert a booking row with a unique key on the seat, and the loser gets a constraint violation." },
        { type: "h2", text: "Lost updates and read-modify-write" },
        { type: "p", text: "The second classic is read-modify-write. The app reads a value, computes a new one in code and writes it back. Two requests do this at once and the later write overwrites the earlier one. A balance of 100 read by both, written as 90 by one and 80 by the other, ends at 80 instead of 70. A counter incremented from app code under load ends below the real number of requests for the same reason." },
        {
          type: "table",
          head: ["Fix", "How it works", "Use when"],
          rows: [
            ["Atomic statement", "`SET balance = balance - 10` computes inside the database", "The change is simple arithmetic or a flag flip"],
            ["Conditional update", "Add `WHERE version = :seen` or `WHERE booked = false`", "The logic needs app code between read and write"],
            ["Row lock", "`SELECT ... FOR UPDATE` before reading", "Conflicts are frequent or the work in between is complex"],
            ["Unique constraint", "Let the database reject the duplicate", "You are creating something that must exist only once"],
          ],
        },
        { type: "h2", text: "Races outside the database" },
        { type: "p", text: "The same bug appears with Redis (`GET` then `SET`), with files, and with any cache. A rate limiter that reads a counter, compares it to the limit and then increments will let a burst through. Use `INCR`, which is atomic, or a short Lua script, instead of two round trips." },
        { type: "p", text: "An in-process mutex does not help once you run more than one instance. The lock has to live where the data lives: the database, or a distributed lock with the caveats that come with one." },
        { type: "callout", tone: "gotcha", title: "Wrapping it in a transaction is not enough", text: "At the default Read Committed level, two transactions can both run the SELECT, both see the seat free and both update it. A transaction gives you atomicity, not mutual exclusion. You still need an atomic statement, a lock, a version check or Serializable isolation." },
        { type: "h2", text: "In an interview" },
        { type: "list", items: [
          "Name the interleaving out loud: draw two timelines and mark where they cross.",
          "Do not say \"add a mutex\" for a multi-instance system.",
          "Prefer the cheapest fix that works: atomic update first, then versioning, then locks.",
          "Say how the loser finds out, such as a row count of zero, and what the user sees.",
        ] },
      ],
      references: [
        { title: "Race condition (Wikipedia)", url: "https://en.wikipedia.org/wiki/Race_condition" },
        { title: "PostgreSQL: Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html" },
        { title: "PostgreSQL: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
      ],
    },
  },
};
