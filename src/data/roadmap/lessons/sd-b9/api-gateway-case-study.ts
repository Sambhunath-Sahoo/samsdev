import type { LessonEntry } from "@/types/roadmap";

export const API_GATEWAY_CASE_STUDY: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "API gateway",
    slug: "api-gateway-case-study",
    lesson: {
      summary: "Design the single front door that authenticates, rate limits and routes every request to the right backend service without becoming a bottleneck.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: route requests by host and path to backend services, authenticate callers, rate limit, terminate TLS, transform requests, log and trace, and optionally aggregate several backend calls into one response. Non-functional: very low added latency, high availability since every request passes through it, and configuration changes without redeploys." },
        { type: "p", text: "Assume 100,000 requests a second at peak and 100 backend services. If each gateway node handles 10,000 requests a second with a 2 ms budget, you need 10 nodes for load, and 20 for headroom and zone loss. Added latency should be a few milliseconds, small next to a 100 ms backend call; an auth call to a remote service on every request would erase that budget, which is why tokens are validated locally." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "yaml",
          title: "Route configuration (control plane data)",
          code: `routes:
  - id: orders-v1
    match: { host: api.example.com, pathPrefix: /v1/orders }
    upstream: { service: orders, timeoutMs: 800, retries: 1 }
    auth: { required: true, scopes: [orders:read] }
    rateLimit: { key: apiKey, rps: 100, burst: 200 }
  - id: public-catalog
    match: { pathPrefix: /v1/catalog }
    upstream: { service: catalog, timeoutMs: 300 }
    auth: { required: false }
    cache: { ttlSeconds: 30 }`,
        },
        { type: "p", text: "Routes, consumers (API keys, quotas) and policies live in a config store. A **control plane** edits and validates them; the **data plane** (the proxy nodes that carry traffic) pulls and hot-reloads them, and keeps serving with the last known good config if the control plane is down." },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "Clients reach a DNS name that points at an external load balancer, then a stateless fleet of gateway nodes spread over several zones, then internal services found through service discovery. Each request runs through an ordered chain of filters:" },
        {
          type: "list",
          ordered: true,
          items: [
            "TLS termination and connection handling.",
            "Request id and trace header, so logs and traces correlate across services.",
            "Authentication: verify a JWT signature against cached public keys, or look up an API key in a local cache with short TTL.",
            "Authorisation at the coarse level (scopes per route). Fine-grained business rules stay in the services.",
            "Rate limiting: a token bucket per key. Per-node counters are cheap but allow N times the limit across N nodes; a shared Redis counter is accurate but adds a network hop, so many gateways use local counters with periodic syncing.",
            "Routing, load balancing across healthy instances, with a timeout, a limited retry (only for safe, idempotent calls) and a **circuit breaker** that stops sending to a failing service.",
            "Response handling: compress, cache, add headers, log metrics.",
          ],
        },
        { type: "p", text: "Gateways can also do **aggregation**: one call fetches data from three services and returns a single payload, which helps mobile clients. Give each client type its own thin gateway layer (a backend for frontend) rather than one gateway that knows every client." },
        {
          type: "table",
          head: ["Concern", "Gateway", "Service"],
          rows: [
            ["TLS, rate limits, API keys", "Yes", "No"],
            ["Token verification", "Yes", "Trusts the gateway or re-checks"],
            ["Business rules and data validation", "No", "Yes"],
            ["Cross-service orchestration", "Light aggregation only", "Workflow or orchestrator service"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Single point of failure**: run many nodes across zones, keep nodes stateless, and use health checks plus quick draining on deploy.",
            "**Added hop**: keep the filter chain short and avoid blocking remote calls inside it.",
            "**Becoming a monolith**: each business rule added to the gateway couples teams to one deploy. Hold the line at cross-cutting concerns.",
            "**Retries multiply load**: a retry at the gateway, then again in a client library, can turn a slow service into an outage. Use budgets and backoff.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Do not trust internal traffic blindly", text: "A gateway that authenticates and then lets everything inside the network talk freely means one compromised service reaches the rest. Pass an identity inward and have sensitive services verify it, or use mutual TLS between services." },
        { type: "p", text: "Common interview mistakes: putting business logic in the gateway, doing a database lookup for auth on every call, and forgetting that the gateway itself needs capacity planning and a failure plan." },
      ],
      references: [
        { title: "Pattern: API Gateway / Backends for Frontends (microservices.io)", url: "https://microservices.io/patterns/apigateway.html" },
        { title: "API gateways (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway" },
        { title: "What is Amazon API Gateway?", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html" },
        { title: "Backends for Frontends (Sam Newman)", url: "https://samnewman.io/patterns/architectural/bff/" },
      ],
    },
    points: [
      { id: "sd.api-gateway-case-study.filter-chain", title: "Filter chain at the edge", detail: "Requests pass through ordered filters for TLS, tracing, authentication, rate limiting and routing. Keep the chain short and avoid blocking remote calls in it, since every request pays that cost.", question: "How can the gateway authenticate 100,000 requests a second without calling an auth service each time?" },
      { id: "sd.api-gateway-case-study.control-and-data-plane", title: "Control plane and data plane", detail: "A control plane validates and stores route config, and stateless data-plane nodes hot-reload it and carry traffic. If the control plane fails, the nodes keep serving the last known good config.", question: "What happens to live traffic if your config service goes down?" },
      { id: "sd.api-gateway-case-study.resilience-and-limits", title: "Resilience and rate limit placement", detail: "Timeouts, bounded retries and circuit breakers stop one failing service from dragging down the whole fleet. Local rate limit counters are fast but loose, while a shared store is accurate and slower.", question: "Why can a retry policy at the gateway make an outage worse?" },
    ],
  },
};
