import type { LessonEntry } from "@/types/roadmap";
import { PROBABILISTIC_SYSTEMS } from "./probabilistic-systems";
import { RAG_AT_SCALE } from "./rag-at-scale";
import { LLM_GATEWAY } from "./llm-gateway";
import { AGENT_PLATFORM } from "./agent-platform";
import { EVALUATION_COST_AND_LATENCY } from "./evaluation-cost-and-latency";
import { LLM_SERVING_AND_INFRASTRUCTURE } from "./llm-serving-and-infrastructure";
import { SAFETY_AND_GUARDRAILS } from "./safety-and-guardrails";
import { DESIGN_RAG_SUPPORT_ASSISTANT } from "./design-rag-support-assistant";
import { DESIGN_LLM_SERVING_SYSTEM } from "./design-llm-serving-system";
import { DESIGN_SEMANTIC_SEARCH_SYSTEM } from "./design-semantic-search-system";
import { DESIGN_RECOMMENDATION_ENGINE } from "./design-recommendation-engine";
import { DESIGN_CONTENT_MODERATION } from "./design-content-moderation";

export const ENTRIES: readonly LessonEntry[] = [
  PROBABILISTIC_SYSTEMS,
  RAG_AT_SCALE,
  LLM_GATEWAY,
  AGENT_PLATFORM,
  EVALUATION_COST_AND_LATENCY,
  LLM_SERVING_AND_INFRASTRUCTURE,
  SAFETY_AND_GUARDRAILS,
  DESIGN_RAG_SUPPORT_ASSISTANT,
  DESIGN_LLM_SERVING_SYSTEM,
  DESIGN_SEMANTIC_SEARCH_SYSTEM,
  DESIGN_RECOMMENDATION_ENGINE,
  DESIGN_CONTENT_MODERATION,
];
