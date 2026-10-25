import type { LessonEntry } from "@/types/roadmap";
import { LOAD_BALANCING } from "./load-balancing";
import { REPLICATION_AND_READ_REPLICAS } from "./replication-and-read-replicas";
import { REPLICATION_LAG } from "./replication-lag";
import { PARTITIONING } from "./partitioning";
import { DATABASE_SHARDING } from "./database-sharding";
import { CONSISTENT_HASHING } from "./consistent-hashing";
import { SHARDED_COUNTERS } from "./sharded-counters";
import { UNIQUE_ID_GENERATION } from "./unique-id-generation";
import { BATCH_VS_STREAM_PROCESSING } from "./batch-vs-stream-processing";
import { MESSAGE_QUEUES } from "./message-queues";
import { FAILURE_PATHS_AND_WORKERS } from "./failure-paths-and-workers";
import { SCHEDULED_WORK } from "./scheduled-work";
import { EVENTS_BETWEEN_SERVICES } from "./events-between-services";
import { WEBHOOKS } from "./webhooks";
import { CONSISTENCY_AND_EVENT_BASED_DATA_PATTERNS } from "./consistency-and-event-based-data-patterns";
import { CQRS_AND_EVENT_SOURCING } from "./cqrs-and-event-sourcing";
import { CHOOSING_A_MESSAGING_STYLE_AND_BROKER } from "./choosing-a-messaging-style-and-broker";

export const ENTRIES: readonly LessonEntry[] = [
  LOAD_BALANCING,
  REPLICATION_AND_READ_REPLICAS,
  REPLICATION_LAG,
  PARTITIONING,
  DATABASE_SHARDING,
  CONSISTENT_HASHING,
  SHARDED_COUNTERS,
  UNIQUE_ID_GENERATION,
  BATCH_VS_STREAM_PROCESSING,
  MESSAGE_QUEUES,
  FAILURE_PATHS_AND_WORKERS,
  SCHEDULED_WORK,
  EVENTS_BETWEEN_SERVICES,
  WEBHOOKS,
  CONSISTENCY_AND_EVENT_BASED_DATA_PATTERNS,
  CQRS_AND_EVENT_SOURCING,
  CHOOSING_A_MESSAGING_STYLE_AND_BROKER,
];
