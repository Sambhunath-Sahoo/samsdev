import type { LessonEntry } from "@/types/roadmap";

export const IDEMPOTENCY: LessonEntry = {
  track: "system-design",
  section: "Resilience patterns",
  subsection: {
    title: "Idempotency",
    slug: "idempotency",
    lesson: {
      summary: "Make repeating a request safe, because networks lose replies and queues deliver messages more than once.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Idempotent operations" },
        { type: "p", text: "An operation is idempotent when doing it once or ten times leaves the system in the same state. The reason you care: a client sends a request, the connection drops, and it never learns whether the server acted. The only safe response is to try again, so retrying must not charge a card twice." },
        { type: "p", text: "HTTP defines `GET`, `PUT` and `DELETE` as idempotent and `POST` as not (`PATCH` depends on the patch). At the data level, `UPDATE accounts SET balance = 90 WHERE id = 7` is idempotent; `SET balance = balance - 10` is not. Idempotent does not mean the response is identical: a repeated `DELETE` may return 404 the second time, but the state is the same. Where you can, design the operation itself to be idempotent: use `PUT` with a client-chosen id, use upserts, and set absolute values instead of applying deltas." },
        { type: "h2", text: "Idempotency keys" },
        { type: "p", text: "For operations that cannot be naturally idempotent, such as creating a payment, the client generates a unique key (a UUID) for each logical action and sends it in an `Idempotency-Key` header. The client reuses the same key on every retry of that action. The server records the key and the outcome." },
        { type: "code", language: "sql", title: "Key table and claim", code: `CREATE TABLE idempotency_keys (
  key           text PRIMARY KEY,
  request_hash  text NOT NULL,
  status        text NOT NULL,       -- 'in_progress' | 'done'
  response      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- claim before doing any work; the unique key makes this atomic
INSERT INTO idempotency_keys (key, request_hash, status)
VALUES ($1, $2, 'in_progress')
ON CONFLICT (key) DO NOTHING;
-- 1 row inserted -> you own it, do the work, then UPDATE status/response
-- 0 rows        -> someone else has it: replay response, or return 409 if in progress` },
        { type: "list", items: [
          "Two requests with the same key at the same millisecond: the primary key lets only one insert succeed; the other replays the stored result or gets a conflict while the first is still running.",
          "Same key but a different body: reject with a 4xx (422 is common) rather than silently replaying the wrong answer. This is what the request hash is for.",
          "Expiry: keep keys for a bounded window, often 24 hours, then delete them.",
          "Store the response so a retry gets the same status and body, including errors that were final.",
        ] },
        { type: "p", text: "The hard case is a crash between the side effect and saving the result. If you call an external payment provider, pass your key through to it too, so that their side also deduplicates. If you write to your own database, put the key row and the business change in **one transaction** so they commit together." },
        { type: "h2", text: "Deduplicating consumers" },
        { type: "p", text: "Queues and webhooks generally promise at-least-once delivery. A consumer that crashes after doing the work but before acknowledging will see the same message again. Effectively-once processing is built from at-least-once delivery plus an idempotent consumer." },
        { type: "code", language: "sql", title: "Dedupe inside the same transaction", code: `BEGIN;
INSERT INTO processed_messages (message_id) VALUES ($1)
  ON CONFLICT DO NOTHING;
-- if 0 rows inserted: duplicate, ROLLBACK or skip, then ack
UPDATE orders SET status = 'paid' WHERE id = $2;   -- the effect
COMMIT;
-- ack the message only after COMMIT` },
        { type: "p", text: "Use the broker's message id, or better, a business id that the producer sets (order id plus event type), because the producer itself may publish twice. An upsert keyed on the business id is often enough and needs no extra table." },
        { type: "callout", tone: "gotcha", title: "Deduplicate with the effect, not before it", text: "Checking \"have I seen this id?\" in a cache and then doing the work leaves a window: two consumers both see \"no\" and both act, or the process crashes after the check. The record of having processed it must commit atomically with the effect, or the effect must be idempotent on its own." },
        { type: "p", text: "In an interview, state the full chain for a payment: client key, unique constraint, one transaction around state and key, key passed to the provider, TTL cleanup, and a reconciliation job for the rare case where you cannot tell what happened." },
      ],
      references: [
        { title: "Idempotent requests - Stripe API reference", url: "https://docs.stripe.com/api/idempotent_requests" },
        { title: "RFC 9110: HTTP Semantics (idempotent methods)", url: "https://www.rfc-editor.org/rfc/rfc9110.html" },
        { title: "The Idempotency-Key HTTP Header Field - IETF draft", url: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/" },
      ],
    },
  },
};
