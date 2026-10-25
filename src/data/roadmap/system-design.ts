import type { RoadmapTrack } from "@/types/roadmap";
import { AI_SYSTEM_DESIGN } from "./system-design/ai-system-design";
import {
  API_DESIGN,
  API_GATEWAY_AND_DISCOVERY,
  ARCHITECTURE_MONOLITH_VS_MICROSERVICES,
  CACHE_PATTERNS,
  HIGH_AVAILABILITY,
  MESSAGING_CHOICES,
  OBSERVABILITY_LOGS_AND_METRICS,
  REAL_TIME,
  REDIS_VS_DATABASE,
  REST_GRPC_GRAPHQL,
  SECURITY,
} from "./system-design/api-and-architecture-extras";
import { BACKGROUND_WORK_AND_EVENTS } from "./system-design/background-work-and-events";
import {
  ADDITIONAL_CASE_OUTLINES,
  COLLABORATIVE_EDITING_CASES,
  INFRASTRUCTURE_CASES,
  PAYMENT_CASES,
  RIDE_HAILING_CASES,
  SOCIAL_AND_MESSAGING_CASES,
  STARTER_CASES,
  STORAGE_AND_MEDIA_CASES,
} from "./system-design/case-study-extras";
import { CONCURRENCY_AND_TRANSACTIONS } from "./system-design/concurrency-and-transactions";
import {
  CAP_AND_PACELC,
  CHOOSING_A_DATABASE,
  CONSISTENCY_MODELS,
  CONSISTENT_HASHING,
  DISTRIBUTED_LOCKING,
  NOSQL_FAMILIES,
  OLTP_VS_OLAP,
  TIME_AND_ORDERING,
} from "./system-design/data-and-theory-extras";
import { DATABASES_IN_PRACTICE } from "./system-design/databases-in-practice";
import { extendSection } from "./system-design/extend-section";
import { INTERVIEW_FRAMEWORK } from "./system-design/interview-framework";
import { LOW_LEVEL_DESIGN } from "./system-design/low-level-design";
import { RESILIENCE_PATTERNS } from "./system-design/resilience-patterns";
import { FOUNDATIONS } from "./foundations";
import { outline } from "./outline";

