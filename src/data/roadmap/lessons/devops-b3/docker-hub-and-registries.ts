import type { LessonEntry } from "@/types/roadmap";

export const DOCKER_HUB_AND_REGISTRIES: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Docker Hub and other registries: GHCR, Artifact Registry (GCR is retired)",
    slug: "docker-hub-and-registries",
    lesson: {
      summary: "Compare Docker Hub, GitHub Container Registry and Google Artifact Registry, and learn the naming and login pattern each one uses.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "One protocol, several hosts" },
        { type: "p", text: "A registry stores images and serves them over a standard HTTP API, so `docker push` and `docker pull` work the same against any of them. What differs is the hostname in the image name, how you log in, and what the service is attached to. Pick the one closest to where your code and your deployment already live." },
        { type: "table", head: ["Registry", "Image name", "Good fit"], rows: [["Docker Hub", "`user/app:1.0`", "Public images, official base images"], ["GHCR", "`ghcr.io/owner/app:1.0`", "Projects on GitHub, CI with `GITHUB_TOKEN`"], ["Artifact Registry", "`REGION-docker.pkg.dev/PROJECT/REPO/app:1.0`", "Deploying to Google Cloud"], ["Amazon ECR", "`ACCOUNT.dkr.ecr.REGION.amazonaws.com/app:1.0`", "Deploying to AWS"]] },
        { type: "h2", text: "Docker Hub" },
        { type: "p", text: "The default registry: a name with no hostname, such as `postgres:16`, means Docker Hub. It hosts the official base images. Anonymous pulls are subject to rate limits, so CI that pulls many images should log in or pull through a mirror." },
        { type: "h2", text: "GitHub Container Registry" },
        { type: "p", text: "GHCR is tied to GitHub accounts and organisations, and a package can be linked to its repository so permissions follow the repo. In a workflow, the built-in `GITHUB_TOKEN` can push, so no extra secret is needed as long as the job has `packages: write` permission." },
        {
          type: "code",
          language: "bash",
          code: `echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
docker build -t ghcr.io/sambhunath/samsdev:1.0 .
docker push ghcr.io/sambhunath/samsdev:1.0`,
        },
        { type: "h2", text: "Artifact Registry, and the end of GCR" },
        { type: "p", text: "Google Container Registry (`gcr.io`) has been shut down and replaced by **Artifact Registry**. Existing `gcr.io` names were meant to be moved, and Google documents a transition path. Artifact Registry also stores other package types (npm, Maven, Python), has regional repositories, and uses IAM roles for access. You create a repository first, then push to it." },
        {
          type: "code",
          language: "bash",
          code: `gcloud artifacts repositories create web --repository-format=docker --location=asia-south1
gcloud auth configure-docker asia-south1-docker.pkg.dev
docker push asia-south1-docker.pkg.dev/my-project/web/app:1.0`,
        },
        { type: "callout", tone: "gotcha", title: "Do not pull latest in production", text: "Tags are movable labels. Someone can push a different image under `1.0` or `latest`. For deploys, pin by digest (`app@sha256:...`) or use a unique tag such as the commit SHA, and keep the registry clean with a retention rule so old images do not cost storage forever." },
        { type: "p", text: "Common mistakes: forgetting the hostname prefix so a push goes to Docker Hub instead of your private registry, logging in with a personal password rather than a scoped token, and leaving a private image public by default on first push." },
      ],
      references: [
        { title: "Docker Hub documentation", url: "https://docs.docker.com/docker-hub/" },
        { title: "Working with the Container registry (GitHub Docs)", url: "https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" },
        { title: "Artifact Registry documentation", url: "https://cloud.google.com/artifact-registry/docs" },
        { title: "Transition from Container Registry (Artifact Registry docs)", url: "https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr" },
      ],
    },
    points: [
      { id: "devops.docker-hub-and-registries.image-name", title: "The hostname is part of the name", detail: "A name without a host goes to Docker Hub. `ghcr.io/...` or `REGION-docker.pkg.dev/...` sends the image to that registry instead.", question: "Where does `docker push myteam/app:1.0` go if you have not tagged a registry host?" },
      { id: "devops.docker-hub-and-registries.gcr-retired", title: "GCR is retired", detail: "Google Container Registry has been replaced by Artifact Registry, which uses regional repositories and IAM. New work should start there.", question: "What do you create in Artifact Registry before the first push?" },
      { id: "devops.docker-hub-and-registries.pin-digest", title: "Pin deploys by digest or unique tag", detail: "Tags can be overwritten. A digest or a commit-SHA tag makes sure production runs exactly the image you tested.", question: "Why is `latest` a poor tag for a production deploy?" },
    ],
  },
};
