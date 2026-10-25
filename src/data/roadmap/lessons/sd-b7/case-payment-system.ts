import type { LessonEntry } from "@/types/roadmap";

export const PAYMENT_SYSTEM: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Payment system",
    slug: "case-payment-system",
    lesson: {
      summary: "Money systems store immutable ledger entries, derive balances from them, and make every external call safe to retry.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: a customer pays a merchant, we call a payment provider (card network or PSP), record the result, and support refunds and a payout later. Non-functional: **no lost or duplicated money**, full audit trail, tolerance of provider timeouts. Throughput is modest: 1 million payments a day is about 12 per second, with peaks of maybe 100. The difficulty is correctness, not scale." },
        { type: "h2", text: "API and data model" },
        { type: "code", language: "text", title: "API", code: `POST /payments   Idempotency-Key: 7b1e...
  {payer, payee, amount: 4999, currency: "USD", method}
  -> 202 {payment_id, status: "pending"}
GET  /payments/{id}                 -> status
POST /payments/{id}/refund          Idempotency-Key: ...` },
        { type: "p", text: "Amounts are integers in the smallest unit (cents), never floats, always with a currency." },
        { type: "h2", text: "Ledger and derived balance" },
        { type: "p", text: "Do not keep a mutable `balance` column that you add to and subtract from. Instead record **double-entry ledger rows**: every transfer writes at least two entries, a debit and a credit, that sum to zero, inside one database transaction. Rows are append-only; a mistake is fixed with a reversing entry, never an edit or delete." },
        { type: "code", language: "sql", code: `CREATE TABLE ledger_entries (
  id BIGSERIAL PRIMARY KEY, payment_id UUID NOT NULL,
  account_id BIGINT NOT NULL, amount BIGINT NOT NULL, -- + credit, - debit
  currency CHAR(3) NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
-- balance is derived:
SELECT COALESCE(SUM(amount),0) FROM ledger_entries WHERE account_id=$1;` },
        { type: "p", text: "Summing every row gets slow, so keep a periodic snapshot (balance as of entry id N) and add only the newer entries, or cache the result. The ledger stays the truth and the cache is rebuildable. The payoff is auditability: you can prove any balance, replay history, and check that all entries net to zero." },
        { type: "h2", text: "Idempotent flow with an external provider" },
        { type: "p", text: "Networks fail in the worst place: you send a charge, the provider charges the card, and your call times out. A blind retry charges twice. The defence is an **idempotency key** at each hop." },
        { type: "list", items: [
          "The client sends a unique key; the payment service stores `(key, request hash, response)` with a unique index. A repeat returns the stored response; the same key with a different body is rejected.",
          "Persist the payment as `pending` **before** calling the provider, and pass the provider your own key (most providers accept one).",
          "On timeout, do not guess: leave it `pending` and let a reconciler query the provider for the real outcome, or wait for the provider's webhook.",
          "Webhooks are at-least-once and unordered, so handle them idempotently and move state forward only.",
          "Write the ledger entries in the same transaction that marks the payment `succeeded`.",
        ] },
        { type: "p", text: "State machine: `pending -> succeeded | failed`, then `refunded`. Transitions are checked in the update's `WHERE status = ...` clause so two workers cannot both apply one." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        { type: "table", head: ["Choice", "Upside", "Downside"], rows: [
          ["Sync call to provider", "Simple, immediate answer", "Ties up threads; timeouts are ambiguous"],
          ["Queue plus async result", "Absorbs provider slowness", "Client polls or gets a webhook"],
          ["One database for ledger", "Real transactions", "Scaling means sharding by account, which complicates cross-shard transfers"],
          ["Daily reconciliation job", "Catches silent mismatches", "Extra system to run and monitor"],
        ] },
        { type: "callout", tone: "gotcha", title: "Exactly once does not exist", text: "Over a network you get at-most-once or at-least-once. Money systems pick at-least-once and make every operation idempotent, which behaves like exactly once in effect." },
      ],
      references: [
        { title: "Idempotent requests (Stripe API)", url: "https://docs.stripe.com/api/idempotent_requests" },
        { title: "Books: an immutable double-entry accounting database service (Square)", url: "https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/" },
        { title: "Double-entry bookkeeping (Wikipedia)", url: "https://en.wikipedia.org/wiki/Double-entry_bookkeeping" },
      ],
    },
  },
};
