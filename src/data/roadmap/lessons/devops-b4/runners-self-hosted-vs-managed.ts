import type { LessonEntry } from "@/types/roadmap";

export const RUNNERS_SELF_HOSTED_VS_MANAGED: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Runners: self-hosted vs managed",
    slug: "runners-self-hosted-vs-managed",
    lesson: {
      summary: "When the provider's hosted runners are enough, when to run your own, and the security cost of choosing the second.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Self-hosted vs managed CI runners" },
        { type: "p", text: "A runner is the machine that executes your jobs. **Managed** (GitHub-hosted) runners are virtual machines the provider creates for each job and throws away afterward. **Self-hosted** runners are machines you own, with an agent installed that polls the CI service for work. Same workflow file, different `runs-on`." },
        { type: "table", head: ["", "Managed", "Self-hosted"], rows: [["Setup", "None", "You provision, patch and monitor"], ["Clean state", "Fresh VM every job", "Whatever you configure; can accumulate leftovers"], ["Cost model", "Per minute, free allowance on some plans", "Your compute bill plus your time"], ["Hardware", "Fixed sizes (larger ones cost extra)", "Any: GPUs, ARM, big RAM"], ["Network", "Public internet only", "Can sit inside your VPC and reach private resources"], ["Security risk", "Provider's isolation", "Yours to get right"]] },
        { type: "h2", text: "When to choose each" },
        { type: "p", text: "Start with managed. A small project spends nothing on runner operations and gets a clean machine every time. Move to self-hosted when you have a real reason: builds that need private network access (a database or registry with no public endpoint), special hardware, very long or very frequent builds where per-minute pricing exceeds the cost of a server, or a strong need for a warm cache of large dependencies." },
        { type: "code", language: "yaml", code: `jobs:
  build:
    runs-on: ubuntu-latest        # managed
  deploy:
    runs-on: [self-hosted, linux, vpc]   # your labels` },
        { type: "p", text: "Labels pick the runner. Give self-hosted runners specific labels so a job asking for `vpc` cannot land on an unrelated machine." },
        { type: "h2", text: "The security side" },
        { type: "callout", tone: "gotcha", title: "Never attach self-hosted runners to public repositories", text: "A pull request can change the workflow file and run arbitrary code on your machine. On a persistent runner that code can read files left by earlier jobs, steal credentials from the instance role, and reach your internal network. Use self-hosted runners only for private repositories you trust." },
        { type: "list", items: ["Prefer ephemeral runners that take one job and then are destroyed, so state cannot leak between jobs.", "Give the runner's cloud role the minimum permissions; assume any job can use them.", "Keep the runner image and agent patched.", "Autoscale: idle runners cost money, and a single runner is a queue and a single point of failure."] },
        { type: "p", text: "On a small AWS setup, a single `t3.small` self-hosted runner can look cheap, but add patching, disk cleanup and an incident when it runs out of space. Count your time in the comparison." },
      ],
      references: [
        { title: "About GitHub-hosted runners", url: "https://docs.github.com/en/actions/concepts/runners/github-hosted-runners" },
        { title: "About self-hosted runners", url: "https://docs.github.com/en/actions/concepts/runners/about-self-hosted-runners" },
        { title: "Secure use reference (GitHub Actions)", url: "https://docs.github.com/en/actions/reference/security/secure-use" },
      ],
    },
  },
};
