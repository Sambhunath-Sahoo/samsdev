import type { LessonEntry } from "@/types/roadmap";

export const PROTECTING_DEPENDENCIES_AND_YOURSELF: LessonEntry = {
  track: "system-design",
  section: "Resilience patterns",
  subsection: {
    title: "Protecting dependencies and yourself",
    slug: "protecting-dependencies-and-yourself",
    lesson: {
      summary: "Circuit breakers and bulkheads protect you from slow dependencies; rate limits, backpressure and load shedding protect you from your callers.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Circuit breakers: stop calling what is broken" },
        { type: "p", text: "A slow dependency is worse than a dead one: threads and connections pile up waiting, and the caller fails too. A circuit breaker watches calls to a dependency and fails fast when it looks unhealthy. It has three states." },
        { type: "list", items: [
          "**Closed**: calls flow normally; failures and slow calls are counted over a window.",
          "**Open**: the failure rate crossed the threshold, so calls fail immediately (or use a fallback) for a cool-down such as 30 s.",
          "**Half-open**: after the cool-down, a few trial calls go through. Success closes the circuit; failure reopens it.",
        ] },
        { type: "p", text: "Tuning: use a rolling window (for example the last 20 seconds or 100 calls) and a failure-rate threshold such as 50 percent, with a **minimum call volume** so two failures out of three calls do not trip it. Count slow calls as failures, since latency is how most outages start. Keep one breaker per dependency, not one for the whole service." },
        { type: "h2", text: "Fallbacks and bulkheads" },
        { type: "p", text: "When the circuit is open, return something useful: cached data, a default, a degraded feature (hide recommendations, still show the product). Pick fallbacks that are safe; a stale price on a checkout page is not." },
        { type: "p", text: "A **bulkhead** isolates resources so one slow dependency cannot use them all: a separate thread pool, connection pool or semaphore per dependency, like watertight compartments in a ship. If the reviews service hangs, only its 10 reserved workers block, and the other 90 keep serving." },
        { type: "h2", text: "Rate limiting algorithms" },
        { type: "p", text: "Rate limiting protects you from callers: one noisy client, a bug in a loop, or abuse. Common algorithms:" },
        {
          type: "table",
          head: ["Algorithm", "Idea", "Trade-off"],
          rows: [
            ["Fixed window", "Count per minute, reset on the boundary", "Simple, but allows 2x the limit across a boundary"],
            ["Sliding window log", "Keep timestamps of recent requests", "Accurate, memory heavy"],
            ["Sliding window counter", "Weight the previous and current window", "Cheap, approximate"],
            ["Token bucket", "Bucket refills at rate r, holds up to burst b", "Allows bursts, common default"],
            ["Leaky bucket", "Queue drains at a fixed rate", "Smooths output, adds delay"],
          ],
        },
        { type: "p", text: "**Distributed rate limiting**: with many app servers, per-server counters let a client exceed the limit by the number of servers. The usual fix is a shared counter in Redis, updated atomically with a Lua script or `INCR` plus `EXPIRE`. It adds a network hop per request; reduce it by syncing local counters in batches and accepting slight overshoot, and decide whether to fail open or closed if Redis is down." },
        { type: "code", language: "text", title: "Telling a limited client what to do", code: `HTTP/1.1 429 Too Many Requests
Retry-After: 12
RateLimit-Limit: 100
RateLimit-Remaining: 0
# limit per API key or user, not just IP; return 429, never 500` },
        { type: "h2", text: "Backpressure and load shedding" },
        { type: "p", text: "**Backpressure** pushes slowness upstream instead of buffering without limit: bounded queues, blocking producers, a limited number of in-flight requests, TCP-style windows, or a `429` or `503` returned to the caller. Unbounded queues hide overload until memory runs out and every request waits minutes." },
        { type: "p", text: "**Load shedding** is deliberately rejecting some work to keep the rest healthy. Cap concurrency and queue length (for example 200 in flight, 50 queued), drop requests that have already waited longer than their deadline, and shed lowest-priority traffic first, such as analytics before checkout. Rejecting 20 percent quickly beats timing out 100 percent slowly." },
        { type: "callout", tone: "gotcha", title: "Queues hide overload", text: "A queue that is allowed to grow turns a 5-second spike into a 10-minute delay that no one asked for, and processes requests whose callers have long since gone. Bound the queue, put a deadline on every request and reject early with a clear error." },
        { type: "p", text: "Remember who protects whom: the circuit breaker and bulkhead protect you from what you call; the rate limiter, backpressure and load shedding protect you from who calls you." },
      ],
      references: [
        { title: "Circuit Breaker - Martin Fowler", url: "https://martinfowler.com/bliki/CircuitBreaker.html" },
        { title: "Circuit Breaker pattern - Azure Architecture Center", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker" },
        { title: "Scaling your API with rate limiters - Stripe", url: "https://stripe.com/blog/rate-limiters" },
        { title: "Using load shedding to avoid overload - Amazon Builders' Library", url: "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/" },
        { title: "Handling Overload - Google SRE Book", url: "https://sre.google/sre-book/handling-overload/" },
      ],
    },
  },
};
