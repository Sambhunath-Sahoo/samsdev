import type { LessonEntry } from "@/types/roadmap";

export const ON_CALL: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "On-call and incident management: PagerDuty and Opsgenie",
    slug: "on-call-and-incident-management",
    lesson: {
      summary: "On-call tools route an alert to the right person, escalate if nobody answers, and give incidents a clear process from page to postmortem.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What an on-call tool does" },
        { type: "p", text: "An alert in Prometheus or Grafana has to reach a human who can act. PagerDuty and Opsgenie sit between your monitoring and your people. Monitoring sends an event, the tool creates an incident, looks up who is on call, notifies them by push, SMS or phone call, and escalates to the next person if nobody acknowledges within a set time. They also deduplicate repeated alerts, keep a timeline and integrate with chat and ticketing." },
        { type: "p", text: "Opsgenie is Atlassian's product and PagerDuty is a separate vendor. Atlassian has announced that Opsgenie is being retired, with its features moving into Jira Service Management, so check its current status before choosing it for new work. The concepts below apply to either tool and to alternatives like Grafana OnCall or incident.io." },
        { type: "h2", text: "The building blocks" },
        {
          type: "table",
          head: ["Concept", "Meaning"],
          rows: [
            ["Service", "The thing that can break (checkout API). Alerts are attached to it."],
            ["Schedule", "Who is on call and when, usually a weekly rotation."],
            ["Escalation policy", "Who gets paged first, and who next after, say, 10 minutes of no response."],
            ["Integration", "How an alert arrives, such as an Alertmanager receiver or a webhook."],
            ["Severity", "How urgent it is, which decides whether to page or only to open a ticket."],
          ],
        },
        {
          type: "code",
          language: "yaml",
          title: "Alertmanager route to PagerDuty",
          code: `route:
  receiver: team-chat
  routes:
    - matchers: ['severity="page"']
      receiver: pagerduty

receivers:
  - name: pagerduty
    pagerduty_configs:
      - routing_key_file: /etc/alertmanager/secrets/pagerduty-key
  - name: team-chat
    slack_configs:
      - channel: "#alerts"
        api_url_file: /etc/alertmanager/secrets/slack-url`,
        },
        { type: "p", text: "Only alerts labelled `severity=page` wake someone. Everything else goes to chat for working hours. Keep the integration key in a mounted secret file, not in the config in git." },
        { type: "h2", text: "Running an incident" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Acknowledge** the page so the escalation stops, and say so in the incident channel.",
            "**Assess** the impact: who is affected, how badly, since when. Set a severity.",
            "**Mitigate first, diagnose second.** Roll back, scale up, fail over or turn off a feature flag. Restoring service beats finding the root cause.",
            "**Communicate** on a fixed rhythm, for example every 30 minutes, in one place. One person leads (the incident commander) and others do the work.",
            "**Resolve** and write the timeline while it is fresh.",
            "**Review** in a blameless postmortem with concrete follow-up actions and owners.",
          ],
        },
        { type: "callout", tone: "tip", title: "Make the first five minutes easy", text: "Every page should link to a runbook with a dashboard, the usual causes and the rollback command. A tired person at 3 a.m. should not have to remember anything." },
        { type: "callout", tone: "gotcha", title: "Burnout comes from noise, not from incidents", text: "A rotation with frequent false pages makes people leave. Track pages per shift, review each one, and fix or delete alerts that were not actionable. Use a primary and a secondary, and give people time off after a hard night." },
        { type: "p", text: "A solo developer still benefits: route a single `severity=page` alert for your portfolio or side project to your phone, and leave the rest silent." },
      ],
      references: [
        { title: "Being On-Call (Google SRE Book)", url: "https://sre.google/sre-book/being-on-call/" },
        { title: "Managing Incidents (Google SRE Book)", url: "https://sre.google/sre-book/managing-incidents/" },
        { title: "Postmortem Culture (Google SRE Book)", url: "https://sre.google/sre-book/postmortem-culture/" },
        { title: "PagerDuty Incident Response documentation", url: "https://response.pagerduty.com/" },
        { title: "Incident management (Atlassian)", url: "https://www.atlassian.com/incident-management" },
      ],
    },
    points: [
      {
        id: "devops.on-call-and-incident-management.routing-escalation",
        title: "Schedules and escalation policies",
        detail: "A schedule says who is on call, and an escalation policy says who is paged next if nobody acknowledges. This guarantees an alert reaches a person.",
        question: "What happens if the primary on-call person does not acknowledge a page?",
      },
      {
        id: "devops.on-call-and-incident-management.mitigate-first",
        title: "Mitigate first, diagnose later",
        detail: "During an incident the priority is restoring service through rollback, scaling or failover. Root-cause analysis comes afterwards, in the postmortem.",
        question: "Why roll back before you understand the root cause?",
      },
      {
        id: "devops.on-call-and-incident-management.blameless-postmortem",
        title: "Blameless postmortems",
        detail: "A postmortem records the timeline, impact and causes, and ends with owned follow-up actions. It focuses on how the system allowed the failure, not on who made the mistake.",
        question: "What should every postmortem produce besides a timeline?",
      },
    ],
  },
};
