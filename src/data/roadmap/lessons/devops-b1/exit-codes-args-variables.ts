import type { LessonEntry } from "@/types/roadmap";

export const EXIT_CODES_ARGS_VARIABLES: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Exit codes, script arguments and variables",
    slug: "exit-codes-script-arguments-and-variables",
    lesson: {
      summary: "Make scripts report success or failure honestly, take input from the command line, and use variables and defaults safely.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Exit codes: how a command says it failed" },
        { type: "p", text: "Every command ends with a number between 0 and 255. **0 means success**, anything else means failure. `if`, `&&`, `||`, CI pipelines and cron all decide what to do from that number, so a script that always exits 0 hides its own failures." },
        { type: "code", language: "bash", code: `grep -q "ready" status.txt
echo $?                        # 0 if found, 1 if not, 2 on an error

mkdir /srv/app && echo "created" || echo "failed"
cp a.txt b.txt; echo "exit: $?"` },
        { type: "table", head: ["Code", "Common meaning"], rows: [["`0`", "Success"], ["`1`", "General failure"], ["`2`", "Misuse of a command or bad arguments"], ["`126` / `127`", "Found but not executable / command not found"], ["`130`", "Stopped by Ctrl-C (128 + signal 2)"], ["`137`", "Killed by SIGKILL (128 + 9), often the out-of-memory killer"]] },
        { type: "p", text: "In your own script, end with `exit 0` on success and `exit 1` (or another non-zero code) on failure, and print the reason to standard error with `echo \"msg\" >&2`." },
        { type: "h2", text: "Arguments" },
        { type: "p", text: "Bash passes arguments in numbered variables and a few special ones." },
        { type: "table", head: ["Variable", "Holds"], rows: [["`$0`", "Name of the script"], ["`$1`, `$2`, ...", "First, second argument"], ["`$#`", "Number of arguments"], ["`\"$@\"`", "All arguments, each kept as a separate word"], ["`$?`", "Exit code of the last command"], ["`$$`", "PID of the current shell"]] },
        { type: "code", language: "bash", title: "deploy.sh", code: `#!/usr/bin/env bash
set -euo pipefail

usage() { echo "usage: $0 <env> [--dry-run]" >&2; exit 2; }
[[ $# -ge 1 ]] || usage

ENV="$1"; shift
DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true ;;
    *) echo "unknown option: $1" >&2; usage ;;
  esac
  shift
done

case "$ENV" in
  staging|prod) ;;
  *) echo "env must be staging or prod" >&2; exit 2 ;;
esac

echo "deploying to $ENV (dry run: $DRY_RUN)"` },
        { type: "h2", text: "Variables, defaults and the environment" },
        { type: "code", language: "bash", code: `PORT="\${PORT:-8000}"           # use $PORT, else 8000
NAME="\${1:?name is required}"  # abort with a message if missing
echo "\${file%.txt}.bak"        # strip suffix:  notes.txt -> notes.bak
readonly API_URL="https://api.example.com"
export LOG_LEVEL=debug         # visible to child processes` },
        { type: "p", text: "A plain variable exists only in the current shell. `export` copies it into the environment of every program you start afterwards. Variables defined inside a function are global unless you declare them `local`." },
        { type: "callout", tone: "gotcha", title: "Spaces and the last command", text: "`NAME = value` is an error, because Bash tries to run a command called `NAME`. Write `NAME=value`. Also, `$?` is overwritten by every command, even `echo`, so save it first: `rc=$?`. With `set -e` on, check a command you expect to fail with `if cmd; then ...` or `cmd || true`, otherwise the script dies on it." },
      ],
      references: [
        { title: "Exit Status - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html" },
        { title: "Positional Parameters - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/Positional-Parameters.html" },
        { title: "Special Parameters - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html" },
        { title: "Shell Parameter Expansion - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html" },
      ],
    },
    points: [
      { id: "devops.exit-codes-script-arguments-and-variables.exit-status", title: "Exit status 0 means success", detail: "Zero is success and any other value is failure. Pipelines, cron and && or || all branch on it, so scripts must exit non-zero when they fail.", question: "What exit code does a script return if its last command succeeds, and how do you force a failure?" },
      { id: "devops.exit-codes-script-arguments-and-variables.positional", title: "Positional parameters", detail: "$1, $2 and so on hold arguments, $# counts them and \"$@\" expands to all of them as separate words. shift drops the first one when parsing options.", question: "Why quote \"$@\" instead of using $*?" },
      { id: "devops.exit-codes-script-arguments-and-variables.defaults", title: "Defaults and required values", detail: "${VAR:-default} supplies a fallback and ${VAR:?message} aborts when the value is missing. This validates input at the top of a script.", question: "How do you make a script abort with a message when its first argument is missing?" },
      { id: "devops.exit-codes-script-arguments-and-variables.export", title: "Shell variables vs exported variables", detail: "A plain variable stays in the current shell. export places it in the environment passed to child processes.", question: "Why can a child script not see a variable you set without export?" },
    ],
  },
};
