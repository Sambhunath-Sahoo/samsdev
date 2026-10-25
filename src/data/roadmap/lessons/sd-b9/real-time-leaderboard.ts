import type { LessonEntry } from "@/types/roadmap";

export const REAL_TIME_LEADERBOARD: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Real-time leaderboard",
    slug: "real-time-leaderboard",
    lesson: {
      summary: "Rank millions of players by score with instant updates, using a Redis sorted set and a plan for when one node is not enough.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: submit a score, show the top N, show a player's own rank and the players just above and below them, and support daily, weekly and all-time boards. Non-functional: updates visible within a second, rank lookups in a few milliseconds, and correct ordering for ties." },
        { type: "p", text: "Assume 50 million players and 5 million active in a day. If each active player submits 10 scores a day, that is 50 million writes a day, about 600 a second on average and maybe 5,000 at peak. Reads are heavier: every game screen asks for the top 10 and your rank, so say 20,000 reads a second. Memory: a sorted-set entry with a 16-byte player id and a score costs about 100 bytes with overhead, so 50 million players is around 5 GB, which fits on one large Redis node." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "API",
          code: `POST /scores            {playerId, boardId, score}
GET  /boards/{id}/top?limit=10
GET  /boards/{id}/players/{pid}        -> {rank, score}
GET  /boards/{id}/players/{pid}/around?n=5`,
        },
        { type: "p", text: "Redis has a data type built for this: the **sorted set**. Members are unique, each has a floating-point score, and the set stays ordered by score. Insert and update cost O(log N), and rank lookups cost O(log N) as well, because the structure is a skip list plus a hash table." },
        {
          type: "code",
          language: "bash",
          title: "Redis commands",
          code: `ZADD lb:2026-W43 1500 player:42           # set or update a score
ZINCRBY lb:2026-W43 25 player:42          # add points
ZREVRANGE lb:2026-W43 0 9 WITHSCORES      # top 10
ZREVRANK lb:2026-W43 player:42            # 0-based rank
ZREVRANGE lb:2026-W43 95 105              # neighbours around rank 100
EXPIRE lb:2026-W43 1209600                # drop old weekly boards`,
        },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "Game servers call a score service, which validates the score (never trust the client; the game server signs it), writes to the **database as the source of truth**, then updates Redis. Redis is a fast derived view that you can rebuild from the database. For durability and to decouple, put a queue between: the service publishes a score event, and a consumer applies it to Redis and the database. One key per board and period (`lb:daily:2026-10-25`, `lb:weekly:...`) makes resets trivial, since a new period is a new key and old ones expire." },
        { type: "p", text: "**Ties**: sorted sets break equal scores by member name, which is arbitrary. To rank earlier achievers higher, encode the timestamp in the score, for example `score * 10^10 + (maxTime - timestamp)`, and keep the combined value within 53 bits of float precision." },
        { type: "p", text: "**When one node is not enough** (hundreds of millions of members, or very high write rates): shard by score range, which keeps top-N cheap, or by hash of player id, which balances load but forces you to merge each shard's top N to get the global top N. For rank in a hash-sharded board, an exact answer needs counts from every shard; an approximate rank for players far from the top is usually acceptable (\"you are in the top 12%\")." },
        {
          type: "table",
          head: ["Option", "Rank query", "Write cost", "Use when"],
          rows: [
            ["SQL `ORDER BY score` with index", "O(N) count for rank", "Cheap", "Small boards"],
            ["Redis sorted set", "O(log N)", "O(log N)", "Most games"],
            ["Sharded sorted sets", "Merge of shard answers", "O(log N) per shard", "Very large boards"],
            ["Periodic batch + approximation", "Cached", "Batched", "Rank need not be live"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Hot key**: one huge board takes all traffic. Cache the top 100 for a second or two and serve it from memory; it changes slowly relative to read volume.",
            "**Redis loss**: use a replica with persistence, and keep the ability to rebuild a board from the score table.",
            "**Cheating**: server-authoritative scores and rate limits matter more than any ranking trick.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "SQL can do it, until it cannot", text: "`SELECT COUNT(*) WHERE score > :mine` is fine for 10,000 users and a full scan for 50 million. State the size where you would switch, instead of reaching for Redis automatically." },
      ],
      references: [
        { title: "Redis sorted sets", url: "https://redis.io/docs/latest/develop/data-types/sorted-sets/" },
        { title: "Redis ZADD command", url: "https://redis.io/docs/latest/commands/zadd/" },
        { title: "Redis ZREVRANK command", url: "https://redis.io/docs/latest/commands/zrevrank/" },
      ],
    },
    points: [
      { id: "sd.real-time-leaderboard.sorted-set-ranking", title: "Sorted set for ranking", detail: "A Redis sorted set keeps members ordered by score, with O(log N) updates and rank lookups. Commands like ZADD, ZREVRANGE and ZREVRANK cover top N, own rank and neighbours.", question: "Why is a sorted set a better fit than a SQL query with ORDER BY for live ranks?" },
      { id: "sd.real-time-leaderboard.periods-and-ties", title: "Time periods and tie-breaking", detail: "Use one key per board and period so resets are a new key and old boards expire. Equal scores are broken by encoding the achieved time into the score so earlier players rank higher.", question: "How would you give the daily winner to whoever reached the score first?" },
      { id: "sd.real-time-leaderboard.scaling-beyond-one-node", title: "Scaling past one node", detail: "Shard by score range to keep top N cheap, or by player hash to balance load at the cost of merging results. Approximate ranks and a cached top list reduce the load on the hottest keys.", question: "What breaks when you hash-shard a leaderboard, and how do you still answer 'what is my rank'?" },
    ],
  },
};
