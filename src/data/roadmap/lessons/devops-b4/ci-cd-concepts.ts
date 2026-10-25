import type { LessonEntry } from "@/types/roadmap";

export const CI_CD_CONCEPTS: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "CI, continuous delivery, continuous deployment",
    slug: "ci-continuous-delivery-continuous-deployment",
    lesson: {
      summary: "Three terms that share the letters CD but mean different amounts of automation: what each one promises and where the human sits.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "CI vs CD" },
        { type: "p", text: "**Continuous integration** is about the code: every developer merges small changes into the main branch often, and each merge triggers an automated build and test run. The point is to find out within minutes that a change breaks something, while the author still remembers what they did. Long-lived branches that merge once a month are the opposite of CI, even if a CI server runs on them." },
        { type: "p", text: "**CD** is about what happens to the build after it is green. It starts from the artifact CI produced (an image, a bundle) and moves it toward users. The letters stand for two different things, and the difference is one decision: who presses the button for production." },
        { type: "h2", text: "Continuous delivery vs continuous deployment" },
        { type: "table", head: ["", "Continuous delivery", "Continuous deployment"], rows: [["Every green merge is...", "Releasable at any moment", "Released automatically"], ["Production step", "A person approves or clicks", "No human step"], ["Needs", "Automated tests you trust", "Same, plus fast rollback and monitoring"], ["Typical fit", "Regulated or high-risk systems, scheduled releases", "Web apps with small, frequent changes"]] },
        { type: "p", text: "Continuous delivery means the deploy is always one safe click away. Continuous deployment removes the click. You do not graduate from one to the other by flipping a flag: you earn it with test coverage, health checks and a rollback that works, because nobody is standing between a bad merge and your users." },
        { type: "h2", text: "Deployment pipeline vs release pipeline" },
        { type: "p", text: "A **deployment pipeline** is the automated path a commit takes: build once, run progressively slower and more realistic checks, and produce a deployable artifact. A **release** is the decision to expose that artifact to users. Teams often say \"release pipeline\" for the later part that targets production, with approvals and scheduling." },
        { type: "p", text: "Keeping the two ideas apart is useful because you can deploy code without releasing it. A change can sit in production behind a feature flag, switched off, and be released later without another deploy. Deploy is a technical event; release is a product decision." },
        { type: "code", language: "text", title: "One commit, end to end", code: `push to main
  -> build image (once)
  -> unit + integration tests
  -> push image tagged with the commit SHA
  -> deploy to staging, smoke tests
  -> [continuous delivery: wait for approval]
  -> deploy the SAME image to production
  -> health check, alert on failure` },
        { type: "h2", text: "Common mistakes" },
        { type: "list", items: ["Calling any server that runs tests \"CI\" while branches live for weeks.", "Rebuilding the artifact for each environment, so what you tested is not what you ship. Build once, promote the same artifact.", "Aiming for continuous deployment with no automated rollback.", "A flaky test suite that everyone re-runs until green; people stop believing red builds."] },
        { type: "callout", tone: "tip", title: "Start with a green main", text: "The cheapest, most valuable rule: a failing main branch is fixed or reverted before anything else merges. Everything else in CD depends on main being deployable." },
      ],
      references: [
        { title: "Continuous Integration (Martin Fowler)", url: "https://martinfowler.com/articles/continuousIntegration.html" },
        { title: "Continuous Delivery (Martin Fowler)", url: "https://martinfowler.com/bliki/ContinuousDelivery.html" },
        { title: "Deployment Pipeline (Martin Fowler)", url: "https://martinfowler.com/bliki/DeploymentPipeline.html" },
        { title: "DevOps tech: Continuous integration (Google Cloud)", url: "https://cloud.google.com/architecture/devops/devops-tech-continuous-integration" },
      ],
    },
  },
};
