import type { RoadmapSubsection } from "@/types/roadmap";

export const CACHE_PATTERNS: RoadmapSubsection = {
  title: "Cache patterns: aside, write-through, write-back",
  points: [
    {
      id: "sd.caching.cache-aside",
      title: "Cache-aside (lazy loading)",
      detail:
        "The application checks the cache first; on a miss it reads the database, stores the value with a TTL and returns it. Writes go to the database and then delete or update the cache entry. Only requested data is cached and a cache outage degrades to slower reads, but the first read of each key is slow and freshness depends on invalidation.",
      question: "Walk through a read miss and a write in cache-aside. What is stale if the delete after a write fails?",
    },
    {
      id: "sd.caching.write-through",
      title: "Write-through",
      detail:
        "Every write updates the cache and the database as one operation, and the write returns only after both succeed. Reads are fresh and hit the cache, but writes are slower and you may cache data that is never read. It suits data that is read soon after it is written and where staleness matters.",
      question: "What does write-through add to the write path compared with cache-aside?",
    },
    {
      id: "sd.caching.write-back",
      title: "Write-back (write-behind)",
      detail:
        "The application writes to the cache and returns at once, and the cache flushes to the database later, often in batches. Writes are very fast and can be coalesced, but anything not yet flushed is lost if the cache node dies, and the database lags behind the cache. Use it only where losing a few seconds of writes is acceptable, such as view counters, or where the cache layer keeps its own durable log.",
      question: "Which data would you never put behind a write-back cache, and why?",
    },
  ],
};

export const REDIS_VS_DATABASE: RoadmapSubsection = {
  title: "Redis versus the database",
  points: [
    {
      id: "sd.caching.redis-vs-database",
      title: "Redis or the database: cache versus source of truth",
      detail:
        "Redis is in-memory, very fast and by default ephemeral, so it fits sessions, hot keys, counters and rate-limit state. The database is durable, supports complex queries and constraints and stays the source of truth. A cache can be lost and rebuilt; if losing the data would lose business information, it belongs in the database, or Redis must be run as a primary store with persistence and replicas.",
      question: "Your product catalog exists only in Redis. What risks do you accept and how do you reduce them?",
    },
  ],
};

export const REST_GRPC_GRAPHQL: RoadmapSubsection = {
  title: "REST, gRPC and GraphQL",
  points: [
    {
      id: "sd.networking.rest-grpc-graphql-compared",
      title: "REST, gRPC and GraphQL compared",
      detail:
        "REST uses resources over HTTP with JSON, is human-readable and browser-friendly, and is the default for public APIs. gRPC uses Protocol Buffers over HTTP/2, a compact binary format with generated, strongly typed clients, so it is faster and suits internal service-to-service calls. GraphQL lets the client name exactly the fields it wants from one endpoint, which cuts over- and under-fetching and suits mobile apps and varied frontends.",
      question: "Pick an API style for a public developer API, an internal payment call and a mobile app with many screens.",
    },
    {
      id: "sd.networking.grpc-in-practice",
      title: "gRPC: contracts, streaming and limits",
      detail:
        "gRPC services are defined in .proto files from which clients and servers are generated, so the contract is explicit, and adding optional fields is a compatible change as long as field numbers are never reused. HTTP/2 multiplexing gives server, client and bidirectional streaming, and deadlines propagate across calls. Browsers cannot call it directly without gRPC-Web or a gateway, and binary payloads are harder to inspect with curl.",
      question: "Why must you never renumber or reuse a protobuf field, and what is a gRPC deadline?",
    },
    {
      id: "sd.networking.graphql-tradeoffs",
      title: "GraphQL trade-offs",
      detail:
        "A GraphQL schema evolves by adding fields and deprecating old ones instead of versioning the endpoint. The costs sit on the server: naive resolvers cause N+1 queries, which dataloaders fix; HTTP caching is harder because queries usually go as POSTs to one URL; and clients can send expensive deeply nested queries, so you need depth and cost limits or persisted queries.",
      question: "What stops one deeply nested GraphQL query from taking the database down?",
    },
  ],
};

export const REAL_TIME: RoadmapSubsection = {
  title: "Real-time: polling, SSE, WebSockets",
  points: [
    {
      id: "sd.networking.polling-and-long-polling",
      title: "Polling and long polling",
      detail:
        "Short polling has the client ask on a fixed interval: it is simple and works everywhere, but wastes requests when nothing changed and delays updates by up to the interval. Long polling holds each request open until the server has data or a timeout, and the client immediately asks again, which cuts delay and empty responses but ties up a connection per client.",
      question: "Compare request volume and update delay for 100k idle clients polling every 5 seconds versus long polling.",
    },
    {
      id: "sd.networking.websockets-and-sse",
      title: "WebSockets and Server-Sent Events",
      detail:
        "A WebSocket is one long-lived, full-duplex connection started with an HTTP upgrade, suited to chat, collaboration and live dashboards where both sides send. Server-Sent Events are a one-way stream from server to browser over plain HTTP with automatic reconnect, ideal for notifications and streamed text. Both hold a connection per user, so capacity planning is about open connections, load balancing that tolerates reconnects, and heartbeats to detect dead peers.",
      question: "Chat needs WebSockets but a live score ticker may not. Why?",
    },
  ],
};

