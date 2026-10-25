import type { LessonEntry } from "@/types/roadmap";

export const S3_AND_BUCKET_SECURITY: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "S3 and bucket security",
    slug: "s3-and-bucket-security",
    lesson: {
      summary: "Store files in S3 and lock the bucket down: block public access, grant least privilege, encrypt, and keep an audit trail.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "What S3 is" },
        { type: "p", text: "**S3** is object storage. A **bucket** holds **objects**, each identified by a key such as `uploads/2026/avatar.png`. There are no real folders, only keys that contain slashes. Objects are written whole, not edited in place, and S3 scales without capacity planning. Use it for user uploads, build artifacts, backups, static sites and logs. Do not use it as a filesystem or a database." },
        { type: "p", text: "Bucket names are globally unique across all AWS accounts, and the bucket lives in one region. Storage classes trade price against access speed: Standard for hot data, cheaper infrequent-access tiers, and Glacier tiers for archives. Lifecycle rules move or delete objects automatically, which is the easiest way to stop old logs from billing forever." },
        { type: "h2", text: "The ways a bucket gets exposed" },
        { type: "p", text: "Almost every S3 leak is a configuration choice: a public bucket policy, a public ACL, or credentials in a repository. AWS now defaults new buckets to Block Public Access on and ACLs disabled, but older buckets, copied templates and well-meaning \"make it public so the image loads\" edits still cause incidents." },
        { type: "h2", text: "Lock it down in layers" },
        { type: "list", ordered: true, items: ["**Block Public Access** on the account and on every bucket. It overrides any policy or ACL that would make data public.", "**ACLs off**: set Object Ownership to bucket owner enforced and manage access with policies.", "**Least privilege IAM**: the app's role gets `s3:GetObject` and `s3:PutObject` on one prefix, not `s3:*` on `*`.", "**Encryption**: new objects are encrypted at rest by default with S3-managed keys. Use KMS keys when you need key-level control and audit.", "**TLS only**: deny any request that is not over HTTPS.", "**Versioning** to recover from overwrites and deletes, plus lifecycle rules to clean old versions."] },
        {
          type: "code",
          language: "bash",
          code: `aws s3api put-public-access-block --bucket myapp-uploads \\
  --public-access-block-configuration \\
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-versioning --bucket myapp-uploads \\
  --versioning-configuration Status=Enabled
aws s3api put-bucket-policy --bucket myapp-uploads --policy file://policy.json`,
        },
        {
          type: "code",
          language: "json",
          title: "policy.json: refuse plain HTTP",
          code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyInsecureTransport",
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": ["arn:aws:s3:::myapp-uploads", "arn:aws:s3:::myapp-uploads/*"],
    "Condition": { "Bool": { "aws:SecureTransport": "false" } }
  }]
}`,
        },
        { type: "h2", text: "Sharing a file without making the bucket public" },
        { type: "p", text: "To let a browser download or upload one object, have your backend generate a **presigned URL**. It carries a signature and an expiry, so it works for minutes and only for that key and method. To serve public static assets, keep the bucket private and put CloudFront in front of it, instead of opening the bucket." },
        { type: "callout", tone: "gotcha", title: "Audit trail is not on by default for reads", text: "CloudTrail records bucket-level management calls by default, but object-level reads and writes are **data events** that you must enable, and they are billed. Turn them on for buckets that hold sensitive data, or you will not be able to answer who downloaded what." },
      ],
      references: [
        { title: "What is Amazon S3?", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
        { title: "Blocking public access to your Amazon S3 storage", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" },
        { title: "Security best practices for Amazon S3", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html" },
      ],
    },
  },
};
