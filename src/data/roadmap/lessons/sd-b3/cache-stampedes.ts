import type { LessonEntry } from "@/types/roadmap";

export const CACHE_STAMPEDES: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Cache stampedes",
    slug: "cache-stampedes",
    lesson: {
      summary: "When a hot key expires or a cache empties, a flood of misses can hit the database at once; coalesce, spread out expiry and handle missing keys.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Hot key expiry and coalescing" },
        { type: "p", text: "A cache stampede (or thundering herd) is a burst of identical misses. Say a homepage query takes 800 ms and is requested 2,000 times a second. While the key is cached, the database sees one query every few minutes. The moment it expires, every request in the next 800 ms misses and runs the query itself. That is around 1,600 copies of an expensive query hitting the database together, which can slow it enough to make every rebuild slower still." },
        { type: "p", text: "**Request coalescing** lets one request rebuild while the others wait for its answer. Within one process, this is single-flight: keep a map of in-progress loads per key and share the promise. Across instances, take a short lock in the cache itself." },
        {
          type: "code",
          language: "ts",
          title: "Lock-based rebuild",
          code: `async function get(key: string, load: () => Promise<string>) {
  for (let i = 0; i < 20; i++) {
    const hit = await redis.get(key);
    if (hit) return hit;
    // only one caller gets the lock; it expires on its own if we crash
    const gotLock = await redis.set("lock:" + key, "1", "NX", "PX", 5000);
    if (gotLock) {
      const value = await load();
      await redis.set(key, value, "EX", 300);
      await redis.del("lock:" + key);
      return value;
    }
    await sleep(50); // wait for the winner to fill the cache
  }
  return load(); // give up waiting, do not hang the request
}`,
        },
        { type: "p", text: "The lock needs its own expiry so a crashed rebuilder cannot block the key forever, and the waiters need a limit so they eventually fall back." },
        { type: "h2", text: "Jitter, early refresh and serving stale" },
        { type: "list", items: [
          "**TTL jitter.** If you load 10,000 keys at startup with a 300 s TTL, they all expire together. Use `300 + random(0, 60)` so expiry spreads out.",
          "**Early refresh.** Refresh before expiry. A background job can do it, or each reader can refresh with a probability that rises as the TTL runs down, so one of them does it before the key disappears.",
          "**Serve stale while revalidating.** Keep the old value past its soft expiry, return it immediately, and let one task fetch the new value. Users get a fast answer that is a little old, and the database sees one query. HTTP has the same idea in `stale-while-revalidate`.",
        ] },
        { type: "table", head: ["Technique", "Protects against", "Trade-off"], rows: [
          ["Coalescing / lock", "Many misses on one key", "Waiters add latency; lock needs expiry"],
          ["Jitter", "Many keys expiring together", "Slightly uneven freshness"],
          ["Early refresh", "The expiry moment itself", "Some extra refreshes of keys nobody wants"],
          ["Serve stale", "Source slowness or outage", "Returns old data for a short time"],
        ] },
        { type: "h2", text: "Penetration: misses for keys that do not exist" },
        { type: "p", text: "A different problem: requests for ids that are not in the database, such as `/users/99999999`. They can never be cached normally, so each one passes through the cache to the database and finds nothing. A scanner or bug can send millions." },
        { type: "list", items: [
          "**Cache the negative result** for a short TTL (30 to 60 seconds), using a marker value so you can tell it from a miss.",
          "**Bloom filter** of valid ids in front of the cache. It can say \"definitely not present\" cheaply. It may have false positives but never false negatives.",
          "**Validate input** first: reject ids with the wrong format or range before touching either store.",
        ] },
        { type: "callout", tone: "gotcha", title: "A cold cache is a stampede too", text: "After a deploy or a cache node restart, every key is a miss at once. Warm important keys before taking traffic, ramp load gradually, and rate-limit the miss path to the database." },
        { type: "p", text: "In an interview, separate the cases by name: one hot key, many keys at once, and keys that never exist. Each has a different fix." },
      ],
      references: [
        { title: "Cache stampede (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cache_stampede" },
        { title: "HTTP Caching (RFC 9111)", url: "https://www.rfc-editor.org/rfc/rfc9111" },
        { title: "Scaling Memcache at Facebook (NSDI 2013)", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
      ],
    },
  },
};
