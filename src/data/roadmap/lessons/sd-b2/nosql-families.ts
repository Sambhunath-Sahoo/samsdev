import type { LessonEntry } from "@/types/roadmap";

export const NOSQL_FAMILIES: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "NoSQL families: key-value, document, wide-column, graph",
    slug: "nosql-families",
    lesson: {
      summary: "Four kinds of non-relational store, what each one is built around, and the access pattern that makes it the right pick.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What NoSQL actually means" },
        { type: "p", text: "NoSQL is not one technology. It is a label for stores that dropped some part of the relational model, usually joins, a fixed schema or full multi-row transactions, in exchange for something else: simpler scaling, a flexible shape, or speed on one kind of query. Each family is built around one access pattern. Pick by the pattern, not by the brand." },
        { type: "h2", text: "The four families" },
        {
          type: "table",
          head: ["Family", "Data model", "Built for", "Examples"],
          rows: [
            ["Key-value", "Opaque value looked up by key", "Get/put by exact key at very high speed: sessions, caches, counters, rate limits", "Redis, DynamoDB, Memcached"],
            ["Document", "JSON-like document with nested fields", "Read and write one self-contained entity at a time, with a shape that varies", "MongoDB, Couchbase, Firestore"],
            ["Wide-column", "Rows found by partition key, columns grouped and sorted inside the partition", "Huge write volume, queries known in advance, time series and event logs", "Cassandra, HBase, Bigtable"],
            ["Graph", "Nodes and edges with properties", "Queries that walk relationships several hops deep", "Neo4j, Amazon Neptune"],
          ],
        },
        { type: "h2", text: "Key-value" },
        { type: "p", text: "The simplest model: `GET key`, `SET key value`. With no query language to evaluate, lookups are very fast and the store partitions trivially by hashing the key. Redis adds data structures (lists, sets, sorted sets, hashes), which is why it fits leaderboards and queues as well as caches. The limit is that you can only ask for a key you already know. Finding every session for one user needs a second index you build yourself." },
        { type: "h2", text: "Document" },
        { type: "p", text: "A document store keeps an order together with its line items in one record, so one read returns everything a screen needs. That works well when the entity is read and written as a unit and each document stands alone. It works badly when many documents reference each other, because joins are limited or absent and you end up copying data around." },
        { type: "h2", text: "Wide-column" },
        { type: "p", text: "In Cassandra you design the table for the query. The **partition key** decides which nodes hold a row; **clustering columns** sort rows inside the partition. A table `messages_by_chat` with partition key `chat_id` and clustering on `sent_at DESC` returns the latest 50 messages from one node in one sequential read. The price is that any query not matching that key layout is slow or impossible, and writes are append-only, so updates and deletes leave tombstones that must be compacted." },
        {
          type: "code",
          language: "sql",
          title: "CQL: the table is shaped by the query",
          code: `CREATE TABLE messages_by_chat (
  chat_id   uuid,
  sent_at   timestamp,
  sender_id uuid,
  body      text,
  PRIMARY KEY ((chat_id), sent_at)
) WITH CLUSTERING ORDER BY (sent_at DESC);

SELECT * FROM messages_by_chat WHERE chat_id = ? LIMIT 50;`,
        },
        { type: "h2", text: "Graph" },
        { type: "p", text: "Friends of friends, fraud rings, recommendation paths. In a relational database each hop is another self-join and cost grows quickly with depth. A graph database stores edges as direct references, so following a relationship costs the same however large the whole graph is. Use it when the relationships are the question. For one or two hops, a join on an indexed table is usually fine." },
        { type: "callout", tone: "gotcha", title: "Schema-less is not design-less", text: "A flexible schema moves the schema into your application code. Every reader must cope with old document shapes, and a typo in a field name silently creates a new field. Teams that skip modelling pay for it later in migrations they have to write by hand." },
        { type: "p", text: "A common interview mistake is to name a NoSQL store because the scale sounds large. Most systems fit on one well-indexed relational database for a long time. Choose NoSQL when you can name the access pattern that the relational model handles badly." },
      ],
      references: [
        { title: "Redis documentation: Data types", url: "https://redis.io/docs/latest/develop/data-types/" },
        { title: "Apache Cassandra documentation: Architecture overview", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html" },
        { title: "MongoDB manual: Data modeling introduction", url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/" },
        { title: "Martin Fowler: Polyglot Persistence", url: "https://martinfowler.com/bliki/PolyglotPersistence.html" },
        { title: "Amazon DynamoDB: What is DynamoDB?", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html" },
      ],
    },
  },
};
