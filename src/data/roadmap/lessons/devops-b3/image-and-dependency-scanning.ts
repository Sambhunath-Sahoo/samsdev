import type { LessonEntry } from "@/types/roadmap";

export const IMAGE_AND_DEPENDENCY_SCANNING: LessonEntry = {
  track: "devops",
  section: "Security and reliability practice",
  subsection: {
    title: "Image and dependency scanning",
    slug: "image-and-dependency-scanning",
    lesson: {
      summary: "Scan your dependencies, your images and your code on every change, and decide up front which findings block a release.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why you scan" },
        { type: "p", text: "Most of the code in a modern service is not yours. A typical Node or Java project pulls in hundreds of transitive packages, and the base image adds hundreds more operating system packages. When a flaw is published for any of them, you are exposed without having changed a line. Scanning compares the exact versions you ship against public vulnerability databases, so you hear about it before an attacker uses it." },
        { type: "h2", text: "Three layers to scan" },
        {
          type: "table",
          head: ["What", "Finds", "Example tools"],
          rows: [
            ["Dependencies", "Known CVEs in libraries from your lockfile", "`npm audit`, Dependabot, OWASP Dependency-Check, `trivy fs`"],
            ["Images", "CVEs in OS packages and bundled libraries", "Trivy, Docker Scout, ECR scanning"],
            ["Source and config", "Committed secrets, insecure Dockerfile or Terraform settings", "gitleaks, `trivy config`"],
          ],
        },
        { type: "p", text: "They overlap on purpose. A dependency scan sees your lockfile before the build. An image scan sees what actually shipped, including packages you never listed." },
        { type: "h2", text: "In a pipeline" },
        {
          type: "code",
          language: "yaml",
          title: ".github/workflows/security.yml",
          code: `name: security
on:
  pull_request:
  schedule:
    - cron: "0 3 * * 1"      # weekly, because new CVEs appear without new commits
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependencies
        run: npm audit --omit=dev --audit-level=high
      - name: Build image
        run: docker build -t app:scan .
      - name: Scan image
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
            aquasec/trivy image --severity HIGH,CRITICAL \\
            --ignore-unfixed --exit-code 1 app:scan`,
        },
        { type: "p", text: "Dependabot or Renovate complements this by opening pull requests that bump vulnerable packages, so the fix arrives as a reviewable change and not as a ticket nobody picks up." },
        { type: "h2", text: "Triage, not panic" },
        { type: "list", items: ["Decide a policy once: for example, fail on fixable high and critical findings, report the rest.", "Check reachability. A flaw in a function you never call is lower priority than one on your request path, but write down why.", "Fix by upgrading, or by switching to a smaller base image. Removing a package is the most reliable patch.", "Record accepted risks with an owner and a review date."] },
        { type: "callout", tone: "gotcha", title: "Noise kills the habit", text: "If the scan fails on dozens of low-severity issues nobody can fix, people stop reading it and start bypassing it. A scan that blocks only on actionable, serious findings is worth more than a stricter one that gets switched off." },
        { type: "p", text: "Common mistakes: scanning only once at release, scanning dev-only dependencies and treating them as production risk, and never rescanning images that are already running." },
      ],
      references: [
        { title: "Dependabot documentation (GitHub Docs)", url: "https://docs.github.com/en/code-security/dependabot" },
        { title: "OWASP Dependency-Check", url: "https://owasp.org/www-project-dependency-check/" },
        { title: "npm-audit (npm Docs)", url: "https://docs.npmjs.com/cli/commands/npm-audit" },
        { title: "Trivy: filesystem scanning", url: "https://trivy.dev/latest/docs/target/filesystem/" },
      ],
    },
    points: [
      { id: "devops.image-and-dependency-scanning.three-layers", title: "Scan dependencies, images and config", detail: "Lockfile scans catch library CVEs early. Image scans see OS packages that shipped. Config and secret scans catch mistakes that are not CVEs.", question: "What can an image scan find that a lockfile scan cannot?" },
      { id: "devops.image-and-dependency-scanning.schedule", title: "Rescan on a schedule", detail: "New vulnerabilities are published daily, so an unchanged image can become vulnerable. A weekly scan plus automated update pull requests keeps it current.", question: "Why run a scan even when nobody has pushed code?" },
      { id: "devops.image-and-dependency-scanning.policy", title: "Agree what blocks a release", detail: "Fail on fixable high and critical findings and report the rest. Record any accepted risk with an owner and a review date.", question: "What happens to a team's scan results if every finding blocks the build?" },
    ],
  },
};
