import type { LessonEntry } from "@/types/roadmap";

export const DISTRIBUTED_LOCKING: LessonEntry = {
  track: "system-design",
  section: "Distributed systems theory",
  subsection: {
    title: "Distributed locking",
    slug: "distributed-locking",
    lesson: {
      summary: "A lease-based lock keeps workers from colliding, but only a fencing token makes the protected resource actually safe.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Distributed locks and leases" },
        { type: "p", text: "A distributed lock lets one process among many act on a shared thing at a time: run the nightly job, update a file, be the one sending reminders. A lock held in memory on one machine does nothing for other machines, so the lock state lives in a shared store such as Redis, ZooKeeper, etcd or a database row." },
        { type: "p", text: "A plain lock has a fatal flaw: if the holder crashes, nobody ever releases it. So distributed locks are **leases**: the lock expires after a time to live (TTL), for example 30 seconds. The holder renews it while working. If it dies, the lease runs out and someone else can take over." },
        { type: "code", language: "text", title: "Simple lock in Redis", code: `acquire:  SET lock:report-job <owner-id> NX PX 30000
          # NX = only if absent, PX = expire in 30 s
release:  run a script: if GET lock:report-job == <owner-id> then DEL
          # never delete a lock someone else now owns` },
        { type: "p", text: "Always store a unique owner id and check it on release. Otherwise a slow process can delete the lock that a newer holder just acquired after the first lease expired." },
        { type: "h2", text: "Why a lock is not enough: fencing tokens" },
        { type: "p", text: "Leases rest on time, and time is unreliable. Imagine client 1 gets the lease, then freezes for 40 seconds in a garbage-collection pause or a slow disk call. The lease expires, client 2 gets it and writes to storage. Client 1 wakes up, still believes it holds the lock, and writes stale data over client 2's work. No amount of checking \"do I still hold it?\" immediately before writing fully closes that gap, because the pause can happen right after the check." },
        { type: "p", text: "The fix is a **fencing token**: the lock service returns a number that grows with every grant (33, then 34). The client sends it with every write, and the storage layer remembers the highest token it has seen and rejects anything lower." },
        { type: "code", language: "text", title: "Fencing in action", code: `client 1 gets lock  -> token 33, then pauses
client 2 gets lock  -> token 34, writes to storage (max seen = 34)
client 1 resumes    -> writes with token 33
storage             -> 33 < 34, rejected` },
        { type: "p", text: "This needs the resource to participate: a database column with a version check (`UPDATE ... WHERE version = 33`), or a storage API that accepts tokens. ZooKeeper's zxid or the revision number from etcd work as monotonic tokens. A random-value Redis lock has no such counter, which is the heart of the well-known argument against using it for correctness." },
        {
          type: "table",
          head: ["Purpose", "Is a lease enough?", "What to add"],
          rows: [
            ["Efficiency: avoid running a job twice to save work", "Yes, a rare double run is harmless", "Nothing; a single Redis node is fine"],
            ["Correctness: two writers would corrupt data", "No", "Fencing tokens, or a consensus store, or a database constraint"],
          ],
        },
        { type: "h2", text: "Choosing an approach" },
        { type: "list", items: [
          "**Database row or advisory lock**: simplest when you already have one database. `SELECT ... FOR UPDATE` or a unique-key insert is often all you need.",
          "**Redis SET NX PX**: fast, fine for efficiency locks, weak guarantees under failover and pauses.",
          "**ZooKeeper / etcd**: consensus-backed, give ordered tokens and watch for release, higher latency, run as a small cluster.",
          "**Avoid the lock entirely**: partition work so one consumer owns each key (queue partitions), or use optimistic concurrency with a version column.",
        ] },
        { type: "callout", tone: "gotcha", title: "Set the TTL against real pauses", text: "A TTL shorter than your worst GC pause or slow network call means the lease expires while work continues. A TTL of several minutes means a crashed holder blocks everyone that long. Renew in a background thread, keep the protected section short, and still use fencing for anything that matters." },
        { type: "p", text: "Interview mistake: saying \"use Redis to lock it\" for a payments or inventory update and stopping there. State whether the lock is for efficiency or correctness, then name the fencing token or the database constraint that backs it up." },
      ],
      references: [
        { title: "How to do distributed locking - Martin Kleppmann", url: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" },
        { title: "Distributed Locks with Redis - Redis documentation", url: "https://redis.io/docs/latest/develop/use/patterns/distributed-locks/" },      ],
    },
  },
};
