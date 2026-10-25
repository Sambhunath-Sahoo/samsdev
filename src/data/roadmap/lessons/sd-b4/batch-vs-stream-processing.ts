import type { LessonEntry } from "@/types/roadmap";

export const BATCH_VS_STREAM_PROCESSING: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Batch vs stream processing",
    slug: "batch-vs-stream-processing",
    lesson: {
      summary: "Batch jobs process a finished chunk of data on a schedule; stream jobs process each event as it arrives; the choice is about freshness, cost and correctness.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two ways to process the same data" },
        { type: "p", text: "**Batch processing** takes a bounded set of data, such as yesterday's orders, runs a job over all of it and writes a result. It runs on a schedule, takes minutes or hours, and finishes. **Stream processing** works on an unbounded flow of events, such as clicks as they happen, keeps running forever, and updates results continuously, usually within seconds." },
        { type: "table", head: ["", "Batch", "Stream"], rows: [
          ["Input", "Bounded dataset (files, a table snapshot)", "Unbounded events (a Kafka topic)"],
          ["Latency", "Minutes to hours", "Milliseconds to seconds"],
          ["Throughput per cost", "High; easy to optimize and rerun", "Lower; always-on, needs capacity for peaks"],
          ["Correctness", "Simple: all the data is present", "Harder: late, out-of-order and duplicate events"],
          ["Failure recovery", "Rerun the job", "Restore state from checkpoints, replay the log"],
          ["Typical tools", "Spark, SQL warehouse jobs, cron plus scripts", "Kafka Streams, Flink, Spark Structured Streaming"],
          ["Typical use", "Billing, daily reports, model training", "Fraud alerts, live dashboards, notifications"],
        ] },
        { type: "h2", text: "Choosing between them" },
        { type: "p", text: "Ask how stale the answer can be. A monthly invoice run does not need streaming. A fraud check that must block a card payment within a second cannot wait for tonight's job. Streaming also costs more to operate: state to manage, backpressure, exactly-once questions, and 24/7 on-call. Many teams that say they need real time are happy with results every five minutes, which a frequent micro-batch handles with far less machinery." },
        { type: "h2", text: "What makes streaming hard" },
        { type: "list", items: [
          "**Event time vs processing time**: an event happens at 10:00 on a phone but reaches you at 10:07. Windows (count per minute) should use when it happened, not when it arrived.",
          "**Late data and watermarks**: the system estimates how far event time has progressed (a watermark) and decides when a window is complete. Events after that are dropped, sent to a side output or trigger an update.",
          "**Windows**: tumbling (fixed, non-overlapping, such as each minute), sliding (overlapping), and session windows (gaps of inactivity).",
          "**State**: counting or joining needs memory kept across events, which must survive failures through periodic checkpoints.",
          "**Delivery**: most pipelines are at-least-once; getting effectively-once results means idempotent writes or transactional sinks.",
        ] },
        { type: "code", language: "sql", title: "A streaming-style aggregation (Flink SQL)", code: `SELECT window_start, window_end, page, COUNT(*) AS views
FROM TABLE(
  TUMBLE(TABLE page_views, DESCRIPTOR(event_time), INTERVAL '1' MINUTE))
GROUP BY window_start, window_end, page;` },
        { type: "h2", text: "Patterns that combine them" },
        { type: "p", text: "The **lambda architecture** runs both: a stream path gives fast approximate numbers and a batch path later recomputes exact ones, with a serving layer merging the two. The drawback is two codebases that must agree. The **kappa architecture** keeps only the stream path and treats reprocessing as replaying the log through a new version of the job, which works when your log retains enough history. Modern engines that run the same query in batch and streaming mode, and tables on object storage that accept both kinds of writes, reduce the duplication." },
        { type: "p", text: "Example: a ride-hailing company computes surge pricing from the last 5 minutes of requests per area with a stream job, since stale prices lose money, and computes driver payouts nightly with batch, where exactness and rerunnability matter more than speed. The same events feed both from one Kafka topic." },
        { type: "callout", tone: "gotcha", title: "Streaming is not automatically better", text: "A stream job that is wrong fast is worse than a batch job that is right slowly. If a number reaches money or compliance, prefer batch, or add a batch reconciliation that corrects the stream's output." },
        { type: "p", text: "Common interview mistakes: choosing streaming by reflex, ignoring late events, and forgetting that a stream job needs a way to reprocess history when its logic has a bug. Always say what the freshness requirement is, then pick the simplest architecture that meets it." },
      ],
      references: [
        { title: "Kafka Streams documentation", url: "https://kafka.apache.org/documentation/streams/" },
        { title: "Apache Flink: Concepts overview", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/overview/" },
        { title: "Batch processing", url: "https://en.wikipedia.org/wiki/Batch_processing" },
      ],
    },
    points: [
      {
        id: "sd.batch-vs-stream-processing.bounded-vs-unbounded",
        title: "Bounded batch versus unbounded stream",
        detail: "Batch runs over a finished dataset on a schedule and ends; streaming runs continuously over events as they arrive. Pick by how stale the answer may be and what you can afford to operate.",
        question: "Which would you use for a nightly invoice run and which for blocking a fraudulent payment, and why?",
      },
      {
        id: "sd.batch-vs-stream-processing.event-time-and-late-data",
        title: "Event time, windows and late events",
        detail: "Events arrive late and out of order, so windows should use the time the event happened, and a watermark decides when a window is complete. Late events need a policy: drop, side-output or update the result.",
        question: "What does a watermark do, and what happens to an event that arrives after it?",
      },
      {
        id: "sd.batch-vs-stream-processing.state-and-delivery",
        title: "State, checkpoints and delivery guarantees",
        detail: "Stream jobs keep state such as counts and join buffers, which is checkpointed so the job can recover. Most pipelines deliver at-least-once, so sinks should be idempotent to avoid double counting.",
        question: "After a crash and restart from a checkpoint, why can an event be processed twice, and how do you keep the result correct?",
      },
      {
        id: "sd.batch-vs-stream-processing.lambda-and-kappa",
        title: "Lambda and kappa architectures",
        detail: "Lambda runs a fast stream path and a slower exact batch path and merges them; kappa uses only the stream and reprocesses by replaying the log. Lambda duplicates logic, while kappa relies on long log retention.",
        question: "What is the main maintenance cost of a lambda architecture?",
      },
    ],
  },
};
