import type { LessonEntry } from "@/types/roadmap";
import { WHAT_DEVOPS_IS } from "./what-devops-is";
import { FILESYSTEM_PERMISSIONS } from "./filesystem-permissions";
import { PROCESSES_AND_SERVICES } from "./processes-and-services";
import { TEXT_TOOLS_AND_PIPES } from "./text-tools-and-pipes";
import { BASH_SCRIPTING } from "./bash-scripting";
import { EXIT_CODES_ARGS_VARIABLES } from "./exit-codes-args-variables";
import { DISK_AND_MEMORY_CHECKS } from "./disk-and-memory-checks";
import { PACKAGE_MANAGERS } from "./package-managers";
import { ENVIRONMENT_VARIABLES } from "./environment-variables";
import { CRON_SSH_REMOTE_WORK } from "./cron-ssh-remote-work";
import { FILE_TRANSFER_SCP_RSYNC } from "./file-transfer-scp-rsync";
import { SERVER_SETUP_AND_LOG_ROTATION } from "./server-setup-and-log-rotation";

export const ENTRIES: readonly LessonEntry[] = [
  WHAT_DEVOPS_IS,
  FILESYSTEM_PERMISSIONS,
  PROCESSES_AND_SERVICES,
  TEXT_TOOLS_AND_PIPES,
  BASH_SCRIPTING,
  EXIT_CODES_ARGS_VARIABLES,
  DISK_AND_MEMORY_CHECKS,
  PACKAGE_MANAGERS,
  ENVIRONMENT_VARIABLES,
  CRON_SSH_REMOTE_WORK,
  FILE_TRANSFER_SCP_RSYNC,
  SERVER_SETUP_AND_LOG_ROTATION,
];
