import type { DetailedProject } from "@/types/content";
import { FOODISHI } from "./foodishi";
import { COURSIVO } from "./coursivo";
import { AI_TICKET_TRIAGE } from "./ai-ticket-triage";

/**
 * Projects defined in code. They are merged with the Sanity projects:
 * a local entry with the same slug replaces the Sanity one, and local
 * entries are listed first in this order.
 */
export const LOCAL_PROJECTS: readonly DetailedProject[] = [AI_TICKET_TRIAGE, FOODISHI, COURSIVO];
