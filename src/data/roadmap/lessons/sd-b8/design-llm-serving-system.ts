import type { LessonEntry } from "@/types/roadmap";

export const DESIGN_LLM_SERVING_SYSTEM: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Design an LLM serving system: GPU cluster, batching and routing",
    slug: "design-llm-serving-system",
    lesson: {
      summary: "Serve an LLM by placing model replicas on GPUs, routing requests by load and cache locality, batching continuously, and protecting latency with queues and admission control.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and sizing" },
        { type: "p", text: "Clarify the model size, request rate, prompt and output lengths, latency targets (time to first token and tokens per second) and whether traffic is bursty. Example: a 70B model, 100 requests per second at peak, 1,500-token prompts, 300-token answers, TTFT p95 under 2 s." },
        { type: "p", text: "A 70B model in 16-bit needs about 140 GB for weights alone (70B x 2 bytes), so it is split across several GPUs with tensor parallelism, for example 4 or 8 GPUs per replica, plus memory for the KV cache. Quantising to 8 or 4 bits shrinks weights at some quality risk. Total throughput is then replicas times per-replica tokens per second, so capacity planning is in tokens per second, not requests." },
        { type: "h2", text: "Architecture" },
        { type: "code", language: "text", code: `client -> API gateway (auth, quotas, streaming proxy)
       -> router (queue depth, KV-cache pressure, prefix affinity, priority)
       -> model replica pool (each replica: N GPUs, continuous batching engine)
       -> tokens streamed back over SSE

control plane: autoscaler, model registry, rollout manager, metrics` },
        { type: "list", items: [
          "**Engine:** use a serving engine with continuous batching and paged KV cache (vLLM, TGI, TensorRT-LLM) instead of writing one.",
          "**Router:** send to the replica with the shortest queue or most free KV memory; prefer a replica that already holds the request's prompt prefix in cache.",
          "**Priority queues:** interactive chat ahead of batch jobs, with limits per tenant.",
          "**Admission control:** when the queue exceeds a bound, return 429 or fall back to a smaller model, instead of letting latency explode.",
        ] },
        { type: "h2", text: "Trade-offs" },
        { type: "table", head: ["Decision", "Gain", "Cost"], rows: [
          ["Bigger batches", "Throughput, lower cost per token", "Higher per-request latency"],
          ["Separate prefill and decode pools", "Stable TTFT and decode speed", "KV cache transfer between pools, complexity"],
          ["Quantisation", "Fewer GPUs, faster", "Possible quality loss; evaluate"],
          ["Dedicated vs shared GPUs", "Isolation for premium tenants", "Lower utilisation"],
          ["Warm spare replicas", "Absorb bursts", "Idle GPU cost"],
        ] },
        { type: "p", text: "Prefill is compute-heavy and decode is memory-bound, so long prompts can stall everyone's decode on a shared replica. Chunked prefill smooths this, and disaggregating the two phases onto separate GPU pools is the larger fix at high scale." },
        { type: "h2", text: "Operating it" },
        { type: "p", text: "Autoscale on queue depth and KV cache utilisation, not CPU, and scale early because loading weights takes minutes. Roll out new model versions by shifting a small share of traffic first and comparing quality and latency. Monitor TTFT, inter-token latency, tokens per second per GPU, queue time, KV cache use, and error and 429 rates. Handle GPU failure by draining the replica and retrying requests that have not yet streamed." },
        { type: "callout", tone: "cost", title: "Idle GPUs are the main bill", text: "GPUs cost money every hour whether busy or not. Raising utilisation through batching, routing and right-sizing usually saves more than any prompt tweak. Measure cost per million tokens served." },
      ],
      references: [
        { title: "Efficient Memory Management for LLM Serving with PagedAttention (vLLM)", url: "https://arxiv.org/abs/2309.06180" },
        { title: "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving", url: "https://arxiv.org/abs/2401.09670" },
        { title: "Orca: A Distributed Serving System for Transformer-Based Generative Models", url: "https://www.usenix.org/conference/osdi22/presentation/yu" },
        { title: "Text Generation Inference documentation", url: "https://huggingface.co/docs/text-generation-inference/index" },
      ],
    },
    points: [
      {
        id: "sd.design-llm-serving-system.capacity-in-tokens",
        title: "Capacity planning in tokens per second",
        detail: "Weights size decides how many GPUs one replica needs (about 2 bytes per parameter in 16-bit), and the KV cache decides how many requests it can hold at once. Plan capacity as total tokens per second across replicas, not requests per second.",
        question: "How many GPUs does one replica of a 70B model need, and what limits its concurrency after the weights fit?",
      },
      {
        id: "sd.design-llm-serving-system.continuous-batching-and-routing",
        title: "Continuous batching and cache-aware routing",
        detail: "Continuous batching adds and removes requests at every decode step so the GPU stays full. The router sends work to the replica with the shortest queue or free KV memory, and prefers one that already caches the prompt prefix.",
        question: "Why does continuous batching beat waiting to fill a fixed batch, and how does the router use KV cache information?",
      },
      {
        id: "sd.design-llm-serving-system.admission-control",
        title: "Admission control and priorities",
        detail: "A bounded queue per priority class, quotas per tenant and a fast 429 or smaller-model fallback keep latency predictable under overload. Batch jobs yield to interactive traffic.",
        question: "Traffic doubles for ten minutes. What do you shed first, and what do you protect?",
      },
      {
        id: "sd.design-llm-serving-system.scaling-and-rollout",
        title: "Scaling and safe model rollout",
        detail: "Scale on queue depth and KV cache use, keep warm capacity because weights take minutes to load, and roll out a new model by shifting a small share of traffic while comparing quality and latency.",
        question: "Why is CPU-based autoscaling a poor fit for GPU model replicas?",
      },
    ],
  },
};
