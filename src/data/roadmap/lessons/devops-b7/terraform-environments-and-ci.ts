import type { LessonEntry } from "@/types/roadmap";

export const TERRAFORM_ENVIRONMENTS_AND_CI: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "Environments and plan/apply in CI",
    slug: "terraform-environments-and-ci",
    lesson: {
      summary: "Keep dev, staging and prod separate with their own state, and run plan on pull requests and apply on merge.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why environments need their own state" },
        { type: "p", text: "Dev, staging and prod should be built from the same code with different inputs. They must not share one state file: a mistake while testing in dev would then be one command away from prod. The goal is the same shape everywhere, a small blast radius for each environment, and promotion by changing a value, not rewriting code." },
        { type: "h2", text: "Three ways to split them" },
        { type: "table", head: ["Approach", "How it works", "Trade-off"], rows: [["Workspaces", "One configuration, several named states in the same backend (`terraform workspace new staging`).", "Easy to start, but all environments share one backend and credentials, and the active workspace is easy to forget."], ["Folder per environment", "`envs/dev`, `envs/prod`, each with its own backend key and `tfvars`, all calling shared modules.", "More files, but each state is explicit and can have its own access rules. The most common choice."], ["Separate accounts", "Each environment lives in its own AWS account, with its own state bucket.", "Strongest isolation and cost separation, at the price of more setup."]] },
        { type: "p", text: "A layout many teams use puts reusable code in `modules/` and a thin folder per environment on top." },
        {
          type: "code",
          language: "text",
          code: `infra/
  modules/
    network/
    app/
  envs/
    dev/
      main.tf
      backend.tf      # key = "dev/terraform.tfstate"
      dev.tfvars
    prod/
      main.tf
      backend.tf      # key = "prod/terraform.tfstate"
      prod.tfvars`,
        },
        { type: "h2", text: "Plan and apply in CI" },
        { type: "p", text: "Running apply from laptops means the result depends on who ran it, with which provider versions and which credentials. Move it to a pipeline. The common pattern: **plan on every pull request** so reviewers see the diff, and **apply on merge** to the main branch, with an approval step for prod." },
        {
          type: "code",
          language: "yaml",
          title: ".github/workflows/terraform.yml",
          code: `name: terraform
on:
  pull_request:
    paths: ["infra/**"]
  push:
    branches: [main]
    paths: ["infra/**"]

permissions:
  id-token: write   # OIDC to AWS, no stored keys
  contents: read

jobs:
  terraform:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: infra/envs/dev
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111122223333:role/terraform-ci
          aws-region: ap-south-1
      - run: terraform init -input=false
      - run: terraform fmt -check
      - run: terraform validate
      - run: terraform plan -input=false -out=tfplan
      - if: github.ref == 'refs/heads/main'
        run: terraform apply -input=false tfplan`,
        },
        { type: "p", text: "Applying the saved `tfplan` file guarantees that what runs is exactly what was planned in that job. In a stricter setup you save the plan from the pull request as an artifact and apply that same file after merge." },
        { type: "callout", tone: "gotcha", title: "A plan can go stale", text: "If the world changes between plan and apply, a saved plan is rejected. If you re-plan at apply time instead, the second plan may differ from what the reviewer approved. Decide which behaviour you want, and keep one apply at a time per state with locking." },
        { type: "h2", text: "Credentials and guardrails" },
        { type: "list", items: ["Give CI a role through OIDC federation instead of long-lived access keys in repository secrets.", "Use a narrower role for dev than for prod, and require a manual approval (a protected GitHub environment) before the prod apply.", "Never print sensitive outputs in logs, and remember that plan files can contain secrets, so do not upload them publicly.", "Run `terraform plan` on a schedule too, so drift shows up as a failed job."] },
        { type: "p", text: "Start with dev applying automatically and prod gated. Once the team trusts the plan output, tighten from there." },
      ],
      references: [
        { title: "Workspaces (Terraform CLI documentation)", url: "https://developer.hashicorp.com/terraform/language/state/workspaces" },
        { title: "Automate Terraform with GitHub Actions (HashiCorp tutorial)", url: "https://developer.hashicorp.com/terraform/tutorials/automation/github-actions" },
        { title: "Standard module structure (Terraform documentation)", url: "https://developer.hashicorp.com/terraform/language/modules/develop/structure" },
      ],
    },
  },
};
