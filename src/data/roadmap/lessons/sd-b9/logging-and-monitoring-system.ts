import type { LessonEntry } from "@/types/roadmap";

export const LOGGING_AND_MONITORING_SYSTEM: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Logging and monitoring system",
    slug: "logging-and-monitoring-system",
    lesson: {
      summary: "Collect logs and metrics from thousands of services, store them cheaply, and still answer a query and fire an alert within seconds.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: ingest logs and metrics from every service, search logs by time and field, draw dashboards, and send alerts when a rule is breached. Non-functional: never lose data during an incident (which is when volume spikes), low ingest overhead on the apps, query latency of seconds, and cheap long-term retention." },
        { type: "p", text: "Assume 2,000 hosts, each emitting 500 log lines a second at 300 bytes: 1 million lines a second, 300 MB/s, about 26 TB a day. Seven days of searchable logs is 180 TB before replication and compression (text compresses roughly 5 to 10 times). Metrics are much smaller: 2,000 hosts with 500 series each at one sample every 15 seconds is about 67,000 samples a second. Logs are the expensive part." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "Shapes",
          code: `log event:    {ts, service, host, level, traceId, message, fields{...}}
metric point: name{label=value,...} -> (ts, value)

POST /ingest/logs                  batch of events
GET  /logs?q=level:error AND service:checkout&from=..&to=..
GET  /metrics/query?expr=rate(http_errors[5m])
alert rule:  expr, for: 5m, severity, route -> pager`,
        },
        { type: "p", text: "Log lines should be **structured** (JSON with a trace id) so you can filter by field instead of regex-searching free text. Metrics are time series identified by a name and a set of labels. Be careful with labels: each unique combination is a new series, so putting a user id in a label creates millions of series." },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "Two pipelines share a shape: **agent, buffer, processor, store, query**." },
        {
          type: "list",
          items: [
            "**Agent** on each host tails log files and forwards batches. It buffers on local disk if the network is down, so a burst does not block the application.",
            "**Buffer**: a durable log such as Kafka sits in the middle. It absorbs spikes, lets you replay if the store is down, and lets several consumers read the same stream.",
            "**Processor** parses, adds metadata, drops noise, and masks secrets or personal data before storage.",
            "**Log store**: an inverted index (Elasticsearch or OpenSearch style) for full-text search on recent data, with older data moved to object storage such as S3 in compressed columnar or plain files for cheap retrieval. Alternatively, index only labels and keep line content compressed, which is Loki's approach and is far cheaper but slower for free-text search.",
            "**Metrics store**: a time-series database. Prometheus pulls (scrapes) each target on an interval, and applications expose a `/metrics` endpoint. Pull makes it easy to see which targets are down; push suits short-lived jobs.",
            "**Alerting**: rules are evaluated on the metrics store every minute. An alert manager de-duplicates, groups and routes to a pager, and supports silences.",
            "**Tracing**: the trace id in each log line links logs to distributed traces, which show where time went across services.",
          ],
        },
        { type: "p", text: "Use tiered storage: hot (7 days, indexed, SSD), warm (30 days, compressed), cold (a year or more, object storage). Downsample metrics as they age, for example keep 15-second samples for 15 days and 5-minute averages for a year." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "table",
          head: ["Choice", "Upside", "Downside"],
          rows: [
            ["Full-text index on every field", "Fast, flexible search", "Index can exceed the raw data in size"],
            ["Label-only index", "Very cheap", "Free-text search scans data"],
            ["Sample or drop debug logs", "Cuts volume 10x", "Missing evidence during an incident"],
            ["Pull metrics", "Simple health view", "Needs service discovery and reachability"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "The monitor must outlive the system", text: "If monitoring runs on the same cluster and the same network as the app, a bad outage takes both down and you are blind. Keep it separate, and add an external check or a deadman alert that fires when data stops arriving." },
        { type: "p", text: "Alert on symptoms users feel (error rate, latency, saturation) rather than every cause, and attach a runbook to each alert. Common interview mistakes: sending logs straight to the search store without a buffer, ignoring cost and retention, and forgetting alert fatigue." },
      ],
      references: [
        { title: "Google SRE Book: Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
        { title: "Prometheus overview", url: "https://prometheus.io/docs/introduction/overview/" },
        { title: "OpenTelemetry: signals", url: "https://opentelemetry.io/docs/concepts/signals/" },
        { title: "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure", url: "https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/" },
      ],
    },
    points: [
      { id: "sd.logging-and-monitoring-system.ingest-pipeline", title: "Agent, buffer and processor pipeline", detail: "Agents ship structured logs to a durable buffer such as Kafka, and processors parse and enrich them before storage. The buffer absorbs incident-time spikes and allows replay if the store is down.", question: "Why put a queue between the log agents and the search store?" },
      { id: "sd.logging-and-monitoring-system.tiered-storage", title: "Tiered storage and retention", detail: "Keep recent logs indexed on fast disks, move older data to compressed object storage, and downsample old metrics. Retention is mostly a cost decision, since log volume dominates the bill.", question: "How would you cut the storage cost of 26 TB a day without losing the ability to debug last week's incident?" },
      { id: "sd.logging-and-monitoring-system.alerting", title: "Metrics, alerting and cardinality", detail: "Metrics are labelled time series, and each unique label combination is a separate series. Alert rules run on the metrics store and route through a manager that groups and de-duplicates pages.", question: "Why is putting a user id in a metric label dangerous?" },
    ],
  },
};
