import type { LessonEntry } from "@/types/roadmap";
import { THREE_PILLARS } from "./three-pillars";
import { PROMETHEUS_GRAFANA } from "./prometheus-grafana";
import { LOKI } from "./loki";
import { OPENTELEMETRY } from "./opentelemetry";
import { ALERTING_SLOS } from "./alerting-slos";
import { ELK_STACK } from "./elk-stack";
import { JAEGER_ZIPKIN } from "./jaeger-zipkin";
import { MICROMETER } from "./micrometer";
import { ON_CALL } from "./on-call";
import { PRACTICE_PROMETHEUS_K8S } from "./practice-prometheus-k8s";

export const ENTRIES: readonly LessonEntry[] = [
  THREE_PILLARS,
  PROMETHEUS_GRAFANA,
  LOKI,
  OPENTELEMETRY,
  ALERTING_SLOS,
  ELK_STACK,
  JAEGER_ZIPKIN,
  MICROMETER,
  ON_CALL,
  PRACTICE_PROMETHEUS_K8S,
];
