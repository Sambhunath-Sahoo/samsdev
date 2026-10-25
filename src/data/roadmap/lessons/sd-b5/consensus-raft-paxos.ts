import type { LessonEntry } from "@/types/roadmap";

export const CONSENSUS_RAFT_PAXOS: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Consensus and leader election: Raft, Paxos",
    slug: "consensus-raft-paxos",
    lesson: {
      summary: "Consensus lets a group of machines agree on one value or one ordered log even when some of them crash.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What problem consensus solves" },
        { type: "p", text: "Several nodes must agree on something: who the leader is, what the next entry in a log is, whether a config change happened. They can crash, restart and lose messages, and any node can be slow without being dead. Consensus protocols guarantee **safety** (nodes never decide different values) always, and **liveness** (they eventually decide) only when the network is reasonably healthy. The FLP result says no deterministic protocol can guarantee both in a fully asynchronous network, which is why real protocols use timeouts." },
        { type: "p", text: "Where you meet it: etcd and Consul (Raft), ZooKeeper (a Paxos-like protocol called Zab), Kafka's KRaft controllers (Raft), Google's Chubby and Spanner (Paxos). You rarely implement it. You rely on one of these stores for locks, leader election and metadata." },
        { type: "h2", text: "Raft in five ideas" },
        { type: "list", ordered: true, items: [
          "**Roles**: each node is a follower, candidate or leader. Time is split into numbered **terms**.",
          "**Election**: a follower that hears no heartbeat for a randomized timeout (say 150-300 ms) becomes a candidate, bumps the term and asks for votes. A majority wins. Randomized timeouts make split votes rare.",
          "**Log replication**: only the leader accepts writes. It appends to its log and sends the entry to followers.",
          "**Commit**: once a majority has stored the entry it is committed and applied, and the client gets its answer.",
          "**Safety rule**: a candidate can only win if its log is at least as up to date as the voters', so a committed entry is never lost by a new leader.",
        ] },
        { type: "p", text: "Majority is the key number. A cluster of 3 survives 1 failure, 5 survives 2, 7 survives 3. A cluster needs **2f + 1** nodes to survive **f** failures. Odd sizes are used because 4 nodes still only tolerate 1 failure, same as 3, while adding cost and another vote to wait for." },
        { type: "code", language: "text", title: "A write in a 5-node Raft cluster", code: `client -> leader L (term 7): SET x=1
L appends entry #42, sends AppendEntries to 4 followers
F1 ok, F2 ok            (3 of 5 stored it: L + F1 + F2)
L marks #42 committed, applies it, replies OK
F3 and F4 are slow or down: they catch up later` },
        { type: "h2", text: "Paxos and how it differs" },
        { type: "p", text: "Paxos reaches the same kind of agreement with proposers, acceptors and learners, using numbered proposals and two phases (prepare/promise, then accept). Basic Paxos agrees on a single value; Multi-Paxos repeats it for a log and usually elects a stable leader to skip the first phase. Paxos is correct but famously hard to turn into a complete system. Raft was designed to be understandable, and it specifies leader election, log replication and membership changes together." },
        {
          type: "table",
          head: ["", "Raft", "Paxos"],
          rows: [
            ["Goal", "Replicated log with a strong leader", "Agreement on a value, extended to a log"],
            ["Leader", "Required, part of the protocol", "Optional optimization in Multi-Paxos"],
            ["Specification", "Complete, with membership change", "Core only, many variants"],
          ],
        },
        { type: "h2", text: "Costs and pitfalls" },
        { type: "p", text: "Every write costs at least one round trip to a majority, so a cross-region cluster pays that latency on each commit. Throughput is limited by the single leader. Run consensus clusters small (3 or 5 nodes) and keep them for coordination data, not bulk data." },
        { type: "callout", tone: "gotcha", title: "Split brain and stale leaders", text: "An old leader that has been partitioned away may still believe it is leader for a while. Raft prevents it from committing anything because it cannot reach a majority, but external systems that obeyed its earlier commands can be confused. That is why fencing tokens (next lessons) exist. Also: two nodes is not a cluster; with 2 nodes any single failure loses the majority." },
        { type: "p", text: "In an interview, say what you would use rather than what you would build: a Raft-backed store such as etcd or ZooKeeper for leader election, with a lease and a fencing token, and explain why you need a majority." },
      ],
      references: [
        { title: "In Search of an Understandable Consensus Algorithm (Raft paper)", url: "https://raft.github.io/raft.pdf" },
        { title: "The Raft Consensus Algorithm", url: "https://raft.github.io/" },
        { title: "Paxos Made Simple - Leslie Lamport", url: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf" },
        { title: "Raft (algorithm) - Wikipedia", url: "https://en.wikipedia.org/wiki/Raft_(algorithm)" },
      ],
    },
    points: [
      { id: "sd.consensus-raft-paxos.majority-quorum", title: "Majorities and cluster size", detail: "A cluster of 2f + 1 nodes survives f failures because any two majorities overlap in at least one node. Five nodes tolerate two failures; four tolerate only one, so odd sizes are used.", question: "How many nodes do you need to survive two failures, and why is a 4-node cluster no better than 3?" },
      { id: "sd.consensus-raft-paxos.raft-election-and-log", title: "Raft election and log replication", detail: "A follower that misses heartbeats becomes a candidate in a new term and needs a majority of votes. The leader commits an entry once a majority has stored it, and only up-to-date logs can win an election.", question: "What stops a newly elected Raft leader from losing an entry the old leader already committed?" },
      { id: "sd.consensus-raft-paxos.when-to-use", title: "Use consensus through a store, not by hand", detail: "Use etcd, ZooKeeper or Consul for locks, leader election and metadata. Keep clusters at 3 or 5 nodes and store only small coordination data, because every write pays a majority round trip.", question: "Why is a Raft cluster a bad place to store large user data, and what would you put there instead?" },
    ],
  },
};
