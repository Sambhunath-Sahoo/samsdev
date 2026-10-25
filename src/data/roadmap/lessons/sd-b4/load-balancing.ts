import type { LessonEntry } from "@/types/roadmap";

export const LOAD_BALANCING: LessonEntry = {
  track: "system-design",
  section: "Scaling and distribution",
  subsection: {
    title: "Load balancing",
    slug: "load-balancing",
    lesson: {
      summary: "A load balancer spreads requests over identical servers, hides dead ones, and must itself not become the thing that takes you down.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What it does and why" },
        { type: "p", text: "One server has a ceiling: CPU, memory, connections. When a single instance handles 1,000 requests per second and you expect 4,000, you run five or six copies and put a load balancer in front. It gives clients one address, forwards each request to a healthy backend, and stops sending traffic to a backend that fails its health check. That second job matters as much as the first: it is what lets you deploy or lose a server without an outage." },
        { type: "p", text: "This only works cleanly when the backends are **stateless**. If a server keeps the user's session in its own memory, the next request must reach the same server, and you start fighting the balancer. Move sessions to Redis or a signed token and any backend can serve any request." },
        { type: "h2", text: "Layer 4 vs layer 7" },
        { type: "p", text: "A layer 4 balancer works on TCP or UDP. It sees addresses and ports, picks a backend per connection and shuffles bytes. It never parses HTTP, so it is fast and protocol-agnostic (databases, gRPC over TCP, game traffic). A layer 7 balancer terminates the HTTP request, reads the path, headers and cookies, and decides per request." },
        {
          type: "table",
          head: ["", "Layer 4", "Layer 7"],
          rows: [
            ["Sees", "IP, port, TCP connection", "URL, headers, cookies, body"],
            ["Routing", "Per connection", "Per request: `/api` to one pool, `/static` to another"],
            ["TLS", "Usually passes through", "Usually terminates it"],
            ["Cost", "Very cheap, high throughput", "More CPU, more features"],
            ["Typical use", "Raw TCP, edge in front of L7", "Web apps, canary routes, auth, rate limits"],
          ],
        },
        { type: "p", text: "A common shape is both: a layer 4 balancer at the edge with a fleet of layer 7 proxies (nginx, Envoy, an ALB) behind it. One caveat: with HTTP/2 or gRPC, many requests share one long connection, so a layer 4 balancer can pin all of a client's traffic to one backend. Balance per request at layer 7 instead." },
        { type: "h2", text: "Balancing algorithms" },
        { type: "list", items: [
          "**Round robin**: backends in turn. Simple and fine when requests cost about the same and servers are equal.",
          "**Weighted round robin**: bigger machines get a larger share, useful during a migration to new hardware.",
          "**Least connections**: send to the backend with the fewest open requests. Handles uneven request cost, such as a mix of 5 ms reads and 2 s reports, far better than round robin.",
          "**IP or key hash**: the same client or key lands on the same backend. Gives affinity for caches, but a backend change reshuffles keys (see consistent hashing).",
          "**Power of two choices**: pick two backends at random and use the less loaded one. Almost as good as global least-loaded without needing shared state.",
        ] },
        { type: "code", language: "nginx", title: "nginx upstream", code: `upstream api {
    least_conn;
    server 10.0.1.10:8000 weight=2;
    server 10.0.1.11:8000;
    server 10.0.1.12:8000 max_fails=3 fail_timeout=10s;
}
server {
    listen 443 ssl;
    location / { proxy_pass http://api; }
}` },
        { type: "h2", text: "Keeping the balancer from being a single point of failure" },
        { type: "p", text: "You added the balancer to remove a single point of failure, so a single balancer just moves the problem. Run at least two. In the cloud, a managed balancer (ALB, NLB, Google Cloud Load Balancing) already spreads across availability zones for you. On your own machines, run two nodes sharing a virtual IP with VRRP (keepalived) in active-passive mode, or put several active balancers behind DNS or anycast, so one failing only costs a share of traffic." },
        { type: "p", text: "Health checks need care. A check that only tests that the port is open will keep sending traffic to an app whose database connection is gone. Use a cheap `/healthz` that checks what this instance needs to serve, but not every downstream, or one slow dependency will make the balancer eject every backend at once." },
        { type: "callout", tone: "gotcha", title: "Retries can multiply load", text: "If a balancer retries failed requests against other backends, a partial outage can double the traffic on the survivors and push them over. Retry only idempotent requests, cap retries, and add a small budget (for example, at most 10 percent extra requests)." },
        { type: "p", text: "In an interview, the common mistakes are: drawing one load balancer box and stopping, ignoring statelessness, and picking an algorithm without saying what the request-cost distribution is. Say which layer you chose and why, name the algorithm, and say how a backend leaves and rejoins the pool." },
      ],
      references: [
        { title: "Using nginx as HTTP load balancer", url: "https://nginx.org/en/docs/http/load_balancing.html" },
        { title: "What is Elastic Load Balancing?", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html" },
        { title: "Load balancing (computing)", url: "https://en.wikipedia.org/wiki/Load_balancing_(computing)" },
      ],
    },
  },
};
