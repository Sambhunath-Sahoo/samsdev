import type { LessonEntry } from "@/types/roadmap";

export const CONSISTENT_HASHING: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Consistent hashing",
    slug: "consistent-hashing",
    lesson: {
      summary: "Place nodes and keys on a ring so that adding or removing a node moves only a small share of the keys, then smooth the load with virtual nodes.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The problem with modulo" },
        { type: "p", text: "The obvious way to pick a node for a key is `hash(key) % N`. It is fast and spreads keys evenly, until N changes. Going from 4 nodes to 5, a key stays where it was only if `h mod 4` equals `h mod 5`, which is true for about 20 percent of keys. The other 80 percent move. For a cache, that means most lookups suddenly miss and the database behind it takes the full load. For a sharded store, it means moving most of the data." },
        { type: "h2", text: "Consistent hashing and the hash ring" },
        { type: "p", text: "Consistent hashing fixes this by making the node count not part of the formula. Imagine the output range of a hash function bent into a circle. Hash each node's name onto the circle. To place a key, hash it onto the same circle and walk **clockwise** until you hit a node; that node owns the key." },
        { type: "list", items: [
          "**Add a node**: it lands at one point on the ring and takes over only the keys between its predecessor and itself. Every other key stays put. On average that is about K/N of K keys.",
          "**Remove a node**: only its keys move, to the next node clockwise.",
          "**Lookup**: keep node positions sorted and binary search for the first position at or above the key's hash, wrapping to the start. That is O(log N).",
        ] },
        { type: "code", language: "ts", title: "A minimal ring", code: `class Ring {
  private points: { pos: number; node: string }[] = [];

  add(node: string, vnodes = 128) {
    for (let i = 0; i < vnodes; i++) {
      this.points.push({ pos: hash32(node + "#" + i), node });
    }
    this.points.sort((a, b) => a.pos - b.pos);
  }

  nodeFor(key: string): string {
    const h = hash32(key);
    // first point with pos >= h, wrapping to index 0
    let lo = 0, hi = this.points.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.points[mid].pos < h) lo = mid + 1; else hi = mid;
    }
    return this.points[lo % this.points.length].node;
  }
}` },
        { type: "h2", text: "Virtual nodes and node failure" },
        { type: "p", text: "With one point per node, the arcs between points are random sizes, so one node may own 40 percent of the ring and another 8 percent. When a node dies, its entire load lands on a single neighbour, which can then fall over too. The fix is **virtual nodes**: each physical node is hashed to many points (100 to 256 is typical). Arcs average out, so load is close to even, and when a node leaves its keys scatter across many survivors instead of one." },
        { type: "p", text: "Virtual nodes also handle unequal machines: give a server with twice the capacity twice as many points. The cost is memory for a larger ring and more bookkeeping when nodes change." },
        { type: "table", head: ["", "hash % N", "Consistent hashing"], rows: [
          ["Keys moved when N changes", "About (N-1)/N", "About 1/N"],
          ["Load balance", "Even", "Even with enough virtual nodes"],
          ["Lookup", "O(1)", "O(log N) over sorted points"],
          ["Complexity", "None", "Ring state to share and update"],
        ] },
        { type: "p", text: "Where it shows up: Dynamo and Cassandra place data on a ring; memcached client libraries use it to pick a cache server; some load balancers use it so a given client or key keeps landing on the same backend, which keeps caches warm. Replication fits naturally too: store each key on the next R distinct nodes clockwise." },
        { type: "callout", tone: "gotcha", title: "It does not fix a hot key", text: "Consistent hashing balances the number of keys, not the traffic per key. A single viral key still hits one node, and the next replica can inherit it when that node fails. Handle hot keys with replication of that key, local caching or key splitting." },
        { type: "p", text: "Common interview mistakes: saying it makes data movement zero (it makes it small), forgetting virtual nodes, and not saying how every client learns the ring. Nodes learn membership through a coordinator, a gossip protocol or a config store; stale views cause temporary misrouting, which is acceptable for caches and needs care for stores of record." },
      ],
      references: [
        { title: "Consistent hashing", url: "https://en.wikipedia.org/wiki/Consistent_hashing" },
        { title: "Amazon's Dynamo (Werner Vogels)", url: "https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html" },
      ],
    },
  },
};
