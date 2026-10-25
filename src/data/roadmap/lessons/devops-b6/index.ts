import type { LessonEntry } from "@/types/roadmap";
import { KUBERNETES_ARCHITECTURE } from "./kubernetes-architecture";
import { KUBERNETES_WORKLOADS } from "./kubernetes-workloads";
import { KUBERNETES_SERVICES_AND_INGRESS } from "./kubernetes-services-and-ingress";
import { KUBERNETES_CONFIG_AND_SECRETS } from "./kubernetes-config-and-secrets";
import { KUBERNETES_PROBES_ROLLOUTS_AUTOSCALING } from "./kubernetes-probes-rollouts-autoscaling";
import { KUBERNETES_HELM_AND_DEBUGGING } from "./kubernetes-helm-and-debugging";
import { KUBERNETES_STORAGE } from "./kubernetes-storage";
import { KUBERNETES_RESOURCE_REQUESTS_AND_LIMITS } from "./kubernetes-resource-requests-and-limits";
import { KUBERNETES_NAMESPACES_AND_RBAC } from "./kubernetes-namespaces-and-rbac";
import { KUBERNETES_NETWORK_POLICIES } from "./kubernetes-network-policies";
import { KUBERNETES_LOCAL_CLUSTERS } from "./kubernetes-local-clusters";
import { KUBERNETES_PRACTICE_SPRING_POSTGRES } from "./kubernetes-practice-spring-postgres";

export const ENTRIES: readonly LessonEntry[] = [
  KUBERNETES_ARCHITECTURE,
  KUBERNETES_WORKLOADS,
  KUBERNETES_SERVICES_AND_INGRESS,
  KUBERNETES_CONFIG_AND_SECRETS,
  KUBERNETES_PROBES_ROLLOUTS_AUTOSCALING,
  KUBERNETES_HELM_AND_DEBUGGING,
  KUBERNETES_STORAGE,
  KUBERNETES_RESOURCE_REQUESTS_AND_LIMITS,
  KUBERNETES_NAMESPACES_AND_RBAC,
  KUBERNETES_NETWORK_POLICIES,
  KUBERNETES_LOCAL_CLUSTERS,
  KUBERNETES_PRACTICE_SPRING_POSTGRES,
];
