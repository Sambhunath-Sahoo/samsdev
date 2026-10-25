import type { LessonEntry } from "@/types/roadmap";

export const TLS_AND_CERTIFICATES: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "TLS and certificates",
    slug: "tls-and-certificates",
    lesson: {
      summary: "TLS encrypts traffic and proves the server's identity through a certificate chain, and expiry or a wrong chain is the usual way it breaks.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What TLS gives you" },
        { type: "p", text: "TLS is the layer that turns HTTP into HTTPS. It provides three things: **encryption** so nobody on the path can read the traffic, **integrity** so it cannot be altered unnoticed, and **authentication** so the client knows it is talking to the real `example.com` and not an impostor. The third one is where certificates come in." },
        { type: "h2", text: "Certificates and the chain of trust" },
        { type: "p", text: "A certificate binds a public key to one or more hostnames, and is signed by a **certificate authority** (CA). Your server usually presents a **leaf** certificate plus an **intermediate** certificate. The client checks that the leaf was signed by the intermediate, that the intermediate was signed by a root CA already in its trust store, that the hostname matches, and that the dates are valid. Any failure produces a browser warning or a curl error." },
        { type: "p", text: "The handshake in short: the client says hello and lists what it supports, the server answers with its certificate, both sides agree on keys, and from then on traffic is encrypted with a fast symmetric cipher. In TLS 1.3 this takes one round trip." },
        { type: "h2", text: "Inspecting a certificate" },
        {
          type: "code",
          language: "bash",
          code: `# who issued it, which names, when does it expire
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# see the whole handshake and chain
curl -vI https://example.com 2>&1 | grep -E "SSL|subject|expire|issuer"

# test a site before DNS points at it
curl --resolve example.com:443:203.0.113.10 -I https://example.com`,
        },
        { type: "p", text: "The `-servername` flag sends SNI, the hostname the client wants. A server hosting many sites uses it to choose which certificate to present. Leaving it out is a common cause of seeing the wrong certificate in a test." },
        { type: "h2", text: "Getting certificates" },
        { type: "p", text: "Let's Encrypt issues free certificates automatically through the ACME protocol, and tools such as Certbot or Caddy handle issuance and renewal. Its certificates last 90 days, so the point is that renewal must be automated, not a calendar reminder. On AWS, ACM issues certificates that attach to load balancers and renew themselves, but you cannot export them to put on an EC2 instance directly." },
        {
          type: "table",
          head: ["Symptom", "Likely cause"],
          rows: [
            ["Certificate expired", "Renewal job failed or was never set up"],
            ["Name mismatch", "Certificate does not list this hostname"],
            ["Unable to verify the first certificate", "Server omitted the intermediate certificate"],
            ["Works in browser, fails in curl or an app", "Missing intermediate, or the client has an old trust store"],
            ["Wrong certificate shown", "No SNI sent, or the proxy default site is answering"],
          ],
        },
        { type: "callout", tone: "gotcha", title: "Never turn off verification to make it work", text: "`curl -k` and `NODE_TLS_REJECT_UNAUTHORIZED=0` hide the error and also remove the protection. Use them only to confirm a diagnosis, never in code or deploy scripts. Fix the chain, hostname or expiry instead." },
        { type: "p", text: "Common mistakes: renewing the certificate but not reloading the proxy so it keeps serving the old one, issuing a certificate for `example.com` and forgetting `www`, and serving only the leaf certificate. Also set a monitor that alerts at 14 days before expiry, as a backstop for when automation silently breaks." },
      ],
      references: [
        { title: "Transport Layer Security (TLS) - Security | MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" },
        { title: "How It Works - Let's Encrypt", url: "https://letsencrypt.org/how-it-works/" },
        { title: "openssl-s_client - OpenSSL Documentation", url: "https://docs.openssl.org/master/man1/openssl-s_client/" },
        { title: "RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446" },
      ],
    },
    points: [
      {
        id: "devops.tls.three-guarantees",
        title: "Encryption, integrity and authentication",
        detail: "TLS hides traffic, detects tampering and proves the server's identity. Authentication depends on the certificate matching the hostname and chaining to a trusted root.",
        question: "Which of TLS's guarantees would a self-signed certificate fail to provide to a stranger's browser?",
      },
      {
        id: "devops.tls.chain",
        title: "The certificate chain",
        detail: "A server should present its leaf and the intermediate certificate. Clients validate up to a root in their trust store, and a missing intermediate breaks some clients but not others.",
        question: "Why might a site load in a browser but fail from curl or an app?",
      },
      {
        id: "devops.tls.renewal",
        title: "Automate renewal and reload",
        detail: "Let's Encrypt certificates last 90 days, so renewal must be automatic. The proxy also has to reload to use the new file, and an expiry alert is a good backstop.",
        question: "What two things must happen for a renewed certificate to actually be served?",
      },
    ],
  },
};
