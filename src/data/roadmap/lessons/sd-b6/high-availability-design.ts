import type { LessonEntry } from "@/types/roadmap";

export const HIGH_AVAILABILITY_DESIGN: LessonEntry = {
  track: "system-design",
  section: "Reliability and observability",
  subsection: {
    title: "High availability design",
    slug: "high-availability-design",
    lesson: {
      summary: "Calculate what availability your components give you together, then design out single points of failure at every layer.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What high availability means" },
        { type: "p", text: "Availability is the share of time, or of requests, in which the service works. High availability (HA) means designing so that individual failures do not become user-visible outages. It is usually stated in nines, and each nine is ten times less downtime." },
        {
          type: "table",
          head: ["Availability", "Downtime per year", "Downtime per month"],
          rows: [
            ["99%", "3.65 days", "7.2 hours"],
            ["99.9%", "8.76 hours", "43 minutes"],
            ["99.99%", "52.6 minutes", "4.3 minutes"],
            ["99.999%", "5.26 minutes", "26 seconds"],
          ],
        },
        { type: "h2", text: "Combining components: the maths" },
        { type: "p", text: "Components in a chain multiply. If a request must pass through a load balancer (99.99%), an app tier (99.9%) and a database (99.9%), the system is at most 0.9999 x 0.999 x 0.999, about 99.79%, which is roughly 18 hours of downtime a year. Every hard dependency lowers the total." },
        { type: "p", text: "Parallel copies work the other way. Two independent instances, each 99.9% available, fail together only if both are down: 1 - (0.001 x 0.001) = 99.9999%. This is the case for redundancy, with one big caveat. The figure assumes failures are independent and that failover works. Shared causes, such as a bad config push, an expired certificate or one overloaded dependency, break the assumption, and real availability is lower." },
        { type: "h2", text: "Layer by layer" },
        {
          type: "list",
          items: [
            "**DNS and edge:** use a reliable provider with several name servers, and a CDN to absorb traffic and serve cached content even if your origin is struggling.",
            "**Load balancers:** run at least two across zones, with health checks that remove bad targets within seconds.",
            "**App tier:** stateless instances across at least two, better three, availability zones in an auto-scaling group. With three zones at equal load, losing one leaves 67% of capacity, so size each zone to carry the extra third.",
            "**Data tier:** a primary with synchronous or near-synchronous replicas in another zone, automated promotion, and tested backups. Stateful systems are where most HA effort goes.",
            "**Dependencies:** timeouts, retries with backoff and jitter, circuit breakers and fallbacks, so a slow third party does not take you down.",
          ],
        },
        { type: "h2", text: "A concrete design" },
        {
          type: "code",
          language: "text",
          title: "Three-zone web service",
          code: `Users -> DNS -> CDN -> Load balancer (zones A, B, C)
                           |-> app x2 in zone A
                           |-> app x2 in zone B
                           |-> app x2 in zone C   (any zone can vanish)
Database: primary in A, sync replica in B, async replica in C
Failure of zone A: LB drops A's targets in ~10-30 s,
                   replica in B promoted in ~1-2 min`,
        },
        { type: "p", text: "Writes pause while the replica is promoted, so this design offers brief write unavailability with reads recovering sooner. Say that explicitly. Whether it is acceptable depends on the SLO." },
        { type: "h2", text: "Practices beyond hardware" },
        {
          type: "list",
          items: [
            "**Safe deploys:** canary or blue-green releases with automatic rollback. Many outages are caused by our own changes.",
            "**Graceful degradation:** if recommendations fail, show the page without them, and do not return an error.",
            "**Load shedding and rate limits:** reject some traffic early to keep serving the rest, instead of collapsing under overload.",
            "**Capacity headroom:** plan for the loss of one zone and for peak traffic, not average traffic.",
            "**Chaos testing:** kill instances and zones on purpose, in a controlled way, to prove failover works.",
          ],
        },
        { type: "callout", tone: "cost", title: "Each nine costs more than the last", text: "Going from 99.9% to 99.99% can mean a second region, a more complex data layer, 24x7 on-call and slower feature work. Tie the target to a real business loss, and say in the interview that you would not build five nines for an internal tool." },
        { type: "p", text: "Common mistakes: counting redundant servers while ignoring a shared database or a single load balancer, leaving failover untested, and forgetting the capacity maths so that the surviving nodes are overloaded the moment one fails." },
      ],
      references: [
        { title: "Reliability pillar (AWS Well-Architected Framework)", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" },
        { title: "Reliability design principles (Azure Well-Architected Framework)", url: "https://learn.microsoft.com/en-us/azure/well-architected/reliability/" },
        { title: "Service Level Objectives (Google SRE Book)", url: "https://sre.google/sre-book/service-level-objectives/" },
      ],
    },
  },
};
