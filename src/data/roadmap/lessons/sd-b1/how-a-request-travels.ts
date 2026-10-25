import type { LessonEntry } from "@/types/roadmap";

export const HOW_A_REQUEST_TRAVELS: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "How a request travels: DNS, TCP, TLS, HTTP",
    slug: "how-a-request-travels",
    lesson: {
      summary: "Before your handler runs, a request has already paid for a DNS lookup, a TCP handshake and a TLS handshake; knowing each step shows where latency hides.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The four steps" },
        { type: "p", text: "When a browser loads `https://shop.example.com/cart`, it works through a chain. Each stage can be cached, skipped or made faster, which is where most of the front-door latency optimisations come from." },
        { type: "list", ordered: true, items: ["**DNS**: turn the name into an IP address.", "**TCP**: open a reliable connection to that IP and port with a three-way handshake.", "**TLS**: agree on keys and verify the server's certificate so traffic is encrypted.", "**HTTP**: send the request and read the response over that connection."] },
        { type: "h2", text: "DNS" },
        { type: "p", text: "The client asks a recursive resolver (usually your ISP or a public one). If it has no cached answer it walks the hierarchy: root servers point to the `.com` servers, which point to the domain's authoritative name server, which returns an `A` (IPv4) or `AAAA` (IPv6) record. Each record has a **TTL** that says how long it may be cached." },
        { type: "p", text: "DNS is also a design tool. Returning several IPs, or different IPs by region (geo-DNS), spreads load. The catch is the TTL: lowering it to 30 seconds before a migration lets you move traffic quickly, but clients and resolvers sometimes ignore it, so old targets keep receiving traffic for a while." },
        { type: "h2", text: "TCP and TLS" },
        { type: "p", text: "TCP needs one round trip (SYN, SYN-ACK, ACK) before any data flows. TLS 1.3 adds one more round trip for the handshake; TLS 1.2 adds two. With a 100 ms round trip to a distant server, the connection setup alone costs about 200 ms before the first request byte is sent." },
        { type: "table", head: ["Step", "Round trips (cold, TLS 1.3)", "Mitigation"], rows: [["DNS", "1+ to resolver", "Caching, short chains, DNS prefetch"], ["TCP", "1", "Keep-alive and connection reuse"], ["TLS 1.3", "1", "Session resumption, 0-RTT for safe requests"], ["HTTP request", "1", "CDN near the user, HTTP/2 multiplexing"]] },
        { type: "p", text: "That is why you terminate TLS at an edge or CDN near the user: the expensive handshakes happen over a short hop, and the edge reuses warm connections to your origin." },
        { type: "h2", text: "HTTP" },
        { type: "p", text: "HTTP/1.1 sends one request at a time per connection, so browsers open several in parallel and a slow response blocks the ones behind it. HTTP/2 multiplexes many streams over one TCP connection, but a single lost packet still stalls all streams because TCP delivers bytes in order. HTTP/3 runs over QUIC on UDP, with per-stream loss recovery and the transport and TLS handshakes combined." },
        { type: "code", language: "text", title: "What goes over the wire", code: `GET /cart HTTP/1.1
Host: shop.example.com
Accept: application/json
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, max-age=0
Content-Length: 412` },
        { type: "p", text: "A response status tells the client what to do: 2xx success, 3xx redirect or cached copy still valid, 4xx the caller made a mistake, 5xx the server did. Headers such as `Cache-Control`, `ETag` and `Content-Encoding` are how caching and compression happen without extra code." },
        { type: "callout", tone: "tip", title: "Interview habit", text: "When asked why a page is slow for users far from your region, walk this chain and count round trips. Connection reuse, a CDN, TLS 1.3 and caching DNS answers each remove a specific number of round trips." },
        { type: "callout", tone: "gotcha", title: "Common mistake", text: "Saying 'HTTPS is slower' as a blanket claim. Cold handshakes cost round trips, but reused connections and session resumption make the steady-state cost small. Also do not assume DNS changes take effect instantly everywhere." },
      ],
      references: [
        { title: "An overview of HTTP (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
        { title: "What is DNS? (MDN Glossary)", url: "https://developer.mozilla.org/en-US/docs/Glossary/DNS" },
        { title: "RFC 9293: Transmission Control Protocol (TCP)", url: "https://www.rfc-editor.org/rfc/rfc9293" },
        { title: "RFC 8446: TLS Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446" },
      ],
    },
    points: [
      { id: "sd.how-a-request-travels.dns-resolution", title: "DNS resolution and TTL", detail: "A resolver walks root, TLD and authoritative servers to turn a name into an IP, then caches the answer for the record's TTL. Short TTLs speed up migrations but increase lookups, and some resolvers ignore them.", question: "You are moving a service to a new IP tomorrow. What do you change today and why?" },
      { id: "sd.how-a-request-travels.handshake-cost", title: "Handshake round trips", detail: "A cold HTTPS request pays DNS, one TCP round trip and one or two TLS round trips before the first HTTP byte. Connection reuse and edge termination are how you avoid paying that repeatedly.", question: "Estimate time to first byte for a cold request with a 100 ms round trip using TLS 1.3." },
      { id: "sd.how-a-request-travels.http-versions", title: "HTTP/1.1, HTTP/2 and HTTP/3", detail: "HTTP/2 multiplexes streams over one TCP connection but still suffers TCP head-of-line blocking. HTTP/3 uses QUIC over UDP so a lost packet only stalls its own stream.", question: "Why can HTTP/2 still be slow on a lossy mobile network?" },
    ],
  },
};
