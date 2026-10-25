import type { LessonEntry } from "@/types/roadmap";

export const RAG_AT_SCALE: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "RAG at scale",
    slug: "rag-at-scale",
    lesson: {
      summary: "Retrieval-augmented generation splits into ingestion and query paths, and each stage (chunking, embedding, search, re-ranking, generation) is a quality, cost and latency decision.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The RAG pipeline end to end" },
        { type: "p", text: "A language model only knows what was in its training data and what you put in the prompt. Retrieval-augmented generation (RAG) fetches the relevant pieces of your own data at question time and puts them in the prompt, so answers can use private, fresh documents and cite them. There are two paths." },
        { type: "list", ordered: true, items: [
          "**Ingestion (offline):** load documents, clean them, split into chunks, embed each chunk, write vectors plus metadata to an index.",
          "**Query (online):** embed the question, retrieve candidates, re-rank, build the prompt, generate, stream the answer with sources.",
        ] },
        { type: "h2", text: "Chunking strategy" },
        { type: "p", text: "Models and embeddings work on pieces, not whole documents. Big chunks (2,000 tokens) blur several topics into one vector and waste prompt space. Tiny chunks (50 tokens) lose the sentence before and after that makes them understandable. A common start is 200 to 500 tokens with 10 to 20 percent overlap, split on headings and paragraphs first and by size only as a fallback." },
        { type: "p", text: "Store metadata on each chunk: document id, title, section, URL, updated time and access group. You need it for citations, filtering and permission checks. A useful trick is to prepend a one-line description of where the chunk sits in the document before embedding it, which helps when a chunk says only \"it increased by 5 percent\"." },
        { type: "h2", text: "Embeddings and vector indexes" },
        { type: "p", text: "An embedding model turns text into a vector (for example 768 or 1536 numbers) so that similar meaning is close in space. Exact search compares the query with every vector, which is fine at 100k chunks and too slow at 100M. Approximate nearest neighbour (ANN) indexes such as HNSW give up a little recall for a large speedup." },
        { type: "p", text: "Sizing example: 10 million chunks at 768 dimensions in float32 is 10M x 768 x 4 bytes, about 31 GB before index overhead. Quantizing to int8 cuts that to roughly a quarter. Queries and documents must use the same embedding model, so switching models means re-embedding the whole corpus, and you should keep the model name in each chunk's metadata." },
        { type: "h2", text: "Retrieval and re-ranking" },
        { type: "p", text: "First-stage retrieval is tuned for recall: pull about 20 to 50 candidates. Vector search finds meaning but can miss exact tokens such as an error code or a product SKU, so many systems run keyword search (BM25) in parallel and merge the two lists, often with reciprocal rank fusion. A re-ranker, usually a cross-encoder that reads the query and each candidate together, re-scores them precisely and you keep the top 5. It is slower per item than a vector lookup, which is why it only sees the shortlist." },
        { type: "table", head: ["Stage", "Optimises", "Typical cost"], rows: [
          ["Vector + keyword search", "Recall", "10 to 100 ms"],
          ["Cross-encoder re-rank (30 items)", "Precision and order", "50 to 300 ms"],
          ["Generation", "Answer quality", "2 to 15 s"],
        ] },
        { type: "h2", text: "Generation and streaming the response" },
        { type: "p", text: "The prompt holds instructions, numbered chunks and the question, and tells the model to answer only from the context, cite chunk numbers and say when the answer is missing. Generation dwarfs retrieval in latency, so stream tokens over Server-Sent Events: the user sees the first words in about a second while the rest is still being produced." },
        { type: "code", language: "text", title: "Prompt skeleton", code: `System: Answer using only the sources below. Cite as [1], [2].
If the sources do not contain the answer, say you do not know.

Sources:
[1] (Refund policy, updated 2025-03) ...
[2] (Shipping FAQ) ...

Question: Can I return an opened item after 30 days?` },
        { type: "callout", tone: "gotcha", title: "Permissions belong in retrieval", text: "If a user may not read a document, its chunks must be filtered out in the search query using the metadata. Asking the model to \"not reveal\" restricted text after it is already in the prompt is not access control." },
        { type: "p", text: "At scale the extra concerns are ingestion throughput (queue-based workers, idempotent upserts keyed by chunk id), re-indexing when documents change, and deleting vectors when a source document is deleted. Common interview mistake: describing only the query path and forgetting that keeping the index fresh is half the system." },
      ],
      references: [
        { title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al.)", url: "https://arxiv.org/abs/2005.11401" },
        { title: "Anthropic: Introducing Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval" },
        { title: "Efficient and robust approximate nearest neighbor search using HNSW graphs (Malkov, Yashunin)", url: "https://arxiv.org/abs/1603.09320" },
        { title: "pgvector: vector similarity search for Postgres", url: "https://github.com/pgvector/pgvector" },
        { title: "Sentence Transformers: Cross-Encoders", url: "https://www.sbert.net/examples/cross_encoder/applications/README.html" },
      ],
    },
  },
};
