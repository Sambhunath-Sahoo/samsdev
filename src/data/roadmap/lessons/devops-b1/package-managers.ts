import type { LessonEntry } from "@/types/roadmap";

export const PACKAGE_MANAGERS: LessonEntry = {
  track: "devops",
  section: "Linux and shell",
  subsection: {
    title: "Package managers: apt, yum, snap",
    slug: "package-managers-apt-yum-snap",
    lesson: {
      summary: "Install, update and remove software on Debian and Red Hat family servers, and know when snap is the better or worse choice.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What a package manager does" },
        { type: "p", text: "A package manager installs software from a trusted repository, pulls in the libraries it depends on, records which files belong to which package, and applies security updates in one step. That beats downloading a tarball and copying it into `/usr/local`, because you can later list, verify, upgrade and cleanly remove what you installed." },
        { type: "table", head: ["Family", "Distributions", "Tool"], rows: [["Debian", "Debian, Ubuntu", "`apt` (over `dpkg`)"], ["Red Hat", "RHEL, Rocky, Alma, Fedora, Amazon Linux", "`dnf` (older: `yum`; over `rpm`)"], ["Cross-distro", "Ubuntu by default, many others", "`snap`"]] },
        { type: "p", text: "On current Red Hat family systems `yum` is normally an alias for `dnf`, so the commands below work with either name. Amazon Linux 2 still uses real `yum`; Amazon Linux 2023 uses `dnf`." },
        { type: "h2", text: "Everyday commands" },
        { type: "code", language: "bash", title: "Debian / Ubuntu", code: `sudo apt update                    # refresh the package index
sudo apt install -y nginx          # install
apt show nginx                     # details and dependencies
apt search "^redis"                # search names
sudo apt upgrade                   # install newer versions
sudo apt remove nginx              # remove, keep config
sudo apt purge nginx               # remove, delete config too
sudo apt autoremove                # drop unused dependencies
dpkg -L nginx-common | head        # files a package installed` },
        { type: "code", language: "bash", title: "RHEL family", code: `sudo dnf makecache
sudo dnf install -y nginx
dnf info nginx
sudo dnf upgrade
sudo dnf remove nginx
rpm -ql nginx | head               # files a package installed` },
        { type: "code", language: "bash", title: "snap", code: `snap find code
sudo snap install code --classic
snap list
sudo snap refresh                  # snaps also update themselves automatically` },
        { type: "h2", text: "Adding a third-party repository" },
        { type: "p", text: "Distribution repositories lag behind upstream, so tools such as Docker or Node.js publish their own repositories. The pattern is to add the vendor's signing key and a source line, then `apt update`. Download the key to a keyring file and scope the source to it with `signed-by`, instead of trusting the key for every repository. Follow the vendor's current install page for the exact lines, since they change." },
        { type: "list", items: ["**Pin versions** of production packages (`apt-mark hold nginx` on Debian family, `dnf versionlock` on Red Hat family) so an upgrade does not change a runtime under you.", "**Unattended security updates** (`unattended-upgrades` on Debian family, `dnf-automatic` on Red Hat family) are a sensible default for small servers.", "In Dockerfiles, run `apt-get update` and `apt-get install` in the same `RUN` line and clean the lists, or the cache layer goes stale."] },
        { type: "callout", tone: "gotcha", title: "update is not upgrade", text: "On apt, `update` only refreshes the list of available versions. `upgrade` installs them. Installing without a recent `update` often fails with \"Unable to locate package\" or fetches an old version. In scripts, add `-y` and set `DEBIAN_FRONTEND=noninteractive` so nothing waits for a prompt." },
      ],
      references: [
        { title: "Apt - Debian Wiki", url: "https://wiki.debian.org/Apt" },
        { title: "DNF - Fedora Quick Docs", url: "https://docs.fedoraproject.org/en-US/quick-docs/dnf/" },
        { title: "Snapcraft documentation", url: "https://snapcraft.io/docs" },
      ],
    },
    points: [
      { id: "devops.package-managers-apt-yum-snap.update-vs-upgrade", title: "apt update vs apt upgrade", detail: "update refreshes the index of available packages and upgrade installs newer versions. Run update before installing so you do not get stale or missing packages.", question: "Why does apt install sometimes say Unable to locate package?" },
      { id: "devops.package-managers-apt-yum-snap.families", title: "Debian family vs Red Hat family", detail: "Debian and Ubuntu use apt and dpkg, while RHEL, Rocky and Amazon Linux use dnf or yum and rpm. The concepts match but the command names differ.", question: "Which command lists the files installed by a package on Ubuntu, and which on Rocky Linux?" },
      { id: "devops.package-managers-apt-yum-snap.snap", title: "What snap is for", detail: "Snap bundles an app with its dependencies and updates itself automatically. That is convenient on desktops and for tools like CLIs, but surprising on servers where you want control over versions.", question: "What is one risk of automatic snap refreshes on a production server?" },
      { id: "devops.package-managers-apt-yum-snap.holds", title: "Pinning, holds and third-party repos", detail: "Hold or pin production packages so upgrades do not change runtimes unexpectedly. Add vendor repositories with a scoped signing key.", question: "How would you stop nginx from being upgraded by routine apt upgrade?" },
    ],
  },
};
