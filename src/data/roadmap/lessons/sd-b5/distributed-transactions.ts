import type { LessonEntry } from "@/types/roadmap";

export const DISTRIBUTED_TRANSACTIONS: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Distributed transactions",
    slug: "distributed-transactions",
    lesson: {
      summary: "Two-phase commit gives atomicity across databases at the price of blocking; sagas trade atomicity for availability and need compensations.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The problem" },
        { type: "p", text: "Placing an order touches several services: reserve stock, charge the card, create a shipment. Each owns its own database, so one local `BEGIN ... COMMIT` cannot cover all three. If the charge succeeds and the shipment fails, you have taken money for nothing. You need either all steps to happen or a defined way to undo the ones that did." },
        { type: "h2", text: "Two-phase commit" },
        { type: "p", text: "A coordinator runs the protocol. **Phase 1 (prepare)**: it asks every participant, \"can you commit?\" Each one does the work, writes it durably and votes yes, keeping its locks. **Phase 2 (commit)**: if all voted yes the coordinator tells everyone to commit; if any voted no (or timed out) it tells everyone to abort." },
        { type: "code", language: "text", title: "Two-phase commit", code: `coordinator -> A, B: PREPARE
A, B        -> coordinator: YES (locks held, outcome promised)
coordinator logs COMMIT, then -> A, B: COMMIT
A, B        -> coordinator: ACK
# if the coordinator dies after PREPARE and before the decision,
# A and B are in doubt and must keep their locks and wait` },
        { type: "p", text: "The weakness is that blocking window. A participant that voted yes cannot decide alone, so rows stay locked until the coordinator returns, and every transaction touching them waits. Latency is two round trips plus disk syncs. 2PC is still used inside one organisation across databases that support XA, and inside distributed databases such as Spanner (over consensus groups), but it is rare between independently owned services." },
        { type: "h2", text: "Sagas and compensating actions" },
        { type: "p", text: "A **saga** replaces one big transaction with a sequence of local transactions. Each step commits immediately. If a later step fails, earlier steps are undone by **compensating actions**: new transactions that semantically reverse them, such as a refund or a stock release. There are no global locks, so the system stays available, but other users can see the intermediate states." },
        {
          type: "table",
          head: ["Step", "Action", "Compensation"],
          rows: [
            ["1", "Reserve stock", "Release stock"],
            ["2", "Charge card", "Refund the charge"],
            ["3", "Create shipment", "Cancel shipment (if still possible)"],
          ],
        },
        { type: "p", text: "Two styles: **orchestration**, where a central service (a workflow engine or an order service) tells each participant what to do and tracks state; and **choreography**, where services react to each other's events with no central brain. Orchestration is easier to reason about and debug; choreography couples services loosely but makes the flow hard to see once it has more than a few steps." },
        { type: "h2", text: "When a compensation fails" },
        { type: "p", text: "Compensations can fail too: the refund API is down, or the parcel has already left the warehouse. Design for it from the start:" },
        { type: "list", items: [
          "Make every step and every compensation **idempotent** (use an idempotency key per saga step) so retrying is safe.",
          "Retry compensations with backoff until they succeed. They must not be allowed to give up silently.",
          "Persist saga state (current step, status) in a table so a crashed orchestrator can resume.",
          "Order steps so the hardest-to-undo ones come last: charge the card after the reservations, ship only once payment is confirmed.",
          "After a retry limit, park the saga in a failed state, alert a human and keep an audit trail.",
        ] },
        { type: "callout", tone: "gotcha", title: "Sagas are not isolated", text: "Between step 1 and step 3 another request can see the reserved stock or the charged-but-unshipped order. Handle it with semantic locks (an order status of PENDING), by reading only committed business states, and by treating compensation as a normal path. A saga that has no designed answer for a refund failure is not finished." },
        { type: "p", text: "Interview tip: pick by constraint. Same database or a distributed SQL database, use a normal transaction. Several owned services needing strict atomicity and short transactions, 2PC may fit. Anything crossing teams, vendors or slow steps, use a saga with idempotent steps and an outbox so each local commit reliably publishes its event." },
      ],
      references: [
        { title: "Pattern: Saga - microservices.io", url: "https://microservices.io/patterns/data/saga.html" },
        { title: "Saga distributed transactions pattern - Azure Architecture Center", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/saga" },
        { title: "Two-phase commit protocol - Wikipedia", url: "https://en.wikipedia.org/wiki/Two-phase_commit_protocol" },
      ],
    },
  },
};
