import type { LessonEntry } from "@/types/roadmap";

export const FILESYSTEM_PERMISSIONS: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Filesystem and permissions",
    slug: "filesystem-and-permissions",
    lesson: {
      summary: "Know where things live on a Linux server and read, set and fix the owner and mode bits that decide who can touch them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "One tree, a few important directories" },
        { type: "p", text: "Linux has a single directory tree starting at `/`. Disks and network shares are mounted somewhere inside it rather than getting drive letters. You will keep visiting the same few places, so learn them." },
        { type: "table", head: ["Path", "What lives there"], rows: [["`/etc`", "System-wide configuration files"], ["`/var/log`", "Logs; `/var/lib` holds service data"], ["`/home`", "Personal directories of normal users"], ["`/tmp`", "Scratch space, cleared on reboot or by a timer"], ["`/usr/bin`, `/usr/local/bin`", "Installed programs"], ["`/opt`", "Self-contained third-party software"], ["`/proc`, `/sys`", "Virtual files that expose the kernel and processes"]] },
        { type: "h2", text: "Reading the permission bits" },
        { type: "p", text: "Every file has an owner, a group and a mode. `ls -l` shows them:" },
        { type: "code", language: "bash", code: `$ ls -l deploy.sh
-rwxr-x--- 1 alice devs 412 Oct 20 10:02 deploy.sh` },
        { type: "p", text: "The first character is the type (`-` file, `d` directory, `l` symlink). The next nine are three triples for the **owner**, the **group** and **everyone else**, each made of read (`r`), write (`w`) and execute (`x`). Here alice can read, write and run the file, members of `devs` can read and run it, and nobody else can do anything." },
        { type: "p", text: "On a directory the bits mean something different: `r` lets you list names, `w` lets you create and delete entries inside it, and `x` lets you enter it and reach files through it. Without `x` on a directory you cannot open anything below it, even if the file itself is world-readable." },
        { type: "h2", text: "Changing mode and ownership" },
        { type: "p", text: "Modes are often written as octal: read is 4, write is 2, execute is 1, added per triple. So `750` is `rwxr-x---` and `644` is `rw-r--r--`." },
        { type: "code", language: "bash", code: `chmod 750 deploy.sh          # numeric
chmod u+x,g-w,o-rwx deploy.sh   # symbolic: add, remove, remove
chmod -R g+rX /srv/app          # capital X: execute only on directories
sudo chown alice:devs deploy.sh # change owner and group
sudo chown -R www-data: /var/www/site   # trailing colon = that user's login group` },
        { type: "h2", text: "A worked example: a deploy directory" },
        { type: "p", text: "Suppose a web server runs as `www-data` and a deploy user pushes files into `/srv/site`. Give the directory to the deploy user, make the group `www-data`, and let the group read but not write. Add the setgid bit on the directory so new files inherit the group." },
        { type: "code", language: "bash", code: `sudo mkdir -p /srv/site
sudo chown deploy:www-data /srv/site
sudo chmod 2750 /srv/site     # 2 = setgid, so new files get group www-data
ls -ld /srv/site              # drwxr-s--- 2 deploy www-data ...
namei -l /srv/site/index.html # shows permissions on every path component` },
        { type: "p", text: "`namei -l` is the fastest way to find out why a file is unreadable: it prints the mode of each directory on the way, and the culprit is usually a parent directory missing `x`." },
        { type: "list", items: ["**umask** sets which bits are removed from new files. A umask of `022` gives files `644` and directories `755`.", "**sudo** runs one command as root; use it for the command, not for a whole session.", "**Symlinks** are pointers; permissions that count are those of the target.", "**Sticky bit** (`/tmp` is `1777`) lets everyone create files but only owners delete their own."] },
        { type: "callout", tone: "gotcha", title: "chmod 777 is not a fix", text: "When something says \"permission denied\", the answer is rarely to open the file to the world. It hides the real problem, which is usually the wrong owner or a parent directory without `x`, and it leaves secrets readable by every user and process on the box. Find out which user the process runs as, then give that user, or its group, exactly what it needs." },
      ],
      references: [
        { title: "chmod(1) - Linux manual page", url: "https://man7.org/linux/man-pages/man1/chmod.1.html" },
        { title: "inode(7) - Linux manual page", url: "https://man7.org/linux/man-pages/man7/inode.7.html" },
        { title: "path_resolution(7) - Linux manual page", url: "https://man7.org/linux/man-pages/man7/path_resolution.7.html" },
        { title: "Filesystem Hierarchy Standard", url: "https://refspecs.linuxfoundation.org/fhs.shtml" },
      ],
    },
    points: [
      { id: "devops.filesystem-and-permissions.mode-bits", title: "Reading and setting mode bits", detail: "A mode is three triples of read, write and execute for owner, group and others, written symbolically or as octal such as 750. On directories, x means you may enter and reach files inside.", question: "What does 640 mean, and which user class can write to the file?" },
      { id: "devops.filesystem-and-permissions.ownership", title: "Owner, group and chown", detail: "Ownership decides which triple applies to a process. Giving a service its own user and sharing files through a group is safer than widening the mode.", question: "A service runs as www-data but cannot read a file owned by deploy. What are two ways to fix it without 777?" },
      { id: "devops.filesystem-and-permissions.namei", title: "Debugging permission denied", detail: "Check the process user, the file mode and every parent directory's x bit. namei -l prints all of them in one command.", question: "A file is mode 644 but still unreadable. Which command shows why?" },
      { id: "devops.filesystem-and-permissions.special-bits", title: "umask, setgid and sticky bit", detail: "umask removes bits from new files, setgid on a directory makes new files inherit its group, and the sticky bit stops users deleting each other's files in shared directories.", question: "Why is /tmp mode 1777 and not 777?" },
    ],
  },
};
