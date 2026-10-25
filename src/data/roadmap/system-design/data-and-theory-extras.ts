import type { RoadmapSubsection } from "@/types/roadmap";

export const NOSQL_FAMILIES: RoadmapSubsection = {
  title: "NoSQL families: key-value, document, wide-column, graph",
  points: [
    {
      id: "sd.storage.nosql-families",
      title: "Key-value, document, wide-column and graph stores",
      detail:
        "Key-value stores such as Redis and DynamoDB give very fast lookups by key and suit sessions, caches and simple records. Document stores such as MongoDB keep nested JSON-like documents and suit profiles and catalogs whose shape varies. Wide-column stores such as Cassandra are built for very high write volume and queries by partition key, which fits time series and feeds. Graph databases such as Neo4j make multi-hop relationship queries cheap, which fits recommendations, while relational databases such as Postgres stay the default for money and reporting.",
      question: "Match a session store, a product catalog, a sensor time series and a friends-of-friends query to a database family and say why.",
    },
  ],
};

export const CHOOSING_A_DATABASE: RoadmapSubsection = {
  title: "Choosing a database",
  points: [
    {
      id: "sd.storage.sql-vs-nosql-choice",
      title: "SQL or NoSQL: decide by access pattern",
      detail:
        "Choose SQL when you need multi-row ACID transactions, joins and a stable, well-understood schema, for example payments in Postgres. Choose a NoSQL store when the workload is dominated by huge write volume, simple key-based lookups or a flexible schema, for example event ingestion in Cassandra. The question is which access patterns and guarantees you need, not which family is better. Modern relational databases handle JSON and large scale well, so pick NoSQL for a measured need rather than by habit, and expect many systems to use both.",
      question: "State the SQL vs NoSQL trade-off for storing payments and for storing click events.",
    },
  ],
};

export const OLTP_VS_OLAP: RoadmapSubsection = {
  title: "OLTP vs OLAP",
  points: [
    {
      id: "sd.storage.oltp-vs-olap",
      title: "Transactional and analytical workloads",
      detail:
        "OLTP systems serve many small, concurrent transactions such as placing an order, and are tuned for fast point reads and writes with strong consistency, usually on row-oriented storage. OLAP systems run few, heavy queries that scan and aggregate many rows, and use column-oriented storage in engines such as ClickHouse, BigQuery or Redshift. Running reports on the production OLTP database slows customer traffic, so data is copied out through a replica, change data capture or an ETL pipeline into a separate analytics store.",
      question: "Why should the monthly revenue report not run against the production orders database, and where should it run instead?",
    },
  ],
};

export const CAP_AND_PACELC: RoadmapSubsection = {
  title: "CAP and PACELC",
  points: [
    {
      id: "sd.theory.cap-theorem",
      title: "CAP theorem, stated precisely",
      detail:
        "CAP says that when a network partition splits a distributed system, it cannot both give every read the latest write (consistency, meaning linearizability) and answer every request from every working node (availability). Partitions happen on real networks, so partition tolerance is not optional and the real choice is how to behave during one. The slogan 'pick two of three' is misleading: a 'CA' system only exists as a single node, which is why interviews phrase it as CP versus AP.",
      question: "During a partition, what does a CP system do with a write that arrives on the minority side, and what does an AP system do?",
    },
    {
      id: "sd.theory.cap-in-practice",
      title: "CP and AP in real systems",
      detail:
        "A CP system refuses or blocks some requests during a partition to stay consistent: ZooKeeper and etcd stop accepting writes without a quorum, and HBase favours consistency per row. An AP system keeps answering and reconciles later: Cassandra and Dynamo-style stores accept writes on both sides and repair the differences afterwards. Many products are tunable rather than fixed, for example DynamoDB reads are eventually consistent by default with a strongly consistent option, and Cassandra consistency is chosen per query.",
      question: "A bank balance and a likes counter: which side of CAP would you choose for each, and why?",
    },
    {
      id: "sd.theory.pacelc",
      title: "PACELC: the trade-off when nothing is broken",
      detail:
        "PACELC extends CAP: if there is a Partition, choose Availability or Consistency; Else, choose Latency or Consistency. The second half is the one you live with every day, because keeping replicas strongly consistent means waiting for them, which costs latency. It explains why a store can lean AP during a partition yet still let you pick faster, weaker reads in normal operation.",
      question: "Why does synchronous replication to another region improve consistency but hurt latency even when nothing has failed?",
    },
  ],
};

