import type { LessonEntry } from "@/types/roadmap";

export const TERRAFORM_BASICS: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "Terraform basics",
    slug: "terraform-basics",
    lesson: {
      summary: "Describe infrastructure in files, then let Terraform plan, apply and destroy it through a provider.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What infrastructure as code is" },
        { type: "p", text: "Infrastructure as code (IaC) means servers, networks and databases are defined in text files instead of being clicked together in a console. The files live in Git, so changes go through review, have history, and can be repeated exactly. Clicking in a console works once. Six months later nobody remembers which boxes were ticked, and a second environment never quite matches the first." },
        { type: "p", text: "Terraform is the most common IaC tool. You write **declarative** configuration in HCL: you describe the end state you want, not the steps to reach it. Terraform works out the steps." },
        { type: "h2", text: "Providers and resources" },
        { type: "p", text: "A **provider** is a plugin that knows how to talk to one API, such as AWS, Cloudflare or Kubernetes. A **resource** is one object that provider manages, such as an EC2 instance or a security group. Each resource has a type, a local name and arguments." },
        {
          type: "code",
          language: "hcl",
          title: "main.tf",
          code: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "assets" {
  bucket = "myapp-assets-111122223333"
}

output "bucket_arn" {
  value = aws_s3_bucket.assets.arn
}`,
        },
        { type: "p", text: "`aws_s3_bucket.assets` is how other resources refer to this one. When one resource uses another's attribute, Terraform builds a dependency graph from those references and creates things in the right order." },
        { type: "h2", text: "The lifecycle: init, plan, apply, destroy" },
        {
          type: "code",
          language: "bash",
          code: `terraform init      # download providers, set up the backend
terraform fmt       # format the files
terraform validate  # catch syntax and type errors
terraform plan      # show what would change
terraform apply     # make the changes (asks for yes)
terraform destroy   # remove everything this configuration manages`,
        },
        { type: "list", items: ["`init` downloads the provider plugins and prepares where state is stored. Run it again after adding a provider or module.", "`plan` compares your configuration with the **state** and with the real objects, then prints a diff: `+` create, `-` destroy, `~` change in place, `-/+` replace.", "`apply` runs the plan. Without a saved plan file it shows the plan again and asks for confirmation.", "`destroy` plans the removal of every resource in the configuration. It is the same as an apply of an empty configuration."] },
        { type: "p", text: "Reading the plan is the whole safety mechanism. Look for `-/+` (replace) on anything that holds data, such as a database or a disk. Replacing destroys the old object first or after the new one exists, depending on the resource, and the data does not come along." },
        { type: "callout", tone: "gotcha", title: "Replace is not update", text: "Changing some arguments, like an instance's `ami` or a database's name, cannot be done in place, so Terraform plans a replacement. A one-line diff in your code can mean a deleted database. Always read the summary line: `Plan: 1 to add, 0 to change, 1 to destroy`." },
        { type: "h2", text: "Variables and outputs" },
        { type: "p", text: "Hard-coded values make a configuration single-use. Declare **input variables** for the parts that vary, and **outputs** for values you need afterwards, like an IP address." },
        {
          type: "code",
          language: "hcl",
          code: `variable "instance_type" {
  type        = string
  default     = "t3.micro"
  description = "EC2 size"
}

# use it as var.instance_type; override with:
#   terraform apply -var="instance_type=t3.small"`,
        },
        { type: "callout", tone: "tip", title: "Pin the provider", text: "Commit `.terraform.lock.hcl` and constrain provider versions. Otherwise a new provider release can change a plan between two people's machines. Do not commit the `.terraform/` folder or any `.tfstate` file." },
        { type: "h2", text: "Common mistakes" },
        { type: "list", items: ["Applying without reading the plan, or auto-approving in a shell on a real account.", "Editing resources in the console and not telling the code (see drift in the next lesson).", "Committing secrets in `.tfvars` files or state to Git.", "Putting everything in one giant file with no variables, so the second environment means copy and paste."] },
        { type: "p", text: "Remember that `destroy` is real. Try it on a small account first, and keep a budget alert on while you learn." },
      ],
      references: [
        { title: "What is Terraform? (HashiCorp Terraform documentation)", url: "https://developer.hashicorp.com/terraform/intro" },
        { title: "Resources (Terraform language documentation)", url: "https://developer.hashicorp.com/terraform/language/resources" },
        { title: "terraform plan command reference", url: "https://developer.hashicorp.com/terraform/cli/commands/plan" },
        { title: "AWS provider documentation (Terraform Registry)", url: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs" },
      ],
    },
  },
};
