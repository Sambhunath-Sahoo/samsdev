import type { LessonEntry } from "@/types/roadmap";

export const CDN_AND_EDGE: LessonEntry = {
  track: "system-design",
  section: "Caching and CDN",
  subsection: {
    title: "CDN and edge",
    slug: "cdn-and-edge",
    lesson: {
      summary: "A CDN caches responses in servers near users, controlled by Cache-Control headers, and the edge can also run code.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What a CDN does" },
        { type: "p", text: "A content delivery network is a fleet of servers in many cities, called points of presence or edge locations. Users are routed to a nearby one, usually through DNS or anycast. If the edge has a fresh copy of the response, it answers directly. If not, it fetches from your **origin**, stores the response and serves it." },
        { type: "p", text: "Two gains follow. Latency drops, because a user in Sydney gets bytes from Sydney instead of a Frankfurt origin, which can mean tens of milliseconds instead of a few hundred. And load drops: the origin serves a given file once per edge, not once per user. The CDN also absorbs traffic spikes and a share of denial-of-service attacks, and terminates TLS close to the user." },
        { type: "h2", text: "What to cache and how to control it" },
        { type: "p", text: "Static assets such as images, JavaScript, CSS and video are the obvious fit. Public API responses and server-rendered pages can be cached too, if they are the same for everyone. Your origin controls the CDN with response headers." },
        {
          type: "code",
          language: "http",
          title: "Typical headers",
          code: `# fingerprinted asset: app.3f9a1c.js
Cache-Control: public, max-age=31536000, immutable

# public page: browsers 1 minute, CDN 5 minutes, serve stale while refreshing
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=60

# personal data: never store in a shared cache
Cache-Control: private, no-store`,
        },
        { type: "list", items: [
          "`max-age` is the browser's freshness lifetime. `s-maxage` overrides it for shared caches such as a CDN.",
          "`private` forbids shared caches. `no-store` forbids any storage.",
          "`Vary: Accept-Encoding` tells the cache to keep separate copies per request header. A careless `Vary: Cookie` makes nearly every request a miss.",
          "The **cache key** is usually the URL plus selected headers. Query strings such as tracking parameters can split one page into thousands of copies unless you exclude them.",
        ] },
        { type: "h2", text: "Invalidation and versioning" },
        { type: "p", text: "Purging a CDN works through an API, and propagation is fast but not instant, and sometimes costs money per request. The better habit is to avoid needing it: put a content hash in asset filenames, set a one-year `immutable` lifetime, and ship a new filename on every change. Only the HTML that references the files needs a short TTL." },
        { type: "table", head: ["Content", "Strategy"], rows: [
          ["Hashed JS, CSS, images", "Long max-age, immutable, new name per release"],
          ["HTML pages, public", "Short `s-maxage` with stale-while-revalidate, purge on publish"],
          ["API responses, public", "Short TTL, key on the parameters that change the answer"],
          ["Per-user content, auth responses", "`private` or `no-store`, never in a shared cache"],
        ] },
        { type: "h2", text: "The edge as a compute layer" },
        { type: "p", text: "Modern CDNs also run your code at the edge: rewrites and redirects, A/B routing, auth checks, header changes, image resizing and sometimes full request handling. It keeps logic next to the user. The limits are real: small runtime, short execution time, and data that lives far away, so an edge function that calls a distant database loses the latency benefit." },
        { type: "p", text: "An origin shield (a middle cache tier) lets all edges fetch through one location, which raises the hit ratio and protects the origin from a thundering herd of simultaneous misses." },
        { type: "callout", tone: "gotcha", title: "Caching a personalized page", text: "If a response varies by user but the CDN sees one URL, user A's page can be served to user B. Mark personal responses `private` or `no-store`, and test with two different logged-in sessions before launch." },
        { type: "p", text: "In an interview, mention the CDN for static assets and media by default, explain the hashed filenames, and track the cache hit ratio as the main metric." },
      ],
      references: [
        { title: "HTTP caching (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
        { title: "HTTP Caching (RFC 9111)", url: "https://www.rfc-editor.org/rfc/rfc9111" },
        { title: "Cloud CDN overview (Google Cloud)", url: "https://cloud.google.com/cdn/docs/overview" },
        { title: "What is Amazon CloudFront?", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html" },
      ],
    },
    points: [
    {
      id: "sd.cdn-and-edge.edge-cache-and-origin",
      title: "Edge caches answer, the origin fills them",
      detail: "Users are routed to a nearby edge location, which serves a stored copy or fetches it from the origin once and keeps it. This cuts latency and means the origin serves each object roughly once per edge instead of once per user.",
      question: "What happens on the first request for a file at an edge, and on the second request from another user in the same city?",
    },
    {
      id: "sd.cdn-and-edge.cache-control-and-vary",
      title: "Cache-Control, s-maxage and the cache key",
      detail: "The origin steers the CDN with `Cache-Control`: `max-age` for browsers, `s-maxage` for shared caches, `private` and `no-store` for personal data. `Vary` and the query string become part of the cache key, so careless use fragments the cache.",
      question: "Which headers would you set for a hashed JavaScript bundle, a public article page and a logged-in dashboard?",
    },
    {
      id: "sd.cdn-and-edge.versioned-assets-over-purge",
      title: "Version file names instead of purging",
      detail: "A content hash in the filename lets you cache assets for a year with `immutable` and ship a new name on each change. Purging remains for HTML and emergencies, since it is slower and may be rate-limited or billed.",
      question: "Why is changing the filename a better invalidation strategy for static assets than purging the CDN?",
    },
    {
      id: "sd.cdn-and-edge.edge-compute-limits",
      title: "Edge compute and its limits",
      detail: "Code at the edge can rewrite, redirect, authenticate and route close to the user. It runs in small, short-lived runtimes, and calling a far-away database from the edge can erase the latency gain.",
      question: "When does moving logic to an edge function help, and when does it make latency worse?",
    },
    ],
  },
};