export const CONSISTENCY_MODELS: RoadmapSubsection = {
  title: "Consistency models",
  points: [
    {
      id: "sd.theory.strong-vs-eventual-choice",
      title: "Strong vs eventual consistency",
      detail:
        "Strong consistency means a read returns the latest committed write, so the system behaves like a single copy; it needs coordination and costs latency and availability. Eventual consistency means replicas converge if writes stop, but reads may be stale in between; it is cheaper and more available. Use strong consistency for money, inventory and anything where a stale read causes harm, and eventual consistency for feeds, counters and recommendations.",
      question: "Which parts of an e-commerce site need strong consistency and which can be eventual?",
    },
    {
      id: "sd.theory.session-and-causal-guarantees",
      title: "Between strong and eventual: read-your-writes, monotonic and causal",
      detail:
        "Consistency is a spectrum. Read-your-writes guarantees a user sees their own updates, monotonic reads guarantee they never see data move backward in time, and causal consistency guarantees an effect is never seen before its cause, such as a reply before the comment it answers. These are often enough for users and much cheaper than full strong consistency, so choose the weakest guarantee your product can live with.",
      question: "A reply appears before the comment it answers on one replica. Which guarantee was violated?",
    },
    {
      id: "sd.theory.quorum-reads-and-writes",
      title: "Quorum reads and writes",
      detail:
        "In a leaderless store with N replicas, a write waits for W acknowledgements and a read asks R replicas. When R + W > N, every read set overlaps the latest write set, so a read can see the latest acknowledged write, provided there are no sloppy quorums or concurrent conflicting writes. With N = 3, W = 2 and R = 2 survives one replica being down; lowering W or R buys speed and availability at the cost of staleness.",
      question: "With N = 5, what must R and W be for reads that see the latest write, and what do you trade by lowering W to 1?",
    },
  ],
};

export const CONSISTENT_HASHING: RoadmapSubsection = {
  title: "Consistent hashing",
  points: [
    {
      id: "sd.scaling.consistent-hash-ring",
      title: "Consistent hashing and the hash ring",
      detail:
        "Plain hash(key) % N remaps almost every key when N changes, which empties caches and forces massive data movement. Consistent hashing places nodes and keys on a ring and assigns each key to the next node clockwise, so adding or removing a node moves only about K/N of K keys, those next to it. It is used in caches, sharded stores and load balancers.",
      question: "How many keys move when a node joins under modulo hashing versus consistent hashing?",
    },
    {
      id: "sd.scaling.virtual-nodes",
      title: "Virtual nodes and node failure",
      detail:
        "With one point per node, shares of the ring are uneven and a failed node dumps all its load on a single neighbour. Giving each physical node many virtual nodes spreads its load around the ring, evens out shares and lets larger machines take more virtual nodes. When a node dies, its keys go to the successors of its virtual nodes, and replicas are usually placed on the next distinct physical nodes clockwise.",
      question: "Why does adding virtual nodes spread a failed node's load more evenly?",
    },
  ],
};

export const DISTRIBUTED_LOCKING: RoadmapSubsection = {
  title: "Distributed locking",
  points: [
    {
      id: "sd.theory.distributed-lock-basics",
      title: "Distributed locks and leases",
      detail:
        "A distributed lock lets only one process across many machines do something at a time, such as running a scheduled job. Because the holder can crash, the lock must expire, so it is really a lease with a TTL. ZooKeeper and etcd build locks on consensus and are the safer choice; a single Redis `SET key value NX PX ttl` is simple and fine for efficiency locks where an occasional double run is harmless.",
      question: "When is a Redis lock good enough, and when do you need ZooKeeper or etcd?",
    },
    {
      id: "sd.theory.fencing-tokens",
      title: "Why a lock is not enough: fencing tokens",
      detail:
        "A lock holder can pause, for example in garbage collection, past its lease expiry while another process takes the lock, then wake up and write as if it still owned it. A fencing token is a number that increases with every grant and travels with each write; the storage rejects any write whose token is lower than one it has already seen. Redlock, which uses several independent Redis nodes, is debated because it relies on timing assumptions and issues no fencing tokens, so use a consensus system or a database constraint when correctness matters.",
      question: "A paused lock holder wakes up after its lease expired. How does a fencing token stop its stale write?",
    },
  ],
};

export const TIME_AND_ORDERING: RoadmapSubsection = {
  title: "Time and ordering",
  points: [
    {
      id: "sd.theory.clocks-and-ordering",
      title: "Why wall clocks cannot order events",
      detail:
        "Machine clocks drift and are corrected by NTP, so timestamps from two servers cannot reliably say which event happened first. Logical clocks avoid physical time: a Lamport clock is a counter each node increments and sets to max(local, received) + 1 on every message. It gives an order consistent with causality but cannot tell concurrent events apart.",
      question: "Two servers stamp events 3 ms apart. Why is that not enough to say which happened first?",
    },
    {
      id: "sd.theory.vector-clocks",
      title: "Vector clocks",
      detail:
        "A vector clock keeps one counter per node, and comparing two vectors shows whether one event happened before the other or whether they were concurrent. Dynamo-style stores use them to detect conflicting concurrent writes to one key, which are then resolved by the application or a rule such as last-write-wins, which can silently drop data. The cost is that vectors grow with the number of writers.",
      question: "Two versions carry vectors [2,1] and [1,2]. What does that say about them?",
    },
  ],
};
