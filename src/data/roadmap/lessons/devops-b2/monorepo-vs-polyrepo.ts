import type { LessonEntry } from "@/types/roadmap";

export const MONOREPO_VS_POLYREPO: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Monorepo vs polyrepo",
    slug: "monorepo-vs-polyrepo",
    lesson: {
      summary: "Decide between one repository for many projects and one repository per project, based on how your teams and deploys actually work.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The two layouts" },
        { type: "p", text: "A **monorepo** keeps several projects (an API, a web app, shared libraries, infrastructure) in a single repository. A **polyrepo** gives each its own repository with its own history, permissions and pipeline. Neither is correct in general. Each moves cost from one place to another." },
        {
          type: "code",
          language: "text",
          title: "Monorepo layout",
          code: `myapp/
  apps/
    web/          # Next.js
    admin/
    api/          # backend service
  packages/
    ui/           # shared components
    config/       # shared lint and tsconfig
  infra/          # Terraform, compose files
  package.json    # workspaces`,
        },
        { type: "h2", text: "Tradeoffs" },
        {
          type: "table",
          head: ["", "Monorepo", "Polyrepo"],
          rows: [
            ["Cross-project change", "One PR, one atomic commit", "Several PRs that must land in order"],
            ["Sharing code", "Import directly, one version", "Publish a package and bump versions"],
            ["Tooling consistency", "One lint, test and CI setup", "Drifts per repository"],
            ["Access control", "Coarse, whole repo", "Fine-grained per repo"],
            ["CI time", "Grows unless builds are scoped", "Small and fast per repo"],
            ["Ownership", "Can blur", "Clear boundaries"],
          ],
        },
        { type: "p", text: "The monorepo's strength is that a change touching the API contract and its callers lands together and is tested together. Its weakness is scale: clone size, CI time, and the need for tooling. The polyrepo's strength is isolation and independent release cycles; its weakness is the coordination tax of versioned dependencies and duplicated configuration." },
        { type: "h2", text: "Making a monorepo work" },
        { type: "p", text: "A monorepo needs CI that builds only what changed. Without that, every commit rebuilds everything and the pipeline slows to a crawl. Package-manager workspaces handle linking local packages, and tools like Turborepo, Nx or Bazel cache results and compute which projects a change affects. Path filters in your CI system are the simple first step." },
        {
          type: "code",
          language: "yaml",
          title: ".github/workflows/web.yml (excerpt)",
          code: `on:
  pull_request:
    paths:
      - "apps/web/**"
      - "packages/ui/**"`,
        },
        { type: "callout", tone: "tip", title: "Choose by team and release shape", text: "One developer or one small team shipping together usually does best in a monorepo, since the sharing is free. Separate teams with independent release schedules, or code with different access rules, lean towards polyrepo. You can also mix: an app monorepo and a separate private infrastructure repository." },
        { type: "callout", tone: "gotcha", title: "Path filters and required checks", text: "If a workflow is skipped by a path filter, a required status check for it never reports, and a protected branch can block the PR. Handle that with an always-running summary job or a ruleset that accounts for it." },
        { type: "p", text: "Common mistakes: splitting into many repos too early and then drowning in cross-repo version bumps, creating a monorepo without scoped CI, and mixing public and secret material in one repository that a wider group can read." },
      ],
      references: [
        { title: "Monorepo Explained", url: "https://monorepo.tools/" },
        { title: "Monorepos in Git | Atlassian Git Tutorial", url: "https://www.atlassian.com/git/tutorials/monorepos" },
        { title: "Pull requests - GitHub Docs", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" },
      ],
    },
  },
};
