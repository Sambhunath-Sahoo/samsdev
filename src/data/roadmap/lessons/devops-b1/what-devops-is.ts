import type { LessonEntry } from "@/types/roadmap";

export const WHAT_DEVOPS_IS: LessonEntry = {
  track: "devops",
  section: "DevOps fundamentals",
  subsection: {
    title: "What DevOps is and what it solves",
    slug: "what-devops-is-and-what-it-solves",
    lesson: {
      summary: "DevOps is the habit of one team owning code from commit to production, with automation and fast feedback replacing hand-offs.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The problem: a wall between writing and running" },
        { type: "p", text: "In the older split, developers wrote code and threw it over a wall to an operations team that ran it. The two groups wanted opposite things. Developers were rewarded for shipping change. Operations were rewarded for stability, and change is what breaks stability. The result was big, rare, risky releases, long waits for servers, and blame when something failed." },
        { type: "p", text: "**DevOps** is the answer to that split. It is a culture and a set of practices in which the people who build a service also take part in releasing and running it, and in which the path to production is automated and repeatable. It is not a job title, a tool, or a team that you add to the org chart." },
        { type: "h2", text: "How it works in practice" },
        { type: "p", text: "The core loop is: plan, code, build, test, release, deploy, operate, monitor, and feed what you learned back into planning. Each step is automated where it can be, so a change moves from a pull request to production through a pipeline instead of through a ticket queue." },
        { type: "list", items: ["**Small, frequent releases.** A change of ten lines is easy to review, easy to test and easy to roll back.", "**Automation.** Builds, tests and deploys run the same way every time, without someone remembering the steps.", "**Infrastructure as code.** Servers and networks are described in files under version control, not clicked together by hand.", "**Monitoring and feedback.** Metrics, logs and alerts tell the team how a release behaves in production.", "**Shared ownership.** The team that ships a service is on call for it, so it feels the cost of its own design decisions."] },
        { type: "h2", text: "DevOps and SRE" },
        { type: "p", text: "DevOps describes goals and culture. Site Reliability Engineering, which started at Google, is one concrete way to reach them: operations is treated as a software problem. An SRE team defines a **service level objective** (SLO), such as 99.9% of requests succeed, and the gap between that and 100% is the **error budget**. While budget remains, the team ships fast. When it is spent, releases slow down and reliability work takes priority. That turns the argument between speed and stability into a number both sides accept. SRE teams also cap manual, repetitive work, called toil, so that they automate instead of firefighting." },
        { type: "h2", text: "Shift-left" },
        { type: "p", text: "Shift-left means running checks earlier in the lifecycle, towards the left of the timeline. A bug caught in your editor costs minutes. The same bug caught in production costs an incident, a rollback and a post-mortem. Typical shift-left practices are linters and type checks, unit tests in CI, dependency and container-image scanning, and policy checks on infrastructure code, all running on every pull request." },
        { type: "table", head: ["Stage", "Cheap check that runs here"], rows: [["Editor / pre-commit", "Formatter, linter, secret scan"], ["Pull request", "Unit tests, type check, dependency audit"], ["Build", "Image scan, license check"], ["Pre-deploy", "Integration tests, `terraform plan` review"], ["Production", "Health checks, alerts, canary release"]] },
        { type: "h2", text: "A concrete example" },
        { type: "p", text: "Before: a developer emails a zip file, an operator copies it to a server on Friday evening and restarts it by hand. After: merging to `main` triggers a pipeline that runs tests, builds a container image, deploys it to a small share of traffic, watches the error rate and rolls back on its own if the rate rises. Nobody had to remember anything, and the whole run is in a log." },
        { type: "callout", tone: "gotcha", title: "Tools are not the point", text: "Buying a CI product or renaming the operations team to \"DevOps\" changes nothing if developers still hand work over a wall. Check the outcomes instead: how often you deploy, how long a change takes to reach production, how often releases fail, and how fast you recover." },
      ],
      references: [
        { title: "Introduction - Site Reliability Engineering (Google SRE book)", url: "https://sre.google/sre-book/introduction/" },
        { title: "How SRE relates to DevOps (Google SRE workbook)", url: "https://sre.google/workbook/how-sre-relates/" },
        { title: "DevOps Culture - Martin Fowler", url: "https://martinfowler.com/bliki/DevOpsCulture.html" },
        { title: "Continuous Delivery - Martin Fowler", url: "https://martinfowler.com/bliki/ContinuousDelivery.html" },
      ],
    },
  },
};
