import type { LessonEntry } from "@/types/roadmap";

export const TRADE_OFF_THINKING: LessonEntry = {
  track: "system-design",
  section: "Foundations",
  subsection: {
    title: "Trade-off thinking",
    slug: "trade-off-thinking",
    lesson: {
      summary: "Every design choice buys one thing by paying with another; good designers name both sides and tie the choice to the workload.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "There is no best design" },
        { type: "p", text: "A cache makes reads fast and makes data stale. Replication improves availability and complicates consistency. Microservices let teams ship independently and add network failures. The question is never 'which is better' but 'better for this workload, this team, these limits'. Interviewers listen for whether you see the cost of your own choice." },
        { type: "h2", text: "Read-heavy versus write-heavy" },
        { type: "p", text: "Start by estimating the read to write ratio, because it decides most structural choices." },
        {
          type: "table",
          head: ["Workload", "Typical moves", "What you pay"],
          rows: [
            ["Read-heavy (feeds, catalogs, 100:1)", "Cache, read replicas, CDN, denormalised or precomputed views", "Stale reads, invalidation bugs, more storage"],
            ["Write-heavy (logs, metrics, IoT)", "Append-only logs, queues, batching, partitioning, LSM-tree stores", "Harder queries, eventual visibility, rebalancing work"],
          ],
        },
        { type: "p", text: "A social feed can precompute each user's timeline on write (fan-out on write): reads become one lookup, writes become expensive for accounts with millions of followers. Computing at read time flips the cost. Real systems mix both." },
        { type: "h2", text: "Consistency versus availability (preview)" },
        { type: "p", text: "When a network partition separates replicas, a system must choose: refuse some requests to stay consistent, or answer from possibly stale data to stay available. That is the real content of the CAP theorem; it is about behaviour during a partition, not a menu of any two of three. Even without partitions there is a trade between latency and consistency, which PACELC captures. A bank balance leans toward consistency; a like counter can be stale for seconds." },
        { type: "h2", text: "Cost, performance and complexity" },
        { type: "p", text: "A third axis always exists: money and operational burden. Multi-region active-active gives low latency and high availability and costs several times more, plus conflict resolution. Often a single region with a warm standby meets the real requirement. Complexity is also a cost: every new component needs monitoring, upgrades and someone on call." },
        { type: "list", items: ["Does the extra nine, millisecond or feature pay for itself?", "Can a managed service remove the operational cost?", "What breaks first if traffic grows 10x, and is it cheap to fix later?"] },
        { type: "h2", text: "Stating a trade-off" },
        { type: "p", text: "Use a fixed shape: the choice, the reason tied to a requirement, the cost accepted, and the condition that would change your mind." },
        { type: "code", language: "text", title: "A trade-off stated well", code: `Choice:   cache product pages in Redis with a 60 s TTL.
Because:  reads are 100x writes and p99 must stay under 200 ms.
Cost:     a price change can show stale for up to 60 s; extra component to run.
Revisit:  if price accuracy becomes a legal requirement, invalidate on write instead.` },
        { type: "callout", tone: "gotcha", title: "The unqualified answer", text: "'I would use NoSQL because it scales' or 'Kafka for everything' with no stated cost signals pattern matching, not design. Saying 'it depends' is also a miss unless you follow with what it depends on and pick one." },
      ],
      references: [
        { title: "CAP theorem (Wikipedia)", url: "https://en.wikipedia.org/wiki/CAP_theorem" },
        { title: "PACELC theorem (Wikipedia)", url: "https://en.wikipedia.org/wiki/PACELC_theorem" },
        { title: "Google SRE Book: Embracing Risk", url: "https://sre.google/sre-book/embracing-risk/" },
      ],
    },
  },
};
