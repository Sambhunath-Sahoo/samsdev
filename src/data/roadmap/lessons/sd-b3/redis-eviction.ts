import type { LessonEntry } from "@/types/roadmap";

export const REDIS_EVICTION: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Redis eviction",
    slug: "redis-eviction",
    lesson: {
      summary: "When Redis reaches maxmemory, the eviction policy decides whether it drops keys or refuses writes, so pick it to match how you use the instance.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "What happens when memory is full" },
        { type: "p", text: "Redis holds everything in RAM. You cap it with `maxmemory`, for example `maxmemory 2gb`. When a write would push usage past the cap, Redis consults `maxmemory-policy`. It either evicts keys to make room or returns an error to the writer. Without a cap, Redis grows until the operating system kills it." },
        { type: "code", language: "conf", title: "redis.conf", code: `maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 5` },
        { type: "h2", text: "The policies" },
        { type: "table", head: ["Policy", "Considers", "Evicts"], rows: [
          ["`noeviction`", "Nothing", "Nothing; writes fail with an error. This is the default"],
          ["`allkeys-lru`", "All keys", "Least recently used"],
          ["`allkeys-lfu`", "All keys", "Least frequently used"],
          ["`allkeys-random`", "All keys", "A random key"],
          ["`volatile-lru` / `volatile-lfu` / `volatile-random`", "Only keys with a TTL", "As the name says; if no key has a TTL, behaves like `noeviction`"],
          ["`volatile-ttl`", "Only keys with a TTL", "The ones closest to expiring"],
        ] },
        { type: "p", text: "Redis does not track exact LRU order, which would cost memory and time on every read. It samples a few random keys (`maxmemory-samples`, default 5) and evicts the best candidate among them. Raising the sample size makes the choice closer to true LRU at a small CPU cost." },
        { type: "p", text: "**LRU** assumes recent use predicts future use, which suits most web traffic. **LFU** counts how often a key is used, with decay, and protects a stable hot set from being flushed by a one-off scan that touches many cold keys. If a nightly job reads a million keys once, LRU can evict your hot keys for them and LFU resists it." },
        { type: "h2", text: "Cache or primary store: pick the contract" },
        { type: "p", text: "The policy is a promise about what Redis may do under pressure, so match it to the role." },
        { type: "list", items: [
          "**Pure cache:** use an `allkeys-*` policy so Redis always accepts new entries and quietly drops cold ones. Every entry can be rebuilt, so dropping is fine.",
          "**Primary store or queue state:** use `noeviction`. Writes fail loudly when memory is full, which is far better than silently losing data. Monitor memory and alert well before the limit.",
          "**Mixed use:** a `volatile-*` policy evicts only keys with a TTL and spares those without, but it is fragile because one forgotten TTL changes behavior. Better to run separate instances for cache and for must-keep data.",
        ] },
        { type: "callout", tone: "gotcha", title: "volatile policies and missing TTLs", text: "With `volatile-lru`, if your cache keys were written without a TTL they are never evicted. Memory fills, there is nothing to evict, and writes start failing as if the policy were `noeviction`. Set a TTL on every cache write, or use `allkeys-lru`." },
        { type: "p", text: "Watch `evicted_keys` and the hit ratio in `INFO stats`. A steadily climbing eviction count with a falling hit ratio means the working set no longer fits, so add memory, shorten value sizes or shard. In an interview, name the policy, say why it fits the role, and say what you monitor." },
      ],
      references: [
        { title: "Redis key eviction", url: "https://redis.io/docs/latest/develop/reference/eviction/" },
        { title: "Cache replacement policies (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cache_replacement_policies" },
        { title: "Redis persistence", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" },
      ],
    },
  },
};
