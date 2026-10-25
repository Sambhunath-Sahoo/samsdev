import type { LessonEntry } from "@/types/roadmap";

export const DISTRIBUTED_MONITORING_ERROR_TRACKING: LessonEntry = {
  track: "system-design",
  section: "Reliability and observability",
  subsection: {
    title: "Distributed monitoring and error tracking",
    slug: "distributed-monitoring-error-tracking",
    lesson: {
      summary: "Follow one request across many services with traces, group crashes into issues, and watch the system from the outside as well as the inside.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why one service's view is not enough" },
        { type: "p", text: "In a monolith, a slow request has one process to inspect. With ten services, a user clicks Checkout and the call fans out through a gateway, an order service, inventory, payments and a notification queue. Each service has its own dashboard and logs, and each can look healthy while the user still waits four seconds. Distributed monitoring connects those views." },
        { type: "h2", text: "Distributed tracing" },
        { type: "p", text: "A trace is the full story of one request. It is made of spans, each a timed operation (an HTTP call, a SQL query) with a parent span. The first service creates a trace id and passes it on in a request header. Every later service reads it, starts its own spans under it, and forwards it again. This is context propagation, and the W3C standard header for it is `traceparent`." },
        {
          type: "code",
          language: "text",
          title: "One trace as a waterfall (total 820 ms)",
          code: `GET /checkout                  [0 ........................... 820 ms]
  auth.verify                  [5 - 20 ms]
  orders.create                [25 ..................... 790 ms]
    db.insert orders           [30 - 60 ms]
    inventory.reserve          [65 - 110 ms]
    payments.charge            [115 .................. 780 ms]   <- the problem
      payments -> bank API     [120 .................. 775 ms]`,
        },
        { type: "p", text: "The waterfall shows at a glance that about 650 ms of an 820 ms request sits in one downstream call. Google's internal tracer Dapper set the pattern that Zipkin, Jaeger and OpenTelemetry follow. OpenTelemetry is now the common vendor-neutral standard for producing traces, metrics and logs." },
        { type: "p", text: "Tracing every request is expensive at scale, so systems sample. **Head sampling** decides at the start (keep 1% of traces), which is cheap but may miss rare failures. **Tail sampling** decides after the trace finishes, keeping all errors and slow ones, but needs a collector that buffers whole traces." },
        { type: "h2", text: "Error tracking" },
        { type: "p", text: "Logs hold every error, but nobody reads 50,000 stack traces. Error trackers such as Sentry catch exceptions in the app, attach context (release version, user id, request, breadcrumbs of recent events), and group similar ones into a single issue by fingerprinting the stack trace. You see \"TypeError in cart.ts, 4,812 events, first seen in release 2.31, 380 users\" instead of a wall of text." },
        {
          type: "list",
          items: [
            "**Release tracking:** tag errors with the deployed version so a new issue after a deploy points at the change.",
            "**Source maps and symbols:** minified frontend code is unreadable without them, so upload them at build time.",
            "**Ownership and routing:** assign issues to teams by path or service, so alerts reach the people who can fix them.",
            "**Alert rules:** page on a new issue or on a spike in a known one, not on every event.",
          ],
        },
        { type: "h2", text: "Watching from outside" },
        { type: "p", text: "Internal metrics can say everything is fine while users cannot reach you, because DNS, a certificate or a CDN is broken. Add **synthetic monitoring**: a probe from several regions that loads the site or runs a login and checkout flow every minute. Pair it with **real user monitoring**, where the browser reports actual load times and failed requests. Probes find outages with little traffic, real user data shows what people experience." },
        { type: "table", head: ["Tool", "Answers", "Weak at"], rows: [
          ["Metrics and alerts", "Is something wrong, how bad", "Which request and why"],
          ["Distributed traces", "Where in the call chain the time or error is", "Aggregate trends; unsampled requests"],
          ["Error tracker", "Which exceptions, how many users, which release", "Slowness with no exception"],
          ["Synthetic probes", "Is it reachable and working from outside", "Problems on paths the probe does not exercise"],
        ] },
        { type: "callout", tone: "gotcha", title: "Broken propagation splits one trace into many", text: "If any hop drops the trace header, for example a message queue consumer or a hand-rolled HTTP client, the trace breaks into unrelated fragments. For queues, copy the trace context into message headers. Check early that a request produces one connected trace end to end." },
        { type: "p", text: "In an interview, describe the debugging path: an alert from metrics, a trace to find the slow or failing service, logs from that span by trace id, and an error tracker entry linked to the release. Add that you would sample traces and keep every error trace." },
      ],
      references: [
        { title: "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure (Google Research)", url: "https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/" },
        { title: "Traces (OpenTelemetry)", url: "https://opentelemetry.io/docs/concepts/signals/traces/" },
        { title: "Issues (Sentry Docs)", url: "https://docs.sentry.io/product/issues/" },
      ],
    },
    points: [
      { id: "sd.distributed-monitoring-error-tracking.trace-propagation", title: "Traces and context propagation", detail: "A trace is a tree of timed spans linked by a trace id that every service forwards in a header such as traceparent. A single dropped header, often at a queue, splits the trace.", question: "How do you keep one trace connected across an HTTP call followed by a Kafka message?" },
      { id: "sd.distributed-monitoring-error-tracking.sampling", title: "Head and tail sampling", detail: "Head sampling keeps a fixed fraction chosen at the start of a request, which is cheap but can miss rare failures. Tail sampling decides after the trace completes so it can keep every error and slow trace, at the price of buffering.", question: "You sample 1% of traces and a rare bug hits 0.1% of requests. What do you change?" },
      { id: "sd.distributed-monitoring-error-tracking.error-grouping", title: "Error grouping and release tracking", detail: "Error trackers fingerprint stack traces to merge thousands of events into one issue with a count, affected users and first-seen release. Tagging each error with the deployed version links regressions to a specific deploy.", question: "What context should an error report carry so an engineer can reproduce it?" },
      { id: "sd.distributed-monitoring-error-tracking.synthetic-probes", title: "Synthetic probes and real user monitoring", detail: "Probes from outside run key user flows on a schedule and catch DNS, certificate and CDN failures that internal metrics miss. Real user monitoring shows what real browsers experience.", question: "Why can all internal dashboards be green during a real outage?" },
    ],
  },
};
