import type { LessonEntry } from "@/types/roadmap";

export const CONTAINERS_ON_AWS_ECR_ECS_EKS: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Containers on AWS: ECR, ECS and EKS",
    slug: "containers-on-aws-ecr-ecs-eks",
    lesson: {
      summary: "Store images in ECR, run them with ECS or EKS, and choose between the two without over-building.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Three services, three jobs" },
        { type: "table", head: ["Service", "Job"], rows: [["ECR (Elastic Container Registry)", "Private registry for your images, with IAM access control and optional scanning"], ["ECS (Elastic Container Service)", "AWS's own orchestrator: keeps N copies of your containers running"], ["EKS (Elastic Kubernetes Service)", "A managed Kubernetes control plane that AWS operates for you"]] },
        { type: "p", text: "ECR is where an image goes after your CI builds it. ECS and EKS are two ways to run that image. Both can place containers on **Fargate** (AWS manages the servers, you pay per task CPU and memory) or on EC2 instances you manage." },
        { type: "h2", text: "Pushing an image to ECR" },
        {
          type: "code",
          language: "bash",
          code: `ACCOUNT=111122223333
REGION=ap-south-1
REPO=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/myapp-api

aws ecr create-repository --repository-name myapp-api --image-scanning-configuration scanOnPush=true
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$REGION.amazonaws.com
docker build -t $REPO:1.0.0 .
docker push $REPO:1.0.0`,
        },
        { type: "p", text: "The login token expires after 12 hours, so CI runs this on every build. Tag images with a version or commit hash, not only `latest`, so a deployment points at exactly one build. An ECR lifecycle policy can expire old untagged images so storage does not grow forever." },
        { type: "h2", text: "How ECS fits together" },
        { type: "list", items: ["**Task definition**: the blueprint. Image, CPU and memory, ports, environment, secrets, log configuration.", "**Task**: one running instance of a task definition.", "**Service**: keeps the desired number of tasks running, replaces failed ones, and registers them with a load balancer.", "**Cluster**: the logical group the services run in."] },
        { type: "p", text: "Two IAM roles confuse everyone at first. The **task execution role** is used by ECS itself to pull the image and write logs. The **task role** is what your application code uses to call AWS APIs such as S3. Putting S3 permissions on the execution role is a classic mistake." },
        { type: "h2", text: "ECS or EKS" },
        { type: "p", text: "ECS has no control plane to think about, integrates directly with IAM, ALB and CloudWatch, and a small team can be productive in a day. EKS gives you the Kubernetes API, Helm charts, operators and skills that transfer to other clouds, in exchange for more moving parts, version upgrades and a per-cluster hourly fee." },
        { type: "p", text: "If you run a handful of services only on AWS, start with ECS on Fargate. Choose EKS when you already know Kubernetes, need its ecosystem, or must run the same platform across clouds. Starting with EKS because it looks better on a CV is how a two-person project ends up maintaining a cluster." },
        { type: "callout", tone: "gotcha", title: "Fargate tasks need a path to ECR", text: "A task in a private subnet can only pull its image if it can reach ECR and S3, through a NAT gateway or VPC endpoints. A task stuck in PROVISIONING and then stopped with a pull error is usually this, not a bad image." },
      ],
      references: [
        { title: "What is Amazon Elastic Container Registry?", url: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html" },
        { title: "What is Amazon Elastic Container Service?", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html" },
        { title: "Amazon ECS task definitions", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html" },
        { title: "What is Amazon EKS?", url: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" },
      ],
    },
  },
};
