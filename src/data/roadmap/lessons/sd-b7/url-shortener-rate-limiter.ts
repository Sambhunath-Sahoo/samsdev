import type { LessonEntry } from "@/types/roadmap";

export const URL_SHORTENER_RATE_LIMITER: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Starter: URL shortener, rate limiter",
    slug: "case-url-shortener-rate-limiter",
    lesson: {
      summary: "Two small problems that exercise the whole interview method: a read-heavy redirect service and a counter that must be fast and safe to lose.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "URL shortener: requirements and estimates" },
        { type: "p", text: "Functional: create a short link for a long URL, redirect from the short link, optional custom alias and expiry. Non-functional: redirects must be fast and highly available, creation can be slower, short codes must not be guessable in order. Say these out loud before drawing anything." },
        { type: "p", text: "Assume 100 million new links a month and a 100:1 read-to-write ratio. Writes are about 40 per second. Reads are about 4,000 per second on average, perhaps 20,000 at peak. Storage: 100M links a month for 5 years is 6 billion rows at roughly 500 bytes, about 3 TB. That fits a sharded relational store or a key-value store, and the read path is the one to optimise." },
        { type: "h2", text: "Generating short codes" },
        { type: "p", text: "A 7-character code in base62 gives 62^7, about 3.5 trillion values, far more than 6 billion. The question is how to pick the next code without collisions." },
        { type: "table", head: ["Approach", "Strength", "Weakness"], rows: [
          ["Hash the URL, take 7 chars", "Stateless", "Collisions need a retry; same URL gets the same code, so no per-user links"],
          ["Counter, base62-encode", "No collisions, short", "Sequential and guessable; counter is a coordination point"],
          ["Pre-generated key pool", "Fast, no collision at write time", "Needs a key service and batch hand-out per app server"],
          ["Random code, unique index", "Simple, unguessable", "Retry on conflict; fine while the table is sparse"],
        ] },
        { type: "p", text: "A sensible answer: a counter handed out in ranges (each app server leases 1,000 ids), then scrambled with a reversible permutation before base62 so codes are not sequential." },
        { type: "h2", text: "301 versus 302, schema and edge cases" },
        { type: "p", text: "A **301** is permanent, so browsers and CDNs cache it and later clicks never reach you: cheap, but you lose analytics and cannot change or expire the target. A **302** is temporary, every click hits your service, and you can count it. Choose 302 when analytics or expiry matter, and push click events onto a queue so counting never slows the redirect." },
        { type: "code", language: "sql", title: "links", code: `CREATE TABLE links (
  code        VARCHAR(10) PRIMARY KEY,   -- shard key
  long_url    TEXT        NOT NULL,
  owner_id    BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ
);` },
        { type: "p", text: "Reads go through a cache (cache-aside on `code`); a small hot set serves most traffic. Edge cases to raise: expired links return 410, custom aliases need a uniqueness check, malicious URLs need scanning, and the same long URL submitted twice may or may not return the same code, so state your choice." },
        { type: "h2", text: "Rate limiter: placement and algorithm" },
        { type: "p", text: "Put the limiter at the API gateway or a middleware in front of services, keyed by user id, API key or IP, with a rule per route. Return **429** with a `Retry-After` header. Counters live in a shared store such as Redis so every gateway instance sees the same numbers." },
        { type: "p", text: "Token bucket is the usual pick: a bucket holds up to `capacity` tokens, refills at `rate` per second, each request takes one. It allows short bursts and enforces an average. Sliding window counters are smoother but cost more memory. A fixed window is simplest but lets double the limit through around the boundary." },
        { type: "code", language: "text", title: "token bucket in Redis (one atomic Lua script)", code: `tokens, ts = HMGET key tokens ts
tokens = min(capacity, tokens + (now - ts) * rate)
if tokens >= 1:  tokens -= 1; allowed
else:            rejected
HSET key tokens ts=now ; EXPIRE key ttl` },
        { type: "h2", text: "Failure modes and tiers" },
        { type: "p", text: "Read-modify-write from many gateways is a race, which is why the script above runs atomically inside Redis. If Redis is down, decide per route: **fail open** for general traffic so an outage in the limiter does not become a site outage, **fail closed** for expensive or abuse-prone endpoints such as login. Run a local in-memory fallback limiter with a looser limit as a middle path." },
        { type: "p", text: "Tiers: free users get 60 requests a minute, paid get 600, internal services are exempt. Store limits in config, not code, and expose remaining quota in `X-RateLimit-Remaining` style headers." },
        { type: "callout", tone: "gotcha", title: "Clients behind one IP", text: "Limiting by IP alone punishes offices and mobile carriers that share one address, while attackers rotate IPs freely. Limit by authenticated identity first, and use IP only for unauthenticated routes." },
      ],
      references: [
        { title: "Scaling your API with rate limiters (Stripe)", url: "https://stripe.com/blog/rate-limiters" },
        { title: "RFC 6585: Additional HTTP Status Codes (429)", url: "https://www.rfc-editor.org/rfc/rfc6585" },
        { title: "Token bucket (Wikipedia)", url: "https://en.wikipedia.org/wiki/Token_bucket" },
        { title: "301 Moved Permanently (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301" },
      ],
    },
  },
};
