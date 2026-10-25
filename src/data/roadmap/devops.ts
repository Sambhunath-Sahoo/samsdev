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
import { CICD_PIPELINE_ENTRIES, CI_CD_DEFINITIONS, DEPLOYMENT_STRATEGIES } from "./devops/cicd";
import { CLOUD_LOAD_BALANCING, CLOUD_NETWORKING, CLOUD_NEW_TOPICS } from "./devops/cloud";
import { CONTAINERS_AFTER_REGISTRY, DOCKERFILE_INSTRUCTIONS, DOCKER_NETWORK_DRIVERS, IMAGES_VS_CONTAINERS } from "./devops/containers";
import { FUNDAMENTALS_SUBSECTIONS } from "./devops/fundamentals";
import { GIT_SUBSECTIONS } from "./devops/git";
import { IAC_ENVIRONMENTS, IAC_GITOPS, IAC_NEW_TOPICS, IAC_STATE_AND_MODULES, IAC_TERRAFORM_BASICS } from "./devops/iac";
import {
  K8S_ARCHITECTURE,
  K8S_CONFIG,
  K8S_HELM,
  K8S_NEW_TOPICS,
  K8S_PROBES,
  K8S_SERVICES,
  K8S_WORKLOADS,
} from "./devops/kubernetes";
import { LINUX_OUTLINE, NETWORKING_AFTER_LESSON, NETWORKING_BEFORE_LESSON } from "./devops/linux";
import { OBS_ALERTING, OBS_METRICS, OBS_NEW_TOPICS, OBS_PILLARS, OBS_TRACING } from "./devops/observability";
import { SECURITY_NEW_TOPICS } from "./devops/security";

export const DEVOPS: RoadmapTrack = {
  id: "devops",
  title: "DevOps",
  description: "From the Linux shell to Kubernetes, Terraform and observability, building one app up as you go.",
  hue: "blue",
  sections: [
    outline("DevOps fundamentals", "Know what DevOps is for before the tools.", FUNDAMENTALS_SUBSECTIONS),
    outline("Linux and shell", "Work comfortably on a server.", LINUX_OUTLINE),
    outline("Networking for ops", "Debug anything between a browser and a server.", [
      ...NETWORKING_BEFORE_LESSON,
      FIREWALLS_AND_REVERSE_PROXIES,
      ...NETWORKING_AFTER_LESSON,
    ]),
    outline("Git and collaboration", "Ship changes through reviewed pull requests.", GIT_SUBSECTIONS),
    outline("Containers", "Package an app so it runs the same everywhere.", [
      IMAGES_VS_CONTAINERS,
      DOCKERFILE_AND_BUILD_CACHE,
      DOCKERFILE_INSTRUCTIONS,
      VOLUMES_NETWORKS_AND_SECRETS,
      DOCKER_NETWORK_DRIVERS,
      DOCKER_COMPOSE,
      REGISTRIES_AND_IMAGE_SCANNING,
      ...CONTAINERS_AFTER_REGISTRY,
    ]),
    outline("CI/CD", "Every merge is tested, built and deployable.", [
      CI_CD_DEFINITIONS,
      "GitHub Actions: workflows, jobs, runners, secrets",
      "Image tagging and releases",
      DEPLOYMENT_STRATEGIES,
      ...CICD_PIPELINE_ENTRIES,
    ]),
    outline("Cloud (AWS)", "Run the app on real infrastructure without leaking money or keys.", [
      IAM_AND_LEAST_PRIVILEGE,
      COMPUTE_EC2,
      CLOUD_NETWORKING,
      "Data: RDS",
      CLOUD_LOAD_BALANCING,
      BUDGETS_AND_COST_ALERTS,
      ...CLOUD_NEW_TOPICS,
    ]),
    outline("Kubernetes", "Run and heal containers across a cluster.", [
      K8S_ARCHITECTURE,
      K8S_WORKLOADS,
      K8S_SERVICES,
      K8S_CONFIG,
      K8S_PROBES,
      K8S_HELM,
      ...K8S_NEW_TOPICS,
    ]),
    outline("Infrastructure as code and GitOps", "Infrastructure that lives in Git and deploys from a pipeline.", [
      IAC_TERRAFORM_BASICS,
      IAC_STATE_AND_MODULES,
      IAC_ENVIRONMENTS,
      IAC_GITOPS,
      ...IAC_NEW_TOPICS,
    ]),
    outline("Observability", "See what the system is doing before users tell you.", [
      OBS_PILLARS,
      OBS_METRICS,
      "Logs: Loki",
      OBS_TRACING,
      OBS_ALERTING,
      ...OBS_NEW_TOPICS,
    ]),
    outline("Security and reliability practice", "Habits that apply across every project.", [
      "Secrets management",
      ...SECURITY_NEW_TOPICS,
      "Least privilege",
      "Image and dependency scanning",
      "Incident response and postmortems",
    ]),
  ],
};
