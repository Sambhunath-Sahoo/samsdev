import type { LessonEntry } from "@/types/roadmap";
import { REDUNDANCY_FAILOVER_DISASTER_RECOVERY } from "./redundancy-failover-disaster-recovery";
import { LOGS_AND_METRICS } from "./logs-and-metrics";
import { DISTRIBUTED_MONITORING_ERROR_TRACKING } from "./distributed-monitoring-error-tracking";
import { SLOS_AND_ERROR_BUDGETS } from "./slos-and-error-budgets";
import { HIGH_AVAILABILITY_DESIGN } from "./high-availability-design";
import { MONOLITH_VS_MICROSERVICES } from "./monolith-vs-microservices";
import { API_GATEWAY_SERVICE_DISCOVERY } from "./api-gateway-service-discovery";
import { SERVERLESS_ARCHITECTURE } from "./serverless-architecture";
import { AUTHN_AUTHZ_OAUTH } from "./authn-authz-oauth";
import { INTERVIEW_DESIGN_FRAMEWORK } from "./interview-design-framework";
import { COMMUNICATION_AND_MOCK_INTERVIEWS } from "./communication-and-mock-interviews";

export const ENTRIES: readonly LessonEntry[] = [
  REDUNDANCY_FAILOVER_DISASTER_RECOVERY,
  LOGS_AND_METRICS,
  DISTRIBUTED_MONITORING_ERROR_TRACKING,
  SLOS_AND_ERROR_BUDGETS,
  HIGH_AVAILABILITY_DESIGN,
  MONOLITH_VS_MICROSERVICES,
  API_GATEWAY_SERVICE_DISCOVERY,
  SERVERLESS_ARCHITECTURE,
  AUTHN_AUTHZ_OAUTH,
  INTERVIEW_DESIGN_FRAMEWORK,
  COMMUNICATION_AND_MOCK_INTERVIEWS,
];
