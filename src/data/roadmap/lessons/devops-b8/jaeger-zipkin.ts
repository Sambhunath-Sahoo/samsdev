import type { LessonEntry } from "@/types/roadmap";

export const JAEGER_ZIPKIN: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Distributed tracing: Jaeger and Zipkin",
    slug: "distributed-tracing-jaeger-zipkin",
    lesson: {
      summary: "Jaeger and Zipkin store and display traces, so you can see which service in a call chain made a request slow or broken.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why you need a trace backend" },
        { type: "p", text: "Instrumentation produces spans, but something has to receive them, store them and let you search. That is the job of a tracing backend. Jaeger and Zipkin are the two long-standing open-source choices. Both show a request as a waterfall: each span is a bar, nested under its parent, positioned by start time and sized by duration. The longest bar, or the gap where nothing happens, is where you look." },
        { type: "h2", text: "Jaeger and Zipkin compared" },
        {
          type: "table",
          head: ["", "Jaeger", "Zipkin"],
          rows: [
            ["Origin", "Built at Uber, now a CNCF project", "Built at Twitter, based on Google's Dapper paper"],
            ["Ingest", "OTLP natively (version 2 is built on the OpenTelemetry Collector)", "Its own Zipkin v1/v2 format on port 9411, and OTLP through a collector"],
            ["Storage", "Memory, Elasticsearch/OpenSearch, Cassandra, and others", "Memory, Elasticsearch, Cassandra, MySQL"],
            ["UI", "Search, trace view, service dependency graph, trace comparison", "Search, trace view, dependency view"],
            ["Footprint", "More features, more components at scale", "Small, simple to start"],
          ],
        },
        { type: "p", text: "Both are fine for a small team. If you already use OpenTelemetry, Jaeger is the easier match because it accepts OTLP directly. Zipkin is a good pick when you want one small container and an existing Zipkin-instrumented codebase, such as older Spring apps." },
        { type: "h2", text: "Run one locally" },
        {
          type: "code",
          language: "bash",
          title: "Jaeger all-in-one (in-memory, for development)",
          code: `docker run --rm --name jaeger \\
  -p 16686:16686 \\
  -p 4317:4317 \\
  -p 4318:4318 \\
  jaegertracing/jaeger:latest
# UI: http://localhost:16686
# Point your OTLP exporter at localhost:4317 (gRPC) or localhost:4318 (HTTP)`,
        },
        {
          type: "code",
          language: "bash",
          title: "Zipkin",
          code: `docker run --rm -d -p 9411:9411 openzipkin/zipkin
# UI: http://localhost:9411`,
        },
        { type: "p", text: "Pin an explicit image version instead of `latest` for anything beyond a local trial. In-memory storage forgets everything on restart, so use a real storage backend before relying on it." },
        { type: "h2", text: "Reading a trace" },
        {
          type: "list",
          items: [
            "Start from a slow or failed request. Search by service, operation, minimum duration or `error=true`.",
            "Find the widest span on the critical path. A parent with a short own-time and a long child means the child is the problem.",
            "Look for patterns: many short sequential database spans point to an N+1 query, and staircase shapes show work that could run in parallel.",
            "Open the span's attributes and events for status codes, SQL statements and exception messages.",
          ],
        },
        { type: "callout", tone: "tip", title: "Search by trace ID from a log line", text: "If your logs include the trace ID, paste it into the backend's search box to jump from an error log straight to the full request. Setting that up is worth more than any dashboard." },
        { type: "callout", tone: "gotcha", title: "Sampling hides the trace you want", text: "With 5 percent head sampling, most failing requests have no trace at all. Keep errors and slow requests with tail sampling in the collector, or raise the rate while you investigate." },
      ],
      references: [
        { title: "Jaeger documentation", url: "https://www.jaegertracing.io/docs/latest/" },
        { title: "Zipkin", url: "https://zipkin.io/" },
        { title: "Traces (OpenTelemetry)", url: "https://opentelemetry.io/docs/concepts/signals/traces/" },
      ],
    },
    points: [
      {
        id: "devops.distributed-tracing-jaeger-zipkin.backend-role",
        title: "A backend stores and shows spans",
        detail: "SDKs create spans, but a backend such as Jaeger or Zipkin receives, stores and visualises them as waterfall views you can search.",
        question: "What does a tracing backend do that the instrumentation library does not?",
      },
      {
        id: "devops.distributed-tracing-jaeger-zipkin.choose",
        title: "Choosing between Jaeger and Zipkin",
        detail: "Jaeger accepts OTLP natively and has richer features, while Zipkin is small and easy to start. Both are open source and store traces in several databases.",
        question: "Why does an OpenTelemetry user often pick Jaeger?",
      },
      {
        id: "devops.distributed-tracing-jaeger-zipkin.read-waterfall",
        title: "Read the waterfall",
        detail: "Find the longest span on the critical path, then check its attributes. Repeated short sequential spans usually mean an N+1 query pattern.",
        question: "What does a long sequence of identical short database spans suggest?",
      },
    ],
  },
};
