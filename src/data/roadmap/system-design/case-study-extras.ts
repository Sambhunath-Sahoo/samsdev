import type { RoadmapSubsection } from "@/types/roadmap";

export const STARTER_CASES: RoadmapSubsection = {
  title: "Starter: URL shortener, rate limiter",
  points: [
    {
      id: "sd.cases.url-shortener-scale",
      title: "URL shortener: requirements and scale",
      detail:
        "Estimate first: 100M new URLs a day is about 1.2K writes per second, and 10B redirects a day is about 116K reads per second, so the system is read-heavy at roughly 100 to 1. Reads are served from a Redis cache, which works because a small share of links gets most traffic, backed by Postgres with a primary and read replicas. One primary handles about 1.2K writes per second comfortably, so sharding by a hash of the short code is a later step.",
      question: "From 100M writes a day, derive writes per second and read QPS at a 100 to 1 ratio.",
    },
    {
      id: "sd.cases.url-shortener-short-codes",
      title: "URL shortener: generating short codes",
      detail:
        "Seven base62 characters give 62^7, about 3.5 trillion codes. Encode a unique counter or ID-generator value in base62, which cannot collide, or hash the URL and truncate it, which needs a collision check and a retry. A UUID cut to seven characters can collide, so it needs the same check. Whether the same long URL gets the same code twice is a choice: skipping deduplication keeps writes fast, deduplicating needs an index on the long URL.",
      question: "Why is 'take a UUID and keep seven characters' not collision-free, and what are two safer approaches?",
    },
    {
      id: "sd.cases.url-shortener-redirects",
      title: "URL shortener: 301 vs 302 and click analytics",
      detail:
        "A 301 (permanent) redirect is cached by browsers, so repeat clicks never reach your servers: cheap and fast, but invisible to analytics and hard to retarget. A 302 (temporary) redirect sends every click through the service so it can be counted and the destination changed. Record clicks asynchronously by publishing events to Kafka and aggregating in an analytics store such as ClickHouse, rather than incrementing a counter on the hot URL row.",
      question: "The product owner wants click counts and editable targets. Which redirect do you use, and why?",
    },
    {
      id: "sd.cases.url-shortener-storage",
      title: "URL shortener: schema and edge cases",
      detail:
        "The core table has a unique short_code, the long_url, an optional owner, created_at and an optional expiry. The unique index on short_code is the lookup path and also settles two concurrent inserts of the same code. Handle custom aliases by rejecting on a unique violation, expiry with a read-time check plus a cleanup job, and abuse with a blocklist or safe-browsing check.",
      question: "Two users request the same custom alias at the same instant. How does the schema decide the winner?",
    },
    {
      id: "sd.cases.rate-limiter-design",
      title: "Rate limiter: placement and algorithm",
      detail:
        "Put the limiter in the API gateway or middleware, key it by user id, API key or IP, and return 429 once the limit, say 100 requests a minute, is exceeded. State must be shared across servers, so keep counters in Redis and make check-and-update atomic with a Lua script. A token bucket suits most public APIs because it allows short bursts and costs O(1) per request; a leaky bucket smooths output to a fixed rate, which suits protecting a strict downstream such as a payment provider.",
      question: "Why does a per-process counter break the limit when you run four servers?",
    },
    {
      id: "sd.cases.rate-limiter-failure-modes",
      title: "Rate limiter: failure modes and tiers",
      detail:
        "If Redis is unreachable, fail open for most APIs so the limiter's outage does not take the product down, and fail closed for sensitive operations such as payments or login. Layer limits: per IP for unauthenticated abuse, then per user, per API key and per endpoint. Tell clients where they stand with Retry-After and the X-RateLimit-Limit, -Remaining and -Reset headers.",
      question: "Redis dies. Fail open or closed for product search, and for the payment endpoint?",
    },
  ],
};

