import type { LessonEntry } from "@/types/roadmap";

export const GOSSIP_AND_HEARTBEATS: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Gossip and heartbeats",
    slug: "gossip-and-heartbeats",
    lesson: {
      summary: "Heartbeats tell you a node is alive; gossip spreads that knowledge through a cluster without a central coordinator.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The problem: who is alive?" },
        { type: "p", text: "In a cluster of hundreds of nodes you need every node to know the current membership and which peers are down, so requests are routed correctly. A central registry is a single point of failure and a bottleneck. Decentralised approaches use two pieces: **failure detection** (is this node alive?) and **dissemination** (tell everyone what we learned)." },
        { type: "h2", text: "Heartbeats and failure detection" },
        { type: "p", text: "The simplest detector: every node sends a heartbeat to a monitor every second; if none arrives for, say, 10 intervals, the node is declared dead. This is easy but has two problems. All traffic flows to one monitor, and a timeout is a guess: a slow network, a long garbage-collection pause or an overloaded machine looks exactly like a crash." },
        { type: "p", text: "Better detectors keep a history of heartbeat arrival times and compute a suspicion level instead of a yes/no. The phi accrual detector (used in Cassandra and Akka) outputs a number that rises the longer a heartbeat is overdue, relative to how irregular that peer normally is. The application picks a threshold, so a flaky link needs more silence before it is declared dead than a steady one." },
        { type: "h2", text: "Gossip: epidemic spread" },
        { type: "p", text: "Every round (say every second) each node picks a few random peers and exchanges what it knows: membership list, per-node heartbeat counters, or application state. News spreads like a rumor. Because each informed node infects several others per round, the number of informed nodes roughly doubles each round, so information reaches all N nodes in about **log N** rounds." },
        {
          type: "code",
          language: "text",
          title: "One gossip round on node A",
          code: `every 1 s:
  peers = random_pick(members, 3)
  for p in peers:
    send(p, my_state)            # {node: (heartbeat_counter, status)}
    their = recv(p)
    my_state = merge(my_state, their)   # keep the higher counter per node
if my_state[n].counter has not grown for T seconds: mark n suspect`,
        },
        { type: "p", text: "With 1,000 nodes, 3 peers per round and a 1 s interval, a new fact reaches nearly everyone within roughly 7 to 10 seconds, while each node sends only a few small messages per second. Load per node stays constant as the cluster grows." },
        { type: "h2", text: "SWIM: detection plus gossip" },
        { type: "p", text: "SWIM-style protocols (used by memberlist in Consul and Serf) separate the two jobs. A node pings one random peer each round. If there is no reply, it asks a few other nodes to ping that peer indirectly, which filters out a bad link between just two machines. Only if both fail is the peer marked suspect, then dead after a grace period, and that membership change is gossiped piggybacked on the normal ping traffic." },
        {
          type: "table",
          head: ["Approach", "Pros", "Cons"],
          rows: [
            ["Central heartbeat monitor", "Simple, fast detection", "Single point of failure, monitor load grows with N"],
            ["All-to-all heartbeats", "Quick, no coordinator", "N-squared messages, only fine for small clusters"],
            ["Gossip / SWIM", "Constant load per node, scales, no coordinator", "Eventually consistent view, spread takes seconds"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "A failure detector is never certain", text: "You cannot tell a dead node from a slow one. A node marked dead may still be running and writing. Use gossip to guide routing and repair, but protect correctness-critical actions with leases and fencing, or with a consensus store. Expect false positives during GC pauses and network blips, and add a suspect state before declaring death." },
        { type: "p", text: "Where it shows up: Cassandra and Riak use gossip for membership and ring state; Consul and Serf use SWIM; DynamoDB-style systems use it to learn the ring. Interview mistake: proposing gossip when you need a strongly consistent answer, such as who holds a lock. Gossip is for eventually consistent cluster state, consensus is for decisions." },
      ],
      references: [
        { title: "SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol", url: "https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf" },
        { title: "Gossip protocol - Wikipedia", url: "https://en.wikipedia.org/wiki/Gossip_protocol" },
        { title: "Gossip protocol - Consul documentation", url: "https://developer.hashicorp.com/consul/docs/concept/gossip" },
        { title: "Dynamo - Apache Cassandra documentation", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html" },
      ],
    },
    points: [
      { id: "sd.gossip-and-heartbeats.heartbeat-limits", title: "Heartbeats are guesses", detail: "A missed heartbeat cannot distinguish a crashed node from a slow or partitioned one. Detectors use a timeout or a suspicion score, and trade detection speed against false positives.", question: "Why can a long GC pause make a healthy node look dead, and how does a suspect state help?" },
      { id: "sd.gossip-and-heartbeats.epidemic-spread", title: "Gossip spreads in log N rounds", detail: "Each round every node shares state with a few random peers, so information doubles its reach per round and covers N nodes in about log N rounds. Load per node stays flat as the cluster grows.", question: "Roughly how many rounds does it take a fact to reach 1,000 nodes, and what is the cost per node?" },
      { id: "sd.gossip-and-heartbeats.swim-indirect-probe", title: "SWIM and indirect probes", detail: "SWIM pings a random peer, and if it fails asks other nodes to probe it indirectly before marking it suspect. Membership changes ride on the same messages, which keeps traffic low and reduces false alarms.", question: "What does the indirect ping protect against that a direct ping alone cannot?" },
    ],
  },
};
