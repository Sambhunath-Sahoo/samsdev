import type { LessonEntry } from "@/types/roadmap";

export const WEB_CRAWLER: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Web crawler",
    slug: "case-web-crawler",
    lesson: {
      summary: "A polite, deduplicating fetch loop around a URL frontier that prioritises pages and never hammers a single host.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: starting from seed URLs, fetch pages, extract links, store content for indexing, and refresh pages over time. Non-functional: **politeness** (respect robots.txt and per-host rate limits), robustness against broken or hostile pages, scalability, and extensibility to other content types." },
        { type: "p", text: "Estimates: crawl 1 billion pages a month at 100 KB each. That is 100 TB a month of raw HTML, and about 400 pages per second sustained (1B / 2.6M seconds). With 50 ms of CPU per page for parsing, about 20 cores handle parsing, but network wait dominates, so hundreds of concurrent fetches per machine are needed." },
        { type: "h2", text: "Architecture" },
        { type: "code", language: "text", code: `seeds -> URL frontier -> fetcher workers -> DNS cache
                    ^                |
                    |                v
            URL filter + dedup <- parser -> content store (blob)
                                      |-> content-seen check (hash)` },
        { type: "list", items: [
          "**URL frontier**: the queue of URLs to fetch. It holds priority queues (by page importance or freshness need) in front of per-host queues, so each host is served one request at a time with a delay.",
          "**Fetcher**: downloads with timeouts and a size cap, follows a limited number of redirects, honours robots.txt (cached per host, see RFC 9309).",
          "**Parser**: extracts links, normalises them (lowercase host, strip fragments, resolve relative paths, sort query parameters) and discards non-HTML.",
          "**URL-seen check**: a Bloom filter in memory answers 'definitely new' or 'maybe seen'. A rare false positive just skips a page; backed by a persistent store for the maybe cases if you cannot afford skips.",
          "**Content-seen check**: hash the body (or a SimHash for near duplicates) so mirrored pages are stored once.",
        ] },
        { type: "p", text: "Scale out by partitioning URLs by host hash, so one worker owns a host and can enforce the delay locally with no coordination. A host that takes a long time to answer lowers its own crawl rate rather than blocking other hosts." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        { type: "table", head: ["Choice", "Upside", "Downside"], rows: [
          ["BFS order", "Simple, wide coverage", "Reaches junk and spam early"],
          ["Priority by rank or change rate", "Good pages first and fresher", "Needs a scoring signal"],
          ["Bloom filter for seen URLs", "Tiny memory for billions of URLs", "False positives skip a few pages"],
          ["Partition by host", "Easy politeness", "A huge site loads one worker"],
        ] },
        { type: "p", text: "DNS lookups are a hidden bottleneck, so run a local resolver cache. Freshness: recrawl pages in proportion to how often they change, learned from past crawls and HTTP `ETag` or `Last-Modified` headers, and send conditional requests so unchanged pages cost almost nothing." },
        { type: "p", text: "Hazards to name: **spider traps** (calendars or session ids producing infinite URLs), solved with a depth cap, a per-host page budget and URL length limits; JavaScript-rendered pages that need a headless browser on a slower, separate path; and bad content such as huge files, malformed encodings and redirect loops." },
        { type: "callout", tone: "gotcha", title: "Politeness is a requirement", text: "A crawler that opens a thousand parallel connections to one small site is a denial-of-service attack. Enforce a delay per host, and stop when you see 429 or 503 responses." },
      ],
      references: [
        { title: "RFC 9309: Robots Exclusion Protocol", url: "https://www.rfc-editor.org/rfc/rfc9309" },
        { title: "Web crawler (Wikipedia)", url: "https://en.wikipedia.org/wiki/Web_crawler" },
        { title: "Bloom filter (Wikipedia)", url: "https://en.wikipedia.org/wiki/Bloom_filter" },
      ],
    },
    points: [
      { id: "sd.cases.web-crawler-frontier", title: "Web crawler: URL frontier and politeness", detail: "The frontier combines priority queues with one queue per host, so each host gets a single request at a time with a delay and robots.txt rules. Partitioning URLs by host hash lets one worker enforce this locally.", question: "How does your frontier guarantee that no site gets more than one request per second?" },
      { id: "sd.cases.web-crawler-dedup", title: "Web crawler: URL and content deduplication", detail: "A Bloom filter tracks URLs already seen using little memory and accepts rare false positives. A content hash, or SimHash for near duplicates, stops mirrored pages from being stored repeatedly.", question: "What does a Bloom filter false positive cost the crawler, and is that acceptable?" },
      { id: "sd.cases.web-crawler-traps-freshness", title: "Web crawler: spider traps and freshness", detail: "Depth caps, per-host page budgets and URL length limits defuse traps with infinite URLs. Recrawl frequency follows each page's change rate, using conditional requests so unchanged pages are cheap.", question: "A calendar page links to the next month forever. What stops the crawler?" },
    ],
  },
};
