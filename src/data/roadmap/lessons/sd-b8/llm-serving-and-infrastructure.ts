import type { LessonEntry } from "@/types/roadmap";

export const LLM_SERVING_AND_INFRASTRUCTURE: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "LLM serving and infrastructure",
    slug: "llm-serving-and-infrastructure",
    lesson: {
      summary: "LLM serving is bound by GPU memory and memory bandwidth, so continuous batching and KV cache management decide throughput, and callers must treat each call as slow and variable.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two phases, two bottlenecks" },
        { type: "p", text: "Generating text happens in two phases. **Prefill** processes the whole prompt in one parallel pass and is limited by compute. **Decode** then produces one token at a time, each needing the weights and the stored attention state to be read from GPU memory, so it is limited by memory bandwidth. A GPU doing decode for a single request is mostly idle, which is why serving design is about keeping the GPU busy with many requests at once." },
        { type: "h2", text: "Batching requests" },
        { type: "p", text: "Reading the weights costs the same whether one sequence or thirty-two are being decoded, so batching raises throughput nearly for free, at the price of some latency per request." },
        { type: "list", items: [
          "**Static batching:** wait for N requests, run them together, return all. Simple, but the batch is held until the longest output finishes and the GPU waits on short ones.",
          "**Continuous (in-flight) batching:** the scheduler adds new requests and removes finished ones at every decode step. This is the default in engines such as vLLM and TGI and can multiply throughput several times over static batching.",
          "**Chunked prefill:** split long prompts so one big prompt does not stall the decode of everyone else.",
        ] },
        { type: "h2", text: "KV caching" },
        { type: "p", text: "Attention needs the keys and values of every earlier token. Instead of recomputing them for each new token, the server stores them: the KV cache. It makes decode fast but uses a lot of memory that grows with sequence length and with the number of concurrent requests." },
        { type: "p", text: "Rough sizing for a 7B-class model with 32 layers and 4096 hidden size in 16-bit precision: 2 (keys and values) x 32 x 4096 x 2 bytes is about 0.5 MB per token. A 4,000-token conversation holds about 2 GB, so 20 concurrent users need about 40 GB just for caches, beside the weights. KV memory, not compute, usually caps concurrency." },
        { type: "list", items: [
          "**Paged allocation** (PagedAttention) stores the cache in small blocks, avoiding fragmentation and wasted reserved memory.",
          "**Prefix caching** reuses the cache of a shared prompt prefix such as a system prompt, so repeated prefixes skip prefill.",
          "**Quantised or grouped-query attention** shrinks the cache, with a small quality cost.",
        ] },
        { type: "h2", text: "Latency profile and timeouts of LLM calls" },
        { type: "p", text: "An LLM call is slow and its duration depends on the output: total time is roughly queueing + prefill + (output tokens x time per token). At 30 tokens per second, a 600-token answer takes about 20 seconds. Variance is high, and p99 can be several times p50 during load." },
        { type: "table", head: ["Setting", "Guideline"], rows: [
          ["Connect timeout", "Short (1 to 3 s)"],
          ["Time to first token timeout", "Tight (5 to 10 s); if no token arrives, fail over"],
          ["Total timeout", "Based on max output tokens, not a fixed 30 s"],
          ["Idle-stream timeout", "Abort if no token for N seconds"],
          ["Retries", "Only before the first token, with jitter and a budget"],
        ] },
        { type: "p", text: "Always cap `max_tokens`, because an unbounded answer is an unbounded bill and timeout. Use admission control: when the queue is deep, reject with 429 or route to a smaller model rather than letting every request wait minutes. Scale on queue depth or KV cache utilisation, not CPU." },
        { type: "callout", tone: "gotcha", title: "Retrying a streamed response", text: "Retrying after the first tokens were already sent to the user duplicates or contradicts what they saw, and doubles the cost. Retry or fail over only before streaming starts." },
        { type: "p", text: "Interview mistake: autoscaling LLM replicas like stateless web servers. A new GPU replica takes minutes to load tens of gigabytes of weights and arrives with a cold cache, so keep warm capacity and scale early." },
      ],
      references: [
        { title: "Efficient Memory Management for LLM Serving with PagedAttention (vLLM)", url: "https://arxiv.org/abs/2309.06180" },
        { title: "Orca: A Distributed Serving System for Transformer-Based Generative Models", url: "https://www.usenix.org/conference/osdi22/presentation/yu" },
        { title: "vLLM documentation", url: "https://docs.vllm.ai/en/latest/" },
        { title: "Efficiently Scaling Transformer Inference", url: "https://arxiv.org/abs/2211.05102" },
      ],
    },
  },
};