export const API_DESIGN: RoadmapSubsection = {
  title: "API design: pagination, versioning, error formats",
  points: [
    {
      id: "sd.networking.api-versioning-and-compatibility",
      title: "Versioning and compatible changes",
      detail:
        "Prefer changes that do not break clients: adding optional fields or new endpoints is compatible, while removing or renaming fields, changing types or tightening validation is not. When you must break, version explicitly, either in the URL (/v2/orders, easy to see and route) or in a header or media type (cleaner URLs, harder to test). Announce deprecations with dates and watch usage of the old version before removing it.",
      question: "Which of these are breaking: add a response field, rename a field, make an optional parameter required?",
    },
    {
      id: "sd.networking.api-pagination-contract",
      title: "Pagination in an API contract",
      detail:
        "Offset pagination (?page=3) is simple but gets slow on deep pages and can skip or repeat items when data changes between requests. Cursor pagination returns an opaque token for the position after the last item, which stays fast and stable. Return the next cursor and set a default and a maximum page size; keep the cursor opaque so you can change its internals.",
      question: "Why does a feed that is constantly inserted into break with page numbers but not with cursors?",
    },
    {
      id: "sd.networking.api-error-format",
      title: "A consistent error format",
      detail:
        "Use accurate status codes (400 bad input, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 429 rate limited, 5xx server faults) and one error body shape with a stable machine-readable code, a human message and a request id. RFC 9457 Problem Details is a standard shape. Never leak stack traces or internals, and make it clear whether retrying can help.",
      question: "What fields go into every error response so a support engineer can trace one failed request?",
    },
  ],
};

export const MESSAGING_CHOICES: RoadmapSubsection = {
  title: "Choosing a messaging style and broker",
  points: [
    {
      id: "sd.events.sync-vs-async-communication",
      title: "Synchronous vs asynchronous communication",
      detail:
        "A synchronous call (REST or gRPC) fits when the caller needs the answer now, but it couples both services in availability and latency. Asynchronous messaging through Kafka or a queue lets the caller continue, absorbs bursts and lets many consumers react, at the cost of delayed results, duplicates and harder debugging. Use sync for queries and anything the user waits on, and async for notifications, analytics and work that can finish later.",
      question: "Placing an order triggers an email, an invoice and analytics. Which calls would you make synchronous and which asynchronous?",
    },
    {
      id: "sd.events.kafka-rabbitmq-sqs-choice",
      title: "Choosing Kafka, RabbitMQ or SQS",
      detail:
        "Kafka is a partitioned, durable log with consumer groups and replay, built for very high-throughput event streams and analytics pipelines. RabbitMQ is a broker with exchanges and flexible routing (direct, topic, fanout) and per-message acknowledgements, suited to task queues and routing at lower volume. SQS is a managed queue with almost no operations and at-least-once delivery on standard queues, a good default for simple background jobs on AWS.",
      question: "Pick a broker for distributing image-thumbnail jobs and another for a replayable click stream, and justify each.",
    },
    {
      id: "sd.events.pub-sub-vs-point-to-point",
      title: "Pub/sub vs point-to-point",
      detail:
        "In point-to-point (a work queue) each message goes to exactly one of several competing consumers, which spreads work. In publish/subscribe each message is delivered to every subscriber group, so several services can react independently to the same event. Kafka consumer groups and SNS-to-SQS fan-out combine both: pub/sub between groups and competition inside a group.",
      question: "How do three services each receive every order event while each runs ten workers?",
    },
  ],
};

export const ARCHITECTURE_MONOLITH_VS_MICROSERVICES: RoadmapSubsection = {
  title: "Monolith vs microservices",
  points: [
    {
      id: "sd.architecture.monolith-first",
      title: "Monolith first",
      detail:
        "A monolith is one deployable unit: simple to develop, test, deploy and debug, with in-process calls and ordinary transactions. Starting with a well-structured, modular monolith is usually right, because boundaries are unclear early and splitting too soon means paying distributed-system costs for nothing.",
      question: "Why is a modular monolith often a better start than microservices for a five-person team?",
    },
    {
      id: "sd.architecture.when-to-split-microservices",
      title: "When to split into microservices",
      detail:
        "Microservices give independent scaling and deploys, team ownership along bounded contexts and fault isolation. They add network failures and latency, data without joins or shared transactions, versioned contracts, and heavy operations and observability needs. Split when teams block each other, parts have very different scaling or release needs, and the organisation can afford the platform work.",
      question: "Name three signs a part should become its own service and three costs you then take on.",
    },
  ],
};

