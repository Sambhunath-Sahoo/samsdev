import type { LessonEntry } from "@/types/roadmap";

export const LOKI: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Logs: Loki",
    slug: "logs-loki",
    lesson: {
      summary: "Loki stores logs cheaply by indexing only labels, not the full text, and you query them from Grafana with LogQL.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What Loki is" },
        { type: "p", text: "Loki is a log store from Grafana Labs, designed to feel like Prometheus for logs. It does not build a full-text index of every word. It indexes only a small set of labels per log stream (for example `app`, `namespace`, `env`) and stores the compressed log lines as chunks. That keeps storage and memory costs low, at the price of slower searches over large time ranges when you filter on text." },
        { type: "h2", text: "How data gets in" },
        { type: "p", text: "An agent runs next to your workloads, reads log files or container output, attaches labels and pushes the lines to Loki. Grafana Alloy is the current agent for this. Promtail was the older one and has been superseded by Alloy, so prefer Alloy for new setups. Loki itself only stores and serves queries." },
        {
          type: "code",
          language: "yaml",
          title: "docker-compose.yml (local trial)",
          code: `services:
  loki:
    image: grafana/loki:3.2.0
    ports: ["3100:3100"]
    command: -config.file=/etc/loki/local-config.yaml

  grafana:
    image: grafana/grafana:11.2.0
    ports: ["3000:3000"]
    depends_on: [loki]`,
        },
        { type: "p", text: "In Grafana, add a Loki data source pointing at `http://loki:3100`, then open Explore to query." },
        { type: "h2", text: "Querying with LogQL" },
        { type: "p", text: "A LogQL query starts with a **stream selector** in braces, which uses the indexed labels and narrows down which streams to read. After it come filters that scan the text of those lines." },
        {
          type: "code",
          language: "logql",
          code: `# all lines from the api in prod that contain "timeout"
{app="api", env="prod"} |= "timeout"

# parse JSON lines and keep only errors
{app="api"} | json | level="error"

# errors per minute, as a metric you can graph or alert on
sum(count_over_time({app="api"} | json | level="error" [1m]))`,
        },
        { type: "p", text: "The last form turns logs into a number, which is how you build a dashboard panel or alert from log content when no metric exists yet." },
        { type: "h2", text: "Labels are the design decision" },
        { type: "p", text: "Pick labels that describe where the logs came from, and keep them few and stable. Everything else, such as request ID, user ID or path, stays inside the log line and is found with filters or parsed fields." },
        {
          type: "list",
          items: ["Good labels: `app`, `namespace`, `env`, `cluster`.", "Bad labels: `trace_id`, `user_id`, `url`, anything with thousands of distinct values.", "Always narrow by selector first. `{app=\"api\"}` is cheap, scanning every stream for a string is not."],
        },
        { type: "callout", tone: "gotcha", title: "High-cardinality labels create too many streams", text: "Each unique label combination is its own stream with its own chunks. Putting an ID in a label produces enormous numbers of tiny streams, which makes ingestion and queries slow and expensive. Loki can also reject such writes with limits on stream count. Keep IDs in the log line." },
        { type: "p", text: "Compared with an Elasticsearch-based setup, Loki is lighter to run and fits well if you already use Grafana and Prometheus with matching labels. If you need heavy full-text search and analytics across everything, a full-text index is the better tool." },
      ],
      references: [
        { title: "Loki overview", url: "https://grafana.com/docs/loki/latest/get-started/overview/" },
        { title: "Understand labels", url: "https://grafana.com/docs/loki/latest/get-started/labels/" },
        { title: "Query (LogQL)", url: "https://grafana.com/docs/loki/latest/query/" },
      ],
    },
    points: [
      {
        id: "devops.logs-loki.label-only-index",
        title: "Loki indexes labels, not log text",
        detail: "Loki indexes a small set of labels per stream and stores log lines as compressed chunks. This keeps cost low, but text filters scan the lines of the selected streams.",
        question: "Why is a narrow stream selector important for query speed in Loki?",
      },
      {
        id: "devops.logs-loki.logql",
        title: "Query with LogQL",
        detail: "A query starts with a label selector, then adds line filters, parsers like `| json`, and optionally a metric function such as `count_over_time`.",
        question: "How would you graph the number of error lines per minute for one app?",
      },
      {
        id: "devops.logs-loki.low-cardinality-labels",
        title: "Keep labels low-cardinality",
        detail: "Use labels for stable origin data like app, namespace and env. Identifiers such as trace or user IDs belong in the log line, not in a label.",
        question: "What goes wrong if you put `user_id` in a Loki label?",
      },
      {
        id: "devops.logs-loki.agent-ships-logs",
        title: "An agent ships the logs",
        detail: "Loki does not collect logs on its own. An agent such as Grafana Alloy reads files or container output, adds labels and pushes to Loki.",
        question: "What component reads container logs and sends them to Loki?",
      },
    ],
  },
};
