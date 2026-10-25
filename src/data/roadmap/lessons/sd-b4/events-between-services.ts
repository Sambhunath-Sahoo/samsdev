import type { LessonEntry } from "@/types/roadmap";

export const EVENTS_BETWEEN_SERVICES: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Events between services",
    slug: "events-between-services",
    lesson: {
      summary: "Services can announce facts that others react to, which loosens coupling but needs careful event design and a choice between choreography and orchestration.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Event-driven architecture basics" },
        { type: "p", text: "In a request-driven design, the order service calls inventory, then payment, then email, and knows all of them. In an event-driven design, the order service publishes `OrderPlaced` to a broker and moves on. Inventory, payment, email and analytics each subscribe and react on their own. The publisher does not know the consumers. Adding a new reaction, such as a loyalty-points service, requires no change to the order service." },
        { type: "list", items: [
          "**Producers** publish events to a broker (Kafka, SNS and SQS, RabbitMQ, EventBridge).",
          "**Consumers** subscribe and process at their own speed.",
          "**The cost**: the flow is no longer visible in one place, failures are asynchronous, and data is eventually consistent. Debugging 'why was no email sent?' means following an event across services, so propagate a correlation id in every event and log it everywhere.",
        ] },
        { type: "h2", text: "Events, commands and schemas" },
        { type: "p", text: "These are different things, and mixing them causes confusion." },
        { type: "table", head: ["", "Event", "Command"], rows: [
          ["Meaning", "Something that happened, past tense: `OrderPlaced`", "A request to do something: `ChargeCard`"],
          ["Receivers", "Zero or many; the sender does not care", "Exactly one handler; the sender expects it done"],
          ["Can be rejected?", "No, it already happened", "Yes, the handler may refuse"],
          ["Coupling", "Consumers depend on the publisher's schema", "Sender depends on the handler existing"],
        ] },
        { type: "p", text: "Events carry a contract, so design the schema deliberately. Include an event id (for deduplication), type, version, timestamp, a correlation id and the aggregate id. Decide how much data to include. A thin event (`{ orderId }`) forces consumers to call back for details, which couples them again and may read newer data than the event described. A fat event (full order snapshot) lets consumers work alone, but leaks fields and is harder to evolve. A middle path carries the facts the event is about plus ids for the rest." },
        { type: "code", language: "json", title: "An event with an envelope", code: `{
  "id": "evt_01JAZ8K3QX",
  "type": "order.placed",
  "version": 2,
  "occurredAt": "2026-10-25T09:14:07Z",
  "correlationId": "req_7f3a1c",
  "data": {
    "orderId": "ord_4412",
    "customerId": "cus_88",
    "totalCents": 12900,
    "currency": "USD"
  }
}` },
        { type: "p", text: "Schemas change, and consumers deploy on their own schedule. Add fields freely, never rename or change the meaning of existing ones, and keep old versions readable until consumers have moved. A schema registry (Avro or Protobuf with compatibility checks) catches breaking changes in CI instead of in production." },
        { type: "h2", text: "Choreography vs orchestration" },
        { type: "p", text: "Take a multi-step order: reserve stock, charge the card, create the shipment. In **choreography** each service reacts to the previous event: `OrderPlaced` triggers stock reservation, which publishes `StockReserved`, which triggers payment, and so on. There is no central controller, which keeps services independent, but the overall process exists only as a chain of reactions and is hard to see or change. In **orchestration** a coordinator (a saga orchestrator or workflow engine) explicitly tells each service what to do and tracks the state, including compensation: if payment fails, it tells inventory to release the stock." },
        { type: "table", head: ["", "Choreography", "Orchestration"], rows: [
          ["Control", "Distributed", "Central coordinator"],
          ["Visibility", "Poor; trace the chain", "Good; one place shows state"],
          ["Coupling", "Loose between services", "Services coupled to the coordinator's commands"],
          ["Best for", "Simple fan-out, 2 to 3 steps", "Long, multi-step flows with rollback"],
        ] },
        { type: "callout", tone: "gotcha", title: "Event chains become spaghetti", text: "Choreography that starts with three services often ends with ten and a cyclic dependency nobody drew. If a business process has more than a few steps or needs compensation, write it down as an orchestrated workflow." },
        { type: "p", text: "Common interview mistakes: calling a command an event, publishing without saying how consumers handle duplicates, and ignoring schema evolution. Mention idempotent consumers, a correlation id and versioned schemas, and you cover most of what interviewers look for." },
      ],
      references: [
        { title: "What do you mean by \"Event-Driven\"? (Martin Fowler)", url: "https://martinfowler.com/articles/201701-event-driven.html" },
        { title: "Pattern: Saga (microservices.io)", url: "https://microservices.io/patterns/data/saga.html" },
        { title: "Event-driven architecture style (Azure Architecture Center)", url: "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven" },
      ],
    },
  },
};
