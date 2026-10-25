import type { LessonEntry } from "@/types/roadmap";

export const SEARCH_AND_VECTOR_STORES: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Search and vector stores",
    slug: "search-and-vector-stores",
    lesson: {
      summary: "How inverted indexes power keyword search, how vector indexes power similarity search, and why neither is your source of truth.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Why a database is not enough" },
        { type: "p", text: "`WHERE description LIKE '%wireless headphones%'` cannot use a B-tree, so it scans every row, and it knows nothing about word forms, typos or relevance. Search needs structures built for text. Similarity search over meaning needs another one again." },
        { type: "h2", text: "Keyword search: the inverted index" },
        { type: "p", text: "An **inverted index** maps each term to the list of documents containing it, the way a book index maps a word to page numbers. At index time, text goes through an **analyzer**: split into tokens, lowercase, drop stop words, reduce words to their stems. At query time the query is analyzed the same way, the posting lists for each term are intersected or merged, and documents are ranked, typically with **BM25**, which scores a document higher when the term is frequent in it, rare in the collection, and the document is not overly long." },
        {
          type: "code",
          language: "text",
          title: "Index built from three documents",
          code: `doc1: "wireless noise cancelling headphones"
doc2: "wired headphones"
doc3: "wireless mouse"

wireless   -> [doc1, doc3]
headphones -> [doc1, doc2]
mouse      -> [doc3]

query "wireless headphones" -> intersect -> doc1 (best), others partial`,
        },
        { type: "p", text: "Elasticsearch, OpenSearch and Solr are built on Lucene, which does this. They also give you filters, facets, fuzzy matching and highlighting. They distribute an index across **shards** and copy each with replicas." },
        { type: "h2", text: "Similarity search: vector stores" },
        { type: "p", text: "A machine learning model turns text, images or audio into an **embedding**, a list of a few hundred to a few thousand numbers, such that similar meaning gives nearby vectors. Search then becomes 'find the vectors nearest to this query vector', measured by cosine similarity or distance. This finds 'cheap laptop for students' when the document says 'budget notebook', which keyword search misses." },
        { type: "p", text: "Exact nearest-neighbour search compares against every vector, which is too slow at millions of items. Vector stores use **approximate nearest neighbour** indexes such as **HNSW** (a layered graph you walk toward the query) or IVF (clusters you search selectively). They trade a little recall for large speed gains, and you tune that trade with index parameters. Options include dedicated systems (Pinecone, Milvus, Qdrant), search engines with vector fields, and the `pgvector` extension, which is often enough while the data fits one Postgres." },
        {
          type: "table",
          head: ["", "Keyword (inverted index)", "Vector (ANN index)"],
          rows: [
            ["Matches on", "Exact or stemmed terms", "Meaning, as distance between embeddings"],
            ["Strong at", "Names, codes, exact phrases, filters", "Paraphrase, natural-language questions, recommendations"],
            ["Result", "Exact, explainable ranking", "Approximate, depends on the model"],
            ["Cost", "Index size from vocabulary", "Memory heavy; embedding every item"],
          ],
        },
        { type: "p", text: "Production systems often use **hybrid search**: run both, then merge the rankings, because exact product codes need keywords while vague questions need vectors." },
        { type: "h2", text: "Keeping it in sync" },
        { type: "p", text: "Neither store should be the system of record. The truth lives in your primary database, and the search index is a derived copy. Feed it with change data capture or an outbox, and expect a delay: Elasticsearch makes new documents searchable on a refresh, one second by default, not instantly. If the index is lost, you rebuild it from the database." },
        { type: "callout", tone: "gotcha", title: "Changing the model means re-embedding everything", text: "Vectors from different embedding models are not comparable. Upgrading the model means re-embedding the whole collection and building a new index, so plan for a parallel index and a cutover rather than an in-place update." },
      ],
      references: [
        { title: "Elasticsearch Guide: Documents and indices", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/documents-indices.html" },
        { title: "Wikipedia: Inverted index", url: "https://en.wikipedia.org/wiki/Inverted_index" },
        { title: "Wikipedia: Hierarchical navigable small world", url: "https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world" },
        { title: "pgvector: Open-source vector similarity search for Postgres", url: "https://github.com/pgvector/pgvector" },
      ],
    },
    points: [
      { id: "sd.search-and-vector-stores.inverted-index", title: "The inverted index", detail: "It maps each analyzed term to the documents that contain it, so a query merges short posting lists instead of scanning every row. Ranking such as BM25 scores by term frequency and rarity.", question: "Why can a search engine answer a text query fast when a LIKE '%word%' scan cannot?" },
      { id: "sd.search-and-vector-stores.embeddings-and-ann", title: "Embeddings and approximate nearest neighbour", detail: "A model maps content to vectors where similar meaning is close together. ANN indexes like HNSW find near vectors without comparing against all of them, trading some recall for speed.", question: "What does recall mean for an ANN index, and what do you give up to raise speed?" },
      { id: "sd.search-and-vector-stores.derived-copy", title: "The index is a derived copy", detail: "Keep the primary database as the source of truth and feed the search or vector index through CDC or an outbox. Expect lag and be able to rebuild the index from scratch.", question: "How do you keep a search index in sync with the database, and what happens if the index is lost?" },
    ],
  },
};
