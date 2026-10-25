import type { LessonEntry } from "@/types/roadmap";

export const SLOS_AND_ERROR_BUDGETS: LessonEntry = {
  track: "system-design",
  section: "Reliability and observability",
  subsection: {
    title: "SLOs and error budgets",
    slug: "slos-and-error-budgets",
    lesson: {
      summary: "Turn reliability into a number users care about, accept that 100% is the wrong target, and use the leftover budget to decide when to ship.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "SLI, SLO and SLA" },
        { type: "p", text: "Three terms that interviewers like to see separated cleanly." },
        {
          type: "table",
          head: ["Term", "Meaning", "Example"],
          rows: [
            ["SLI (indicator)", "A measurement of behaviour users feel, usually a ratio of good events to all events", "Share of requests that return non-5xx in under 300 ms"],
            ["SLO (objective)", "The target for an SLI over a window; an internal goal", "99.9% of requests good, over 30 days"],
            ["SLA (agreement)", "A contract with consequences, often refunds, that is looser than the SLO", "99.5% monthly uptime or service credits"],
          ],
        },
        { type: "p", text: "Keep the SLO stricter than the SLA so you notice trouble before you owe money. Pick SLIs from the user's point of view: availability, latency and correctness of the key journeys, such as search or checkout, rather than CPU or memory." },
        { type: "h2", text: "Why not 100%" },
        { type: "p", text: "Each extra nine costs far more than the one before, and users often cannot tell the difference, because their phone, Wi-Fi and ISP are less reliable than your service. A target of 100% also means you can never deploy, since any change risks a failure. So choose a number that matches what users need and accept a small, known amount of failure." },
        { type: "h2", text: "The error budget" },
        { type: "p", text: "The error budget is 100% minus the SLO. It is the amount of unreliability you are allowed, and you can spend it on releases, experiments and maintenance." },
        {
          type: "table",
          head: ["SLO over 30 days", "Allowed downtime", "Allowed bad requests per 10 million"],
          rows: [
            ["99%", "7 h 12 min", "100,000"],
            ["99.9%", "43 min 12 s", "10,000"],
            ["99.99%", "4 min 19 s", "1,000"],
          ],
        },
        { type: "p", text: "Request-based budgets are usually better than time-based ones. A 10-minute outage at 3 a.m. and one at noon burn very different numbers of requests, and the request count reflects the real user impact." },
        { type: "h2", text: "Using the budget to make decisions" },
        { type: "p", text: "The budget turns an argument between product and operations into arithmetic. While budget remains, ship quickly. When it is exhausted, an agreed policy kicks in: freeze risky releases and spend the time on reliability work until the window recovers. The policy has to be written down and approved by both sides beforehand, or it will be ignored the first time it is inconvenient." },
        {
          type: "code",
          language: "text",
          title: "Burn rate example (SLO 99.9% over 30 days)",
          code: `budget          = 0.1% of requests
burn rate 1     = budget used exactly at the end of 30 days
burn rate 14.4  = budget gone in 2 days (30 days / 14.4)

if error ratio over last 1h  > 14.4 * 0.001 = 1.44%
   and over last 5 min also  > 1.44%   ->  page now
if burn rate > 1 over 3 days            ->  open a ticket`,
        },
        { type: "p", text: "Burn-rate alerts replace alerts on raw error counts. A fast burn means you will exhaust the budget within hours, so someone is paged. A slow burn means a quiet leak, so a ticket is enough. Pairing a long window with a short one stops the alert from lingering after the problem is fixed." },
        { type: "callout", tone: "gotcha", title: "A bad SLI makes a perfect SLO useless", text: "Measuring availability at the load balancer can read 99.99% while users see broken pages, if the app returns 200 with an error body, or if requests never reach you at all. Measure as close to the user as practical, count real failure modes (timeouts, wrong results), and revisit the SLI after every incident that the SLO missed." },
        { type: "h2", text: "In a design interview" },
        {
          type: "list",
          items: [
            "State an SLO early, for example \"99.9% availability and p99 under 300 ms on reads\", and let it drive choices such as replicas and caching.",
            "Remember that dependencies multiply: three serial dependencies each at 99.9% give about 99.7% (0.999 cubed). Your SLO cannot be better than what you depend on unless you add redundancy, caching or fallbacks.",
            "Separate SLOs per journey. Search can be 99.5% while payments need 99.95%.",
          ],
        },
      ],
      references: [
        { title: "Service Level Objectives (Google SRE Book)", url: "https://sre.google/sre-book/service-level-objectives/" },
        { title: "Implementing SLOs (Google SRE Workbook)", url: "https://sre.google/workbook/implementing-slos/" },
        { title: "Alerting on SLOs (Google SRE Workbook)", url: "https://sre.google/workbook/alerting-on-slos/" },
        { title: "Example Error Budget Policy (Google SRE Workbook)", url: "https://sre.google/workbook/error-budget-policy/" },
      ],
    },
    points: [
      { id: "sd.slos-and-error-budgets.sli-slo-sla", title: "SLI, SLO and SLA", detail: "An SLI measures user-visible behaviour as good events over all events, an SLO sets the target for it over a window, and an SLA is the contract with penalties. Keep the SLO stricter than the SLA.", question: "Write an SLI and SLO for a search endpoint in one sentence each." },
      { id: "sd.slos-and-error-budgets.error-budget-arithmetic", title: "Error budget arithmetic", detail: "The budget is 100% minus the SLO, so 99.9% over 30 days allows about 43 minutes of downtime or 0.1% bad requests. Request-based budgets track real user impact better than minutes.", question: "How many bad requests may a service with a 99.95% SLO serve out of 20 million?" },
      { id: "sd.slos-and-error-budgets.budget-policy", title: "Budget policy drives releases", detail: "Spare budget means ship faster; an exhausted budget means freezing risky changes and fixing reliability. The policy must be agreed in advance by product and engineering.", question: "What happens to your release process when the budget hits zero in week two?" },
      { id: "sd.slos-and-error-budgets.burn-rate-alerts", title: "Burn-rate alerts", detail: "Burn rate is how fast the budget is being used compared with an even spend over the window. Page on a high burn over a short window confirmed by a longer one, and ticket on slow burns.", question: "Why is alerting on burn rate better than alerting on a fixed error count?" },
    ],
  },
};
