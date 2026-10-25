import type { LessonEntry } from "@/types/roadmap";

export const BASH_SCRIPTING: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Bash scripting",
    slug: "bash-scripting",
    lesson: {
      summary: "Write a safe, readable Bash script with strict mode, quoting, conditionals, loops and functions.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "When a script is the right tool" },
        { type: "p", text: "Bash is the glue for commands you would otherwise type by hand: set up a server, back up a directory, check a few services. It is a poor choice for complex data handling or long programs. If a script grows beyond a couple of hundred lines or needs real data structures, move it to Python or Go." },
        { type: "h2", text: "The shape of a safe script" },
        { type: "code", language: "bash", title: "backup.sh", code: `#!/usr/bin/env bash
set -euo pipefail

SRC="\${1:?usage: backup.sh <source-dir>}"
DEST="/var/backups/$(basename "$SRC")-$(date +%F).tar.gz"

log() { printf '%s %s\\n' "$(date +%T)" "$*"; }

[[ -d "$SRC" ]] || { log "no such directory: $SRC"; exit 1; }

log "backing up $SRC"
tar -czf "$DEST" -C "$SRC" .
log "wrote $DEST ($(du -h "$DEST" | cut -f1))"` },
        { type: "p", text: "The first line picks the interpreter. `set -euo pipefail` is the safety belt: `-e` exits on the first failing command, `-u` treats an unset variable as an error, and `pipefail` makes a pipeline fail if any stage fails, not just the last." },
        { type: "h2", text: "Building blocks" },
        { type: "code", language: "bash", code: `name="world"                       # no spaces around =
echo "hello $name"                 # double quotes expand variables
echo 'literal $name'               # single quotes do not
today=$(date +%F)                  # capture a command's output

if [[ "$ENV" == "prod" && -f /etc/app.conf ]]; then
  echo "prod config found"
elif [[ -z "$ENV" ]]; then
  echo "ENV is empty"
else
  echo "other"
fi

for f in /var/log/*.log; do        # glob loop
  [[ -e "$f" ]] || continue        # glob matched nothing
  gzip -k "$f"
done

while read -r line; do echo "> $line"; done < hosts.txt` },
        { type: "table", head: ["Test", "True when"], rows: [["`-f path` / `-d path`", "regular file / directory exists"], ["`-z str` / `-n str`", "string is empty / non-empty"], ["`a == b`", "strings equal (inside `[[ ]]`)"], ["`n -gt 5`", "integer comparison (`-eq -ne -lt -le -ge`)"]] },
        { type: "h2", text: "Functions and cleanup" },
        { type: "code", language: "bash", code: `tmp="$(mktemp -d)"
cleanup() { rm -rf "$tmp"; }
trap cleanup EXIT                  # runs on success, failure or Ctrl-C` },
        { type: "callout", tone: "gotcha", title: "Always quote your variables", text: "`rm -rf $dir/*` with an empty `$dir` becomes `rm -rf /*`. Writing `\"$dir\"` stops word splitting and globbing, so a path with a space stays one argument. Quote every expansion unless you deliberately want splitting, and run `shellcheck script.sh` before you ship; it catches most of these mistakes." },
        { type: "p", text: "Make the script executable with `chmod +x backup.sh` and run it as `./backup.sh /srv/site`. Keep scripts idempotent where you can, meaning that running them twice leaves the same result as running them once. That is what makes them safe to put in cron or a pipeline." },
      ],
      references: [
        { title: "Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/bash.html" },
        { title: "The Set Builtin - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html" },
        { title: "Bash Guide - Greg's Wiki", url: "https://mywiki.wooledge.org/BashGuide" },
      ],
    },
    points: [
      { id: "devops.bash-scripting.strict-mode", title: "Strict mode: set -euo pipefail", detail: "-e stops on failure, -u rejects unset variables and pipefail fails a pipeline when any stage fails. Together they turn silent mistakes into loud ones.", question: "What does each letter of set -euo pipefail protect against?" },
      { id: "devops.bash-scripting.quoting", title: "Quoting variables", detail: "Unquoted expansions are split on spaces and expanded as globs. Double quotes keep a value as one argument and prevent accidents like rm -rf with an empty variable.", question: "Why is rm -rf $dir/* dangerous when dir is empty?" },
      { id: "devops.bash-scripting.control-flow", title: "Conditionals, loops and tests", detail: "[[ ]] tests files, strings and numbers inside if, while and for constructs. Loop over globs, but guard against a glob that matches nothing.", question: "How do you check that a directory exists before using it?" },
      { id: "devops.bash-scripting.trap-cleanup", title: "Functions, trap and idempotence", detail: "Small functions keep scripts readable, and trap EXIT cleans up temporary files whatever the outcome. An idempotent script is safe to run twice.", question: "When does a trap on EXIT run?" },
    ],
  },
};
