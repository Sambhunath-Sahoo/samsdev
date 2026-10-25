import type { LessonEntry } from "@/types/roadmap";

export const PROCESSES_AND_SERVICES: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Processes and services: ps, systemctl, journalctl",
    slug: "processes-and-services",
    lesson: {
      summary: "Find a running process, manage a service with systemd, and read its logs when it misbehaves.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Processes: what is running" },
        { type: "p", text: "A process is a running program with a numeric PID, an owner and a parent. `ps` takes a snapshot, `top` or `htop` shows a live view. Two forms of `ps` cover most needs:" },
        { type: "code", language: "bash", code: `ps aux | head                       # every process, with CPU and memory share
ps -eo pid,ppid,user,%mem,%cpu,etime,cmd --sort=-%mem | head -5
pgrep -af nginx                     # find by name, show the full command line
kill 4321                           # ask politely (SIGTERM)
kill -9 4321                        # force (SIGKILL), last resort` },
        { type: "p", text: "`SIGTERM` lets a program clean up and exit. `SIGKILL` cannot be caught, so the program loses unsaved state. Try the first and wait a few seconds before the second." },
        { type: "h2", text: "Services: systemd keeps them running" },
        { type: "p", text: "On most modern distributions the first process, PID 1, is **systemd**. It starts services at boot, restarts them when they crash and records their output. You talk to it with `systemctl`." },
        { type: "table", head: ["Command", "Purpose"], rows: [["`systemctl status nginx`", "State, PID, and the last log lines"], ["`sudo systemctl start|stop|restart nginx`", "Change state right now"], ["`sudo systemctl reload nginx`", "Re-read config without dropping connections, if supported"], ["`sudo systemctl enable --now nginx`", "Start at boot and start immediately"], ["`systemctl list-units --failed`", "Everything that is currently broken"]] },
        { type: "h2", text: "Writing your own unit" },
        { type: "p", text: "A unit file describes how to run your app. Put it in `/etc/systemd/system/` and tell systemd to re-read its files." },
        { type: "code", language: "ini", title: "/etc/systemd/system/myapp.service", code: `[Unit]
Description=My API
After=network-online.target
Wants=network-online.target

[Service]
User=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp.env
ExecStart=/opt/myapp/bin/server --port 8000
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target` },
        { type: "code", language: "bash", code: `sudo systemctl daemon-reload
sudo systemctl enable --now myapp
systemctl status myapp` },
        { type: "h2", text: "journalctl: reading the logs" },
        { type: "p", text: "systemd collects each service's stdout and stderr in the journal, so your app does not need to manage log files." },
        { type: "code", language: "bash", code: `journalctl -u myapp -n 50 --no-pager      # last 50 lines
journalctl -u myapp -f                    # follow live
journalctl -u myapp --since "1 hour ago" -p err
journalctl -b -p warning                  # this boot, warnings and worse` },
        { type: "callout", tone: "gotcha", title: "Forgetting daemon-reload", text: "After editing a unit file, `systemctl restart` still uses the old definition until you run `systemctl daemon-reload`. Newer systemd prints a warning, but it is easy to miss. Also remember that `start` does not survive a reboot; `enable` does." },
        { type: "p", text: "A reliable debugging order when a service will not start: `systemctl status` for the exit code, `journalctl -u` for the error message, then run the `ExecStart` command by hand as the same user to see what it says. Most failures are a wrong path, a missing environment variable, a port already in use (`ss -ltnp`) or a permission problem." },
      ],
      references: [
        { title: "systemctl(1) - Linux manual page", url: "https://man7.org/linux/man-pages/man1/systemctl.1.html" },
        { title: "journalctl(1) - Linux manual page", url: "https://man7.org/linux/man-pages/man1/journalctl.1.html" },
        { title: "systemd.service(5) - Linux manual page", url: "https://man7.org/linux/man-pages/man5/systemd.service.5.html" },
        { title: "ps(1) - Linux manual page", url: "https://man7.org/linux/man-pages/man1/ps.1.html" },
      ],
    },
    points: [
      { id: "devops.processes-and-services.ps-kill", title: "Finding and stopping processes", detail: "ps and pgrep locate a process by name or resource use. kill sends SIGTERM by default, which allows a clean exit, and SIGKILL is the force option.", question: "Why try kill before kill -9?" },
      { id: "devops.processes-and-services.systemctl", title: "Managing services with systemctl", detail: "start and stop act now, enable controls start at boot, and reload re-reads config when the service supports it. status shows the state and the recent log.", question: "What is the difference between start and enable?" },
      { id: "devops.processes-and-services.unit-file", title: "Unit files and daemon-reload", detail: "A unit file sets the user, working directory, command and restart policy. Run daemon-reload after editing so systemd picks up the change.", question: "Which unit setting restarts a crashed service, and what must you run after changing it?" },
      { id: "devops.processes-and-services.journalctl", title: "Reading logs with journalctl", detail: "journalctl -u shows one service's output and supports -f, --since and -p filters. It is the first place to look when a service fails.", question: "Which command shows only errors from myapp in the last hour?" },
    ],
  },
};
