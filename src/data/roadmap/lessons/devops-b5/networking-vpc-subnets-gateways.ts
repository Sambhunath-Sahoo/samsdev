import type { LessonEntry } from "@/types/roadmap";

export const NETWORKING_VPC_SUBNETS_GATEWAYS: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Networking: VPC, subnets, gateways",
    slug: "networking-vpc-subnets-gateways",
    lesson: {
      summary: "Lay out a VPC with public and private subnets, decide who can reach what, and know what a NAT gateway costs.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "A VPC is your own address space" },
        { type: "p", text: "A **VPC** is a private network inside one AWS region. You pick its address range (a CIDR block such as `10.0.0.0/16`) and carve it into **subnets**, each living in exactly one availability zone. Everything you launch, from EC2 to RDS to Fargate tasks, gets a network interface in some subnet." },
        { type: "p", text: "Pick ranges that will not overlap with your office network, other VPCs or anything you may peer with later. Changing a CIDR plan after databases exist is painful, so spend five minutes here." },
        { type: "h2", text: "Public versus private is just a route table" },
        { type: "p", text: "Nothing about a subnet is inherently public. A subnet is public when its **route table** sends `0.0.0.0/0` to an **internet gateway** (IGW), and the instance has a public IP. A private subnet has no such route. If it needs outbound internet access (package updates, calling a third-party API), its default route points at a **NAT gateway** that sits in a public subnet." },
        {
          type: "table",
          head: ["Piece", "Job", "Typical home"],
          rows: [
            ["Internet gateway", "Two-way door between the VPC and the internet", "Attached to the VPC, free"],
            ["NAT gateway", "Outbound-only internet for private subnets", "One per AZ, in a public subnet"],
            ["Application Load Balancer", "Takes public traffic and forwards it inward", "Public subnets"],
            ["App servers, containers", "Run your code", "Private subnets"],
            ["RDS", "Database", "Private subnets, no public access"],
          ],
        },
        {
          type: "code",
          language: "bash",
          title: "The skeleton, with the CLI",
          code: `VPC=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query Vpc.VpcId --output text)
PUB=$(aws ec2 create-subnet --vpc-id $VPC --cidr-block 10.0.1.0/24 \\
  --availability-zone ap-south-1a --query Subnet.SubnetId --output text)
PRIV=$(aws ec2 create-subnet --vpc-id $VPC --cidr-block 10.0.11.0/24 \\
  --availability-zone ap-south-1a --query Subnet.SubnetId --output text)
IGW=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW --vpc-id $VPC
RT=$(aws ec2 create-route-table --vpc-id $VPC --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW
aws ec2 associate-route-table --route-table-id $RT --subnet-id $PUB`,
        },
        { type: "h2", text: "Security group versus network ACL" },
        { type: "p", text: "A **security group** is attached to a network interface (an instance, a load balancer, a database). It has allow rules only and is **stateful**: if a request is allowed in, the reply is allowed out without another rule. A **network ACL** guards a whole subnet, has numbered allow and deny rules checked in order, and is **stateless**, so replies need their own rule, including the ephemeral port range." },
        { type: "p", text: "In practice, security groups do almost all the work. A good habit is to reference one security group from another: the database group allows port 5432 from the *app* group rather than from an IP range. Reach for a NACL only for something coarse, such as blocking a hostile address range for every instance in a subnet, because a security group cannot deny." },
        { type: "h2", text: "Peering, briefly" },
        { type: "p", text: "**VPC peering** joins two VPCs so they can talk over private addresses. It needs non-overlapping CIDRs, a route in each VPC's route table pointing at the peering connection, and security groups that allow the traffic. It is **not transitive**: if A peers with B and B with C, A still cannot reach C. When you have many VPCs, a transit gateway is the simpler tool." },
        { type: "callout", tone: "cost", title: "The NAT gateway bill", text: "A NAT gateway is charged per hour while it exists plus per GB it processes, and you normally want one per AZ. For a small project it can cost more than the servers behind it. Pulling container images through NAT adds up, so use VPC endpoints for S3 and ECR where you can, and delete NAT gateways when a lab is over." },
        { type: "callout", tone: "gotcha", title: "A route is not enough", text: "Peering and gateways fail silently when only one piece is missing. If traffic does not flow, check in order: the route table on both sides, the security group, the NACL, then the instance's own firewall." },
      ],
      references: [
        { title: "What is Amazon VPC? - Amazon Virtual Private Cloud", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
        { title: "Control traffic to your AWS resources using security groups", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" },
        { title: "Control subnet traffic with network access control lists", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" },
        { title: "NAT gateways - Amazon Virtual Private Cloud", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" },
        { title: "What is VPC peering?", url: "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html" },
      ],
    },
  },
};
