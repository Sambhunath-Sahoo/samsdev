import type { LessonEntry } from "@/types/roadmap";

export const CONNECTION_POOLING: LessonEntry = {
  track: "system-design",
  section: "Databases in practice",
  subsection: {
    title: "Connection pooling",
    slug: "connection-pooling",
    lesson: {
      summary: "Why opening a database connection per request fails under load, how to size a pool, and when to put PgBouncer in front.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why databases need a connection pool" },
        { type: "p", text: "Opening a database connection is slow: a TCP handshake, usually TLS, authentication, and session setup. Doing it for every request adds tens of milliseconds and wastes CPU. Connections are also expensive on the server. PostgreSQL runs one operating system process per connection, each using memory, and its default `max_connections` is 100. A busy service with 50 app instances and 20 requests each would try for 1,000." },
        { type: "p", text: "A **connection pool** opens a fixed set of connections once and lends them out. A request borrows a connection, runs its queries, and returns it. The database sees a small steady number of connections, and your app skips the setup cost." },
        { type: "h2", text: "Pool sizing: smaller than you think" },
        { type: "p", text: "More connections do not mean more throughput. A database can only run as many queries truly in parallel as it has CPU cores and disks. Beyond that, extra connections just fight over the same resources and add context switching. A widely quoted starting point from the HikariCP project is **about `(cores * 2) + disks`** connections, so a 4-core server is well served by roughly 10, not 200. Measure, then adjust." },
        { type: "p", text: "Remember that the limit is across all clients. With `max_connections = 100`, keep some spare for admin and migrations, then divide the rest across instances." },
        {
          type: "code",
          language: "text",
          title: "Budget example",
          code: `max_connections            100
reserved (admin, migrations, monitoring)  -10
available for apps          90
app instances                6
pool size per instance      15   (6 x 15 = 90)

Autoscale to 12 instances? 12 x 15 = 180 > 90. The pool must shrink,
or you need an external pooler.`,
        },
        { type: "h2", text: "Pool exhaustion" },
        { type: "p", text: "When every connection is in use, new requests wait in a queue and eventually time out. The usual causes:" },
        { type: "list", items: ["**Connection leaks:** code borrows a connection and never returns it on an error path. Always release in a `finally` or use a helper that does.", "**Slow queries or long transactions:** a connection held for 5 seconds serves one request instead of hundreds.", "**Holding a connection while waiting on something else,** such as an HTTP call to a payment API inside a transaction.", "**Pool bigger than the database limit,** so the database refuses connections."] },
        { type: "p", text: "Set a **checkout timeout** so callers fail fast instead of piling up, and expose pool metrics (active, idle, waiting) on a dashboard. A rising 'waiting' count is the early warning." },
        { type: "h2", text: "External poolers" },
        { type: "p", text: "An in-app pool is per process. With many instances, serverless functions or many microservices, the total still exceeds the database limit. An external pooler such as **PgBouncer** sits between all apps and the database, accepting thousands of client connections and multiplexing them onto a few dozen server connections." },
        {
          type: "table",
          head: ["PgBouncer mode", "Server connection held", "Trade-off"],
          rows: [
            ["Session", "For the whole client session", "Safest, saves little"],
            ["Transaction", "Only during a transaction", "Best multiplexing; session state does not persist"],
            ["Statement", "Per statement", "No multi-statement transactions; rarely used"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Transaction mode breaks session state", text: "In transaction mode, consecutive transactions may run on different server connections. Session-level features such as `SET` values, advisory locks, `LISTEN/NOTIFY` and (in older versions) named prepared statements may not behave as the client expects. Check your driver and pooler versions." },
        { type: "p", text: "In interviews, give the cause (process per connection), the fix (pool), the sizing rule (small, matched to cores) and the escape hatch (external pooler for many clients)." },
      ],
      references: [
        { title: "HikariCP wiki: About Pool Sizing", url: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing" },
        { title: "PostgreSQL wiki: Number Of Database Connections", url: "https://wiki.postgresql.org/wiki/Number_Of_Database_Connections" },
        { title: "PgBouncer: Features", url: "https://www.pgbouncer.org/features.html" },
        { title: "PostgreSQL documentation: Connections and Authentication", url: "https://www.postgresql.org/docs/current/runtime-config-connection.html" },
      ],
    },
  },
};
