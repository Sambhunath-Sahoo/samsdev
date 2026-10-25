import type { RoadmapSubsection } from "@/types/roadmap";

export const INTERVIEW_FRAMEWORK: RoadmapSubsection = {
  title: "A repeatable framework: requirements, estimates, design, deep dive, trade-offs",
  points: [
    {
      id: "sd.interview.hld-framework",
      title: "The six-step design flow",
      detail:
        "Run every session in the same order: clarify functional and non-functional requirements, estimate capacity (users, QPS, storage, bandwidth), draw the high-level design and data flow, deep-dive on the components the interviewer cares about (schema, APIs, key algorithms, scaling), state the trade-offs, then name bottlenecks and failure points and how to fix them. Jumping straight to boxes without clarifying requirements is the most common failure.",
      question: "What do you ask in the first five minutes of 'design Twitter'?",
    },
    {
      id: "sd.interview.deep-dive-depth",
      title: "Going three layers deep",
      detail:
        "When the interviewer probes a component, keep going until you reach mechanism rather than a product name: 'consistent hashing' becomes virtual nodes, then what moves when a node joins, then what happens when one fails. Prepare two or three components per design where you can go that deep, and say what you do not know instead of bluffing.",
      question: "You said 'we use Kafka'. Go three layers deeper: partitions, consumer groups, and what happens when a consumer dies.",
    },
    {
      id: "sd.interview.failure-modes-unprompted",
      title: "State trade-offs and failures before being asked",
      detail:
        "After the design, volunteer what fails and how you would detect and recover: a cache node dies, a shard gets hot, a dependency slows, a region goes down. Pair each failure with a detecting metric and a fix. Naming the cost of each choice, such as eventual consistency for feed reads, shows senior judgement.",
      question: "Pick one component in a design you know and describe its failure, how you detect it and how you recover.",
    },
  ],
};
