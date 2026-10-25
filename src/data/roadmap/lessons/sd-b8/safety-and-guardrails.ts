import type { LessonEntry } from "@/types/roadmap";

export const SAFETY_AND_GUARDRAILS: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Safety and guardrails",
    slug: "safety-and-guardrails",
    lesson: {
      summary: "Check what goes into and comes out of the model, keep authority in code instead of prompts, and trace every step so incidents can be replayed.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why guardrails" },
        { type: "p", text: "An LLM follows instructions found anywhere in its context, including text a user typed or a web page it retrieved. It also writes fluent output with no guarantee about content. Guardrails are checks around the model that limit what it can be asked and what it can do or say. They reduce risk; they do not make a model safe by themselves." },
        { type: "h2", text: "Input and output moderation" },
        { type: "p", text: "Run checks on both sides of the model call:" },
        { type: "table", head: ["Side", "Check", "Example"], rows: [
          ["Input", "Policy classifier", "Block hate, self-harm or abuse requests"],
          ["Input", "Prompt injection detection", "Flag \"ignore previous instructions\" in user text and in retrieved documents"],
          ["Input", "PII redaction", "Mask card and national id numbers before they reach a provider"],
          ["Output", "Policy classifier", "Stop unsafe or off-brand text before display"],
          ["Output", "Schema and grounding checks", "JSON must validate; cited sources must exist"],
          ["Output", "Secret and PII scan", "Never return keys or another user's data"],
        ] },
        { type: "p", text: "Classifiers can be hosted moderation APIs, open models such as Llama Guard, or your own small model. Input checks run in parallel with retrieval so they add little latency. Output checks interact with streaming: either buffer a sentence at a time and check it, or stream and be ready to cut the stream and replace it with a refusal." },
        { type: "code", language: "ts", title: "Check in parallel with the work", code: `const [verdict, context] = await Promise.all([
  moderate(userMessage),            // policy and injection classifier
  retrieve(userMessage, user),      // filtered by this user's permissions
]);

if (verdict.blocked) return refusal(verdict.category);

const stream = llm.stream(buildPrompt(userMessage, context));
return outputGuard(stream);         // checks per sentence, can abort` },
        { type: "h2", text: "Where the real control lives" },
        { type: "list", items: [
          "**Least privilege for tools.** The model should hold no more power than the signed-in user. Enforce permissions in the tool code, not in the prompt.",
          "**Treat retrieved text as untrusted.** A document can contain instructions aimed at your agent (indirect prompt injection). Never let that text decide which tools run.",
          "**Confirmation for side effects.** Money, deletes and outbound email need a human click.",
          "**Rate limits and budgets** per user, so abuse stays cheap.",
        ] },
        { type: "callout", tone: "gotcha", title: "A system prompt is not a security boundary", text: "\"Never reveal the admin data\" in a prompt can be talked around. If the data should not leak, it must never be in the context. Filter at retrieval and at the tool, where the rule is code." },
        { type: "h2", text: "Traceability of the AI pipeline" },
        { type: "p", text: "When a user reports a bad answer, you need to see exactly what happened: the prompt template version, the retrieved chunk ids and scores, the model and parameters, the tool calls and their results, the guardrail verdicts, token counts, latency and cost, and the final output. Record one trace per request with a span for each stage, and link it to user feedback." },
        { type: "p", text: "OpenTelemetry has generative AI semantic conventions for attributes such as the model name and token usage, so traces fit into your normal tooling. Version everything that can change behaviour: prompts, index build, model id, guardrail rules. Traces contain user text, so apply the same retention, access control and redaction as any sensitive log." },
        { type: "p", text: "Interview mistake: listing a moderation API and stopping. A complete answer covers injection, permissions in tools, human confirmation, and an audit trail you can replay." },
      ],
      references: [
        { title: "OWASP Top 10 for Large Language Model Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" },
        { title: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations", url: "https://arxiv.org/abs/2312.06674" },
        { title: "OpenTelemetry: Semantic conventions for generative AI", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" },
        { title: "OpenAI: Moderation guide", url: "https://platform.openai.com/docs/guides/moderation" },
        { title: "Anthropic: Mitigate jailbreaks and prompt injections", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks" },
      ],
    },
  },
};
