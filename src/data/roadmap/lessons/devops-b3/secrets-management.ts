import type { LessonEntry } from "@/types/roadmap";

export const SECRETS_MANAGEMENT: LessonEntry = {
  track: "devops",
  section: "Security and reliability practice",
  subsection: {
    title: "Secrets management",
    slug: "secrets-management",
    lesson: {
      summary: "Keep passwords and tokens out of code, images and logs, give each environment its own, and be ready to rotate them.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What counts as a secret" },
        { type: "p", text: "A secret is any value that grants access: database passwords, API keys, signing keys, OAuth client secrets, deploy tokens, private TLS keys. The rule is simple. A secret must not live in source control, in a Docker image, or in a log, because all three get copied, cached and shared far beyond the people who should have it." },
        { type: "h2", text: "Where secrets leak" },
        { type: "list", items: ["**Git history.** Deleting a committed `.env` in the next commit does nothing. The value is still in history and in every clone.", "**Image layers.** `ENV API_KEY=...` or a `COPY .env` bakes the value into a layer that anyone who can pull the image can read with `docker history` or by unpacking it.", "**Build args.** `ARG` values are recorded in image history too. Never pass a real secret as one.", "**Logs and error pages.** Printing config at startup, or a stack trace that includes a connection string.", "**CI output.** `echo` of a variable, or `set -x` in a shell step."] },
        { type: "h2", text: "Where they should live" },
        { type: "p", text: "Inject the secret at run time from something outside the code, and give the minimum number of people and services read access." },
        {
          type: "table",
          head: ["Stage", "Typical home"],
          rows: [
            ["Local development", "An uncommitted `.env` file, with a committed `.env.example` listing the names only"],
            ["CI/CD", "The platform's secret store (for example GitHub Actions secrets), scoped per environment"],
            ["Running servers", "A secrets manager, or the platform's own store, read by the app's identity"],
          ],
        },
        {
          type: "code",
          language: "bash",
          title: ".gitignore and a pre-commit scan",
          code: `# .gitignore
.env
.env.*
!.env.example

# catch mistakes before they leave your machine
gitleaks detect --source . --redact`,
        },
        { type: "h2", text: "Rotation and scope" },
        { type: "p", text: "Assume every secret will leak eventually, and make that cheap to handle. Use a different value per environment, so a leaked staging key does not open production. Give each service its own credential, so you can revoke one without breaking others. Prefer short-lived credentials (cloud roles, tokens that expire) over long-lived keys wherever the platform supports it. Know the steps to rotate each secret before you need to." },
        { type: "callout", tone: "gotcha", title: "If it was committed, it is burned", text: "When a secret reaches a remote repository, even a private one, treat it as compromised. **Rotate it first**, then clean up history if you want to. Rewriting history without rotating leaves the value valid in anyone's old clone, in forks and in cached CI checkouts." },
        { type: "p", text: "Common mistakes: one shared admin password for everything, putting secrets in `NEXT_PUBLIC_` style variables that are shipped to the browser by design, and relying on a private repository as the only protection." },
      ],
      references: [
        { title: "Secrets Management Cheat Sheet (OWASP)", url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" },
        { title: "Using secrets in GitHub Actions", url: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions" },
        { title: "The Twelve-Factor App: Config", url: "https://12factor.net/config" },
        { title: "Manage secrets in Docker Compose", url: "https://docs.docker.com/compose/how-tos/use-secrets/" },
      ],
    },
    points: [
      { id: "devops.secrets-management.never-in-git-or-image", title: "Not in git, not in an image", detail: "Committed values stay in history, and values in `ENV`, `ARG` or `COPY .env` stay in image layers. Both are readable by anyone with access to the repo or image.", question: "Why does deleting a committed .env file not remove the secret?" },
      { id: "devops.secrets-management.inject-at-runtime", title: "Inject at run time", detail: "Provide secrets when the container or process starts, from a store the app is allowed to read, rather than building them in.", question: "Where would the database password come from for a container running on a server?" },
      { id: "devops.secrets-management.rotate-and-scope", title: "Per-environment, per-service, rotatable", detail: "Separate values per environment and per service limit the damage of one leak. Know how to rotate each one before an incident.", question: "What is the first step when a secret has been pushed to a remote repository?" },
    ],
  },
};
