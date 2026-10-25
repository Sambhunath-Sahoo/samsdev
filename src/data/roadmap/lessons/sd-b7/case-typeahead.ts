import type { LessonEntry } from "@/types/roadmap";

export const TYPEAHEAD: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Typeahead",
    slug: "case-typeahead",
    lesson: {
      summary: "Return the top suggestions for a prefix in tens of milliseconds by precomputing them from query logs instead of ranking at request time.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: as the user types, show the 5 to 10 most relevant completions for the current prefix. Non-functional: responses under 100 ms end to end, since suggestions that arrive after the next keystroke are useless; high availability; freshness within minutes to hours, not seconds. Suggestions may be slightly stale." },
        { type: "p", text: "Estimates: 100M daily users, 10 searches each, about 5 keystrokes sent per search is 5 billion requests a day, roughly 60,000 per second and 150,000 at peak. Distinct queries worth indexing: say 100 million, averaging 30 bytes, so about 3 GB of raw text. That is small. The load is the problem, not the volume." },
        { type: "h2", text: "API and data model" },
        { type: "code", language: "text", title: "API", code: `GET /suggest?q=wea&limit=8&lang=en
-> 200 { "q": "wea", "suggestions": ["weather", "weather tomorrow", "wearable"] }
   Cache-Control: public, max-age=300` },
        { type: "p", text: "The core structure is a **trie** (prefix tree) where each node stores the top K completions below it with their scores. A lookup walks the prefix and returns the stored list with no subtree scan. Storing top K per node trades memory for a latency that is proportional only to the prefix length." },
        { type: "code", language: "text", title: "node", code: `node("wea") -> top8: [("weather", 9.1M), ("weather tomorrow", 4.2M), ...]
score = recent_count (decayed) + small boost for personalisation` },
        { type: "h2", text: "Architecture" },
        { type: "list", items: [
          "**Read path**: browser cache and CDN, then a stateless suggestion service holding the trie in memory (or a key-value store keyed by prefix), so the lookup is one hash fetch.",
          "**Write path**: search servers log queries to a stream (Kafka). An aggregation job counts queries per window, applies time decay so old trends fade, filters unsafe or low-count terms, and builds a fresh trie or prefix map.",
          "**Publish**: build offline every 15 minutes to a few hours, ship the snapshot to suggestion servers and swap atomically. Never update a live trie in place with every query.",
          "**Sharding**: split by first one or two letters, but balance by traffic, since 's' is far busier than 'x'. Replicate each shard for read capacity.",
        ] },
        { type: "p", text: "Client-side work matters as much as server work: **debounce** keystrokes by about 100 to 200 ms, cancel in-flight requests when a new key arrives, cache results per prefix in memory, and start suggesting from the second character." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        { type: "table", head: ["Choice", "Upside", "Downside"], rows: [
          ["Top K stored per trie node", "O(prefix length) lookup", "Several times more memory"],
          ["Offline rebuild", "Simple, fast reads", "Trends appear with a delay"],
          ["Near-real-time updates", "Catches breaking news", "Complex, noisy, easy to game"],
          ["Search engine suggester (Elasticsearch)", "Fuzzy match, less code", "More latency and cost at this QPS"],
        ] },
        { type: "p", text: "Other points worth raising: typo tolerance (an edit-distance fallback only when the prefix has no hits), personalisation (merge a small per-user list into the global list at the edge), multi-language tries, and a blocklist that removes offensive or legally sensitive suggestions before publication." },
        { type: "callout", tone: "gotcha", title: "Ranking at request time", text: "Scanning all words under a prefix and sorting on every keystroke does not survive 150,000 requests per second. The answer is precomputation: rank offline, store the result, serve a lookup." },
      ],
      references: [
        { title: "Trie (Wikipedia)", url: "https://en.wikipedia.org/wiki/Trie" },
        { title: "Suggesters (Elasticsearch reference)", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html" },
        { title: "Consistent hashing (Wikipedia)", url: "https://en.wikipedia.org/wiki/Consistent_hashing" },
      ],
    },
    points: [
      { id: "sd.cases.typeahead-trie-top-k", title: "Typeahead: trie with top-K per node", detail: "Each trie node stores the best K completions for its prefix with scores, so a lookup walks only as many nodes as the prefix is long. The cost is extra memory, which is cheap at around 3 GB of raw queries.", question: "Why store the top K at every node instead of scanning the subtree at request time?" },
      { id: "sd.cases.typeahead-offline-build", title: "Typeahead: offline aggregation and atomic publish", detail: "Query logs flow through a stream into a periodic job that counts, decays old scores, filters bad terms and builds a new snapshot. Servers load it and swap atomically instead of mutating a live structure.", question: "How fresh are suggestions in your design, and what would it cost to make them fresher?" },
      { id: "sd.cases.typeahead-client-caching", title: "Typeahead: debounce and caching on the client", detail: "Debouncing 100 to 200 ms, cancelling stale requests and caching per prefix cut server load severalfold. Cacheable responses with a short max-age let a CDN absorb popular prefixes.", question: "Which three client behaviours reduce typeahead traffic, and by roughly how much?" },
    ],
  },
};
