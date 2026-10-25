import type { LessonEntry } from "@/types/roadmap";

export const REDIS_VS_DATABASE_LESSON: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Redis versus the database",
    slug: "redis-versus-the-database",
    lesson: {
      summary: "Use Redis for data you can rebuild and need fast, and keep anything whose loss costs money or trust in the database.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Two different jobs" },
        { type: "p", text: "People ask whether to use Redis or Postgres as if they competed. They usually do different jobs. The database is the **source of truth**: durable, with constraints, transactions and rich queries. Redis is a very fast in-memory layer that is, by default, allowed to forget." },
        { type: "p", text: "A good test: if this data vanished right now, could you rebuild it from somewhere else? If yes, it can be a cache in Redis. If no, it is a record, and it belongs in the database." },
        { type: "table", head: ["", "Redis", "Relational database"], rows: [
          ["Speed", "Sub-millisecond reads and writes from memory", "Milliseconds, depends on indexes and disk"],
          ["Durability", "Optional, weaker (RDB, AOF everysec)", "Strong by default (WAL, fsync on commit)"],
          ["Queries", "By key and by structure, no joins", "SQL, joins, aggregates, ad hoc"],
          ["Constraints", "None", "Unique, foreign key, check"],
          ["Capacity", "Bounded by memory, so costly per GB", "Bounded by disk, cheap per GB"],
          ["Transactions", "Single commands atomic, `MULTI` and Lua for groups", "Full ACID with isolation levels"],
        ] },
        { type: "h2", text: "What belongs where" },
        { type: "list", items: [
          "**Redis:** cached query results, sessions, rate-limit counters, short-lived tokens, leaderboards, idempotency keys with a TTL, distributed locks, pub/sub fan-out.",
          "**Database:** users, orders, payments, inventory, anything audited, anything with relationships you need to enforce.",
          "**Both:** the database holds the record and Redis holds a derived copy, such as a cached product page or a precomputed feed.",
        ] },
        { type: "p", text: "A session store is the grey area. Losing sessions logs everyone out, which is annoying but recoverable, so Redis with persistence off or on is a common and acceptable home. A shopping cart is similar. An order is not." },
        { type: "h2", text: "When Redis is the primary store" },
        { type: "p", text: "It can be done, and some teams do it for queues, counters and feeds. You then accept responsibility for what the database normally gives you: turn on AOF, run replicas with automatic failover, set `maxmemory-policy noeviction`, size memory for the full dataset and test restores. Even then replication is asynchronous, so a failover can lose recent writes, and you give up joins and constraints." },
        { type: "p", text: "Take a product catalog that exists only in Redis. The risks are: a restart or bad failover loses prices, you cannot query by arbitrary fields, and a rogue script can overwrite everything with no history. Reduce them with persistence, a rebuild path from another source, backups and an audit log." },
        { type: "callout", tone: "gotcha", title: "Cache as accidental source of truth", text: "A cache that starts as optional often becomes required: some code reads only from Redis, then one table is no longer written to the database. When an eviction or restart empties it, the data is gone. Keep a rule that every key in a cache can be rebuilt, and test by flushing it in staging." },
        { type: "p", text: "In an interview, say what happens on total loss of the Redis node. If the answer is \"slow for a while\", it is a cache. If it is \"we lose orders\", it is not." },
      ],
      references: [
        { title: "Redis persistence", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" },
        { title: "Redis data types", url: "https://redis.io/docs/latest/develop/data-types/" },
        { title: "PostgreSQL: Reliability and the Write-Ahead Log", url: "https://www.postgresql.org/docs/current/wal-intro.html" },
      ],
    },
  },
};
