import type { RoadmapSection } from "@/types/roadmap";

export const RESILIENCE_PATTERNS: RoadmapSection = {
  title: "Resilience patterns",
  goal: "Keep a system correct and responsive when calls fail, repeat, slow down or overload.",
  doneWhen: [
    "Design a retry policy with a cap, backoff, jitter and a retry budget, and say which errors it must never retry.",
    "Make a payment-style POST safe to repeat using an idempotency key and a unique constraint.",
    "Explain how a circuit breaker, a rate limiter and backpressure each protect a different part of the system.",
  ],
  subsections: [
    {
      title: "Idempotency",
      points: [
        {
          id: "sd.resilience.idempotent-operations",
          title: "Idempotent operations",
          detail:
            "An operation is idempotent when running it once or many times leaves the system in the same state. `PUT /users/7` with a full body and `DELETE /orders/9` are naturally idempotent; `POST /orders` and `balance += 10` are not. Networks lose responses, so a client cannot tell a lost request from a lost reply and must be able to resend safely.",
          question: "Why is `UPDATE accounts SET balance = 90` safe to retry but `SET balance = balance - 10` is not?",
        },
        {
          id: "sd.resilience.idempotency-keys",
          title: "Idempotency keys",
          detail:
            "The client generates a unique key (a UUID) per logical action and sends it in an `Idempotency-Key` header. The server stores the key with the result in a table with a unique constraint, inserts it before doing the work, and replays the saved response when the same key returns. Keys need an expiry, and a repeat key with a different body should be rejected as a client error.",
          question: "Two requests with the same key arrive at the same millisecond. How does the server make sure only one charges the card?",
        },
        {
          id: "sd.resilience.deduplicating-consumers",
          title: "Deduplicating consumers",
          detail:
            "Queues and webhooks usually deliver at least once, so a consumer sees duplicates. Record each message id in a processed-messages table inside the same transaction as the side effect, and skip ids already present. Where possible, make the effect itself idempotent, such as an upsert keyed on the business id.",
          question: "A consumer crashes after charging a customer but before acknowledging the message. What stops a double charge on redelivery?",
        },
      ],
    },
    {
      title: "Retries, backoff and jitter",
      points: [
        {
          id: "sd.resilience.what-to-retry",
          title: "What to retry and what not to",
          detail:
            "Retry transient failures: timeouts, connection resets, 429, 502, 503 and 504. Do not retry 400, 401, 403, 404 or 422 because the same request will fail again. Retry non-idempotent calls only when an idempotency key makes them safe, and always set a per-attempt timeout and a maximum attempt count.",
          question: "A call times out. Is it safe to retry a `POST /payments`? What do you need first?",
        },
        {
          id: "sd.resilience.retry-amplification-and-budgets",
          title: "Retry amplification and retry budgets",
          detail:
            "If each of 3 layers retries 3 times, one user request can become 27 calls to the bottom service just when it is struggling. Retry at one layer only, or use a retry budget such as allowing retries up to 10% of recent requests. Respect a `Retry-After` header when the server sends one.",
          question: "Your database is slow and the API, the gateway and the client SDK all retry 3 times. What happens, and how do you fix it?",
        },
        {
          id: "sd.resilience.exponential-backoff",
          title: "Exponential backoff",
          detail:
            "Wait longer after each failure: delay = min(cap, base * 2^attempt), for example 100 ms, 200 ms, 400 ms, 800 ms up to a cap of 30 s. This gives a struggling dependency room to recover instead of hammering it at a fixed rate. Always pair it with a cap and a maximum number of attempts or a total deadline.",
          question: "Why cap the backoff delay, and what bounds the total time a caller may spend retrying?",
        },
        {
          id: "sd.resilience.backoff-formulas",
          title: "Choosing base, factor and deadline",
          detail:
            "Pick a base near the dependency's normal latency, a factor of 2, a cap that fits the user's patience, and an overall deadline that is shorter than the caller's own timeout. A user-facing call may allow 2 retries within 1 s; a background job can wait minutes. Retrying past the caller's deadline only wastes capacity.",
          question: "Your API has a 2 s timeout for its callers. How do you set retry attempts and delays for an inner database call?",
        },
        {
          id: "sd.resilience.jitter-and-thundering-herd",
          title: "Jitter and the thundering herd",
          detail:
            "Without randomness, every client that failed at the same moment retries at the same moments, producing synchronized spikes. Jitter spreads them out. Full jitter picks a random delay between 0 and the backoff value: `sleep = random(0, min(cap, base * 2^attempt))`. It cuts total load and finishes competing clients faster than plain backoff.",
          question: "10,000 clients lose their connection when a server restarts. Why does plain exponential backoff still cause a spike?",
        },
        {
          id: "sd.resilience.jitter-variants",
          title: "Jitter variants and where else to use it",
          detail:
            "Equal jitter keeps half the backoff and randomizes the other half; decorrelated jitter picks a random delay between the base and three times the previous delay. Jitter is not only for retries: add it to cache expiry times and cron start times so that many keys do not expire, or many jobs do not start, in the same second.",
          question: "A million cache keys were all set with a 1 hour TTL at deploy time. What goes wrong at the hour mark and how do you prevent it?",
        },
      ],
    },
    {
      title: "Protecting dependencies and yourself",
      points: [
        {
          id: "sd.resilience.circuit-breaker-states",
          title: "Circuit breaker states",
          detail:
            "A circuit breaker wraps a remote call and counts failures. Closed lets calls through; after the failure rate crosses a threshold it moves to open and fails fast without calling the dependency; after a cool-down it goes half-open and lets a few probe calls through, closing again if they succeed. Failing fast frees threads and gives the dependency time to recover.",
          question: "Describe the three states of a circuit breaker and what moves it between them.",
        },
        {
          id: "sd.resilience.circuit-breaker-tuning",
          title: "Tuning thresholds and windows",
          detail:
            "Trip on a failure rate over a sliding window with a minimum request count, for example 50% failures across at least 20 calls in 30 s, so one failure at low traffic does not open it. Count timeouts and 5xx as failures, not 4xx. Keep one breaker per dependency, not one global breaker, so a single bad service does not cut off healthy ones.",
          question: "Why require a minimum number of calls in the window before the breaker can open?",
        },
        {
          id: "sd.resilience.fallbacks-and-bulkheads",
          title: "Fallbacks and bulkheads",
          detail:
            "When a breaker is open, return something useful: a cached value, a default or a degraded feature, instead of an error. A bulkhead limits concurrency per dependency (separate thread or connection pools), so one slow service cannot use every worker. Together they stop one failure from spreading across the whole system.",
          question: "The recommendations service is down. What should the product page show, and how do you keep it from slowing the whole page?",
        },
        {
          id: "sd.resilience.rate-limit-algorithms",
          title: "Rate limiting algorithms",
          detail:
            "A fixed window counts requests per minute but allows a double burst at the window edge. A sliding window log is exact but stores every timestamp. A sliding window counter weights the previous and current windows to approximate it cheaply. A token bucket refills at a steady rate and allows bursts up to the bucket size; a leaky bucket drains at a constant rate to smooth output.",
          question: "Compare token bucket and fixed window. Which allows bursts, and what is the fixed window edge problem?",
        },
        {
          id: "sd.resilience.distributed-rate-limiting",
          title: "Distributed rate limiting",
          detail:
            "With many app instances the counter must be shared, commonly in Redis using `INCR` plus `EXPIRE`, or a Lua script so the check and update are atomic. Choose the limit key deliberately: per user, API key, IP or route. Decide whether to fail open or fail closed when Redis is down; most public APIs fail open and log it.",
          question: "Three API servers each keep a local counter with a limit of 100 per minute. What is the real limit and how do you fix it?",
        },
        {
          id: "sd.resilience.rate-limit-responses",
          title: "Responding to limited clients",
          detail:
            "Return HTTP 429 with a `Retry-After` header and, if useful, headers showing the limit and remaining quota. Limit by tier (free vs paid) and put a stricter limit on expensive or abusive endpoints such as login. Rate limiting protects you from abuse and accidents; it is not a replacement for load shedding.",
          question: "How should a well-behaved client react to a 429, and what should your login endpoint limit on?",
        },
        {
          id: "sd.resilience.backpressure-basics",
          title: "Backpressure basics",
          detail:
            "Backpressure is a slow consumer signaling a fast producer to slow down, instead of letting buffers grow without bound until memory runs out. Use bounded queues, blocking or rejecting when full, and reactive-streams style demand signals. An unbounded queue does not remove overload; it only turns it into rising latency and then a crash.",
          question: "Why is an unbounded in-memory queue between a fast producer and a slow consumer dangerous?",
        },
        {
          id: "sd.resilience.load-shedding",
          title: "Load shedding and queue limits",
          detail:
            "When demand exceeds capacity, reject some work early and cheaply so the rest succeeds: return 503 for low-priority requests, drop the oldest queued items whose callers already timed out, or cap queue depth. Reject at the edge before spending database time. Scale on queue depth or age, but accept that autoscaling takes minutes while overload arrives in seconds.",
          question: "Traffic is 3x capacity for ten minutes. What do you drop first, and how do you keep the system from collapsing?",
        },
      ],
    },
    {
      title: "Running safely: shutdown, health and tracing",
      points: [
        {
          id: "sd.resilience.graceful-shutdown-sequence",
          title: "Graceful shutdown sequence",
          detail:
            "On `SIGTERM` the process stops accepting new work, finishes in-flight requests and jobs within a deadline, closes database and queue connections, then exits. Behind a load balancer, fail the readiness check first and wait a few seconds so the balancer stops sending traffic. Kubernetes sends `SIGKILL` after `terminationGracePeriodSeconds`, so the drain must fit inside it.",
          question: "Walk through what a Node server should do between receiving SIGTERM and exiting.",
        },
        {
          id: "sd.resilience.shutdown-for-workers",
          title: "Shutdown for workers and long jobs",
          detail:
            "A queue worker should stop pulling new messages, then either finish the current one or return it unacknowledged so another worker picks it up. Jobs longer than the grace period need checkpoints or a visibility timeout that lets the job be safely re-run. This is why handlers should be idempotent: a forced kill will cause a redelivery.",
          question: "A worker is killed halfway through a 5 minute job. What state is the job in and what must be true for a safe rerun?",
        },
        {
          id: "sd.resilience.liveness-readiness-startup",
          title: "Liveness, readiness and startup probes",
          detail:
            "Liveness answers whether the process is stuck and should be restarted; it must not check dependencies, or a database outage restarts every pod. Readiness answers whether this instance should receive traffic right now; it may check dependencies. A startup probe gives slow-starting apps time before the other two begin.",
          question: "Why should a liveness check not call the database?",
        },
        {
          id: "sd.resilience.deep-health-checks",
          title: "Deep health checks and cascading failures",
          detail:
            "A shallow check returns 200 if the process runs; a deep check verifies critical dependencies. Deep checks run on every probe from many instances, so cache their result for a few seconds and use timeouts. A readiness check that fails on a shared dependency can pull all instances out at once, so decide carefully which dependencies are truly required to serve.",
          question: "Your readiness check queries Redis, and Redis has a 30 second blip. What happens to the fleet, and how would you design it better?",
        },
        {
          id: "sd.resilience.traces-spans-context",
          title: "Traces, spans and context propagation",
          detail:
            "A trace is the full path of one request; a span is one timed step inside it, such as an HTTP call or a SQL query. A trace id is created at the edge and passed on every hop in a header, for example the W3C `traceparent` header, and attached to log lines. OpenTelemetry is the common vendor-neutral way to produce this data.",
          question: "A request spans five services and is slow. How does a trace show you which one to fix?",
        },
        {
          id: "sd.resilience.tracing-sampling-and-queues",
          title: "Sampling and tracing async work",
          detail:
            "Storing every trace is costly, so systems sample: head sampling decides at the start (say 1%), tail sampling keeps traces after seeing them so errors and slow requests are always kept. Across queues, put the trace context in message headers so the consumer span links back to the producer. Without that propagation, traces break at every async boundary.",
          question: "Why might head sampling at 1% miss the exact slow requests you want to investigate, and what is the alternative?",
        },
      ],
    },
  ],
};
