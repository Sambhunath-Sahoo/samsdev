import type { LessonEntry } from "@/types/roadmap";

export const PRACTICE_TERRAFORM_EC2_VPC_ANSIBLE: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "Practice: Terraform an EC2 instance and VPC with remote state in S3, then configure it with Ansible",
    slug: "practice-terraform-ec2-vpc-ansible",
    lesson: {
      summary: "Build a small VPC and EC2 instance with Terraform, keep its state in S3, then install nginx on it with Ansible.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "What you will build" },
        { type: "p", text: "A bucket for Terraform state, a VPC with one public subnet, a security group, and one `t3.micro` instance. Then an Ansible playbook installs nginx on it. Use your own AWS account, a region you chose, and the SSO profile from the IAM lesson." },
        { type: "h2", text: "Step 1: the state bucket (by hand, once)" },
        {
          type: "code",
          language: "bash",
          code: `export AWS_PROFILE=myapp
B=myapp-tfstate-111122223333
aws s3api create-bucket --bucket $B --region ap-south-1 \\
  --create-bucket-configuration LocationConstraint=ap-south-1
aws s3api put-bucket-versioning --bucket $B --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket $B --public-access-block-configuration \\
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true`,
        },
        { type: "h2", text: "Step 2: Terraform for the network and instance" },
        {
          type: "code",
          language: "hcl",
          title: "main.tf",
          code: `terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket       = "myapp-tfstate-111122223333"
    key          = "practice/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" { region = "ap-south-1" }

variable "my_ip_cidr" { type = string } # e.g. 203.0.113.7/32
variable "key_name"   { type = string } # an existing EC2 key pair

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "gw" { vpc_id = aws_vpc.main.id }

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "web" {
  vpc_id = aws_vpc.main.id
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ssm_parameter" "ubuntu" {
  name = "/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id"
}

resource "aws_instance" "web" {
  ami                    = data.aws_ssm_parameter.ubuntu.value
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name
  tags                   = { Name = "myapp-web" }
}

output "instance_ip" { value = aws_instance.web.public_ip }`,
        },
        {
          type: "code",
          language: "bash",
          code: `terraform init
terraform plan -var="my_ip_cidr=$(curl -s https://checkip.amazonaws.com)/32" -var="key_name=myapp"
terraform apply -var="my_ip_cidr=$(curl -s https://checkip.amazonaws.com)/32" -var="key_name=myapp"`,
        },
        { type: "p", text: "After `init`, check that `practice/terraform.tfstate` appears in the bucket after the apply. Read the plan first: you should see seven or eight resources to add and nothing to destroy." },
        { type: "h2", text: "Step 3: Ansible configures it" },
        {
          type: "code",
          language: "yaml",
          title: "web.yml",
          code: `- name: Install nginx
  hosts: all
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true
    - name: Replace the default page
      ansible.builtin.copy:
        content: "Hello from Ansible\\n"
        dest: /var/www/html/index.html
    - name: Start nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true`,
        },
        {
          type: "code",
          language: "bash",
          code: `IP=$(terraform output -raw instance_ip)
ansible-playbook -i "$IP," -u ubuntu --private-key ~/.ssh/myapp.pem web.yml
ansible-playbook -i "$IP," -u ubuntu --private-key ~/.ssh/myapp.pem web.yml  # second run: changed=0
curl http://$IP`,
        },
        { type: "p", text: "The second run reporting `changed=0` shows the playbook is idempotent. If SSH times out right after apply, wait a minute for the instance to boot." },
        { type: "callout", tone: "cost", title: "Clean up", text: "Run `terraform destroy` with the same `-var` flags when you finish. A `t3.micro` and a public IPv4 address both bill by the hour, and the state bucket costs almost nothing but should be emptied and deleted last if you are done." },
        { type: "callout", tone: "gotcha", title: "The default egress rule is not automatic", text: "A security group created by Terraform has no outbound rule, unlike one made in the console. Without the `egress` block above, `apt` on the instance cannot reach the internet and the playbook hangs." },
      ],
      references: [
        { title: "S3 backend (Terraform documentation)", url: "https://developer.hashicorp.com/terraform/language/backend/s3" },
        { title: "aws_instance resource (Terraform AWS provider)", url: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance" },
        { title: "Ansible playbooks (Ansible documentation)", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html" },
      ],
    },
    points: [
      {
        id: "devops.practice-terraform-ec2-vpc-ansible.remote-state-bucket",
        title: "Create the state bucket first",
        detail: "The S3 bucket that stores state is created by hand with versioning and public access blocked. Terraform cannot create the bucket its own state depends on.",
        question: "Why is versioning on the state bucket worth turning on?",
      },
      {
        id: "devops.practice-terraform-ec2-vpc-ansible.vpc-and-instance",
        title: "Terraform the VPC, subnet, security group and instance",
        detail: "A VPC needs an internet gateway, a route to it and a subnet association before an instance can be reached. Resources reference each other so Terraform orders them correctly.",
        question: "Which resource gives the public subnet a route to the internet?",
      },
      {
        id: "devops.practice-terraform-ec2-vpc-ansible.ansible-configure",
        title: "Configure the instance with Ansible and re-run it",
        detail: "Feed the Terraform output into Ansible, install nginx and run the playbook twice. The second run should report no changes.",
        question: "What does changed=0 on the second run tell you about the playbook?",
      },
      {
        id: "devops.practice-terraform-ec2-vpc-ansible.destroy-and-cost",
        title: "Destroy it and check the bill",
        detail: "Run terraform destroy when you finish and confirm in the console that nothing remains. Running instances and public IPs cost money while you sleep.",
        question: "What would you check in the console to be sure everything was removed?",
      },
    ],
  },
};
