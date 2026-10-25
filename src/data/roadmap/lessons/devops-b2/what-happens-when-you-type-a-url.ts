import type { LessonEntry } from "@/types/roadmap";

export const WHAT_HAPPENS_WHEN_YOU_TYPE_A_URL: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "What happens when you type a URL",
    slug: "what-happens-when-you-type-a-url",
    lesson: {
      summary: "Follow one request from the address bar to a rendered page, and learn which step each networking tool and error message belongs to.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The path in order" },
        { type: "p", text: "Type `https://shop.example.com/cart` and press Enter. Everything from the earlier lessons happens in sequence. Knowing the order is what lets you say, from an error message alone, which step failed." },
        {
          type: "list",
          ordered: true,
          items: [
            "**Parse the URL.** Scheme `https`, host `shop.example.com`, path `/cart`, default port 443.",
            "**Check caches.** The browser looks at its HTTP cache and HSTS list, which may force HTTPS or skip the network entirely.",
            "**DNS lookup.** The browser and OS caches are checked, then the recursive resolver, which finds an `A` or `AAAA` record. Failure here gives \"server not found\".",
            "**TCP connection.** A handshake with the IP on port 443. Refusal or timeout shows up here.",
            "**TLS handshake.** The browser sends the hostname (SNI), receives the certificate, validates it and agrees on keys. Certificate warnings appear here.",
            "**HTTP request.** The browser sends `GET /cart` with a `Host` header and cookies, often over HTTP/2 or HTTP/3.",
            "**Server side.** A load balancer or reverse proxy receives it, forwards it to an app, the app queries a database, and a response comes back.",
            "**Render.** The browser parses the HTML, fetches CSS, JavaScript and images (each possibly going through steps 3 to 7 again), and paints the page.",
          ],
        },
        { type: "h2", text: "Where each tool fits" },
        {
          type: "table",
          head: ["Step", "How to inspect it"],
          rows: [
            ["DNS", "`dig +short shop.example.com`"],
            ["TCP", "`nc -zv shop.example.com 443`"],
            ["TLS", "`openssl s_client -connect shop.example.com:443 -servername shop.example.com`"],
            ["HTTP", "`curl -v https://shop.example.com/cart`"],
            ["Server and app", "proxy logs, app logs, `ss -tlnp` on the host"],
            ["Render", "browser DevTools, Network and Console tabs"],
          ],
        },
        { type: "p", text: "`curl -w` can even time the stages for you, which shows where the delay lives:" },
        {
          type: "code",
          language: "bash",
          code: `curl -s -o /dev/null https://shop.example.com/cart -w \\
"dns %{time_namelookup}s  connect %{time_connect}s  tls %{time_appconnect}s  first-byte %{time_starttransfer}s  total %{time_total}s\\n"`,
        },
        { type: "p", text: "The values are cumulative from the start. A large `time_namelookup` points at DNS, a big jump from `connect` to `tls` means a slow handshake, and a big gap before `first-byte` means the server itself is slow." },
        { type: "h2", text: "What changes in production" },
        { type: "p", text: "For a real site there is more in the middle. DNS often returns the address of a CDN or load balancer rather than your server. The CDN may answer from cache without reaching your origin. The load balancer picks a healthy instance, terminates TLS, and forwards plain HTTP to your app over the private network. Each of these is one more place that can return its own error, so check which hop produced a response. The `Server` or `Via` headers and the format of an error page often give it away." },
        { type: "callout", tone: "tip", title: "Name the step before you fix anything", text: "\"The site is slow\" is not a diagnosis. Time the stages with curl, find the one that is large, and look only at the tool that owns it. Most outages turn out to be DNS, certificates or a port mismatch, all of which are visible before you ever touch the app." },
        { type: "p", text: "Common mistakes: debugging the app when DNS still points at the old server, assuming a browser cache is a server bug, and forgetting that a CDN may serve a stale copy while your origin has already been fixed." },
      ],
      references: [
        { title: "Populating the page: how browsers work - Performance | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work" },
        { title: "How the web works - Learn web development | MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works" },
        { title: "Overview of HTTP - HTTP | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
        { title: "Domain Name System - Wikipedia", url: "https://en.wikipedia.org/wiki/Domain_Name_System" },
      ],
    },
    points: [
      {
        id: "devops.url-journey.order",
        title: "The order of a request",
        detail: "Parse, cache check, DNS, TCP, TLS, HTTP request, server work, then render. Each step has its own failure messages, so the error tells you where to look.",
        question: "A browser says the certificate is invalid. Which step has the request reached?",
      },
      {
        id: "devops.url-journey.curl-timing",
        title: "Timing stages with curl -w",
        detail: "`time_namelookup`, `time_connect`, `time_appconnect` and `time_starttransfer` are cumulative. The biggest jump between two values shows the slow stage.",
        question: "Which curl timing value would show a slow DNS lookup?",
      },
      {
        id: "devops.url-journey.middle-hops",
        title: "CDNs and load balancers add hops",
        detail: "DNS often points at a CDN or load balancer, which may cache, terminate TLS and forward to your app. Each hop can generate its own errors.",
        question: "How can you tell whether an error page came from the CDN or from your app?",
      },
    ],
  },
};
