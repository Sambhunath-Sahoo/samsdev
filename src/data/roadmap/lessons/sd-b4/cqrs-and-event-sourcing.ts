import type { LessonEntry } from "@/types/roadmap";

export const CQRS_AND_EVENT_SOURCING: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "CQRS and event sourcing",
    slug: "cqrs-and-event-sourcing",
    lesson: {
      summary: "CQRS separates the model you write through from the models you read from; event sourcing stores the history of changes instead of the current state.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "CQRS" },
        { type: "p", text: "**Command Query Responsibility Segregation** means using different models for changing data (commands) and for reading it (queries). Often one model serves both, and that is fine. CQRS earns its place when the two needs pull apart: writes need strict validation and transactions on a normalized schema, while reads need denormalized, pre-joined shapes at high volume, such as an order page that combines customer, items, shipping and status in one fast lookup." },
        { type: "p", text: "The simple form is one database with separate code paths. The fuller form has a **write model** (normalized, enforces rules) that publishes changes, and one or more **read models** (a denormalized table, a search index, a cache) built from those changes. The read side is updated asynchronously, so it is eventually consistent with the write side." },
        { type: "table", head: ["", "Single model", "CQRS with separate read store"], rows: [
          ["Complexity", "Low", "Higher: two models and a sync path"],
          ["Read performance", "Joins at query time", "Pre-shaped data, scale reads separately"],
          ["Consistency", "Immediate", "Eventual on reads"],
          ["Use when", "Most CRUD applications", "Very different read and write loads or shapes"],
        ] },
        { type: "h2", text: "Projections and rebuilding read models" },
        { type: "p", text: "A **projection** is code that consumes events and updates a read model. For example, `OrderPlaced`, `ItemShipped` and `OrderCancelled` events update a row in an `order_summary` table. Because the read model is derived, it is disposable: if you need a new view, or find a bug in a projection, you fix the code, wipe the read model and **rebuild** it by replaying events from the start. This is a major benefit, but only if you kept the history, so a log with long retention or an event store is required." },
        { type: "code", language: "ts", title: "A projection", code: `function applyToSummary(summary: OrderSummary, e: OrderEvent): OrderSummary {
  switch (e.type) {
    case "OrderPlaced":
      return { id: e.orderId, status: "placed", totalCents: e.totalCents, items: e.items };
    case "ItemShipped":
      return { ...summary, status: "shipped" };
    case "OrderCancelled":
      return { ...summary, status: "cancelled" };
    default:
      return summary;
  }
}` },
        { type: "p", text: "Make projections idempotent, for example by storing the last processed event position with the read model in one transaction. For large histories, rebuild into a new table beside the old one and switch over, so users are not served half-built data." },
        { type: "h2", text: "Event sourcing" },
        { type: "p", text: "Normally you store the current state: a row says the balance is 70. In **event sourcing** you store the sequence of events that led there: `Deposited 100`, `Withdrew 30`. Current state is computed by folding over the events. Events are immutable and append-only; a mistake is corrected by a new compensating event, never by editing history." },
        { type: "list", items: [
          "**Audit trail for free**: you can say exactly what happened and when, which suits finance and compliance.",
          "**Time travel**: reconstruct state as of last Tuesday, or replay to debug.",
          "**New views later**: build projections nobody thought of at design time.",
          "**Natural fit for events** to other services, with the log as the source of truth.",
        ] },
        { type: "p", text: "To handle a command, load the aggregate's events, rebuild its state, check the rules, and append new events with an expected version so concurrent writers conflict instead of overwriting each other." },
        { type: "h2", text: "Snapshots and event sourcing trade-offs" },
        { type: "p", text: "Replaying 50,000 events to load one account is slow. A **snapshot** stores the folded state every N events (say 100) with its version; loading takes the latest snapshot plus the events after it. Snapshots are an optimization, so they can always be dropped and rebuilt." },
        { type: "table", head: ["Cost", "What it means"], rows: [
          ["Event schema evolution", "Old events live forever; you need upcasters or versioned handlers to read them"],
          ["Querying", "Cannot ask 'all users with balance over 1000' from events; you need projections, so CQRS comes with it"],
          ["Eventual consistency", "Read models lag the log"],
          ["Learning curve", "Teams used to CRUD find it unfamiliar; mistakes are costly to fix"],
          ["Privacy", "Deleting a person's data from an immutable log needs a plan, such as encrypting per-user and discarding the key"],
        ] },
        { type: "callout", tone: "gotcha", title: "CQRS and event sourcing are separate", text: "You can use CQRS with an ordinary database and no events, and event sourcing without a separate read store. They combine well, but adopting both for a plain CRUD app adds cost with no payoff. Use them where history or very different read shapes are real requirements, such as ledgers, order lifecycles and audit-heavy domains." },
      ],
      references: [
        { title: "CQRS (Martin Fowler)", url: "https://martinfowler.com/bliki/CQRS.html" },
        { title: "Event Sourcing (Martin Fowler)", url: "https://martinfowler.com/eaaDev/EventSourcing.html" },
        { title: "CQRS pattern (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs" },
        { title: "Event Sourcing pattern (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing" },
      ],
    },
  },
};
