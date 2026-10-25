import type { LessonEntry } from "@/types/roadmap";

export const UNIQUE_ID_GENERATION: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Unique ID generation",
    slug: "unique-id-generation",
    lesson: {
      summary: "Generate ids across many machines without a central bottleneck, and know when ids should be sortable by time.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What you need from an id" },
        { type: "p", text: "A single database hands out ids with an auto-increment column: simple, small, ordered. Once you shard, or want to create ids before the insert (in clients, in services, in queues), a single counter becomes either a bottleneck or impossible. The requirements to state out loud in an interview: **unique** across all machines, **roughly time-sortable** (so an index on the id is also an index on recency), **compact** (8 bytes beats 16 in every index), **no coordination** on the hot path, and whether ids may be **guessable**." },
        { type: "h2", text: "The main options" },
        { type: "table", head: ["Option", "Size", "Sortable", "Coordination", "Notes"], rows: [
          ["DB auto-increment", "8 B", "Yes", "Central DB", "Simple; leaks counts; breaks across shards"],
          ["Ticket server / range allocation", "8 B", "Mostly", "Occasional", "Each app node reserves a block of ids, say 10,000"],
          ["UUID v4", "16 B", "No", "None", "Random; scatters inserts across a B-tree index"],
          ["UUID v7 / ULID", "16 B", "Yes (by time)", "None", "Millisecond timestamp plus randomness"],
          ["Snowflake-style", "8 B", "Yes (by time)", "Worker id assignment", "Compact; needs a sane clock"],
        ] },
        { type: "h2", text: "Snowflake-style ids" },
        { type: "p", text: "Twitter's Snowflake popularized packing an id into 64 bits: a timestamp in the high bits, a worker identifier in the middle, and a per-millisecond sequence number at the bottom. A typical split is 41 bits of milliseconds since a custom epoch (about 69 years), 10 bits of worker id (1,024 workers), and 12 bits of sequence (4,096 ids per millisecond per worker, which is about 4 million per second per worker)." },
        { type: "code", language: "ts", title: "Snowflake-style generator (single worker)", code: `const EPOCH = 1735689600000n;      // 2025-01-01, your own choice
const WORKER_BITS = 10n, SEQ_BITS = 12n;

class IdGen {
  private last = -1n;
  private seq = 0n;
  constructor(private readonly worker: bigint) {}

  next(): bigint {
    let now = BigInt(Date.now());
    if (now < this.last) throw new Error("clock moved backwards");
    if (now === this.last) {
      this.seq = (this.seq + 1n) & ((1n << SEQ_BITS) - 1n);
      if (this.seq === 0n) {           // sequence exhausted this ms
        while (now <= this.last) now = BigInt(Date.now());
      }
    } else {
      this.seq = 0n;
    }
    this.last = now;
    return ((now - EPOCH) << (WORKER_BITS + SEQ_BITS))
         | (this.worker << SEQ_BITS)
         | this.seq;
  }
}` },
        { type: "p", text: "Because the timestamp is in the top bits, ids sort by creation time to within a millisecond across all workers, and inserts land near the right edge of the index, which is friendly to B-trees. Two details to handle: every worker needs a **unique worker id** (from a config store, a lease in ZooKeeper or etcd, or a Kubernetes StatefulSet index), and **clock skew** is dangerous. If NTP steps the clock backwards, the generator can repeat ids, so it should refuse or wait until time catches up." },
        { type: "h2", text: "UUIDs, and when they are fine" },
        { type: "p", text: "UUIDs need no coordination and are fine for most systems. Random v4 values do hurt index locality on large tables, because each insert lands at a random page. The time-ordered UUID v7, standardized in RFC 9562, and ULID fix that and still need no worker registry. The price is 16 bytes in every index and foreign key." },
        { type: "callout", tone: "gotcha", title: "Time-sortable ids leak information", text: "An id that encodes time and a worker reveals when a record was created and roughly how many are made per second. Do not use sortable or sequential ids as secrets, such as password reset tokens or unguessable URLs. Use a random token of 128 bits or more for that, and keep the sortable id internal." },
        { type: "p", text: "A worked sizing check: 100,000 new rows per second across the system with 50 app servers means 2,000 ids per second per server, far below the 4 million per second per worker Snowflake allows, so one worker id per server is plenty. Auto-increment with a ticket server also works at this scale if each server reserves blocks, but a crashed server wastes its unused block, which is fine because ids need to be unique, not gap-free." },
        { type: "p", text: "Common mistakes: promising gap-free or strictly ordered ids across machines (that requires coordination), forgetting clock problems, and using the id as the sort key when ties within one millisecond matter. Say what ordering you really need, then choose." },
      ],
      references: [
        { title: "RFC 9562: Universally Unique IDentifiers (UUIDs)", url: "https://www.rfc-editor.org/rfc/rfc9562" },
        { title: "Snowflake ID", url: "https://en.wikipedia.org/wiki/Snowflake_ID" },
      ],
    },
    points: [
      {
        id: "sd.unique-id-generation.requirements",
        title: "Say what the id must guarantee",
        detail: "Decide on uniqueness, time ordering, size, coordination cost and guessability before choosing a scheme. Auto-increment is fine on one database but fails once writes are spread across shards or ids are created outside the database.",
        question: "Why does a single auto-increment column stop working after sharding?",
      },
      {
        id: "sd.unique-id-generation.snowflake-layout",
        title: "Snowflake-style 64-bit ids",
        detail: "Pack a millisecond timestamp, a worker id and a per-millisecond sequence into 64 bits. Ids are compact, unique without talking to other machines, and sort by time, but each worker needs a unique id and a reliable clock.",
        question: "With 12 sequence bits, how many ids can one worker generate in a millisecond, and what happens if it needs more?",
      },
      {
        id: "sd.unique-id-generation.uuid-tradeoffs",
        title: "UUID v4 versus UUID v7 and ULID",
        detail: "Random UUID v4 values need no coordination but scatter inserts across a B-tree index. Time-ordered UUID v7 and ULID keep the no-coordination property and insert near the end of the index, at 16 bytes each.",
        question: "Why do random UUID primary keys slow down inserts on a very large table?",
      },
      {
        id: "sd.unique-id-generation.clock-and-secrecy",
        title: "Clock skew and information leakage",
        detail: "A clock that moves backwards can produce duplicate time-based ids, so generators should refuse or wait. Sortable ids also reveal creation time and volume, so never use them as secrets.",
        question: "What should a Snowflake generator do when the system clock jumps backwards?",
      },
    ],
  },
};
