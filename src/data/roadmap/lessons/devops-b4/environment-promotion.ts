import type { LessonEntry } from "@/types/roadmap";

export const ENVIRONMENT_PROMOTION: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Environment promotion: dev, staging, prod with a manual approval gate",
    slug: "environment-promotion",
    lesson: {
      summary: "Move one built artifact through dev, staging and production, with per-environment settings and a human approval before production.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Promote the artifact, not the code" },
        { type: "p", text: "Environments exist to catch problems at increasing cost: dev is cheap and breakable, staging mirrors production closely, production is real users. Promotion means taking the same image that passed in one environment and deploying it to the next. You do not rebuild, because a rebuild is a different artifact that merely came from the same source." },
        { type: "p", text: "Whatever differs between environments (database URL, API keys, feature switches) must come from configuration injected at deploy time, never from the image. If the image contains a staging URL, it cannot be promoted." },
        { type: "h2", text: "Environments in GitHub Actions" },
        { type: "p", text: "GitHub has a first-class `environment`. Each one can hold its own secrets and variables, restrict which branches may deploy to it, and require **reviewers**: a job targeting that environment pauses until a listed person approves." },
        { type: "code", language: "yaml", title: "dev -> staging -> prod with an approval gate", code: `jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      tag: \${{ steps.vars.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: vars
        run: echo "tag=\${GITHUB_SHA::7}" >> "$GITHUB_OUTPUT"
      - run: echo "build and push myapp:\${GITHUB_SHA::7}"

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: echo "deploy \${{ needs.build.outputs.tag }} to staging"
      - run: echo "run smoke tests"

  deploy-prod:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    environment: production   # configured with required reviewers
    steps:
      - run: echo "deploy \${{ needs.build.outputs.tag }} to production"` },
        { type: "p", text: "The approval rule lives in the repository's environment settings, not in the YAML. When `deploy-prod` is reached, the run waits for a reviewer. Secrets scoped to `production` are not released until the approval happens." },
        { type: "h2", text: "What a gate is for" },
        { type: "list", items: ["Staging runs smoke tests automatically; the gate is for a human to look at results and the clock (no Friday-evening deploys).", "Keep the approver list short and real. A gate everyone clicks through blindly is theatre.", "Add a wait timer or a deployment-branch rule so only `main` can reach production.", "Make the approval time-bounded. A run waiting for days drifts away from the code that is now on main."] },
        { type: "callout", tone: "gotcha", title: "Staging that does not match production", text: "Staging only protects you if it resembles production: same image, same database engine and version, same proxy and environment variable names. Most \"works in staging\" incidents come from a quiet difference, such as a smaller dataset or a missing environment variable." },
      ],
      references: [
        { title: "Managing environments for deployment (GitHub Docs)", url: "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments" },
        { title: "Deployments and environments reference", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments" },
        { title: "Streamlining change approval (Google Cloud)", url: "https://cloud.google.com/architecture/devops/devops-process-streamlining-change-approval" },
        { title: "Deployment Pipeline (Martin Fowler)", url: "https://martinfowler.com/bliki/DeploymentPipeline.html" },
      ],
    },
    points: [
      { id: "devops.environment-promotion.same-artifact", title: "Promote the same artifact", detail: "Build the image once and deploy that identical image to each environment. Rebuilding gives you an untested artifact.", question: "Why can an image that contains the staging API URL not be promoted to production?" },
      { id: "devops.environment-promotion.config-at-deploy", title: "Configuration comes at deploy time", detail: "Database URLs, keys and flags differ per environment and are injected when deploying, through environment variables or secrets scoped to that environment.", question: "Where should the production database URL live?" },
      { id: "devops.environment-promotion.approval-gate", title: "Manual approval before production", detail: "A GitHub environment with required reviewers pauses the job until someone approves, and withholds that environment's secrets until then.", question: "What does a required reviewer on the `production` environment actually block?" },
      { id: "devops.environment-promotion.staging-parity", title: "Staging must resemble production", detail: "Same image, database version and configuration names make staging results meaningful. Differences hide bugs until production.", question: "Name two differences that make a staging pass meaningless." },
    ],
  },
};
