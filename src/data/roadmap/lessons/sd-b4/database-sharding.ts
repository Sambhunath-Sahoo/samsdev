import type { LessonEntry } from "@/types/roadmap";

export const DATABASE_SHARDING: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Database sharding",
    slug: "database-sharding",
    lesson: {
      summary: "Sharding splits data across independent database servers by a shard key; the key you pick decides your hot spots, your query limits and how painful growth is.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "When you actually need it" },
        { type: "p", text: "Shard when one primary cannot hold the data or the write rate, after you have tried the cheaper things: indexes, caching, read replicas, bigger hardware, partitioning. Sharding is a one-way door. Every query, migration and report gets harder afterwards, so be able to say which limit you hit (for example 8 TB of data or 30,000 writes per second on one node)." },
        { type: "h2", text: "Choosing a shard key" },
        { type: "p", text: "Each row goes to a shard based on a **shard key**, through a hash, a range, or a lookup table (directory). A good key has three properties: high cardinality (many distinct values), even distribution of both data and traffic, and it appears in your most common queries so a request touches one shard." },
        {
          type: "table",
          head: ["Key", "Works because", "Breaks when"],
          rows: [
            ["`user_id` (hashed)", "Even spread; a user's data stays together", "A celebrity or bot account is far heavier than the rest"],
            ["`tenant_id`", "Isolation; tenant data in one place", "One huge tenant fills a shard; needs splitting"],
            ["`created_at` (range)", "Easy range scans", "All new writes hit the newest shard, a hot spot"],
            ["`country`", "Data locality, residency rules", "Few values, wildly uneven sizes"],
          ],
        },
        { type: "p", text: "The usual rule of thumb: pick the key that matches how you read. A chat app queries messages by conversation, so `conversation_id` keeps one conversation on one shard. If you pick `message_id` instead, loading a conversation fans out to every shard." },
        { type: "code", language: "ts", title: "Hash routing with a fixed number of logical shards", code: `const LOGICAL_SHARDS = 1024;

function logicalShard(userId: string): number {
  return hash64(userId) % LOGICAL_SHARDS;
}

// A small table says which physical server owns each logical shard.
const shardMap: Record<number, string> = loadShardMap();
const dbFor = (userId: string) => shardMap[logicalShard(userId)];` },
        { type: "h2", text: "Cross-shard joins, transactions and indexes" },
        { type: "p", text: "Once data is split, anything that spans shards becomes your problem:" },
        { type: "list", items: [
          "**Joins**: a join across shards means fetching from several and joining in the application, or duplicating small reference tables (countries, plans) onto every shard. Keep tables that are joined together on the same shard by using the same key.",
          "**Transactions**: a single-shard transaction is normal. One across shards needs two-phase commit, which is slow and fragile, or a saga with compensating steps. Design so money moves and similar atomic work stay within a shard.",
          "**Secondary indexes**: finding a user by email when the key is `user_id` means asking every shard. Build a separate lookup table keyed by email that points to the shard, and accept that it is a second write that can lag.",
          "**Global uniqueness and ordering**: auto-increment ids collide across shards, so use generated ids; global sorting needs a merge across shards.",
          "**Aggregates and reports**: send these to a warehouse, not to the shards.",
        ] },
        { type: "h2", text: "Adding shards without moving everything" },
        { type: "p", text: "With `hash(key) % N`, going from 4 shards to 5 changes the answer for about 80 percent of keys, so most data has to move. Three ways around that:" },
        { type: "list", items: [
          "**Many logical shards on few servers**: create 1,024 logical shards up front and map them to 4 servers. To grow, move whole logical shards to a new server and update the map. Keys never change logical shard. This is the simplest and widely used approach.",
          "**Consistent hashing** (next lessons): adding a node moves only about 1/N of the keys.",
          "**Directory-based**: a lookup service stores where each key lives. Flexible, but the directory is a new critical dependency.",
        ] },
        { type: "p", text: "Moving a shard online follows a pattern: copy the data in the background, stream changes made during the copy, briefly pause writes or flip with a version check, switch the map, then delete the old copy. Vitess and MongoDB automate this; doing it by hand is a project." },
        { type: "callout", tone: "tip", title: "Plan for the hot key from day one", text: "Hashing evens out many keys but not one extremely popular key. Decide early how you will split a hot tenant or celebrity, for example by adding a suffix to spread its rows, and know which operations then need to fan out." },
        { type: "p", text: "Common interview mistakes: choosing a key without saying which query it serves, forgetting secondary lookups, sharding by timestamp, and not mentioning resharding. Start with the access pattern, then the key, then what breaks." },
      ],
      references: [
        { title: "Sharding pattern (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding" },
        { title: "MongoDB: Sharding", url: "https://www.mongodb.com/docs/manual/sharding/" },
        { title: "Vitess documentation", url: "https://vitess.io/docs/" },
        { title: "Shard (database architecture)", url: "https://en.wikipedia.org/wiki/Shard_(database_architecture)" },
      ],
    },
  },
};
