import type { LessonEntry } from "@/types/roadmap";

export const GITHUB_ACTIONS_BASICS: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "GitHub Actions: workflows, jobs, runners, secrets",
    slug: "github-actions-workflows-jobs-runners-secrets",
    lesson: {
      summary: "The four moving parts of GitHub Actions and a working workflow that tests a Node app on every push and pull request.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The vocabulary" },
        { type: "list", items: ["**Workflow**: a YAML file in `.github/workflows/`. It starts on an event such as `push`, `pull_request`, a schedule or a manual dispatch.", "**Job**: a group of steps that run on one machine. Jobs run in parallel unless you add `needs:`.", "**Step**: one shell command (`run:`) or one reusable action (`uses:`).", "**Runner**: the machine that executes a job. GitHub provides hosted Linux, Windows and macOS runners, or you register your own.", "**Secret**: an encrypted value stored in the repo or organization settings and exposed to steps as `${{ secrets.NAME }}`."] },
        { type: "h2", text: "A first workflow" },
        { type: "code", language: "yaml", title: ".github/workflows/ci.yml", code: `name: ci
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:\${{ github.sha }} .` },
        { type: "p", text: "`test` and `build` are separate jobs, and `needs: test` makes `build` wait. Each job starts on a fresh, empty machine, so every job needs its own checkout. Files and installed packages do not carry over between jobs unless you upload an artifact or use the cache (a later lesson)." },
        { type: "h2", text: "Using secrets" },
        { type: "p", text: "Reference a secret in a step's `env:` rather than pasting it into the command line. GitHub masks the exact secret value in logs, but only if it matches character for character, so a transformed value (base64 of the secret, for instance) can leak." },
        { type: "code", language: "yaml", code: `      - run: ./deploy.sh
        env:
          API_TOKEN: \${{ secrets.API_TOKEN }}` },
        { type: "callout", tone: "gotcha", title: "Pull requests from forks get no secrets", text: "Workflows triggered by a fork's pull request run without your repository secrets and with a read-only token. That is deliberate. Do not work around it with `pull_request_target` and a checkout of the fork's code: that combination lets untrusted code run with your secrets." },
        { type: "h2", text: "Habits worth having from day one" },
        { type: "list", items: ["Set `permissions:` explicitly and start from `contents: read`. The default token can be broader than the job needs.", "Pin third-party actions to a version tag, or to a full commit SHA for anything that touches secrets.", "Use `concurrency:` to cancel older runs of the same branch so a queue of stale builds does not form.", "Keep long commands in scripts in the repo and call them from `run:`, so you can run them locally too."] },
      ],
      references: [
        { title: "Understanding GitHub Actions", url: "https://docs.github.com/en/actions/get-started/understanding-github-actions" },
        { title: "Workflow syntax for GitHub Actions", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax" },
        { title: "Using secrets in GitHub Actions", url: "https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/using-secrets-in-github-actions" },
        { title: "Secure use reference", url: "https://docs.github.com/en/actions/reference/security/secure-use" },
      ],
    },
    points: [
      { id: "devops.github-actions.workflow-job-step", title: "Workflow, job and step", detail: "A workflow is a YAML file triggered by events. It holds jobs that run in parallel on separate machines, and each job is a sequence of steps. `needs:` creates ordering between jobs.", question: "Why does each job need its own checkout step?" },
      { id: "devops.github-actions.runners", title: "Runners execute jobs", detail: "`runs-on` picks the machine: a GitHub-hosted image such as `ubuntu-latest` or a self-hosted runner you registered. Every job starts on a clean machine.", question: "What carries over from one job to the next on a hosted runner?" },
      { id: "devops.github-actions.secrets-env", title: "Pass secrets through env", detail: "Store the value in repository or organization secrets and map it in a step's `env:` with `${{ secrets.NAME }}`. Log masking only works on the exact value.", question: "Why can a base64-encoded secret still leak into a log?" },
      { id: "devops.github-actions.least-privilege-token", title: "Limit the token with permissions", detail: "Declare `permissions:` at workflow or job level and grant only what the job needs, such as `contents: read`. Pin actions to a tag or SHA.", question: "What does setting `permissions: contents: read` protect against?" },
    ],
  },
};
