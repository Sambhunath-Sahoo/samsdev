import type { LessonEntry } from "@/types/roadmap";

export const TERRAFORM_STATE_AND_MODULES: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "State and modules",
    slug: "terraform-state-and-modules",
    lesson: {
      summary: "Understand what Terraform state records, share it safely with a remote backend, reuse code with modules and deal with drift.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What state is and why it matters" },
        { type: "p", text: "The state file is Terraform's record of what it created. It maps each resource block in your code to a real object (an instance ID, a bucket name) and stores that object's attributes. On every plan, Terraform reads the state, refreshes it from the real API, and diffs it against your configuration." },
        { type: "p", text: "Lose the state and Terraform no longer knows it owns anything: the next apply tries to create everything again. State also often contains sensitive values such as database passwords in plain text. Treat it like a secret and never commit it to Git." },
        { type: "h2", text: "Remote state and locking" },
        { type: "p", text: "By default the state is a local `terraform.tfstate` file. That fails as soon as there are two people or a CI pipeline, because each would have a different copy. A **remote backend** stores one shared copy. On AWS this is usually an S3 bucket with versioning and encryption on." },
        {
          type: "code",
          language: "hcl",
          title: "backend.tf",
          code: `terraform {
  backend "s3" {
    bucket       = "myapp-tfstate-111122223333"
    key          = "prod/network/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}`,
        },
        { type: "p", text: "**Locking** stops two applies from writing state at once. Older S3 setups used a DynamoDB table for this (`dynamodb_table`). Recent Terraform versions can lock with a lock file stored in the bucket itself via `use_lockfile`, and the DynamoDB option is being phased out. Check the backend page for the version you run." },
        { type: "callout", tone: "gotcha", title: "The bucket is the one thing you create by hand", text: "The state bucket cannot be managed by the configuration that stores its state in it. Create it once with the CLI or a tiny separate configuration, turn on versioning, block public access, and restrict who can read it." },
        { type: "h2", text: "Modules" },
        { type: "p", text: "A **module** is a folder of `.tf` files used as one unit, with input variables and outputs. Every configuration is already a module, called the root module. You call child modules to avoid copy and paste." },
        {
          type: "code",
          language: "hcl",
          code: `module "network" {
  source = "./modules/network"
  cidr   = "10.0.0.0/16"
  name   = "prod"
}

module "vpc_from_registry" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"
}

# read an output of a module:
#   module.network.vpc_id`,
        },
        { type: "p", text: "Keep modules small and focused (one network, one database), expose only the inputs people need, and pin registry modules to an exact or tightly bounded version so an update does not change your plan unexpectedly." },
        { type: "h2", text: "Handling drift" },
        { type: "p", text: "**Drift** is when real infrastructure no longer matches state and code, usually because someone changed it in the console. A plain `terraform plan` refreshes and shows the difference. `terraform plan -refresh-only` shows only the drift, without proposing code-driven changes." },
        { type: "list", items: ["**Revert it**: run apply and let Terraform put the setting back.", "**Accept it**: edit the code to match the new reality, then plan should be empty.", "**Import it**: for a resource created outside Terraform, write the resource block and bring it under management with `terraform import` or an `import` block."] },
        {
          type: "code",
          language: "bash",
          code: `terraform plan -refresh-only
terraform state list
terraform import aws_s3_bucket.assets myapp-assets-111122223333`,
        },
        { type: "callout", tone: "tip", title: "Prevent drift, do not just fix it", text: "Remove console write access for people who do not need it, and run a scheduled `terraform plan` in CI that alerts when it is not empty." },
        { type: "p", text: "Avoid editing the state by hand. If you must move or remove something, use `terraform state mv` and `terraform state rm`, and take a copy of the state first." },
      ],
      references: [
        { title: "State (Terraform language documentation)", url: "https://developer.hashicorp.com/terraform/language/state" },
        { title: "S3 backend (Terraform documentation)", url: "https://developer.hashicorp.com/terraform/language/backend/s3" },
        { title: "Modules (Terraform language documentation)", url: "https://developer.hashicorp.com/terraform/language/modules" },
        { title: "Import existing resources (Terraform CLI documentation)", url: "https://developer.hashicorp.com/terraform/cli/import" },
      ],
    },
  },
};
