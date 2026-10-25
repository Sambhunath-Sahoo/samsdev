import type { LessonEntry } from "@/types/roadmap";

export const CONSISTENCY_MODELS: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Consistency models",
    slug: "consistency-models",
    lesson: {
      summary: "A consistency model is a promise about what reads may return after writes; pick the weakest promise your feature can live with.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Strong vs eventual consistency" },
        { type: "p", text: "With **strong** (linearizable) consistency, once a write is acknowledged every later read, from any client, sees it. The system behaves as if there were one copy. With **eventual** consistency, replicas converge if writes stop, but a read right after a write may return the old value, and different clients may briefly see different values." },
        { type: "p", text: "Strong consistency costs coordination: each write waits for other replicas, so latency rises and availability drops during partitions. Eventual consistency is cheap and fast, but the application has to tolerate stale reads and conflicting writes. Choose per feature: a bank balance or a seat reservation needs strong; a like count or a follower list rarely does." },
        { type: "h2", text: "Between strong and eventual" },
        { type: "p", text: "There are useful guarantees in the middle, and they fix most of the visible weirdness of eventual consistency for a small cost." },
        {
          type: "table",
          head: ["Guarantee", "Promise", "Bug it prevents"],
          rows: [
            ["Read-your-writes", "You always see your own earlier writes", "You post a comment, refresh, and it is gone"],
            ["Monotonic reads", "Once you see a value, you never see an older one", "A page shows 12 replies, the next refresh shows 9"],
            ["Causal consistency", "If B was caused by A, everyone sees A before B", "A reply appears before the question it answers"],
          ],
        },
        { type: "p", text: "How they are implemented: read-your-writes can be done by reading from the leader (or a replica that has caught up to your write's position) for a short time after you write. Monotonic reads can be done by pinning a user to one replica, for example by hashing the user id. Causal consistency needs metadata such as version vectors or dependency tracking to order related writes." },
        { type: "code", language: "text", title: "Read-your-writes with a log position", code: `write(post)  -> leader returns log_position = 8123
client stores min_position = 8123 for 30 s
read(feed)   -> send min_position
replica      -> if applied_position >= 8123 serve, else forward to leader` },
        { type: "h2", text: "Quorum reads and writes" },
        { type: "p", text: "In leaderless stores (Dynamo, Cassandra, Riak) data is copied to **N** replicas. A write waits for **W** acknowledgements and a read asks **R** replicas and takes the newest version. If **R + W > N**, every read set overlaps every write set in at least one replica, so a read sees the latest acknowledged write." },
        { type: "list", items: [
          "N=3, W=2, R=2: tolerates one replica down for both reads and writes. The common default.",
          "N=3, W=3, R=1: fast reads, but a single down replica blocks all writes.",
          "N=3, W=1, R=1: R + W = 2, not above 3, so reads can be stale. Fastest, weakest.",
        ] },
        { type: "p", text: "Overlap is necessary, not sufficient, for linearizability. Sloppy quorums, concurrent writes resolved by wall-clock timestamps, and a write that fails after reaching only some replicas can all still produce stale or lost data. Read repair and anti-entropy slowly fix replicas that missed a write." },
        { type: "callout", tone: "gotcha", title: "Quorum does not mean strong", text: "Saying \"R + W > N gives strong consistency\" is a classic interview slip. It gives you an overlap guarantee for sequential cases; Jepsen tests have found quorum stores returning stale or lost writes under concurrency and clock skew. Say \"strong-ish, with caveats\" and name last-write-wins as the usual culprit." },
        { type: "h2", text: "Picking a model in an interview" },
        { type: "list", ordered: true, items: [
          "List the reads and writes in the design and mark which ones must never be stale.",
          "Give those the strong path (leader reads, or W + R > N, or a consensus-backed store).",
          "Give the rest the cheapest path that avoids visible bugs: usually read-your-writes plus monotonic reads.",
          "Say how conflicts are resolved if two writes race: last-write-wins, merge, or reject.",
        ] },
      ],
      references: [
        { title: "Consistency Models - Jepsen", url: "https://jepsen.io/consistency" },
        { title: "Amazon's Dynamo - Werner Vogels", url: "https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html" },
        { title: "Dynamo - Apache Cassandra documentation", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html" },
        { title: "Eventual consistency - Wikipedia", url: "https://en.wikipedia.org/wiki/Eventual_consistency" },
      ],
    },
  },
};
