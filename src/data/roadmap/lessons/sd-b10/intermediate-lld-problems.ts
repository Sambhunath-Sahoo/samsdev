import type { LessonEntry } from "@/types/roadmap";

export const INTERMEDIATE_LLD_PROBLEMS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Intermediate problems: elevator system, Splitwise, rate limiter, URL shortener",
    slug: "intermediate-lld-problems",
    lesson: {
      summary: "Four mid-level problems, each with one algorithm that carries the design: elevator scheduling, net balances, token bucket and ID encoding.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The algorithm is the design" },
        { type: "p", text: "These problems have a class structure you can sketch in minutes. The marks are in the one algorithm underneath, so name it early and put it behind an interface." },
        { type: "h2", text: "Elevator system" },
        { type: "p", text: "Entities: `Elevator` (floor, direction, pending stops, state), `Request` (floor, direction), `Dispatcher`. Each elevator uses a SCAN-style rule: keep moving in the current direction serving stops on the way, reverse only when nothing is left ahead. The dispatcher assigns a hall call to the elevator that is idle or already heading toward that floor with the smallest distance. Make the dispatch rule a `Strategy`, since interviewers love asking to swap it." },
        { type: "h2", text: "Splitwise" },
        { type: "p", text: "Entities: `User`, `Expense` (payer, amount, split type, participants), `Ledger`. Split types (equal, exact, percent) are strategies that return a share per user. Do not store pairwise debts and chase them; keep a **net balance per user**: payer gets `+amount`, each participant gets `-share`. To settle, repeatedly match the biggest creditor with the biggest debtor. Use integer cents and give the rounding remainder to someone deterministically, or shares will not add up to the total." },
        { type: "h2", text: "Rate limiter" },
        { type: "p", text: "A token bucket holds up to `capacity` tokens and refills at a steady rate. A request spends one token or is rejected. It allows bursts up to capacity while holding the average rate. Compute refill lazily on each call instead of running a timer." },
        {
          type: "code",
          language: "typescript",
          code: `class TokenBucket {
  private tokens: number;
  private lastRefillMs: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number,
    nowMs: number,
  ) {
    this.tokens = capacity;
    this.lastRefillMs = nowMs;
  }

  tryAcquire(nowMs: number): boolean {
    const elapsedSec = (nowMs - this.lastRefillMs) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSecond);
    this.lastRefillMs = nowMs;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}

class RateLimiter {
  private readonly buckets = new Map<string, TokenBucket>();
  constructor(private readonly capacity: number, private readonly perSecond: number) {}

  allow(clientId: string, nowMs: number = Date.now()): boolean {
    let bucket = this.buckets.get(clientId);
    if (!bucket) {
      bucket = new TokenBucket(this.capacity, this.perSecond, nowMs);
      this.buckets.set(clientId, bucket);
    }
    return bucket.tryAcquire(nowMs);
  }
}`,
        },
        { type: "p", text: "Put the algorithm behind a `Limiter` interface so a sliding window or fixed window can replace it. In one process this is safe in Node because the method is synchronous. In Java you would lock per bucket, and across servers the state moves to Redis with an atomic script." },
        { type: "h2", text: "URL shortener" },
        { type: "p", text: "Entities: `UrlShortener`, a `UrlStore` interface, an `IdGenerator`. Generate a unique numeric ID and encode it in base62 (`0-9a-zA-Z`); seven characters give 62^7, about 3.5 trillion codes. Compared with hashing the URL and truncating, a counter never collides. A custom alias just checks the store for uniqueness first. Handle expiry as a field checked on lookup." },
        {
          type: "table",
          head: ["Problem", "Key algorithm", "Interface to extract"],
          rows: [
            ["Elevator", "SCAN plus nearest-eligible dispatch", "`DispatchStrategy`"],
            ["Splitwise", "net balance, greedy settle", "`SplitStrategy`"],
            ["Rate limiter", "token bucket, lazy refill", "`Limiter`"],
            ["URL shortener", "counter plus base62", "`IdGenerator`, `UrlStore`"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Wall clock inside the class", text: "Calling `Date.now()` deep inside the limiter makes it untestable. Pass time in as a parameter or inject a clock, so a test can say \"two seconds later\" without sleeping." },
      ],
      references: [
        { title: "Elevator algorithm (Wikipedia)", url: "https://en.wikipedia.org/wiki/Elevator_algorithm" },
        { title: "Token bucket (Wikipedia)", url: "https://en.wikipedia.org/wiki/Token_bucket" },
        { title: "Base62 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Base62" },
        { title: "Strategy pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Strategy_pattern" },
      ],
    },
    points: [
      { id: "sd.intermediate-lld-problems.elevator-scan-dispatch", title: "Elevator scheduling", detail: "Each elevator keeps moving in one direction serving stops on the way and reverses only when nothing is left ahead. A dispatcher picks which elevator takes a hall call, and that choice should be a swappable strategy.", question: "Why does serving requests strictly in arrival order make an elevator slower than a SCAN-style sweep?" },
      { id: "sd.intermediate-lld-problems.splitwise-net-balances", title: "Splitwise net balances", detail: "Store one net balance per user instead of pairwise debts: the payer is credited the full amount and each participant is debited their share. Work in integer cents and assign the rounding remainder deterministically so shares sum to the total.", question: "How do you split 100 cents among three people so the three shares still add up to 100?" },
      { id: "sd.intermediate-lld-problems.token-bucket-limiter", title: "Token bucket rate limiter", detail: "A bucket with a capacity and a refill rate allows short bursts while holding the long-run average. Refill lazily from the elapsed time on each request, and keep one bucket per client.", question: "What happens to a bucket with capacity 10 and refill 5 per second after a client is idle for an hour?" },
      { id: "sd.intermediate-lld-problems.url-shortener-base62", title: "URL shortener ID encoding", detail: "Generate a unique counter value and encode it in base62 to get short codes with no collisions. Hashing and truncating needs collision handling, and custom aliases need a uniqueness check against the store.", question: "How many distinct codes can a 6-character base62 string represent?" },
    ],
  },
};
