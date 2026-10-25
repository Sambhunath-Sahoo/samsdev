import type { LessonEntry } from "@/types/roadmap";

export const HOST_FIREWALLS_UFW_IPTABLES: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "Host firewalls: ufw and iptables",
    slug: "host-firewalls-ufw-iptables",
    lesson: {
      summary: "Use ufw to allow only the ports a server needs, and understand how iptables rules underneath are matched in order.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "A second wall inside the server" },
        { type: "p", text: "A cloud security group filters traffic before it reaches your instance. A **host firewall** filters on the machine itself. Having both is cheap defence in depth: if someone opens a security group too wide, or you run on a provider with no network firewall, the host still refuses unexpected connections." },
        { type: "p", text: "On Linux the packet filter is in the kernel (netfilter) and is driven by `iptables` or the newer `nftables`. `ufw` (Uncomplicated Firewall), the default on Ubuntu, is a friendly front end that writes those rules for you." },
        { type: "h2", text: "ufw: the safe sequence" },
        { type: "p", text: "The order matters. Set the defaults, allow SSH, and only then enable, otherwise you can lock yourself out of a remote machine." },
        {
          type: "code",
          language: "bash",
          code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH                 # or: sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 203.0.113.5 to any port 5432 proto tcp   # DB for one IP only
sudo ufw enable
sudo ufw status numbered               # list rules with numbers
sudo ufw delete 4                      # remove rule number 4`,
        },
        { type: "p", text: "The last allow rule shows the real value of a firewall: a database port reachable from one trusted address instead of the world. If the machine only needs a port locally, do not open it at all." },
        { type: "h2", text: "iptables: chains and order" },
        { type: "p", text: "iptables organises rules into **chains**. The ones you meet most are `INPUT` (traffic to this host), `OUTPUT` (traffic from it) and `FORWARD` (traffic routed through it). A packet walks a chain top to bottom and the **first matching rule decides** its fate. If nothing matches, the chain's default policy applies." },
        {
          type: "code",
          language: "bash",
          code: `sudo iptables -L INPUT -n -v --line-numbers     # list rules with hit counters
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -P INPUT DROP                      # default policy: drop the rest`,
        },
        { type: "p", text: "The first rule accepts replies to connections the host started, which is what makes the default drop workable. Without it, even your own outbound requests would lose their responses. Note that plain `iptables` changes vanish on reboot unless saved with something like `iptables-persistent`. ufw handles persistence for you." },
        {
          type: "table",
          head: ["Action", "What the sender sees"],
          rows: [
            ["`DROP` / ufw `deny`", "Nothing, the connection times out"],
            ["`REJECT`", "An immediate refusal"],
            ["`ACCEPT` / ufw `allow`", "The connection goes through"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Docker bypasses ufw for published ports", text: "Docker inserts its own iptables rules, so a container started with `-p 5432:5432` can be reachable from the internet even when ufw says that port is denied. Bind it to localhost with `-p 127.0.0.1:5432:5432`, or filter in the cloud security group." },
        { type: "p", text: "Common mistakes: enabling the firewall before allowing SSH, opening a port to `0.0.0.0/0` when one source IP would do, and putting a broad `ACCEPT` above a specific `DROP` so the later rule never matches. Keep a second session open when changing rules on a live server, and confirm the new rules work before closing it." },
      ],
      references: [
        { title: "Firewall - Ubuntu Server documentation", url: "https://documentation.ubuntu.com/server/how-to/security/firewalls/" },
        { title: "Ubuntu Manpage: ufw - program for managing a netfilter firewall", url: "https://manpages.ubuntu.com/manpages/noble/en/man8/ufw.8.html" },
        { title: "iptables(8) - Linux manual page", url: "https://man7.org/linux/man-pages/man8/iptables.8.html" },
      ],
    },
    points: [
      {
        id: "devops.host-firewall.defense-in-depth",
        title: "Host firewall plus security group",
        detail: "A host firewall protects the machine even if the cloud security group is too open. Default deny incoming and allow only the ports the server serves.",
        question: "Why keep a host firewall when the cloud already has security groups?",
      },
      {
        id: "devops.host-firewall.ufw-order",
        title: "Allow SSH before enabling ufw",
        detail: "Set the default policies, allow SSH, add other rules, then enable. Enabling first can cut your own remote session.",
        question: "What happens if you run `ufw enable` before allowing SSH on a remote server?",
      },
      {
        id: "devops.host-firewall.first-match",
        title: "iptables is first match wins",
        detail: "Packets walk a chain from the top, and the first matching rule decides. Rule order and the default policy therefore matter as much as the rules themselves.",
        question: "Why might a DROP rule for one IP have no effect?",
      },
      {
        id: "devops.host-firewall.docker-bypass",
        title: "Docker published ports and ufw",
        detail: "Docker writes its own iptables rules, so published ports can bypass ufw. Bind to 127.0.0.1 or filter at the security group.",
        question: "How do you publish a container port so it is reachable only from the host itself?",
      },
    ],
  },
};