export const SOCIAL_AND_MESSAGING_CASES: RoadmapSubsection = {
  title: "Social and messaging: news feed, chat, notifications",
  points: [
    {
      id: "sd.cases.news-feed-fanout",
      title: "News feed: fan-out on write vs read",
      detail:
        "Fan-out on write pushes each new post into followers' precomputed timelines, for example Redis lists, so reading is a cheap lookup, but one post by an account with millions of followers triggers millions of writes. Fan-out on read assembles the timeline from followed accounts at read time, which makes writes cheap and reads expensive. The usual answer is a hybrid: push for ordinary users, pull for celebrity accounts and merge at read time, because feeds are read far more often than written.",
      question: "How do you handle a user with 50 million followers posting, and why not push to all of them?",
    },
    {
      id: "sd.cases.chat-system",
      title: "Chat system: connections, ordering and presence",
      detail:
        "Clients keep WebSocket connections to chat servers. A message is persisted, routed to the recipient's server through a connection registry or a pub/sub channel and pushed to online devices, while offline users get it from storage plus a push notification. Order messages per conversation with a sequence number assigned by one owner of that conversation, never by client clocks. Presence uses heartbeats with a TTL in Redis so crashed connections time out.",
      question: "Two people in a group send at the same instant. How do all devices agree on the order?",
    },
    {
      id: "sd.cases.notification-system",
      title: "Notification system: fan-out and delivery",
      detail:
        "An event is published to a topic; a notification service looks up user preferences and channels and enqueues one job per channel (push, email, SMS), so each channel has its own workers, rate limits and retries against its provider. Because delivery is at-least-once, use idempotency keys to avoid sending twice. Add templates, priorities so one-time passwords bypass a marketing backlog, and a dead letter queue for failures.",
      question: "Why one queue per channel instead of a single worker doing push, email and SMS?",
    },
  ],
};

export const STORAGE_AND_MEDIA_CASES: RoadmapSubsection = {
  title: "Storage and media: file storage, video streaming",
  points: [
    {
      id: "sd.cases.file-storage-design",
      title: "File storage: chunking, deduplication and metadata",
      detail:
        "Split large files into chunks, for example 4 MB, uploaded in parallel and resumable, each stored in object storage under its content hash. Content-hash deduplication stores identical chunks once, and sync clients upload only the changed chunks. Keep metadata (names, folders, versions, chunk lists, permissions) in a database separate from the blob store, because the two have different access patterns and scaling.",
      question: "A user edits 1 MB inside a 2 GB file. What is uploaded, and where is the file's structure recorded?",
    },
    {
      id: "sd.cases.video-streaming-design",
      title: "Video streaming: transcoding, adaptive bitrate and CDN",
      detail:
        "An uploaded video is stored raw, then transcoded in parallel by workers into several resolutions and bitrates and cut into short segments. Adaptive bitrate protocols such as HLS and DASH let the player switch quality segment by segment as bandwidth changes. Segments are served from a CDN close to viewers, with popular titles pre-positioned in edge caches, so the origin sees few requests.",
      question: "Why cut video into short segments at several bitrates instead of serving one file?",
    },
  ],
};

export const INFRASTRUCTURE_CASES: RoadmapSubsection = {
  title: "Infrastructure: distributed cache, KV store, job scheduler",
  points: [
    {
      id: "sd.cases.distributed-kv-store",
      title: "Distributed key-value store",
      detail:
        "Partition keys across nodes with consistent hashing and virtual nodes, and replicate each key to N nodes. Reads and writes use quorums (R + W > N for fresher reads), hinted handoff and read repair heal differences after failures, and gossip detects failed nodes. The trade-offs are the CAP and PACELC knobs: how many acknowledgements you wait for against latency and availability.",
      question: "How would you choose N, R and W for a shopping cart that must always accept writes?",
    },
    {
      id: "sd.cases.distributed-cache-design",
      title: "Distributed cache",
      detail:
        "Shard keys across cache nodes with consistent hashing, keep a replica per shard so one failure does not drop every key on it, and choose an eviction policy (LRU, LFU, TTL) for when memory fills. Plan for hot keys with local near caches or key replication, and for node loss by making misses cheap to coalesce. Clients need an up-to-date view of the topology.",
      question: "What goes wrong when a single key receives 30% of all cache traffic, and what do you do about it?",
    },
  ],
};

