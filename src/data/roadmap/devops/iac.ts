import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "iac";

export const IAC_TERRAFORM_BASICS = withPoints("Terraform basics", [
  point(
    S,
    "what-is-iac",
    "What infrastructure as code is and why it matters",
    "Infrastructure as code describes servers, networks and services in versioned files instead of manual console clicks. It makes environments repeatable and reviewable through pull requests, and gives an audit trail and a way to rebuild after a disaster. It also removes snowflake servers that nobody can reproduce.",
    "What goes wrong when production was built by clicking in a console and someone must rebuild it?",
  ),
  point(
    S,
    "terraform-lifecycle",
    "Terraform providers, resources and the plan, apply, destroy lifecycle",
    "A provider is the plugin that talks to an API such as AWS, and a resource is one object it manages. terraform plan compares the configuration with the state and real infrastructure and shows what would change, apply makes those changes, and destroy removes everything the configuration manages. Reading the plan before apply is the main safety check.",
    "What does terraform plan compare, and why must you read it before apply?",
  ),
]);

export const IAC_STATE_AND_MODULES = withPoints("State and modules", [
  point(
    S,
    "terraform-state",
    "Terraform state and why it matters",
    "The state file maps each resource in the configuration to the real object it created, plus its attributes. Terraform uses it to compute plans and to know what to update or destroy, so losing or corrupting it breaks management of the infrastructure. State can contain secrets, so it must be stored securely and never committed to Git.",
    "What happens if two people run terraform apply against the same infrastructure from separate local state files?",
  ),
  point(
    S,
    "terraform-state-in-a-team",
    "Terraform state in a team: remote state and locking",
    "Teams keep state in a remote backend, such as an S3 bucket with versioning and encryption, so everyone shares one source of truth. A lock stops two applies from running at once. The older S3 setup used a DynamoDB table for locking, and recent Terraform versions can lock with a lock file in S3 itself, so check the current backend documentation.",
    "Why must the remote backend bucket have versioning and encryption turned on?",
  ),
  point(
    S,
    "terraform-modules",
    "Terraform modules",
    "A module is a folder of Terraform files used as a reusable unit, with input variables and outputs. The root configuration calls modules, for example a vpc module, once per environment with different inputs. Modules cut duplication and enforce a standard shape, and registry modules should be pinned to a version.",
    "How would you reuse one VPC definition for dev and prod with different CIDR ranges?",
  ),
  point(
    S,
    "terraform-drift",
    "Handling Terraform state drift",
    "Drift is when real infrastructure differs from state and configuration, typically because someone changed it by hand. terraform plan, or plan with refresh only, reveals it. Fix it by applying the configuration to revert the change, updating the code to accept it, or importing a resource that was created outside Terraform. Restricting console write access and running scheduled plans in CI prevents it recurring.",
    "A teammate edited a security group in the console. How do you detect it and bring things back to the code?",
  ),
]);

export const IAC_ENVIRONMENTS = withPoints("Environments and plan/apply in CI", [
  point(
    S,
    "terraform-multiple-environments",
    "Managing dev, staging and prod in Terraform",
    "Two common approaches are a separate directory or root module per environment with its own state, or workspaces that share the code and keep one state per workspace. Separate directories with their own backends give stronger isolation, especially for production, and shared modules avoid duplication. Variable files supply per-environment values such as sizes and counts.",
    "Why might a team prefer separate state per environment instead of one workspace switch for production?",
  ),
]);

export const IAC_GITOPS = withPoints("GitOps workflow", [
  point(
    S,
    "gitops",
    "GitOps, ArgoCD and Flux",
    "GitOps keeps the desired state of the system in Git and uses an agent in the cluster to continuously make reality match it. Changes happen through pull requests, and the agent, such as ArgoCD or Flux, pulls and applies them and reverts manual drift. This gives an audit trail, easy rollback by reverting a commit, and no cluster credentials stored in CI.",
    "How does a rollback work in a GitOps setup, and what stops someone from kubectl-editing production?",
  ),
]);

export const IAC_NEW_TOPICS: readonly RoadmapSubsection[] = [
  withPoints("Ansible: inventory, playbooks and roles", [
    point(
      S,
      "ansible-playbooks-roles",
      "Ansible inventory, playbooks and roles",
      "Ansible configures machines over SSH without an agent. The inventory lists the hosts, a playbook is a YAML file of tasks to run against groups of hosts, and a role packages related tasks, templates and defaults for reuse. Typical jobs are installing packages, deploying configuration and starting services.",
      "How would you structure Ansible to configure a web tier and a database tier?",
    ),
    point(
      S,
      "ansible-idempotency",
      "Idempotency in Ansible",
      "An idempotent task describes a desired state and can be run many times with the same result, changing something only if needed. Modules such as package or service check current state first and report changed or ok. Raw shell and command tasks are not idempotent unless you guard them with conditions, for example with creates or changed_when.",
      "Why is running a playbook twice safe with the apt module but risky with a raw shell command?",
    ),
  ]),
  withPoints("Terraform vs Ansible", [
    point(
      S,
      "terraform-vs-ansible",
      "Terraform vs Ansible",
      "Terraform is declarative and mainly provisions infrastructure such as networks, instances and databases, tracking what it created in state. Ansible mainly configures what runs on machines, such as packages and files, and is agentless with no state file. They are often combined: Terraform creates the servers, then Ansible configures them, though containers and Kubernetes reduce the need for server configuration.",
      "Which tool would you use to create an EC2 instance and which to install Docker on it, and why?",
    ),
  ]),
  "CloudFormation and Pulumi compared with Terraform",
  "Practice: Terraform an EC2 instance and VPC with remote state in S3, then configure it with Ansible",
].map((item) => (typeof item === "string" ? { title: item } : item));
