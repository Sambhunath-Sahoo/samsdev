import type { LessonEntry } from "@/types/roadmap";

export const DESIGN_RAG_SUPPORT_ASSISTANT: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Design a RAG customer-support or knowledge-base assistant",
    slug: "design-rag-support-assistant",
    lesson: {
      summary: "A support assistant answers from company documents with citations, respects permissions, escalates when unsure and is judged on resolution rate and groundedness.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements first" },
        { type: "p", text: "Ask: who are the users (customers or agents), how many documents and how often they change, what languages, what latency, and what a wrong answer costs. Example numbers: 200,000 help-centre and wiki pages, about 2 million chunks, 50 requests per second at peak, first words visible in under 2 seconds, and answers that cite a source or hand off to a human." },
        { type: "h2", text: "Architecture" },
        { type: "code", language: "text", code: `Ingestion:  connectors (help centre, wiki, tickets) -> parse -> chunk -> embed -> vector + keyword index
                (queue + idempotent workers, re-index on change, delete on removal)

Query:      client -> API -> auth -> input guard -> query rewrite (use chat history)
            -> hybrid search (filter by tenant and access group) -> re-rank top 30 -> top 5
            -> prompt -> LLM (streamed) -> output guard -> answer + citations
            -> trace, feedback buttons, escalate-to-human option` },
        { type: "p", text: "Rewriting the question matters in chat: \"and what about shipping?\" is useless to a search index until it becomes \"refund policy for shipping costs\" using the conversation. Hybrid search covers both meaning and exact terms such as error codes. Filters on tenant and access group are applied inside the search query so restricted chunks never reach the prompt." },
        { type: "h2", text: "Key trade-offs" },
        { type: "table", head: ["Decision", "Option A", "Option B"], rows: [
          ["Freshness", "Event-driven re-index on document change (minutes)", "Nightly batch (cheap, stale)"],
          ["Model", "One strong model for all", "Small model for FAQ-like, strong for hard (routing)"],
          ["Caching", "Semantic cache for common questions", "No cache, simplest and safest"],
          ["Low confidence", "Answer with caveat", "Refuse and escalate"],
        ] },
        { type: "p", text: "Cost sketch: each answer sends about 3,000 input tokens (5 chunks plus instructions) and produces 300 output tokens. At 50 requests per second that is 150,000 input tokens per second, so the gateway, caching and routing are not optional details." },
        { type: "h2", text: "Quality and safety" },
        { type: "p", text: "Define an evaluation set from real past tickets with the correct article for each. Track retrieval hit rate, faithfulness, resolution without escalation, and thumbs-down rate, sliced by topic. Treat user-edited documents as untrusted: an indirect prompt injection in a wiki page must not be able to trigger tools. Redact personal data from logs and prompts, and show sources so users can verify." },
        { type: "callout", tone: "tip", title: "Escalation is a feature", text: "A good support bot knows its limit. When retrieval scores are low or the user repeats themselves, hand the whole conversation and the retrieved sources to a human agent. That is usually worth more than a few extra points of answer accuracy." },
        { type: "p", text: "Common interview mistakes: forgetting the ingestion and deletion path, ignoring permissions, never defining how quality is measured, and skipping what happens when the model is wrong." },
      ],
      references: [
        { title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al.)", url: "https://arxiv.org/abs/2005.11401" },
        { title: "Anthropic: Introducing Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval" },
        { title: "Ragas: Automated Evaluation of Retrieval Augmented Generation", url: "https://arxiv.org/abs/2309.15217" },
        { title: "OWASP Top 10 for Large Language Model Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" },
      ],
    },
    points: [
      {
        id: "sd.design-rag-support-assistant.ingestion-and-freshness",
        title: "Ingestion pipeline and freshness",
        detail: "Connectors feed a queue, workers parse, chunk and embed, and upserts are keyed by chunk id so replays are safe. Document updates and deletions must update or remove their vectors, or the bot answers from stale or removed policy.",
        question: "A refund policy page changes at noon. How soon does the assistant use the new text, and how do you guarantee the old chunks are gone?",
      },
      {
        id: "sd.design-rag-support-assistant.permissions-in-retrieval",
        title: "Permissions enforced at retrieval",
        detail: "Store tenant and access-group metadata with each chunk and filter in the search query, so a user never gets text they cannot read in the prompt. A prompt instruction is not an access control.",
        question: "How do you stop one customer's private tickets from appearing in another customer's answer?",
      },
      {
        id: "sd.design-rag-support-assistant.escalation-and-feedback",
        title: "Escalation and feedback loop",
        detail: "Use low retrieval scores, a verifier check or repeated user questions to hand off to a human with the conversation and sources attached. Thumbs-down and agent corrections feed new cases into the evaluation set.",
        question: "Which signals tell the system to stop answering and hand over to a person?",
      },
      {
        id: "sd.design-rag-support-assistant.quality-metrics",
        title: "Measuring answer quality",
        detail: "Measure retrieval hit rate and faithfulness on a labelled set from real tickets, plus online resolution rate and thumbs-down rate by topic. Gate releases on no regression against the set.",
        question: "What would you measure to prove a new embedding model is better, before rolling it out?",
      },
    ],
  },
};
