import type { LessonEntry } from "@/types/roadmap";

export const SEARCH_ENGINE_CRAWLER_INDEX_RANKING: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Search engine: crawler, inverted index and ranking",
    slug: "search-engine-crawler-inverted-index-and-ranking",
    lesson: {
      summary: "Break a web search engine into a crawler, an indexer and a query-time ranker, and size each stage with real numbers.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: crawl the web, build a searchable index, answer a text query with ranked results in well under half a second. Non-functional: freshness for news pages, politeness to the sites crawled, high availability for queries, and tolerance for stale or partial results." },
        { type: "p", text: "Assume 10 billion pages at 100 KB: about 1 PB of raw HTML. Refreshing everything monthly is 10 billion / 2.6 million seconds, roughly 4,000 pages a second. The index stores far less than the pages, perhaps 10 to 20 percent of raw size, so a few hundred terabytes, spread across thousands of shards. Queries: 50,000 a second at peak." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "Query API and index shape",
          code: `GET /search?q=consistent+hashing&page=1  -> [{url, title, snippet, score}]

term -> posting list: [(docId, termFreq, [positions]), ...] sorted by docId
docId -> {url, title, length, pageRankScore, fetchedAt, contentHash}`,
        },
        { type: "p", text: "An **inverted index** maps each term to the documents that contain it. Posting lists are sorted by document id and compressed with delta encoding, so the stored numbers are small gaps instead of large ids. A query for two words fetches two lists and intersects them." },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "**Crawler.** A URL frontier holds the queue of URLs to fetch. It needs two properties: priority (important or frequently changing pages first) and politeness (one host at a time with a delay, honouring `robots.txt`, which is standardised in RFC 9309). A common layout is many per-host queues behind a priority selector, with each worker owning a set of hosts. Fetchers download, a parser extracts text and links, new links go through a **seen-URL check** (a Bloom filter in front of a large key-value store), and a **content hash** catches duplicate pages. Normalise URLs and cap crawl depth so calendar pages and infinite query strings do not trap you." },
        { type: "p", text: "**Indexer.** Parsed documents flow through a queue to indexing jobs: tokenise, lowercase, remove or keep stop words, stem, then write segments of postings. Index **by document**: split the corpus into shards, each shard holding the full index for its own documents, and replicate each shard. A MapReduce-style batch rebuild handles the bulk, while a small real-time index takes fresh pages and is merged in later." },
        { type: "p", text: "**Query path.** A query hits a front end, which fans out to every shard, since any shard might hold matching documents. Each shard returns its local top 100 by score, and the aggregator merges them into a global top 10. Results for popular queries come from a cache. Ranking has two stages: a cheap score such as **BM25** (term frequency, inverse document frequency, length normalisation) picks candidates, then a heavier model reorders the top few hundred using link authority (PageRank is the classic example), freshness and click signals." },
        {
          type: "table",
          head: ["Partitioning", "Good", "Bad"],
          rows: [
            ["By document", "Even load, simple, a dead shard loses only some documents", "Every query touches every shard"],
            ["By term", "A query touches few shards", "Hot terms overload one shard, multi-word queries need cross-shard joins"],
          ],
        },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Tail latency**: the slowest shard sets query time. Send hedged requests to a replica and return without a shard that is late.",
            "**Freshness vs cost**: recrawl by change rate, not uniformly. News homepages hourly, static pages monthly.",
            "**Spam and duplicates**: content hashes, near-duplicate detection and link-quality signals keep the index clean.",
            "**Index updates**: segments are immutable and merged in the background, so writes never block reads.",
          ],
        },
        { type: "callout", tone: "tip", title: "Draw three boxes first", text: "Crawl, index, serve. Interviewers expect you to say these are three independent pipelines with different scaling needs, then go deep on whichever they pick." },
        { type: "p", text: "Common mistakes: ignoring politeness, forgetting deduplication, and describing ranking as a single formula instead of retrieval followed by re-ranking." },
      ],
      references: [
        { title: "Inverted index (Wikipedia)", url: "https://en.wikipedia.org/wiki/Inverted_index" },
        { title: "Okapi BM25 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Okapi_BM25" },
        { title: "PageRank (Wikipedia)", url: "https://en.wikipedia.org/wiki/PageRank" },
        { title: "RFC 9309: Robots Exclusion Protocol", url: "https://www.rfc-editor.org/rfc/rfc9309" },
      ],
    },
    points: [
      { id: "sd.search-engine-crawler-inverted-index-and-ranking.crawler-frontier", title: "Crawler and URL frontier", detail: "The frontier orders URLs by priority and enforces politeness with per-host queues and delays. A seen-URL check and a content hash stop the crawler from fetching the same page twice.", question: "How do you stop the crawler from hammering one site or getting stuck in an infinite link space?" },
      { id: "sd.search-engine-crawler-inverted-index-and-ranking.inverted-index", title: "Inverted index and sharding", detail: "An inverted index maps each term to a sorted, compressed posting list of documents. Sharding by document spreads load evenly but forces every query to fan out to all shards.", question: "Why is document-based sharding usually preferred over term-based sharding?" },
      { id: "sd.search-engine-crawler-inverted-index-and-ranking.two-stage-ranking", title: "Two-stage ranking", detail: "A cheap scorer such as BM25 retrieves candidates from the index, and a heavier model re-ranks the top few hundred. This keeps query latency low while still using expensive signals.", question: "Why not run the expensive ranking model over every matching document?" },
    ],
  },
};
