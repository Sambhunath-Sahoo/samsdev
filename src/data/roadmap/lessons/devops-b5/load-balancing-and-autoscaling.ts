import type { LessonEntry } from "@/types/roadmap";

export const LOAD_BALANCING_AND_AUTOSCALING: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Load balancing and autoscaling",
    slug: "load-balancing-and-autoscaling",
    lesson: {
      summary: "Spread traffic over several healthy targets with a load balancer, and let an Auto Scaling group add or remove them as load changes.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why a load balancer comes first" },
        { type: "p", text: "One server is one point of failure and a hard ceiling. A **load balancer** gives clients a single stable address, forwards each request to one of several **targets**, and stops sending traffic to a target that fails its health check. Once that exists, you can replace or add servers without clients noticing." },
        { type: "h2", text: "How an Application Load Balancer is wired" },
        { type: "list", items: ["**Listener**: a port and protocol the load balancer accepts, such as HTTPS on 443 with an ACM certificate.", "**Rules**: conditions on host, path, header or query string, each pointing at an action. The default rule catches the rest.", "**Target group**: the set of instances, IPs or Lambda functions that receive traffic, plus the health check definition.", "**Health check**: a path such as `/health` and the status codes that count as healthy."] },
        { type: "p", text: "Place the load balancer in public subnets in at least two availability zones, and the targets in private subnets. The targets' security group should allow the app port only from the load balancer's security group." },
        { type: "h2", text: "ALB versus NLB" },
        {
          type: "table",
          head: ["", "Application (ALB)", "Network (NLB)"],
          rows: [
            ["Layer", "7: HTTP, HTTPS, gRPC, WebSocket", "4: TCP, UDP, TLS"],
            ["Routing", "By host, path, header, query string", "By port and protocol only"],
            ["Addresses", "DNS name; IPs change", "A static IP per zone, optionally your own Elastic IPs"],
            ["Use it for", "Web apps and APIs, several services behind one domain", "Non-HTTP protocols, very high throughput, fixed IPs for allow-lists"],
          ],
        },
        { type: "p", text: "Default to an ALB for a web app. Choose an NLB when the protocol is not HTTP, or when a partner needs to allow-list fixed IP addresses." },
        { type: "h2", text: "Autoscaling" },
        { type: "p", text: "An **Auto Scaling group** (ASG) keeps a number of EC2 instances running, between a minimum and a maximum, launched from a launch template. When it is attached to a target group, the ASG registers new instances automatically. A **target tracking** policy is the simplest way to scale: you state a goal, such as average CPU of 50 percent, and AWS adds or removes instances to stay near it." },
        {
          type: "code",
          language: "bash",
          code: `aws autoscaling update-auto-scaling-group \\
  --auto-scaling-group-name myapp-asg \\
  --min-size 2 --max-size 6 --desired-capacity 2

aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name myapp-asg \\
  --policy-name cpu-50 \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {"PredefinedMetricType": "ASGAverageCPUUtilization"},
    "TargetValue": 50.0
  }'`,
        },
        { type: "p", text: "Containers scale the same way: an ECS service has its own auto scaling that changes the task count, and the ALB target group is how new tasks start receiving traffic." },
        { type: "callout", tone: "gotcha", title: "Health checks decide everything", text: "If `/health` returns 200 even when the database is down, the balancer keeps sending traffic to a broken app. If it checks too much, one slow dependency makes every target look unhealthy and the ALB serves 503s. Make it cheap, and make it reflect whether this process can serve requests. Also give new instances a health check grace period long enough to boot, or the ASG will kill them in a loop." },
        { type: "callout", tone: "tip", title: "Keep servers stateless", text: "Autoscaling only works if any instance can serve any request. Put sessions in Redis or a signed cookie, uploads in S3, and data in a database, never on the instance's disk." },
      ],
      references: [
        { title: "What is an Application Load Balancer?", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" },
        { title: "What is a Network Load Balancer?", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html" },
        { title: "Health checks for Application Load Balancer target groups", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" },
        { title: "What is Amazon EC2 Auto Scaling?", url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html" },
      ],
    },
  },
};
