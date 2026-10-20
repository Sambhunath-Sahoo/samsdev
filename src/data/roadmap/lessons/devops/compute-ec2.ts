import type { RoadmapSubsection } from "@/types/roadmap";

export const COMPUTE_EC2: RoadmapSubsection = {
  title: "Compute: EC2, ECS Fargate",
  slug: "compute-ec2",
  lesson: {
    summary: "Launch one EC2 server, open only the ports you need, pull your image from ECR and run it. The whole path, step by step, with the diagram.",
    minutes: 15,
    blocks: [
      { type: "h2", text: "What we built" },
      { type: "p", text: "One small EC2 instance runs two containers: **Caddy** (public, HTTPS) and the **API** (private). The API image comes from ECR, the database lives outside AWS, and a visitor reaches everything through one HTTPS address." },
      {
        type: "figure",
        src: "/roadmap/aws-v1-deploy.gif",
        alt: "Animated diagram: a laptop signs in with SSO and pushes an image to ECR, an EC2 instance in a VPC pulls it and runs Caddy and an API container, and a visitor reaches it over HTTPS while the API queries a hosted Postgres database.",
        caption: "The deploy path, step by step. Sample values only.",
        width: 1200,
        height: 720,
      },
      { type: "h2", text: "Step 1: a key pair for SSH" },
      {
        type: "code",
        language: "bash",
        code: `# In the console: EC2 > Key pairs > Create key pair (ED25519, .pem)
mv ~/Downloads/my-key.pem ~/.ssh/ && chmod 400 ~/.ssh/my-key.pem`,
      },
      { type: "p", text: "SSH refuses a private key that other users can read, hence `chmod 400`. Never share or commit this file." },
      { type: "h2", text: "Step 2: launch the instance" },
      {
        type: "table",
        head: ["Setting", "Value", "Why"],
        rows: [
          ["Name", "`myapp-v1`", "easy to find"],
          ["AMI", "Amazon Linux 2023", "has the AWS CLI and `dnf`"],
          ["Type", "`t3.micro`", "2 vCPU, 1 GB RAM: enough for one API. Use `t3.small` for several apps."],
          ["Key pair", "`my-key`", "SSH login"],
          ["Security group", "22 from **My IP**, 80 and 443 from anywhere", "firewall, see below"],
          ["Storage", "20 GiB gp3", "room for images"],
          ["IAM instance profile", "`myapp-ec2-ecr-read`", "lets the server pull from ECR"],
        ],
      },
      { type: "callout", tone: "gotcha", title: "SSH from My IP only", text: "Port 22 open to the whole internet gets scanned within minutes. Choose **My IP** so the rule reads like `198.51.100.7/32`. If your home IP changes later, SSH will time out until you update that rule." },
      { type: "h2", text: "Step 3: install Docker and pull the image" },
      {
        type: "code",
        language: "bash",
        title: "on the server (ssh -i ~/.ssh/my-key.pem ec2-user@203.0.113.25)",
        code: `sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
exit            # log in again so the group change applies

aws ecr get-login-password --region ap-south-1 | \\
  docker login --username AWS --password-stdin \\
  111122223333.dkr.ecr.ap-south-1.amazonaws.com
docker pull 111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1`,
      },
      { type: "callout", tone: "gotcha", title: "no matching manifest for linux/amd64", text: "The image was built on an ARM laptop. Rebuild with `docker buildx build --platform linux/amd64 ... --push` and pull again." },
      { type: "h2", text: "Step 4: secrets and run" },
      { type: "p", text: "Copy the env file from your **laptop** (not from the server, where the file does not exist) and run the container." },
      {
        type: "code",
        language: "bash",
        code: `# on your laptop
scp -i ~/.ssh/my-key.pem ./api/.env ec2-user@203.0.113.25:~/api.env

# on the server
chmod 600 ~/api.env
docker run -d --name api --restart unless-stopped \\
  -p 127.0.0.1:8000:8000 --env-file ~/api.env \\
  111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1
curl localhost:8000/health`,
      },
      { type: "p", text: "A healthy answer looks like `{\"status\":\"ok\",\"database\":\"reachable\",\"schema\":\"prepared\"}`. The reverse-proxy lesson puts Caddy in front of this." },
      { type: "callout", tone: "gotcha", title: "Which machine am I typing on?", text: "The prompt tells you. `ec2-user@ip-172-31-…` is the server. Anything with your own username is your laptop. `scp` copies from the machine where you run it." },
      { type: "h2", text: "Public IP and Elastic IP" },
      { type: "p", text: "The automatic public IP changes whenever you stop and start the instance. An **Elastic IP** is a fixed address you keep, but it is billed while allocated, even if nothing uses it. For a server you terminate after each session, skip it." },
      { type: "h2", text: "Where ECS Fargate fits" },
      { type: "p", text: "Fargate runs containers without a server for you to patch or SSH into. EC2 first is deliberate: doing it by hand shows what Fargate, and later Kubernetes, automate for you." },
    ],
  },
  points: [
    {
      id: "devops.cloud.ec2.launch-settings",
      title: "The launch settings that matter",
      detail: "AMI, instance type, key pair, security group, storage and instance profile. The type sets CPU and RAM and therefore cost.",
      question: "Which launch setting lets the server pull from ECR, and which lets you SSH in?",
    },
    {
      id: "devops.cloud.ec2.security-group",
      title: "A security group is a firewall in front of the instance",
      detail: "It lists allowed inbound ports and sources. Everything else is blocked. Restrict SSH to your own IP and open only 80 and 443 to the world.",
      question: "Why is `0.0.0.0/0` acceptable on port 443 but not on port 22?",
    },
    {
      id: "devops.cloud.ec2.ssh-key",
      title: "SSH key pairs",
      detail: "The private key stays with you with permissions `400`. The instance holds the public half. Lose the private key and you cannot log in.",
      question: "What error do you get if the `.pem` file is readable by others, and how do you fix it?",
    },
    {
      id: "devops.cloud.ec2.which-machine",
      title: "Know which machine you are on",
      detail: "Commands like `docker pull` run on the server, while `scp` from your laptop runs on the laptop. The shell prompt tells you which one you are in.",
      question: "You ran `scp` on the server and it said `No such file`. Why?",
    },
    {
      id: "devops.cloud.ec2.public-ip-behaviour",
      title: "Public IPs change unless you reserve one",
      detail: "Stopping and starting an instance releases its automatic public IP. An Elastic IP is stable but billed while allocated.",
      question: "What else breaks when the IP changes, if your hostname is built from the IP?",
    },
  ],
};
