import type { LessonEntry } from "@/types/roadmap";

export const FILE_TRANSFER_SCP_RSYNC: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "File transfer: scp and rsync",
    slug: "file-transfer-scp-and-rsync",
    lesson: {
      summary: "Copy files to and from servers over ssh, and use rsync to sync directories efficiently and safely.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Two tools over the same channel" },
        { type: "p", text: "Both `scp` and `rsync` use ssh, so they reuse your keys and your `~/.ssh/config` host names. `scp` is the quick one-off copy. `rsync` compares source and destination and sends only what changed, which makes it the better choice for directories and for anything you will run more than once." },
        { type: "h2", text: "scp" },
        { type: "code", language: "bash", code: `scp report.pdf web:/home/ubuntu/                 # upload one file
scp web:/var/log/nginx/error.log ./              # download
scp -r ./dist web:/srv/site/                     # recursive directory
scp -i ~/.ssh/key.pem -P 2222 a.txt user@host:/tmp/   # key and port (capital P)` },
        { type: "p", text: "Note that scp's port flag is capital `-P`, while ssh uses lowercase `-p`. Recent OpenSSH versions run scp over the SFTP protocol internally, but the command line is the same." },
        { type: "h2", text: "rsync" },
        { type: "code", language: "bash", code: `rsync -avz ./dist/ web:/srv/site/                # archive, verbose, compress
rsync -avz --delete ./dist/ web:/srv/site/       # mirror: remove extra files at destination
rsync -avzn --delete ./dist/ web:/srv/site/      # -n: dry run, change nothing
rsync -az --exclude node_modules --exclude '.env' ./app/ web:/opt/app/
rsync -avz --progress web:/var/backups/ ./backups/   # pull from the server
rsync -az -e "ssh -i ~/.ssh/key.pem" ./dist/ ubuntu@203.0.113.10:/srv/site/` },
        { type: "table", head: ["Flag", "Meaning"], rows: [["`-a`", "Archive: recurse and keep permissions, times, symlinks, owner and group where allowed"], ["`-v`", "Verbose: list what is copied"], ["`-z`", "Compress during transfer"], ["`-n` / `--dry-run`", "Show what would happen"], ["`--delete`", "Delete files at the destination that no longer exist at the source"], ["`--exclude`", "Skip matching paths"]] },
        { type: "h2", text: "The trailing slash" },
        { type: "p", text: "A trailing slash on the **source** changes the meaning. `rsync -a dist/ web:/srv/site/` copies the contents of `dist` into `/srv/site`. `rsync -a dist web:/srv/site/` creates `/srv/site/dist`. The slash on the destination makes no difference." },
        { type: "list", items: ["Use rsync for deploys of static files and for backups to another host.", "After an interrupted large transfer, run the same command again; rsync resumes by skipping what already matches (`--partial` also keeps half-sent files).", "For huge one-time copies where the network is the limit, check the transfer with `rsync -avc` (checksums) afterwards.", "Both tools overwrite existing files without asking."] },
        { type: "callout", tone: "gotcha", title: "--delete plus a wrong path", text: "`rsync --delete` makes the destination match the source exactly. A missing trailing slash, or a source directory that turned out empty, can wipe a live site. Always run the same command with `-n` first, read the output, then remove the `-n`." },
      ],
      references: [
        { title: "rsync(1) manual page", url: "https://download.samba.org/pub/rsync/rsync.1" },
        { title: "scp(1) - OpenBSD manual page", url: "https://man.openbsd.org/scp" },
        { title: "ssh_config(5) - OpenBSD manual page", url: "https://man.openbsd.org/ssh_config" },
      ],
    },
    points: [
      { id: "devops.file-transfer-scp-and-rsync.scp", title: "Copying with scp", detail: "scp copies a file or, with -r, a directory over ssh, in either direction. Its port flag is capital -P.", question: "Which command downloads /var/log/app.log from host web to the current directory?" },
      { id: "devops.file-transfer-scp-and-rsync.rsync-delta", title: "rsync sends only differences", detail: "rsync compares both sides and transfers what changed, so repeat runs are fast and interrupted transfers resume cheaply.", question: "Why is rsync better than scp for deploying a directory repeatedly?" },
      { id: "devops.file-transfer-scp-and-rsync.trailing-slash", title: "The trailing slash on the source", detail: "A trailing slash copies the directory's contents, while no slash copies the directory itself into the destination.", question: "What is the difference between rsync -a dist/ host:/srv/ and rsync -a dist host:/srv/?" },
      { id: "devops.file-transfer-scp-and-rsync.dry-run", title: "Dry runs and --delete", detail: "--delete removes destination files not present at the source. Run with -n first to see exactly what would change.", question: "How do you preview an rsync --delete before running it?" },
    ],
  },
};
