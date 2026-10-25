import type { LessonEntry } from "@/types/roadmap";

export const REDIS_DATA_STRUCTURES: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "Redis in practice: data structures and persistence",
    slug: "redis-data-structures-and-persistence",
    lesson: {
      summary: "Redis is an in-memory server of data structures, and its snapshots and append-only file decide how much survives a restart.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "More than a key-value cache" },
        { type: "p", text: "Redis keeps its data in memory and executes commands on a single main thread, one at a time. That makes each command atomic and fast, often well under a millisecond. Its real strength is that values are data structures with their own operations, so the server does work that you would otherwise do in app code." },
        { type: "table", head: ["Structure", "Typical use", "Example commands"], rows: [
          ["String", "Cached JSON, counters, flags, locks", "`SET`, `GET`, `INCR`, `SET key v NX EX 30`"],
          ["Hash", "An object with fields, such as a session", "`HSET`, `HGETALL`, `HINCRBY`"],
          ["List", "Simple queues, recent items", "`LPUSH`, `RPOP`, `LRANGE`"],
          ["Set", "Unique members, tags, who-liked", "`SADD`, `SISMEMBER`, `SINTER`"],
          ["Sorted set", "Leaderboards, delayed jobs, rate-limit windows", "`ZADD`, `ZRANGE`, `ZREMRANGEBYSCORE`"],
          ["Stream", "Append-only event log with consumer groups", "`XADD`, `XREADGROUP`, `XACK`"],
        ] },
        { type: "p", text: "A leaderboard shows the benefit. With a sorted set, `ZADD board 1520 alice` updates a score and `ZREVRANGE board 0 9 WITHSCORES` returns the top ten, both in logarithmic time. Doing this in a relational database means sorting a large table on every request." },
        { type: "p", text: "`INCR` and `SET ... NX EX` are atomic, which is why Redis is the usual home for counters, rate limits and simple locks. Because commands run serially, one slow command, such as `KEYS *` or a huge `SMEMBERS`, blocks every other client. Use `SCAN` to iterate and keep values reasonably small." },
        { type: "h2", text: "Persistence: RDB and AOF" },
        { type: "p", text: "By default memory is lost on restart unless you enable persistence. Redis offers two mechanisms, and they can be combined." },
        { type: "list", items: [
          "**RDB snapshots.** Redis forks and writes a point-in-time dump of the whole dataset to disk at intervals, for example every 5 minutes if enough keys changed. The file is compact and restarts quickly. A crash loses everything since the last snapshot.",
          "**AOF (append-only file).** Every write command is appended to a log and replayed at startup. With `appendfsync everysec`, the default, you lose at most about a second of writes. `always` fsyncs on every write for the best durability and noticeably lower throughput. `no` leaves flushing to the operating system.",
        ] },
        { type: "table", head: ["Setup", "Data you can lose", "Restart time"], rows: [
          ["None", "Everything", "Instant, empty"],
          ["RDB only", "Minutes", "Fast"],
          ["AOF everysec", "About 1 second", "Slower, log is replayed"],
          ["RDB + AOF", "About 1 second, with compact backups", "As AOF"],
        ] },
        { type: "p", text: "Persistence is not replication. A disk file protects against a restart, but not against losing the machine. For availability you add replicas, and for failover a tool such as Redis Sentinel or Cluster. Replication is asynchronous by default, so a failover can still drop the last few acknowledged writes." },
        { type: "callout", tone: "gotcha", title: "Forking costs memory", text: "RDB snapshots and AOF rewrites fork the process, and a write-heavy instance can use close to double its memory while the child runs because of copy-on-write. Leave headroom, or the operating system's out-of-memory killer may end Redis at the worst moment." },
        { type: "p", text: "In an interview, choose the structure first, such as sorted set for ranking, and then state the persistence you need: none for a pure cache, AOF everysec when Redis holds data you would miss." },
      ],
      references: [
        { title: "Redis data types", url: "https://redis.io/docs/latest/develop/data-types/" },
        { title: "Redis persistence", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" },
        { title: "Redis SET command", url: "https://redis.io/docs/latest/commands/set/" },
      ],
    },
    points: [
    {
      id: "sd.redis-data-structures-and-persistence.pick-the-structure",
      title: "Pick the data structure, not just a string",
      detail: "Hashes, sets, sorted sets and streams let Redis do the work in the server, such as a top-ten query with `ZREVRANGE`. Storing everything as a JSON string forces the app to read, change and write the whole value.",
      question: "How would you build a leaderboard and a sliding-window rate limiter in Redis, and which structure fits each?",
    },
    {
      id: "sd.redis-data-structures-and-persistence.single-thread-atomic",
      title: "Single-threaded commands are atomic, and slow ones block everyone",
      detail: "Redis runs commands one at a time, so `INCR` and `SET NX` are atomic without locks. The same property means one expensive command such as `KEYS *` stalls all clients, so use `SCAN` and keep values small.",
      question: "Why is `KEYS *` dangerous in production, and what do you use instead?",
    },
    {
      id: "sd.redis-data-structures-and-persistence.rdb-vs-aof",
      title: "RDB snapshots versus the append-only file",
      detail: "RDB is a periodic compact dump that can lose minutes of writes. AOF logs every write and with `everysec` loses about a second. Persistence protects against restarts, while replicas are what protect against losing the machine.",
      question: "Your Redis holds job state. Which persistence setting do you choose, and how much can you still lose?",
    },
    ],
  },
};
