import type { LessonEntry } from "@/types/roadmap";

export const SCHEDULED_WORK: LessonEntry = {
  track: "system-design",
  section: "Background work and events",
  subsection: {
    title: "Scheduled work",
    slug: "scheduled-work",
    lesson: {
      summary: "Running a job at a given time is easy on one machine; on a fleet you have to prevent double runs, missed runs and overlap.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Cron and distributed schedulers" },
        { type: "p", text: "Cron runs a command at times described by five fields: minute, hour, day of month, month, day of week. `0 2 * * *` means 02:00 every day. It is perfect for one server. It has no memory of whether the last run succeeded, no retries, no central view, and if the machine is down at 02:00 the run is simply skipped." },
        { type: "p", text: "Once your app runs on several instances, putting a cron entry or an in-process timer on each of them means the job runs several times. Options:" },
        { type: "table", head: ["Approach", "How it works", "Trade-off"], rows: [
          ["One cron host", "A single machine runs the schedule", "Simple, but it is a single point of failure"],
          ["Platform scheduler", "Kubernetes CronJob, AWS EventBridge Scheduler, Cloud Scheduler", "Managed, survives node loss; limited logic"],
          ["Leader election or lock", "All instances tick; one wins a lock (Postgres advisory lock, Redis lock, etcd) and runs it", "No extra infrastructure; locks need care"],
          ["Scheduler plus queue", "The scheduler only enqueues a job; workers run it", "Scales and retries well; most flexible"],
          ["Workflow engine", "Airflow, Temporal, Quartz clustered mode", "Dependencies, history, backfills; more to operate"],
        ] },
        { type: "p", text: "A strong default is the last-but-one pattern: a tiny scheduler (even a platform cron) puts a message such as `{ job: 'daily-report', date: '2026-10-25' }` on a queue, and ordinary workers process it with retries and a dead letter queue. The schedule is cheap and the work is scalable." },
        { type: "code", language: "sql", title: "Only one instance runs the job (Postgres advisory lock)", code: `-- returns true for exactly one caller
SELECT pg_try_advisory_lock(hashtext('daily-report'));

-- ... run the job if true ...

SELECT pg_advisory_unlock(hashtext('daily-report'));` },
        { type: "h2", text: "Scheduling pitfalls" },
        { type: "list", items: [
          "**Double runs**: two schedulers fire, or a retry overlaps the original. Make the job idempotent and keyed by its period (the date or hour it covers), so a second run finds the work done.",
          "**Missed runs**: the scheduler was down. Decide the policy: skip, run once late, or catch up every missed slot. Kubernetes CronJob has a `startingDeadlineSeconds` and a `concurrencyPolicy` (Allow, Forbid, Replace) for exactly these choices.",
          "**Overlap**: a job that takes 70 minutes on an hourly schedule starts piling up. Forbid overlap, or have the job take a lock.",
          "**Time zones and DST**: `0 2 * * *` in a local zone may not exist on the spring-forward night and happens twice in autumn. Schedule infrastructure jobs in UTC, and handle user-facing times such as 'every day at 9 am local' by computing each user's next run time.",
          "**Thundering herd at the top of the hour**: every team schedules at `:00`. Add jitter, or choose odd minutes like `:07`, so shared databases and APIs do not spike.",
          "**Silent failure**: a job that stops running produces no error. Alert on missing success, for example with a dead-man's switch that expects a check-in each period.",
        ] },
        { type: "p", text: "A concrete example: a billing job runs at 00:00 UTC on the first of the month and charges 200,000 customers. If you do it in one loop on one worker and it dies at customer 120,000, a naive restart double-charges the first 120,000. Instead, fan out one message per customer, each keyed by (customer, billing month) with a unique constraint on the invoice row. Rerunning the whole job is then harmless: those already billed are skipped." },
        { type: "callout", tone: "gotcha", title: "A lock is not a guarantee of exclusion", text: "A Redis or database lock can expire while the holder is paused (a long garbage collection, a slow network), and a second instance takes over while the first still thinks it holds it. Use a lease with a sensible timeout, and keep the job idempotent so an overlap does no harm." },
        { type: "p", text: "In interviews, name the failure cases before the happy path: what if it runs twice, not at all, or too long? An answer built on idempotency and a queue handles all three." },
      ],
      references: [
        { title: "Kubernetes: CronJob", url: "https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/" },
        { title: "crontab(5) manual page", url: "https://man7.org/linux/man-pages/man5/crontab.5.html" },
        { title: "What is Amazon EventBridge Scheduler?", url: "https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html" },
        { title: "PostgreSQL: Explicit Locking (advisory locks)", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
      ],
    },
  },
};
