import type { LessonEntry } from "@/types/roadmap";

export const SCALING_BASICS: LessonEntry = {
  track: "system-design",
  section: "Foundations",
  subsection: {
    title: "Scaling basics",
    slug: "scaling-basics",
    lesson: {
      summary: "Scaling means handling more load without the system falling over; the skill is knowing which part to scale and what stops you.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Vertical versus horizontal scaling" },
        { type: "p", text: "**Vertical scaling** (scale up) means a bigger machine: more CPU, RAM, faster disk. It needs no code change and no new failure modes, which is why it is the right first move. Its limits are a hard ceiling, a price that climbs faster than capacity, and a single point of failure: one box, one outage." },
        { type: "p", text: "**Horizontal scaling** (scale out) means more machines behind a load balancer. There is no practical ceiling and losing one node costs you only a fraction of capacity. The price is complexity: requests must be spread, state must live somewhere shared, and you now have a distributed system with partial failures." },
        {
          type: "table",
          head: ["", "Vertical", "Horizontal"],
          rows: [
            ["Effort", "Resize the instance", "Load balancer, shared state, deploy tooling"],
            ["Ceiling", "Largest machine you can rent", "Mostly your budget and your data layer"],
            ["Failure", "Whole service is down", "Capacity drops by 1/N"],
            ["Downtime to scale", "Often a restart", "None, add nodes live"],
          ],
        },
        { type: "h2", text: "Stateless versus stateful" },
        { type: "p", text: "A service is **stateless** when any instance can serve any request because nothing needed for the next request is kept in that instance's memory or disk. Those services scale out trivially: add instances, let the load balancer round-robin. Sessions go to Redis or into a signed token, uploads go to object storage, and the truth lives in a database." },
        { type: "p", text: "Stateful pieces (databases, caches, queues) cannot just be cloned, because each copy must agree on the data. They scale by **replication** (copies for reads and failover), **partitioning** (each node owns a slice of the keys), or both. Push state down to as few components as possible and let the rest be stateless." },
        { type: "code", language: "text", title: "Moving state out of the app tier", code: `Before:  client -> app (session in local memory)    # sticky routing, lost on restart
After:   client -> LB -> any app -> Redis (session)   # app instances are interchangeable
                                 -> Postgres (data)
                                 -> S3 (files)` },
        { type: "h2", text: "Finding the bottleneck" },
        { type: "p", text: "Adding servers only helps if the thing you add is the thing that is saturated. Measure first: CPU, memory, disk IO, network, connection counts, queue depth, and per-request time split between app code and each downstream call. The bottleneck is usually the first resource to hit its limit, and fixing it moves the problem to the next one." },
        { type: "list", items: ["App CPU pegged: add instances or optimise the hot path.", "App fine, database CPU or connections maxed: add read replicas, cache, fix queries and indexes.", "Database writes are the limit: batch, queue, or partition. More app servers make it worse.", "Latency high but nothing busy: look for a slow downstream call, lock contention, or a small thread or connection pool."] },
        { type: "p", text: "A concrete case: an API at 200 requests per second on two app servers falls over at 300. Profiling shows each request makes 4 database queries and the primary database sits at 95% CPU. Doubling app servers to four will not raise throughput, it will just queue more work against the database. Caching the two hottest queries cuts database load by half and buys the headroom." },
        { type: "callout", tone: "gotcha", title: "Scaling the wrong tier", text: "In interviews, saying 'add more servers' without naming what is saturated is the classic miss. Name the resource, the number that tells you it is full, and the fix that matches it. Also remember that every app instance holds its own database connections, so scaling out can exhaust the database's connection limit before it helps." },
        { type: "p", text: "A practical order of operations: measure, fix the obvious inefficiency, scale up if cheap, make the tier stateless, scale out, then cache and replicate the data layer, and partition only when a single primary cannot keep up with writes or storage." },
      ],
      references: [
        { title: "Scalability (Wikipedia)", url: "https://en.wikipedia.org/wiki/Scalability" },
        { title: "The Twelve-Factor App: VI. Processes", url: "https://12factor.net/processes" },
        { title: "Google SRE Book: Addressing Cascading Failures", url: "https://sre.google/sre-book/addressing-cascading-failures/" },
      ],
    },
  },
};