export const PAYMENT_CASES: RoadmapSubsection = {
  title: "Payment system",
  points: [
    {
      id: "sd.cases.payment-ledger-balance",
      title: "Payment system: ledger and derived balance",
      detail:
        "Model money as an append-only ledger of immutable double-entry records, where each transfer debits one account and credits another and the entries sum to zero, and treat a balance as derived from those entries. A stored balance column is acceptable only as a materialised cache updated in the same database transaction and reconciled against the ledger, because a freely editable balance can drift from the transaction log. Corrections are new reversing entries, never edits.",
      question: "A customer disputes a balance. How does an immutable ledger let you prove the correct number?",
    },
    {
      id: "sd.cases.payment-flow-idempotency",
      title: "Payment system: idempotent flow with an external provider",
      detail:
        "A payment moves through states such as created, authorised, captured, failed and refunded, driven by a state machine. The client sends an idempotency key so a retried request returns the original result and never charges twice, and the call to the provider carries its own key. Timeouts leave the true outcome unknown, so reconcile with the provider's reports and webhooks, and use a saga with compensating refunds for multi-step flows.",
      question: "The provider call times out. What state is the payment in, and how does the system find the truth?",
    },
  ],
};

export const RIDE_HAILING_CASES: RoadmapSubsection = {
  title: "Ride hailing",
  points: [
    {
      id: "sd.cases.geospatial-indexing",
      title: "Ride hailing: geospatial indexing",
      detail:
        "To find nearby drivers without scanning all of them, map locations to cells. A Geohash encodes latitude and longitude into a string where a shared prefix means nearby, a quadtree splits dense areas into smaller cells, and S2 or H3 use uniform global cell grids. A query looks in the rider's cell and the neighbouring cells, then filters by exact distance.",
      question: "Why must a Geohash nearby search also look at neighbouring cells?",
    },
    {
      id: "sd.cases.ride-matching",
      title: "Ride hailing: location updates and matching",
      detail:
        "Drivers send their location every few seconds, a very high write rate on data that is useful only briefly, so keep the latest position in an in-memory store such as Redis with a TTL and write only sampled history to durable storage. Matching picks candidates from nearby cells, ranks them by ETA and offers the ride to one at a time with a timeout. A driver must be assigned to one ride only, which needs an atomic claim.",
      question: "Two ride requests pick the same nearest driver at once. How do you make sure only one wins?",
    },
  ],
};

export const COLLABORATIVE_EDITING_CASES: RoadmapSubsection = {
  title: "Collaborative editing",
  points: [
    {
      id: "sd.cases.operational-transformation",
      title: "Collaborative editing with operational transformation",
      detail:
        "In operational transformation each edit is an operation such as 'insert x at position 5'. When concurrent operations meet, they are transformed against each other so every client converges on the same text. Google Docs uses this style with a central server that puts operations in order. The transformation rules are hard to get right, but a central authority keeps the approach practical.",
      question: "Two users insert at the same position concurrently. How does transformation keep both documents identical?",
    },
    {
      id: "sd.cases.crdt-editing",
      title: "Collaborative editing with CRDTs",
      detail:
        "A conflict-free replicated data type makes operations commutative by design, for example by giving every character a unique identifier and a position identifier, so replicas can merge in any order and converge without a central server. That fits offline editing and peer-to-peer sync, at the cost of metadata growth and the need for garbage collection. Libraries such as Yjs and Automerge provide them.",
      question: "When would you choose a CRDT over operational transformation?",
    },
  ],
};

export const ADDITIONAL_CASE_OUTLINES: readonly string[] = [
  "Search engine: crawler, inverted index and ranking",
  "Real-time leaderboard",
  "Logging and monitoring system",
  "Stock ticker and live data feed",
  "Analytics pipeline and data warehouse",
  "Recommendation engine",
  "API gateway",
];
