import type { LessonEntry } from "@/types/roadmap";

export const COLLABORATIVE_EDITING: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Collaborative editing",
    slug: "collaborative-editing",
    lesson: {
      summary: "Let many people type into one document at once and make every copy end up identical, using operational transformation or CRDTs.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: several users edit the same document, see each other's changes within a fraction of a second, see cursors, and can keep typing through a short disconnect. Non-functional: **convergence** (all replicas end up with identical text), **intention preservation** (my insert lands where I meant it), low latency for local typing, and durable history." },
        { type: "p", text: "Rough numbers: 10 million documents, 1 million open at peak, an average of 3 editors each. A fast typist produces about 5 operations a second, so 3 million editors give roughly 15 million operations a second across the fleet if everyone types at once. In practice most people read more than they type, so plan for one tenth of that. The important number is per document: under 50 editors, a few hundred operations a second, which one process can order easily." },
        { type: "h2", text: "API and data model" },
        { type: "p", text: "Edits travel over a WebSocket, one connection per client per document. HTTP is only used to load the snapshot and list history." },
        {
          type: "code",
          language: "json",
          title: "WebSocket messages",
          code: `// client -> server
{ "type": "op", "docId": "d1", "baseRev": 41, "ops": [{ "ins": "hi", "at": 12 }] }
// server -> all clients, after ordering
{ "type": "op", "docId": "d1", "rev": 42, "author": "u7", "ops": [{ "ins": "hi", "at": 12 }] }
// presence (not persisted)
{ "type": "cursor", "docId": "d1", "user": "u7", "pos": 14 }`,
        },
        { type: "p", text: "Store an append-only **operation log** per document (`doc_id, rev, author, ops, ts`) plus a periodic **snapshot** (`doc_id, rev, content`). Loading a document means reading the latest snapshot and replaying later operations. Snapshot every few hundred revisions so replay stays short." },
        { type: "h2", text: "Architecture: two ways to converge" },
        { type: "p", text: "The problem: Alice and Bob both start from `cat`. Alice inserts `s` at position 3, Bob deletes position 0. Applied naively in different orders, their copies diverge. There are two families of solution." },
        { type: "p", text: "**Operational transformation (OT).** Operations are position-based. A central server gives every operation a revision number. When an operation arrives that was based on an older revision, the server **transforms** it against the operations it missed, shifting positions so the intent survives, then applies and broadcasts it. In the example, Bob's delete at 0 moves Alice's insert from 3 to 2, so both copies end as `ats`. The transform rules are the hard part: every pair of operation types needs a correct rule, and subtle bugs produce silent divergence. Google Docs follows this central-server style." },
        { type: "p", text: "**CRDTs.** Instead of positions, every character gets a unique, ordered identifier, for example `(site id, counter)` plus a link to the character it was inserted after. Operations then commute: applying them in any order gives the same text, so no central orderer is needed. Deletes leave a **tombstone** so a late insert still has an anchor. Libraries such as Yjs and Automerge implement this, and it suits offline editing and peer-to-peer sync." },
        {
          type: "table",
          head: ["", "OT", "CRDT"],
          rows: [
            ["Central server", "Required to order operations", "Optional"],
            ["Offline editing", "Awkward, long transform chains", "Natural, merge on reconnect"],
            ["Metadata", "Small", "Grows with every character and tombstone"],
            ["Correctness", "Hard to prove, many edge cases", "Convergence is built into the data type"],
            ["Cleanup", "Trim old log", "Needs garbage collection of tombstones"],
          ],
        },
        { type: "p", text: "Server layout: clients connect through a load balancer with **sticky routing by document id**, so every editor of one document reaches the same session server. That process owns the in-memory document, orders operations, appends to the log, and broadcasts. Presence goes through the same socket but is never stored. If the process dies, another loads the snapshot, replays the log, and clients resend operations after their last acknowledged revision." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Hot document**: a 500-person live doc concentrates load on one process. Cap active editors, move the extra viewers to a read-only fan-out, and batch operations every 50 ms.",
            "**Log growth**: compact by snapshotting and dropping operations older than the retention window, keeping named versions for history.",
            "**Cursor storms**: throttle presence to a few updates a second and drop stale ones.",
            "**Undo**: undo must reverse only your own operations, transformed over the others, not roll back the document.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Last write wins is not collaboration", text: "Saving whole-document snapshots on every keystroke and keeping the latest silently throws away someone's work. If an interviewer asks what happens when two people type at once and you say \"the last save wins\", you have described the problem, not a design." },
        { type: "p", text: "Common interview mistakes: skipping the central ordering step in OT, forgetting that CRDT metadata grows, and treating presence like document data. A good close is to name your pick and why: a server-centred product with rich text and strict permissions leans OT or a server-ordered CRDT; an offline-first or local-first product leans CRDT." },
      ],
      references: [
        { title: "Operational transformation (Wikipedia)", url: "https://en.wikipedia.org/wiki/Operational_transformation" },
        { title: "Conflict-free replicated data type (Wikipedia)", url: "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type" },
        { title: "Yjs documentation", url: "https://docs.yjs.dev/" },
        { title: "CRDT resources (crdt.tech)", url: "https://crdt.tech/" },
      ],
    },
  },
};
