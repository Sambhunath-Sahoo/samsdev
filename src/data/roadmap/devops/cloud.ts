import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "cloud";

export const CLOUD_NETWORKING = withPoints("Networking: VPC, subnets, gateways", [
  point(
    S,
    "security-group-vs-nacl",
    "Security group vs network ACL",
    "A security group is a stateful firewall attached to an instance or network interface that only has allow rules, and return traffic is allowed automatically. A network ACL applies to a whole subnet, is stateless so return traffic needs its own rule, and supports both allow and deny rules evaluated in number order. Security groups are the main control, and NACLs add a coarse subnet-level layer such as blocking an IP range.",
    "You need to block one abusive IP from a whole subnet. Which control do you use and why not a security group?",
  ),
  point(
    S,
    "nat-gateway",
    "Public and private subnets and the NAT gateway",
    "A public subnet has a route to an internet gateway, while a private subnet does not. Instances in a private subnet reach the internet outbound through a NAT gateway placed in a public subnet, and nothing on the internet can start a connection to them. Databases and application servers normally live in private subnets. NAT gateways are billed hourly and per GB, so they matter for cost.",
    "How can a private instance download updates without being reachable from the internet?",
  ),
  point(
    S,
    "vpc-peering",
    "VPC peering",
    "VPC peering is a private network connection between two VPCs that lets them route traffic to each other using private IPs. It requires non-overlapping CIDR ranges, route table entries on both sides and suitable security group rules. It is not transitive, so if A peers with B and B with C, A cannot reach C through B. For many VPCs a transit gateway is easier to manage.",
    "VPC A peers with B and B peers with C. Can A reach C, and what would you use if you need that?",
  ),
]);

export const CLOUD_LOAD_BALANCING = withPoints("Load balancing and autoscaling", [
  point(
    S,
    "alb-vs-nlb",
    "ALB vs NLB",
    "An Application Load Balancer works at layer 7 for HTTP and HTTPS, and routes by host, path, header or query string, so it suits web apps and microservices. A Network Load Balancer works at layer 4 for TCP, UDP and TLS, handles very high throughput with low latency and gives static IPs per zone. Choose ALB for content-based routing and NLB for raw TCP or fixed IPs.",
    "Which load balancer would you put in front of a gRPC game server needing static IPs, and which for path-based routing?",
  ),
]);

export const CLOUD_NEW_TOPICS: readonly RoadmapSubsection[] = [
  "DNS with Route 53",
  withPoints("Containers on AWS: ECR, ECS and EKS", [
    point(
      S,
      "ecs-vs-eks",
      "ECS vs EKS",
      "ECS is AWS's own container orchestrator: simpler, deeply integrated with AWS and with no control plane to manage. EKS is managed Kubernetes, which brings the Kubernetes API, ecosystem and portability across clouds but adds complexity and a cluster fee. Both can run on Fargate for serverless nodes or on EC2 instances. Choose ECS for simplicity on AWS and EKS if you need Kubernetes tooling or portability.",
      "A small team runs five services only on AWS. Which would you choose, ECS or EKS, and why?",
    ),
  ]),
  "Lambda and serverless compute",
  withPoints("S3 and bucket security", [
    point(
      S,
      "securing-s3-buckets",
      "Securing S3 buckets",
      "Turn on S3 Block Public Access at account and bucket level, and grant access through IAM policies and bucket policies using least privilege rather than ACLs. Encrypt data at rest, enforce TLS in transit, enable versioning for recovery and use VPC endpoints or access points to restrict network paths. Log access with CloudTrail data events or server access logs to audit who read what.",
      "A bucket was found publicly readable. List the settings you would check and change.",
    ),
  ]),
  "Block and file storage: EBS and EFS",
  "Databases: DynamoDB and ElastiCache",
  "Secrets Manager and Parameter Store",
  "Monitoring: CloudWatch logs and alarms, and CloudTrail",
  "Practice: containerised app on ECS Fargate with RDS, ALB and CloudWatch alarms",
].map((item) => (typeof item === "string" ? { title: item } : item));
