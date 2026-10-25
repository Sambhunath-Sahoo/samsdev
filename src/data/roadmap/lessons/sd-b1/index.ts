import type { LessonEntry } from "@/types/roadmap";
import { SCALING_BASICS } from "./scaling-basics";
import { PERFORMANCE_AND_AVAILABILITY_METRICS } from "./performance-and-availability-metrics";
import { BACK_OF_ENVELOPE_ESTIMATION } from "./back-of-envelope-estimation";
import { TRADE_OFF_THINKING } from "./trade-off-thinking";
import { HOW_A_REQUEST_TRAVELS } from "./how-a-request-travels";
import { TCP_VS_UDP } from "./tcp-vs-udp";
import { REST_GRPC_AND_GRAPHQL } from "./rest-grpc-and-graphql";
import { REAL_TIME_POLLING_SSE_WEBSOCKETS } from "./real-time-polling-sse-websockets";
import { PUSH_VS_PULL } from "./push-vs-pull";
import { API_DESIGN_PAGINATION_VERSIONING_ERRORS } from "./api-design-pagination-versioning-errors";
import { PROXIES_AND_REVERSE_PROXIES } from "./proxies-and-reverse-proxies";

export const ENTRIES: readonly LessonEntry[] = [
  SCALING_BASICS,
  PERFORMANCE_AND_AVAILABILITY_METRICS,
  BACK_OF_ENVELOPE_ESTIMATION,
  TRADE_OFF_THINKING,
  HOW_A_REQUEST_TRAVELS,
  TCP_VS_UDP,
  REST_GRPC_AND_GRAPHQL,
  REAL_TIME_POLLING_SSE_WEBSOCKETS,
  PUSH_VS_PULL,
  API_DESIGN_PAGINATION_VERSIONING_ERRORS,
  PROXIES_AND_REVERSE_PROXIES,
];
