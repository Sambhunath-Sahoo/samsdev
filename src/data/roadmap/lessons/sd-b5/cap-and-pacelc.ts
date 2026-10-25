import type { LessonEntry } from "@/types/roadmap";

export const CAP_AND_PACELC: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "CAP and PACELC",
    slug: "cap-and-pacelc",
    lesson: {
      summary: "CAP says what a replicated store must give up while the network is split; PACELC adds the cost you pay even when it is not.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "CAP, stated precisely" },
        { type: "p", text: "CAP is a statement about one situation: a **network partition**, where some nodes cannot talk to others. Consistency here means linearizability (every read sees the latest completed write, as if there were one copy). Availability means every request to a working node gets a non-error answer. The theorem says that during a partition you cannot have both." },
        { type: "p", text: "The popular slogan \"pick two of three\" is misleading. You do not get to pick partition tolerance: partitions happen whether you plan for them or not. A system that is not partition tolerant is just a single machine. The real choice is what happens **when** a partition occurs: refuse some requests (consistency), or answer from possibly stale data (availability)." },
        { type: "h2", text: "CP and AP in real systems" },
        { type: "p", text: "Take two replicas, A and B, and a client writing `balance = 50` to A while the link A-B is cut. A CP system makes B reject reads and writes (or makes the minority side stop) until the link heals, so nobody sees a stale balance. An AP system lets B keep answering with the old balance and merges the two histories afterwards." },
        {
          type: "table",
          head: ["Style", "During a partition", "Typical examples", "Good fit"],
          rows: [
            ["CP", "Minority side errors or blocks", "etcd, ZooKeeper, Spanner, a Postgres primary with synchronous replicas", "Locks, leader election, money, inventory counts"],
            ["AP", "Both sides keep answering, may diverge", "Dynamo-style stores such as Cassandra and Riak at low consistency levels, DNS", "Shopping carts, feeds, counters that can reconcile"],
          ],
        },
        { type: "p", text: "Be careful with labels. Many databases are tunable: Cassandra with `QUORUM` reads and writes behaves close to CP for a key, with `ONE` it leans AP. Kleppmann's criticism is that most real systems are neither purely CP nor AP, and that \"available\" in the theorem is much stricter than what operators mean by uptime." },
        { type: "h2", text: "PACELC: the trade-off when nothing is broken" },
        { type: "p", text: "Partitions are rare. Latency is always there. PACELC reads: if there is a **P**artition, choose **A** or **C**; **E**lse, choose **L**atency or **C**onsistency. Even on a healthy network, keeping replicas in agreement means waiting for acknowledgements from other nodes, and cross-region round trips cost tens to hundreds of milliseconds." },
        { type: "list", items: [
          "**PA/EL**: answer fast from any replica, accept staleness always (Dynamo-style stores at low consistency).",
          "**PC/EC**: always pay for coordination (Spanner, single-leader systems that read from the leader).",
          "**PC/EL**: strict during partitions, fast otherwise; some systems read from local replicas for speed but fail closed in a split.",
        ] },
        { type: "p", text: "Concrete numbers: a write acknowledged by a replica in the same region may take 2 ms. Waiting for a quorum across three regions at 70 ms apart takes roughly 70 ms. That 35x gap is the E-branch of PACELC and it hits every request, not just rare outages." },
        { type: "callout", tone: "gotcha", title: "Do not classify a whole product", text: "Saying \"MongoDB is CP\" or \"Cassandra is AP\" in an interview invites a follow-up you cannot win. Say what the configuration is: replication factor, read and write consistency, and whether reads go to the leader. Then state what a client sees during a split." },
        { type: "h2", text: "How to use this in a design" },
        { type: "list", ordered: true, items: [
          "Decide per operation, not per system: a payment write needs consistency, a profile photo does not.",
          "Ask what a stale read costs in money or trust, and what a rejected request costs in lost sales.",
          "Name the latency budget so you know whether cross-region coordination is affordable.",
          "State the failure behaviour out loud: \"if the region is cut off, checkout fails closed, browsing keeps working from cache\".",
        ] },
        { type: "p", text: "Common interview mistakes: claiming consistency in CAP means ACID consistency, treating partitions as optional, and forgetting that CAP says nothing about normal operation, which is where PACELC applies." },
      ],
      references: [
        { title: "CAP theorem - Wikipedia", url: "https://en.wikipedia.org/wiki/CAP_theorem" },
        { title: "PACELC theorem - Wikipedia", url: "https://en.wikipedia.org/wiki/PACELC_theorem" },
        { title: "Please stop calling databases CP or AP - Martin Kleppmann", url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html" },
        { title: "CAP Twelve Years Later: How the Rules Have Changed - InfoQ", url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/" },
      ],
    },
  },
};
