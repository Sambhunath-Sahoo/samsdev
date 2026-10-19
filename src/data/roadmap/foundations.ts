import type { RoadmapSection } from "@/types/roadmap";

export const FOUNDATIONS: RoadmapSection = {
  title: "Foundations",
  goal: "The vocabulary and arithmetic every design starts from.",
  doneWhen: [
    "Estimate QPS, storage and bandwidth for a prompt in under 5 minutes.",
    "Explain p99 and the nines without notes.",
    "Name the likely bottleneck of a read-heavy and a write-heavy system.",
  ],
  subsections: [
    {
      title: "Scaling basics",
      points: [
        {
          id: "sd.foundations.vertical-vs-horizontal",
          title: "Vertical vs horizontal scaling",
          detail:
            "Vertical scaling means a bigger machine: simple, no code change, but it has a hardware ceiling and stays a single point of failure. Horizontal scaling means more machines behind a load balancer: it needs stateless services but adds capacity and redundancy together. A safe default answer: scale up while it is cheap, and design so you can scale out.",
          question: "Your API is at 80% CPU on one instance. What do you check before adding instances?",
        },
        {
          id: "sd.foundations.stateless-vs-stateful",
          title: "Stateless vs stateful services",
          detail:
            "A stateless service keeps nothing between requests, so any instance can serve any request and instances can be added or killed freely. Session data, uploads and counters move to Redis, a database or object storage. State does not disappear; you choose where it lives and how it is replicated.",
          question: "Where would you store a login session so three app instances share it?",
        },
        {
          id: "sd.foundations.finding-the-bottleneck",
          title: "Finding the bottleneck",
          detail:
            "Measure before scaling. Look at CPU, memory, disk I/O, network and database connections. Most web systems hit the database first, which is why caching, indexes and read replicas usually come before more app servers.",
          question: "Latency doubled but CPU is at 20%. Name three places to look.",
        },
      ],
    },
    {
      title: "Performance and availability metrics",
      points: [
        {
          id: "sd.foundations.latency-vs-throughput",
          title: "Latency vs throughput",
          detail:
            "Latency is the time one request takes. Throughput is how many requests finish per second. Batching raises throughput and also raises latency. Near saturation, queues build and latency climbs steeply even when throughput looks flat.",
          question: "Why can a bigger batch size raise throughput and hurt latency?",
        },
        {
          id: "sd.foundations.percentiles-and-tail-latency",
          title: "Percentiles and tail latency",
          detail:
            "p50 is the typical request; p99 is the slowest 1 in 100. Averages hide the tail. A page that calls many backends waits for the slowest of them, so a small per-service tail becomes a common user-visible delay.",
          question: "A service has a 200 ms average and a 3 s p99. Is it healthy? What do you ask next?",
        },
        {
          id: "sd.foundations.availability-and-the-nines",
          title: "Availability and the nines",
          detail:
            "99.9% allows about 8.8 hours of downtime a year, 99.99% about 53 minutes, 99.999% about 5 minutes. Components in series multiply their availabilities, so two 99.9% services in a chain give about 99.8%. Redundant components in parallel raise availability.",
          question: "A request passes through 5 services at 99.9% each. What is the end-to-end availability?",
        },
        {
          id: "sd.foundations.sli-slo-sla",
          title: "SLI, SLO and SLA",
          detail:
            "An SLI is a measurement, for example the share of requests under 300 ms. An SLO is the target for it, for example 99% under 300 ms over 30 days. An SLA is a contract with consequences if you miss. The gap between 100% and the SLO is the error budget.",
          question: "Give an SLI and an SLO for a RAG search endpoint.",
        },
      ],
    },
    {
      title: "Back-of-envelope estimation",
      points: [
        {
          id: "sd.foundations.numbers-to-memorize",
          title: "Numbers to memorize",
          detail:
            "2^10 is about a thousand, 2^20 a million, 2^30 a billion. A day has 86,400 seconds, which you round to 10^5. Round aggressively: the goal is the right order of magnitude, not the exact figure.",
          question: "Roughly how many seconds are in a month?",
        },
        {
          id: "sd.foundations.traffic-qps",
          title: "Traffic: QPS",
          detail:
            "Average QPS is requests per day divided by 86,400. Peak is often 2 to 3 times average; say that out loud as an assumption. Example: 100M users making 10 requests a day is 1 billion requests, about 11,600 QPS on average.",
          question: "Estimate QPS for a URL shortener with 100M new URLs a month and a 100 to 1 read to write ratio.",
        },
        {
          id: "sd.foundations.storage-and-bandwidth",
          title: "Storage and bandwidth",
          detail:
            "Storage = records per day x bytes per record x days kept x replication factor. Example: 100M records a day at 500 bytes is 50 GB a day, about 18 TB a year, about 55 TB with three replicas. Bandwidth = QPS x payload size: 11,600 QPS at 10 KB is about 116 MB/s.",
          question: "How much storage for 5 years of that URL shortener at 500 bytes per URL with 3 replicas?",
        },
        {
          id: "sd.foundations.latency-numbers-to-know",
          title: "Latency numbers to know",
          detail:
            "Rough orders of magnitude: memory read about 100 ns, SSD random read about 100 microseconds, round trip inside a data centre about 0.5 ms, disk seek about 10 ms, cross-region round trip 50 to 150 ms. They explain why caches help and why cross-region calls hurt.",
          question: "Why is one cross-region call per request a problem for a 100 ms budget?",
        },
      ],
    },
    {
      title: "Trade-off thinking",
      points: [
        {
          id: "sd.foundations.read-heavy-vs-write-heavy",
          title: "Read-heavy vs write-heavy",
          detail:
            "Classify the workload first. Read-heavy systems lean on caching and read replicas. Write-heavy systems lean on sharding, queues and append-friendly storage. Most prompts state or imply the ratio; ask if they do not.",
          question: "Is a timeline feed read-heavy or write-heavy? What follows from that?",
        },
        {
          id: "sd.foundations.consistency-vs-availability-preview",
          title: "Consistency vs availability (preview)",
          detail:
            "When the network splits, a system must choose between answering with possibly stale data or refusing to answer. You only need the idea here; CAP, PACELC and consistency models come in the distributed systems section.",
          question: "Would a bank balance or a likes counter tolerate stale reads? Why?",
        },
        {
          id: "sd.foundations.cost-performance-complexity",
          title: "Cost, performance and complexity",
          detail:
            "Every component you add should be justified by a number from your estimate. Prefer the simplest design that meets the requirements, and say what you would add at 10 times the load.",
          question: "Name one component you would skip at 1,000 QPS and one you would add at 100,000 QPS.",
        },
        {
          id: "sd.foundations.stating-a-trade-off",
          title: "Stating a trade-off",
          detail:
            "Use one sentence shape: option A gives X and costs Y; given requirement Z, I choose A. Interviewers score the reasoning, so say the cost out loud.",
          question: "State the SQL vs NoSQL trade-off for an order-history table in that shape.",
        },
      ],
    },
  ],
};
