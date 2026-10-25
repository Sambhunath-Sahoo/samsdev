import type { LessonEntry } from "@/types/roadmap";

export const EVALUATION_COST_AND_LATENCY: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Evaluation, cost and latency",
    slug: "evaluation-cost-and-latency",
    lesson: {
      summary: "Quality, cost and latency pull against each other, so measure all three, use caching and streaming to move the trade-off, and evaluate RAG answers on a fixed set that you rerun over time.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The cost, latency and quality triangle" },
        { type: "p", text: "Better answers usually need a bigger model, more retrieved context, more reasoning steps or a verification pass. Each of those costs tokens and seconds. You rarely get all three, so state the target first: \"p95 under 6 s, under 2 cents per answer, at least 90 percent of answers rated grounded\". Then change one lever at a time and measure." },
        { type: "table", head: ["Lever", "Quality", "Cost", "Latency"], rows: [
          ["Larger model", "Up", "Up a lot", "Up"],
          ["More retrieved chunks", "Up, then flat or down", "Up (input tokens)", "Up slightly"],
          ["Re-ranker", "Up", "Small", "Up 50 to 300 ms"],
          ["Smaller model plus routing", "Same if tested", "Down", "Down"],
          ["Caching", "Same", "Down", "Down on hits"],
        ] },
        { type: "h2", text: "Semantic caching" },
        { type: "p", text: "An exact cache keyed on the prompt text rarely hits because users phrase things differently. A semantic cache embeds the incoming question and returns a stored answer if a past question is within a similarity threshold. Hits cost one embedding lookup (milliseconds) instead of seconds of generation." },
        { type: "p", text: "The risk is a wrong hit. \"How do I cancel my order?\" and \"How do I cancel my subscription?\" are close in vector space but need different answers. Set the threshold conservatively, scope the cache by tenant, language and document version, put a time to live on entries, and never cache personalised or permission-dependent answers. Provider-side prompt caching is a separate, simpler win: a long shared prefix such as a system prompt is billed at a reduced rate on later calls." },
        { type: "h2", text: "Time to first token and streaming" },
        { type: "p", text: "Users judge speed by when text starts appearing, not when it ends. Time to first token (TTFT) covers network, queueing, retrieval and prompt processing; after that, tokens arrive at a steady rate. Streaming over Server-Sent Events makes a 10 s generation feel like a 1 s wait. To lower TTFT, shorten the prompt, run retrieval and any moderation in parallel, and avoid buffering in proxies." },
        { type: "h2", text: "Mitigating hallucination" },
        { type: "p", text: "Models produce plausible text whether or not it is true. You cannot remove that, only reduce and catch it. Ground answers in retrieved sources, instruct the model to say \"I do not know\", require citations and check that each cited chunk exists, lower the temperature for factual tasks, validate structured output, and route low-confidence answers to a person. Long contexts hurt too: models can overlook facts placed in the middle of a long prompt, so send fewer, better chunks." },
        { type: "h2", text: "Evaluating RAG: faithfulness and relevancy" },
        { type: "p", text: "Evaluate retrieval and generation separately so you know which half is broken." },
        { type: "list", items: [
          "**Context recall or hit rate:** did the retrieved chunks contain the facts needed? Measure it against questions labelled with the right source.",
          "**Context precision:** how many retrieved chunks were actually useful?",
          "**Faithfulness (groundedness):** is every claim in the answer supported by the retrieved context?",
          "**Answer relevancy:** does the answer address the question that was asked?",
        ] },
        { type: "p", text: "Tools such as Ragas implement these metrics with a judge model. Treat the scores as relative signals for comparing versions, not absolute truth, and calibrate the judge against a few hundred human labels." },
        { type: "code", language: "json", title: "One evaluation case", code: `{
  "id": "refund-007",
  "question": "Can I return an opened item after 30 days?",
  "mustRetrieve": ["policy/refunds#windows"],
  "facts": ["30-day window", "opened items need original packaging"],
  "tags": ["refunds", "edge-case"]
}` },
        { type: "h2", text: "Evaluation over time" },
        { type: "p", text: "Run the fixed set on every prompt, model or index change, and block releases that regress. Then keep growing the set: every real failure found in production or in user feedback becomes a new test case. Also score a sample of live traffic daily, since documents, users and provider models all drift." },
        { type: "callout", tone: "gotcha", title: "Do not tune on your test set", text: "If you keep editing the prompt until the evaluation set passes, the set stops measuring anything. Keep a held-out slice that you only look at before a release." },
      ],
      references: [
        { title: "Ragas: Automated Evaluation of Retrieval Augmented Generation", url: "https://arxiv.org/abs/2309.15217" },
        { title: "Lost in the Middle: How Language Models Use Long Contexts", url: "https://arxiv.org/abs/2307.03172" },
        { title: "A Survey on Hallucination in Large Language Models", url: "https://arxiv.org/abs/2311.05232" },
        { title: "Anthropic: Reduce hallucinations", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" },
        { title: "Anthropic: Reducing latency", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-latency" },
      ],
    },
  },
};
