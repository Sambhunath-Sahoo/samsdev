import type { LessonEntry } from "@/types/roadmap";

export const DATA_RDS: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Data: RDS",
    slug: "data-rds",
    lesson: {
      summary: "Run Postgres or MySQL as a managed service: private networking, backups, Multi-AZ failover and the settings that bite later.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What RDS does for you" },
        { type: "p", text: "**Amazon RDS** runs a relational engine (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, plus Aurora as AWS's own variant) on an instance AWS operates. It handles provisioning, OS and engine patching, automated backups, monitoring hooks and failover. You still own schema design, queries, indexes and connection handling. You do not get an OS shell on the host." },
        { type: "p", text: "Running Postgres yourself on EC2 is cheaper on paper. It stops being cheaper the first time you restore a backup under pressure. For most application teams RDS is the right default." },
        { type: "h2", text: "Put it in private subnets" },
        { type: "p", text: "An RDS instance lives in a **DB subnet group**, which is a list of subnets in at least two availability zones. Use private subnets, set public accessibility to off, and give the database a security group that allows the database port only from your application's security group. That one rule is the whole firewall story for most apps." },
        {
          type: "code",
          language: "bash",
          title: "A small Postgres instance",
          code: `aws rds create-db-instance \\
  --db-instance-identifier myapp-db \\
  --engine postgres \\
  --db-instance-class db.t4g.micro \\
  --allocated-storage 20 \\
  --master-username app_admin \\
  --manage-master-user-password \\
  --db-subnet-group-name myapp-private \\
  --vpc-security-group-ids sg-0123456789abcdef0 \\
  --backup-retention-period 7 \\
  --storage-encrypted \\
  --no-publicly-accessible \\
  --deletion-protection`,
        },
        { type: "p", text: "`--manage-master-user-password` makes RDS create the admin password in Secrets Manager and rotate it, so it never appears in your shell history or Terraform state." },
        { type: "h2", text: "Backups, Multi-AZ and replicas are three different things" },
        {
          type: "table",
          head: ["Feature", "Protects against", "Does not give you"],
          rows: [
            ["Automated backups and snapshots", "Bad deploys, deleted rows, corruption; supports point-in-time restore within the retention window", "A fast recovery: a restore creates a new instance"],
            ["Multi-AZ", "Loss of an instance or an availability zone, with automatic failover to a standby", "Extra read capacity in the classic instance deployment"],
            ["Read replica", "Read load, and a promotable copy", "Automatic failover"],
          ],
        },
        { type: "p", text: "Automated backups can be kept for up to 35 days. Restoring to a point in time builds a **new** instance with a new endpoint, so your app needs a config change, or a DNS name you control, to switch over." },
        { type: "h2", text: "Common mistakes" },
        { type: "list", items: ["Leaving the instance publicly accessible \"just for now\" and never closing it.", "Opening port 5432 to `0.0.0.0/0` instead of referencing the app's security group.", "Treating Multi-AZ as a backup. A `DROP TABLE` replicates to the standby instantly.", "Opening a new connection per request. Small instances run out of connections quickly, so use a pool, or RDS Proxy at larger scale.", "Skipping the final snapshot when deleting. Keep deletion protection on for anything real."] },
        { type: "callout", tone: "cost", title: "What keeps billing", text: "You pay for instance hours, provisioned storage, backup storage beyond your database size, and Multi-AZ doubles the instance cost. A stopped instance is only stopped temporarily: RDS starts it again after seven days. For a lab you are done with, take a snapshot, then delete the instance." },
      ],
      references: [
        { title: "What is Amazon Relational Database Service (Amazon RDS)?", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html" },
        { title: "Configuring and managing a Multi-AZ deployment for Amazon RDS", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html" },
        { title: "Introduction to backups - Amazon RDS", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" },
        { title: "Working with DB instance read replicas", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" },
      ],
    },
    points: [
      {
        id: "devops.data-rds.private-subnets",
        title: "Keep the database private",
        detail: "Place RDS in a DB subnet group of private subnets with public access off. Allow the database port only from the application's security group, not from an IP range.",
        question: "What should the inbound rule on the database security group name as its source?",
      },
      {
        id: "devops.data-rds.backups-vs-multi-az",
        title: "Backups are not Multi-AZ",
        detail: "Multi-AZ gives automatic failover to a standby, but it replicates every change including mistakes. Automated backups and snapshots are what let you restore to an earlier point in time.",
        question: "A developer drops a production table. Does Multi-AZ help, and what does?",
      },
      {
        id: "devops.data-rds.restore-new-instance",
        title: "A restore creates a new instance",
        detail: "Point-in-time restore and snapshot restore build a new DB instance with a new endpoint. Plan for the app to be repointed, ideally through a DNS name or configuration value you control.",
        question: "After a point-in-time restore, why does the application still talk to the old database?",
      },
      {
        id: "devops.data-rds.managed-password",
        title: "Let RDS manage the master password",
        detail: "With managed master user passwords, RDS stores the admin credential in Secrets Manager and can rotate it. The password never has to live in code, shell history or state files.",
        question: "Where does the admin password live when you create an instance with managed master user password?",
      },
    ],
  },
};
