import type { LessonEntry } from "@/types/roadmap";

export const THREE_PILLARS: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Three pillars: logs, metrics and traces",
    slug: "three-pillars-logs-metrics-traces",
    lesson: {
      summary: "Logs, metrics and traces answer different questions about a running system, and you need all three to debug without guessing.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Observability in one sentence" },
        { type: "p", text: "Monitoring tells you that something is wrong, using checks you wrote in advance. Observability is the ability to ask new questions about a system from the data it already emits, without shipping new code first. The three common signals are logs, metrics and traces. They are not rivals. Each one is cheap at one job and bad at the others." },
        { type: "h2", text: "What each signal is" },
        { type: "p", text: "A **log** is a timestamped record of one event: a request failed, a job started, a user logged in. It carries the most detail and costs the most to store and search. A **metric** is a number sampled over time, such as requests per second or memory in use. It carries almost no detail but is tiny, fast to query and ideal for dashboards and alerts. A **trace** follows one request across every service it touches. It is made of spans, one per unit of work, each with a start time, a duration and a parent." },
        {
          type: "table",
          head: ["Signal", "Answers", "Cost", "Weak at"],
          rows: [
            ["Metrics", "Is it broken? How bad? Is it getting worse?", "Low, grows with label combinations", "Why one request failed"],
            ["Logs", "What exactly happened in this event?", "High, grows with volume", "Spotting trends without a query"],
            ["Traces", "Where did this request spend its time?", "Medium, usually sampled", "Overall health"],
          ],
        },
        { type: "h2", text: "How they work together" },
        { type: "p", text: "A typical investigation goes metric, trace, log. An alert fires because the error rate on `checkout` crossed 2 percent. You open a trace for a failing request and see that 4 of its 5 seconds went into the payment service. You then read that service's logs for the same trace ID and find a connection timeout to the database. The metric found the problem, the trace located it, the log explained it." },
        { type: "p", text: "That chain only works if the signals share identifiers. Put the trace ID in every log line and use the same service and environment names across all three. Without that, you are switching tools and correlating by timestamp." },
        {
          type: "code",
          language: "json",
          title: "A structured log line that can be joined to a trace",
          code: `{
  "ts": "2026-10-25T09:14:03.221Z",
  "level": "error",
  "service": "payments",
  "env": "prod",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "msg": "db connection timeout",
  "timeout_ms": 3000
}`,
        },
        { type: "h2", text: "Structured logs and the cost of data" },
        { type: "p", text: "Write logs as JSON, one object per line, so a tool can filter on fields instead of regex-matching prose. Pick levels deliberately: `error` should mean someone may need to act, not that a user typed a bad password." },
        {
          type: "list",
          items: [
            "Metrics: keep label values bounded (route, status class). A label like `user_id` multiplies stored series per user.",
            "Logs: sample or drop noisy debug lines in production, and set a retention period.",
            "Traces: sample. Keep all errors and slow requests, and a small share of the rest.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Do not put secrets in logs", text: "Logs are copied to a shared system many people can search. Request bodies, tokens, authorization headers and personal data end up there by accident. Redact at the source, before the line is written." },
        { type: "h2", text: "Where to start" },
        { type: "p", text: "If you have nothing, start with metrics for the four golden signals (latency, traffic, errors, saturation) and structured logs with a request ID. Add tracing when you have more than two services calling each other and latency questions become hard to answer from the other two signals." },
      ],
      references: [
        { title: "Observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/" },
        { title: "Prometheus overview", url: "https://prometheus.io/docs/introduction/overview/" },
        { title: "Traces", url: "https://opentelemetry.io/docs/concepts/signals/traces/" },
        { title: "Service Level Objectives (Google SRE Book)", url: "https://sre.google/sre-book/service-level-objectives/" },
      ],
    },
  },
};
