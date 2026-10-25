import type { LessonEntry } from "@/types/roadmap";
import { HTTP_AND_CURL } from "./http-and-curl";
import { HTTP_METHODS_STATUS_CODES_HEADERS } from "./http-methods-status-codes-headers";
import { DNS_AND_IP } from "./dns-and-ip";
import { NETWORK_DEBUGGING_DIG_NSLOOKUP_SS } from "./network-debugging-dig-nslookup-ss";
import { TCP_UDP_AND_PORTS } from "./tcp-udp-and-ports";
import { TLS_AND_CERTIFICATES } from "./tls-and-certificates";
import { WHAT_HAPPENS_WHEN_YOU_TYPE_A_URL } from "./what-happens-when-you-type-a-url";
import { HOST_FIREWALLS_UFW_IPTABLES } from "./host-firewalls-ufw-iptables";
import { BRANCHING_AND_PULL_REQUESTS } from "./branching-and-pull-requests";
import { MERGE_VS_REBASE_AND_CONFLICTS } from "./merge-vs-rebase-and-conflicts";
import { PROTECTED_MAIN_AND_HOOKS } from "./protected-main-and-hooks";
import { TAGS_AND_RELEASES } from "./tags-and-releases";
import { MONOREPO_VS_POLYREPO } from "./monorepo-vs-polyrepo";
import { GITIGNORE_AND_WHAT_NEVER_TO_COMMIT } from "./gitignore-and-what-never-to-commit";
import { TEAM_WORKFLOW_PRACTICE } from "./team-workflow-practice";

export const ENTRIES: readonly LessonEntry[] = [
  HTTP_AND_CURL,
  HTTP_METHODS_STATUS_CODES_HEADERS,
  DNS_AND_IP,
  NETWORK_DEBUGGING_DIG_NSLOOKUP_SS,
  TCP_UDP_AND_PORTS,
  TLS_AND_CERTIFICATES,
  WHAT_HAPPENS_WHEN_YOU_TYPE_A_URL,
  HOST_FIREWALLS_UFW_IPTABLES,
  BRANCHING_AND_PULL_REQUESTS,
  MERGE_VS_REBASE_AND_CONFLICTS,
  PROTECTED_MAIN_AND_HOOKS,
  TAGS_AND_RELEASES,
  MONOREPO_VS_POLYREPO,
  GITIGNORE_AND_WHAT_NEVER_TO_COMMIT,
  TEAM_WORKFLOW_PRACTICE,
];
