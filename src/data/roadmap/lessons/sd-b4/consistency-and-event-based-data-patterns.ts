import type { LessonEntry } from "@/types/roadmap";

export const CONSISTENCY_AND_EVENT_BASED_DATA_PATTERNS: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Consistency and event-based data patterns",
    slug: "consistency-and-event-based-data-patterns",
    lesson: {
      summary: "When data lives in several places, accept eventual consistency, handle conflicts, and use the outbox pattern to publish events without the dual-write trap.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Eventual consistency" },
        { type: "p", text: "In one database with transactions, two tables change together or not at all. Across services, a search index, a cache and a data warehouse, you cannot have that cheaply. **Eventual consistency** means that if no new updates arrive, all copies converge to the same value, but for some time they may disagree. An order is placed; for a second or two the search index and the analytics dashboard do not show it. That is acceptable for most reads, and it buys availability, speed and independent deployment." },
        { type: "p", text: "The design question is not whether to allow it but where. Money balances, stock at checkout and permissions need strong guarantees, so read them from the authoritative store. Feeds, counts, recommendations and search can lag." },
        { type: "h2", text: "Read-your-writes and conflict handling" },
        { type: "p", text: "Users notice when their own change is missing. **Read-your-writes** means you always see your own updates, even if others see them later. Practical ways: read that user's data from the primary for a short time after they write, return the new state in the write response and have the UI use it, or tag the session with a version and wait for a replica or read model to reach it." },
        { type: "p", text: "When two writers change the same data on different copies, you get a **conflict**. Choices:" },
        { type: "list", items: [
          "**Single writer per item**: route all writes for a record to one owner, so conflicts cannot occur. The simplest and most common answer.",
          "**Last write wins** by timestamp: easy, but silently discards one update and relies on clocks that can be wrong.",
          "**Version checks** (optimistic concurrency): an update says `WHERE version = 7`; a stale writer gets an error and retries.",
          "**Merge**: use data types that combine safely (CRDTs, counters that add, sets that union), or ask the user to resolve.",
        ] },
        { type: "h2", text: "The dual-write problem" },
        { type: "p", text: "A very common bug: after saving an order, the code also publishes `OrderPlaced` to the broker." },
        { type: "code", language: "ts", title: "Dual write: two systems, no shared transaction", code: `await db.insert("orders", order);        // 1. succeeds
await broker.publish("order.placed", order); // 2. crashes or times out
// Result: the order exists but nobody was told.
// Reverse the order of the steps and you can announce an order that was never saved.` },
        { type: "p", text: "There is no transaction that spans your database and the broker. Whichever order you pick, a crash between the two steps leaves them inconsistent, and a retry of the whole request can produce a duplicate. Wrapping both in a try/catch does not help, because the process itself may die." },
        { type: "h2", text: "The outbox pattern" },
        { type: "p", text: "The fix is to make a single database transaction do both writes: save the order and insert the event into an **outbox** table in the same database. Atomicity is now free. A separate relay then reads unsent rows from the outbox, publishes them to the broker, and marks them sent." },
        { type: "code", language: "sql", title: "Outbox in the same transaction", code: `BEGIN;
INSERT INTO orders (id, customer_id, total_cents) VALUES ('ord_4412', 'cus_88', 12900);
INSERT INTO outbox (id, aggregate_id, type, payload, created_at)
VALUES ('evt_01JAZ8K3QX', 'ord_4412', 'order.placed', '{"orderId":"ord_4412"}', now());
COMMIT;

-- relay, repeated:
SELECT * FROM outbox WHERE sent_at IS NULL ORDER BY created_at LIMIT 100 FOR UPDATE SKIP LOCKED;
-- publish each to the broker, then:
UPDATE outbox SET sent_at = now() WHERE id = ANY($1);` },
        { type: "p", text: "The relay can be a polling loop like the one above, or **change data capture** (for example Debezium reading the database log), which avoids polling load and keeps order. The relay can crash after publishing but before marking sent, so the event can go out twice. The outbox therefore gives **at-least-once** publishing, and consumers must deduplicate by event id. That is a fair trade: lost events become impossible, duplicates are handled by idempotency." },
        { type: "callout", tone: "tip", title: "The mirror image is an inbox", text: "Consumers can do the same in reverse: record the processed event id in the same transaction as the effect, so a redelivered event is detected and skipped. Outbox on the way out and inbox on the way in make the whole path safe." },
        { type: "p", text: "Remember to prune sent outbox rows, and monitor the age of the oldest unsent row, since a stuck relay silently stops all downstream updates. In interviews, name the dual-write problem explicitly, then give the outbox as the answer and mention the duplicate-delivery consequence." },
      ],
      references: [
        { title: "Pattern: Transactional outbox (microservices.io)", url: "https://microservices.io/patterns/data/transactional-outbox.html" },
        { title: "Debezium: Outbox Event Router", url: "https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html" },
        { title: "Eventually Consistent (Werner Vogels)", url: "https://www.allthingsdistributed.com/2008/12/eventually_consistent.html" },
      ],
    },
  },
};
