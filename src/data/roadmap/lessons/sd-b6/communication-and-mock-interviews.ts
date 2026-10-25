import type { LessonEntry } from "@/types/roadmap";

export const COMMUNICATION_AND_MOCK_INTERVIEWS: LessonEntry = {
  track: "system-design",
  section: "Interview craft and low-level design",
  subsection: {
    title: "Communication and mock interviews",
    slug: "communication-and-mock-interviews",
    lesson: {
      summary: "Think aloud, check in with the interviewer, write decisions down, and practise with mock interviews until the structure is automatic.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What is being assessed" },
        { type: "p", text: "A system design interview tests how you reason and collaborate more than whether you reach a particular architecture. Interviewers usually look at four things: how you structure an open-ended problem, how deep your technical knowledge goes, how you weigh trade-offs, and how well you work with them. Two candidates can draw the same diagram and get opposite results because one explained the reasons and the other recited components." },
        { type: "h2", text: "Communicating during the interview" },
        {
          type: "list",
          items: [
            "**Think aloud.** Say what you are considering and why you reject options. Silence for two minutes tells the interviewer nothing.",
            "**Say the plan first.** \"I will clarify requirements, estimate load, sketch the design, then deep dive where you like.\" It shows structure and lets them redirect you.",
            "**Check in at transitions.** Ask \"does this scope match what you had in mind?\" or \"which part should I go deeper on?\" Interviewers often have a specific area in mind.",
            "**Write decisions down.** Put requirements, numbers and key choices in a corner of the board, so you can refer to them and avoid contradicting yourself later.",
            "**Draw as you speak.** Keep boxes labelled, arrows directional, and data flow numbered for one use case, such as 1 to 5 for the write path.",
          ],
        },
        { type: "h2", text: "Handling hints, pushback and mistakes" },
        { type: "p", text: "A question like \"what if the cache goes down?\" is usually a hint to a gap, not a trap. Answer it directly, adjust the design if needed, and move on. If you disagree, state your reasoning and the cost of the alternative. If you realise you made an error, say so and fix it; noticing your own mistake counts in your favour." },
        { type: "p", text: "State your assumptions. \"I am assuming eventual consistency is fine for the feed, so tell me if not\" avoids building the wrong thing and shows you know the choice exists. When you do not know something, say how you would find out or what you would expect to be true." },
        { type: "h2", text: "A mock interview routine" },
        { type: "p", text: "Reading designs is not the same as producing one live. Practise the delivery:" },
        {
          type: "list",
          ordered: true,
          items: [
            "Pick one classic problem (URL shortener, news feed, chat, rate limiter) and set a 45-minute timer.",
            "Use a whiteboard or drawing tool, with a partner or a recording if you have no partner. Explain out loud even when alone.",
            "Follow the six steps in order and keep rough time: about 10 minutes before you start drawing.",
            "Afterwards, review: where did you go silent, skip requirements, name a tool without a reason, or fail to give numbers?",
            "Repeat with a different problem weekly, and revisit the same one after a month to see what improved.",
          ],
        },
        { type: "table", head: ["Weak habit", "Better habit"], rows: [
          ["Starts drawing immediately", "Spends the first minutes on requirements and scale"],
          ["\"We will use Redis and Kafka\"", "\"A cache here because reads are 100:1, and a queue to absorb write bursts\""],
          ["Waits to be asked about failures", "Walks through failure modes after the design"],
          ["Defends the first design at all costs", "Treats feedback as new input and adapts"],
        ] },
        { type: "callout", tone: "tip", title: "Practise with someone who has done the interviews", text: "Peers, colleagues and engineers who interview regularly spot the gaps you cannot see. Ask for specific feedback on structure, depth and communication, not just whether the design was good. Recording yourself is uncomfortable and effective." },
        { type: "p", text: "Outside interviews the same skills apply: design reviews and architecture decision records need the same clear statement of options, trade-offs and the reason for the choice made." },
      ],
      references: [
        { title: "Architecture Decision Record (Martin Fowler)", url: "https://martinfowler.com/bliki/ArchitectureDecisionRecord.html" },
        { title: "Non-Abstract Large System Design (Google SRE Workbook)", url: "https://sre.google/workbook/non-abstract-design/" },
      ],
    },
    points: [
      { id: "sd.communication-and-mock-interviews.think-aloud", title: "Think aloud and check in", detail: "Say your plan, explain why you reject options, and ask at each transition whether the scope fits. Interviewers often steer you toward the area they want to explore.", question: "What three questions do you ask the interviewer at the end of the requirements step?" },
      { id: "sd.communication-and-mock-interviews.state-assumptions", title: "State assumptions and write them down", detail: "Put requirements, numbers and key choices on the board and call out assumptions such as eventual consistency. This prevents contradictions and shows you know the choice exists.", question: "Which assumptions would you state in a chat design and which would you confirm?" },
      { id: "sd.communication-and-mock-interviews.handle-hints", title: "Treat hints as input", detail: "A probing question usually points at a real gap, so answer it directly and adjust the design. Admitting your own mistake and fixing it reflects well.", question: "The interviewer asks what happens if your queue fills up. How do you respond without getting defensive?" },
      { id: "sd.communication-and-mock-interviews.mock-routine", title: "A weekly mock routine", detail: "Run timed 45-minute sessions on a classic problem, speaking aloud, then review where you went silent, skipped requirements or gave no numbers. Repeat with new problems and return to old ones later.", question: "What do you review after each mock, and what would you change next time?" },
    ],
  },
};
