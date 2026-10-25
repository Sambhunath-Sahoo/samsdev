import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "cicd";

/** Replaces the plain "CI, continuous delivery, continuous deployment" entry (same title). */
export const CI_CD_DEFINITIONS: RoadmapSubsection = withPoints("CI, continuous delivery, continuous deployment", [
  point(
    S,
    "ci-vs-cd",
    "CI vs CD",
    "Continuous integration means merging small changes into the shared branch often, with each change automatically built and tested. Continuous delivery extends that so every passing build is a releasable artifact that can go to production at any time. CI answers whether the change works, and CD answers whether it can ship.",
    "What does a team have today if it runs tests on every commit but deploys by hand once a month?",
  ),
  point(
    S,
    "delivery-vs-deployment",
    "Continuous delivery vs continuous deployment",
    "In continuous delivery the pipeline prepares a production-ready release but a human decides when to push the button. In continuous deployment there is no manual gate, and every change that passes all checks goes live automatically. Continuous deployment needs strong tests, monitoring and fast rollback to be safe.",
    "What would you need in place before removing the manual approval before production?",
  ),
  point(
    S,
    "build-vs-release-pipeline",
    "Deployment pipeline vs release pipeline",
    "The term is used loosely. A common split is that the build (CI) pipeline compiles, tests and produces one versioned artifact, while the release or deployment pipeline promotes that same artifact through environments with approvals and checks. Building once and promoting the identical artifact is the important rule, since rebuilding per environment breaks the guarantee that what you tested is what you ship.",
    "Why build the image once and promote it, rather than rebuilding for staging and production?",
  ),
]);

/** Replaces the plain deployment strategies entry (same title). */
export const DEPLOYMENT_STRATEGIES: RoadmapSubsection = withPoints("Deployment strategies: rolling, blue-green, canary, rollback", [
  point(
    S,
    "blue-green-vs-canary",
    "Blue-green vs canary deployment",
    "Blue-green runs two full environments: traffic switches from the old (blue) to the new (green) all at once, and switching back is the rollback. Canary sends a small share of real traffic to the new version first and widens it as metrics stay healthy. Blue-green gives an instant, simple cutover at the price of double capacity, while canary limits the blast radius of a bad release.",
    "A release has a subtle bug that only shows under real traffic. Which strategy limits the damage, and why?",
  ),
  point(
    S,
    "zero-downtime-deployments",
    "Zero-downtime deployments",
    "Use rolling, blue-green or canary releases so the old version keeps serving while the new one starts, and only route traffic to instances that pass readiness checks. Drain connections from instances being stopped, and keep database changes backward compatible so old and new code can run together. Without the last step even a perfect rollout can break requests.",
    "During a rolling deploy, old and new code run together. What does that require of the database schema?",
  ),
  point(
    S,
    "pipeline-rollback",
    "Rolling back in a pipeline",
    "Because every build produces an immutable, uniquely tagged artifact, the simplest rollback is to redeploy the previous tag, either by re-running the pipeline or with a one-click job. On Kubernetes, kubectl rollout undo returns to the previous ReplicaSet, and with blue-green you switch traffic back. Rollback is only easy when database changes are backward compatible, otherwise you roll forward with a fix.",
    "Your deploy is bad and its migration already dropped a column. Why is a plain rollback no longer enough?",
  ),
  point(
    S,
    "feature-flags",
    "Feature flags",
    "A feature flag is a runtime switch that turns code paths on or off without a deploy, so shipping code and releasing a feature become separate decisions. It enables dark launches, gradual percentage rollouts, per-customer access and an instant kill switch. Flags need an owner and a removal date, because old flags become tangled dead code.",
    "How does a feature flag reduce the risk of deploying on a Friday afternoon?",
  ),
  point(
    S,
    "database-migrations-in-pipeline",
    "Database migrations in a pipeline",
    "Keep migrations as versioned scripts in the repository, run by a tool such as Flyway or Liquibase, and apply them as an explicit pipeline step before the new code goes live. Make each change backward compatible with the expand and contract pattern: add the new column, deploy code that uses both, backfill, then drop the old one later. Test migrations on a copy of production-like data first.",
    "How would you rename a column with zero downtime across three deploys?",
  ),
]);

export const CICD_PIPELINE_ENTRIES: readonly RoadmapSubsection[] = [
  withPoints("Pipeline stages: build, test, lint, scan, deploy", [
    point(
      S,
      "pipeline-stages",
      "Pipeline stages",
      "A typical pipeline runs fast checks first: lint and unit tests, then build the artifact, then slower integration tests and security scans such as dependency and image scanning, and finally deploy. Ordering stages from cheap to expensive gives fast failure feedback and saves runner time. Each stage should be deterministic and fail the pipeline on error.",
      "Why run lint before the Docker build and integration tests instead of after?",
    ),
  ]),
  withPoints("Secrets in pipelines", [
    point(
      S,
      "pipeline-secrets",
      "Handling secrets in a CI/CD pipeline",
      "Keep secrets out of the repository and store them in the CI platform's secret store or an external manager, scoped to the environment that needs them and masked in logs. Prefer short-lived credentials from OIDC federation to the cloud provider over long-lived access keys. Limit which branches and forks can read production secrets, and rotate them on any suspicion of leakage.",
      "How can a GitHub Actions job deploy to AWS without a stored access key?",
    ),
  ]),
  withPoints("Runners: self-hosted vs managed", [
    point(
      S,
      "self-hosted-vs-managed-runners",
      "Self-hosted vs managed CI runners",
      "Managed runners are provided and patched by the CI vendor, start clean for every job and need no maintenance, but have fixed hardware and cannot reach private networks. Self-hosted runners run on your own machines, so you control hardware, caching and network access, but you must secure, patch and scale them. Never run untrusted pull request code on a persistent self-hosted runner.",
      "Why is running pull requests from forks on a self-hosted runner a security risk?",
    ),
  ]),
  "Artifacts and caching in pipelines",
  "Environment promotion: dev, staging, prod with a manual approval gate",
  "Pipeline as code",
  withPoints("Other CI tools: Jenkins, GitLab CI, CircleCI", [
    point(
      S,
      "jenkins-gitlab-ci-compared",
      "Jenkins and GitLab CI compared with GitHub Actions",
      "Jenkins is a self-hosted automation server configured with a Jenkinsfile and extended by plugins, which gives flexibility but needs maintenance. GitLab CI is built into GitLab and is defined in a .gitlab-ci.yml file with stages and jobs run by GitLab runners. GitHub Actions and CircleCI are also YAML pipelines as code. The concepts of triggers, jobs, runners, artifacts and secrets carry across all of them.",
      "What would make you choose Jenkins over a hosted CI service, and what would it cost you?",
    ),
  ]),
].map((item) => (typeof item === "string" ? { title: item } : item));
