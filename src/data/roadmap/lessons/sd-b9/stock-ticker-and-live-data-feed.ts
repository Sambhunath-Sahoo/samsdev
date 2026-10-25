import type { LessonEntry } from "@/types/roadmap";

export const STOCK_TICKER_AND_LIVE_DATA_FEED: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Stock ticker and live data feed",
    slug: "stock-ticker-and-live-data-feed",
    lesson: {
      summary: "Push price updates for thousands of symbols to hundreds of thousands of browsers, using fan-out, conflation and the right push protocol.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: show live prices for a user's watchlist, a chart with recent history, and an alert when a price crosses a level. Non-functional: updates reach the screen within a second, many more readers than writers, graceful behaviour when a client is slow, and the right value after a reconnect. This design is for a retail display feed; a trading engine that matches orders has different, much stricter latency and ordering needs." },
        { type: "p", text: "Assume 5,000 symbols and an upstream feed averaging 100,000 updates a second, with open-market bursts several times higher. 500,000 users are connected, each watching 20 symbols. If every update went to every watcher you would send billions of messages a second, which is why the design conflates (see below). If each user receives one batched update a second for 20 symbols at 200 bytes, that is 500,000 messages a second and 100 MB/s of outbound traffic, which is fine across a gateway fleet." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "Protocol",
          code: `WS  /stream
-> {"op":"subscribe","symbols":["AAPL","MSFT"]}
<- {"t":"q","s":"AAPL","p":187.42,"v":300,"ts":1761400000123,"seq":88121}
GET /history?symbol=AAPL&interval=1m&from=...      (candles)
tick row: symbol, ts, price, volume   (time-series store, partitioned by symbol and day)`,
        },
        { type: "p", text: "Each message carries a per-symbol sequence number, so a client can detect a gap and request a snapshot. Prices are stored as integers (price in cents or ticks), never floats." },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "Upstream vendor feeds enter a **feed handler**, which normalises formats, validates and assigns sequence numbers. It publishes to a message bus partitioned by symbol, so each symbol is ordered. From there three consumers run: a **tick store** writer (time-series database, plus rolled-up one-minute candles), a **latest-price cache** (Redis, one key per symbol), and a **fan-out tier** of WebSocket gateways." },
        { type: "p", text: "Each gateway keeps a map `symbol -> connected clients` and subscribes to the bus for only the symbols its clients want. A new subscriber first receives the cached latest price, then live updates. The gateway tier scales horizontally behind a load balancer; because connections are long-lived, a deploy drains gradually and clients reconnect with backoff and jitter to avoid a thundering herd." },
        { type: "p", text: "**Conflation** is the key trick: for a display feed, only the latest price per symbol matters. The gateway keeps one slot per symbol per client and flushes every 250 to 1,000 ms, overwriting stale values. A slow client then falls behind by time, not by a growing queue. For trades that must not be skipped, such as a trade blotter, send every event and disconnect clients whose buffer exceeds a limit." },
        {
          type: "table",
          head: ["Transport", "Direction", "Notes"],
          rows: [
            ["WebSocket", "Two-way", "Subscribe and unsubscribe on one connection, the usual choice"],
            ["Server-sent events", "Server to client", "Simple, auto-reconnect, works over plain HTTP, fine for a read-only ticker"],
            ["Polling", "Client pulls", "Easy but wasteful and laggy; acceptable as a fallback"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Hot symbols**: a few names get most of the watchers. Fan out in two levels, bus to gateway then gateway to client, so the bus sends each update once per gateway, not once per user.",
            "**Open-bell burst**: conflate harder under load and let the buffer absorb the spike.",
            "**Alerts**: keep a per-symbol sorted structure of alert thresholds, so a price tick checks only the alerts it could cross.",
            "**History charts**: serve from pre-aggregated candles, not raw ticks.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Do not call it real time without a number", text: "Say what freshness you promise (for example under 1 second end to end) and what you do on a gap: detect it with the sequence number, then fetch a snapshot. Also note that retail data is often delayed by licence, and exchange data is a paid, restricted feed." },
      ],
      references: [
        { title: "MDN: WebSockets API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
        { title: "RFC 6455: The WebSocket Protocol", url: "https://www.rfc-editor.org/rfc/rfc6455" },
        { title: "HTML Standard: Server-sent events", url: "https://html.spec.whatwg.org/multipage/server-sent-events.html" },
        { title: "Redis Pub/Sub", url: "https://redis.io/docs/latest/develop/pubsub/" },
      ],
    },
    points: [
      { id: "sd.stock-ticker-and-live-data-feed.two-level-fan-out", title: "Two-level fan-out", detail: "The message bus sends each symbol update once to every gateway that needs it, and each gateway forwards it to its connected clients. This keeps hot symbols from multiplying load on the core pipeline.", question: "Why does a gateway subscribe to symbols instead of every client reading the bus directly?" },
      { id: "sd.stock-ticker-and-live-data-feed.conflation-and-backpressure", title: "Conflation and slow clients", detail: "For a display feed only the latest price matters, so the gateway overwrites stale values and flushes on a short timer. Clients that cannot keep up lag in time instead of growing an unbounded queue.", question: "When is it safe to drop intermediate price updates, and when is it not?" },
      { id: "sd.stock-ticker-and-live-data-feed.sequence-numbers-and-recovery", title: "Sequence numbers and reconnects", detail: "A per-symbol sequence number lets a client spot a missed update. On a gap or reconnect it fetches a snapshot from the latest-price cache and then resumes the stream.", question: "A mobile client reconnects after 30 seconds offline. How does it get back to a correct state?" },
    ],
  },
};
