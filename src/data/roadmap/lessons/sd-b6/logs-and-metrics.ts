import type { LessonEntry } from "@/types/roadmap";

export const LOGS_AND_METRICS: LessonEntry = {
  track: "system-design",
  section: "Reliability and observability",
  subsection: {
    title: "Logs and metrics",
    slug: "logs-and-metrics",
    lesson: {
      summary: "Metrics say something is wrong, traces say where, logs say why, and percentiles plus saturation tell you which numbers to watch.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Logs, metrics and traces" },
        { type: "p", text: "These are the three signals of observability, the ability to understand a system from the outside. Each answers a different question and has a different cost." },
        {
          type: "table",
          head: ["Signal", "What it is", "Best for", "Cost driver"],
          rows: [
            ["Logs", "Timestamped records of discrete events", "Why one request failed; exact error text and inputs", "Volume: every event is stored"],
            ["Metrics", "Numbers aggregated over time", "Dashboards, alerts, trends, capacity", "Cardinality: number of label combinations"],
            ["Traces", "One request followed across services as timed spans", "Where the time went in a call chain", "Volume, so usually sampled"],
          ],
        },
        { type: "p", text: "In practice you move between them. An alert fires on a metric (p99 latency doubled), a trace shows that the slow span is the payments call, and the logs for that span show a connection timeout. This only works if the three can be joined, so put one request or trace id in every log line." },
        {
          type: "code",
          language: "json",
          title: "A structured log line",
          code: `{"ts":"2026-03-02T10:14:07.221Z","level":"error","service":"checkout",
 "trace_id":"4bf92f3577b34da6","route":"POST /orders","status":502,
 "upstream":"payments","duration_ms":3012,"msg":"upstream timeout"}`,
        },
        { type: "p", text: "Emit logs as structured JSON, not free text, so they can be filtered by field. Never log secrets, tokens or full card numbers." },
        { type: "h2", text: "What to monitor" },
        { type: "p", text: "Google's SRE book names four golden signals for any user-facing service: **latency**, **traffic**, **errors** and **saturation**. The RED method (rate, errors, duration) suits request-driven services, and the USE method (utilisation, saturation, errors) suits resources such as CPU, disks and queues." },
        { type: "h2", text: "Percentiles, not averages" },
        { type: "p", text: "An average hides the slow tail. Suppose 99 requests take 100 ms and one takes 10 seconds. The mean is about 199 ms, which looks fine, yet one user in a hundred waited ten seconds. Report p50 (the typical request), p95 and p99 (the tail). Percentiles also cannot be averaged across servers: the mean of two p99 values is not the p99 of the combined traffic. Store histograms and compute percentiles from the merged buckets." },
        { type: "p", text: "The tail matters more than it looks. If a page makes 20 backend calls and each has a 1% chance of being slow, about 18% of page loads hit at least one slow call (1 minus 0.99 to the 20th power)." },
        { type: "h2", text: "Errors and saturation" },
        { type: "list", items: [
          "**Errors:** count explicit failures (5xx) and silent ones, such as a 200 response with the wrong content or a timeout your client gave up on. Alert on the error ratio, not the raw count, so traffic changes do not distort it.",
          "**Saturation:** how full the scarcest resource is: CPU, memory, connection pool, thread pool, queue depth, disk. Latency climbs sharply as utilisation nears 100%, so alert at something like 70-80% for queues and pools, before users feel it.",
          "**Traffic:** requests per second. A sudden drop is often a worse sign than a spike, because it can mean clients cannot reach you.",
        ] },
        { type: "p", text: "A common stack is Prometheus scraping metrics, Grafana drawing dashboards, and an alert manager routing pages. Prometheus histograms use fixed buckets, so choose bucket edges around your latency target, for example one at exactly the SLO threshold." },
        { type: "callout", tone: "gotcha", title: "High-cardinality labels break metrics", text: "Each unique label combination is a separate time series. Putting user_id or full URLs in a metric label can create millions of series and take down the metrics store. Keep labels to bounded sets (route template, status class, region) and put per-user detail in logs or traces." },
        { type: "h2", text: "Alert on symptoms" },
        { type: "p", text: "Page a human for things users feel: elevated error ratio, high p99 on a key endpoint. Do not page on causes like 90% CPU for two minutes if nothing is hurting. Every page should be urgent and actionable, otherwise people learn to ignore the pager. Send the rest to a ticket or a dashboard." },
        { type: "p", text: "Interview tip: when asked how you would know the system is healthy, name the four signals, say you track percentiles, and tie alerts to an SLO instead of listing tools." },
      ],
      references: [
        { title: "Monitoring Distributed Systems (Google SRE Book)", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
        { title: "Histograms and summaries (Prometheus)", url: "https://prometheus.io/docs/practices/histograms/" },
        { title: "Observability primer (OpenTelemetry)", url: "https://opentelemetry.io/docs/concepts/observability-primer/" },
      ],
    },
  },
};
