import type { RoadmapTrack } from "@/types/roadmap";
import { outline } from "./outline";

export const DEVOPS: RoadmapTrack = {
  id: "devops",
  title: "DevOps",
  description: "From the Linux shell to Kubernetes, Terraform and observability, building one app up as you go.",
  hue: "blue",
  sections: [
    outline("Linux and shell", "Work comfortably on a server.", [
      "Filesystem and permissions",
      "Processes and services: ps, systemctl, journalctl",
      "Text tools and pipes: grep, sed, awk",
      "Bash scripting",
      "Cron, ssh and remote work",
    ]),
    outline("Networking for ops", "Debug anything between a browser and a server.", [
      "HTTP and curl",
      "DNS and IP",
      "TCP, UDP and ports",
      "TLS and certificates",
      "Firewalls and reverse proxies",
    ]),
    outline("Git and collaboration", "Ship changes through reviewed pull requests.", [
      "Branching and pull requests",
      "Merge vs rebase and conflicts",
      "Protected main and hooks",
      "Tags and releases",
    ]),
    outline("Containers", "Package an app so it runs the same everywhere.", [
      "Images vs containers",
      "Dockerfile and build cache",
      "Volumes, networks and secrets",
      "Docker Compose",
      "Registries and image scanning",
    ]),
    outline("CI/CD", "Every merge is tested, built and deployable.", [
      "CI, continuous delivery, continuous deployment",
      "GitHub Actions: workflows, jobs, runners, secrets",
      "Image tagging and releases",
      "Deployment strategies: rolling, blue-green, canary, rollback",
    ]),
    outline("Cloud (AWS)", "Run the app on real infrastructure without leaking money or keys.", [
      "IAM and least privilege",
      "Compute: EC2, ECS Fargate",
      "Networking: VPC, subnets, gateways",
      "Data: RDS",
      "Load balancing and autoscaling",
      "Budgets and cost alerts",
    ]),
    outline("Kubernetes", "Run and heal containers across a cluster.", [
      "Architecture: control plane and nodes",
      "Workloads: Pods, ReplicaSets, Deployments",
      "Services and Ingress",
      "Config and secrets",
      "Probes, rollouts and autoscaling",
      "Helm and debugging",
    ]),
    outline("Infrastructure as code and GitOps", "Infrastructure that lives in Git and deploys from a pipeline.", [
      "Terraform basics",
      "State and modules",
      "Environments and plan/apply in CI",
      "GitOps workflow",
    ]),
    outline("Observability", "See what the system is doing before users tell you.", [
      "Metrics: Prometheus and Grafana",
      "Logs: Loki",
      "Tracing: OpenTelemetry",
      "Alerting and SLOs",
    ]),
    outline("Security and reliability practice", "Habits that apply across every project.", [
      "Secrets management",
      "Least privilege",
      "Image and dependency scanning",
      "Incident response and postmortems",
    ]),
  ],
};
