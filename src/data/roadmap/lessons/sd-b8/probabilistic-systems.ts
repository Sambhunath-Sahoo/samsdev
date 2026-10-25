import type { LessonEntry } from "@/types/roadmap";

export const PROBABILISTIC_SYSTEMS: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Probabilistic systems",
    slug: "probabilistic-systems",
    lesson: {
      summary: "An LLM feature has no exact right answer, so you test with scored evaluation sets, plan for low-confidence fallbacks and monitor quality as well as uptime.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Deterministic vs probabilistic system design" },
        { type: "p", text: "A payment service is deterministic: the same request gives the same response, and a wrong response is a bug you can reproduce. An LLM feature is probabilistic. The model samples each token from a distribution, so the same prompt can give different answers, and \"correct\" is a judgement (is it relevant, is it grounded in the source, is the tone right) rather than a string equality." },
        { type: "p", text: "Lowering `temperature` to 0 makes output more repeatable, but not guaranteed. Batching, hardware and model version updates can still change the text. Treat repeatability as a tuning knob, not a contract." },
        { type: "h2", text: "What changes in your design" },
        { type: "table", head: ["Concern", "Deterministic service", "Probabilistic service"], rows: [
          ["Testing", "Exact assertions per input", "Evaluation set with scores and a pass threshold"],
          ["Failure", "Exception, retry", "Wrong but fluent answer, so detect low confidence"],
          ["Monitoring", "Latency, errors, saturation", "All of that plus quality drift and user feedback"],
          ["Release", "Ship when tests are green", "Ship when scores do not regress, then canary"],
          ["Debugging", "Reproduce from the request", "Replay from a stored trace of prompt, context and output"],
        ] },
        { type: "h2", text: "Testing with an evaluation set" },
        { type: "p", text: "You cannot write `expect(answer).toBe(\"...\")` because many different strings are correct, and the exact one you assert will break on the next model upgrade. Instead build a set of 50 to 200 real questions, each with the facts a good answer must contain or the source it must cite. Run the system, score every answer, and compare the average with the last release." },
        { type: "p", text: "Scoring can be code (does the output parse as JSON, does it cite a known document id), a human label, or a second model acting as a judge with a written rubric. Judge models are cheap but biased, so spot-check them against humans." },
        { type: "code", language: "ts", title: "A regression gate in CI", code: `const results = await Promise.all(
  evalSet.map(async (c) => {
    const answer = await assistant.ask(c.question);
    return {
      id: c.id,
      cited: answer.sources.some((s) => c.mustCite.includes(s.docId)),
      judgeScore: await judge(c.question, answer.text, c.rubric), // 1 to 5
    };
  }),
);

const avg = mean(results.map((r) => r.judgeScore));
const citeRate = results.filter((r) => r.cited).length / results.length;

if (avg < baseline.avg - 0.1 || citeRate < 0.9) {
  throw new Error("Quality regression: block the release");
}` },
        { type: "h2", text: "Designing for being wrong" },
        { type: "list", items: [
          "**Confidence gates.** Use retrieval scores, a verifier model or schema validation to decide when to answer, when to say \"I do not know\" and when to hand off to a person.",
          "**Cheap fallbacks.** If a call times out or fails validation, retry once, then fall back to a simpler path such as keyword search results.",
          "**Constrain the output.** Ask for structured output and validate it. A response that fails the schema is a retry, not a user-visible bug.",
          "**Keep a human path.** For high-stakes actions (refunds, emails, deletes) require confirmation instead of trusting the model.",
        ] },
        { type: "h2", text: "Monitoring quality over time" },
        { type: "p", text: "A service can be green on every dashboard and still be getting worse: the model provider changes behaviour, your documents go stale, users start asking new kinds of questions. Sample live traffic into the same scoring pipeline, track thumbs up and down, and alert when the rolling score drops, the same way you alert on error rate." },
        { type: "callout", tone: "gotcha", title: "Do not average away the failures", text: "A mean score of 4.2 can hide a category of questions that always fails. Slice results by topic, language and document source, and track the worst slice as well as the average." },
        { type: "p", text: "Interview mistake to avoid: saying \"we will just unit test it\". The strong answer names an evaluation set, a scoring method, a regression gate before release, and online monitoring after it." },
      ],
      references: [
        { title: "Anthropic: Define success criteria and build evaluations", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests" },
        { title: "Language Models are Few-Shot Learners (Brown et al.)", url: "https://arxiv.org/abs/2005.14165" },
        { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      ],
    },
  },
};
