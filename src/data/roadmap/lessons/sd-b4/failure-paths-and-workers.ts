import type { LessonEntry } from "@/types/roadmap";

export const FAILURE_PATHS_AND_WORKERS: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Failure paths and workers",
    slug: "failure-paths-and-workers",
    lesson: {
      summary: "Poison messages, retries and dead letter queues keep a worker fleet from looping forever on bad input, and let you recover once the bug is fixed.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Dead letter queues" },
        { type: "p", text: "Some messages will never succeed: a malformed payload, a reference to a deleted user, a bug in your handler. If the broker keeps redelivering such a **poison message**, one bad item can occupy workers forever and block the ones behind it. A **dead letter queue** (DLQ) is a separate queue where a message goes after it has failed a set number of times. The main queue keeps flowing, and a human or a tool looks at the DLQ later." },
        { type: "p", text: "In SQS you set a redrive policy with `maxReceiveCount` (for example 5) and a target queue. In RabbitMQ you configure a dead letter exchange on the queue; messages are dead-lettered when they are rejected without requeue, expire, or overflow a length limit. Kafka has no built-in DLQ; the convention is to publish failing records to a separate retry or dead topic from your consumer." },
        { type: "h2", text: "Inspecting and redriving the DLQ" },
        { type: "p", text: "A DLQ nobody reads is a silent data loss. Treat it as an alarm: alert when its depth is above zero, or when the oldest message is more than a few minutes old. Keep enough context with each dead message: original body, error text, attempt count, first and last failure time, and a trace id." },
        { type: "list", items: [
          "**Look first**: sample the messages. Is it one bug, one bad customer, or a downstream outage?",
          "**Fix the cause**: deploy the handler fix, or repair the data.",
          "**Redrive**: move the messages back to the source queue (SQS has a built-in redrive from the console and API; elsewhere a small script) at a controlled rate, so you do not flood workers.",
          "**Discard deliberately**: messages that can never succeed are archived with a reason, not left forever.",
        ] },
        { type: "p", text: "Redriving only works safely because handlers are idempotent; some of those messages may have partially run before failing." },
        { type: "h2", text: "Designing background workers" },
        { type: "list", items: [
          "**Stateless and disposable**: a worker can be killed at any time. Keep state in the database or the message, not in memory.",
          "**Idempotent**: key side effects on a job id so a repeat does nothing new, for example a unique index on (job_id) in the table you write.",
          "**Small messages**: put an id in the message and load the data when you run, instead of shipping a megabyte payload that is stale by the time it is read.",
          "**Graceful shutdown**: on SIGTERM stop taking new work, finish or hand back the current job, then exit. Otherwise every deploy causes redeliveries.",
          "**Concurrency limits**: cap parallel jobs per worker and per downstream so a backlog of 100,000 jobs does not hammer an API that allows 50 requests per second.",
          "**Separate queues by workload**: slow report jobs should not sit in front of password reset emails.",
        ] },
        { type: "h2", text: "Job retries and priorities" },
        { type: "p", text: "Retry transient failures (timeouts, 503s, lock conflicts) but not permanent ones (validation errors, 404s), which should go straight to the DLQ. Use **exponential backoff with jitter** so a thousand failed jobs do not all retry at the same instant: wait roughly 1 s, 2 s, 4 s, 8 s, each randomized, with a cap and a maximum attempt count." },
        { type: "code", language: "ts", title: "Backoff with full jitter", code: `const BASE_MS = 1_000;
const CAP_MS = 5 * 60_000;
const MAX_ATTEMPTS = 6;

function retryDelayMs(attempt: number): number {
  const ceiling = Math.min(CAP_MS, BASE_MS * 2 ** attempt);
  return Math.random() * ceiling;           // full jitter
}

async function run(job: Job) {
  try {
    await handle(job);
  } catch (err) {
    if (isPermanent(err) || job.attempt >= MAX_ATTEMPTS) return deadLetter(job, err);
    await enqueue(job, { delayMs: retryDelayMs(job.attempt), attempt: job.attempt + 1 });
  }
}` },
        { type: "p", text: "For priorities, the dependable approach is separate queues (high, default, low) with workers that poll high first or are allocated by ratio, rather than one queue with a priority field. Strict priority can starve the low queue, so reserve some capacity for it and age old jobs upward." },
        { type: "callout", tone: "gotcha", title: "Retry storms", text: "If a downstream service is down and every worker retries aggressively, you add load exactly when it is trying to recover. Combine backoff with a circuit breaker or a pause on the queue, and never retry forever." },
        { type: "p", text: "In interviews, show the full path: normal processing, bounded retries with backoff, DLQ with an alarm, then redrive after a fix." },
      ],
      references: [
        { title: "Amazon SQS dead-letter queues", url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html" },
        { title: "RabbitMQ: Dead Letter Exchanges", url: "https://www.rabbitmq.com/docs/dlx" },
        { title: "Timeouts, retries and backoff with jitter (Amazon Builders' Library)", url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" },
      ],
    },
  },
};
