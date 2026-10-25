import type { LessonEntry } from "@/types/roadmap";

export const PERFORMANCE_AND_AVAILABILITY_METRICS: LessonEntry = {
  track: "system-design",
  section: "Foundations",
  subsection: {
    title: "Performance and availability metrics",
    slug: "performance-and-availability-metrics",
    lesson: {
      summary: "Latency, throughput, percentiles, the nines and SLOs are the numbers you use to say whether a system is good enough.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Latency versus throughput" },
        { type: "p", text: "**Latency** is how long one request takes. **Throughput** is how many requests the system completes per unit of time. They are related but not the same: a highway with a 100 km/h limit and ten lanes has the same trip time as one lane, yet carries ten times the cars. You can often raise throughput by adding parallelism without lowering latency, while batching typically raises throughput and worsens latency." },
        { type: "p", text: "Near saturation the two collide. When a server is at 90% utilisation, queues form and latency climbs sharply, so you size for headroom, not for 100%." },
        { type: "h2", text: "Percentiles and tail latency" },
        { type: "p", text: "An average hides the slow requests that users actually complain about. Use percentiles: p50 is the median, p99 means 99% of requests were faster than this. Say 1,000 requests: 990 take 50 ms and 10 take 2 seconds. The mean is about 70 ms and looks healthy, while p99 is 2 s." },
        { type: "p", text: "Tails matter more than they seem because of fan-out. If a page needs 100 backend calls and each call has a 1% chance of being slow, about 63% of page loads hit at least one slow call (1 - 0.99^100). The more services in a request path, the more your p99 becomes the typical experience." },
        { type: "list", items: ["Measure per endpoint, not one global number.", "Keep histograms; you cannot average percentiles across instances, you must merge the raw buckets.", "Track p50, p95 and p99 together; p99.9 for critical paths."] },
        { type: "h2", text: "Availability and the nines" },
        { type: "p", text: "Availability is the fraction of time the service works: uptime divided by total time. It is quoted in nines, and each extra nine cuts the allowed downtime by a factor of ten." },
        {
          type: "table",
          head: ["Availability", "Downtime per year", "Downtime per 30 days"],
          rows: [["99%", "3.65 days", "7.2 hours"], ["99.9%", "8.76 hours", "43 minutes"], ["99.99%", "52.6 minutes", "4.3 minutes"], ["99.999%", "5.26 minutes", "26 seconds"]],
        },
        { type: "p", text: "Serial dependencies multiply. Three components in a chain at 99.9% each give roughly 99.7% together. Redundancy fixes that: two independent replicas each at 99% give 1 - 0.01^2 = 99.99%, provided failures really are independent." },
        { type: "h2", text: "SLI, SLO and SLA" },
        { type: "list", items: ["**SLI** (indicator): a measured number, such as the fraction of requests that succeed in under 300 ms.", "**SLO** (objective): the target for that number, such as 99.9% over 30 days. An internal goal.", "**SLA** (agreement): a contract with consequences, usually refunds, set looser than the SLO."] },
        { type: "p", text: "The gap between 100% and the SLO is the **error budget**. A 99.9% monthly SLO allows about 43 minutes of failure. If you have burned the budget, you freeze risky releases; if you have plenty left, you can ship faster." },
        { type: "code", language: "text", title: "An SLO written down", code: `SLI: good = HTTP status < 500 AND latency < 300 ms, valid = all requests excluding health checks
SLO: good / valid >= 99.9% over a rolling 30 days
Alert: error budget burn rate > 10x for 5 minutes` },
        { type: "callout", tone: "gotcha", title: "Chasing the next nine", text: "Each nine costs far more than the previous one and is bounded by your dependencies: you cannot be more available than the cloud services you rely on without redundancy across them. Ask what the business loses per hour of downtime before promising 99.99%." },
      ],
      references: [
        { title: "Google SRE Book: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/" },
        { title: "Google SRE Workbook: Implementing SLOs", url: "https://sre.google/workbook/implementing-slos/" },
        { title: "The Tail at Scale (Google Research)", url: "https://research.google/pubs/the-tail-at-scale/" },
        { title: "High availability (Wikipedia)", url: "https://en.wikipedia.org/wiki/High_availability" },
      ],
    },
  },
};
