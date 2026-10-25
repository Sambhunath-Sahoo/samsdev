import type { LessonEntry } from "@/types/roadmap";
import { OOP_AND_UML } from "./oop-and-uml";
import { SOLID_PRINCIPLES } from "./solid-principles";
import { CREATIONAL_PATTERNS } from "./creational-patterns";
import { STRUCTURAL_PATTERNS } from "./structural-patterns";
import { BEHAVIORAL_PATTERNS } from "./behavioral-patterns";
import { MACHINE_CODING_APPROACH } from "./machine-coding-approach";
import { STARTER_LLD_PROBLEMS } from "./starter-lld-problems";
import { INTERMEDIATE_LLD_PROBLEMS } from "./intermediate-lld-problems";
import { CONCURRENCY_LLD_PROBLEMS } from "./concurrency-lld-problems";
import { RULE_ENGINE_LLD_PROBLEMS } from "./rule-engine-lld-problems";

export const ENTRIES: readonly LessonEntry[] = [
  OOP_AND_UML,
  SOLID_PRINCIPLES,
  CREATIONAL_PATTERNS,
  STRUCTURAL_PATTERNS,
  BEHAVIORAL_PATTERNS,
  MACHINE_CODING_APPROACH,
  STARTER_LLD_PROBLEMS,
  INTERMEDIATE_LLD_PROBLEMS,
  CONCURRENCY_LLD_PROBLEMS,
  RULE_ENGINE_LLD_PROBLEMS,
];
