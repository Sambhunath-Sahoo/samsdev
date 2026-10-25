import type { RoadmapSubsection } from "@/types/roadmap";

export const REGISTRIES_AND_IMAGE_SCANNING: RoadmapSubsection = {
  title: "Registries and image scanning",
  slug: "registries-and-image-scanning",
  lesson: {
    summary: "Create a private registry in Amazon ECR, push an image to it, and fix the arm64 versus amd64 error that every Apple Silicon user hits.",
    minutes: 10,
    blocks: [
      { type: "h2", text: "What a registry is for" },
      { type: "p", text: "A registry stores images so other machines can pull them. Your laptop builds the image once and pushes it. A server pulls the exact same bytes. Amazon **ECR** is AWS's private registry, and a server with the right IAM role can pull from it without any password stored on it." },
      { type: "h2", text: "The name of an image" },
      { type: "code", language: "text", code: "111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1" },
      {
        type: "table",
        head: ["Part", "Meaning"],
        rows: [["`111122223333`", "AWS account id (sample value)"], ["`dkr.ecr`", "the service: Docker registry on ECR"], ["`ap-south-1`", "the region the repository lives in"], ["`myapp-api`", "the repository name"], ["`v1`", "the tag, which picks a version"]],
      },
      { type: "p", text: "Docker decides where to push by reading this name, so tagging an image with the full ECR address is how you aim a push." },
      { type: "h2", text: "Create the repository, log in, tag, push" },
      {
        type: "code",
        language: "bash",
        code: `# 1. Create a private repository with scanning on every push
aws ecr create-repository --repository-name myapp-api \\
  --image-scanning-configuration scanOnPush=true \\
  --region ap-south-1 --profile myapp

# 2. Give Docker a temporary ECR password (valid 12 hours)
aws ecr get-login-password --region ap-south-1 --profile myapp | \\
  docker login --username AWS --password-stdin \\
  111122223333.dkr.ecr.ap-south-1.amazonaws.com

# 3. Tag the local image with the registry name
docker tag myapp-api 111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1

# 4. Push
docker push 111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1

# 5. Check it arrived
aws ecr describe-images --repository-name myapp-api --region ap-south-1 --profile myapp`,
      },
      { type: "h2", text: "The architecture mismatch" },
      { type: "p", text: "Pulling the image on the server failed with `no matching manifest for linux/amd64`. An Apple Silicon Mac has an ARM chip, so Docker built an **arm64** image by default. A normal EC2 instance such as `t3` is **amd64**. The image was fine; it was built for the wrong chip." },
      {
        type: "code",
        language: "bash",
        title: "build for the server's architecture and push in one step",
        code: `docker buildx build --platform linux/amd64 --provenance=false \\
  -t 111122223333.dkr.ecr.ap-south-1.amazonaws.com/myapp-api:v1 --push .`,
      },
      { type: "callout", tone: "tip", title: "Why --provenance=false", text: "Newer builders attach extra metadata entries to a tag. They show up as untagged rows in ECR and can confuse older tools. Switching them off keeps one clean image per tag." },
      { type: "callout", tone: "gotcha", title: "Overwriting a tag", text: "Repositories created with the default setting allow a tag to move. Re-pushing `v1` replaced the old image, which is how the architecture fix worked. In a real project, make tags immutable and use a new tag per build." },
      { type: "callout", tone: "cost", title: "Storage is the only cost", text: "ECR charges for stored data, about $0.10 per GB per month. An image that is 83 MB compressed costs roughly one cent a month." },
      { type: "h2", text: "Image scanning" },
      { type: "p", text: "With `scanOnPush=true`, ECR checks each pushed image against a database of known vulnerabilities and lists findings by severity. Read the scan after a push, fix what is fixable (usually by updating the base image), and treat a critical finding in a package you actually use as a blocker." },
    ],
    references: [
      { title: "AWS docs: What is Amazon ECR?", url: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html" },
      { title: "Trivy documentation", url: "https://trivy.dev/docs/latest/" },
      { title: "Docker docs: Docker Hub", url: "https://docs.docker.com/docker-hub/" },
    ],
  },
  points: [
    {
      id: "devops.containers.registry.image-name",
      title: "Read an ECR image name",
      detail: "The name carries account id, region and repository, and the tag after the colon picks a version. Tagging with that full name is how Docker knows where to push.",
      question: "Which part of the name would change if you pushed the same image to a repository in another region?",
    },
    {
      id: "devops.containers.registry.login-flow",
      title: "The ECR login, tag and push flow",
      detail: "`get-login-password` produces a temporary token that Docker uses to log in. Then you tag the image with the registry name and push it. The token expires after 12 hours.",
      question: "Your push says `no basic auth credentials` the next morning. What did you forget to repeat?",
    },
    {
      id: "devops.containers.registry.architecture",
      title: "arm64 vs amd64",
      detail: "Images are built for one CPU architecture unless you ask otherwise. Build with `--platform linux/amd64` for typical cloud servers, or choose ARM instances (Graviton) and keep the arm64 image.",
      question: "What error does the wrong architecture give on pull, and what flag fixes it at build time?",
    },
    {
      id: "devops.containers.registry.scanning",
      title: "Scan on push and read the results",
      detail: "Scanning finds known vulnerabilities in the base image and packages. The usual fix is a newer base image, then a rebuild.",
      question: "Where do you look for scan results, and what do you do about a critical finding in a package your app does not use?",
    },
  ],
};
