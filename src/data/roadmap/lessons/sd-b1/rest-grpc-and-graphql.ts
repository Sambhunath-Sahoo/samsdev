import type { LessonEntry } from "@/types/roadmap";

export const REST_GRPC_AND_GRAPHQL: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "REST, gRPC and GraphQL",
    slug: "rest-grpc-and-graphql",
    lesson: {
      summary: "REST suits public resource APIs, gRPC suits internal service calls and streaming, and GraphQL suits clients that need to shape their own responses.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "REST, gRPC and GraphQL compared" },
        { type: "p", text: "**REST** models your domain as resources with URLs and uses HTTP verbs and status codes: `GET /orders/42`, `POST /orders`. It is simple, cacheable by any proxy or CDN, and works from a browser and curl. In practice most 'REST' APIs are JSON over HTTP with sensible resource naming rather than full hypermedia." },
        { type: "p", text: "**gRPC** is a remote procedure call framework: you define services and messages in Protocol Buffers, generate client and server code, and call methods as if local. It runs over HTTP/2 with a compact binary encoding. **GraphQL** exposes one endpoint and a typed schema; the client sends a query naming exactly the fields it wants and gets that shape back." },
        {
          type: "table",
          head: ["", "REST", "gRPC", "GraphQL"],
          rows: [
            ["Contract", "OpenAPI (optional)", "`.proto` file, enforced", "Schema, enforced"],
            ["Payload", "JSON, text", "Protobuf, binary", "JSON"],
            ["Caching", "Native HTTP caching", "Manual", "Hard; usually POST"],
            ["Streaming", "Awkward", "Built in, 4 modes", "Subscriptions"],
            ["Browser", "Yes", "Needs gRPC-Web proxy", "Yes"],
            ["Best for", "Public and CRUD APIs", "Internal low-latency calls", "Many client shapes"],
          ],
        },
        { type: "h2", text: "gRPC: contracts, streaming and limits" },
        { type: "code", language: "protobuf", title: "order.proto", code: `service OrderService {
  rpc GetOrder (GetOrderRequest) returns (Order);                 // unary
  rpc WatchOrders (WatchRequest) returns (stream Order);          // server streaming
}
message GetOrderRequest { string id = 1; }
message Order { string id = 1; int64 total_cents = 2; string status = 3; }` },
        { type: "p", text: "Field numbers, not names, go on the wire, so you can add fields safely and must never reuse a number. Besides unary calls, gRPC supports server streaming, client streaming and bidirectional streaming over one connection. Always set a **deadline** on each call so a slow dependency cannot hold resources forever." },
        { type: "p", text: "Limits: payloads are unreadable without tooling, browsers cannot speak it directly, and standard HTTP caches and load balancers need HTTP/2 awareness. Because HTTP/2 multiplexes many calls over one long-lived connection, a plain layer-4 load balancer can pin all traffic from a client to one backend; use a layer-7 balancer or client-side balancing." },
        { type: "h2", text: "GraphQL trade-offs" },
        { type: "p", text: "GraphQL fixes **over-fetching** (getting fields you do not need) and **under-fetching** (needing several round trips). A mobile screen can fetch a user, their last orders and the product names in one request. That power moves complexity to the server." },
        { type: "list", items: ["**N+1 queries**: a resolver per field can trigger one database call per item. Batch them with a DataLoader-style layer.", "**Unbounded cost**: clients can send deeply nested or huge queries. Enforce depth and complexity limits, and prefer persisted queries.", "**Caching and monitoring**: everything is `POST /graphql` with status 200, so edge caching and error dashboards need extra work.", "**Authorization** must be applied per field, not just per endpoint."] },
        { type: "p", text: "A sensible pattern: gRPC between internal services, REST or GraphQL at the edge for outside clients, with a gateway translating between them." },
        { type: "callout", tone: "gotcha", title: "Do not pick by fashion", text: "'GraphQL is better than REST' is not an answer. Name the client shapes, the latency budget and who consumes the API. A single public integration with stable resources is better served by REST; ten microservices calling each other thousands of times per second is where gRPC's overhead savings matter." },
      ],
      references: [
        { title: "Introduction to gRPC", url: "https://grpc.io/docs/what-is-grpc/introduction/" },
        { title: "gRPC Deadlines", url: "https://grpc.io/docs/guides/deadlines/" },
        { title: "Introduction to GraphQL", url: "https://graphql.org/learn/" },
        { title: "Richardson Maturity Model (Martin Fowler)", url: "https://martinfowler.com/articles/richardsonMaturityModel.html" },
      ],
    },
  },
};
