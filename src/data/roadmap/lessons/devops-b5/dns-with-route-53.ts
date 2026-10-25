import type { LessonEntry } from "@/types/roadmap";

export const DNS_WITH_ROUTE_53: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "DNS with Route 53",
    slug: "dns-with-route-53",
    lesson: {
      summary: "Point your domain at a load balancer with a hosted zone and alias records, and understand TTLs, delegation and routing policies.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What DNS does here" },
        { type: "p", text: "DNS turns `app.example.com` into an address. **Route 53** is AWS's DNS service. Its building block is a **hosted zone**: a container of records for one domain, which gets four name servers. Creating the zone does nothing by itself. The internet only uses it once your domain's registrar lists those four name servers, which is called **delegation**." },
        { type: "p", text: "You can also register domains in Route 53, but registration and hosting are separate. A domain bought elsewhere works fine if you change its name servers." },
        { type: "h2", text: "Records you will actually create" },
        {
          type: "table",
          head: ["Type", "Maps", "Example use"],
          rows: [
            ["A / AAAA", "Name to IPv4 / IPv6 address", "A fixed Elastic IP"],
            ["CNAME", "Name to another name", "`www` to `app.example.com`; not allowed at the zone apex"],
            ["Alias (Route 53 only)", "Name to an AWS resource", "`example.com` to an ALB, CloudFront or an S3 website endpoint"],
            ["MX / TXT", "Mail routing / free text", "Email delivery, domain verification, SPF"],
          ],
        },
        { type: "p", text: "A load balancer has a DNS name, not a stable IP, and you cannot put a CNAME on the bare domain (`example.com`). An **alias record** solves both: it behaves like an A record at the apex, follows the AWS resource when its addresses change, and Route 53 does not charge for alias queries to AWS resources." },
        {
          type: "code",
          language: "json",
          title: "alias.json",
          code: `{
  "Comment": "Point the apex at the ALB",
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "example.com.",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "ZALBZONEIDEXAMPLE",
        "DNSName": "myapp-alb-123456.ap-south-1.elb.amazonaws.com.",
        "EvaluateTargetHealth": true
      }
    }
  }]
}`,
        },
        {
          type: "code",
          language: "bash",
          code: `aws route53 change-resource-record-sets \\
  --hosted-zone-id Z0123456789ABC --change-batch file://alias.json
dig +short example.com
dig +short NS example.com`,
        },
        { type: "callout", tone: "gotcha", title: "Two different zone IDs", text: "The `--hosted-zone-id` argument is **your** zone. The `HostedZoneId` inside `AliasTarget` is the fixed zone ID of the **load balancer's** region, shown on the ALB's page and in `aws elbv2 describe-load-balancers` as `CanonicalHostedZoneId`. Mixing them up gives a confusing validation error." },
        { type: "h2", text: "TTL, propagation and routing policies" },
        { type: "p", text: "Every record has a **TTL**, the number of seconds resolvers may cache the answer. Lower it (say to 60) a day before a migration so a change takes effect quickly, then raise it again. Records you change are visible in Route 53 almost at once, but resolvers elsewhere keep the old answer until its TTL runs out. That wait is what people call propagation." },
        { type: "p", text: "A **routing policy** decides which answer to return. Simple returns the records as written. Weighted splits traffic by percentage, which suits a gradual migration. Latency routes to the closest region. Failover returns a standby when a health check fails. Most apps never need more than simple records with alias targets." },
        { type: "h2", text: "Checklist for putting an app on a domain" },
        { type: "list", ordered: true, items: ["Create a public hosted zone and copy its four name servers to the registrar.", "Request an ACM certificate for the domain and validate it with the CNAME ACM gives you.", "Create an alias A record to the ALB, and an AAAA record if the ALB is dual-stack.", "Confirm with `dig`, then open the site over HTTPS."] },
        { type: "p", text: "A hosted zone costs a small fixed amount per month plus per-query fees, so delete zones you no longer use." },
      ],
      references: [
        { title: "What is Amazon Route 53?", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" },
        { title: "Choosing between alias and non-alias records", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" },
        { title: "Choosing a routing policy", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html" },
        { title: "RFC 1034: Domain names - concepts and facilities", url: "https://datatracker.ietf.org/doc/html/rfc1034" },
      ],
    },
    points: [
      {
        id: "devops.dns-with-route-53.hosted-zone-delegation",
        title: "A hosted zone needs delegation",
        detail: "Creating a hosted zone gives you four name servers, but the domain only uses them once the registrar's name server settings are changed to match. Until then, records in the zone are never queried.",
        question: "You created records in Route 53 but the site does not resolve. What did you probably skip?",
      },
      {
        id: "devops.dns-with-route-53.alias-vs-cname",
        title: "Alias versus CNAME",
        detail: "A CNAME cannot sit at the zone apex, and a load balancer only has a DNS name. An alias record works at the apex, tracks the AWS resource's changing addresses and has no query charge for AWS targets.",
        question: "How do you point `example.com` (not `www`) at an ALB?",
      },
      {
        id: "devops.dns-with-route-53.ttl-before-migration",
        title: "Lower the TTL before a migration",
        detail: "Resolvers cache an answer for the record's TTL. Reduce the TTL a day ahead of a cutover so the new address is picked up quickly, then raise it afterwards to cut query volume.",
        question: "Why do you lower a record's TTL before moving it, not after?",
      },
    ],
  },
};
