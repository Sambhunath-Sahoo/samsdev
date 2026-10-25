import type { RoadmapSection } from "@/types/roadmap";

export const BACKGROUND_WORK_AND_EVENTS: RoadmapSection = {
  title: "Background work and events",
  goal: "Move slow or unreliable work off the request path and connect services through messages without losing or duplicating effects.",
  doneWhen: [
    "Choose between a queue and a log-based stream for a given workload and justify the delivery guarantee.",
    "Design a worker pipeline with retries, a dead letter queue and idempotent handlers.",
    "Explain how the outbox pattern avoids the dual-write problem between a database and a broker.",
  ],
  subsections: [
    {
      title: "Message queues",
      points: [
        {
          id: "sd.events.why-queues",
          title: "Why use a queue",
          detail:
            "A queue lets a producer hand off work and return immediately, while consumers process at their own pace. It absorbs traffic spikes, decouples deploys and failures of the two sides, and lets you scale consumers independently. Example: the signup API enqueues a welcome email job instead of calling the email provider inside the request.",
          question: "Why enqueue the welcome email instead of sending it inside the signup request?",
        },
        {
          id: "sd.events.queue-vs-stream",
          title: "Queue vs stream",
          detail:
            "A traditional queue (SQS, RabbitMQ) delivers each message to one consumer and removes it once acknowledged. A log-based stream (Kafka, Kinesis) appends messages to a partitioned log that consumers read by offset, so many independent consumer groups can read and replay the same data. Use a queue for task distribution and a stream for event feeds, replay and high throughput with ordering per key.",
          question: "Three different services each need every order event, and one needs to replay last week. Queue or stream, and why?",
        },
        {
          id: "sd.events.delivery-guarantees",
          title: "Delivery guarantees and ordering",
          detail:
            "At-most-once may lose messages, at-least-once may duplicate them, and exactly-once effect is achieved by at-least-once delivery plus idempotent processing. Most brokers default to at-least-once, so handlers must tolerate repeats. Ordering is usually guaranteed only within a partition or FIFO group, so route related messages by a key such as the order id.",
          question: "Why is true exactly-once delivery between two systems so hard, and what do teams do instead?",
        },
        {
          id: "sd.events.ack-and-visibility",
          title: "Acknowledgements and visibility timeouts",
          detail:
            "A consumer acknowledges a message only after the work succeeds. In SQS a received message becomes invisible for a visibility timeout; if the consumer does not delete it in time, it reappears for another worker. Set the timeout longer than the typical job, or extend it while working, otherwise a slow job is processed twice at the same time.",
          question: "A job takes 90 seconds and the visibility timeout is 30. What happens?",
        },
      ],
    },
    {
      title: "Failure paths and workers",
      points: [
        {
          id: "sd.events.dead-letter-queues",
          title: "Dead letter queues",
          detail:
            "A dead letter queue (DLQ) receives messages that failed after a configured number of attempts, so one poison message does not block the queue or retry forever. Keep the original payload and error details with it. A DLQ is only useful if something watches it: alert on its depth and keep a runbook for inspection.",
          question: "One malformed message keeps failing and blocks a FIFO queue. How does a DLQ help and what else do you need?",
        },
        {
          id: "sd.events.dlq-redrive",
          title: "Inspecting and redriving the DLQ",
          detail:
            "Triage dead letters into transient causes (a downstream outage, fixed now) and permanent ones (bad data, a bug). After the fix, redrive the messages back to the main queue, ideally at a controlled rate. Never redrive blindly if the handler is not idempotent, and set DLQ retention longer than the main queue so evidence is not deleted first.",
          question: "After a bug fix, 40,000 messages sit in the DLQ. How do you reprocess them safely?",
        },
        {
          id: "sd.events.worker-design",
          title: "Designing background workers",
          detail:
            "A worker is a separate process that pulls jobs and runs them, scaled by queue depth or oldest message age. Make each job small, idempotent and self-contained (pass ids, not whole objects). Limit concurrency per worker so a burst does not overwhelm the database, and use separate queues for slow and fast jobs.",
          question: "Image resizing and password-reset emails share one queue. What goes wrong at peak and how do you split them?",
        },
        {
          id: "sd.events.worker-retry-policy",
          title: "Job retries and priorities",
          detail:
            "Give each job a maximum attempt count with exponential backoff and jitter, and distinguish retryable errors (timeouts) from permanent ones (validation failure) that should go straight to the DLQ. Libraries such as BullMQ and Sidekiq support delayed retries and priority queues. Record job status so users and support can see queued, running, failed and done.",
          question: "How do you tell a worker which failures to retry and which to dead-letter immediately?",
        },
      ],
    },
    {
      title: "Scheduled work",
      points: [
        {
          id: "sd.events.cron-and-schedulers",
          title: "Cron and distributed schedulers",
          detail:
            "A cron expression such as `0 2 * * *` runs a task daily at 02:00. On a single server that is easy; with many instances every one fires the job unless you elect one runner or use a scheduler that enqueues a single job (Kubernetes CronJob, a managed scheduler, or a database lock). The scheduler should only enqueue work; workers do it.",
          question: "Your app runs on 4 instances and each has a nightly cron. How do you make sure the report runs once?",
        },
        {
          id: "sd.events.scheduling-pitfalls",
          title: "Scheduling pitfalls",
          detail:
            "Handle overlap (the last run is still going when the next starts) with a lock or by skipping, missed runs after downtime by catching up or accepting the gap, and daylight saving by scheduling in UTC. Make scheduled jobs idempotent and keyed by period, such as `report-2026-10-25`, so a rerun does not duplicate output. Spread the start times with jitter to avoid midnight spikes.",
          question: "A nightly job takes 26 hours once. What should the scheduler do about the next run, and how do you prevent duplicates?",
        },
      ],
    },
    {
      title: "Events between services",
      points: [
        {
          id: "sd.events.event-driven-basics",
          title: "Event-driven architecture basics",
          detail:
            "A service publishes an event such as `OrderPlaced` describing a fact that already happened, and any number of subscribers react without the publisher knowing them. This decouples teams and lets you add consumers without changing the producer. The cost is harder tracing, no single place showing the whole flow and a need for good event naming and schema discipline.",
          question: "Name one benefit and one cost of publishing OrderPlaced instead of calling inventory, billing and email directly.",
        },
        {
          id: "sd.events.events-vs-commands",
          title: "Events, commands and schemas",
          detail:
            "A command asks one service to do something (`ChargeCard`); an event states what happened (`PaymentCaptured`). Events should be immutable, carry an id, timestamp and version, and evolve additively so older consumers keep working. A schema registry or contract tests catch breaking changes before deploy.",
          question: "You must rename a field in a published event with five consumers. How do you roll it out?",
        },
        {
          id: "sd.events.choreography-vs-orchestration",
          title: "Choreography vs orchestration",
          detail:
            "In choreography each service reacts to events and emits new ones, which is loosely coupled but hard to follow. In orchestration a central coordinator (a workflow engine or saga orchestrator) tells each step what to do and handles failure and compensation. Use choreography for simple fan-out and orchestration for multi-step business processes that need visible state.",
          question: "A checkout flow has six steps with compensation. Choreography or orchestration, and why?",
        },
      ],
    },
    {
      title: "Webhooks",
      points: [
        {
          id: "sd.events.webhook-signature-verification",
          title: "Verifying webhook signatures",
          detail:
            "A webhook endpoint is a public URL, so anyone can post to it. The sender signs the raw request body with a shared secret using HMAC-SHA256 and puts the result in a header; the receiver recomputes the HMAC over the exact raw bytes and compares with a constant-time function such as `crypto.timingSafeEqual`. Verify before parsing or acting, and never parse and re-serialize the JSON first.",
          question: "Why must the HMAC be computed over the raw body and compared in constant time?",
        },
        {
          id: "sd.events.webhook-replay-protection",
          title: "Replay protection and secrets",
          detail:
            "A valid signed request can be captured and resent. Include a timestamp in the signed payload and reject requests older than about 5 minutes, and store event ids to ignore ones already processed. Keep secrets in a secret manager, support rotation by accepting two secrets for a short overlap, and answer 2xx quickly after verifying and enqueuing.",
          question: "An attacker replays a captured, validly signed webhook an hour later. What two checks stop it?",
        },
        {
          id: "sd.events.webhook-retry-policy",
          title: "Sending webhooks and retry policy",
          detail:
            "As a sender, treat any non-2xx or timeout as failure and retry with exponential backoff and jitter over hours to a day, for example 1 minute, 5 minutes, 30 minutes, 2 hours. Use a short request timeout so a slow receiver does not tie up your workers. After the final attempt, mark the delivery failed and disable the endpoint with a notice to the owner.",
          question: "A customer endpoint returns 500 for six hours. What does your delivery system do, and when does it give up?",
        },
        {
          id: "sd.events.webhook-receiver-design",
          title: "Receiving webhooks reliably",
          detail:
            "As a receiver, assume at-least-once and out-of-order delivery. Verify the signature, store the raw event with its id, return 200 within a few seconds, and process asynchronously from a queue. Because events can arrive out of order, fetch current state from the provider API or compare event timestamps rather than trusting arrival order.",
          question: "A payment provider sends `payment.updated` events out of order. How do you avoid saving stale status?",
        },
      ],
    },
    {
      title: "Consistency and event-based data patterns",
      points: [
        {
          id: "sd.events.eventual-consistency",
          title: "Eventual consistency",
          detail:
            "Replicas or derived stores may disagree for a short time but converge if updates stop. This is the price of availability, lower latency and async propagation. Example: after a user changes their name, a search index fed by events may show the old name for a second. Design the user experience around the gap and measure replication lag.",
          question: "A user updates a profile and still sees the old data on refresh. List two causes and two fixes.",
        },
        {
          id: "sd.events.read-your-writes",
          title: "Read-your-writes and conflict handling",
          detail:
            "Common fixes for stale reads: read from the primary for a short time after a write, route a user's reads to the same replica, or return the written value and update the UI optimistically. When two writers diverge, resolve conflicts with last-write-wins, version numbers or mergeable types, knowing last-write-wins can silently drop data.",
          question: "How can you give a user read-your-writes consistency while most reads go to replicas?",
        },
        {
          id: "sd.events.dual-write-problem",
          title: "The dual-write problem",
          detail:
            "Saving a row and then publishing an event are two separate systems, so a crash between them leaves the database updated and the event lost, or the reverse. A distributed transaction across a database and a broker is usually not available or too costly. The fix is to make a single local transaction the source of truth and publish from it.",
          question: "Your service commits to Postgres then publishes to Kafka and crashes between the two. What is the damage?",
        },
        {
          id: "sd.events.transactional-outbox",
          title: "The outbox pattern",
          detail:
            "In the same database transaction that changes business data, insert an event row into an `outbox` table. A separate relay reads unsent rows and publishes them to the broker, marking them sent, or a change-data-capture tool such as Debezium streams them from the log. Delivery is at-least-once, so consumers must deduplicate by event id.",
          question: "Why does the outbox guarantee the event is published only if the order was committed, and why can it still duplicate?",
        },
      ],
    },
    {
      title: "CQRS and event sourcing",
      points: [
        {
          id: "sd.events.cqrs-basics",
          title: "CQRS",
          detail:
            "Command Query Responsibility Segregation separates the write model, which enforces rules and changes state, from one or more read models shaped for queries. Read models can live in a different store, for example Elasticsearch or a denormalized table, updated from events. The cost is extra moving parts and eventual consistency between the two sides.",
          question: "When is CQRS worth the added complexity, and when is a plain CRUD service better?",
        },
        {
          id: "sd.events.cqrs-projections",
          title: "Projections and rebuilding read models",
          detail:
            "A projection consumes events and updates a read model. Because projections are derived data, a bug can be fixed by deploying new code and rebuilding from the events or source tables. Track the last processed position, make updates idempotent, and expect read models to lag the write side by a short time.",
          question: "Your search read model has a bug and holds wrong data. How do you repair it without touching the write side?",
        },
        {
          id: "sd.events.event-sourcing-basics",
          title: "Event sourcing",
          detail:
            "Instead of storing current state, store the ordered list of events that produced it, such as `AccountOpened`, `MoneyDeposited`, `MoneyWithdrawn`, and compute state by replaying them. You get a full audit trail and the ability to build new views from history. Events are never edited; corrections are new events, and optimistic concurrency checks the expected version on append.",
          question: "How do you get an account balance in an event-sourced system, and how do you correct a wrong deposit?",
        },
        {
          id: "sd.events.event-sourcing-tradeoffs",
          title: "Snapshots and event sourcing trade-offs",
          detail:
            "Replaying long histories is slow, so periodically store a snapshot and replay only later events. Event schemas must be versioned forever, querying needs projections, and deleting personal data conflicts with immutability, which teams handle with encryption keys they can discard. Use it where history is the product, such as ledgers, not by default.",
          question: "Name two reasons not to adopt event sourcing for a typical CRUD app.",
        },
      ],
    },
  ],
};
