import type { LessonEntry } from "@/types/roadmap";

export const CHOOSING_A_MESSAGING_STYLE_AND_BROKER: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Choosing a messaging style and broker",
    slug: "choosing-a-messaging-style-and-broker",
    lesson: {
      summary: "Decide first whether a call should be synchronous or asynchronous and point-to-point or pub/sub, then pick the broker that fits, usually the simplest one.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Synchronous vs asynchronous communication" },
        { type: "p", text: "In **synchronous** communication (HTTP, gRPC) the caller sends a request and waits for the answer. It is simple, gives an immediate result, and is easy to trace. In **asynchronous** communication the caller hands a message to a broker and continues; the reply, if any, comes later." },
        { type: "table", head: ["", "Synchronous", "Asynchronous"], rows: [
          ["Caller waits", "Yes", "No"],
          ["Availability", "Both sides must be up; failures chain", "Receiver can be down; messages wait"],
          ["Latency seen by user", "Sum of all calls", "Only the enqueue"],
          ["Result", "Immediate", "Later, through a callback, event or polling"],
          ["Debugging", "One trace", "Spans services; needs a correlation id"],
          ["Good for", "Queries, validation, anything the user needs now", "Side effects, long work, fan-out, integration"],
        ] },
        { type: "p", text: "A useful test: does the user need the result before the next screen? Searching a catalog, checking a password and fetching a balance do. Sending a receipt, generating a PDF or updating a search index do not. If the answer is no, make it asynchronous and the failure of that step stops being the user's problem. Availability multiplies in synchronous chains: five services at 99.9 percent each give about 99.5 percent for the chain, roughly three and a half hours of downtime per month instead of 43 minutes." },
        { type: "h2", text: "Pub/sub vs point-to-point" },
        { type: "list", items: [
          "**Point-to-point**: one message goes to exactly one consumer from a pool of competing workers. This is a work queue. Use it for tasks: resize this image, send this email.",
          "**Publish/subscribe**: one message goes to every subscriber. The publisher does not know who they are. Use it for events: `OrderPlaced` is wanted by billing, inventory and analytics.",
        ] },
        { type: "p", text: "Combining them is common and gives the classic fan-out design: publish an event to a topic (SNS), and give each interested service its own queue subscribed to it (SQS). Each service then gets every event, processes at its own pace with its own retries and dead letter queue, and one slow consumer cannot affect the others. Kafka does the same with consumer groups: each group sees every message, and within a group the partitions are shared among workers." },
        { type: "h2", text: "Choosing Kafka, RabbitMQ or SQS" },
        { type: "table", head: ["", "SQS", "RabbitMQ", "Kafka"], rows: [
          ["Model", "Managed queue", "Broker with exchanges, routing, queues", "Distributed append-only log"],
          ["Replay", "No", "No (streams feature aside)", "Yes, within retention"],
          ["Ordering", "FIFO queues per message group; standard queues best effort", "Per queue", "Per partition"],
          ["Routing", "Basic (use SNS for fan-out)", "Rich: topic, direct, headers", "Topics and partitions; consumer does the filtering"],
          ["Throughput", "High, scales on its own", "Tens of thousands per second per node", "Very high; millions per second across a cluster"],
          ["Operations", "None; pay per request", "Run and tune a cluster, or a managed service", "Heaviest to run; managed offerings exist"],
          ["Pick it for", "Simple jobs on AWS", "Flexible routing, request/reply, task queues", "Event streams, replay, many consumers, analytics"],
        ] },
        { type: "p", text: "Defaults that serve most teams: if you are on AWS and need background jobs, use SQS, perhaps with SNS for fan-out. If you need rich routing or per-message priorities and TTLs, RabbitMQ. If you need a durable event history, high volume, stream processing or several independent readers that may replay, Kafka. A database table polled with `FOR UPDATE SKIP LOCKED` is a legitimate queue at modest volume, and avoids a new system." },
        { type: "callout", tone: "gotcha", title: "Do not pick Kafka for prestige", text: "Kafka is excellent at what it does and costly to run. A team with 50 jobs a second who adopts it for a job queue takes on partition planning, consumer lag monitoring and rebalancing for little gain. Choose the least powerful tool that meets the requirement and state the requirement that would make you move up." },
        { type: "p", text: "Common interview mistakes: using async everywhere without saying how the user learns the outcome, naming a broker before stating requirements such as ordering, replay, throughput and fan-out, and forgetting that whichever you choose delivers at-least-once, so consumers must be idempotent." },
      ],
      references: [
        { title: "Pattern: Messaging (microservices.io)", url: "https://microservices.io/patterns/communication-style/messaging.html" },
        { title: "RabbitMQ: AMQP 0-9-1 Model Explained", url: "https://www.rabbitmq.com/tutorials/amqp-concepts" },
        { title: "Apache Kafka: Introduction", url: "https://kafka.apache.org/intro" },
        { title: "What is Amazon SQS?", url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html" },
      ],
    },
  },
};
