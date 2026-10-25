import type { RoadmapSubsection } from "@/types/roadmap";

export const FIREWALLS_AND_REVERSE_PROXIES: RoadmapSubsection = {
  title: "Firewalls and reverse proxies",
  slug: "firewalls-and-reverse-proxies",
  lesson: {
    summary: "Put Caddy in front of an API to get a real HTTPS certificate automatically, and see how the security group, the proxy and the container each limit access.",
    minutes: 11,
    blocks: [
      { type: "h2", text: "Why put something in front of the app" },
      { type: "p", text: "An API container speaks plain HTTP on one port. Browsers expect HTTPS on 443, a trusted certificate, and a stable front door. A **reverse proxy** sits there: it terminates TLS and forwards requests to the right container behind it." },
      { type: "code", language: "text", code: "Browser --HTTPS :443--> Caddy --HTTP--> API container :8000 --TLS--> Database" },
      { type: "h2", text: "Three layers of access control" },
      {
        type: "table",
        head: ["Layer", "What it decides"],
        rows: [
          ["Security group", "Which ports and source addresses may reach the server at all (22 from your IP, 80, 443)."],
          ["Reverse proxy", "Which hostname gets which backend, and that traffic is encrypted."],
          ["Container network", "The API has no published port, so only the proxy container can reach it."],
        ],
      },
      { type: "h2", text: "A hostname without buying a domain" },
      { type: "p", text: "`sslip.io` is a free service that turns a name containing an IP address into that IP. `203-0-113-25.sslip.io` resolves to `203.0.113.25`. Because it is a real public name, Let's Encrypt will issue a certificate for it." },
      { type: "callout", tone: "gotcha", title: "The hostname is the IP", text: "If the server's public IP changes, the hostname changes with it. Edit the first line of the Caddyfile and restart Caddy. A real domain or an Elastic IP removes this chore." },
      { type: "h2", text: "Run it" },
      {
        type: "code",
        language: "bash",
        title: "on the server",
        code: `# 1. A network so the containers can find each other by name
docker network create myapp

# 2. The API, with no published port
docker run -d --name api --network myapp --restart unless-stopped \\
  --env-file ~/api.env \\
  111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1

# 3. The Caddy config: one hostname, one backend
mkdir -p ~/caddy
cat > ~/caddy/Caddyfile <<'EOF'
203-0-113-25.sslip.io {
    reverse_proxy api:8000
}
EOF

# 4. Caddy on the public ports, with a volume for its certificates
docker run -d --name caddy --network myapp --restart unless-stopped \\
  -p 80:80 -p 443:443 \\
  -v ~/caddy/Caddyfile:/etc/caddy/Caddyfile \\
  -v caddy_data:/data \\
  caddy:2

# 5. Look for "certificate obtained successfully"
docker logs caddy 2>&1 | tail -15`,
      },
      { type: "p", text: "Then open `https://203-0-113-25.sslip.io/health` in a browser. You should see the health JSON and a padlock." },
      { type: "h2", text: "What Caddy does behind the scenes" },
      {
        type: "list",
        ordered: true,
        items: [
          "On start it sees a hostname in the Caddyfile and asks **Let's Encrypt** for a certificate.",
          "Let's Encrypt proves you control the name by connecting to ports 80 and 443 on that address, so both must be open in the security group.",
          "Caddy stores the certificate in `/data` (the named volume) and renews it before it expires.",
          "Requests for that hostname are decrypted and forwarded to `api:8000`.",
        ],
      },
      { type: "h2", text: "Other options" },
      {
        type: "table",
        head: ["Tool", "Certificates", "When to pick it"],
        rows: [
          ["Caddy", "automatic", "one server, simplest setup, good for learning"],
          ["Nginx", "set up yourself (for example with Certbot)", "very common, very flexible"],
          ["Application Load Balancer + ACM", "AWS issues and renews them", "several instances, health checks, the next step on AWS"],
        ],
      },
    ],
    references: [
      { title: "Caddy docs: Reverse proxy quick-start", url: "https://caddyserver.com/docs/quick-starts/reverse-proxy" },
      { title: "AWS docs: Security groups", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" },
      { title: "Ubuntu Server docs: Firewalls", url: "https://ubuntu.com/server/docs/firewalls" },
    ],
  },
  points: [
    {
      id: "devops.networking.proxy.what-it-does",
      title: "What a reverse proxy does",
      detail: "It accepts public connections, terminates TLS, and forwards requests to a backend that is not exposed itself.",
      question: "Why does the API container not need a public port?",
    },
    {
      id: "devops.networking.proxy.layers",
      title: "Security group, proxy and container network are different layers",
      detail: "The security group filters by port and source before traffic reaches the server. The proxy routes by hostname. The container network limits who can reach the API.",
      question: "If you removed port 443 from the security group, what would a visitor see, and would the API still run?",
    },
    {
      id: "devops.networking.proxy.letsencrypt",
      title: "How the certificate is obtained",
      detail: "Let's Encrypt checks that you control the hostname by connecting to ports 80 and 443. Caddy stores and renews the certificate automatically.",
      question: "Which ports must be open for the certificate request to succeed?",
    },
    {
      id: "devops.networking.proxy.hostname-from-ip",
      title: "Name-from-IP hostnames and what changes with the IP",
      detail: "A sslip.io name encodes the IP. When the IP changes, update the Caddyfile, restart Caddy and let it fetch a new certificate.",
      question: "What two things do you change after starting a stopped server whose IP changed?",
    },
  ],
};
