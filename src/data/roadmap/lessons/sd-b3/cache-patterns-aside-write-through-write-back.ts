import type { LessonEntry } from "@/types/roadmap";

export const CACHE_PATTERNS_LESSON: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Cache patterns: aside, write-through, write-back",
    slug: "cache-patterns-aside-write-through-write-back",
    lesson: {
      summary: "Three patterns decide who talks to the cache and the database on reads and writes, trading freshness, speed and durability.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why the pattern matters" },
        { type: "p", text: "A cache is a copy, so every write raises the question of which copy is right. The pattern you pick sets the order of operations on reads and writes, and with it how stale reads can be and what you lose if the cache dies." },
        { type: "h2", text: "Cache-aside (lazy loading)" },
        { type: "p", text: "The application owns the logic. On read it checks the cache. On a miss it reads the database, stores the result with a TTL and returns it. On write it updates the database and then deletes the cache key, so the next read reloads fresh data." },
        {
          type: "code",
          language: "ts",
          title: "Cache-aside",
          code: `async function getUser(id: string) {
  const cached = await redis.get("user:" + id);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);        // miss: go to the source
  if (user) await redis.set("user:" + id, JSON.stringify(user), "EX", 300);
  return user;
}

async function updateUser(id: string, patch: Partial<User>) {
  await db.users.update(id, patch);                // database first
  await redis.del("user:" + id);                   // then invalidate
}`,
        },
        { type: "p", text: "Only data that is actually requested gets cached, and if the cache is down the system still works, only slower. The weaknesses are a slow first read per key and a staleness window: if the `del` fails, the old value lives until the TTL expires." },
        { type: "h2", text: "Write-through" },
        { type: "p", text: "Writes go through the cache layer, which stores the value and writes it to the database as part of the same operation. The call returns only when both succeed. Reads then hit a cache that is always current." },
        { type: "p", text: "You pay for it on writes, which are slower because they include the database round trip, and you may fill the cache with entries nobody reads. It suits data that is read soon after it is written and where stale reads are unacceptable, such as a user's own profile. It does not remove the problem of two stores that can disagree if one write fails midway, so define which one wins." },
        { type: "h2", text: "Write-back (write-behind)" },
        { type: "p", text: "The write lands in the cache and returns immediately. The cache flushes to the database later, often in batches and coalescing repeated writes to the same key. Write latency is excellent and the database sees far fewer writes." },
        { type: "p", text: "The danger is the window before the flush. If the cache node dies, those writes are gone, and the database lags behind what users were told succeeded. Use it only where losing a few seconds is acceptable, such as view counters or last-seen timestamps, or where the cache has its own durable log." },
        { type: "table", head: ["Pattern", "Read freshness", "Write latency", "Risk"], rows: [
          ["Cache-aside", "Stale until delete or TTL", "Database write plus a delete", "Failed delete leaves stale data"],
          ["Write-through", "Fresh", "Cache plus database, both awaited", "Wasted space, slower writes"],
          ["Write-back", "Fresh in cache, database behind", "Cache only, very fast", "Data loss on cache failure"],
        ] },
        { type: "callout", tone: "tip", title: "Default to cache-aside", text: "It is the simplest, works with any database and survives a cache outage. Reach for write-through or write-back only when you can name the specific problem they solve, such as read-your-writes freshness or database write amplification." },
        { type: "p", text: "In an interview, walk the read miss and the write step by step, say what is stale if the invalidation fails, and never propose write-back for money, orders or anything that must not be lost." },
      ],
      references: [
        { title: "Cache-Aside pattern (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside" },
        { title: "Caching strategies (Amazon ElastiCache)", url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html" },
        { title: "Caching guidance (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching" },
      ],
    },
  },
};
