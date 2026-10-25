import type { LessonEntry } from "@/types/roadmap";

export const SERVER_SETUP_AND_LOG_ROTATION: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Practice: server setup script and cron log rotation",
    slug: "practice-server-setup-and-log-rotation",
    lesson: {
      summary: "Combine the section into one idempotent setup script and a cron job that rotates and prunes your app's logs.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The exercise" },
        { type: "p", text: "You have a fresh Ubuntu server. Write a script that prepares it for a small app: updates packages, installs a few tools, creates a service user and an app directory, and locks down ssh. Then add a nightly job that compresses and prunes the app's logs. Everything uses commands from this section, and the script must be safe to run twice." },
        { type: "h2", text: "setup.sh" },
        { type: "code", language: "bash", title: "setup.sh", code: `#!/usr/bin/env bash
set -euo pipefail

APP_USER="myapp"
APP_DIR="/opt/myapp"
LOG_DIR="/var/log/myapp"

[[ $EUID -eq 0 ]] || { echo "run as root: sudo $0" >&2; exit 1; }
log() { printf '[setup] %s\\n' "$*"; }

log "installing packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends curl git ufw rsync

log "creating service user and directories"
id "$APP_USER" &>/dev/null || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin "$APP_USER"
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$APP_DIR" "$LOG_DIR"

log "configuring firewall"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log "hardening ssh"
install -d /etc/ssh/sshd_config.d
printf 'PasswordAuthentication no\\nPermitRootLogin no\\n' > /etc/ssh/sshd_config.d/10-hardening.conf
sshd -t && systemctl reload ssh

log "done" ` },
        { type: "p", text: "Each step is idempotent: `id` checks before `useradd`, `install -d` is fine if the directory exists, `ufw allow` repeats harmlessly and the ssh file is overwritten with the same content. `sshd -t` tests the config first, so a typo cannot lock you out of a reload." },
        { type: "callout", tone: "gotcha", title: "Do not lock yourself out", text: "Before disabling password login, confirm in a **second terminal** that your key works, and keep the first session open until the reload succeeds. On Ubuntu the service is called `ssh`; on Red Hat family distributions it is `sshd`. Allow ssh in the firewall before enabling it." },
        { type: "h2", text: "Log rotation" },
        { type: "p", text: "The usual tool is `logrotate`, which is already installed and is run daily by a systemd timer or cron. Describe your logs in a file under `/etc/logrotate.d/`:" },
        { type: "code", language: "text", title: "/etc/logrotate.d/myapp", code: `/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}` },
        { type: "p", text: "That keeps 14 compressed days. `copytruncate` copies the file and then empties it, which suits apps that keep the log file open and do not reopen it on a signal. The cost is that a few lines can be lost in the instant between copy and truncate. Test without changing anything using `sudo logrotate -d /etc/logrotate.d/myapp`, and force a run with `-f`." },
        { type: "p", text: "To practise cron directly, add a hand-rolled prune job as the root crontab, with output logged:" },
        { type: "code", language: "text", code: `15 3 * * * /usr/bin/find /var/log/myapp -name '*.gz' -mtime +30 -delete >> /var/log/myapp-prune.log 2>&1` },
        { type: "h2", text: "Check your work" },
        { type: "list", items: ["Run `sudo ./setup.sh` twice. The second run must finish with no errors.", "`ls -ld /opt/myapp` shows owner `myapp` and mode `drwxr-x---`.", "`sudo ufw status` lists OpenSSH, 80 and 443.", "`sudo logrotate -d /etc/logrotate.d/myapp` prints what it would do without errors.", "`journalctl -u cron --since today` (or `-u crond`) shows your job running."] },
      ],
      references: [
        { title: "logrotate(8) - Linux manual page", url: "https://man7.org/linux/man-pages/man8/logrotate.8.html" },
        { title: "crontab(5) - Linux manual page", url: "https://man7.org/linux/man-pages/man5/crontab.5.html" },
        { title: "sshd_config(5) - OpenBSD manual page", url: "https://man.openbsd.org/sshd_config" },
        { title: "The Set Builtin - Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html" },
      ],
    },
    points: [
      { id: "devops.practice-server-setup-and-log-rotation.idempotent", title: "An idempotent setup script", detail: "Check before creating, use commands that tolerate existing state and test config before reloading. Then the script is safe to re-run on a half-configured server.", question: "Which line in the script makes user creation safe to run twice?" },
      { id: "devops.practice-server-setup-and-log-rotation.ssh-lockout", title: "Hardening ssh without a lockout", detail: "Disable password login only after verifying key login in a second session, validate with sshd -t, and allow ssh in the firewall first.", question: "What do you do before disabling password authentication?" },
      { id: "devops.practice-server-setup-and-log-rotation.logrotate", title: "Rotating logs with logrotate", detail: "A file in /etc/logrotate.d/ sets frequency, retention and compression. copytruncate suits apps that do not reopen their log file.", question: "What is the trade-off of copytruncate?" },
      { id: "devops.practice-server-setup-and-log-rotation.verify", title: "Verifying with dry runs", detail: "logrotate -d, ufw status and a second run of the script confirm the result without guessing.", question: "How do you test a logrotate config without rotating anything?" },
    ],
  },
};
