import type { LessonEntry } from "@/types/roadmap";

export const REPLICATION_LAG: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Replication lag",
    slug: "replication-lag",
    lesson: {
      summary: "Asynchronous replicas run behind the primary, so a read right after a write can return old data; you design around it and you monitor it.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What lag is" },
        { type: "p", text: "With asynchronous replication the primary commits first and ships the change afterwards. The time between the commit on the primary and the change becoming visible on a replica is **replication lag**. Normally it is milliseconds. Under load or trouble it can reach seconds, minutes or hours. Any design that reads from replicas must assume the replica is somewhere in the past." },
        { type: "h2", text: "Stale reads after a write" },
        { type: "p", text: "The classic bug: a user changes their display name, the write goes to the primary, the page reloads, and the read goes to a replica that is 800 ms behind. The user sees the old name and submits again. Three anomalies come from this:" },
        { type: "list", items: [
          "**Read-your-writes violation**: you do not see your own update.",
          "**Time going backwards**: two reads hit two replicas with different lag, and the second returns older data than the first (a violation of monotonic reads).",
          "**Causality broken**: you see a reply before the message it answers, because they live on different partitions that replicate at different speeds.",
        ] },
        { type: "p", text: "Fixes, from simplest to heaviest:" },
        {
          type: "table",
          head: ["Technique", "How", "Trade-off"],
          rows: [
            ["Read from primary after a write", "For a short window (say 5 s) after the user writes, send their reads to the primary", "Easy; more primary load, needs a per-user timestamp or flag"],
            ["Sticky replica", "Hash the user id to one replica so their reads never go backwards", "Fixes monotonic reads only, not read-your-writes"],
            ["Wait for position", "Remember the write's log position; read from a replica only once it has replayed past it", "Precise; needs support in the database or proxy"],
            ["Return the written data", "The write response carries the new state and the UI uses it", "Cheapest; helps only the immediate screen"],
            ["Synchronous replica", "Wait for a follower before acknowledging", "Removes loss, but slows every write"],
          ],
        },
        { type: "code", language: "ts", title: "Read from primary shortly after a write", code: `const PRIMARY_WINDOW_MS = 5_000;

function poolFor(user: Session) {
  const recentlyWrote = Date.now() - user.lastWriteAt < PRIMARY_WINDOW_MS;
  return recentlyWrote ? primary : replicas;
}` },
        { type: "h2", text: "Why lag grows and how to watch it" },
        { type: "p", text: "Lag grows when the replica cannot apply changes as fast as the primary produces them. Typical causes:" },
        { type: "list", items: [
          "**A write burst or bulk job** on the primary, such as a backfill updating 50 million rows.",
          "**Single-threaded apply**: many databases replay the log with one or few workers, while the primary ran writes on dozens of cores. The replica falls behind even on equal hardware.",
          "**A weaker replica** or one sharing disk and CPU with heavy reporting queries.",
          "**A long-running query on the replica** that conflicts with replay. In Postgres hot standby, replay can be delayed or the query cancelled.",
          "**Network limits** between regions, or a replica that was offline and is catching up.",
        ] },
        { type: "p", text: "Watch it in time, not just in bytes. Postgres exposes `pg_stat_replication` on the primary with write, flush and replay lag per standby; on a replica you can compare `now() - pg_last_xact_replay_timestamp()`. MySQL reports `Seconds_Behind_Source` in replica status, and managed services publish a lag metric such as RDS `ReplicaLag`." },
        { type: "code", language: "sql", title: "Postgres: lag per standby, run on the primary", code: `SELECT application_name,
       state,
       write_lag, flush_lag, replay_lag
FROM pg_stat_replication;` },
        { type: "callout", tone: "gotcha", title: "An idle primary can look broken", text: "Time-based lag measured from the last replayed transaction rises when the primary has nothing to write, even though the replica is fully caught up. Pair a time metric with a byte or log-position difference before you page someone." },
        { type: "p", text: "Alert on a threshold tied to what the product tolerates (for example 5 seconds for a feed, 1 second for anything user-visible after a write). Add an automatic reaction: when lag exceeds the limit, the router drops that replica from the pool so it stops serving stale data, and falls back to the primary if all are behind. In interviews, a strong answer names which reads tolerate staleness, how you route the ones that cannot, and what you alert on." },
      ],
      references: [
        { title: "PostgreSQL: Hot Standby", url: "https://www.postgresql.org/docs/current/hot-standby.html" },
        { title: "PostgreSQL: The Cumulative Statistics System (pg_stat_replication)", url: "https://www.postgresql.org/docs/current/monitoring-stats.html" },
        { title: "Working with DB instance read replicas (Amazon RDS)", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" },
      ],
    },
  },
};