export const API_GATEWAY_AND_DISCOVERY: RoadmapSubsection = {
  title: "API gateway and service discovery",
  points: [
    {
      id: "sd.architecture.api-gateway",
      title: "API gateway",
      detail:
        "An API gateway is the single entry point that handles cross-cutting concerns at the edge: authentication, rate limiting, routing to services, TLS termination and request logging, sometimes aggregating responses. It keeps those concerns out of every service, but it is a critical component that must be highly available, and business logic placed in it becomes a bottleneck and a coupling point. A backend-for-frontend gives each client type its own gateway.",
      question: "What belongs in an API gateway and what does not?",
    },
    {
      id: "sd.architecture.service-discovery",
      title: "Service discovery",
      detail:
        "Instances come and go with autoscaling and deploys, so callers cannot hard-code addresses. A registry such as Consul or etcd, or DNS in Kubernetes, maps a service name to healthy instances. With client-side discovery the caller picks an instance and balances itself; with server-side discovery a load balancer or kube-proxy does, and health checks remove dead instances.",
      question: "How does one pod find another in Kubernetes, and what happens when a target pod dies?",
    },
  ],
};

export const SECURITY: RoadmapSubsection = {
  title: "Security: authN and authZ, OAuth",
  points: [
    {
      id: "sd.architecture.authn-vs-authz",
      title: "Authentication vs authorization",
      detail:
        "Authentication proves who you are with a password, key, token or certificate. Authorization decides what that identity may do, through roles, permissions or policies. Check authorization on the server for every request and close to the data, not only in the UI or at the gateway, because broken access control is among the most common web vulnerabilities.",
      question: "A user is logged in. What further check stops them reading another user's invoice by changing the id in the URL?",
    },
    {
      id: "sd.architecture.sessions-vs-jwt",
      title: "Server sessions vs JWTs",
      detail:
        "A server session keeps state on the server or in Redis and gives the client an opaque cookie, so it can be revoked instantly. A JWT is a signed token with claims that any service can verify without a lookup, which suits stateless APIs, but it stays valid until it expires. Keep access tokens short-lived, use refresh tokens and a revocation plan, and in browsers prefer HttpOnly cookies so scripts cannot read the token.",
      question: "An account is compromised. How fast can you cut off access under sessions versus a 24-hour JWT?",
    },
    {
      id: "sd.architecture.oauth-and-oidc",
      title: "OAuth 2.0 and OpenID Connect",
      detail:
        "OAuth 2.0 is for delegated authorization: a user lets an app access their data at another service without sharing a password, and the app receives a scoped access token. OpenID Connect adds an ID token on top so the app also learns who the user is, which is how 'Sign in with Google' works. Browser and mobile apps should use the authorization code flow with PKCE.",
      question: "What is the difference between OAuth and OpenID Connect, and which one answers 'who is this user'?",
    },
    {
      id: "sd.architecture.tls-mtls-secrets",
      title: "TLS, mTLS and secrets",
      detail:
        "TLS encrypts traffic and lets the client verify the server's certificate. Mutual TLS makes the client present a certificate as well, so services prove their identity to each other, and a service mesh can automate it. Secrets such as passwords and API keys belong in a secrets manager or are injected at runtime and rotated, never in source control or container images.",
      question: "What does mTLS add over TLS between two internal services?",
    },
  ],
};

export const OBSERVABILITY_LOGS_AND_METRICS: RoadmapSubsection = {
  title: "Logs and metrics",
  points: [
    {
      id: "sd.reliability.three-pillars",
      title: "Logs, metrics and traces",
      detail:
        "Logs record what happened in a specific event, metrics are numbers over time that show how much and how often, and traces follow one request across services to show where the time went. Metrics tell you something is wrong, traces tell you where, and logs tell you why. Use structured logs carrying a request id so the three can be joined.",
      question: "A latency alert fires. Which pillar do you open first, second and third, and why?",
    },
    {
      id: "sd.reliability.what-to-monitor",
      title: "What to monitor: percentiles, errors and saturation",
      detail:
        "Track latency as percentiles (p50, p95, p99) rather than averages, plus request rate, error rate and saturation: how full CPU, memory, connections, queues and disks are. These are the four golden signals, close to the RED and USE methods. Prometheus scrapes the metrics, Grafana draws them, and alerts should fire on user-visible symptoms or SLO burn rather than on every blip.",
      question: "Which four signals go on every service dashboard?",
    },
  ],
};

export const HIGH_AVAILABILITY: RoadmapSubsection = {
  title: "High availability design",
  points: [
    {
      id: "sd.reliability.high-availability-checklist",
      title: "Designing for high availability",
      detail:
        "Remove single points of failure by running redundant instances of every tier across multiple availability zones, with health checks that pull bad instances out of rotation and automatic failover for stateful parts such as the database primary. Add graceful degradation so a failing non-critical dependency removes a feature instead of the whole product, and monitoring to detect and measure it. Each extra nine costs more, so match the target to the business need.",
      question: "List the single points of failure in a one-region app with one database and say how you would remove each.",
    },
  ],
};
