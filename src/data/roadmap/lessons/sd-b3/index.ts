import type { LessonEntry } from "@/types/roadmap";
import { RACE_CONDITIONS } from "./race-conditions";
import { DEADLOCKS } from "./deadlocks";
import { TRANSACTIONS_AND_ACID } from "./transactions-and-acid";
import { ISOLATION_LEVELS } from "./isolation-levels";
import { OPTIMISTIC_LOCKING } from "./optimistic-locking";
import { PESSIMISTIC_LOCKING } from "./pessimistic-locking";
import { CACHE_PATTERNS_LESSON } from "./cache-patterns-aside-write-through-write-back";
import { CACHE_INVALIDATION } from "./cache-invalidation";
import { REDIS_DATA_STRUCTURES } from "./redis-data-structures-and-persistence";
import { REDIS_VS_DATABASE_LESSON } from "./redis-versus-the-database";
import { REDIS_EVICTION } from "./redis-eviction";
import { CACHE_STAMPEDES } from "./cache-stampedes";
import { DISTRIBUTED_CACHING } from "./distributed-caching";
import { CDN_AND_EDGE } from "./cdn-and-edge";

export const ENTRIES: readonly LessonEntry[] = [
  RACE_CONDITIONS,
  DEADLOCKS,
  TRANSACTIONS_AND_ACID,
  ISOLATION_LEVELS,
  OPTIMISTIC_LOCKING,
  PESSIMISTIC_LOCKING,
  CACHE_PATTERNS_LESSON,
  CACHE_INVALIDATION,
  REDIS_DATA_STRUCTURES,
  REDIS_VS_DATABASE_LESSON,
  REDIS_EVICTION,
  CACHE_STAMPEDES,
  DISTRIBUTED_CACHING,
  CDN_AND_EDGE,
];
