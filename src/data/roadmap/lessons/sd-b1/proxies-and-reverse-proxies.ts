import type { LessonEntry } from "@/types/roadmap";

export const PROXIES_AND_REVERSE_PROXIES: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "Proxies and reverse proxies",
    slug: "proxies-and-reverse-proxies",
    lesson: {
      summary: "A forward proxy acts for clients and a reverse proxy acts for servers; the reverse proxy is the front door of most production systems.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Forward proxy versus reverse proxy" },
        { type: "p", text: "A **forward proxy** sits in front of clients. The client is configured to send its outbound requests through it, and the destination server sees the proxy, not the client. Companies use them to filter or log employee traffic, cache downloads and hide internal addresses." },
        { type: "p", text: "A **reverse proxy** sits in front of servers. Clients think they are talking to the real site; the proxy decides which backend handles the request. Nginx, HAProxy, Envoy, Caddy, and cloud load balancers and CDNs all play this role. The easy test: who knows the proxy exists? Forward, the client configures it. Reverse, only the server operator knows." },
        { type: "code", language: "text", code: `Forward:  client -> [forward proxy] -> internet -> server
Reverse:  client -> internet -> [reverse proxy] -> app1, app2, app3` },
        { type: "h2", text: "What a reverse proxy does for you" },
        { type: "list", items: ["**Load balancing** across instances, with health checks that drop dead ones.", "**TLS termination**: certificates and handshakes live in one place, and backends speak plain HTTP on a private network.", "**Caching** of static or cacheable responses, plus **compression**.", "**Routing** by host or path: `/api` to the API service, `/` to the web app.", "**Protection**: rate limiting, request size limits, hiding backend addresses, absorbing slow clients, and basic WAF rules.", "**Zero-downtime deploys**: drain one backend, update it, put it back."] },
        { type: "code", language: "nginx", title: "A minimal Nginx reverse proxy", code: `upstream api {
    server 10.0.1.11:8000;
    server 10.0.1.12:8000;
}
server {
    listen 443 ssl;
    server_name shop.example.com;
    location /api/ {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}` },
        { type: "p", text: "Because the backend now sees the proxy's address, the original client IP arrives in headers such as `X-Forwarded-For` or the standard `Forwarded`. Only trust those headers when they were set by your own proxy, otherwise clients can forge them to dodge rate limits and logging." },
        { type: "h2", text: "Related terms and costs" },
        { type: "p", text: "A **load balancer** is a reverse proxy focused on distribution; an **API gateway** is a reverse proxy that adds authentication, quotas and request shaping for APIs; a **CDN** is a geographically distributed reverse proxy with caching. The proxy is also another hop, adding about a millisecond of latency, and it becomes a single point of failure unless you run several behind a virtual IP or DNS." },
        { type: "callout", tone: "gotcha", title: "Timeouts and body limits", text: "Many production incidents come from proxy defaults: a 60 second read timeout cutting a long request, a 1 MB body limit rejecting uploads with a 413, or idle timeouts closing WebSockets. Set these deliberately, and keep the proxy's idle timeout longer than the one on your backend's keep-alive." },
      ],
      references: [
        { title: "NGINX Reverse Proxy", url: "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/" },
        { title: "Proxy servers and tunneling (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling" },
        { title: "Reverse proxy (Wikipedia)", url: "https://en.wikipedia.org/wiki/Reverse_proxy" },
      ],
    },
  },
};
