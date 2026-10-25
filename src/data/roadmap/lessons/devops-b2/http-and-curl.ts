import type { LessonEntry } from "@/types/roadmap";

export const HTTP_AND_CURL: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "HTTP and curl",
    slug: "http-and-curl",
    lesson: {
      summary: "HTTP is a plain-text request and response protocol, and curl lets you speak it by hand so you can see what a server really sends.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What HTTP is" },
        { type: "p", text: "HTTP is how a client asks a server for something and gets an answer. The client sends a **request**: a method, a path, some headers and sometimes a body. The server sends back a **response**: a status code, headers and usually a body. Each exchange is independent. The server keeps no memory of earlier requests unless you add it yourself with cookies or tokens." },
        { type: "p", text: "A browser hides all of this. When a page is blank, a login loops, or an API returns the wrong thing, the browser's view is the least useful one. You want the raw conversation, and that is what curl gives you." },
        { type: "h2", text: "The request on the wire" },
        { type: "p", text: "Over HTTP/1.1 the request is readable text. Newer versions (HTTP/2 and HTTP/3) encode it in binary, but the same pieces exist and tools show them the same way." },
        {
          type: "code",
          language: "http",
          title: "A raw HTTP/1.1 exchange",
          code: `GET /health HTTP/1.1
Host: api.example.com
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 15

{"status":"ok"}`,
        },
        { type: "p", text: "The `Host` header matters more than it looks. One IP address often serves many sites, and the server uses `Host` to decide which one you meant. That is how a single reverse proxy fronts several apps." },
        { type: "h2", text: "curl in practice" },
        { type: "p", text: "curl sends one request and prints the body. These flags cover most daily use." },
        {
          type: "code",
          language: "bash",
          code: `curl https://api.example.com/health              # GET, print the body
curl -i https://api.example.com/health           # include response headers
curl -I https://api.example.com/health           # HEAD request, headers only
curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" https://example.com
curl -X POST https://api.example.com/items \\
  -H "Content-Type: application/json" \\
  -d '{"name":"widget"}'
curl -L https://example.com                      # follow redirects
curl --max-time 10 --fail https://example.com    # time out, exit non-zero on 4xx/5xx`,
        },
        {
          type: "list",
          items: [
            "`-s` hides the progress meter, `-S` still shows errors. Use `-sS` in scripts.",
            "`-o file` saves the body, `-o /dev/null` throws it away.",
            "`-w` prints chosen values after the transfer, such as the status code or total time.",
            "`--fail` makes curl exit with an error on HTTP 400 and above. Without it, a 500 still exits 0.",
            "`-H` adds a header, `-d` sends a body and switches the method to POST.",
          ],
        },
        { type: "h2", text: "Using it to debug" },
        { type: "p", text: "Start from the outside and work in. If `curl -i` on the public URL gives a 502, test the app directly on its own port from the server. If that works, the fault is in the proxy or the network between them. If it fails, the app is the problem. Changing one hop at a time is the whole technique." },
        { type: "p", text: "To test a site before DNS points at it, override the lookup: `curl --resolve example.com:443:203.0.113.10 https://example.com`. curl connects to that IP but still sends the right hostname and TLS name." },
        { type: "callout", tone: "gotcha", title: "A 200 from curl is not a working site", text: "curl does not run JavaScript. A Next.js page can return 200 with an empty shell while the browser fails on an API call. Check the response body and then open the page. Also, quote URLs that contain `&`, or the shell will cut them at that character." },
        { type: "p", text: "Common mistakes: forgetting `-L` and wondering why you got a 301 with no content, sending JSON without the `Content-Type` header so the API ignores it, and trusting a status code without reading the body, since many APIs put the real error there." },
      ],
      references: [
        { title: "Overview of HTTP - HTTP | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
        { title: "Everything curl", url: "https://everything.curl.dev/" },
        { title: "curl - How To Use", url: "https://curl.se/docs/manpage.html" },
        { title: "RFC 9110: HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110.html" },
      ],
    },
    points: [
      {
        id: "devops.http-and-curl.request-response",
        title: "Requests and responses are independent",
        detail: "A request carries a method, path, headers and optional body. The response carries a status, headers and body. The server remembers nothing between requests unless cookies or tokens are used.",
        question: "Why does a login need a cookie or token if HTTP itself keeps no state?",
      },
      {
        id: "devops.http-and-curl.host-header",
        title: "The Host header picks the site",
        detail: "Many sites share one IP, and the server or proxy routes by the `Host` header. `curl --resolve` lets you test a hostname against a chosen IP before DNS changes.",
        question: "How would you test a new server with curl before the DNS record points to it?",
      },
      {
        id: "devops.http-and-curl.curl-flags",
        title: "Core curl flags",
        detail: "`-i` shows headers, `-L` follows redirects, `-w` prints timing and status, and `--fail` makes errors exit non-zero. Using `-sS --fail --max-time` makes curl safe in scripts.",
        question: "Which flag makes curl return a non-zero exit code on a 500 response?",
      },
    ],
  },
};
