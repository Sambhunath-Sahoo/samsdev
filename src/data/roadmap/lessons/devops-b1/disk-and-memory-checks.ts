import type { LessonEntry } from "@/types/roadmap";

export const DISK_AND_MEMORY_CHECKS: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Disk and memory checks: df, du, free, find",
    slug: "disk-and-memory-checks",
    lesson: {
      summary: "Find out what is filling a disk and how much memory is really available, using df, du, free and find.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why these four commands" },
        { type: "p", text: "A full disk is one of the most common reasons a server stops working: databases cannot write, logs cannot rotate, deploys fail halfway. Memory pressure is the second. These commands answer the first questions in a minute: how full is it, what is using the space, and is memory the problem?" },
        { type: "h2", text: "df: how full is each filesystem" },
        { type: "code", language: "bash", code: `df -h            # human-readable sizes per mounted filesystem
df -h /var       # only the filesystem that holds /var
df -i            # inodes: running out of these also reports "disk full"` },
        { type: "p", text: "Look at the **Use%** column and at the mount point. A small root filesystem with a separate large data disk is common, so check the right one." },
        { type: "h2", text: "du: what is using the space" },
        { type: "code", language: "bash", code: `sudo du -xh --max-depth=1 /var | sort -h | tail -8
sudo du -sh /var/log/* | sort -h | tail
du -sh node_modules .next 2>/dev/null` },
        { type: "p", text: "`-s` summarises one total, `--max-depth=1` shows one level, and `-x` stays on one filesystem so you do not wander into other mounts. Pipe through `sort -h`, which understands `K`, `M` and `G`. Repeat the command one directory deeper until you find the culprit." },
        { type: "h2", text: "free: memory" },
        { type: "code", language: "bash", code: `$ free -h
               total   used   free  shared  buff/cache  available
Mem:           3.8Gi  1.1Gi  310Mi    12Mi       2.4Gi      2.4Gi
Swap:          2.0Gi     0B  2.0Gi` },
        { type: "p", text: "Do not read the `free` column as spare memory. Linux uses idle RAM for the page cache and gives it back when programs need it. The **available** column is the estimate of memory a new program could use, and that is the number to watch. Heavy use of swap together with low available memory means the box is short of RAM." },
        { type: "h2", text: "find: locate the big and old files" },
        { type: "code", language: "bash", code: `sudo find /var/log -type f -size +100M -exec ls -lh {} +
find /tmp -type f -mtime +7                 # older than 7 days
find /var/log -name "*.gz" -mtime +30 -delete   # review without -delete first
find . -name "*.log" -newer deploy.sh` },
        { type: "list", items: ["Typical space eaters: unrotated logs, Docker images and volumes (`docker system df`), old kernels, package caches, core dumps, and uploaded files.", "Deleted files that a process still holds open keep their space until the process exits. `sudo lsof +L1` lists them, and a service restart frees the space.", "Set an alert at about 80% disk use so you hear about it before it is an outage."] },
        { type: "callout", tone: "gotcha", title: "Run find without -delete first", text: "`find ... -delete` has no undo and no confirmation, and the order of its tests matters. Run the same command ending in `-print` or `-exec ls -lh {} +`, read the list, and only then switch to `-delete`." },
      ],
      references: [
        { title: "df invocation - GNU Coreutils", url: "https://www.gnu.org/software/coreutils/manual/html_node/df-invocation.html" },
        { title: "du invocation - GNU Coreutils", url: "https://www.gnu.org/software/coreutils/manual/html_node/du-invocation.html" },
        { title: "free(1) - Linux manual page", url: "https://man7.org/linux/man-pages/man1/free.1.html" },
        { title: "GNU Findutils manual: finding files", url: "https://www.gnu.org/software/findutils/manual/html_mono/find.html" },
      ],
    },
    points: [
      { id: "devops.disk-and-memory-checks.df", title: "Checking free space with df", detail: "df -h shows used and available space per filesystem, and df -i shows inode use. Either can be full while the other looks fine.", question: "A disk shows 40% used but writes fail. Which df option do you try?" },
      { id: "devops.disk-and-memory-checks.du", title: "Finding the culprit with du", detail: "du -xh --max-depth=1 piped to sort -h shows the largest directories one level at a time. Repeat deeper until the large item appears.", question: "Why add -x when running du on /?" },
      { id: "devops.disk-and-memory-checks.free", title: "Reading free correctly", detail: "Linux uses idle memory as cache, so the free column is misleading. The available column estimates what programs can still use.", question: "Which column of free tells you whether the server is short of memory?" },
      { id: "devops.disk-and-memory-checks.find", title: "Searching with find", detail: "find filters by type, size, name and age, and can run a command on each match. Preview the list before using -delete.", question: "Write a find command listing files over 100 MB under /var/log." },
    ],
  },
};
