import type { LessonEntry } from "@/types/roadmap";

export const MACHINE_CODING_APPROACH: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Machine coding approach",
    slug: "machine-coding-approach",
    lesson: {
      summary: "A repeatable flow for low-level design rounds: clarify, model, code the core, test it, then talk about extensions.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What the round tests" },
        { type: "p", text: "A machine-coding or low-level design round gives you 45 to 90 minutes and a problem like a parking lot. The grader is not looking for a pattern showcase. They want a working, readable core, sensible class boundaries, and clear thinking about what happens when requirements grow." },
        { type: "h2", text: "The low-level design interview flow" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Clarify (5 minutes)**: ask what is in and out of scope. Single or multiple lots? Payment included? Concurrency? Write the agreed list down.",
            "**Nouns and verbs**: nouns become classes (`Vehicle`, `Slot`, `Ticket`), verbs become methods (`park`, `unpark`). Mark which noun owns which rule.",
            "**Sketch the model (5 minutes)**: classes, their relationships, and the one or two interfaces where behaviour will vary.",
            "**Code the happy path first**: get one end-to-end flow running before any edge case. A running core beats a perfect design that does not compile.",
            "**Edge cases and errors**: lot full, invalid ticket, double unpark. Use clear exceptions.",
            "**Demo with a driver**: a small `main` that exercises the flow and prints results.",
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "A driver proves the core works",
          code: `const lot = new ParkingLot([new Slot("S1", "car"), new Slot("S2", "bike")]);

const ticket = lot.park({ plate: "KA01AB1234", kind: "car" });
console.log("parked in " + ticket.slotId);

const fee = lot.unpark(ticket.id, new Date());
console.log("fee: " + fee + " cents");`,
        },
        { type: "p", text: "Keep names plain and methods short. Use the repository idea for storage: an interface with an in-memory implementation, so persistence is a later swap and not a rewrite." },
        { type: "h2", text: "Discuss extensions without being asked" },
        { type: "p", text: "Strong candidates finish early on purpose and spend the time on \"what if\". Choose extensions your design already makes cheap, and show the one-line change." },
        {
          type: "table",
          head: ["Extension", "How the design absorbs it"],
          rows: [
            ["New pricing rule", "new `FeeStrategy` class, no edits to `Ticket`"],
            ["New vehicle or slot type", "new subtype or enum value plus a factory entry"],
            ["Notify on events", "add an observer, publisher unchanged"],
            ["Many threads or users", "lock per slot, or atomic compare-and-set on slot state"],
            ["Persistence", "swap the in-memory repository for a database one"],
          ],
        },
        { type: "p", text: "Say the trade-off too: \"A lock per slot allows parallel parking. A single lock is simpler but serialises every request. I used per-slot because the lot is read-heavy.\"" },
        { type: "callout", tone: "gotcha", title: "Over-engineering up front", text: "The most common failure is ten interfaces and three patterns before any code runs, then time out. Start concrete, extract an interface when a second variant is real. Interviewers read over-design as poor judgement, not skill." },
        { type: "p", text: "Also avoid silent assumptions. If you assume one lot, say it. If you skip payment, say it. Stated limits read as control; hidden ones read as gaps." },
      ],
      references: [
        { title: "Software design pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Software_design_pattern" },
        { title: "TellDontAsk (Martin Fowler)", url: "https://martinfowler.com/bliki/TellDontAsk.html" },
        { title: "AnemicDomainModel (Martin Fowler)", url: "https://martinfowler.com/bliki/AnemicDomainModel.html" },
      ],
    },
  },
};
