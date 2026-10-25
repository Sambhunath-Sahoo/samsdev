import type { LessonEntry } from "@/types/roadmap";

export const CACHE_INVALIDATION: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Cache invalidation",
    slug: "cache-invalidation",
    lesson: {
      summary: "Invalidation keeps cached copies honest: TTLs bound staleness, deletes and events speed it up, and ordering mistakes cause the subtle bugs.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "TTL, delete on write and events" },
        { type: "p", text: "Invalidation is deciding when a cached copy stops being trusted. There are three tools, and real systems combine them." },
        { type: "list", items: [
          "**TTL.** Every entry expires after a fixed time. It needs no coordination and caps staleness, but it is blunt: a 5-minute TTL means readers can see data up to 5 minutes old, and short TTLs cut your hit rate.",
          "**Delete on write.** The code that changes the source deletes the key. Freshness is much better, but only the code paths that remember to do it will do it.",
          "**Event-driven.** Changes are published (a message bus, or database change data capture) and every cache or service subscribed invalidates its own copy. It scales to many caches and many writers, at the price of infrastructure and event lag.",
        ] },
        { type: "p", text: "The usual answer is explicit invalidation for freshness plus a TTL as a safety net for the invalidations that get lost. Without the TTL, one dropped delete means a stale entry forever." },
        { type: "h2", text: "Update then delete, or delete then update" },
        { type: "p", text: "Order matters because readers run concurrently with your write." },
        {
          type: "code",
          language: "text",
          title: "Delete first, then update (bad)",
          code: `writer:  DEL user:42
reader:                 GET user:42 -> miss
reader:                 SELECT user 42 -> old row (writer has not committed)
reader:                 SET user:42 = old row     <- stale, lives a full TTL
writer:  UPDATE users ... COMMIT`,
        },
        { type: "p", text: "Deleting first lets a reader refill the cache with the old row before the update commits. The safer order is to update the database first, then delete the key. That shrinks the window but does not close it: a reader that loaded the old row before the commit can still write it after your delete. Rare, but real under load." },
        { type: "p", text: "Two mitigations cover the remainder: a modest TTL so the damage heals itself, and a delayed second delete a second or so after the first. Setting the new value in the cache on write instead of deleting adds its own race, because two writers can set the cache in a different order than they committed to the database. Deleting is generally safer than updating the cache." },
        { type: "h2", text: "Versioned keys and group invalidation" },
        { type: "p", text: "Instead of deleting, change the key. Put a version in it, such as `user:42:v7`. A write bumps the version, so readers look up a new key and old entries are never touched, just left to be evicted. You never race with a delete." },
        { type: "p", text: "The same trick invalidates a group. Keep one counter per namespace, for example `catalog:ver`, and build keys as `catalog:{ver}:item:9`. Incrementing the counter orphans every entry in the group in one operation, which beats scanning for thousands of keys." },
        { type: "table", head: ["Technique", "Strength", "Cost"], rows: [
          ["TTL only", "Trivial", "Stale up to the TTL"],
          ["Delete on write", "Fresh, simple", "Races, and every writer must cooperate"],
          ["Events / CDC", "Covers many caches and services", "Extra moving parts, lag"],
          ["Versioned keys", "No delete race, cheap group invalidation", "Extra read for the current version, orphans use memory until evicted"],
        ] },
        { type: "callout", tone: "gotcha", title: "Invalidating the wrong keys", text: "A product price may appear in the product page, the search results, the cart and a recommendations list. If you only delete the page key, the other views serve the old price. Track which cached views derive from each entity, or accept short TTLs on derived views." },
        { type: "p", text: "In an interview, do not say invalidation is easy or that a TTL alone is correct for prices. State your staleness budget per data type, then the mechanism that meets it." },
      ],
      references: [
        { title: "Caching guidance (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching" },
        { title: "Scaling Memcache at Facebook (NSDI 2013)", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
        { title: "HTTP Caching (RFC 9111)", url: "https://www.rfc-editor.org/rfc/rfc9111" },
      ],
    },
  },
};
