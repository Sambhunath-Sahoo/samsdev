import type { RoadmapSubsection } from "@/types/roadmap";

export const BUDGETS_AND_COST_ALERTS: RoadmapSubsection = {
  title: "Budgets and cost alerts",
  slug: "budgets-and-cost-alerts",
  lesson: {
    summary: "Set an alarm before you create anything, estimate what a study session costs, and choose between stopping and terminating a server.",
    minutes: 8,
    blocks: [
      { type: "h2", text: "Set the alarm first" },
      { type: "p", text: "AWS bills for what runs, not for what you meant to run. A forgotten instance is the classic surprise. Create a budget before launching anything, so an email arrives while the amount is still small." },
      {
        type: "list",
        ordered: true,
        items: [
          "Billing → **Budgets** → **Create budget**.",
          "Choose the **Monthly cost budget** template and enter an amount (a few dollars for learning).",
          "Add your email for alerts and create it.",
          "Check the alert level: 80% or 100% of the budget is useful. The first-cent \"zero-spend\" alert is noisy but harmless.",
        ],
      },
      { type: "p", text: "A budget alerts you, it does not stop spending. Treat it as a smoke detector, not a sprinkler." },
      { type: "h2", text: "What a study session costs" },
      { type: "p", text: "These are rough ap-south-1 prices from memory. Check the AWS pricing pages and the Billing console for the real numbers before relying on them." },
      {
        type: "table",
        head: ["Item", "Rate", "2 hours a day for a month"],
        rows: [
          ["`t3.micro` instance", "about $0.0108 per hour, only while running", "about $0.65"],
          ["Public IPv4 address", "$0.005 per hour, only while running", "about $0.30"],
          ["20 GB gp3 disk", "about $0.09 per GB-month, even when stopped", "about $1.80"],
          ["ECR image (83 MB)", "about $0.10 per GB-month", "about $0.01"],
          ["**Total, stopped each day**", "", "**about $3**"],
        ],
      },
      { type: "h2", text: "Stop or terminate" },
      {
        type: "table",
        head: ["", "Stop", "Terminate"],
        rows: [
          ["Compute and IP charges", "none while stopped", "none"],
          ["Disk", "kept and billed (about 6 cents a day for 20 GB)", "deleted"],
          ["Next session", "start it, new public IP, edit the proxy hostname (about 2 minutes)", "rebuild from scratch (about 15 minutes by hand)"],
          ["Good when", "you return within days", "you are done for a while, or rebuilding with Terraform"],
        ],
      },
      { type: "callout", tone: "cost", title: "Left running all month", text: "The same instance running 24 hours a day costs roughly $13 a month, four times the stopped-daily figure. A phone reminder to stop it at night pays for itself." },
      { type: "h2", text: "What to leave on, and what to watch" },
      {
        type: "list",
        items: [
          "Fine to leave: the budget, MFA, the IAM role, the security group, a key pair and a small ECR repository.",
          "Watch carefully: an allocated Elastic IP with nothing attached, NAT gateways (about $0.045 per hour), load balancers and EKS control planes (about $0.10 per hour).",
          "Always confirm cleanup with a read-only check, for example `aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name]' --output text`.",
        ],
      },
      { type: "callout", tone: "tip", title: "Automation makes terminating cheap", text: "When one command builds the server and another removes it, you can terminate every night and keep the monthly cost near $1. That is the point of Terraform later in the roadmap." },
    ],
    references: [
      { title: "AWS docs: Managing your costs with AWS Budgets", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html" },
      { title: "AWS docs: What is AWS Cost Explorer?", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html" },
      { title: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
    ],
  },
  points: [
    {
      id: "devops.cloud.cost.budget-first",
      title: "Create a budget before any resource",
      detail: "A monthly cost budget emails you at a threshold. It warns, it does not stop anything from running.",
      question: "What does a budget alert not do when you cross the limit?",
    },
    {
      id: "devops.cloud.cost.what-bills",
      title: "What bills while a server runs, and what keeps billing when stopped",
      detail: "Compute and the public IPv4 address bill only while running. Disks and allocated Elastic IPs bill even when nothing is running.",
      question: "You stop an instance. Which charges stop, and which continue?",
    },
    {
      id: "devops.cloud.cost.stop-vs-terminate",
      title: "Stop vs terminate",
      detail: "Stopping keeps the disk, so a restart is fast but costs a little each day. Terminating deletes everything and costs nothing, but you rebuild next time.",
      question: "You will be back tomorrow. Which do you choose, and what must you fix after starting?",
    },
    {
      id: "devops.cloud.cost.verify-cleanup",
      title: "Verify cleanup with a read-only check",
      detail: "Look at instances, volumes, Elastic IPs, load balancers and NAT gateways in the region you used. Do not trust that a click worked.",
      question: "Which CLI command lists instance ids and their states?",
    },
  ],
};
