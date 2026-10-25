import type { LessonEntry } from "@/types/roadmap";

export const LLM_GATEWAY: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "LLM gateway",
    slug: "llm-gateway",
    lesson: {
      summary: "A gateway puts one internal API in front of many model providers so routing, fallbacks, limits, caching and cost tracking live in one place instead of every service.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why a gateway" },
        { type: "p", text: "Once three teams call three providers directly, each one re-implements retries, API key handling, rate limiting and logging, and none of them can answer \"how much did we spend on LLMs last week?\". An LLM gateway is a thin service that exposes one stable API (often shaped like the OpenAI chat format) and talks to the providers behind it. Applications ask for a capability, the gateway decides the model." },
        { type: "h2", text: "Model routing in an LLM gateway" },
        { type: "p", text: "Models differ by roughly an order of magnitude in price, and small models answer simple requests just as well. Routing sends each request to the cheapest model that is good enough. Common strategies:" },
        { type: "table", head: ["Strategy", "How it decides", "Watch out for"], rows: [
          ["Static by task", "Classification uses the small model, drafting uses the large one", "Needs an owner to revisit as models change"],
          ["Cascade", "Try the cheap model, escalate if a check fails (low confidence, invalid JSON)", "Failed attempts add latency and cost"],
          ["Learned router", "A small classifier predicts which requests need the strong model", "Needs labelled data and its own evaluation"],
          ["Fallback on failure", "On timeout, 429 or 5xx, try the next provider", "Prompts must work on both models"],
        ] },
        { type: "p", text: "Example with numbers: if 70 percent of traffic can be served by a model that costs a tenth as much, the blended cost is 0.7 x 0.1 + 0.3 x 1 = 0.37 of the all-large-model price, a 63 percent saving, as long as quality on the routed slice holds in your evaluation set." },
        { type: "code", language: "yaml", title: "Routing policy (illustrative)", code: `routes:
  - match: { task: classify }
    model: small-fast
    fallback: [small-backup]
  - match: { task: draft }
    model: large-smart
    fallback: [large-backup, small-fast]
    timeout_ms: 30000
limits:
  per_team_tokens_per_minute: 200000
  per_user_requests_per_minute: 20` },
        { type: "h2", text: "What else the gateway centralises" },
        { type: "list", items: [
          "**Keys and auth.** Provider keys live only in the gateway. Teams get internal keys that you can scope, rotate and revoke.",
          "**Rate limits and quotas.** Limit by tokens, not just requests, per team and per user. Provider limits are shared, so one runaway job can starve everyone.",
          "**Retries and fallbacks.** Exponential backoff with jitter on 429 and 5xx, a circuit breaker per provider, failover to a second provider.",
          "**Caching.** Exact-match cache and optionally semantic cache for repeated prompts.",
          "**Observability and cost.** Log model, token counts, latency and cost per request, tagged by team and feature.",
          "**Guardrails.** One place to redact personal data from prompts and run moderation.",
        ] },
        { type: "h2", text: "Trade-offs" },
        { type: "p", text: "The gateway is on the critical path of every AI feature, so it must be stateless, horizontally scaled and cheap per request, and it adds a network hop (single-digit milliseconds, small next to a multi-second generation). It is also a single point of failure, so run several instances across zones. Streaming matters: the gateway must proxy tokens as they arrive instead of buffering the whole response, or it destroys time to first token." },
        { type: "callout", tone: "gotcha", title: "The lowest common denominator trap", text: "Exposing one API tempts you to hide provider features such as tool calling formats, prompt caching or structured output. Decide which features the gateway normalises and which it passes through, or teams will bypass it." },
        { type: "p", text: "Build versus buy: open-source proxies such as LiteLLM and hosted gateways such as Cloudflare AI Gateway cover routing, caching and logging, and are a sound start. Build your own only when you need custom policy, data residency or deep integration with internal auth. A frequent interview mistake is to design routing without saying how you would measure that the cheaper model is good enough." },
      ],
      references: [
        { title: "LiteLLM documentation", url: "https://docs.litellm.ai/docs/" },
        { title: "Cloudflare AI Gateway documentation", url: "https://developers.cloudflare.com/ai-gateway/" },
        { title: "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance", url: "https://arxiv.org/abs/2305.05176" },
        { title: "RouteLLM: Learning to Route LLMs with Preference Data", url: "https://arxiv.org/abs/2406.18665" },
      ],
    },
  },
};
