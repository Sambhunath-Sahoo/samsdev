import type { LessonEntry } from "@/types/roadmap";

export const PIPELINE_STAGES: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Pipeline stages: build, test, lint, scan, deploy",
    slug: "pipeline-stages",
    lesson: {
      summary: "Order the stages so cheap checks fail first, expensive ones run once, and the artifact you test is the artifact you deploy.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Pipeline stages" },
        { type: "p", text: "A pipeline is a series of gates. Each stage answers one question about the commit, and a failure stops everything after it. The art is in the order: put the fast, cheap, most-likely-to-fail checks first so a typo does not wait ten minutes for an integration suite before anyone hears about it." },
        { type: "table", head: ["Stage", "Question it answers", "Typical time"], rows: [["Lint and format", "Does it follow the team's rules?", "seconds"], ["Unit tests", "Does each piece behave?", "under 2 min"], ["Build", "Can we produce the artifact?", "1-5 min"], ["Integration tests", "Do the pieces work with a real database and each other?", "3-10 min"], ["Scan", "Known vulnerable dependencies, leaked secrets, image CVEs?", "1-3 min"], ["Deploy", "Is it running and healthy in the target environment?", "minutes"]] },
        { type: "h2", text: "Rules that keep it honest" },
        { type: "list", items: ["**Build once.** Create the image in the build stage, push it, and let every later stage and environment use that exact image. Rebuilding per environment means you never test what you ship.", "**Run independent stages in parallel.** Lint, unit tests and a dependency audit do not need each other.", "**Deploy only from the main branch** (or tags). Pull requests run everything up to deploy.", "**Make failures actionable.** A red job should show the failing test or finding without scrolling through 2000 lines."] },
        { type: "h2", text: "Example" },
        { type: "code", language: "yaml", title: "Stages as jobs with needs", code: `jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm test

  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high

  build:
    needs: [lint, test, audit]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:\${{ github.sha }} .

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploy myapp:\${{ github.sha }}"` },
        { type: "p", text: "`lint`, `test` and `audit` run side by side; `build` starts only when all three pass; `deploy` is skipped on pull requests." },
        { type: "callout", tone: "gotcha", title: "Scans nobody reads", text: "A scanner that reports hundreds of low-severity findings and never fails the build trains people to ignore it. Fail on high and critical severity, track the rest separately, and keep a short, reviewed allowlist for accepted risks." },
      ],
      references: [
        { title: "Understanding GitHub Actions", url: "https://docs.github.com/en/actions/get-started/understanding-github-actions" },
        { title: "Deployment Pipeline (Martin Fowler)", url: "https://martinfowler.com/bliki/DeploymentPipeline.html" },
        { title: "OWASP Top 10 CI/CD Security Risks", url: "https://owasp.org/www-project-top-10-ci-cd-security-risks/" },
      ],
    },
  },
};
