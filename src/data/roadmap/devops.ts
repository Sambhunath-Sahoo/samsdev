import type { RoadmapTrack } from "@/types/roadmap";
import { outline } from "./outline";
import { BUDGETS_AND_COST_ALERTS } from "./lessons/devops/budgets-and-cost-alerts";
import { COMPUTE_EC2 } from "./lessons/devops/compute-ec2";
import { DOCKER_COMPOSE } from "./lessons/devops/docker-compose";
import { DOCKERFILE_AND_BUILD_CACHE } from "./lessons/devops/dockerfile-and-build-cache";
import { FIREWALLS_AND_REVERSE_PROXIES } from "./lessons/devops/firewalls-and-reverse-proxies";
import { IAM_AND_LEAST_PRIVILEGE } from "./lessons/devops/iam-and-least-privilege";
import { REGISTRIES_AND_IMAGE_SCANNING } from "./lessons/devops/registries-and-image-scanning";
import { VOLUMES_NETWORKS_AND_SECRETS } from "./lessons/devops/volumes-networks-and-secrets";


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
      FIREWALLS_AND_REVERSE_PROXIES,
    ]),
    outline("Git and collaboration", "Ship changes through reviewed pull requests.", [
      "Branching and pull requests",
      "Merge vs rebase and conflicts",
      "Protected main and hooks",
      "Tags and releases",
    ]),
    outline("Containers", "Package an app so it runs the same everywhere.", [
      "Images vs containers",
      DOCKERFILE_AND_BUILD_CACHE,
      VOLUMES_NETWORKS_AND_SECRETS,
      DOCKER_COMPOSE,
      REGISTRIES_AND_IMAGE_SCANNING,
    ]),
    outline("CI/CD", "Every merge is tested, built and deployable.", [
      "CI, continuous delivery, continuous deployment",
      "GitHub Actions: workflows, jobs, runners, secrets",
      "Image tagging and releases",
      "Deployment strategies: rolling, blue-green, canary, rollback",
    ]),
    outline("Cloud (AWS)", "Run the app on real infrastructure without leaking money or keys.", [
      IAM_AND_LEAST_PRIVILEGE,
      COMPUTE_EC2,
      "Networking: VPC, subnets, gateways",
      "Data: RDS",
      "Load balancing and autoscaling",
      BUDGETS_AND_COST_ALERTS,
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
