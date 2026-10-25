import type { LessonEntry } from "@/types/roadmap";

export const ENVIRONMENT_VARIABLES: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Environment variables, .bashrc and .profile",
    slug: "environment-variables-bashrc-and-profile",
    lesson: {
      summary: "Understand where environment variables come from, which shell startup file to edit, and how to give a service its configuration.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What the environment is" },
        { type: "p", text: "Every process has an environment: a set of `NAME=value` pairs that it inherits from its parent. Programs read it for configuration, such as `PATH` (where to look for commands), `HOME`, `LANG`, or your own `DATABASE_URL`. Twelve-factor style apps take all their config this way, which keeps secrets out of the code." },
        { type: "code", language: "bash", code: `printenv | sort | head          # list the environment
echo "$PATH"                    # colon-separated search path
export APP_ENV=staging          # set for this shell and its children
APP_ENV=prod ./run.sh           # set for this one command only
env -i PATH=/usr/bin bash -c 'echo "$HOME"'   # run with an almost empty environment` },
        { type: "h2", text: "Which startup file runs when" },
        { type: "p", text: "Bash reads different files depending on how the shell was started. The distinction is **login** (you sign in over ssh or at a console) versus **interactive non-login** (you open a terminal window or run `bash`)." },
        { type: "table", head: ["File", "Read by", "Put here"], rows: [["`/etc/profile`", "login shells, all users", "System-wide setup"], ["`~/.profile` or `~/.bash_profile`", "login shells", "Variables and PATH for your user"], ["`~/.bashrc`", "interactive non-login shells", "Aliases, prompt, functions"], ["`/etc/environment`", "login sessions (read by PAM, not a shell)", "Plain `NAME=value` lines only"]] },
        { type: "p", text: "Bash looks for `~/.bash_profile`, then `~/.bash_login`, then `~/.profile` and reads only the first it finds. Many distributions ship a `~/.profile` that sources `~/.bashrc`, which makes both kinds of shell behave alike. If yours does not, add that line yourself:" },
        { type: "code", language: "bash", title: "~/.profile", code: `export PATH="$HOME/.local/bin:$PATH"
export EDITOR=vim

# load interactive settings too
if [ -n "$BASH_VERSION" ] && [ -f "$HOME/.bashrc" ]; then
  . "$HOME/.bashrc"
fi` },
        { type: "p", text: "After editing, either start a new session or run `source ~/.profile`. Editing the file does not change shells that are already open." },
        { type: "h2", text: "Variables for services and scripts" },
        { type: "list", items: ["**systemd services** do not read your `.bashrc`. Use `Environment=` or `EnvironmentFile=/etc/myapp.env` in the unit file.", "**cron jobs** run with a tiny environment, typically a short `PATH`. Use absolute paths or set `PATH=` at the top of the crontab.", "**Docker** takes `-e NAME=value` or `--env-file`; Compose has `environment:` and `env_file:`.", "**`.env` files** are read by tools such as Compose or dotenv libraries, not by Bash itself. Load one into a script with `set -a; . ./.env; set +a`."] },
        { type: "callout", tone: "gotcha", title: "Secrets in the wrong place", text: "Anything exported in a shell profile is visible to every process you start, and values passed on the command line show up in `ps` and in shell history. Do not put production secrets in `.bashrc`, and never commit a `.env`. Keep them in a file readable only by the service user (`chmod 600`), or in a secret manager." },
      ],
      references: [
        { title: "Bash Startup Files - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html" },
        { title: "environ(7) - Linux manual page", url: "https://man7.org/linux/man-pages/man7/environ.7.html" },
        { title: "systemd.service(5) - Linux manual page", url: "https://man7.org/linux/man-pages/man5/systemd.service.5.html" },
      ],
    },
    points: [
      { id: "devops.environment-variables-bashrc-and-profile.environment", title: "Environment variables are inherited", detail: "A process copies its parent's environment, so export makes a value visible to children. Apps read config such as DATABASE_URL and PATH from it.", question: "What is the difference between APP_ENV=prod ./run.sh and export APP_ENV=prod?" },
      { id: "devops.environment-variables-bashrc-and-profile.login-vs-interactive", title: "Login vs interactive shells", detail: "Login shells read ~/.profile and interactive non-login shells read ~/.bashrc. Having .profile source .bashrc keeps both consistent.", question: "You added an export to .bashrc but it is missing over ssh in a script. Why might that be?" },
      { id: "devops.environment-variables-bashrc-and-profile.services-and-cron", title: "Services and cron do not read your profile", detail: "systemd uses Environment or EnvironmentFile and cron runs with a minimal PATH. Set what they need explicitly and use absolute paths.", question: "A script works in your terminal but fails in cron with command not found. What is the likely cause?" },
      { id: "devops.environment-variables-bashrc-and-profile.secrets", title: "Keeping secrets out of the wrong places", detail: "Command-line arguments and shell history expose values. Use a file with restricted permissions or a secret manager, and never commit .env files.", question: "Why is passing a password as a command argument worse than reading it from a protected file?" },
    ],
  },
};
