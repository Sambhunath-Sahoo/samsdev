import type { LessonEntry } from "@/types/roadmap";
import { ENTRIES as DEVOPS_B1 } from "./devops-b1";
import { ENTRIES as DEVOPS_B2 } from "./devops-b2";
import { ENTRIES as DEVOPS_B3 } from "./devops-b3";
import { ENTRIES as DEVOPS_B4 } from "./devops-b4";
import { ENTRIES as DEVOPS_B5 } from "./devops-b5";
import { ENTRIES as DEVOPS_B6 } from "./devops-b6";
import { ENTRIES as DEVOPS_B7 } from "./devops-b7";
import { ENTRIES as DEVOPS_B8 } from "./devops-b8";
import { ENTRIES as SD_B1 } from "./sd-b1";
import { ENTRIES as SD_B2 } from "./sd-b2";
import { ENTRIES as SD_B3 } from "./sd-b3";
import { ENTRIES as SD_B4 } from "./sd-b4";
import { ENTRIES as SD_B5 } from "./sd-b5";
import { ENTRIES as SD_B6 } from "./sd-b6";
import { ENTRIES as SD_B7 } from "./sd-b7";
import { ENTRIES as SD_B8 } from "./sd-b8";
import { ENTRIES as SD_B9 } from "./sd-b9";
import { ENTRIES as SD_B10 } from "./sd-b10";

/**
 * Every written lesson that is not defined inline in a track file. One spread per batch folder.
 * Each batch exports `ENTRIES: readonly LessonEntry[]` from its own index.ts.
 */
export const LESSON_ENTRIES: readonly LessonEntry[] = [
  ...DEVOPS_B1,
  ...DEVOPS_B2,
  ...DEVOPS_B3,
  ...DEVOPS_B4,
  ...DEVOPS_B5,
  ...DEVOPS_B6,
  ...DEVOPS_B7,
  ...DEVOPS_B8,
  ...SD_B1,
  ...SD_B2,
  ...SD_B3,
  ...SD_B4,
  ...SD_B5,
  ...SD_B6,
  ...SD_B7,
  ...SD_B8,
  ...SD_B9,
  ...SD_B10,
];
