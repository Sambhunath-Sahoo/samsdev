import type { LessonEntry } from "@/types/roadmap";

export const RETRIES_BACKOFF_AND_JITTER: LessonEntry = {
  track: "system-design",
  section: "Resilience patterns",
  subsection: {
    title: "Retries, backoff and jitter",
    slug: "retries-backoff-and-jitter",
    lesson: {
      summary: "Retry only what can succeed, spread attempts out with capped exponential backoff and jitter, and stop before retries make an outage worse.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What to retry and what not to" },
        { type: "p", text: "Retry **transient** failures: timeouts, connection resets, `429`, `502`, `503`, `504`. Do not retry `400`, `401`, `403`, `404` or `422`; the same request will fail the same way. Retry a non-idempotent call such as `POST /payments` only when an idempotency key makes a duplicate harmless. Every attempt needs its own timeout, and the whole operation needs a maximum attempt count or an overall deadline." },
        { type: "h2", text: "Retry amplification and retry budgets" },
        { type: "p", text: "Retries multiply across layers. If the client, the gateway and the service each retry 3 times, one user request can become 3 x 3 x 3 = 27 calls to a database that is already struggling. This is how a brief slowdown becomes a full outage." },
        { type: "list", items: [
          "Retry at **one layer** only, usually the one closest to the failing call, and let the others fail fast.",
          "Use a **retry budget**: allow retries only up to a share of recent traffic, for example 10 percent of requests. When the budget is spent, fail immediately.",
          "Honor `Retry-After` when the server sends it, and stop retrying if the server says the failure is permanent.",
          "Pair retries with a circuit breaker so you stop calling a dependency that is clearly down.",
        ] },
        { type: "h2", text: "Exponential backoff" },
        { type: "p", text: "Wait longer after each failure so a struggling dependency gets room to recover. The standard formula is `delay = min(cap, base * factor^attempt)`." },
        { type: "code", language: "python", title: "Capped backoff", code: `def delay(attempt, base=0.1, factor=2, cap=30):
    return min(cap, base * factor ** attempt)

# attempt 0..6 -> 0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4 seconds` },
        { type: "p", text: "Choosing the numbers: **base** is about the time a healthy call takes to recover, often 50 to 200 ms. **Factor** 2 is the usual default. **Cap** stops waits from growing absurd, typically 10 to 60 s. Then bound the total with a **deadline** that matches what the caller can bear: if a user is waiting, 2 to 5 seconds total means 2 or 3 retries; a background worker can keep going for minutes or hours." },
        { type: "h2", text: "Jitter and the thundering herd" },
        { type: "p", text: "Backoff alone has a flaw. If 10,000 clients all fail at the same instant, they all retry at 0.1 s, then all at 0.2 s, then 0.4 s. The load arrives in synchronized waves, each as large as the original spike. Adding randomness to each delay, **jitter**, spreads the retries over time." },
        {
          type: "table",
          head: ["Variant", "Formula", "Notes"],
          rows: [
            ["Full jitter", "random(0, min(cap, base * 2^n))", "Simple, spreads best, can pick near-zero waits"],
            ["Equal jitter", "half + random(0, half)", "Keeps a minimum wait, spreads less"],
            ["Decorrelated jitter", "min(cap, random(base, prev * 3))", "Each delay depends on the previous one, good under contention"],
          ],
        },
        { type: "p", text: "AWS's analysis of competing clients found full jitter and decorrelated jitter clearly better than no jitter in total work and completion time; use full jitter by default. Jitter is not only for retries: add it to cache expiry times (so thousands of keys do not expire at once), cron schedules, health-check intervals and reconnect timers after a deploy or an outage." },
        { type: "callout", tone: "gotcha", title: "The retry that fixes nothing", text: "Retrying on overload usually adds load. If a service returns 503 because it is saturated, a fleet of clients retrying faster than it recovers keeps it down. Combine backoff with a cap, jitter, a budget, and server-side load shedding, and never retry without a timeout on each attempt." },
        { type: "p", text: "Interview answer in one breath: retry only transient errors, at one layer, with capped exponential backoff and full jitter, a per-attempt timeout, an overall deadline, a retry budget, and idempotency keys on unsafe calls." },
      ],
      references: [
        { title: "Timeouts, retries and backoff with jitter - Amazon Builders' Library", url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" },
        { title: "Exponential Backoff And Jitter - AWS Architecture Blog", url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/" },
        { title: "Addressing Cascading Failures - Google SRE Book", url: "https://sre.google/sre-book/addressing-cascading-failures/" },
      ],
    },
  },
};
