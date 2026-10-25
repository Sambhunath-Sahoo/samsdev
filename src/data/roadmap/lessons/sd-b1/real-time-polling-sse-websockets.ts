import type { LessonEntry } from "@/types/roadmap";

export const REAL_TIME_POLLING_SSE_WEBSOCKETS: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "Real-time: polling, SSE, WebSockets",
    slug: "real-time-polling-sse-websockets",
    lesson: {
      summary: "Four ways to get fresh data to a browser, from asking repeatedly to holding a connection open, and how to choose among them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The problem" },
        { type: "p", text: "HTTP is request and response: the client asks, the server answers. For chat messages, live scores or job progress, the server has news at unpredictable times and the client needs it soon. Each technique below bends HTTP differently, trading freshness against server cost and complexity." },
        { type: "h2", text: "Polling and long polling" },
        { type: "p", text: "**Polling** means the client asks on a timer: `GET /jobs/9/status` every 5 seconds. It is trivial, stateless, and cache and proxy friendly. The cost is wasted requests (most return 'no change') and a latency of up to one interval. With 100,000 clients polling every 5 seconds the server absorbs 20,000 requests per second even if nothing happens." },
        { type: "p", text: "**Long polling** keeps the request open until the server has something or a timeout (often 30-60 seconds) passes, then the client immediately asks again. Updates arrive almost instantly and idle traffic drops, but each client holds a connection, and every event ends a request and forces a reconnect." },
        { type: "h2", text: "WebSockets and Server-Sent Events" },
        { type: "p", text: "A **WebSocket** starts as an HTTP request with an upgrade header, then becomes a full-duplex channel over the same TCP connection: either side can send messages at any time, with small frames and no per-message headers. It fits chat, multiplayer games and collaborative editing where the client also sends often." },
        { type: "p", text: "**Server-Sent Events (SSE)** is a one-way stream from server to client over plain HTTP using the `text/event-stream` content type. The browser's `EventSource` reconnects automatically and can resume using the `Last-Event-ID` header. It suits dashboards, notifications and progress feeds, and works through ordinary HTTP infrastructure." },
        { type: "code", language: "text", title: "An SSE response", code: `HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache

id: 41
event: progress
data: {"percent": 80}
` },
        {
          type: "table",
          head: ["", "Polling", "Long polling", "SSE", "WebSocket"],
          rows: [
            ["Direction", "Client pulls", "Client pulls", "Server to client", "Both"],
            ["Latency", "Up to interval", "Near real time", "Near real time", "Near real time"],
            ["Server connections", "None idle", "One per client", "One per client", "One per client"],
            ["Auto reconnect", "n/a", "Manual", "Built in", "Manual"],
            ["Best for", "Slow changes", "Fallback", "Feeds, notifications", "Chat, games, collab"],
          ],
        },
        { type: "h2", text: "Scaling the open connections" },
        { type: "p", text: "SSE and WebSockets are stateful: each user is tied to one server holding a socket. A million connected users means spreading them over many machines (tens of thousands of sockets each is common, with tuning). To deliver a message to user B when they are connected to a different server than the sender, servers share a pub/sub layer such as Redis or Kafka, and each server forwards matching messages to its local sockets. Load balancers need idle timeouts above your heartbeat interval, and clients need reconnect with backoff." },
        { type: "callout", tone: "gotcha", title: "Reaching for WebSockets by default", text: "If the server only pushes, SSE is simpler and reuses HTTP auth, logging and proxies. Whichever you choose, plan for reconnect storms: after a deploy or outage every client reconnects at once, so add jittered backoff and send a catch-up from the last event id." },
      ],
      references: [
        { title: "Using server-sent events (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" },
        { title: "The WebSocket API (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
        { title: "RFC 6455: The WebSocket Protocol", url: "https://www.rfc-editor.org/rfc/rfc6455" },
        { title: "RFC 6202: Known Issues and Best Practices for Long Polling and Streaming in Bidirectional HTTP", url: "https://www.rfc-editor.org/rfc/rfc6202" },
      ],
    },
  },
};
