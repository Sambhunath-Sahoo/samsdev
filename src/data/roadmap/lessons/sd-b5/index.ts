import type { LessonEntry } from "@/types/roadmap";
import { CAP_AND_PACELC } from "./cap-and-pacelc";
import { CONSISTENCY_MODELS } from "./consistency-models";
import { CONSENSUS_RAFT_PAXOS } from "./consensus-raft-paxos";
import { GOSSIP_AND_HEARTBEATS } from "./gossip-and-heartbeats";
import { DISTRIBUTED_LOCKING } from "./distributed-locking";
import { DISTRIBUTED_TRANSACTIONS } from "./distributed-transactions";
import { TIME_AND_ORDERING } from "./time-and-ordering";
import { IDEMPOTENCY } from "./idempotency";
import { RETRIES_BACKOFF_AND_JITTER } from "./retries-backoff-and-jitter";
import { PROTECTING_DEPENDENCIES_AND_YOURSELF } from "./protecting-dependencies-and-yourself";
import { RUNNING_SAFELY } from "./running-safely-shutdown-health-and-tracing";

export const ENTRIES: readonly LessonEntry[] = [
  CAP_AND_PACELC,
  CONSISTENCY_MODELS,
  CONSENSUS_RAFT_PAXOS,
  GOSSIP_AND_HEARTBEATS,
  DISTRIBUTED_LOCKING,
  DISTRIBUTED_TRANSACTIONS,
  TIME_AND_ORDERING,
  IDEMPOTENCY,
  RETRIES_BACKOFF_AND_JITTER,
  PROTECTING_DEPENDENCIES_AND_YOURSELF,
  RUNNING_SAFELY,
];
