import type { RoadmapTrack } from "@/types/roadmap";
import { FOUNDATIONS } from "./foundations";
import { outline } from "./outline";

export const SYSTEM_DESIGN: RoadmapTrack = {
  id: "system-design",
  title: "System design",
  description: "From scaling vocabulary to full case studies and AI systems, in suggested learning order.",
  hue: "orange",
  sections: [
    FOUNDATIONS,
    outline("Networking and APIs", "How a request travels and how services talk to each other.", [
      "How a request travels: DNS, TCP, TLS, HTTP",
      "REST, gRPC and GraphQL",
      "Real-time: polling, SSE, WebSockets",
      "API design: pagination, versioning, idempotency keys, rate limits",
    ]),
    outline("Data storage", "Choosing where data lives.", [
      "SQL fundamentals and indexing",
      "NoSQL families: key-value, document, wide-column, graph",
      "Choosing a database",
      "Search and vector stores",
      "Object storage",
    ]),
    outline("Caching and CDN", "Serving repeat reads without hitting the source.", [
      "Cache patterns: aside, write-through, write-back",
      "Eviction and invalidation",
      "Redis in practice",
      "CDN and edge",
    ]),
    outline("Scaling and distribution", "Spreading load and data across machines.", [
      "Load balancing: L4, L7, algorithms",
      "Replication",
      "Sharding and partitioning",
      "Consistent hashing",
    ]),
    outline("Async and messaging", "Decoupling work with queues and streams.", [
      "Queues vs streams",
      "Kafka, RabbitMQ and SQS",
      "Delivery guarantees and idempotency",
      "Backpressure, retries and dead-letter queues",
    ]),
    outline("Distributed systems theory", "What breaks when data lives on many machines.", [
      "CAP and PACELC",
      "Consistency models",
      "Consensus and leader election: Raft, Paxos",
      "Distributed transactions: 2PC and Saga",
      "Time and ordering",
    ]),
    outline("Reliability and observability", "Staying up and knowing when you are not.", [
      "Failure handling: timeouts, retries, circuit breakers, bulkheads",
      "Redundancy and disaster recovery",
      "Logs, metrics and traces",
      "SLOs and error budgets",
    ]),
    outline("Architecture styles", "How systems are carved into services.", [
      "Monolith vs microservices",
      "API gateway and service discovery",
      "Event-driven architecture",
      "Security: authN and authZ, OAuth, rate limiting",
    ]),
    outline("Classic case studies", "The standard interview problems, built from the earlier sections.", [
      "Starter: URL shortener, rate limiter",
      "Social and messaging: news feed, chat, notifications",
      "Storage and media: file storage, video streaming",
      "Infrastructure: distributed cache, KV store, job scheduler",
    ]),
    outline("AI system design", "Design problems from the AI engineering side.", [
      "RAG at scale",
      "LLM gateway",
      "Agent platform",
      "Evaluation, cost and latency",
    ]),
    outline("Interview craft and low-level design", "Delivering a design under time pressure, plus the OOP side.", [
      "A repeatable framework: requirements, estimates, design, deep dive, trade-offs",
      "Communication and mock interviews",
      "Low-level design: SOLID, patterns, machine coding",
    ]),
  ],
};
