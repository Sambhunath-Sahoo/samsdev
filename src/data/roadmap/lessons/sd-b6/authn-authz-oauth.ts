import type { LessonEntry } from "@/types/roadmap";

export const AUTHN_AUTHZ_OAUTH: LessonEntry = {
  track: "system-design",
  section: "Architecture styles",
  subsection: {
    title: "Security: authN and authZ, OAuth",
    slug: "authn-authz-oauth",
    lesson: {
      summary: "Separate who you are from what you may do, choose between sessions and JWTs, understand OAuth 2.0 and OpenID Connect, and protect traffic and secrets.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "Authentication vs authorization" },
        { type: "p", text: "**Authentication (authN)** answers who is this: a password, a passkey, a one-time code, a signed token. **Authorization (authZ)** answers what may they do: can this user read invoice 42, can this service delete a bucket. Mixing them up is a classic bug. A valid login does not mean permission, and the typical vulnerability is checking the first but not the second (an insecure direct object reference: changing `/invoices/42` to `/invoices/43` and seeing someone else's data). Check authorization on the server, for every request and every object, using roles, attributes or relationships." },
        { type: "h2", text: "Server sessions vs JWTs" },
        { type: "p", text: "After login, the client must prove identity on each later request. There are two main designs." },
        {
          type: "table",
          head: ["", "Server session", "JWT (self-contained token)"],
          rows: [
            ["What the client holds", "Random session id in a cookie", "Signed token with claims (user id, expiry, roles)"],
            ["Where state lives", "Session store such as Redis", "In the token; the server just verifies the signature"],
            ["Revocation", "Delete the session; immediate", "Hard: valid until it expires unless you keep a deny-list"],
            ["Scaling", "Needs a shared store lookup per request", "No lookup, works across services"],
            ["Best for", "Browser apps with one backend", "Service-to-service calls and short-lived access"],
          ],
        },
        { type: "p", text: "Make JWT access tokens short-lived (5-15 minutes) and use a longer-lived refresh token, stored server-side so it can be revoked and rotated. In browsers, an `HttpOnly`, `Secure`, `SameSite` cookie keeps the token away from JavaScript, which limits theft through XSS. Never accept the `none` algorithm, always verify signature, expiry, issuer and audience." },
        { type: "h2", text: "OAuth 2.0 and OpenID Connect" },
        { type: "p", text: "OAuth 2.0 is about **delegated authorization**: letting an app act on your behalf without handing it your password. It is not a login protocol by itself. **OpenID Connect (OIDC)** adds the missing identity layer on top: an ID token (a JWT) telling the app who signed in." },
        { type: "p", text: "The standard browser flow is the **authorization code flow with PKCE**:" },
        {
          type: "list",
          ordered: true,
          items: [
            "The app redirects the user to the identity provider with a client id, scopes and a PKCE code challenge.",
            "The user signs in and consents. The provider redirects back with a one-time authorization code.",
            "The app's backend (or the SPA with PKCE) swaps the code, plus the code verifier, for an access token, a refresh token and, with OIDC, an ID token.",
            "The app calls the API with the access token in `Authorization: Bearer ...`. The API checks scopes.",
          ],
        },
        { type: "p", text: "Keep the roles apart: the **resource owner** is the user, the **client** is the app, the **authorization server** issues tokens, and the **resource server** is the API. The implicit flow and the password grant are discouraged. For machine-to-machine calls use the client credentials grant." },
        { type: "h2", text: "TLS, mTLS and secrets" },
        { type: "p", text: "**TLS** encrypts traffic and lets the client verify the server's certificate, so use it on every hop, including internal ones. **Mutual TLS (mTLS)** makes the client present a certificate too, so both sides prove identity. It suits service-to-service traffic, usually handled by a service mesh that issues and rotates short-lived certificates automatically." },
        { type: "p", text: "Secrets (database passwords, API keys, signing keys) belong in a secrets manager or injected environment, never in git or images. Rotate them, give each service its own credential with least privilege, and audit access. Passwords themselves are stored with a slow salted hash such as Argon2 or bcrypt, never plain or fast-hashed." },
        { type: "callout", tone: "gotcha", title: "JWTs are signed, not encrypted", text: "Anyone can base64-decode a JWT and read its claims. Do not put secrets or sensitive personal data in it. Also, \"stateless\" is a trade: once you need logout-everywhere or instant revocation, you are keeping server state anyway." },
        { type: "p", text: "In an interview, place authentication at the gateway, authorization in the service that owns the data, and say how tokens are validated, refreshed and revoked." },
      ],
      references: [
        { title: "RFC 6749: The OAuth 2.0 Authorization Framework", url: "https://www.rfc-editor.org/rfc/rfc6749" },
        { title: "RFC 7636: Proof Key for Code Exchange by OAuth Public Clients", url: "https://www.rfc-editor.org/rfc/rfc7636" },
        { title: "OpenID Connect Core 1.0", url: "https://openid.net/specs/openid-connect-core-1_0.html" },
        { title: "RFC 7519: JSON Web Token (JWT)", url: "https://www.rfc-editor.org/rfc/rfc7519" },
        { title: "Session Management Cheat Sheet (OWASP)", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
      ],
    },
  },
};