export const SYSTEM_DESIGN: RoadmapTrack = {
  id: "system-design",
  title: "System design",
  description: "From scaling vocabulary to full case studies and AI systems, in suggested learning order.",
  hue: "orange",
  sections: [
    FOUNDATIONS,
    outline("Networking and APIs", "How a request travels and how services talk to each other.", [
      "How a request travels: DNS, TCP, TLS, HTTP",
      "TCP vs UDP",
      REST_GRPC_GRAPHQL,
      REAL_TIME,
      "Push vs pull",
      API_DESIGN,
      {
        title: "Proxies and reverse proxies",
        points: [
          {
            id: "sd.networking.forward-vs-reverse-proxy",
            title: "Forward proxy vs reverse proxy",
            detail:
              "A forward proxy sits in front of clients and speaks for them to the internet, for example a corporate proxy that filters outbound traffic. A reverse proxy sits in front of servers and speaks for them to clients, which hide behind a single public address. Clients know they use a forward proxy; they usually do not know a reverse proxy exists.",
            question: "Which side configures and knows about the proxy in each case, and why does that matter?",
          },
          {
            id: "sd.networking.reverse-proxy-in-practice",
            title: "What a reverse proxy does for you",
            detail:
              "Nginx or Envoy in front of an app server can terminate TLS, compress responses, buffer slow clients so app workers are freed quickly, cache static content and route by path or host. Because the app now sees the proxy's address, the real client IP and scheme must be passed in headers such as X-Forwarded-For, and the app must trust those headers only from the proxy. A misconfigured proxy breaks rate limiting by IP, logging and redirects.",
            question: "Your app logs every request from 10.0.0.5 after Nginx is added. What happened and how do you fix it safely?",
          },
        ],
      },
    ]),
    outline("Data storage", "Choosing where data lives.", [
      "SQL fundamentals and indexing",
      NOSQL_FAMILIES,
      CHOOSING_A_DATABASE,
      "Storage engine internals: B-tree vs LSM tree",
      "Denormalization and vertical partitioning",
      "Bloom filters",
      "Change Data Capture",
      "Search and vector stores",
      "Object storage",
      OLTP_VS_OLAP,
    ]),
    DATABASES_IN_PRACTICE,
    CONCURRENCY_AND_TRANSACTIONS,
    outline("Caching and CDN", "Serving repeat reads without hitting the source.", [
      CACHE_PATTERNS,
      {
        title: "Cache invalidation",
        points: [
          {
            id: "sd.caching.ttl-vs-explicit-invalidation",
            title: "TTL, delete on write and event-driven invalidation",
            detail:
              "A TTL bounds how stale a value can get without any coordination, but it is a blunt tool. Deleting the key when the source changes keeps data fresher, and publishing change events lets many caches invalidate themselves. Most systems combine them: explicit invalidation for freshness and a TTL as a safety net for the invalidations that get lost.",
            question: "A price changed but customers see the old one for 10 minutes. How do you find the cause and prevent it?",
          },
          {
            id: "sd.caching.write-then-delete-ordering",
            title: "Update then delete vs delete then update",
            detail:
              "If you delete the cache entry first and then update the database, a reader can slip in between, reload the old row and put the stale value back for a full TTL. Updating the database first and then deleting the key shrinks that window but does not close it, because a reader that loaded the old row before the commit can write it after your delete. A short TTL or a delayed second delete covers the remainder.",
            question: "Walk through the interleaving that leaves stale data in the cache even with update-then-delete.",
          },
          {
            id: "sd.caching.versioned-keys",
            title: "Versioned keys and group invalidation",
            detail:
              "Putting a version or timestamp in the key, such as user:42:v7, invalidates by writing a new key instead of deleting old ones. Bumping one namespace version invalidates a whole group of entries at once, and the old entries simply age out through eviction. The cost is an extra read to learn the current version.",
            question: "How would you invalidate every cached page that belongs to one tenant without scanning keys?",
          },
        ],
      },
      "Redis in practice: data structures and persistence",
      REDIS_VS_DATABASE,
      {
        title: "Redis eviction",
        points: [
          {
            id: "sd.caching.redis-eviction-policies",
            title: "Eviction policies when memory is full",
            detail:
              "Once maxmemory is reached, the policy picks victims: allkeys-lru and allkeys-lfu consider every key, the volatile-* variants consider only keys that have a TTL, volatile-ttl drops the soonest to expire, and random policies drop arbitrary keys. Redis approximates LRU and LFU by sampling a few keys instead of tracking exact order, which keeps it cheap. LFU suits workloads with a stable hot set; LRU suits workloads where recency predicts reuse.",
            question: "What does allkeys-lru do differently from volatile-ttl, and when would volatile-lru evict nothing?",
          },
          {
            id: "sd.caching.redis-cache-vs-store",
            title: "Cache or primary store: pick the eviction contract",
            detail:
              "With noeviction, Redis rejects writes once memory is full instead of dropping data, which is right when Redis holds the only copy but fails loudly under pressure. A pure cache should use an allkeys policy so it can always accept new entries. Mixing cache keys and must-keep keys on one instance makes both policies wrong, so use separate instances.",
            question: "Your sessions and your page cache share one Redis. What goes wrong under memory pressure?",
          },
        ],
      },
      {
        title: "Cache stampedes",
        points: [
          {
            id: "sd.caching.request-coalescing",
            title: "Hot key expiry and request coalescing",
            detail:
              "When a popular key expires, every request that misses recomputes the value at once and can overwhelm the database. Coalescing lets one request rebuild while the others wait for its result, using a per-key lock in the cache or an in-process single-flight. The lock needs its own expiry so a crashed rebuilder cannot block the key forever.",
            question: "A hot key expires at noon and the database spikes. Describe the failure and three mitigations.",
          },
          {
            id: "sd.caching.ttl-jitter-and-early-refresh",
            title: "TTL jitter, early refresh and serving stale",
            detail:
              "Adding random jitter to TTLs stops a batch of keys loaded together from expiring together. Probabilistic early refresh makes each reader slightly more likely to refresh as expiry approaches, so the value is replaced before it disappears. Serving the stale value while one background task refreshes it trades a little freshness for protection of the source.",
            question: "How does probabilistic early refresh avoid a stampede without any lock?",
          },
          {
            id: "sd.caching.cache-penetration",
            title: "Penetration: misses for keys that do not exist",
            detail:
              "Requests for ids that are not in the database can never be cached normally, so every one reaches the source, which attackers can exploit. Cache the empty result for a short TTL, or put a Bloom filter of valid keys in front. Validating the input format also rejects many of them before the cache is consulted.",
            question: "Someone requests random product ids at 5k per second. How do you protect the database?",
          },
        ],
      },
      {
        title: "Distributed caching",
        points: [
          {
            id: "sd.caching.partitioning-cache-keys",
            title: "Spreading keys over cache nodes",
            detail:
              "Hashing a key modulo the node count moves almost every key when a node is added. Consistent hashing, or fixed hash slots as in Redis Cluster, moves only a small share, so most of the cache stays warm. The client or a proxy must know the mapping and refresh it when topology changes.",
            question: "How much of the keyspace moves when you add a ninth node under modulo hashing and under consistent hashing?",
          },
          {
            id: "sd.caching.cache-node-failure",
            title: "What happens when a cache node dies",
            detail:
              "The keys on that node become misses and their load lands on the database all at once. Replicas per shard, a pre-warmed spare and rate limiting or coalescing on the miss path soften the spike. Capacity planning should assume the database can survive losing a share of the cache.",
            question: "One of ten cache nodes fails. Estimate the extra database load and how you contain it.",
          },
          {
            id: "sd.caching.local-plus-shared-cache",
            title: "In-process cache in front of a shared cache",
            detail:
              "A small local cache removes the network hop for the hottest keys and shields the shared cache from hot-key traffic. The price is that each instance can hold a different version, so local TTLs must be short or invalidation must be broadcast. Use it for data that is read very often and tolerates seconds of staleness.",
            question: "When does a near cache cause bugs that a single shared cache would not?",
          },
        ],
      },
      "CDN and edge",
    ]),
    outline("Scaling and distribution", "Spreading load and data across machines.", [
      {
        title: "Load balancing",
        points: [
          {
            id: "sd.scaling.l4-vs-l7",
            title: "Layer 4 vs layer 7 load balancing",
            detail:
              "An L4 balancer forwards TCP or UDP connections by address and port without reading the payload, so it is fast and protocol-agnostic. An L7 balancer parses HTTP and can route by path, header or cookie, terminate TLS, retry and rewrite, at higher CPU cost. Pick L4 for raw throughput or non-HTTP traffic and L7 when routing decisions need request content.",
            question: "When would you put an L4 balancer in front of a fleet of L7 proxies?",
          },
          {
            id: "sd.scaling.lb-algorithms",
            title: "Balancing algorithms",
            detail:
              "Round robin is simple and fine for uniform requests; weighted variants handle unequal machines. Least connections adapts when request cost varies, and picking the better of two random servers gets most of that benefit cheaply. Hashing on client or key gives affinity, and consistent hashing keeps that affinity stable when servers come and go.",
            question: "Requests vary from 5 ms to 5 s. Why is round robin a poor choice and what do you use?",
          },
          {
            id: "sd.scaling.lb-redundancy",
            title: "Keeping the balancer from being a single point of failure",
            detail:
              "Run at least two balancers, either active-passive behind a floating virtual IP or active-active behind DNS or anycast. Health checks remove dead backends from rotation, and connection draining lets in-flight requests finish before a backend leaves. Managed cloud balancers hide this redundancy but it still exists.",
            question: "How does traffic fail over if the active balancer dies, and how long does it take?",
          },
        ],
      },
      {
        title: "Replication and read replicas",
        points: [
          {
            id: "sd.scaling.leader-follower-replication",
            title: "Leader-follower replication",
            detail:
              "All writes go to the leader, which streams its log to followers. Asynchronous replication keeps writes fast but a leader crash can lose the latest commits; synchronous replication avoids that at the cost of latency and availability when the follower is slow. Multi-leader setups accept writes in several places and therefore need conflict resolution.",
            question: "The leader dies with unreplicated writes. What was lost and how do you decide which follower to promote?",
          },
          {
            id: "sd.scaling.read-replica-routing",
            title: "Routing reads to replicas",
            detail:
              "A replica adds read capacity but no write capacity, since every replica applies every write. Send reads that tolerate slight staleness, such as listings and reports, to replicas and keep reads that must be current, such as a read right after your own write, on the primary. The application or a proxy needs explicit rules for which is which.",
            question: "Which queries of a shopping site go to a replica and which stay on the primary?",
          },
        ],
      },
      {
        title: "Replication lag",
        points: [
          {
            id: "sd.scaling.stale-reads-after-write",
            title: "Stale reads after a write",
            detail:
              "A user saves a change, the next request hits a lagging replica and the old value appears. Fixes include reading from the primary for a short window after that user writes, routing a user consistently to one replica, or passing a log position with the request so a replica serves it only once it has caught up. Each trades load on the primary for correctness.",
            question: "A user updates their profile and still sees the old one. Explain and give two fixes.",
          },
          {
            id: "sd.scaling.lag-causes-and-monitoring",
            title: "Why lag grows and how to watch it",
            detail:
              "Lag jumps when the primary runs large batch writes or long transactions, when a replica applies changes more slowly than they arrive or when the network degrades. Monitor lag in seconds and in log bytes behind, alert when it exceeds what your product tolerates, and consider removing a replica from rotation when it falls too far behind.",
            question: "Lag suddenly grows from 50 ms to 2 minutes after a deploy. What do you check first?",
          },
        ],
      },
      {
        title: "Partitioning",
        points: [
          {
            id: "sd.scaling.partitioning-strategies",
            title: "Range, list and hash partitioning",
            detail:
              "Range partitions, often by date, make old data cheap to drop or archive and suit time-ordered queries. List partitions group by a category such as region. Hash partitions spread rows evenly when there is no natural range. Queries that filter on the partition key touch only matching partitions, which is called pruning.",
            question: "When would you partition an events table by month and what query would defeat pruning?",
          },
          {
            id: "sd.scaling.partitioning-vs-sharding",
            title: "Partitioning vs sharding",
            detail:
              "Partitioning splits a table inside one database server, so it helps with maintenance and scan size but not with machine limits. Sharding places the pieces on different servers, which adds capacity at the cost of routing and cross-shard complexity. Partition first if a single machine can still hold the data.",
            question: "Your table is 2 TB and one server has room. Do you partition or shard, and why?",
          },
        ],
      },
      {
        title: "Database sharding",
        points: [
          {
            id: "sd.scaling.shard-key-choice",
            title: "Choosing a shard key",
            detail:
              "A good key has many distinct values, spreads load evenly and appears in most queries so each query hits one shard. A monotonically increasing key such as a timestamp sends all new writes to one shard, and a key such as tenant id can create a hot shard when one tenant is huge. Changing the key later means moving the data.",
            question: "What shard key would you pick for a multi-tenant SaaS and what makes it risky?",
          },
          {
            id: "sd.scaling.cross-shard-queries",
            title: "Cross-shard joins, transactions and indexes",
            detail:
              "A query without the shard key must ask every shard and merge the results, which is slow and fails if one shard is down. Joins across shards and multi-shard transactions are either unsupported or need distributed transaction machinery. Designs keep related rows on the same shard and denormalize or copy small reference tables to every shard.",
            question: "How do you list a user's orders if orders are sharded by order id instead of user id?",
          },
          {
            id: "sd.scaling.resharding",
            title: "Adding shards without moving everything",
            detail:
              "Creating many more logical shards than servers lets you add a server by moving whole logical shards instead of rehashing rows. A lookup directory or consistent hashing records where each key lives. Data moves in the background with dual writes or log replay, and routing flips only after the copy catches up.",
            question: "How do you grow from 4 to 6 database servers with no downtime?",
          },
        ],
      },
      CONSISTENT_HASHING,
      "Sharded counters",
      "Unique ID generation",
      "Batch vs stream processing",
    ]),
    extendSection(BACKGROUND_WORK_AND_EVENTS, [MESSAGING_CHOICES]),
    outline("Distributed systems theory", "What breaks when data lives on many machines.", [
      CAP_AND_PACELC,
      CONSISTENCY_MODELS,
      "Consensus and leader election: Raft, Paxos",
      "Gossip and heartbeats",
      DISTRIBUTED_LOCKING,
      {
        title: "Distributed transactions",
        points: [
          {
            id: "sd.theory.two-phase-commit",
            title: "Two-phase commit",
            detail:
              "A coordinator asks every participant to prepare, meaning durably promise it can commit, and only if all agree tells them to commit. Participants hold locks from prepare until the decision arrives, and if the coordinator dies between the phases they block. That blocking and the latency are why it is rare across independently owned services.",
            question: "What state is a participant in if the coordinator crashes after prepare, and what can it do?",
          },
          {
            id: "sd.theory.saga-pattern",
            title: "Sagas and compensating actions",
            detail:
              "A saga splits a business flow into local transactions, each with a compensating action that undoes it, such as refunding a charge. An orchestrator can drive the steps or services can react to each other's events. Sagas give up isolation, so other requests can see intermediate state and the design must tolerate it.",
            question: "Design a booking saga for flight, hotel and payment. What is compensated at each failure point?",
          },
          {
            id: "sd.theory.saga-failure-handling",
            title: "When a compensation fails",
            detail:
              "Steps and compensations must be idempotent and retried until they succeed, because a lost reply looks like a failure. Put steps that cannot be undone, like sending an email, after the pivot point where the saga can no longer fail. Persist saga state so it survives a crash, and alert on sagas stuck past a deadline for manual repair.",
            question: "A refund compensation keeps failing. What does the system do and who is told?",
          },
        ],
      },
      TIME_AND_ORDERING,
    ]),
    RESILIENCE_PATTERNS,
    outline("Reliability and observability", "Staying up and knowing when you are not.", [
      "Redundancy, failover and disaster recovery",
      OBSERVABILITY_LOGS_AND_METRICS,
      "Distributed monitoring and error tracking",
      "SLOs and error budgets",
      HIGH_AVAILABILITY,
    ]),
    outline("Architecture styles", "How systems are carved into services.", [
      ARCHITECTURE_MONOLITH_VS_MICROSERVICES,
      API_GATEWAY_AND_DISCOVERY,
      "Serverless",
      SECURITY,
    ]),
    outline("Classic case studies", "The standard interview problems, built from the earlier sections.", [
      STARTER_CASES,
      SOCIAL_AND_MESSAGING_CASES,
      STORAGE_AND_MEDIA_CASES,
      INFRASTRUCTURE_CASES,
      "Booking and ticketing",
      PAYMENT_CASES,
      "Typeahead",
      "Web crawler",
      RIDE_HAILING_CASES,
      COLLABORATIVE_EDITING_CASES,
      "Kafka-style distributed queue",
      ...ADDITIONAL_CASE_OUTLINES,
    ]),
    AI_SYSTEM_DESIGN,
    LOW_LEVEL_DESIGN,
    outline("Interview craft and low-level design", "Delivering a design under time pressure, plus the OOP side.", [
      INTERVIEW_FRAMEWORK,
      "Communication and mock interviews",
    ]),
  ],
};
