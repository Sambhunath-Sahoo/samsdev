import type { RoadmapSubsection } from "@/types/roadmap";

export const IAM_AND_LEAST_PRIVILEGE: RoadmapSubsection = {
  title: "IAM and least privilege",
  slug: "iam-and-least-privilege",
  lesson: {
    summary: "Lock down the root user, sign in through IAM Identity Center, connect the CLI without long-lived keys, and let a server pull images with a role.",
    minutes: 12,
    blocks: [
      { type: "h2", text: "Who is acting, and what may they do" },
      { type: "p", text: "IAM answers two questions for every AWS request: **who** is calling (an identity) and **what** are they allowed to do (a policy). The principle of least privilege says to grant only what the job needs and nothing more." },
      { type: "table", head: ["Term", "What it is"], rows: [["Root user", "The email you signed up with. Can do anything, including closing the account. Use it almost never."], ["User / SSO user", "A person with their own login and permissions."], ["Role", "A set of permissions that someone or something temporarily assumes. No password."], ["Policy", "A JSON document listing allowed actions on resources."], ["Instance profile", "The wrapper that attaches a role to an EC2 instance."]] },
      { type: "h2", text: "Step 1: protect the root user" },
      { type: "list", ordered: true, items: ["Sign in as root once and open **Security credentials**.", "Add an **authenticator app** as the MFA device (two codes in a row to confirm).", "Stop using root for daily work. Keep its password in a password manager."] },
      { type: "h2", text: "Step 2: an admin identity in IAM Identity Center" },
      { type: "p", text: "Identity Center is AWS's single sign-on service, and it is free. It gives you a portal URL and **short-lived** credentials, which is safer than creating an IAM user with access keys that never expire." },
      { type: "list", ordered: true, items: ["Open IAM Identity Center and click **Enable**. Keep the single-region instance and your home region.", "**Users** → **Add user**: a username, your email, your name. AWS emails an invitation.", "**Permission sets** → **Create** → predefined **AdministratorAccess**. Set the session duration to 8 hours if you study in long sessions.", "**AWS accounts** → select the account → **Assign users or groups** → pick your user and that permission set.", "Accept the email invitation, set a password and register an MFA device for this user too."] },
      { type: "callout", tone: "gotcha", title: "Do not create the user in the wrong console", text: "The older **IAM → Users → Create user** screen makes a user that needs long-lived access keys for the CLI. The Identity Center screen is the one with **Permission sets** and **AWS accounts** in its menu." },
      { type: "h2", text: "Step 3: connect the CLI with SSO" },
      {
        type: "code",
        language: "ini",
        title: "~/.aws/config",
        code: `[sso-session myapp]
sso_start_url = https://d-1234567890.awsapps.com/start
sso_region = ap-south-1
sso_registration_scopes = sso:account:access

[profile myapp]
sso_session = myapp
sso_account_id = 111122223333
sso_role_name = AdministratorAccess
region = ap-south-1
output = json`,
      },
      {
        type: "code",
        language: "bash",
        code: `aws sso login --profile myapp                 # opens the browser, approve once
aws sts get-caller-identity --profile myapp   # who am I?`,
      },
      { type: "p", text: "The identity check should show an `assumed-role/AWSReservedSSO_AdministratorAccess_…/your-username` ARN. If you see `:root`, you are using the root user." },
      { type: "callout", tone: "tip", title: "No keys on disk", text: "The CLI keeps only a session token that expires on its own. When it does, run `aws sso login --profile myapp` again. Nothing long-lived sits in `~/.aws`." },
      { type: "h2", text: "Roles for machines: an instance profile" },
      { type: "p", text: "A server also needs an identity. Instead of putting access keys on it, create a role the instance can assume. Here the role may only read from ECR, which is least privilege in practice." },
      {
        type: "list",
        ordered: true,
        items: [
          "IAM → **Roles** → **Create role** → trusted entity **AWS service**, use case **EC2**.",
          "Attach the managed policy `AmazonEC2ContainerRegistryReadOnly`.",
          "Name it `myapp-ec2-ecr-read`. The console also creates the instance profile of the same name.",
          "Choose that instance profile in the **Advanced details** of the launch wizard.",
        ],
      },
      { type: "callout", tone: "cost", title: "IAM and Identity Center are free", text: "Users, roles, policies and MFA cost nothing. Costs come from the resources you create with them." },
      { type: "p", text: "`AdministratorAccess` is acceptable for a personal learning account. In a team, give each person or pipeline a narrower permission set." },
    ],
    references: [
      { title: "AWS docs: Security best practices in IAM", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
      { title: "AWS docs: Policies and permissions in IAM", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html" },
      { title: "AWS docs: What is IAM Identity Center?", url: "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html" },
    ],
  },
  points: [
    {
      id: "devops.cloud.iam.root-and-mfa",
      title: "Protect root with MFA and stop using it",
      detail: "The root user can delete everything. Turn on MFA, store the password safely, and do daily work through a separate admin identity.",
      question: "Name two things you should never do as the root user.",
    },
    {
      id: "devops.cloud.iam.identity-center",
      title: "Identity Center and short-lived credentials",
      detail: "You sign in at an access portal and get temporary credentials. Nothing permanent has to be copied to your laptop.",
      question: "Why is an SSO session safer than an IAM user's access key stored in `~/.aws/credentials`?",
    },
    {
      id: "devops.cloud.iam.cli-sso-profile",
      title: "An SSO profile for the CLI",
      detail: "The `sso-session` and `profile` blocks in `~/.aws/config` tell the CLI which portal, account and permission set to use. `aws sso login` starts a session.",
      question: "Which command shows whether you are root or the SSO admin role right now?",
    },
    {
      id: "devops.cloud.iam.roles-and-instance-profiles",
      title: "Roles and instance profiles for servers",
      detail: "A role grants permissions without a password. An instance profile attaches it to an EC2 instance so the server can, for example, read from ECR with no keys on disk.",
      question: "What would you have to store on the server if you did not use an instance profile?",
    },
    {
      id: "devops.cloud.iam.least-privilege",
      title: "Least privilege",
      detail: "Grant the smallest set of actions that does the job. The ECR read-only policy lets the server pull images but not push them or touch other services.",
      question: "If the server is compromised, what can an attacker do with `AmazonEC2ContainerRegistryReadOnly`?",
    },
  ],
};
