import type { LessonEntry } from "@/types/roadmap";

export const REPLICATION_AND_READ_REPLICAS: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Replication and read replicas",
    slug: "replication-and-read-replicas",
    lesson: {
      summary: "Copy a database to other machines so reads scale and a failure does not lose data, and learn what that costs you in write handling and consistency.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why replicate" },
        { type: "p", text: "Replication keeps copies of the same data on several machines. It buys you three things: **read scaling** (more machines answer queries), **availability** (if the primary dies, a copy takes over), and **durability** (a disk loss does not lose data). It does not scale writes, because every write still has to reach every copy. That is the job of sharding, covered later." },
        { type: "h2", text: "Leader-follower replication" },
        { type: "p", text: "The common design has one **leader** (primary) that accepts all writes and one or more **followers** (replicas, standbys) that copy it. The leader records each change in an ordered log: the write-ahead log in Postgres, the binary log in MySQL. Followers fetch that log and apply the changes in the same order, so they converge on the same state." },
        { type: "p", text: "The key choice is when the leader tells the client the write succeeded." },
        {
          type: "table",
          head: ["Mode", "Leader commits when", "If the leader dies", "Cost"],
          rows: [
            ["Asynchronous", "It has written locally", "Recent commits may be lost, because a follower never got them", "Fastest; writes never wait on followers"],
            ["Synchronous", "At least one follower confirms", "No acknowledged write is lost", "Latency of the slowest awaited follower; if it hangs, writes stall"],
            ["Semi-synchronous", "One follower confirms, others async", "Data safe on at least two machines", "A reasonable default for important data"],
          ],
        },
        { type: "p", text: "Most production setups use async or semi-sync, because waiting for every follower makes the system as unreliable as its worst node. Failover, promoting a follower when the leader fails, has its own traps: the promoted node may be missing the last few writes, and if the old leader comes back believing it is still the leader you get **split brain**, two nodes accepting writes. Use a tool that fences the old leader (Patroni, a managed service) rather than a script you wrote once." },
        { type: "h2", text: "Routing reads to replicas" },
        { type: "p", text: "Replicas only help if your application sends them traffic. There are two common ways. The app holds two connection pools, one for writes and one for reads, and chooses per query. Or a proxy such as PgBouncer-based tooling, ProxySQL or the cloud provider's reader endpoint splits statements automatically." },
        { type: "code", language: "ts", title: "Read/write split in application code", code: `const primary = new Pool({ host: "db-primary" });
const replicas = new Pool({ host: "db-reader" }); // load-balanced endpoint

async function getProduct(id: string) {
  return replicas.query("SELECT * FROM products WHERE id = $1", [id]);
}

async function placeOrder(order: Order) {
  // writes, and reads that must see the write, use the primary
  return primary.query("INSERT INTO orders (...) VALUES (...)", [/* ... */]);
}` },
        { type: "p", text: "A concrete example: a catalog site does 20,000 reads per second and 200 writes per second. One primary struggles at 20,000 reads; a primary plus four replicas serves about 4,000 reads each and the primary keeps its capacity for writes. The ratio is what makes this attractive. A write-heavy workload gains almost nothing, since each replica still replays every write." },
        { type: "p", text: "Replicas also serve jobs you do not want on the primary: reporting queries, exports, backups, and search indexing. Sending a 5-minute analytics query to a replica protects customer traffic." },
        { type: "callout", tone: "gotcha", title: "Replicas are not free consistency", text: "A replica answers from the past. If a user saves a profile and the next page load reads from a replica that has not caught up, the old value appears. Reads that must see the user's own write, or that gate money or permissions, should go to the primary. The next lesson covers this lag in detail." },
        { type: "h2", text: "Common interview mistakes" },
        { type: "list", items: [
          "Saying replicas scale writes. They scale reads and availability.",
          "Forgetting failover: who detects the failure, who promotes, how clients find the new leader.",
          "Treating async replicas as a backup. A mistaken `DELETE` replicates instantly; you still need point-in-time recovery.",
          "Not saying which reads tolerate staleness. Name them: catalog, feeds, search yes; balance, stock at checkout, auth no.",
        ] },
      ],
      references: [
        { title: "PostgreSQL: High Availability, Load Balancing, and Replication", url: "https://www.postgresql.org/docs/current/high-availability.html" },
        { title: "PostgreSQL: Log-Shipping Standby Servers", url: "https://www.postgresql.org/docs/current/warm-standby.html" },
        { title: "Working with DB instance read replicas (Amazon RDS)", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" },
      ],
    },
  },
};
