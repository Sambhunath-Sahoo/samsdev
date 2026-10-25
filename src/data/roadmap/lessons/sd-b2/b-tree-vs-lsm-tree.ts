import type { LessonEntry } from "@/types/roadmap";

export const B_TREE_VS_LSM_TREE: LessonEntry = {
  track: "system-design",
  section: "Data storage",
  subsection: {
    title: "Storage engine internals: B-tree vs LSM tree",
    slug: "b-tree-vs-lsm-tree",
    lesson: {
      summary: "How the two dominant on-disk structures trade read speed against write speed, and which databases use which.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The core trade-off" },
        { type: "p", text: "A storage engine decides how data is laid out on disk. Disks, including SSDs, are far better at sequential writes than at scattered ones. A **B-tree** keeps data sorted in place and updates pages where they sit. An **LSM tree** (log-structured merge tree) never updates in place: it buffers writes in memory and flushes them as new sorted files. The first favours reads, the second favours writes." },
        { type: "h2", text: "B-tree" },
        { type: "p", text: "Data lives in fixed-size pages (often 4 to 16 KB), arranged as a balanced tree with a fan-out of hundreds. Finding a key walks from the root to a leaf: with a fan-out of 500, three levels address about 125 million keys, so a lookup is three or four page reads and the top levels are always cached. PostgreSQL and MySQL InnoDB use B-trees (strictly, B+trees)." },
        { type: "p", text: "A write finds the leaf page and modifies it in place. To survive a crash mid-write, the engine first appends the change to a **write-ahead log**, so each write costs the log append plus an eventual page write, and pages that fill up must split. The result is steady, predictable reads and moderate write cost, with random I/O under heavy writes." },
        { type: "h2", text: "LSM tree" },
        { type: "list", ordered: true, items: ["A write goes to the write-ahead log (for durability) and to an in-memory sorted structure, the **memtable**.", "When the memtable is full, it is flushed to disk as an immutable sorted file, an **SSTable**. This is one fast sequential write.", "A read checks the memtable, then SSTables from newest to oldest until it finds the key. A **Bloom filter** per file lets it skip files that cannot hold the key.", "In the background, **compaction** merges SSTables, drops overwritten and deleted entries, and keeps the file count bounded."] },
        { type: "p", text: "Cassandra, RocksDB, LevelDB and HBase work this way. Writes are fast and sequential, so ingest rates are high. Reads may touch several files, and compaction burns I/O and CPU in the background." },
        { type: "h2", text: "Side by side" },
        {
          type: "table",
          head: ["", "B-tree", "LSM tree"],
          rows: [
            ["Write path", "Update a page in place, plus log", "Append to log and memtable, flush sequentially"],
            ["Point read", "One path of 3-4 pages", "Possibly several files, helped by Bloom filters"],
            ["Range scan", "Excellent, leaves are linked", "Good, but merges across files"],
            ["Write amplification", "Page rewrites plus log", "Rewrites during compaction, often higher in total"],
            ["Space", "Some fragmentation in pages", "Stale versions until compaction"],
            ["Latency", "Steady", "Can spike when compaction falls behind"],
            ["Typical users", "PostgreSQL, MySQL, SQL Server", "Cassandra, RocksDB, HBase, ScyllaDB"],
          ],
        },
        { type: "p", text: "Three amplification factors describe the cost: **read** amplification (files or pages touched per read), **write** amplification (bytes written to disk per byte the application wrote), and **space** amplification (disk used per byte of live data). You can tune one down only by raising another." },
        { type: "callout", tone: "gotcha", title: "Deletes in an LSM tree are writes", text: "A delete adds a marker called a tombstone, and the old value stays until compaction reaches it. A workload that deletes a lot, such as a queue built on Cassandra, can make reads scan huge numbers of tombstones and slow down badly." },
        { type: "p", text: "In an interview, tie the structure to the workload. Mostly reads with transactions and range queries: B-tree. Very high write ingest such as metrics, event logs, messaging: LSM. Do not say one is simply faster; say which operation it makes cheap and what it makes expensive." },
      ],
      references: [
        { title: "Wikipedia: Log-structured merge-tree", url: "https://en.wikipedia.org/wiki/Log-structured_merge-tree" },
        { title: "Wikipedia: B-tree", url: "https://en.wikipedia.org/wiki/B-tree" },
        { title: "RocksDB wiki: RocksDB Overview", url: "https://github.com/facebook/rocksdb/wiki/RocksDB-Overview" },
        { title: "Bigtable: A Distributed Storage System for Structured Data", url: "https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/" },
        { title: "PostgreSQL documentation: Write-Ahead Logging", url: "https://www.postgresql.org/docs/current/wal-intro.html" },
      ],
    },
    points: [
      { id: "sd.b-tree-vs-lsm-tree.b-tree-in-place-updates", title: "B-trees update pages in place", detail: "A B-tree keeps sorted pages with a wide fan-out, so a lookup reads three or four pages. Writes modify a page where it sits after a log append, which gives steady reads but random write I/O.", question: "Why does a B-tree lookup over 100 million keys take only a few page reads?" },
      { id: "sd.b-tree-vs-lsm-tree.lsm-write-path", title: "The LSM write path", detail: "A write goes to the log and an in-memory memtable, which is flushed as an immutable sorted SSTable. Background compaction merges files and removes stale versions.", question: "Walk through what happens when you write a key to an LSM tree, and when the data reaches its final form." },
      { id: "sd.b-tree-vs-lsm-tree.amplification", title: "Read, write and space amplification", detail: "Each engine trades these three costs against each other. LSM trees favour write throughput at the price of read work and compaction I/O; B-trees favour reads.", question: "Which workload would you put on an LSM-based store and which on a B-tree, and why?" },
    ],
  },
};
