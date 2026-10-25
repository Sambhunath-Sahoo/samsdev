import type { LessonEntry } from "@/types/roadmap";

export const ALERTING_SLOS: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Alerting and SLOs",
    slug: "alerting-and-slos",
    lesson: {
      summary: "Define what good service looks like as an SLO, measure it with SLIs, and page people only when the error budget is burning fast.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "SLIs, SLOs and SLAs" },
        { type: "p", text: "A **Service Level Indicator (SLI)** is a measurement of behaviour users feel, usually a ratio: good requests divided by all requests. A **Service Level Objective (SLO)** is the target for that SLI over a period, such as 99.9 percent of requests succeed over 30 days. A **Service Level Agreement (SLA)** is a contract with a customer that attaches consequences, often money, to missing a target. The SLO is an internal goal and should be stricter than any SLA you have signed." },
        { type: "p", text: "Pick SLIs from the user's side. Good examples are the share of requests that return non-5xx and the share served under 300 ms. CPU use is not an SLI. Users never see it." },
        { type: "h2", text: "Error budget" },
        { type: "p", text: "The error budget is what the SLO allows you to fail: 100 percent minus the target. At 99.9 percent over 30 days, the budget is 0.1 percent, which is about 43 minutes of full downtime or the equivalent in failed requests. While budget remains, you can ship and take risks. When it is spent, the team slows feature work and fixes reliability. That turns the argument between speed and stability into a number both sides agreed on." },
        {
          type: "table",
          head: ["SLO (30 days)", "Allowed downtime"],
          rows: [["99%", "about 7.2 hours"], ["99.9%", "about 43 minutes"], ["99.99%", "about 4.3 minutes"]],
        },
        { type: "h2", text: "Alerting without alert fatigue" },
        { type: "p", text: "Every page should be urgent, actionable and about user impact. If a person is woken for something that fixes itself or needs no action, they learn to ignore alerts, and the real one gets missed. Alert on symptoms (error rate is high) rather than causes (one pod restarted), and send everything else to a ticket or dashboard." },
        { type: "p", text: "Burn-rate alerts fit this well. Burn rate is how fast you are consuming budget: 1 means you will use exactly the whole budget by the end of the window, 14 means you will exhaust it in about two days. Alert on a high burn rate over a short window, confirmed by a longer one, so a brief spike does not page anyone." },
        {
          type: "code",
          language: "yaml",
          title: "Prometheus alert rule: fast burn for a 99.9% SLO",
          code: `groups:
  - name: slo-api
    rules:
      - alert: ApiErrorBudgetFastBurn
        expr: |
          (
            sum(rate(http_requests_total{job="api",status=~"5.."}[5m]))
              / sum(rate(http_requests_total{job="api"}[5m])) > (14.4 * 0.001)
          )
          and
          (
            sum(rate(http_requests_total{job="api",status=~"5.."}[1h]))
              / sum(rate(http_requests_total{job="api"}[1h])) > (14.4 * 0.001)
          )
        for: 2m
        labels:
          severity: page
        annotations:
          summary: "API is burning its 30-day error budget fast"
          runbook_url: "https://wiki.example.com/runbooks/api-errors"`,
        },
        { type: "p", text: "Here `0.001` is the budget and `14.4` is the burn rate, which would spend about 2 percent of a 30-day budget in one hour. Add a slower rule (for example 6 times over 6 hours) with severity `ticket`." },
        { type: "h2", text: "Habits that keep alerts healthy" },
        {
          type: "list",
          items: [
            "Link a runbook in every alert, and delete alerts nobody acted on in three months.",
            "Use `for:` so a single bad scrape does not fire the alert.",
            "Route by severity in Alertmanager: page for urgent, chat or ticket for the rest.",
            "Review noisy alerts after each on-call week and fix or remove them.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Do not set the SLO at 100 percent", text: "A 100 percent target means a zero budget, so any change is a violation, and the cost of each extra nine rises steeply. Pick a number users would actually notice, and change it with data." },
      ],
      references: [
        { title: "Service Level Objectives (Google SRE Book)", url: "https://sre.google/sre-book/service-level-objectives/" },
        { title: "Alerting on SLOs (Google SRE Workbook)", url: "https://sre.google/workbook/alerting-on-slos/" },
        { title: "Error Budget Policy (Google SRE Workbook)", url: "https://sre.google/workbook/error-budget-policy/" },
        { title: "Alerting practices (Prometheus)", url: "https://prometheus.io/docs/practices/alerting/" },
      ],
    },
  },
};
