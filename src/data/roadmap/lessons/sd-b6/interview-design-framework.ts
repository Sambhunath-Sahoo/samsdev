import type { LessonEntry } from "@/types/roadmap";

export const INTERVIEW_DESIGN_FRAMEWORK: LessonEntry = {
  track: "system-design",
  section: "Interview craft and low-level design",
  subsection: {
    title: "A repeatable framework: requirements, estimates, design, deep dive, trade-offs",
    slug: "interview-design-framework",
    lesson: {
      summary: "A fixed order for a 45-minute design interview, how to go deep on mechanisms, and how to raise trade-offs and failures yourself.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The six-step design flow" },
        { type: "p", text: "Interviewers want to see how you think, and a fixed order stops you from either freezing or drawing boxes with no reason behind them. Roughly, for 45 minutes:" },
        {
          type: "table",
          head: ["Step", "Time", "What you produce"],
          rows: [
            ["1. Requirements", "5 min", "Functional scope, non-functional goals, what is out of scope"],
            ["2. Estimates", "3-5 min", "Requests per second, storage, bandwidth"],
            ["3. API and data model", "5 min", "Few key endpoints and main entities"],
            ["4. High-level design", "10 min", "Boxes and the data flow for the main use cases"],
            ["5. Deep dive", "15 min", "Two or three components in real detail"],
            ["6. Trade-offs and failures", "5 min", "Bottlenecks, failure modes, what you would change next"],
          ],
        },
        { type: "p", text: "Start by asking. For \"design Twitter\": which features (post, follow, timeline, search?), how many users, read-heavy or write-heavy, latency target, must the timeline be strongly fresh, mobile and web? Then write the answers down as the contract you are designing against." },
        { type: "p", text: "Estimates are for decisions, not decoration. 300 million daily users at 5 timeline reads each is 1.5 billion reads a day, about 17,000 per second on average and perhaps 50,000 at peak. That says a single database will not serve reads, so a cache and fan-out strategy are needed. If an estimate would not change your design, skip it." },
        { type: "code", language: "text", title: "Back-of-envelope shortcuts", code: `1 day ~ 86,400 s  (round to 100,000 for speed)
req/s  = requests per day / 100,000
peak   ~ 2-3 x average
storage = records/day x bytes/record x days kept x replicas
1 KB x 1 billion rows = 1 TB` },
        { type: "h2", text: "Going three layers deep" },
        { type: "p", text: "When the interviewer probes a part, keep descending until you reach a mechanism, not a product name. Saying \"we use Kafka\" is layer one. Layer two: the topic is split into partitions keyed by user id so one user's events stay ordered. Layer three: consumers in a group share partitions, and when one dies the group rebalances and its partitions resume from the last committed offset, so processing must be idempotent because some messages replay." },
        { type: "p", text: "Prepare two or three components per classic problem where you can go that deep: consistent hashing, a rate limiter algorithm, a fan-out strategy, a replication setup. If you reach the edge of what you know, say so and reason from first principles. Bluffing is easier to spot than a clear \"I am not sure, but I would expect...\"." },
        { type: "h2", text: "State trade-offs and failures before being asked" },
        { type: "p", text: "After the design is drawn, take the lead. Walk through what breaks and how you would know." },
        {
          type: "list",
          items: [
            "A cache node dies: hit rate drops, the database sees a surge. Detect with hit-rate and DB load metrics. Mitigate with replicated caches, request coalescing and rate limits to the DB.",
            "A shard gets hot (one celebrity account): detect with per-shard QPS. Mitigate by splitting the key or caching that entity separately.",
            "A dependency slows: timeouts, circuit breakers and degraded responses.",
            "A region is lost: say what your RPO and RTO are and whether it is worth the cost.",
          ],
        },
        { type: "p", text: "Name the cost of each choice too: fan-out on write gives fast reads but expensive writes for accounts with millions of followers, and a feed that is eventually consistent trades freshness for availability." },
        { type: "callout", tone: "gotcha", title: "Common mistakes", text: "Drawing the architecture before asking questions, naming ten technologies with no reasons, optimising for scale nobody asked for, and treating the interviewer's hint as an attack. A hint means you are close to something they want. Take it." },
        { type: "p", text: "Keep a short list of default answers ready: a relational database until the numbers say otherwise, cache for read-heavy data, a queue to absorb bursts and decouple slow work, and replication for availability. Defaults reduce the time you spend choosing and leave more for the deep dive." },
      ],
      references: [
        { title: "Non-Abstract Large System Design (Google SRE Workbook)", url: "https://sre.google/workbook/non-abstract-design/" },
        { title: "Design Principles for Azure Applications (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/" },
        { title: "Systems design (Wikipedia)", url: "https://en.wikipedia.org/wiki/Systems_design" },
      ],
    },
  },
};
