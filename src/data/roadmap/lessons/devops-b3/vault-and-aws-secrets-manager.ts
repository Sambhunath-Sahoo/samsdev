import type { LessonEntry } from "@/types/roadmap";

export const VAULT_AND_AWS_SECRETS_MANAGER: LessonEntry = {
  track: "devops",
  section: "Security and reliability practice",
  subsection: {
    title: "HashiCorp Vault and AWS Secrets Manager",
    slug: "vault-and-aws-secrets-manager",
    lesson: {
      summary: "Two ways to store secrets centrally, hand them to applications with access control and an audit trail, and rotate them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What a secrets manager gives you" },
        { type: "p", text: "A `.env` file has no access control, no history of who read what, and no way to rotate a value without redeploying by hand. A secrets manager stores values encrypted, checks the caller's identity on every read, logs each access, and can change a secret on a schedule. Applications fetch the value when they need it instead of carrying a copy." },
        { type: "h2", text: "AWS Secrets Manager" },
        { type: "p", text: "A managed AWS service. Each secret is a named string, usually JSON. Access is controlled by IAM, so an EC2 instance role or an ECS task role can be allowed to read one named secret and nothing else. Reads show up in CloudTrail. For RDS databases it can rotate the password for you using a Lambda function. You pay per secret per month and per API call, so fetch once at startup and cache, rather than on every request." },
        {
          type: "code",
          language: "bash",
          code: `aws secretsmanager create-secret \\
  --name prod/myapp/db \\
  --secret-string '{"username":"app","password":"change-me"}'

aws secretsmanager get-secret-value \\
  --secret-id prod/myapp/db \\
  --query SecretString --output text`,
        },
        {
          type: "code",
          language: "json",
          title: "IAM policy for the app role",
          code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:prod/myapp/db-*"
  }]
}`,
        },
        { type: "p", text: "The trailing `-*` is needed because AWS appends a random suffix to the secret's ARN." },
        { type: "h2", text: "HashiCorp Vault" },
        { type: "p", text: "Vault is software you run (or rent as HCP Vault). It works on any cloud or on-prem. Clients authenticate through a method such as a Kubernetes service account, an AWS IAM role or a token, and receive a short-lived token tied to **policies** that say which paths they can read. Beyond storing key/value data, its strength is **dynamic secrets**: it can create a database user on demand with a short lease, then delete it when the lease expires, so nobody holds a long-lived password." },
        {
          type: "code",
          language: "bash",
          title: "local dev server (never use -dev in production)",
          code: `vault server -dev &
export VAULT_ADDR=http://127.0.0.1:8200
vault kv put -mount=secret myapp db_password=change-me
vault kv get -mount=secret myapp`,
        },
        { type: "h2", text: "Choosing" },
        { type: "list", items: ["Everything runs on AWS and you want little to operate: **Secrets Manager** (or Parameter Store for cheap, simple values).", "Several clouds, Kubernetes, or you want dynamic credentials and fine-grained policy: **Vault**, accepting that you must run it, unseal it and back it up."] },
        { type: "callout", tone: "cost", title: "The manager is a dependency", text: "If Vault is down or sealed, apps that fetch secrets at start cannot boot. Run it highly available, and make sure the first secret you can always reach, the way your app proves who it is, does not itself live in a file in the repo." },
        { type: "p", text: "Common mistakes: reading a secret on every request, granting `secretsmanager:*` on all resources, and storing the Vault root token in a shell profile." },
      ],
      references: [
        { title: "What is Vault? (HashiCorp Developer)", url: "https://developer.hashicorp.com/vault/docs/what-is-vault" },
        { title: "Database secrets engine (Vault)", url: "https://developer.hashicorp.com/vault/docs/secrets/databases" },
        { title: "What is AWS Secrets Manager?", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" },
        { title: "Rotate AWS Secrets Manager secrets", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" },
      ],
    },
    points: [
      { id: "devops.vault-and-aws-secrets-manager.identity-based-read", title: "Reads are tied to identity", detail: "Both tools check who is asking. In AWS that is an IAM role, in Vault a policy attached to the login. Each service gets access to its own paths only.", question: "How does an ECS task prove to Secrets Manager that it may read a secret?" },
      { id: "devops.vault-and-aws-secrets-manager.rotation", title: "Rotation without redeploying", detail: "Secrets Manager can rotate RDS passwords on a schedule. Vault can go further and issue dynamic, short-lived database credentials.", question: "What is a dynamic secret, and why is it safer than a static password?" },
      { id: "devops.vault-and-aws-secrets-manager.cache-and-availability", title: "Cache reads and plan for outages", detail: "Fetch at start-up and cache instead of on every request, which saves cost and load. Plan what happens if the secret store is unreachable.", question: "What breaks if Vault is sealed when your app starts?" },
    ],
  },
};
