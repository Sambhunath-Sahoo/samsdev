import type { LessonEntry } from "@/types/roadmap";

export const CLOUDFORMATION_AND_PULUMI_VS_TERRAFORM: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "CloudFormation and Pulumi compared with Terraform",
    slug: "cloudformation-and-pulumi-vs-terraform",
    lesson: {
      summary: "Know what CloudFormation and Pulumi do differently from Terraform, so you can pick a tool or read a team's existing setup.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Same goal, different trade-offs" },
        { type: "p", text: "All three tools take a description of infrastructure and make the cloud match it. They differ in who hosts the engine, how you write the description, and which clouds they cover. Knowing the differences matters because you will meet all of them in real teams." },
        { type: "h2", text: "AWS CloudFormation" },
        { type: "p", text: "CloudFormation is AWS's own service. You write a **template** in YAML or JSON, create a **stack** from it, and AWS runs the deployment. There is no state file for you to store: AWS keeps the stack's state and handles locking. Before an update you can create a **change set** to preview what will change, much like `terraform plan`." },
        {
          type: "code",
          language: "yaml",
          title: "bucket.yml",
          code: `AWSTemplateFormatVersion: "2010-09-09"
Resources:
  AssetsBucket:
    Type: AWS::S3::Bucket
    Properties:
      VersioningConfiguration:
        Status: Enabled
Outputs:
  BucketName:
    Value: !Ref AssetsBucket`,
        },
        {
          type: "code",
          language: "bash",
          code: `aws cloudformation deploy --stack-name myapp-assets --template-file bucket.yml`,
        },
        { type: "p", text: "Strengths: no state to manage, tight AWS integration, automatic rollback when a stack update fails. Weaknesses: AWS only, verbose templates, and a failed stack can get stuck in a state that needs manual cleanup." },
        { type: "h2", text: "Pulumi" },
        { type: "p", text: "Pulumi uses general-purpose languages (TypeScript, Python, Go, C# and others) instead of a configuration language. You get loops, functions, types and unit tests. It works like Terraform underneath: a preview, an update, and a state that records what exists, stored in Pulumi Cloud or a self-managed backend such as an S3 bucket." },
        {
          type: "code",
          language: "typescript",
          code: `import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("assets", {
  versioning: { enabled: true },
});

export const bucketName = bucket.id;`,
        },
        { type: "p", text: "Strengths: real code for logic-heavy setups, multi-cloud, familiar tooling for developers. Weakness: freedom to write clever code that is harder to review than a plain declarative file." },
        { type: "h2", text: "Side by side" },
        { type: "table", head: ["", "Terraform", "CloudFormation", "Pulumi"], rows: [["Language", "HCL", "YAML / JSON", "TypeScript, Python, Go and more"], ["Clouds", "Many, via providers", "AWS only", "Many"], ["State", "You store it (remote backend)", "AWS stores it", "Pulumi Cloud or your own backend"], ["Preview", "`terraform plan`", "Change sets", "`pulumi preview`"], ["Ecosystem", "Largest registry of providers and modules", "AWS-native, wide service coverage", "Growing, can reuse Terraform providers"]] },
        { type: "callout", tone: "tip", title: "How to choose", text: "On an AWS-only team that wants no state handling, CloudFormation is a sound default. For multi-cloud or the biggest community, Terraform. If your team prefers writing TypeScript or Python and values testing infrastructure code, try Pulumi. Consistency across a team matters more than the pick." },
        { type: "callout", tone: "gotcha", title: "Licensing and forks", text: "Terraform's license changed in 2023 and a community fork, OpenTofu, now exists. The configuration language is largely compatible, but check which binary your team uses and which version your pipeline runs." },
      ],
      references: [
        { title: "What is AWS CloudFormation? (AWS documentation)", url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html" },
        { title: "Updating stacks using change sets (AWS documentation)", url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html" },
        { title: "Pulumi concepts (Pulumi documentation)", url: "https://www.pulumi.com/docs/iac/concepts/" },
        { title: "What is Terraform? (HashiCorp Terraform documentation)", url: "https://developer.hashicorp.com/terraform/intro" },
      ],
    },
    points: [
      {
        id: "devops.cloudformation-and-pulumi-vs-terraform.state-handling",
        title: "Who stores the state",
        detail: "Terraform needs a backend you manage, such as S3. CloudFormation keeps stack state inside AWS, and Pulumi uses Pulumi Cloud or a backend you choose. This changes who handles locking, access and backups.",
        question: "Which of the three tools needs you to create and protect a state bucket, and why?",
      },
      {
        id: "devops.cloudformation-and-pulumi-vs-terraform.cloudformation-change-sets",
        title: "CloudFormation stacks and change sets",
        detail: "A template becomes a stack, and a change set previews an update before it runs. It plays the same role as terraform plan.",
        question: "What does a change set let you do before updating a stack?",
      },
      {
        id: "devops.cloudformation-and-pulumi-vs-terraform.pulumi-real-languages",
        title: "Pulumi uses real programming languages",
        detail: "Infrastructure is written in TypeScript, Python or Go, with loops, functions and tests. That helps with complex logic and can hurt readability when code gets too clever.",
        question: "Name one benefit and one risk of describing infrastructure in a general-purpose language.",
      },
      {
        id: "devops.cloudformation-and-pulumi-vs-terraform.choosing-a-tool",
        title: "Choosing between the tools",
        detail: "Pick on cloud coverage, team skills and state handling. An AWS-only team may prefer CloudFormation, a multi-cloud team Terraform, and a developer-heavy team Pulumi.",
        question: "Which tool would you pick for an AWS-only team that does not want to manage state, and why?",
      },
    ],
  },
};
