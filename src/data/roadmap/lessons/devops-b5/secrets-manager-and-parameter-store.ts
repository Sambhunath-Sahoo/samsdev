import type { LessonEntry } from "@/types/roadmap";

export const SECRETS_MANAGER_AND_PARAMETER_STORE: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Secrets Manager and Parameter Store",
    slug: "secrets-manager-and-parameter-store",
    lesson: {
      summary: "Keep passwords and config out of images and repos, and inject them into ECS tasks at start-up through IAM.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The problem" },
        { type: "p", text: "A database password in a Dockerfile, a `.env` file in git or a plain environment variable in a task definition is readable by anyone with that file, and it stays in history after you delete it. AWS has two services that store the value centrally, encrypt it, check IAM on every read, and log each access." },
        { type: "h2", text: "Which one to use" },
        {
          type: "table",
          head: ["", "Secrets Manager", "Parameter Store (SSM)"],
          rows: [
            ["Best for", "Credentials and API keys", "App configuration, plus occasional secrets"],
            ["Rotation", "Built in, with Lambda-based rotation (managed for RDS)", "None built in"],
            ["Cost", "Per secret per month, plus per API calls", "Standard parameters are free; advanced ones cost"],
            ["Naming", "Any name", "Path hierarchy such as `/myapp/prod/DB_HOST`"],
            ["Encrypted values", "Always, with KMS", "Use type `SecureString`"],
          ],
        },
        { type: "p", text: "A common split: plain config such as feature flags and URLs in Parameter Store, and the database password in Secrets Manager so rotation is available. For a hobby project, SecureString parameters are the cheap and perfectly adequate choice." },
        {
          type: "code",
          language: "bash",
          code: `aws ssm put-parameter --name /myapp/prod/STRIPE_KEY \\
  --type SecureString --value 'sk_live_xxx'

aws secretsmanager create-secret --name myapp/prod/db \\
  --secret-string '{"username":"app","password":"change-me"}'

aws ssm get-parameter --name /myapp/prod/STRIPE_KEY --with-decryption \\
  --query Parameter.Value --output text`,
        },
        { type: "h2", text: "Injecting into an ECS task" },
        { type: "p", text: "In the container definition, list `secrets` instead of `environment`. ECS fetches each value when the task starts and exposes it to the process as an environment variable. The value never appears in the task definition itself, only its ARN does." },
        {
          type: "code",
          language: "json",
          title: "container definition fragment",
          code: `"secrets": [
  {
    "name": "DATABASE_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:ap-south-1:111122223333:secret:myapp/prod/db-AbCdEf:password::"
  },
  {
    "name": "STRIPE_KEY",
    "valueFrom": "arn:aws:ssm:ap-south-1:111122223333:parameter/myapp/prod/STRIPE_KEY"
  }
]`,
        },
        { type: "p", text: "The `:password::` suffix picks one JSON key out of the secret. The permission to read these values must be on the **task execution role**, because ECS does the fetching before your code starts. Grant `secretsmanager:GetSecretValue` or `ssm:GetParameters` on those exact ARNs, plus `kms:Decrypt` if you use your own KMS key." },
        { type: "h2", text: "Habits that keep you safe" },
        { type: "list", items: ["Give each environment its own path or name, and its own permissions.", "Scope IAM policies to one prefix such as `/myapp/prod/*`, never to all secrets.", "Enable rotation for database credentials where you can.", "Never log environment variables, and never print a secret to debug a deployment.", "Treat a leaked secret as burned: rotate it, do not just remove it from the repo."] },
        { type: "callout", tone: "gotcha", title: "Changes do not reach running tasks", text: "ECS reads the value at task start. After changing a secret or parameter, force a new deployment so replacement tasks pick it up. A task stuck at startup with a message about a secret it cannot retrieve is nearly always a missing permission on the execution role or a wrong ARN." },
      ],
      references: [
        { title: "What is AWS Secrets Manager?", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" },
        { title: "AWS Systems Manager Parameter Store", url: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" },
        { title: "Rotate AWS Secrets Manager secrets", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" },
        { title: "Pass Secrets Manager secrets through Amazon ECS environment variables", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html" },
      ],
    },
    points: [
      {
        id: "devops.secrets-manager-and-parameter-store.which-service",
        title: "Secrets Manager versus Parameter Store",
        detail: "Secrets Manager adds rotation and charges per secret. Parameter Store is free at the standard tier, organises values in paths, and encrypts them when the type is SecureString.",
        question: "Which would you choose for plain app config, and which for a database password that must rotate?",
      },
      {
        id: "devops.secrets-manager-and-parameter-store.execution-role",
        title: "Task execution role reads the secret",
        detail: "ECS fetches secrets as the task starts, so the permission belongs on the task execution role, not the task role. Scope the policy to the specific secret or parameter ARNs.",
        question: "A task fails to start with an access denied error on a secret. Which role do you fix?",
      },
      {
        id: "devops.secrets-manager-and-parameter-store.rotate-after-leak",
        title: "A leaked secret must be rotated",
        detail: "Deleting a secret from a repository does not remove it from history or from anyone who cloned it. Rotate the credential at its source and then update the stored value.",
        question: "You committed an API key by mistake and removed it in the next commit. Is it safe?",
      },
    ],
  },
};
