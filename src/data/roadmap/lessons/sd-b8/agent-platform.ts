import type { LessonEntry } from "@/types/roadmap";

export const AGENT_PLATFORM: LessonEntry = {
  track: "system-design",
  section: "AI system design",
  subsection: {
    title: "Agent platform",
    slug: "agent-platform",
    lesson: {
      summary: "An agent is a loop in which a model chooses tools until a task is done, and the platform around it needs step limits, validated tool calls, state and a clear rule for when not to use one.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What an agent is" },
        { type: "p", text: "A normal LLM feature is one call: prompt in, text out. An agent runs a loop. The model looks at the goal and what has happened so far, picks an action (usually a tool call), your code runs it, the result goes back into the context, and the model decides the next step or finishes. The control flow is decided by the model at run time, not by your code." },
        { type: "h2", text: "ReAct: reasoning interleaved with tool calls" },
        { type: "p", text: "ReAct, from a 2022 paper, is the pattern behind most agent loops: the model writes a short thought, takes an action, reads the observation, and repeats. Interleaving matters because each observation can correct the plan, for example a search that returns nothing leads to a reworded search instead of an invented answer." },
        { type: "code", language: "ts", title: "The loop with its safety limits", code: `const MAX_STEPS = 8;
const messages = [{ role: "user", content: goal }];

for (let step = 0; step < MAX_STEPS; step++) {
  const reply = await llm.chat({ messages, tools });
  messages.push(reply.message);

  if (reply.toolCalls.length === 0) return reply.message.content; // done

  for (const call of reply.toolCalls) {
    const result = await runTool(call, { timeoutMs: 10_000 }); // validated, sandboxed
    messages.push({ role: "tool", toolCallId: call.id, content: result });
  }
}
throw new Error("Agent exceeded step budget");` },
        { type: "h2", text: "Tool calling and function calling" },
        { type: "p", text: "You describe each tool to the model with a name, a description and a JSON Schema for its arguments. The model does not execute anything. It returns a structured request such as `search_orders({ email: \"a@b.com\" })`, and your code validates the arguments, checks that this user may do this, runs it and returns the result. Everything the model proposes is untrusted input." },
        { type: "list", items: [
          "Give tools narrow, well-described purposes; ten clear tools beat one `do_anything` tool.",
          "Validate arguments against the schema and against permissions before running.",
          "Make write tools idempotent or require confirmation, because the model may call them twice.",
          "Return short, relevant results. A 50,000-token tool output burns cost and buries the signal.",
          "Run tools with timeouts and, if they execute code, in a sandbox.",
        ] },
        { type: "h2", text: "Platform concerns" },
        { type: "p", text: "A platform that hosts many agents needs: a step and token budget per run, per-tool permissions, persisted run state (so a long task survives a restart and can be resumed), a full trace of every thought, call and result, and a kill switch. Long runs belong on a job queue with status polling, not in an HTTP request. Errors compound: if each step is 95 percent reliable, ten steps succeed only about 60 percent of the time (0.95 to the 10th), so fewer steps is a quality feature." },
        { type: "h2", text: "When not to use an agent" },
        { type: "p", text: "Agents trade predictability, cost and latency for flexibility. If you can write the steps down, write them down." },
        { type: "table", head: ["Situation", "Better choice"], rows: [
          ["Fixed sequence of steps", "A workflow: your code calls the model at set points"],
          ["One lookup then an answer", "RAG with a single retrieval"],
          ["Needs exact, auditable behaviour", "Normal code, with the model only for parsing text"],
          ["Open-ended, unknown number of steps (research, debugging)", "An agent, with budgets and a human check"],
        ] },
        { type: "callout", tone: "cost", title: "Every step re-sends the context", text: "Each loop iteration pays for the whole conversation again as input tokens. Eight steps over a growing 20,000-token context can cost far more than one well-built prompt, and takes eight times the latency of one call." },
        { type: "p", text: "A common interview mistake is to reach for an agent for every problem. Start with the simplest design that works and add autonomy only where a fixed flow cannot cope." },
      ],
      references: [
        { title: "ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al.)", url: "https://arxiv.org/abs/2210.03629" },
        { title: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
        { title: "Anthropic: Tool use with Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview" },
        { title: "Anthropic: Writing effective tools for agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
      ],
    },
  },
};
