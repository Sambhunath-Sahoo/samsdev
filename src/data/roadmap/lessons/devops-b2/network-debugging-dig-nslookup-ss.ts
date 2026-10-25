import type { LessonEntry } from "@/types/roadmap";

export const NETWORK_DEBUGGING_DIG_NSLOOKUP_SS: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "Network debugging: dig, nslookup, ss",
    slug: "network-debugging-dig-nslookup-ss",
    lesson: {
      summary: "A short checklist of dig, nslookup, ss, ping and nc that finds out whether a failure is DNS, the network, or the process itself.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Work in layers" },
        { type: "p", text: "When \"the site is down\", the cause sits in one of a few layers. Test them in order, bottom up, and stop at the first one that fails: does the name resolve, can you reach the IP, is something listening on the port, does the app answer correctly? Each tool below answers one of those questions." },
        {
          type: "table",
          head: ["Question", "Tool"],
          rows: [
            ["Does the name resolve, and to what?", "`dig`, `nslookup`"],
            ["Is the host reachable at all?", "`ping`, `traceroute`"],
            ["Is the port open from here?", "`nc -zv host port`"],
            ["Is my process listening on this machine?", "`ss -tlnp`"],
            ["Does the app answer correctly?", "`curl -v`"],
          ],
        },
        { type: "h2", text: "DNS: dig and nslookup" },
        { type: "p", text: "`dig` gives the most complete answer, including TTL and which server answered. `nslookup` is older and simpler, but it is installed on Windows too, so you will meet it there." },
        {
          type: "code",
          language: "bash",
          code: `dig +short api.example.com             # just the answer
dig api.example.com A                  # full output, check ANSWER and TTL
dig @8.8.8.8 api.example.com           # bypass your local resolver
dig +trace api.example.com             # walk root -> TLD -> authoritative
dig -x 203.0.113.10                    # reverse lookup (IP to name)
nslookup api.example.com 1.1.1.1       # same idea, other tool`,
        },
        { type: "p", text: "A useful trick: ask your normal resolver and then `@8.8.8.8`. If the answers differ, you are looking at a cache or a split-horizon (internal versus public) DNS setup. An `NXDOMAIN` status means the name does not exist, while `SERVFAIL` points at a broken resolver or zone." },
        { type: "h2", text: "Ports: ss and nc" },
        { type: "p", text: "`ss` replaced `netstat` on modern Linux and shows sockets. Run it on the server to see what is actually listening, and on which address." },
        {
          type: "code",
          language: "bash",
          code: `sudo ss -tlnp                 # TCP, listening, numeric, show process
sudo ss -tlnp | grep :3000    # who owns port 3000?
ss -tn state established      # current TCP connections
nc -zv 203.0.113.10 443       # from another machine: can I connect?
timeout 3 bash -c '</dev/tcp/203.0.113.10/5432' && echo open   # if nc is missing`,
        },
        { type: "p", text: "Read the **Local Address** column carefully. `127.0.0.1:3000` means only the machine itself can connect. `0.0.0.0:3000` or `*:3000` means all interfaces. A container app that binds to `127.0.0.1` inside the container is a classic reason that a published port refuses connections." },
        { type: "h2", text: "Interpreting the result" },
        {
          type: "list",
          items: [
            "**Connection refused**: the host answered but nothing listens on that port, or the process is bound only to localhost. Check `ss`.",
            "**Timeout**: packets are being dropped, usually by a firewall or security group, or the host is down. `ss` will not help here; check the rules.",
            "**Resolves to the wrong IP**: a stale record or cache. Compare `dig` against the authoritative server.",
            "**Connects but wrong response**: the problem is above the network layer, so go to `curl -v` and the app logs.",
          ],
        },
        { type: "callout", tone: "tip", title: "Refused and timeout mean different things", text: "Refused is a fast, explicit no, so the network path is fine and the process is the issue. A hang until timeout is silence, which almost always means a firewall in between. Telling these two apart saves most of the guessing." },
        { type: "p", text: "Common mistakes: trusting `ping` as proof of health (many hosts block ICMP while serving traffic fine), testing from your laptop when the failing client is another server, and forgetting `sudo`, in which case `ss -p` hides the process names." },
      ],
      references: [
        { title: "ss(8) - Linux manual page", url: "https://man7.org/linux/man-pages/man8/ss.8.html" },
        { title: "BIND 9 Manual Pages (dig)", url: "https://bind9.readthedocs.io/en/latest/manpages.html" },
        { title: "Domain Name System - Wikipedia", url: "https://en.wikipedia.org/wiki/Domain_Name_System" },
        { title: "curl - How To Use", url: "https://curl.se/docs/manpage.html" },
      ],
    },
    points: [
      {
        id: "devops.network-debugging.layers",
        title: "Debug bottom up",
        detail: "Check DNS, then reachability, then the listening port, then the app response. Stopping at the first failing layer avoids chasing the wrong cause.",
        question: "In what order would you check DNS, port and application when a site is unreachable?",
      },
      {
        id: "devops.network-debugging.refused-vs-timeout",
        title: "Refused versus timeout",
        detail: "Connection refused means the host answered and nothing listens on that port. A timeout means packets are being dropped, typically by a firewall or security group.",
        question: "A connection to port 5432 times out. Is the database process more likely down, or a firewall blocking?",
      },
      {
        id: "devops.network-debugging.ss-bind",
        title: "Reading ss output",
        detail: "`ss -tlnp` lists listening TCP sockets with their processes. `127.0.0.1` means local only, while `0.0.0.0` means all interfaces.",
        question: "What does a listener on 127.0.0.1:3000 mean for connections from another machine?",
      },
    ],
  },
};
