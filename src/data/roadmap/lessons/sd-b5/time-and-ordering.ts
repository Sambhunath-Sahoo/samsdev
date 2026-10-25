import type { LessonEntry } from "@/types/roadmap";

export const TIME_AND_ORDERING: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Time and ordering",
    slug: "time-and-ordering",
    lesson: {
      summary: "Wall clocks disagree and jump, so distributed systems order events with logical clocks and version vectors instead.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why wall clocks cannot order events" },
        { type: "p", text: "Every machine has its own clock, kept roughly right by NTP. Typical drift is milliseconds, but it can be tens of milliseconds or more after a bad sync, and a clock can jump **backwards** when corrected. Leap seconds, virtual machines being paused and manual changes add more trouble. So if node A stamps a write at 10:00:00.005 and node B stamps another at 10:00:00.003, you cannot say B's write really came first." },
        { type: "p", text: "The danger shows up with last-write-wins conflict resolution: keep the value with the highest timestamp. If B's clock runs 50 ms slow, a later write from B loses to an earlier one from A, and the user's update vanishes without any error. Wall-clock time is fine for logs, expiry and human display; it is not safe as the arbiter of which of two concurrent writes wins." },
        { type: "p", text: "Google Spanner shows the expensive alternative: GPS and atomic clocks provide a bounded uncertainty interval (TrueTime), and a transaction waits out that interval, a few milliseconds, before committing, so timestamps are trustworthy. Most systems cannot do that and use logical ordering." },
        { type: "h2", text: "Happened-before and Lamport clocks" },
        { type: "p", text: "Lamport's insight: what matters is **causality**. Event A happened before B if they are on the same node in that order, or A is a message send and B is its receive, or through a chain of those. Events with no such chain are **concurrent**. A Lamport clock is a counter per node: increment on every event, attach it to messages, and on receive set your counter to max(local, received) + 1." },
        { type: "code", language: "text", title: "Lamport clock", code: `A: event            counter 1
A -> B: send(1)     B receives, counter = max(0, 1) + 1 = 2
B: event            counter 3
C: event            counter 1   # concurrent with all of the above
# if X happened-before Y then L(X) < L(Y), but L(X) < L(Y) does NOT imply X before Y` },
        { type: "p", text: "A Lamport timestamp gives a total order consistent with causality (break ties with node id) but cannot tell you whether two events were concurrent. For that you need vector clocks." },
        { type: "h2", text: "Vector clocks" },
        { type: "p", text: "A vector clock keeps one counter per node. A node increments its own entry on a local event and sends the whole vector with messages; the receiver takes the entry-wise maximum and then increments its own. Comparing two vectors gives three outcomes: one is **before** the other (all entries less or equal, at least one less), **after**, or **concurrent** (each is ahead in some entry)." },
        {
          type: "table",
          head: ["Compare", "Meaning", "Action"],
          rows: [
            ["[2,1,0] vs [3,1,0]", "First is before second", "Keep the second, drop the first"],
            ["[2,1,0] vs [2,2,0]", "First is before second", "Keep the second"],
            ["[2,1,0] vs [1,2,0]", "Concurrent", "Conflict: keep both as siblings, merge or ask the user"],
          ],
        },
        { type: "p", text: "Dynamo, as described in its 2007 paper, used vector clocks to detect conflicting versions of a shopping cart and returned both siblings so the client could merge them (for a cart, take the union). Riak followed with version vectors. The cost is that the vector grows with the number of writers, so systems prune old entries or use dotted version vectors; and the app must handle siblings." },
        { type: "list", items: [
          "**Need a unique, sortable id**: use a Snowflake-style or time-ordered id, accepting bounded clock skew.",
          "**Need one authoritative order**: route writes through a single leader or a consensus log.",
          "**Need to detect concurrent updates**: version vectors, or a version column with compare-and-set.",
        ] },
        { type: "callout", tone: "gotcha", title: "Timestamps for conflict resolution lose data silently", text: "Last-write-wins on wall clocks is the default in several stores and it is often fine for idempotent overwrites such as a last-seen time. For a cart, a profile or a balance it quietly drops one side of a race. Say so in an interview and name the alternative: a CRDT, a vector clock with merge, or a single writer." },
      ],
      references: [
        { title: "Time, Clocks, and the Ordering of Events in a Distributed System - Leslie Lamport", url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf" },
        { title: "Vector clock - Wikipedia", url: "https://en.wikipedia.org/wiki/Vector_clock" },
        { title: "Amazon's Dynamo - Werner Vogels", url: "https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html" },
        { title: "Spanner, TrueTime and the CAP Theorem - Google Research", url: "https://research.google/pubs/spanner-truetime-and-the-cap-theorem/" },
      ],
    },
  },
};
