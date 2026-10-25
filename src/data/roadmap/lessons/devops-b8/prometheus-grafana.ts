import type { LessonEntry } from "@/types/roadmap";

export const PROMETHEUS_GRAFANA: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Metrics: Prometheus and Grafana",
    slug: "metrics-prometheus-and-grafana",
    lesson: {
      summary: "Prometheus pulls numbers from your services on a schedule and stores them as time series, and Grafana draws them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "How scraping works" },
        { type: "p", text: "Prometheus uses a pull model. Your service exposes plain text at an HTTP endpoint, usually `/metrics`. Prometheus visits every target on a fixed interval (the scrape interval, often 15 seconds), reads the current values and stores each one with a timestamp. A target that does not answer is recorded as down through the built-in `up` metric, which is itself a free health check." },
        { type: "p", text: "Pull has a useful side effect. If a service dies, Prometheus notices because the scrape fails. With push you would only see silence and have to guess whether it meant healthy or dead." },
        {
          type: "code",
          language: "yaml",
          title: "prometheus.yml",
          code: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: api
    metrics_path: /metrics
    static_configs:
      - targets: ["api:8000"]
        labels:
          env: prod`,
        },
        { type: "p", text: "Static targets are fine for a single host. In Kubernetes you use service discovery instead, so new pods are found automatically." },
        { type: "h2", text: "Metric types" },
        {
          type: "table",
          head: ["Type", "Behaviour", "Example"],
          rows: [
            ["Counter", "Only goes up (resets on restart)", "`http_requests_total`"],
            ["Gauge", "Goes up and down", "`memory_in_use_bytes`, queue length"],
            ["Histogram", "Counts observations in buckets", "`http_request_duration_seconds`"],
          ],
        },
        { type: "p", text: "A raw counter is rarely useful on its own. You almost always wrap it in `rate()` to get a per-second value over a window." },
        { type: "h2", text: "PromQL you will use daily" },
        {
          type: "code",
          language: "promql",
          code: `# requests per second, per route, over the last 5 minutes
sum by (route) (rate(http_requests_total[5m]))

# share of requests that returned 5xx
sum(rate(http_requests_total{status=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))

# 95th percentile latency from a histogram
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))`,
        },
        { type: "p", text: "Averages hide pain. A mean latency of 120 ms can sit on top of a 3 second tail that one in twenty users sees. Look at percentiles." },
        { type: "h2", text: "Where Grafana fits" },
        { type: "p", text: "Prometheus has a basic expression browser but is not a dashboard tool. Grafana connects to Prometheus as a data source, runs your PromQL and draws panels. It can also query logs and traces, so it becomes the one screen for all three signals. Build a first dashboard around request rate, error rate, latency percentiles and saturation (CPU, memory), and keep it small enough to read in ten seconds." },
        { type: "callout", tone: "gotcha", title: "High cardinality kills Prometheus", text: "Every unique combination of label values is a separate time series held in memory. A label such as `user_id`, a full URL with IDs, or a request ID can create millions of series and take the server down. Use route templates like `/orders/:id`, and keep label values to small bounded sets." },
        { type: "list", items: ["Name counters with a `_total` suffix and include the unit in the name, for example `_seconds` or `_bytes`.", "Prometheus stores data on local disk and is not built for years of retention. Use remote storage for long-term needs.", "Check the **Targets** page first when a graph is empty. Most problems are a wrong port or a blocked network path."] },
      ],
      references: [
        { title: "Prometheus overview", url: "https://prometheus.io/docs/introduction/overview/" },
        { title: "Getting started", url: "https://prometheus.io/docs/prometheus/latest/getting_started/" },
        { title: "Metric and label naming", url: "https://prometheus.io/docs/practices/naming/" },
        { title: "Querying basics", url: "https://prometheus.io/docs/prometheus/latest/querying/basics/" },
        { title: "Grafana documentation", url: "https://grafana.com/docs/grafana/latest/" },
      ],
    },
  },
};
