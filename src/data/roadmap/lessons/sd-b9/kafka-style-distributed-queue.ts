import type { LessonEntry } from "@/types/roadmap";

export const KAFKA_STYLE_DISTRIBUTED_QUEUE: LessonEntry = {
  track: "system-design",
  section: "Classic case studies",
  subsection: {
    title: "Kafka-style distributed queue",
    slug: "kafka-style-distributed-queue",
    lesson: {
      summary: "Design a durable, partitioned, replicated log that producers append to and consumer groups read at their own pace.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Requirements and estimates" },
        { type: "p", text: "Functional: producers publish messages to a named topic, consumers read them, several independent consumer groups can read the same topic, and messages can be replayed. Non-functional: high throughput, durability across machine loss, ordering where it matters, and horizontal scale." },
        { type: "p", text: "Assume 1 million messages a second at 1 KB each: about 1 GB/s in. With a 7-day retention that is roughly 600 TB, and with replication factor 3 close to 1.8 PB on disk. A broker with 10 TB of disk and 200 MB/s of sustained disk and network throughput means you need at least 5 brokers for bandwidth and well over 100 for storage, so storage, not CPU, sizes the cluster." },
        { type: "h2", text: "API and data model" },
        {
          type: "code",
          language: "text",
          title: "Client API",
          code: `produce(topic, key, value, acks)      -> (partition, offset)
fetch(topic, partition, offset, maxBytes) -> [messages]
commit(group, topic, partition, offset)
join_group(group, topics)             -> assigned partitions`,
        },
        { type: "p", text: "A **topic** is split into **partitions**. Each partition is an append-only log on disk, stored as segment files (for example 1 GB each), and each message has a monotonically increasing **offset** within its partition. A sparse index maps offsets to file positions. Order is guaranteed only inside one partition; the producer picks the partition by `hash(key) % N`, so all events for one key stay in order." },
        { type: "h2", text: "Architecture" },
        { type: "p", text: "Each partition has one **leader** broker and a few **followers**. Producers and consumers talk to the leader. Followers pull from the leader and the set of followers that are caught up is the **in-sync replica set (ISR)**. A write is committed once every ISR member has it, and only committed messages are visible to consumers. If the leader dies, the controller elects a new leader from the ISR, so no committed message is lost." },
        { type: "p", text: "The producer's `acks` setting trades safety for latency:" },
        {
          type: "table",
          head: ["acks", "Meaning", "Risk"],
          rows: [
            ["0", "Fire and forget", "Lost on any failure"],
            ["1", "Leader wrote it", "Lost if the leader dies before followers copy"],
            ["all", "Whole ISR wrote it", "Higher latency; safe while the ISR has enough members"],
          ],
        },
        { type: "p", text: "Consumers are organised in **consumer groups**: each partition is read by exactly one member of a group, so a group of 6 on a 12-partition topic reads two partitions each, and the number of partitions caps useful parallelism. Consumers track their position by committing offsets to an internal topic. Because the consumer pulls, a slow consumer simply falls behind instead of overwhelming anyone, and replay is just resetting the offset." },
        { type: "p", text: "Why it is fast: appends are sequential disk writes, reads are sequential too and mostly hit the OS page cache, and the broker can send file data to the socket with zero-copy transfer instead of copying through user space. Messages are batched and compressed on the producer." },
        { type: "h2", text: "Bottlenecks and trade-offs" },
        {
          type: "list",
          items: [
            "**Hot partition**: a skewed key (one huge customer) overloads one leader. Salt the key or accept the skew for ordering.",
            "**Too many partitions**: each costs file handles, memory and slower leader elections. Choose a count for the peak consumer parallelism you expect, with some headroom.",
            "**Delivery semantics**: at-least-once is the default (commit after processing, duplicates on retry). Exactly-once needs idempotent producers plus transactions, and still requires an idempotent sink for side effects outside the log.",
            "**Rebalancing**: when a consumer joins or dies, partitions move and processing pauses briefly. Keep processing time per batch short.",
            "**Cluster metadata**: moving leader election and membership off an external coordinator simplifies operations; know that older designs depended on ZooKeeper.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Queue is the wrong mental model", text: "A log does not delete a message when it is read. Retention is by time or size, and many groups read independently. If the interviewer wants per-message acknowledgement, priorities or delayed delivery, say that a RabbitMQ- or SQS-style broker is a better fit." },
        { type: "p", text: "Common mistakes: promising global ordering across partitions, forgetting that the partition count limits consumer parallelism, and saying \"exactly once\" without describing how." },
      ],
      references: [
        { title: "Apache Kafka documentation: design", url: "https://kafka.apache.org/documentation/#design" },
        { title: "Apache Kafka documentation: concepts and terms", url: "https://kafka.apache.org/documentation/#intro_concepts_and_terms" },
        { title: "Apache Kafka (Wikipedia)", url: "https://en.wikipedia.org/wiki/Apache_Kafka" },
      ],
    },
    points: [
      { id: "sd.kafka-style-distributed-queue.partitions-and-offsets", title: "Partitions and offsets", detail: "A topic is split into partitions, each an append-only log where every message has an offset. Order is guaranteed only within one partition, and the key hash decides which partition a message goes to.", question: "How do you keep all events for one order id in sequence while still scaling to many consumers?" },
      { id: "sd.kafka-style-distributed-queue.replication-and-isr", title: "Replication and the in-sync replica set", detail: "Each partition has a leader and followers, and a write is committed once all in-sync replicas have it. Electing a new leader from the ISR means committed messages survive a broker loss.", question: "What does acks=all guarantee, and what happens if the ISR shrinks to one?" },
      { id: "sd.kafka-style-distributed-queue.consumer-groups", title: "Consumer groups and delivery semantics", detail: "Within a group each partition is read by one consumer, and offsets are committed to track progress. Committing after processing gives at-least-once delivery, so handlers must tolerate duplicates.", question: "Your consumer crashed after processing but before committing. What happens next, and how do you make it safe?" },
    ],
  },
};
