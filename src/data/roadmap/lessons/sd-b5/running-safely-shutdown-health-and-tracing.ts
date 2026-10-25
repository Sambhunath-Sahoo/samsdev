import type { LessonEntry } from "@/types/roadmap";

export const RUNNING_SAFELY: LessonEntry = {
  track: "system-design",
  section: "Resilience patterns",
  subsection: {
    title: "Running safely: shutdown, health and tracing",
    slug: "running-safely-shutdown-health-and-tracing",
    lesson: {
      summary: "Stop servers without dropping requests, report health honestly to the platform, and trace a request across every service it touches.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Graceful shutdown" },
        { type: "p", text: "Every deploy, scale-down or node drain stops processes. A hard kill drops in-flight requests and leaves half-finished work. On Kubernetes the pod gets `SIGTERM`, a grace period (30 s by default) and then `SIGKILL`." },
        { type: "list", ordered: true, items: [
          "Receive `SIGTERM` and immediately start failing the readiness check so the load balancer stops sending new traffic.",
          "Wait a few seconds: endpoint removal takes time to propagate, and some requests still arrive.",
          "Stop accepting new connections and let in-flight requests finish, with a timeout below the grace period.",
          "Close resources in order: HTTP server, then queue consumers, then database pools, flush logs and traces.",
          "Exit with code 0. If the deadline passes, exit anyway; `SIGKILL` is coming.",
        ] },
        { type: "p", text: "**Workers and long jobs** need more. Stop pulling new messages, finish or checkpoint the current one, and if it cannot finish in time, do not acknowledge it so the broker redelivers it. This only works if handlers are idempotent. For jobs that run for minutes, save progress regularly so a replacement can resume, and set the grace period to cover your longest acceptable job." },
        { type: "h2", text: "Liveness, readiness and startup probes" },
        {
          type: "table",
          head: ["Probe", "Question", "On failure"],
          rows: [
            ["Liveness", "Is the process stuck beyond recovery?", "Restart the container"],
            ["Readiness", "Can it serve traffic right now?", "Remove from the load balancer, no restart"],
            ["Startup", "Has it finished booting?", "Hold off the other probes; restart if too slow"],
          ],
        },
        { type: "code", language: "yaml", title: "Probes for an API", code: `startupProbe:   { httpGet: { path: /healthz, port: 8080 }, failureThreshold: 30, periodSeconds: 2 }
livenessProbe:  { httpGet: { path: /healthz, port: 8080 }, periodSeconds: 10, failureThreshold: 3 }
readinessProbe: { httpGet: { path: /ready,   port: 8080 }, periodSeconds: 5,  failureThreshold: 2 }` },
        { type: "p", text: "**Deep health checks**: a readiness check that also queries the database seems thorough but is dangerous. If the shared database blips, every pod goes unready at once, the load balancer has zero targets and a partial outage becomes total. Keep liveness trivial (the process responds). Make readiness reflect what this instance needs but tolerate shared dependency failures, or degrade instead of removing the pod. Never let liveness depend on a downstream service: a database outage would trigger a restart storm." },
        { type: "callout", tone: "gotcha", title: "Probes can cause the outage", text: "A liveness check that is too aggressive restarts a busy pod, which shifts its load to the others, which then fail the check too. Set timeouts above your normal p99, use a startup probe for slow boots, and do not put dependencies in liveness." },
        { type: "h2", text: "Traces, spans and context propagation" },
        { type: "p", text: "Logs and metrics tell you something is slow; a **trace** shows where. A trace is one request's journey, made of **spans**: timed operations such as an HTTP handler, a SQL query or a call to another service, each with a parent. The trace id and parent span id travel with the request in headers (the W3C `traceparent` header), which is **context propagation**. Each service reads it, creates child spans and forwards it on outgoing calls. If one hop drops the header, the trace breaks in two." },
        { type: "code", language: "text", code: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ver  trace-id (16 bytes)               parent span id   flags (sampled)` },
        { type: "h2", text: "Sampling and async work" },
        { type: "p", text: "Tracing every request is expensive at scale. **Head sampling** decides at the start (keep 1 percent); it is cheap but may miss the rare slow or failing request. **Tail sampling** buffers a whole trace and keeps those that were slow or errored, which is better for debugging and costs more in collectors. For async work, a queue breaks the call chain, so put the trace context in the message headers; the consumer starts a span **linked** to the producer's span, since a job may run hours later and can fan out from one publish." },
        { type: "p", text: "Interview shortcut: drain traffic first, finish work, then exit; liveness means restart me, readiness means do not send traffic; and trace ids must survive every network and queue hop." },
      ],
      references: [
        { title: "Pod lifecycle: termination of Pods - Kubernetes documentation", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/" },
        { title: "Configure Liveness, Readiness and Startup Probes - Kubernetes documentation", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" },
        { title: "Traces - OpenTelemetry documentation", url: "https://opentelemetry.io/docs/concepts/signals/traces/" },
        { title: "Context propagation - OpenTelemetry documentation", url: "https://opentelemetry.io/docs/concepts/context-propagation/" },
        { title: "Sampling - OpenTelemetry documentation", url: "https://opentelemetry.io/docs/concepts/sampling/" },
      ],
    },
  },
};
