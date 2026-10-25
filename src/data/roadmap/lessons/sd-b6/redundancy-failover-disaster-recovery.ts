import type { LessonEntry } from "@/types/roadmap";

export const REDUNDANCY_FAILOVER_DISASTER_RECOVERY: LessonEntry = {
  track: "system-design",
  section: "Reliability and observability",
  subsection: {
    title: "Redundancy, failover and disaster recovery",
    slug: "redundancy-failover-disaster-recovery",
    lesson: {
      summary: "Keep spare copies of everything that can fail, switch to them quickly, and decide in advance how much data and time a disaster may cost.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Redundancy: no single point of failure" },
        { type: "p", text: "Redundancy means running more than one of anything whose loss would hurt: app servers, database nodes, load balancers, network links, even the DNS provider. The test is simple. Point at each box on your diagram and ask what happens if it disappears right now. If the answer is \"the site is down\", that box is a single point of failure." },
        { type: "p", text: "Spares are only useful if failures are independent. Two servers on the same rack, the same power feed or the same availability zone fail together. Spread copies across zones for hardware faults and across regions for large outages." },
        { type: "h2", text: "Failover: how the spare takes over" },
        { type: "p", text: "Failover is the switch from a failed component to its replacement. Detection comes first: health checks every few seconds, and a rule such as three misses in a row, so one slow response does not trigger a switch. Then traffic moves, by a load balancer dropping the node, a database promoting a replica, or DNS pointing elsewhere." },
        {
          type: "table",
          head: ["Pattern", "How it works", "Trade-off"],
          rows: [
            ["Active-active", "All copies serve traffic; losing one removes capacity, not service", "Best uptime, but needs spare headroom and data that tolerates multiple writers"],
            ["Active-passive (hot standby)", "Standby is running and replicating, takes over on failure", "Simple to reason about; you pay for idle capacity"],
            ["Cold standby", "Standby is built from backups or templates when needed", "Cheap, but recovery takes minutes to hours"],
          ],
        },
        { type: "p", text: "Stateless tiers are easy to make redundant because any node can serve any request. State is the hard part. A database failover must promote exactly one new primary; if the old primary comes back and still thinks it is the leader, you get split-brain and two nodes accepting conflicting writes. Systems prevent this with quorum votes or by fencing the old node off." },
        { type: "h2", text: "Disaster recovery: when a whole site is gone" },
        { type: "p", text: "Redundancy inside a region handles server and zone failures. Disaster recovery (DR) covers the rarer loss of a whole region, a corrupted database, or a bad deploy that deleted data. Two numbers frame every DR conversation." },
        {
          type: "list",
          items: [
            "**RPO (recovery point objective):** how much data you can afford to lose, measured in time. An RPO of 5 minutes means backups or replication must never be more than 5 minutes behind.",
            "**RTO (recovery time objective):** how long you can be down before service is back. An RTO of 1 hour means the whole restore procedure must finish inside that hour.",
          ],
        },
        { type: "p", text: "Tighter targets cost more. AWS describes four common strategies, and the others map onto them closely:" },
        {
          type: "table",
          head: ["Strategy", "Typical RPO / RTO", "What runs in the second region"],
          rows: [
            ["Backup and restore", "Hours / hours", "Nothing; restore from copied backups"],
            ["Pilot light", "Minutes / tens of minutes", "Data replicated, core services off or tiny"],
            ["Warm standby", "Seconds to minutes / minutes", "Full stack at reduced size, scaled up on failover"],
            ["Multi-site active-active", "Near zero / near zero", "Full stack serving live traffic"],
          ],
        },
        { type: "p", text: "Example: an order service with an RPO of 1 minute and RTO of 15 minutes. Asynchronous replication to a second region with lag under 60 seconds meets the RPO. A warm standby with infrastructure defined as code meets the RTO. A nightly backup alone would fail both targets." },
        { type: "callout", tone: "gotcha", title: "An untested backup is a hope", text: "Teams discover broken restores during the disaster: missing encryption keys, a restore that takes 9 hours instead of 1, a runbook nobody has run. Schedule restore drills and game days, and measure the real RTO. Also remember that replication copies mistakes. A dropped table replicates in seconds, so you still need point-in-time backups." },
        { type: "h2", text: "Interview points" },
        {
          type: "list",
          items: [
            "Ask for the RPO and RTO before choosing a strategy; do not default to multi-region.",
            "Say how failure is detected and who or what triggers failover, automatic or manual. Automatic failover across regions can flap, so many teams keep that step manual.",
            "Mention data: synchronous replication gives zero loss but adds latency and blocks writes if the replica is away; asynchronous is fast but can lose the last writes.",
          ],
        },
      ],
      references: [
        { title: "Disaster recovery options in the cloud (AWS Whitepaper)", url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html" },
        { title: "Recommendations for designing a disaster recovery strategy (Azure Well-Architected)", url: "https://learn.microsoft.com/en-us/azure/architecture/reliability/disaster-recovery" },
        { title: "Disaster recovery planning guide (Google Cloud)", url: "https://cloud.google.com/architecture/dr-scenarios-planning-guide" },
      ],
    },
    points: [
      { id: "sd.redundancy-failover-disaster-recovery.single-point-of-failure", title: "Find the single points of failure", detail: "Walk the diagram box by box and ask what happens if it vanishes. Copies must fail independently, so spread them across zones and, for large outages, regions.", question: "Which components in a typical web stack are easy to forget when removing single points of failure?" },
      { id: "sd.redundancy-failover-disaster-recovery.failover-and-split-brain", title: "Failover and split-brain", detail: "Failover needs reliable detection and a switch of traffic or leadership. If an old primary returns believing it is still leader, two nodes accept writes, so systems use quorum or fencing to allow only one.", question: "How does a database cluster avoid two primaries after a network partition heals?" },
      { id: "sd.redundancy-failover-disaster-recovery.rpo-and-rto", title: "RPO and RTO", detail: "RPO is the data loss you can tolerate measured in time and RTO is the downtime you can tolerate. Backup and restore, pilot light, warm standby and active-active buy progressively tighter targets at higher cost.", question: "A business wants zero data loss and a 5-minute RTO. What does that force in your design and what does it cost?" },
      { id: "sd.redundancy-failover-disaster-recovery.test-restores", title: "Test restores and drills", detail: "A backup only counts once a restore has worked and been timed. Replication copies deletions and corruption too, so keep point-in-time backups alongside replicas.", question: "How would you prove to an auditor that your 1-hour RTO is real?" },
    ],
  },
};
