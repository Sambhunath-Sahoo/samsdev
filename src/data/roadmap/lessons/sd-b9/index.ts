import type { LessonEntry } from "@/types/roadmap";
import { COLLABORATIVE_EDITING } from "./collaborative-editing";
import { KAFKA_STYLE_DISTRIBUTED_QUEUE } from "./kafka-style-distributed-queue";
import { SEARCH_ENGINE_CRAWLER_INDEX_RANKING } from "./search-engine-crawler-index-ranking";
import { REAL_TIME_LEADERBOARD } from "./real-time-leaderboard";
import { LOGGING_AND_MONITORING_SYSTEM } from "./logging-and-monitoring-system";
import { STOCK_TICKER_AND_LIVE_DATA_FEED } from "./stock-ticker-and-live-data-feed";
import { ANALYTICS_PIPELINE_AND_DATA_WAREHOUSE } from "./analytics-pipeline-and-data-warehouse";
import { RECOMMENDATION_ENGINE_CASE_STUDY } from "./recommendation-engine-case-study";
import { API_GATEWAY_CASE_STUDY } from "./api-gateway-case-study";

export const ENTRIES: readonly LessonEntry[] = [
  COLLABORATIVE_EDITING,
  KAFKA_STYLE_DISTRIBUTED_QUEUE,
  SEARCH_ENGINE_CRAWLER_INDEX_RANKING,
  REAL_TIME_LEADERBOARD,
  LOGGING_AND_MONITORING_SYSTEM,
  STOCK_TICKER_AND_LIVE_DATA_FEED,
  ANALYTICS_PIPELINE_AND_DATA_WAREHOUSE,
  RECOMMENDATION_ENGINE_CASE_STUDY,
  API_GATEWAY_CASE_STUDY,
];
