import type { LessonEntry } from "@/types/roadmap";

export const PRACTICE_ECS_FARGATE_RDS_ALB_ALARMS: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Practice: containerised app on ECS Fargate with RDS, ALB and CloudWatch alarms",
    slug: "practice-ecs-fargate-rds-alb-alarms",
    lesson: {
      summary: "Put the whole section together: a container behind an ALB, talking to a private RDS database, with logs, secrets and alarms, then tear it down.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The target architecture" },
        { type: "p", text: "Users reach an **ALB** in public subnets. The ALB forwards to **Fargate tasks** in private subnets, which read the database password from a secret and talk to **RDS** in private subnets. Logs go to CloudWatch, and alarms email you when something looks wrong. Every piece was covered in an earlier lesson, so this one is about order and wiring." },
        { type: "h2", text: "Build it in this order" },
        { type: "list", ordered: true, items: ["**Network**: a VPC with two public and two private subnets across two AZs, an internet gateway, and one NAT gateway (or VPC endpoints for ECR, S3 and logs).", "**Security groups**: `alb-sg` allows 80 and 443 from anywhere; `app-sg` allows the app port from `alb-sg`; `db-sg` allows 5432 from `app-sg`.", "**Database**: RDS Postgres in the private subnets, not publicly accessible, with the managed master password in Secrets Manager.", "**Image**: build, tag with a version and push to ECR.", "**ECS**: a cluster, a task definition, then a service with the ALB target group attached.", "**Alarms**: ALB 5xx, unhealthy hosts, task CPU, RDS storage, all sending to one SNS topic.", "**Verify, then delete everything.**"] },
        {
          type: "code",
          language: "json",
          title: "task-definition.json",
          code: `{
  "family": "myapp-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::111122223333:role/myapp-task-execution",
  "taskRoleArn": "arn:aws:iam::111122223333:role/myapp-task",
  "containerDefinitions": [{
    "name": "api",
    "image": "111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:1.0.0",
    "essential": true,
    "portMappings": [{ "containerPort": 3000 }],
    "environment": [{ "name": "DB_HOST", "value": "myapp-db.abc123.ap-south-1.rds.amazonaws.com" }],
    "secrets": [{ "name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:ap-south-1:111122223333:secret:rds-db-secret-AbCdEf:password::" }],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/myapp-api",
        "awslogs-region": "ap-south-1",
        "awslogs-stream-prefix": "api"
      }
    }
  }]
}`,
        },
        {
          type: "code",
          language: "bash",
          code: `aws logs create-log-group --log-group-name /ecs/myapp-api
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster myapp --service-name api \\
  --task-definition myapp-api --desired-count 2 --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-aaa,subnet-bbb],securityGroups=[sg-app],assignPublicIp=DISABLED}" \\
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:111122223333:targetgroup/myapp/abc,containerName=api,containerPort=3000`,
        },
        { type: "p", text: "The log group must exist before the task starts, or the task fails to launch. Both IAM roles from the containers lesson appear here: the execution role pulls the image, writes logs and reads the secret, while the task role holds whatever your code itself calls." },
        { type: "h2", text: "Prove it works" },
        { type: "list", items: ["`aws ecs describe-services` shows running count equal to desired count.", "The target group shows both targets **healthy**. If not, check the health check path and that `app-sg` allows the ALB.", "`curl` the ALB's DNS name and get a real response from the app that touches the database.", "Stop one task with `aws ecs stop-task` and watch the service replace it while requests still succeed.", "Force a failure, for example point at a bad health path, and confirm the alarm email arrives."] },
        { type: "callout", tone: "cost", title: "Tear it down in the right order", text: "The ALB, NAT gateway, RDS instance and Fargate tasks all bill by the hour. Delete the service (scale to zero first), then the ALB and target group, RDS (take a snapshot if you care), the NAT gateway and its Elastic IP, then the log groups and ECR images. Afterwards check Cost Explorer and your budget alert the next day." },
        { type: "callout", tone: "gotcha", title: "Debugging order", text: "When a task will not stay up, read the stopped task's reason in the ECS console first, then the log group, then the security groups. Most failures here are image pull access, a missing log group, a secret permission, or a database security group rule." },
      ],
      references: [
        { title: "Architect for AWS Fargate for Amazon ECS", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html" },
        { title: "Amazon ECS task definitions", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html" },
        { title: "Automatically scale your Amazon ECS service", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html" },
        { title: "Health checks for Application Load Balancer target groups", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" },
      ],
    },
    points: [
      {
        id: "devops.practice-ecs-fargate-rds-alb-alarms.security-group-chain",
        title: "Chain security groups ALB to app to database",
        detail: "The ALB group takes traffic from the internet, the app group accepts the app port only from the ALB group, and the database group accepts 5432 only from the app group. Nothing else needs to be open.",
        question: "Which source does the database security group name in its inbound rule?",
      },
      {
        id: "devops.practice-ecs-fargate-rds-alb-alarms.healthy-targets",
        title: "Healthy targets prove the wiring",
        detail: "A service with running tasks is not enough. The target group must show targets healthy, which proves the path, the port, the health check and the security groups all agree.",
        question: "Tasks are running but the ALB returns 503. What do you inspect first?",
      },
      {
        id: "devops.practice-ecs-fargate-rds-alb-alarms.teardown-order",
        title: "Tear down and verify the bill",
        detail: "ALB, NAT gateway, RDS and running tasks bill hourly, so delete them as soon as the practice ends. Check Cost Explorer or the budget alert the next day to confirm nothing is left running.",
        question: "Name four resources in this stack that keep billing until deleted.",
      },
    ],
  },
};
