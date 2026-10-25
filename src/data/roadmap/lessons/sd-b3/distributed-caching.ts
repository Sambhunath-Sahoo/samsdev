import type { LessonEntry } from "@/types/roadmap";

export const DISTRIBUTED_CACHING: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Distributed caching",
    slug: "distributed-caching",
    lesson: {
      summary: "Spread cached data over many nodes with consistent hashing or slots, plan for a node dying, and put a small local cache in front for hot keys.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Spreading keys over nodes" },
        { type: "p", text: "One cache node runs out of memory or throughput eventually. Sharding splits the keyspace so each node holds a part. The question is how a client finds the node for a key." },
        { type: "p", text: "The naive answer is `node = hash(key) % N`. It works until N changes. Going from 4 nodes to 5 changes the result for about 80 percent of keys, so most of the cache is suddenly in the wrong place and your hit rate collapses just when you added capacity." },
        { type: "p", text: "**Consistent hashing** places nodes and keys on a ring. A key belongs to the next node clockwise. Adding or removing a node moves only the keys next to it, roughly 1/N of them, so the rest stay warm. Real implementations give each node many virtual points on the ring to even out the load." },
        { type: "p", text: "**Redis Cluster** uses a fixed variant: 16,384 hash slots, with `slot = CRC16(key) mod 16384`. Each node owns a range of slots, and adding a node means migrating some slots to it. Clients cache the slot map and are redirected when it changes. Multi-key commands only work if the keys land in the same slot, which you control with hash tags such as `{user:42}:cart`." },
        { type: "table", head: ["Scheme", "Keys moved when a node is added", "Notes"], rows: [
          ["`hash % N`", "Most of them", "Simple, breaks on resize"],
          ["Consistent hashing", "About 1/N", "Virtual nodes smooth the load"],
          ["Fixed slots (Redis Cluster)", "Only the migrated slots", "Explicit, supports resharding online"],
        ] },
        { type: "h2", text: "What happens when a node dies" },
        { type: "p", text: "Every key on that node becomes a miss. If the node held a quarter of the data, a quarter of reads go to the database at once, often in the same second. That is the stampede from the previous lesson, now across thousands of keys." },
        { type: "list", items: [
          "**Replicas per shard.** A replica takes over (Redis Cluster promotes one automatically), so the data is mostly still there. Asynchronous replication can lose the last few writes, which is fine for a cache.",
          "**Spare capacity and warm-up.** A replacement node starts empty. Prefill hot keys before it takes traffic.",
          "**Protect the database.** Coalesce misses, rate-limit the miss path and use timeouts, so the database degrades instead of falling over.",
          "**Plan the numbers.** Know what share of load the database can absorb if one shard, or the whole cache, is cold.",
        ] },
        { type: "h2", text: "In-process cache in front of a shared cache" },
        { type: "p", text: "A small in-memory cache inside each app instance, with a library such as Caffeine or a plain LRU map, removes the network hop for the hottest keys and shields the shared cache from hot-key traffic. A single celebrity key can overload the one Redis node that owns it, and a local cache cuts that to one fetch per instance per interval." },
        { type: "p", text: "The price is consistency. Fifty instances hold fifty independent copies, and an update reaches the shared cache before it reaches them. Keep local TTLs short, from a few seconds up to a minute, or broadcast invalidations over pub/sub. Cap the local size so it cannot eat the heap." },
        { type: "table", head: ["Layer", "Latency", "Consistency", "Good for"], rows: [
          ["In-process", "Nanoseconds to microseconds", "Per instance, can be stale for seconds", "Very hot, rarely changing keys"],
          ["Shared (Redis)", "Around a millisecond", "One copy for all instances", "Everything else worth caching"],
          ["Database", "Milliseconds and up", "Source of truth", "Misses"],
        ] },
        { type: "callout", tone: "gotcha", title: "Do not cache what must be exact", text: "Balances, stock counts at checkout and permissions that must revoke instantly should not sit in a local cache with a 30-second TTL. Read them from the source, or invalidate by event." },
        { type: "p", text: "In an interview, explain why modulo hashing fails on resize, name consistent hashing or slots as the fix, and discuss what the database sees when a node is lost." },
      ],
      references: [
        { title: "Consistent hashing (Wikipedia)", url: "https://en.wikipedia.org/wiki/Consistent_hashing" },
        { title: "Redis Cluster specification", url: "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" },
        { title: "Scaling Memcache at Facebook (NSDI 2013)", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
        { title: "Caching guidance (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching" },
      ],
    },
  },
};
