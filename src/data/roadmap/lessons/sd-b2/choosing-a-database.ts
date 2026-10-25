import type { LessonEntry } from "@/types/roadmap";

export const CHOOSING_A_DATABASE: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Choosing a database",
    slug: "choosing-a-database",
    lesson: {
      summary: "A practical way to choose a store: write down the access patterns first, default to a relational database, and justify every exception.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Start from access patterns, not products" },
        { type: "p", text: "The wrong way to choose a database is to compare feature lists. The right way is to write down what the system does with its data: which reads and writes, how often, how large, how fast, and how correct they must be. The database follows from that list." },
        { type: "list", items: ["**Reads:** lookup by key, filter and sort on many fields, full-text, range scans, joins, aggregates over millions of rows?", "**Writes:** rate per second, single-row or multi-row, must two rows change together?", "**Size and growth:** gigabytes that fit on one machine, or terabytes that will not?", "**Consistency:** is a stale read acceptable for a second, or is a lost update unacceptable?", "**Latency target:** single-digit milliseconds, or seconds are fine?"] },
        { type: "h2", text: "SQL or NoSQL: decide by access pattern" },
        { type: "p", text: "Default to a relational database such as PostgreSQL. It handles transactions, ad hoc queries and constraints, and a single well-tuned instance serves thousands of queries per second and hundreds of gigabytes. Move away from it for a named reason, not a feeling about scale." },
        {
          type: "table",
          head: ["If the dominant need is", "Reach for", "Because"],
          rows: [
            ["Money, orders, inventory, anything multi-row and correct", "Relational (PostgreSQL, MySQL)", "ACID transactions and constraints"],
            ["Get or set by exact key at huge rate, sessions, counters", "Key-value (Redis, DynamoDB)", "Hash partitioning, no query planner in the way"],
            ["Self-contained entities with varying fields", "Document (MongoDB)", "One read returns the whole entity"],
            ["Millions of writes per second, queries known up front", "Wide-column (Cassandra)", "Append-friendly, partition-per-query design"],
            ["Search by text, relevance, facets", "Search engine (Elasticsearch, OpenSearch)", "Inverted index"],
            ["Multi-hop relationships", "Graph (Neo4j)", "Cheap traversals"],
            ["Large analytical scans", "Column store / warehouse", "Columnar reads and compression"],
          ],
        },
        { type: "h2", text: "A worked example" },
        { type: "p", text: "A ride-hailing app. Trips, payments and driver accounts go in PostgreSQL: money must not be lost or double-charged. Live driver positions arrive about every 4 seconds from 200,000 drivers, roughly 50,000 writes per second of data nobody needs after an hour, so they go in Redis keyed by driver with a short TTL. Trip history for analytics is copied nightly into a warehouse. Three stores, each chosen for one pattern, with Postgres as the source of truth." },
        { type: "p", text: "Notice the pattern: the primary store holds truth; the others hold derived or short-lived copies that can be rebuilt. This is called polyglot persistence, and its cost is real. Every extra store is one more thing to run, back up, monitor and keep in sync." },
        { type: "callout", tone: "gotcha", title: "Do not pick NoSQL for scale you do not have", text: "'We might need to scale' is not an access pattern. Giving up joins and transactions early means rebuilding them in application code. If the argument is only volume, ask for numbers: writes per second, data size in a year. Many systems never leave one PostgreSQL primary with replicas." },
        { type: "h2", text: "What interviewers listen for" },
        { type: "list", items: ["You state the access patterns before naming a database.", "You justify each store with a requirement, and say what you give up.", "You identify one source of truth and treat the rest as derived.", "You know that the same engine can often cover a second need (Postgres JSON columns, full-text search, `pgvector`) before you add a new system."] },
      ],
      references: [
        { title: "Martin Fowler: Polyglot Persistence", url: "https://martinfowler.com/bliki/PolyglotPersistence.html" },
        { title: "Martin Fowler: Introduction to NoSQL", url: "https://martinfowler.com/articles/nosql-intro.html" },
        { title: "PostgreSQL documentation: JSON types", url: "https://www.postgresql.org/docs/current/datatype-json.html" },
        { title: "PostgreSQL documentation: Full text search", url: "https://www.postgresql.org/docs/current/textsearch-intro.html" },
      ],
    },
  },
};
