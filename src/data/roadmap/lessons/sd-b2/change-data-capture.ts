import type { LessonEntry } from "@/types/roadmap";

export const CHANGE_DATA_CAPTURE: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Change Data Capture",
    slug: "change-data-capture",
    lesson: {
      summary: "Stream every committed row change out of a database by reading its transaction log, instead of polling or dual-writing.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The problem" },
        { type: "p", text: "Your orders live in PostgreSQL. A search index, a cache, an analytics warehouse and another service all need to know when an order changes. If the application writes to the database and then also to each of those, one of the writes will eventually fail and leave them out of step. This is the **dual-write problem**, and there is no transaction spanning a database and a message broker." },
        { type: "h2", text: "What CDC does" },
        { type: "p", text: "Change Data Capture turns committed changes into an ordered stream of events. A change is an insert, update or delete with the row's before and after values. Consumers read the stream and update their own stores, so the database remains the single source of truth and everything else follows it." },
        { type: "h2", text: "Three ways to do it" },
        {
          type: "table",
          head: ["Method", "How", "Weakness"],
          rows: [
            ["Polling", "Query `WHERE updated_at > :last` on a timer", "Misses deletes, needs an indexed timestamp, adds load, delay equals the interval"],
            ["Triggers", "A DB trigger writes each change to an audit table", "Slows every write, extra schema, hard to maintain"],
            ["Log-based", "Read the database's own write-ahead log or binlog", "Needs log access and configuration, but cheap and complete"],
          ],
        },
        { type: "p", text: "Log-based CDC is the standard answer. The database already records every committed change in order for crash recovery and replication. A connector reads that log like a replica would, adding almost no load and capturing deletes and the exact commit order. **Debezium** is the common open source tool: it reads PostgreSQL logical decoding, MySQL binlog and others, and publishes events to Kafka topics, one per table." },
        {
          type: "code",
          language: "json",
          title: "A change event (simplified)",
          code: `{
  "op": "u",
  "source": { "table": "orders", "lsn": 23917448 },
  "before": { "id": 42, "status": "PAID" },
  "after":  { "id": 42, "status": "SHIPPED" },
  "ts_ms": 1767225600000
}`,
        },
        { type: "h2", text: "Where it fits" },
        { type: "list", items: ["Keeping a search index or cache in step with the database.", "Feeding a warehouse with near-real-time data without hammering the primary.", "Migrating between databases with little downtime by streaming changes while copying.", "The **transactional outbox**: write the business row and an event row in one transaction, and let CDC publish the outbox table, which solves dual-write for service events."] },
        { type: "h2", text: "What to get right" },
        { type: "p", text: "Delivery is **at least once**. After a connector restart, some events arrive twice, so consumers must be idempotent, for example by upserting on the row key or tracking the last log position applied. Order is preserved per key if you partition the stream by primary key, but not across tables. A new consumer needs an initial **snapshot** of existing rows before it can follow live changes." },
        { type: "callout", tone: "gotcha", title: "A stuck consumer can fill the primary's disk", text: "PostgreSQL keeps WAL for each replication slot until the consumer confirms it. If the connector goes down for days, the retained WAL grows until the database runs out of disk. Monitor slot lag and alert on it, and drop slots that are no longer used." },
        { type: "p", text: "Also remember schema changes: a column rename changes every downstream event, so versioning or a schema registry matters. In interviews, name CDC as the fix whenever two stores must stay consistent, and state its eventual consistency and idempotency requirements." },
      ],
      references: [
        { title: "Debezium documentation: Architecture", url: "https://debezium.io/documentation/reference/stable/architecture.html" },
        { title: "Debezium documentation: Connector for PostgreSQL", url: "https://debezium.io/documentation/reference/stable/connectors/postgresql.html" },
        { title: "PostgreSQL documentation: Logical Replication", url: "https://www.postgresql.org/docs/current/logical-replication.html" },
        { title: "microservices.io: Transactional outbox", url: "https://microservices.io/patterns/data/transactional-outbox.html" },
        { title: "microservices.io: Transaction log tailing", url: "https://microservices.io/patterns/data/transaction-log-tailing.html" },
      ],
    },
    points: [
      { id: "sd.change-data-capture.log-based-capture", title: "Log-based capture beats polling and triggers", detail: "Reading the write-ahead log or binlog captures every committed change, including deletes, in commit order, with little load on the database. Polling misses deletes and adds delay; triggers slow each write.", question: "Why is reading the transaction log better than polling an updated_at column?" },
      { id: "sd.change-data-capture.at-least-once", title: "At-least-once delivery needs idempotent consumers", detail: "After a restart a connector may resend events, so consumers must apply changes safely more than once, for example by upserting on the primary key or tracking the last applied position.", question: "Your search indexer receives the same change event twice. How do you keep the index correct?" },
      { id: "sd.change-data-capture.outbox", title: "CDC and the outbox pattern", detail: "Write the business change and an outbox row in one transaction, then publish the outbox with CDC. This avoids the dual-write problem between a database and a broker.", question: "How does an outbox table plus CDC guarantee that an event is published for every committed order?" },
      { id: "sd.change-data-capture.replication-slot-lag", title: "Watch replication slot lag", detail: "The database retains log data until the consumer confirms it. A stalled connector makes the log grow without bound and can fill the primary's disk.", question: "What operational risk does an abandoned replication slot create in PostgreSQL?" },
    ],
  },
};
