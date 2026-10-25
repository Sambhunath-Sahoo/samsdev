import type { LessonEntry } from "@/types/roadmap";

export const CRON_SSH_REMOTE_WORK: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Cron, ssh and remote work",
    slug: "cron-ssh-and-remote-work",
    lesson: {
      summary: "Schedule recurring jobs with cron and reach a server securely with ssh keys, a config file and tunnels.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "ssh: a secure shell on another machine" },
        { type: "p", text: "SSH gives you an encrypted login and command channel. Passwords are weak, so servers should use **key pairs**: a private key that stays on your laptop and a public key that you place on the server." },
        { type: "code", language: "bash", code: `ssh-keygen -t ed25519 -C "laptop"            # creates ~/.ssh/id_ed25519 and .pub
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@203.0.113.10
ssh ubuntu@203.0.113.10                     # log in
ssh ubuntu@203.0.113.10 'df -h /'           # run one command and return` },
        { type: "p", text: "The server keeps allowed public keys in `~/.ssh/authorized_keys`. The `.ssh` directory must be `700` and the file `600`, or sshd ignores them. On AWS you receive a key pair at launch and the file must be `chmod 400`." },
        { type: "code", language: "ini", title: "~/.ssh/config", code: `Host web
  HostName 203.0.113.10
  User ubuntu
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30

Host db-internal
  HostName 10.0.2.15
  User ubuntu
  ProxyJump web` },
        { type: "p", text: "With that file, `ssh web` is enough, and `ssh db-internal` hops through the bastion host. For a database reachable only from the server, forward a port: `ssh -L 5433:10.0.2.15:5432 web` makes it appear on `localhost:5433`." },
        { type: "h2", text: "cron: run things on a schedule" },
        { type: "p", text: "cron runs commands at fixed times. Edit your table with `crontab -e`, list it with `crontab -l`. Each line has five time fields and a command." },
        { type: "code", language: "text", code: `# min hour day-of-month month day-of-week  command
*/5  *    *            *     *            /opt/myapp/bin/healthcheck.sh
30   2    *            *     *            /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
0    9    *            *     1-5          /opt/myapp/bin/report.sh
@reboot                                    /opt/myapp/bin/start-worker.sh` },
        { type: "table", head: ["Field", "Range"], rows: [["minute", "0-59"], ["hour", "0-23"], ["day of month", "1-31"], ["month", "1-12"], ["day of week", "0-7 (0 and 7 are Sunday)"]] },
        { type: "list", items: ["Use **absolute paths**. cron's `PATH` is short and it does not read your profile.", "Redirect output, as above, or cron tries to mail it to a mailbox nobody reads.", "cron uses the server's timezone, usually UTC on cloud machines.", "A job that overruns can overlap with the next run. Guard long jobs with `flock -n /tmp/backup.lock command`.", "Check that cron ran it with `journalctl -u cron` (Debian family) or `journalctl -u crond` (Red Hat family)."] },
        { type: "callout", tone: "gotcha", title: "Works in the terminal, fails in cron", text: "Nearly always an environment difference: a missing `PATH` entry, a relative path, or a variable that only your profile sets. Test with `env -i /bin/bash --noprofile --norc -c '/path/to/script.sh'`, which approximates cron's bare environment." },
      ],
      references: [
        { title: "ssh(1) - OpenBSD manual page", url: "https://man.openbsd.org/ssh" },
        { title: "ssh_config(5) - OpenBSD manual page", url: "https://man.openbsd.org/ssh_config" },
        { title: "ssh-keygen(1) - OpenBSD manual page", url: "https://man.openbsd.org/ssh-keygen" },
        { title: "crontab(5) - Linux manual page", url: "https://man7.org/linux/man-pages/man5/crontab.5.html" },
      ],
    },
    points: [
      { id: "devops.cron-ssh-and-remote-work.keys", title: "ssh key pairs", detail: "The private key stays with you and the public key goes into authorized_keys on the server. Keys replace passwords and sshd rejects them when permissions are too open.", question: "Which file on the server lists the public keys allowed to log in, and what permissions must it have?" },
      { id: "devops.cron-ssh-and-remote-work.config-jump", title: "ssh config and ProxyJump", detail: "A Host entry in ~/.ssh/config stores user, address and key under a short name. ProxyJump reaches private servers through a bastion host.", question: "How would you reach a private database server through a public bastion in one command?" },
      { id: "devops.cron-ssh-and-remote-work.crontab", title: "Reading a crontab line", detail: "Five fields give minute, hour, day of month, month and day of week, followed by the command. Redirect output and use absolute paths.", question: "What does 30 2 * * * mean, and in which timezone does it run?" },
      { id: "devops.cron-ssh-and-remote-work.cron-env", title: "Cron's minimal environment", detail: "Jobs get a short PATH and none of your profile. Overlapping runs can be prevented with flock.", question: "Why can a script that works from the shell fail under cron?" },
    ],
  },
};
