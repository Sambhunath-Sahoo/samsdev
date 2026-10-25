import type { LessonEntry } from "@/types/roadmap";

export const OPENTELEMETRY: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Tracing: OpenTelemetry",
    slug: "tracing-opentelemetry",
    lesson: {
      summary: "OpenTelemetry is a vendor-neutral standard and toolkit for producing traces, metrics and logs and sending them to any backend.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What OpenTelemetry is" },
        { type: "p", text: "OpenTelemetry (OTel) is an open standard plus a set of SDKs and tools for generating telemetry. It defines what a span or a metric looks like, how to propagate trace context between services, and a wire protocol called OTLP for shipping data. It does not store or display anything. You pick a backend such as Jaeger, Tempo, Prometheus or a commercial product, and OTel feeds it." },
        { type: "p", text: "The value is portability. You instrument your code once, and changing backend becomes a configuration change instead of a rewrite." },
        { type: "h2", text: "Spans, traces and context" },
        { type: "p", text: "A **span** is one timed operation: an incoming HTTP request, a database query, a call to another service. Spans carry attributes (key-value details such as `http.route`) and a parent link. All spans for one request share a **trace ID** and form a tree." },
        { type: "p", text: "Across a network call, the caller puts the trace ID and its own span ID into a request header, and the receiver reads it and creates child spans. This is context propagation. The default format is the W3C `traceparent` header. If any hop in the chain drops that header, the trace breaks into two unrelated pieces." },
        {
          type: "code",
          language: "text",
          title: "The traceparent header",
          code: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             |  trace id (32 hex)               parent span (16 hex)  flags`,
        },
        { type: "h2", text: "The pieces" },
        {
          type: "list",
          items: [
            "**API and SDK**: the libraries inside your app that create spans and export them.",
            "**Auto-instrumentation**: agents or packages that wrap common frameworks and clients (HTTP servers, database drivers) so you get spans without writing code.",
            "**OTLP**: the protocol, over gRPC (port 4317) or HTTP (port 4318).",
            "**Collector**: a separate process that receives telemetry, processes it (batch, filter, add attributes, sample) and forwards it to one or more backends.",
          ],
        },
        { type: "h2", text: "A minimal setup" },
        { type: "p", text: "The app exports OTLP to a collector, and the collector forwards to a backend. The SDK reads standard environment variables, so many setups need no code change beyond enabling auto-instrumentation." },
        {
          type: "code",
          language: "bash",
          title: "App environment",
          code: `export OTEL_SERVICE_NAME=checkout-api
export OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
export OTEL_TRACES_SAMPLER=parentbased_traceidratio
export OTEL_TRACES_SAMPLER_ARG=0.1`,
        },
        {
          type: "code",
          language: "yaml",
          title: "otel-collector.yaml",
          code: `receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch: {}

exporters:
  otlp:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]`,
        },
        { type: "h2", text: "Sampling" },
        { type: "p", text: "Recording every trace is expensive at volume. **Head sampling** decides when a trace starts, as in the 10 percent ratio above, and is cheap but blind to whether the request will turn out slow or failed. **Tail sampling** in the collector waits until a trace completes and keeps all errors and slow ones, at the cost of more memory and a need to route all spans of one trace to the same collector." },
        { type: "callout", tone: "gotcha", title: "Broken traces", text: "The usual cause is a proxy, queue or custom HTTP client that does not forward `traceparent`. Check that every hop passes headers through, and for message queues copy the context into message headers explicitly." },
      ],
      references: [
        { title: "What is OpenTelemetry?", url: "https://opentelemetry.io/docs/what-is-opentelemetry/" },
        { title: "Traces", url: "https://opentelemetry.io/docs/concepts/signals/traces/" },
        { title: "Context propagation", url: "https://opentelemetry.io/docs/concepts/context-propagation/" },
        { title: "Observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/" },
      ],
    },
  },
};
