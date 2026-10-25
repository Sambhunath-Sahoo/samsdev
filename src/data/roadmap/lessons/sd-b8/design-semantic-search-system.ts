import type { LessonEntry } from "@/types/roadmap";

export const DESIGN_SEMANTIC_SEARCH_SYSTEM: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Design a semantic search system over a large corpus",
    slug: "design-semantic-search-system",
    lesson: {
      summary: "Embed the corpus offline, shard an approximate nearest neighbour index, combine it with keyword search and filters, and re-rank a short list at query time.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and sizing" },
        { type: "p", text: "Ask about corpus size, how fast it changes, query rate, latency target, filters needed (language, date, tenant) and how quality will be judged. Example: 500 million documents, 768-dimension embeddings, 2,000 queries per second, p95 under 150 ms, 1 million new documents per day." },
        { type: "p", text: "Raw vectors: 500M x 768 x 4 bytes is about 1.5 TB in float32. Product quantisation or int8 can cut that by 4 to 32 times, which decides whether the index sits in RAM or on SSD. Graph indexes such as HNSW add per-vector link overhead, so budget extra memory on top." },
        { type: "h2", text: "Architecture" },
        { type: "code", language: "text", code: `Indexing:  documents -> clean/dedupe -> chunk -> embed (GPU batch jobs)
           -> write to shards (hash of doc id) -> build/merge ANN segments

Query:     query -> embed (cache common queries)
           -> fan out to all shards: ANN top-k with metadata filter
           -> merge top-k lists (+ keyword/BM25 results via rank fusion)
           -> re-rank top 50-100 with cross-encoder -> return top 10` },
        { type: "p", text: "Sharding by document id spreads writes evenly but forces every query to hit every shard, so tail latency is set by the slowest shard. Mitigate with replicas, hedged requests and per-shard timeouts that return partial results. Sharding by a key such as tenant or language lets queries hit one shard but risks hot shards." },
        { type: "h2", text: "Index choices" },
        { type: "table", head: ["Index", "Strength", "Weakness"], rows: [
          ["Flat (exact)", "Perfect recall, simple", "Linear scan, fine only up to about a million vectors"],
          ["HNSW graph", "High recall, low latency", "Memory heavy, slower to build and update"],
          ["IVF + product quantisation", "Compact, billion scale", "Lower recall; needs tuning of probes"],
          ["Disk-based graph", "Large corpora on SSD", "More I/O per query"],
        ] },
        { type: "p", text: "Filtering is the hard part. Filtering after the ANN search can leave you with too few results; filtering during the graph walk or partitioning by the filter field keeps recall. Updates arrive continuously, so write new documents to a small fresh segment and merge it into big ones in the background, searching both at query time. Deletes are tombstones until merge." },
        { type: "h2", text: "Quality and operations" },
        { type: "list", items: [
          "Hybrid search: vector search catches paraphrase, BM25 catches exact terms, names and codes.",
          "Measure recall of the ANN index against exact search on a sample, and relevance against labelled queries with nDCG or hit rate.",
          "Changing the embedding model means re-embedding everything: build a second index, dual-run, compare, then cut over.",
          "Track p95 latency per shard, index freshness lag and memory headroom.",
        ] },
        { type: "callout", tone: "gotcha", title: "Recall is a dial, not a default", text: "ANN settings such as HNSW `ef_search` or IVF probes trade recall against latency. A fast index at 85 percent recall silently hides relevant documents. Measure recall and pick the setting on purpose." },
      ],
      references: [
        { title: "Efficient and robust approximate nearest neighbor search using HNSW graphs", url: "https://arxiv.org/abs/1603.09320" },
        { title: "Billion-scale similarity search with GPUs (FAISS)", url: "https://arxiv.org/abs/1702.08734" },
        { title: "Accelerating Large-Scale Inference with Anisotropic Vector Quantization (ScaNN)", url: "https://arxiv.org/abs/1908.10396" },
        { title: "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks", url: "https://arxiv.org/abs/1908.10084" },
      ],
    },
    points: [
      {
        id: "sd.design-semantic-search-system.sizing-and-quantisation",
        title: "Sizing vectors and quantisation",
        detail: "Corpus size times dimensions times bytes per value gives the raw footprint, for example 500 million 768-dimension float32 vectors is about 1.5 TB. Quantisation shrinks it by several times at some recall cost and decides whether the index fits in RAM.",
        question: "Estimate the memory needed for 500 million 768-dimension embeddings and name two ways to reduce it.",
      },
      {
        id: "sd.design-semantic-search-system.sharding-and-tail-latency",
        title: "Sharding and tail latency",
        detail: "Sharding by document id balances load but every query fans out to every shard, so the slowest shard sets latency. Replicas, hedged requests and per-shard timeouts with partial results contain the tail.",
        question: "Why does fanning out to 50 shards hurt p99 latency, and how do you reduce it?",
      },
      {
        id: "sd.design-semantic-search-system.filters-and-fresh-updates",
        title: "Filters and fresh updates",
        detail: "Post-filtering an ANN result can return too few hits, so filter during the search or partition by the filter field. New documents go to a small fresh segment that is searched alongside the large ones and merged in the background.",
        question: "How do you support a tenant filter without losing recall, and how do new documents become searchable quickly?",
      },
      {
        id: "sd.design-semantic-search-system.hybrid-and-rerank",
        title: "Hybrid search and re-ranking",
        detail: "Combine vector results with BM25 using rank fusion so exact terms are not missed, then re-rank a shortlist of 50 to 100 with a cross-encoder. Evaluate ANN recall against exact search and relevance against labelled queries.",
        question: "A search for an error code returns nothing useful from the vector index. What do you add?",
      },
    ],
  },
};
