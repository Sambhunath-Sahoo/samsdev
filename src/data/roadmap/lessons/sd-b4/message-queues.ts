import type { LessonEntry } from "@/types/roadmap";

export const MESSAGE_QUEUES: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Message queues",
    slug: "message-queues",
    lesson: {
      summary: "A queue decouples the producer of work from the consumer, smooths bursts, and forces you to think about duplicates, ordering and acknowledgements.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Why use a queue" },
        { type: "p", text: "A user signs up. You must save the account, but sending the welcome email, resizing the avatar and notifying the CRM can take seconds and any of them can fail. Doing it inline makes the signup slow and breaks it when the email provider has a bad minute. Instead the request saves the account, puts a message on a queue and returns. Workers pick the messages up later." },
        { type: "list", items: [
          "**Decoupling**: the producer does not know who consumes, or whether they are up.",
          "**Load leveling**: a spike of 10,000 messages per second is absorbed by the queue; workers drain it at their own pace of 500 per second instead of falling over.",
          "**Independent scaling**: add workers when the backlog grows.",
          "**Failure isolation**: if the consumer is down for an hour, messages wait instead of being lost.",
          "**Retries**: a failed message can be tried again without the user's request being involved.",
        ] },
        { type: "p", text: "The cost: the system becomes eventually consistent, debugging spans processes, and you now operate a broker. A queue between two services also hides overload: a growing backlog means you are falling behind, so watch queue depth and the age of the oldest message." },
        { type: "h2", text: "Queue vs stream" },
        { type: "table", head: ["", "Queue (SQS, RabbitMQ)", "Log or stream (Kafka, Kinesis)"], rows: [
          ["Model", "Message is removed once handled", "Append-only log; consumers track their own position"],
          ["Rereading", "Not normally possible", "Yes: replay from any retained offset"],
          ["Consumers", "Competing: each message goes to one worker", "Each consumer group gets every message; one consumer per partition within a group"],
          ["Ordering", "Best effort, or per FIFO group", "Strict within a partition"],
          ["Best for", "Task distribution, jobs", "Event history, many readers, analytics, replay"],
        ] },
        { type: "p", text: "Rule of thumb: if the message is a **task** that should be done once and forgotten, use a queue. If it is a **fact** that several systems care about and you may want to replay, use a log." },
        { type: "h2", text: "Delivery guarantees and ordering" },
        { type: "p", text: "A network can fail after a message is processed but before the broker hears about it, so the broker cannot know. That gives the three guarantees:" },
        { type: "list", items: [
          "**At-most-once**: acknowledge before processing. No duplicates, but a crash loses the message.",
          "**At-least-once**: acknowledge after processing. Nothing lost, but a crash causes redelivery and duplicates. This is the practical default.",
          "**Exactly-once**: really means at-least-once delivery plus idempotent processing (or a transactional write that covers both the effect and the offset). Do not assume the broker gives it across your side effects.",
        ] },
        { type: "p", text: "So consumers must be **idempotent**: handling a message twice has the same effect as once. Store the message id in a table with a unique constraint and skip repeats, or write with an upsert. For ordering, strict global order does not scale. Order is usually per key: put all messages for one order id in the same Kafka partition or the same FIFO message group, and let different orders run in parallel." },
        { type: "h2", text: "Acknowledgements and visibility timeouts" },
        { type: "p", text: "A delivered message is not deleted until the consumer acknowledges it. In RabbitMQ, the consumer sends an ack; if the connection drops first, the broker requeues it. In SQS there are no acks as such: receiving a message hides it for a **visibility timeout** (30 seconds by default), and the consumer deletes it when done. If the delete does not happen before the timeout, the message becomes visible again and another worker gets it." },
        { type: "code", language: "ts", title: "SQS-style consumer loop", code: `while (true) {
  const msgs = await sqs.receive({ MaxMessages: 10, WaitTimeSeconds: 20 });
  for (const m of msgs) {
    if (await alreadyProcessed(m.id)) { await sqs.delete(m); continue; }
    await handle(m.body);            // must finish before the visibility timeout
    await markProcessed(m.id);
    await sqs.delete(m);             // only now is it gone
  }
}` },
        { type: "callout", tone: "gotcha", title: "Timeout shorter than the work", text: "If a job takes 90 seconds and the visibility timeout is 30, the message reappears while the first worker is still running and a second worker starts the same job. Set the timeout above your slowest normal run, or extend it while working, and keep handlers idempotent anyway." },
      ],
      references: [
        { title: "What is Amazon SQS?", url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html" },
        { title: "Amazon SQS visibility timeout", url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html" },
        { title: "RabbitMQ: Consumer Acknowledgements and Publisher Confirms", url: "https://www.rabbitmq.com/docs/confirms" },
        { title: "Apache Kafka: Introduction", url: "https://kafka.apache.org/intro" },
      ],
    },
  },
};
