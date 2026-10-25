import type { LessonEntry } from "@/types/roadmap";

export const API_GATEWAY_SERVICE_DISCOVERY: LessonEntry = {
  track: "system-design",
  section: "Architecture styles",
  subsection: {
    title: "API gateway and service discovery",
    slug: "api-gateway-service-discovery",
    lesson: {
      summary: "A gateway gives clients one front door to many services, and service discovery lets those services find each other as instances come and go.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "API gateway" },
        { type: "p", text: "Once a system has twenty services, a mobile app cannot be expected to know twenty addresses, handle twenty auth schemes and make twelve calls to render one screen. An API gateway is a single entry point that sits in front of the services and handles the work that every request needs." },
        {
          type: "list",
          items: [
            "**Routing:** `/orders/*` goes to the order service, `/users/*` to the user service.",
            "**Cross-cutting concerns:** TLS termination, authentication, rate limiting, request size limits, CORS and logging, done once instead of in every service.",
            "**Aggregation:** combine several backend calls into one response so the client makes one round trip.",
            "**Protocol translation:** public REST or GraphQL outside, gRPC inside.",
            "**Resilience:** timeouts, retries, circuit breaking and caching at the edge.",
          ],
        },
        { type: "p", text: "A variant is **backend for frontend (BFF)**: one gateway per client type (web, mobile), each shaped to that client's needs, so the mobile team can ask for a slim payload without affecting web." },
        { type: "callout", tone: "gotcha", title: "The gateway can become the bottleneck", text: "All traffic passes through it, so it is a single point of failure and a latency tax. Run it as several stateless instances behind a load balancer, keep heavy business logic out of it, and avoid letting one team own a gateway that every other team must queue behind for changes." },
        { type: "p", text: "An API gateway is not the same as a load balancer or reverse proxy. A load balancer spreads traffic across identical instances. A gateway understands APIs: routes by path, authenticates callers, applies per-client quotas. In practice a gateway often includes a load balancer, and many products (NGINX, Kong, Envoy-based gateways, managed cloud gateways) do both." },
        { type: "h2", text: "Service discovery" },
        { type: "p", text: "Instances are not fixed. Autoscaling adds them, deploys replace them and crashes remove them, and each gets a new IP address. Hardcoding addresses fails the moment that happens. Service discovery keeps a **registry**: a live list of which instances of each service exist and are healthy." },
        { type: "code", language: "text", title: "Registry entries for the orders service", code: `orders -> 10.0.1.14:8080  healthy  (heartbeat 3s ago)
          10.0.2.31:8080  healthy  (heartbeat 1s ago)
          10.0.3.07:8080  failing  (no heartbeat 20s -> removed)` },
        { type: "p", text: "Instances register on startup (self-registration) or a platform registers them (third-party registration), and are removed when health checks or heartbeats stop. The open question is who does the lookup." },
        {
          type: "table",
          head: ["Style", "How it works", "Trade-off"],
          rows: [
            ["Client-side discovery", "The caller queries the registry and picks an instance, for example with round-robin", "No extra hop; every client needs discovery and balancing logic"],
            ["Server-side discovery", "The caller hits a stable address; a load balancer or proxy consults the registry", "Clients stay simple; the router is one more component to run and scale"],
            ["DNS-based", "A service name resolves to current instance addresses", "Simple and universal; caching delays updates"],
          ],
        },
        { type: "p", text: "Kubernetes is the common example of server-side discovery: a **Service** gets a stable virtual IP and DNS name such as `orders.default.svc`, and the platform keeps its list of ready pods up to date. Older stacks used Consul, Eureka or ZooKeeper as the registry." },
        { type: "h2", text: "How they fit together" },
        { type: "p", text: "A request arrives at the gateway, which authenticates it and matches the route to a service name. It then asks discovery, or the platform's DNS, for a healthy instance and forwards the call. Services use the same mechanism for calls between themselves." },
        { type: "p", text: "Interview points: say the gateway handles edge concerns while service-to-service traffic often bypasses it or uses a service mesh; mention health checks and the time it takes to remove a dead instance (stale entries cause errors, so pair discovery with client retries); and note that the registry itself must be highly available." },
      ],
      references: [
        { title: "Pattern: API Gateway / Backends for Frontends (microservices.io)", url: "https://microservices.io/patterns/apigateway.html" },
        { title: "API gateways (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway" },
        { title: "Pattern: Client-side service discovery (microservices.io)", url: "https://microservices.io/patterns/client-side-discovery.html" },
        { title: "Service (Kubernetes Documentation)", url: "https://kubernetes.io/docs/concepts/services-networking/service/" },
      ],
    },
  },
};
