import type { LessonEntry } from "@/types/roadmap";

export const WEBHOOKS: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Webhooks",
    slug: "webhooks",
    lesson: {
      summary: "A webhook is an HTTP callback one system sends to another; the receiver must verify it, tolerate duplicates, and answer fast, and the sender must retry sensibly.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What a webhook is" },
        { type: "p", text: "Instead of you polling an API every minute to ask whether a payment succeeded, the provider sends an HTTP `POST` to a URL you registered when it happens. That is a webhook: an event delivered over plain HTTP to the other party's public endpoint. It is cheap and near real time, but your endpoint now accepts requests from the internet, and delivery is at-least-once, so security and duplicates are your problem." },
        { type: "h2", text: "Verifying webhook signatures" },
        { type: "p", text: "Anyone can send a POST to your URL, so you need proof it came from the provider. The standard approach is an **HMAC signature**: the provider and you share a secret; the sender computes `HMAC-SHA256(secret, body)` and sends it in a header; you compute the same over the **raw bytes** of the body and compare." },
        { type: "code", language: "ts", title: "Verify an HMAC signature (Node)", code: `import { createHmac, timingSafeEqual } from "node:crypto";

export function isValid(rawBody: Buffer, header: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}` },
        { type: "list", items: [
          "**Use the raw body**. If your framework parses JSON first and you re-serialize it, whitespace and key order change and the signature fails. Capture the raw bytes before parsing.",
          "**Compare in constant time** (`timingSafeEqual`), not with `===`, so response time does not leak the signature.",
          "**Reject before doing any work**: a bad signature gets a 401 and no side effects.",
        ] },
        { type: "h2", text: "Replay protection and secrets" },
        { type: "p", text: "A valid signed request can be captured and sent again later. Defend in two ways. First, include a **timestamp** in what is signed and reject requests older than a few minutes (Stripe signs the timestamp together with the payload and its libraries default to a five-minute tolerance). Second, **deduplicate by event id**: store ids you have processed and ignore repeats. The second defense matters even without attackers, because providers retry." },
        { type: "p", text: "Treat the signing secret like a password: keep it in a secret manager, never in the repository or logs, use one secret per endpoint, and support rotation by accepting two secrets for a short overlap. Where the provider offers it, also restrict by their published IP ranges, but never use IPs alone." },
        { type: "h2", text: "Receiving webhooks reliably" },
        { type: "p", text: "The provider waits only seconds for a response and treats anything but 2xx, or a timeout, as failure. So the receiver should do the minimum, then acknowledge:" },
        { type: "list", ordered: true, items: [
          "Verify the signature and timestamp.",
          "Insert the event into a table (or put it on a queue) with a unique constraint on the event id.",
          "Return `200` immediately.",
          "Process it from a worker, idempotently, with retries and a dead letter queue.",
        ] },
        { type: "p", text: "This also survives your own outages: if the database is down you return a 5xx and the provider retries, and if processing is slow it does not make the provider time out. Do not assume order: an `invoice.updated` can arrive before `invoice.created`. Treat the event as a hint and fetch the current state from the provider's API when order matters." },
        { type: "h2", text: "Sending webhooks and retry policy" },
        { type: "p", text: "If you are the provider, build it like a mini message system. Put each delivery on a queue, send with a short timeout (5 to 10 seconds), and treat non-2xx and timeouts as failures. Retry with exponential backoff and jitter over hours or days, for example at 1 minute, 5 minutes, 30 minutes, 2 hours, 12 hours, then give up. Sign every request with a timestamp, include a stable event id, and document that delivery is at-least-once and unordered." },
        { type: "table", head: ["Concern", "Sender should", "Receiver should"], rows: [
          ["Authenticity", "Sign body plus timestamp", "Verify raw body, constant-time compare"],
          ["Duplicates", "Send a stable event id", "Deduplicate on it"],
          ["Slowness", "Short timeout, retry later", "Acknowledge fast, process async"],
          ["Failing endpoint", "Back off, then disable after days and email the owner", "Alert on failures; use the provider's replay tool"],
        ] },
        { type: "callout", tone: "gotcha", title: "Do not call out to private addresses", text: "If customers supply the URL, a sender can be tricked into requesting internal addresses (server-side request forgery). Block private and link-local ranges, such as cloud metadata addresses, resolve DNS yourself and check the result, and do not follow redirects blindly." },
      ],
      references: [
        { title: "Receive Stripe events in your webhook endpoint", url: "https://docs.stripe.com/webhooks" },
        { title: "Validating webhook deliveries (GitHub Docs)", url: "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries" },
        { title: "RFC 2104: HMAC: Keyed-Hashing for Message Authentication", url: "https://www.rfc-editor.org/rfc/rfc2104" },
        { title: "Standard Webhooks", url: "https://www.standardwebhooks.com/" },
      ],
    },
  },
};
