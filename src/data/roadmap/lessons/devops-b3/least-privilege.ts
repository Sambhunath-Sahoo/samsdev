import type { LessonEntry } from "@/types/roadmap";

export const LEAST_PRIVILEGE: LessonEntry = {
  track: "devops",
  section: "Security and reliability practice",
  subsection: {
    title: "Least privilege",
    slug: "least-privilege",
    lesson: {
      summary: "Give every person, service and container only the access it needs, so a mistake or a breach stays small.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The principle" },
        { type: "p", text: "Least privilege means each identity gets the smallest set of permissions that lets it do its job, for the shortest time it needs them. It does not stop attacks. It limits what an attacker, a buggy script or a tired engineer can do once something goes wrong. A leaked key that can only read one bucket is an incident. A leaked admin key is a disaster." },
        { type: "h2", text: "Where it applies" },
        {
          type: "table",
          head: ["Layer", "Too much", "Least privilege"],
          rows: [
            ["Cloud IAM", "`AdministratorAccess` on the app role", "Allow only the actions on the specific resources the app uses"],
            ["Containers", "Run as root, full capabilities", "Non-root user, drop capabilities, read-only filesystem"],
            ["Kubernetes", "`cluster-admin` for a pipeline", "A Role limited to one namespace and the verbs it needs"],
            ["Database", "App connects as the owner or superuser", "App user with `SELECT`, `INSERT`, `UPDATE` on its own tables"],
            ["CI/CD", "A long-lived admin key in secrets", "Short-lived credentials limited to deploying one service"],
          ],
        },
        { type: "h2", text: "A container example" },
        { type: "p", text: "By default a container process often runs as root, and root inside a container is still a powerful identity if something escapes. Run the app as an ordinary user, remove Linux capabilities it does not need, and make the filesystem read-only so an attacker cannot drop tools onto it." },
        {
          type: "code",
          language: "yaml",
          title: "docker-compose.yml",
          code: `services:
  api:
    image: myapp-api
    user: "10001:10001"
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]`,
        },
        { type: "h2", text: "How to get there" },
        { type: "list", ordered: true, items: ["Start with nothing and add permissions until the job works, instead of starting broad and trimming later. Trimming rarely happens.", "Use the cloud's access analysis (for example IAM Access Analyzer or last-used data) to find permissions that were granted but never used.", "Give each service its own identity. Shared credentials make it impossible to narrow any single one.", "Prefer temporary credentials from roles over static keys, and review access on a schedule.", "Separate duties: the person who writes a deploy should not be the only one who can approve and run it."] },
        { type: "callout", tone: "gotcha", title: "Wildcards hide the problem", text: "`\"Action\": \"*\"` or `\"Resource\": \"*\"` makes the error messages go away, which is exactly why they get committed. If a policy needs a wildcard to work, find out which call is failing and allow that one." },
        { type: "p", text: "Common mistakes: giving a CI role admin rights because setting up the exact policy felt slow, running containers as root because the image default was root, and leaving access in place after a person changes team or a project ends." },
      ],
      references: [
        { title: "Security best practices in IAM (AWS)", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
        { title: "Principle of least privilege (Wikipedia)", url: "https://en.wikipedia.org/wiki/Principle_of_least_privilege" },
        { title: "Using RBAC Authorization (Kubernetes)", url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
        { title: "Configure a Security Context for a Pod or Container", url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/" },
      ],
    },
    points: [
      { id: "devops.least-privilege.start-narrow", title: "Start from zero and add", detail: "Grant only what the task needs and widen when a specific call fails. Starting broad means the trimming usually never happens.", question: "Why is it better to add permissions than to trim them later?" },
      { id: "devops.least-privilege.separate-identities", title: "One identity per service", detail: "Separate roles and database users per service make it possible to narrow, audit and revoke each one without side effects.", question: "What goes wrong when three services share one admin credential?" },
      { id: "devops.least-privilege.container-hardening", title: "Harden the container", detail: "Run as non-root, drop capabilities, use a read-only filesystem and block privilege escalation to limit what a compromised process can do.", question: "Which compose options remove capabilities and make the filesystem read-only?" },
    ],
  },
};
