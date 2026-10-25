import type { LessonEntry } from "@/types/roadmap";

export const SECRETS_IN_PIPELINES: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Secrets in pipelines",
    slug: "secrets-in-pipelines",
    lesson: {
      summary: "Where pipeline credentials live, how they leak, and why short-lived cloud credentials beat stored keys.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Handling secrets in a CI/CD pipeline" },
        { type: "p", text: "A pipeline needs credentials to push images, deploy and call APIs. That makes the CI system one of the most valuable targets you have: whoever can run code in your pipeline can usually read what the pipeline can read. Treat secret handling as a design problem, not a settings page." },
        { type: "h2", text: "Where secrets belong" },
        { type: "list", items: ["In the CI system's secret store (GitHub repository, environment or organization secrets), or in a manager such as AWS Secrets Manager that the pipeline reads at run time.", "Never in the repository, not even in a private one, and not in a `Dockerfile` as `ENV` or `ARG`: those values stay in image layers and history.", "Scoped to the narrowest level: an environment secret for production is only available to jobs that target that environment, which can require approval."] },
        { type: "h2", text: "Prefer short-lived credentials" },
        { type: "p", text: "A long-lived access key stored in CI is a standing risk: it works from anywhere until someone rotates it. OpenID Connect (OIDC) replaces it. The CI provider issues a signed token for each job, the cloud provider verifies it against a trust policy you wrote (this repo, this branch), and returns temporary credentials that expire in about an hour. Nothing durable is stored." },
        { type: "code", language: "yaml", title: "GitHub Actions to AWS with OIDC", code: `permissions:
  id-token: write   # allow the job to request an OIDC token
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy
          aws-region: ap-south-1
      - run: aws sts get-caller-identity` },
        { type: "p", text: "The IAM role's trust policy should name the exact repository and, for production, the branch or environment. A trust policy that accepts any repository in your organization is a common mistake." },
        { type: "h2", text: "How secrets leak" },
        { type: "list", items: ["`echo` or `set -x` printing a variable, or a tool in debug mode printing request headers.", "Values transformed before printing, so masking no longer matches.", "Third-party actions or build scripts that run with your secrets. Pin them and review what they do.", "Pull request workflows that run untrusted code with secrets available.", "Secrets baked into a build argument and shipped inside an image."] },
        { type: "callout", tone: "gotcha", title: "If it was committed, it is burned", text: "Deleting a leaked key from the latest commit does not help: it remains in git history and may already be scraped. Revoke and rotate it first, then clean up." },
        { type: "p", text: "Rotate on a schedule, give each pipeline its own credential with only the permissions it uses (the same least-privilege idea as IAM roles), and turn on secret scanning so a push containing a key is flagged." },
      ],
      references: [
        { title: "Using secrets in GitHub Actions", url: "https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/using-secrets-in-github-actions" },
        { title: "Secure use reference (GitHub Actions)", url: "https://docs.github.com/en/actions/reference/security/secure-use" },
        { title: "OWASP Top 10 CI/CD Security Risks", url: "https://owasp.org/www-project-top-10-ci-cd-security-risks/" },
        { title: "The Twelve-Factor App: Config", url: "https://12factor.net/config" },
      ],
    },
  },
};
