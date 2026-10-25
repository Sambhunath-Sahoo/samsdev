import type { LessonEntry } from "@/types/roadmap";

export const SHARDED_COUNTERS: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Sharded counters",
    slug: "sharded-counters",
    lesson: {
      summary: "A single hot counter row becomes a write bottleneck, so split it into many sub-counters and add them up when you read.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The hot row problem" },
        { type: "p", text: "A counter looks trivial: `UPDATE posts SET likes = likes + 1 WHERE id = 42`. On a database with row locks, every increment to the same row waits for the previous one to commit. If each update takes 2 ms inside a transaction, that row tops out near 500 increments per second, no matter how many servers you own. A viral post can easily exceed that. Some stores have explicit limits too: Firestore documentation, for instance, advises that sustained writes to a single document are limited to roughly one per second, and recommends distributed counters." },
        { type: "p", text: "The same issue appears in Redis at a much higher ceiling (a single key handles many tens of thousands of `INCR` per second), but one key still lives on one node and one thread, so a truly enormous counter still needs splitting." },
        { type: "h2", text: "How a sharded counter works" },
        { type: "p", text: "Instead of one row, keep N rows for the same counter, each holding a partial count. A write picks one at random and increments only that one, so N writers rarely collide. A read sums all N rows." },
        { type: "code", language: "sql", title: "Sharded counter in SQL", code: `CREATE TABLE like_counts (
  post_id bigint NOT NULL,
  shard   int    NOT NULL,          -- 0 .. N-1
  n       bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, shard)
);

-- write: pick a random shard, 0..15
INSERT INTO like_counts (post_id, shard, n)
VALUES (42, floor(random() * 16)::int, 1)
ON CONFLICT (post_id, shard) DO UPDATE SET n = like_counts.n + 1;

-- read: add the partial counts
SELECT sum(n) FROM like_counts WHERE post_id = 42;` },
        { type: "p", text: "With 16 shards, the ceiling for that counter rises roughly 16 times, to around 8,000 increments per second in the earlier example. Choose N from the peak write rate you need divided by what one row can take, and add headroom." },
        { type: "h2", text: "Trade-offs and alternatives" },
        { type: "table", head: ["Approach", "Strength", "Cost"], rows: [
          ["Single row", "Exact, simplest", "Write ceiling on one row"],
          ["Sharded counter", "Writes scale with N", "Reads sum N rows; value is slightly stale if you cache it"],
          ["Redis `INCR` plus periodic flush", "Very fast writes", "Can lose recent increments if Redis fails before the flush"],
          ["Log events and aggregate later", "No contention, full history", "Count is delayed by the batch or stream job"],
          ["Approximate (HyperLogLog)", "Tiny memory for unique counts", "Not exact; for distinct counts only, not totals"],
        ] },
        { type: "list", items: [
          "**Read cost**: summing N rows on every page view defeats the purpose. Cache the total for a second or two, or have a background job write the sum into a separate row.",
          "**Exactness**: for likes and views, being off by a few for a second is fine. For inventory or money it is not; use a transaction on one row, or a reservation scheme.",
          "**Idempotency**: a retried request must not count twice. A like is naturally a set (user, post), so insert into a unique table and derive the counter from it, or deduplicate on a request id.",
          "**Skew**: not every counter needs shards. Shard only the hot ones, for example those above a threshold, and keep the rest as a single row.",
        ] },
        { type: "callout", tone: "tip", title: "Combine with Redis for the fast path", text: "A common production design increments a Redis counter for the live number, writes each event to a log, and periodically reconciles the durable count from the log. Say which number is authoritative: the log." },
        { type: "p", text: "In an interview, state the bottleneck first (serialized writes on one row), then the fix, then the read-side cost and how you hide it. Mentioning that you would measure whether the counter is actually hot before adding complexity is a good signal." },
      ],
      references: [
        { title: "Distributed counters (Firestore)", url: "https://cloud.google.com/firestore/docs/solutions/counters" },
        { title: "Redis INCR command", url: "https://redis.io/docs/latest/commands/incr/" },
      ],
    },
    points: [
      {
        id: "sd.sharded-counters.hot-row-bottleneck",
        title: "Why one counter row is a bottleneck",
        detail: "Row-level locking makes concurrent increments of the same row wait in line, so throughput is capped by commit time no matter how many servers you add. Some managed stores also document a per-document write limit.",
        question: "If one increment holds the row lock for 2 ms, what is the highest sustained rate on that row?",
      },
      {
        id: "sd.sharded-counters.split-and-sum",
        title: "Write to a random shard, read by summing",
        detail: "Keep N partial counters for one logical counter. A write increments one random partial, a read sums them all, so write capacity grows about N times while reads cost N lookups.",
        question: "How would you pick N for a counter that peaks at 5,000 writes per second when one row sustains 400?",
      },
      {
        id: "sd.sharded-counters.read-cost-and-staleness",
        title: "Cache the sum and accept slight staleness",
        detail: "Summing every shard on each view is expensive, so cache the total for a short time or let a background job store it. Likes and views tolerate a small lag; stock and balances do not.",
        question: "Which counters can be eventually accurate and which need exact transactional updates?",
      },
      {
        id: "sd.sharded-counters.idempotent-counting",
        title: "Do not count the same event twice",
        detail: "Retries and duplicate deliveries inflate counters. Deduplicate with a unique (user, item) row or a request id, or derive the count from an event log that is the source of truth.",
        question: "How would you make a retried 'like' request increment the count only once?",
      },
    ],
  },
};
