import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "observability";

export const OBS_PILLARS = withPoints("Three pillars: logs, metrics and traces", [
  point(
    S,
    "logs-metrics-traces",
    "Logs, metrics and traces",
    "Logs are timestamped records of discrete events and give detail for debugging a specific case. Metrics are numeric measurements aggregated over time, cheap to store and ideal for dashboards and alerts. Traces follow one request across services as a tree of timed spans, showing where latency or errors arise. Metrics tell you something is wrong, traces locate where, and logs explain why.",
    "Latency spiked at 14:00. Which signal do you open first, and which next?",
  ),
]);

export const OBS_METRICS = withPoints("Metrics: Prometheus and Grafana", [
  point(
    S,
    "prometheus-scraping",
    "How Prometheus scraping works",
    "Prometheus uses a pull model: at a fixed interval it sends HTTP requests to each target's /metrics endpoint and stores the returned samples in its time series database. Targets come from static config or service discovery such as Kubernetes. Short-lived jobs that cannot be scraped push to a Pushgateway, and alert rules fire to Alertmanager, which routes notifications. Grafana queries Prometheus with PromQL to draw dashboards.",
    "Why does Prometheus pull metrics, and how do you monitor a batch job that exits before a scrape?",
  ),
]);

export const OBS_TRACING = withPoints("Tracing: OpenTelemetry", [
  point(
    S,
    "opentelemetry",
    "What OpenTelemetry is",
    "OpenTelemetry is a vendor-neutral, open standard of APIs, SDKs and a collector for producing traces, metrics and logs. You instrument once, and the Collector receives, processes and exports the data to any backend such as Jaeger, Tempo, Prometheus or a commercial vendor. Context propagation carries the trace ID between services so spans join into one trace.",
    "What does OpenTelemetry let you avoid when you later change your tracing backend?",
  ),
]);

export const OBS_ALERTING = withPoints("Alerting and SLOs", [
  point(
    S,
    "sli-slo-sla",
    "SLIs, SLOs and SLAs",
    "An SLI is a measured indicator of service quality, such as the share of requests that succeed or finish under 300 ms. An SLO is the internal target for that indicator over a period, for example 99.9% over 30 days. An SLA is a contract with customers that usually carries penalties, and is set looser than the SLO.",
    "Give an SLI and an SLO for a checkout API, and say how the SLA would relate.",
  ),
  point(
    S,
    "error-budget",
    "Error budget",
    "The error budget is the amount of unreliability the SLO permits, equal to one minus the SLO: a 99.9% target over 30 days allows about 43 minutes of failure. While budget remains the team can ship features and take risks, and when it is spent the focus moves to reliability work. It turns reliability versus velocity into a shared, measurable rule.",
    "What should a team do when it has used up its error budget for the month?",
  ),
  point(
    S,
    "avoiding-alert-fatigue",
    "Alerting without alert fatigue",
    "Alert on symptoms users feel, such as error rate and latency against the SLO, rather than on every cause like high CPU. Every page should be urgent, actionable and have a runbook, while other signals go to tickets or dashboards. Group and deduplicate alerts, add durations to avoid flapping, and review noisy alerts regularly. Burn-rate alerts on the error budget are a good pattern.",
    "Your team gets 50 pages a night and ignores most. How do you cut that down?",
  ),
]);

export const OBS_NEW_TOPICS: readonly RoadmapSubsection[] = [
  "Logs: the ELK stack (Elasticsearch, Logstash, Kibana)",
  "Distributed tracing: Jaeger and Zipkin",
  "Application metrics with Micrometer (Spring Boot)",
  "On-call and incident management: PagerDuty and Opsgenie",
  "Practice: Prometheus and Grafana on Kubernetes with alert rules for CPU, memory and error rate",
].map((title) => ({ title }));
