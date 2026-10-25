import type { LessonEntry } from "@/types/roadmap";

export const INFRASTRUCTURE_KV_CACHE_SCHEDULER: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Infrastructure: distributed cache, KV store, job scheduler",
    slug: "case-distributed-cache-kv-store-job-scheduler",
    lesson: {
      summary: "Build the stores other systems rely on: partition by consistent hashing, replicate for availability, and choose consistency deliberately.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Distributed key-value store" },
        { type: "p", text: "API: `put(key, value)`, `get(key)`, `delete(key)`. Requirements: scale to hundreds of nodes, survive node loss, low latency, tunable consistency. Estimate: 10 TB of data and 100,000 ops per second is far too much for one machine, so partition and replicate." },
        { type: "p", text: "**Partitioning**: place nodes on a hash ring, each with many virtual nodes so load is even. A key goes to the first node clockwise from its hash. Adding a node moves only about 1/N of the keys. **Replication**: copy each key to the next N distinct nodes on the ring (N is commonly 3), ideally in different racks or zones." },
        { type: "p", text: "**Consistency**: with N replicas, a write waits for W acknowledgements and a read asks R replicas. If R + W > N, a read overlaps the latest write. N=3, W=2, R=2 is the usual balanced setting; W=1 is fast and less safe. Conflicts from concurrent writes are resolved by last-write-wins using timestamps (simple, can drop data) or by version vectors that expose the conflict to the application. This is the Dynamo model, and it favours availability during a partition." },
        { type: "list", items: [
          "**Failure detection**: nodes gossip heartbeats; a node unseen for a while is suspected down.",
          "**Hinted handoff**: if a replica is down, another node holds the write and replays it on return.",
          "**Anti-entropy**: Merkle trees compare replicas cheaply and repair differences in the background.",
          "**Write path on a node**: commit log, then memtable, flushed to sorted files that are compacted (an LSM tree).",
        ] },
        { type: "p", text: "A strongly consistent alternative uses a consensus group (Raft) per shard: one leader orders writes and a majority must acknowledge. It is simpler to reason about but pauses writes during a leader election." },
        { type: "h2", text: "Distributed cache" },
        { type: "p", text: "Same ring, different goals: data can be lost, so skip durable replication, keep everything in memory, and optimise latency. Clients (or a proxy) hash the key to find the node. Use **LRU** or LFU eviction plus a TTL on every key. With a 500 GB hot set and 64 GB nodes, you need at least 8 nodes before counting headroom." },
        { type: "table", head: ["Problem", "What happens", "Mitigation"], rows: [
          ["Node dies", "Its keys miss; database load spikes", "Consistent hashing limits damage to 1/N; warm replicas"],
          ["Hot key", "One node saturates", "Local copy in app memory, or replicate the key under several names"],
          ["Stampede", "Many requests refill one expired key", "Request coalescing, jittered TTLs"],
          ["Stale data", "Cache disagrees with database", "Delete on write, short TTLs"],
        ] },
        { type: "h2", text: "Job scheduler" },
        { type: "p", text: "Store jobs in a table keyed by `run_at` and `status`. Workers claim due jobs with a lease, for example `SELECT ... WHERE run_at <= now() AND status='ready' FOR UPDATE SKIP LOCKED LIMIT 10`, then extend or lose the lease if they crash. Expect at-least-once execution, so jobs must be idempotent, and give each retry exponential backoff and a dead-letter state." },
        { type: "callout", tone: "gotcha", title: "Last-write-wins loses data", text: "Clock skew between nodes means the newest timestamp is not always the newest write. Say so when you pick LWW, and mention versioning for data that cannot be dropped." },
      ],
      references: [
        { title: "Amazon's Dynamo (Werner Vogels)", url: "https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html" },
        { title: "In Search of an Understandable Consensus Algorithm (Raft)", url: "https://raft.github.io/raft.pdf" },
        { title: "Scaling Memcache at Facebook", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
        { title: "Redis Cluster specification", url: "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" },
        { title: "Consistent hashing (Wikipedia)", url: "https://en.wikipedia.org/wiki/Consistent_hashing" },
      ],
    },
  },
};
