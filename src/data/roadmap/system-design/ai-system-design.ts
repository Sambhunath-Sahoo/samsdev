import type { RoadmapSection } from "@/types/roadmap";
import { outline } from "../outline";

export const AI_SYSTEM_DESIGN: RoadmapSection = outline("AI system design", "Design problems from the AI engineering side.", [
  {
    title: "Probabilistic systems",
    points: [
      {
        id: "sd.ai.probabilistic-systems",
        title: "Deterministic vs probabilistic system design",
        detail:
          "Traditional systems map the same input to the same output. AI systems are probabilistic: the same input can give different outputs, and correctness is fuzzy (relevance, faithfulness) rather than exact. That changes testing to evaluation sets and scores instead of exact assertions, error handling to fallbacks for low confidence, and monitoring to quality drift as well as uptime.",
        question: "Why can you not unit-test an LLM feature with an exact string assertion, and what do you do instead?",
      },
    ],
  },
  {
    title: "RAG at scale",
    points: [
      {
        id: "sd.ai.rag-pipeline",
        title: "The RAG pipeline end to end",
        detail:
          "RAG answers from your own data instead of the model's memory. Documents are ingested and split into chunks, each chunk is embedded as a vector and indexed in a vector store. At query time the question is embedded, the top-k similar chunks are retrieved and optionally re-ranked, a prompt is assembled from them, and the answer is generated and streamed back. Every stage is a place to trade quality, cost and latency.",
        question: "Walk through what happens to a document and to a question in a RAG system, naming each stage.",
      },
      {
        id: "sd.ai.rag-chunking",
        title: "Chunking strategy",
        detail:
          "Chunk size is a design decision. Chunks that are too large dilute relevance and waste prompt tokens, and chunks that are too small lose the surrounding context needed to answer. Fixed-size chunks with overlap are simple; semantic or structure-aware chunking splits on headings, paragraphs or topic shifts to keep meaning together. Store metadata such as source and section with each chunk for filtering and citations.",
        question: "Answers keep missing context that sits one paragraph away from the retrieved chunk. What do you change?",
      },
      {
        id: "sd.ai.rag-embeddings-and-vector-index",
        title: "Embeddings and vector indexes",
        detail:
          "An embedding model maps text to a vector so that similar meaning lands close together. Vector stores such as pgvector, Pinecone, Weaviate and Qdrant keep the vectors and use an approximate nearest neighbour index, for example HNSW, to search millions of them quickly, trading a little recall for a large speed gain. Queries must be embedded with the same model as the documents, so changing the model means re-embedding everything.",
        question: "Why must queries and documents use the same embedding model, and what does an ANN index give up?",
      },
      {
        id: "sd.ai.rag-retrieval-and-reranking",
        title: "Retrieval and re-ranking",
        detail:
          "First-stage retrieval, vector search often combined with keyword search such as BM25, is tuned for recall: the right chunks should be somewhere in the candidates. A re-ranker, usually a cross-encoder that reads the query and each chunk together, re-scores the candidates for true relevance and fixes their order, so the few chunks that fit in the prompt are the best ones. A typical setup retrieves about twenty, re-ranks and keeps five.",
        question: "Why can retrieval alone return relevant chunks in a poor order, and what does a re-ranker change?",
      },
      {
        id: "sd.ai.rag-generation-and-streaming",
        title: "Generation and streaming the response",
        detail:
          "The prompt combines instructions, the retrieved chunks and the question, and tells the model to answer only from the context and to say so when the answer is not there. Generation is slow compared with retrieval, so stream tokens to the client with Server-Sent Events and the user sees text early instead of waiting for the whole answer. Include source references so users can verify claims.",
        question: "Retrieval takes 200 ms and generation 8 s. How do you make the experience feel fast?",
      },
    ],
  },
  {
    title: "LLM gateway",
    points: [
      {
        id: "sd.ai.llm-gateway-routing",
        title: "Model routing in an LLM gateway",
        detail:
          "An LLM gateway is one internal service through which every application calls models. Its core job is routing: send simple or short requests to a cheap, fast model and hard ones to a stronger, more expensive model, chosen by rules, a classifier or a cascade that escalates when confidence is low. This balances cost against quality and lets you swap providers in one place.",
        question: "How do you decide which requests go to the cheap model, and how do you check routing is not hurting quality?",
      },
      {
        id: "sd.ai.llm-gateway-controls",
        title: "What else the gateway centralises",
        detail:
          "Because every call passes through it, the gateway is the place for authentication, per-team rate limits and budgets, retries and fallback to another provider when one is down or returns 429, caching, logging with request ids and moderation hooks. Streaming responses must pass through without buffering the whole body. Provider outages and rate limits are normal events to design for.",
        question: "A provider returns 429s for ten minutes. What should the gateway do for in-flight and new requests?",
      },
    ],
  },
  {
    title: "Agent platform",
    points: [
      {
        id: "sd.ai.agent-react-loop",
        title: "ReAct: reasoning interleaved with tool calls",
        detail:
          "In the ReAct pattern the model alternates between reasoning about what to do and acting by calling a tool, then reads the result and reasons again, looping until it can answer. Unlike chain-of-thought, which reasons only inside the model, each step is grounded in a real observation. Frameworks such as LangGraph model the loop as a graph of steps with state, and step limits are needed so a loop cannot run forever.",
        question: "How does ReAct differ from chain-of-thought, and what stops an agent loop from running forever?",
      },
      {
        id: "sd.ai.agent-tool-calling",
        title: "Tool calling and function calling",
        detail:
          "You give the model a set of tools, each with a name, a description and a JSON schema for its arguments. The model replies with a structured call, your code validates and executes it, and the result goes back into the conversation. The model never runs anything itself, so validate arguments, apply the same authorization checks as for any user action, and keep tools narrow and idempotent where possible.",
        question: "Why must arguments the model chooses be validated and authorised like user input?",
      },
      {
        id: "sd.ai.agent-when-not-to-use",
        title: "When not to use an agent",
        detail:
          "An agent adds latency, cost and unpredictability, so use a plain deterministic function or a fixed workflow when the steps are known in advance. Reach for an agent only when the task needs open-ended decisions about which steps to take. Keep a human in the loop for irreversible actions.",
        question: "A feature always does lookup, format, send, in that order. Why is an agent the wrong choice?",
      },
    ],
  },
  {
    title: "Evaluation, cost and latency",
    points: [
      {
        id: "sd.ai.cost-latency-quality-triangle",
        title: "The cost, latency and quality triangle",
        detail:
          "Better quality usually needs bigger models, more retrieved context or more reasoning steps, which raises token cost and latency. LLMs charge per input and output token, and latency has two parts: time to first token and total generation time. A good answer to any GenAI design question says which corner it protects and what it gives up.",
        question: "Your RAG answers are good but cost too much. Name three levers and what each costs you in quality or latency.",
      },
      {
        id: "sd.ai.semantic-caching",
        title: "Semantic caching",
        detail:
          "An exact-match cache only hits when the text is identical. A semantic cache embeds the query and returns a stored answer when an earlier query is close enough in meaning, avoiding the LLM call entirely. The risk is serving a wrong answer for a question that looks similar but differs, so use a conservative similarity threshold, scope the cache by tenant and permissions, and expire entries when the source data changes.",
        question: "Why does a semantic cache hit more often than an exact-match cache, and what is its main risk?",
      },
      {
        id: "sd.ai.time-to-first-token",
        title: "Time to first token and streaming",
        detail:
          "Users judge responsiveness by when text starts to appear, not when it finishes. Time to first token includes retrieval, re-ranking and prompt processing, and streaming tokens as they are generated makes the same total time feel much shorter. Keep the retrieval path fast and design loading states around the fact that generation takes seconds.",
        question: "What contributes to time to first token in a RAG request, and which parts can you shorten?",
      },
      {
        id: "sd.ai.hallucination-mitigation",
        title: "Mitigating hallucination",
        detail:
          "Ground answers in retrieved context instead of the model's built-in knowledge, instruct it to answer only from that context and cite sources, measure faithfulness of outputs against the context, and add a fallback so low-confidence retrieval produces 'I do not have enough information' rather than a confident wrong answer.",
        question: "Retrieval returns nothing relevant. What should the system say, and how does it detect that case?",
      },
      {
        id: "sd.ai.rag-evaluation-metrics",
        title: "Evaluating RAG: faithfulness and relevancy",
        detail:
          "Faithfulness checks that every claim in the answer is supported by the retrieved context. Response relevancy checks that the answer addresses the question, and a faithful answer can still be irrelevant if retrieval fetched the wrong chunks. Retrieval is measured separately with context precision and recall. RAGAS is an open-source framework that scores these automatically, often with an LLM as the judge.",
        question: "An answer is faithful but unhelpful. Which metric catches it, and where is the likely defect?",
      },
      {
        id: "sd.ai.eval-over-time",
        title: "Evaluation over time",
        detail:
          "Run the evaluation set in CI before changes ship and keep tracking quality in production, because prompts, models, documents and user questions all drift. Keep a fixed golden set plus samples of real traffic, review failures by stage (retrieval, re-ranking, generation) and gate releases on score regressions.",
        question: "What events should trigger re-running your RAG evaluation after launch?",
      },
    ],
  },
  {
    title: "LLM serving and infrastructure",
    points: [
      {
        id: "sd.ai.llm-batching",
        title: "Batching requests",
        detail:
          "A GPU is most efficient when it handles many requests at once, so serving systems batch concurrent requests. Modern servers use continuous batching, adding new requests to the running batch as others finish instead of waiting for a whole batch to complete, which raises throughput. Larger batches raise throughput but add latency per request, the same trade-off as batching anywhere.",
        question: "Why does batching improve GPU cost efficiency, and what does it do to the latency of one request?",
      },
      {
        id: "sd.ai.kv-cache",
        title: "KV caching",
        detail:
          "While generating, each new token attends to all earlier tokens. The key and value tensors computed for earlier tokens are kept in a KV cache so they are not recomputed at every step, which is why generation latency is usable at all. The cache grows with context length and the number of concurrent requests, so GPU memory rather than compute often limits how many requests one GPU can serve. Prefix caching reuses it across requests that share a long system prompt.",
        question: "What does the KV cache store, and why does a long context reduce how many requests fit on a GPU?",
      },
      {
        id: "sd.ai.llm-latency-and-timeouts",
        title: "Latency profile and timeouts of LLM calls",
        detail:
          "A model call takes seconds rather than milliseconds, and p99 can be much longer. That changes the design: use generous but bounded timeouts, stream responses, move batch work to queues, cache aggressively, and set retries carefully because each retry costs money and may repeat a slow call.",
        question: "Why is a 2-second timeout copied from a normal REST client a bad default for an LLM call?",
      },
    ],
  },
  {
    title: "Safety and guardrails",
    points: [
      {
        id: "sd.ai.input-output-moderation",
        title: "Input and output moderation",
        detail:
          "Screen user input for PII, toxicity and prompt-injection attempts before it reaches the model, and screen generated output before it reaches the user, since either side can carry harmful or sensitive content. Use classifiers or moderation APIs and redact PII. Treat retrieved documents as untrusted input too, because they can contain injected instructions.",
        question: "A document in your knowledge base contains 'ignore previous instructions'. Where in the pipeline do you defend against it?",
      },
      {
        id: "sd.ai.pipeline-traceability",
        title: "Traceability of the AI pipeline",
        detail:
          "Log every stage under one request id: the prompt, retrieved chunk ids and scores, re-ranker output, model and parameters, and the final answer. When an answer is bad you can tell whether retrieval, ranking or generation caused it, and replay it in evaluation. Mind privacy when logging user content.",
        question: "A user reports a wrong answer. Which logged fields let you decide whether retrieval or generation failed?",
      },
    ],
  },
  "Design a RAG customer-support or knowledge-base assistant",
  "Design an LLM serving system: GPU cluster, batching and routing",
  "Design a semantic search system over a large corpus",
  "Design a recommendation engine: candidate generation, then ranking",
  "Design content moderation: classifier pipeline with human review",
]);
