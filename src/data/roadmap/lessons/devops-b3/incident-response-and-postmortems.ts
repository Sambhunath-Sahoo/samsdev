import type { LessonEntry } from "@/types/roadmap";

export const INCIDENT_RESPONSE_AND_POSTMORTEMS: LessonEntry = {
  track: "devops",
  section: "Security and reliability practice",
  subsection: {
    title: "Incident response and postmortems",
    slug: "incident-response-and-postmortems",
    lesson: {
      summary: "Stop the damage first, communicate clearly, then write a blameless postmortem that produces fixes someone owns.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What an incident is" },
        { type: "p", text: "An incident is any event that harms users or the business and needs a coordinated response: the site is down, payments fail, data leaks, a deploy corrupts records. The aim during one is not to find the root cause. It is to **restore service** and limit harm. Understanding why comes afterwards." },
        { type: "h2", text: "During the incident" },
        { type: "list", ordered: true, items: ["**Detect and declare.** An alert or a user report arrives. Say out loud, in one shared channel, that this is an incident and give it a severity.", "**Assign roles.** One **incident commander** who coordinates and decides, one person doing the technical work, and one person handling communication. In a small team one person may hold two roles, but the commander should not be the one debugging.", "**Mitigate first.** Roll back the last deploy, turn off a feature flag, scale up, fail over. These are usually faster and safer than a live fix.", "**Communicate.** Post short updates on a fixed rhythm, even if the update is that nothing has changed. Users and managers tolerate an outage better than silence.", "**Keep a timeline.** Write down what was seen and done, with times, as it happens. Memory is poor afterwards."] },
        {
          type: "code",
          language: "bash",
          title: "first minutes: what changed?",
          code: `git log --since="2 hours ago" --oneline      # recent deploys
kubectl rollout history deploy/api           # or your platform's release list
kubectl rollout undo deploy/api              # revert to the previous version
docker compose logs --since 30m api | tail -100`,
        },
        { type: "h2", text: "Severity" },
        { type: "p", text: "Define levels before you need them, for example: SEV1 is a full outage or data loss, SEV2 is a major feature broken for many users, SEV3 is minor or has a workaround. The level decides who is woken up and how often updates go out." },
        { type: "h2", text: "The postmortem" },
        { type: "p", text: "Within a few days, write a document covering a summary, the impact (who, how long, how much), a timeline, the root causes and contributing factors, what went well and badly, and **action items** with an owner and a date. It is **blameless**: people acted reasonably with the information they had, so the question is what in the system allowed the mistake and made it hard to catch. If the conclusion is \"engineer X should be more careful\", you have not finished the analysis." },
        {
          type: "table",
          head: ["Weak action item", "Strong action item"],
          rows: [
            ["Be more careful with migrations", "Add a CI check that runs the migration on a copy of production data (owner, due date)"],
            ["Improve monitoring", "Alert when error rate stays above 2% for 5 minutes, and page the on-call"],
          ],
        },
        { type: "callout", tone: "tip", title: "Practice before it happens", text: "Keep a runbook for the likely failures, check that someone can actually restore from a backup, and run a short game day where you break something in staging and respond. The first time you use the process should not be during a real outage." },
        { type: "p", text: "Common mistakes: debugging for an hour before rolling back, no single person in charge, a postmortem that blames a person, and action items that nobody tracks." },
      ],
      references: [
        { title: "Managing Incidents (Google SRE book)", url: "https://sre.google/sre-book/managing-incidents/" },
        { title: "Postmortem Culture: Learning from Failure (Google SRE book)", url: "https://sre.google/sre-book/postmortem-culture/" },
        { title: "Incident Response (Google SRE workbook)", url: "https://sre.google/workbook/incident-response/" },
        { title: "Incident postmortem (Atlassian)", url: "https://www.atlassian.com/incident-management/postmortem" },
      ],
    },
    points: [
      { id: "devops.incident-response-and-postmortems.mitigate-first", title: "Mitigate before you investigate", detail: "Rolling back or disabling a feature restores service faster than debugging live. Find the root cause once users are no longer affected.", question: "Why is rollback usually the first thing to try after a bad deploy?" },
      { id: "devops.incident-response-and-postmortems.roles-and-comms", title: "Roles and regular updates", detail: "One commander coordinates, others fix and communicate. Updates on a fixed rhythm keep stakeholders informed even when there is no news.", question: "Which role should not be the person debugging?" },
      { id: "devops.incident-response-and-postmortems.blameless-postmortem", title: "Blameless postmortem with owned actions", detail: "The document records impact, timeline and causes without blaming a person. Every action item has an owner and a due date.", question: "What makes an action item strong rather than weak?" },
    ],
  },
};
