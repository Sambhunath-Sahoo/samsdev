import type { LessonEntry } from "@/types/roadmap";

export const BOOKING_AND_TICKETING: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Booking and ticketing",
    slug: "case-booking-and-ticketing",
    lesson: {
      summary: "Never sell the same seat twice: hold inventory with an expiring reservation, confirm only after payment, and queue the crowd on a hot sale.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: browse events, see seat availability, hold seats while paying, buy, get a ticket, cancel and refund. Non-functional: **correctness beats availability for inventory**, since a double sale is worse than a slow page. Browsing can be eventually consistent; the final claim on a seat cannot." },
        { type: "p", text: "Estimates: normal load is tiny, around 100 bookings per second. The hard case is a popular on-sale: 500,000 people arriving for 20,000 seats within a minute, so roughly 8,000 requests per second hitting a few rows. Design for the spike, not the average." },
        { type: "h2", text: "API and data model" },
        { type: "code", language: "text", title: "API", code: `GET  /events/{id}/seats                 -> availability map
POST /reservations {event, seats[]}     -> 201 {id, expires_at} | 409 taken
POST /reservations/{id}/pay             -> 200 booking | 402 | 410 expired
DELETE /reservations/{id}               -> release` },
        { type: "code", language: "sql", title: "schema", code: `CREATE TABLE seats (
  event_id BIGINT, seat_id TEXT,
  status   TEXT NOT NULL DEFAULT 'free',   -- free | held | sold
  held_by  BIGINT, hold_expires_at TIMESTAMPTZ,
  PRIMARY KEY (event_id, seat_id)
);` },
        { type: "h2", text: "Holding a seat without double selling" },
        { type: "p", text: "A reservation is a **soft lock with a deadline**, usually 5 to 10 minutes. The claim must be one atomic step in the system of record, so use a conditional update and check how many rows changed:" },
        { type: "code", language: "sql", code: `UPDATE seats
SET status='held', held_by=$1, hold_expires_at=now()+interval '10 minutes'
WHERE event_id=$2 AND seat_id=$3
  AND (status='free' OR (status='held' AND hold_expires_at < now()));
-- 1 row updated = you hold it; 0 rows = someone else does (return 409)` },
        { type: "p", text: "That is optimistic concurrency: no read-then-write gap. `SELECT ... FOR UPDATE` works too but holds row locks longer. When a user picks several seats, claim them in one transaction in sorted order to avoid deadlocks, and all-or-nothing. Expiry needs no cleanup job to be correct, because the `WHERE` clause treats an expired hold as free; a sweeper only tidies the map for display." },
        { type: "p", text: "Payment: on pay, verify the hold is still yours and unexpired, charge with an idempotency key, and only then flip `held` to `sold` and issue the ticket. If the charge succeeds but the hold expired in the meantime, refund or honour it if the seat is still free; decide the rule ahead of time." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        { type: "table", head: ["Choice", "Upside", "Downside"], rows: [
          ["DB conditional update", "Correct by construction", "Hot rows limit throughput"],
          ["Redis lock with TTL, then DB write", "Absorbs spike", "Two systems; DB must still be the final check"],
          ["Pessimistic row lock", "Simple reasoning", "Long locks, deadlocks, poor under spikes"],
          ["Longer hold", "Fewer failed checkouts", "Seats sit idle, less inventory shown"],
        ] },
        { type: "list", items: [
          "**Virtual waiting room**: for a big sale, admit users from a queue at a rate the backend can serve instead of letting all of them hit the seat table.",
          "**Cache the availability map** for a second or two; it may be stale, and the claim step is the truth.",
          "**Partition by event id** so one hot event cannot slow the rest; a single event still lands on one shard, which is acceptable.",
          "**Bots**: rate limit, require login, cap seats per account.",
          "**General admission** is a counter (`available = available - n WHERE available >= n`), not rows per seat.",
        ] },
        { type: "callout", tone: "gotcha", title: "Check-then-act", text: "The classic wrong answer reads availability, then writes a hold in a separate statement. Two requests both see the seat free. The check and the claim must be the same atomic operation." },
      ],
      references: [
        { title: "PostgreSQL: Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
        { title: "Distributed Locks with Redis", url: "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/" },
        { title: "Idempotent requests (Stripe API)", url: "https://docs.stripe.com/api/idempotent_requests" },
      ],
    },
    points: [
      { id: "sd.cases.booking-seat-hold", title: "Booking: holding a seat with an expiring reservation", detail: "A hold is a conditional update that moves a seat from free to held with an expiry, and succeeds only if exactly one row changed. Expired holds count as free in the same WHERE clause, so correctness never depends on a cleanup job.", question: "Two users click the same seat at the same millisecond. Show the statement that guarantees only one wins." },
      { id: "sd.cases.booking-payment-confirm", title: "Booking: confirming only after payment", detail: "Charge with an idempotency key, then mark the seat sold in the same flow, and verify the hold is still valid before charging. Decide in advance what happens when payment succeeds after the hold expired.", question: "A card charge succeeds but the hold expired one second earlier. What does your system do?" },
      { id: "sd.cases.booking-hot-sale", title: "Booking: surviving a hot on-sale", detail: "A waiting room admits users at a controlled rate, the availability map is cached for a second or two, and the claim step stays the single source of truth. Inventory is partitioned by event so one sale cannot starve others.", question: "500,000 users arrive for 20,000 seats. What protects the database, and what stays strictly consistent?" },
    ],
  },
};
