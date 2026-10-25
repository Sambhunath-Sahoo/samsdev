import type { LessonEntry } from "@/types/roadmap";
import { IMAGES_VS_CONTAINERS } from "./images-vs-containers";
import { DOCKERFILE_CMD_ENTRYPOINT_COPY_ADD } from "./dockerfile-cmd-entrypoint-copy-add";
import { DOCKER_NETWORK_DRIVERS } from "./docker-network-drivers";
import { IMAGE_SCANNING_WITH_TRIVY } from "./image-scanning-with-trivy";
import { DOCKER_HUB_AND_REGISTRIES } from "./docker-hub-and-registries";
import { SPRING_BOOT_POSTGRES_COMPOSE_PRACTICE } from "./spring-boot-postgres-compose-practice";
import { SECRETS_MANAGEMENT } from "./secrets-management";
import { VAULT_AND_AWS_SECRETS_MANAGER } from "./vault-and-aws-secrets-manager";
import { LEAST_PRIVILEGE } from "./least-privilege";
import { IMAGE_AND_DEPENDENCY_SCANNING } from "./image-and-dependency-scanning";
import { INCIDENT_RESPONSE_AND_POSTMORTEMS } from "./incident-response-and-postmortems";

export const ENTRIES: readonly LessonEntry[] = [
  IMAGES_VS_CONTAINERS,
  DOCKERFILE_CMD_ENTRYPOINT_COPY_ADD,
  DOCKER_NETWORK_DRIVERS,
  IMAGE_SCANNING_WITH_TRIVY,
  DOCKER_HUB_AND_REGISTRIES,
  SPRING_BOOT_POSTGRES_COMPOSE_PRACTICE,
  SECRETS_MANAGEMENT,
  VAULT_AND_AWS_SECRETS_MANAGER,
  LEAST_PRIVILEGE,
  IMAGE_AND_DEPENDENCY_SCANNING,
  INCIDENT_RESPONSE_AND_POSTMORTEMS,
];
