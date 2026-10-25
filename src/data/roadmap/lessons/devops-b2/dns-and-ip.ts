import type { LessonEntry } from "@/types/roadmap";

export const DNS_AND_IP: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "DNS and IP",
    slug: "dns-and-ip",
    lesson: {
      summary: "IP addresses locate machines, DNS maps names to those addresses, and most launch-day surprises come from caching and wrong records.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "IP addresses" },
        { type: "p", text: "Every machine on a network has an IP address. IPv4 uses four numbers like `203.0.113.10`, and IPv6 uses longer hexadecimal addresses like `2001:db8::1`. Some IPv4 ranges are **private** and not routable on the internet: `10.0.0.0/8`, `172.16.0.0/12` and `192.168.0.0/16`. Your laptop, and servers inside a cloud VPC, normally have a private address, with a public one attached or shared through NAT." },
        { type: "p", text: "The `/24` in `10.0.1.0/24` is CIDR notation. It says the first 24 bits are the network and the rest identify hosts, so that block holds 256 addresses. You will meet this again in security groups and VPC subnets." },
        { type: "h2", text: "What DNS does" },
        { type: "p", text: "Nobody wants to type an IP address, and IPs change when you move servers. DNS is the distributed directory that turns `api.example.com` into an address. Your machine asks a **recursive resolver** (your ISP, your office, or something like `1.1.1.1`). The resolver walks the tree if it has no cached answer: root servers point to the `.com` servers, those point to the nameservers for `example.com`, and those give the final answer. The resolver caches it and hands it back." },
        { type: "h2", text: "Record types" },
        {
          type: "table",
          head: ["Type", "Maps", "Example"],
          rows: [
            ["`A`", "Name to IPv4", "`api` -> `203.0.113.10`"],
            ["`AAAA`", "Name to IPv6", "`api` -> `2001:db8::1`"],
            ["`CNAME`", "Name to another name", "`www` -> `example.com`"],
            ["`MX`", "Mail servers for a domain", "`10 mail.example.com`"],
            ["`TXT`", "Free text (domain verification, SPF)", "`v=spf1 ...`"],
            ["`NS`", "Which servers are authoritative", "`ns1.provider.net`"],
          ],
        },
        { type: "p", text: "A `CNAME` cannot sit at the bare domain (`example.com`) because that name must also hold `NS` and `SOA` records. Providers work around this with proprietary alias records, such as Route 53's alias type." },
        { type: "h2", text: "TTL and caching" },
        { type: "p", text: "Each record has a **TTL**, the number of seconds resolvers may cache it. With a TTL of 3600, a changed record can take up to an hour to reach everyone, and you cannot force other people's resolvers to forget it. The standard move before a migration is to lower the TTL to 60 or 300 a day ahead, change the record, then raise it again after things settle." },
        {
          type: "code",
          language: "bash",
          code: `dig +short A api.example.com           # the IPv4 address(es)
dig api.example.com                    # full answer with TTL remaining
dig +short NS example.com              # who is authoritative
dig @1.1.1.1 api.example.com           # ask a specific resolver`,
        },
        { type: "callout", tone: "gotcha", title: "Propagation is mostly cached answers", text: "DNS does not push changes out. Old answers simply expire at different times, so two people can see different results for the same name. Also remember your own machine caches (browser, OS), so a stale lookup may be local. Query the authoritative server directly with `dig @ns1.provider.net name` to see what is really configured." },
        { type: "p", text: "Common mistakes: pointing an `A` record at an EC2 public IP that changes on stop and start (attach an Elastic IP), forgetting that a `CNAME` plus another record at the same name is invalid, and deleting a record while something still depends on it. When a site is unreachable, always ask first: does the name resolve, and to the address I expect?" },
      ],
      references: [
        { title: "Domain Name System - Wikipedia", url: "https://en.wikipedia.org/wiki/Domain_Name_System" },
        { title: "RFC 1035: Domain names - implementation and specification", url: "https://www.rfc-editor.org/rfc/rfc1035" },
        { title: "IPv4 - Wikipedia", url: "https://en.wikipedia.org/wiki/IPv4" },
        { title: "What is Amazon Route 53?", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" },
      ],
    },
    points: [
      {
        id: "devops.dns-and-ip.private-ranges",
        title: "Private IP ranges and CIDR",
        detail: "`10.0.0.0/8`, `172.16.0.0/12` and `192.168.0.0/16` are not routable on the internet. A `/24` block has 256 addresses, which is how subnets and security group rules are written.",
        question: "How many addresses are in a /24 block?",
      },
      {
        id: "devops.dns-and-ip.record-types",
        title: "A, CNAME, MX, TXT and NS records",
        detail: "`A` and `AAAA` map names to addresses and `CNAME` maps to another name. `MX` routes mail, `TXT` carries verification data, and `NS` names the authoritative servers.",
        question: "Why can a CNAME not be used at the root of a domain?",
      },
      {
        id: "devops.dns-and-ip.ttl",
        title: "TTL and DNS changes",
        detail: "TTL is how long resolvers may cache an answer. Lower it before a migration so the change spreads quickly, then raise it again afterwards.",
        question: "What would you do a day before moving a site to a new server IP?",
      },
    ],
  },
};
