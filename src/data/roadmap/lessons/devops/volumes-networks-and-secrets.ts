import type { RoadmapSubsection } from "@/types/roadmap";

export const VOLUMES_NETWORKS_AND_SECRETS: RoadmapSubsection = {
  title: "Volumes, networks and secrets",
  slug: "volumes-networks-and-secrets",
  lesson: {
    summary: "How containers find each other, keep data between restarts, and receive secrets without baking them into an image.",
    minutes: 8,
    blocks: [
      { type: "h2", text: "Networks: containers find each other by name" },
      { type: "p", text: "On Docker's default network, containers can reach each other only by IP address, and the IP changes. On a **user-defined network**, Docker runs a small DNS server, so one container can call another by its name. That is how a reverse proxy reaches `api:8000` with no IP written anywhere." },
      {
        type: "code",
        language: "bash",
        code: `docker network create myapp

docker run -d --name api --network myapp --restart unless-stopped \\
  --env-file ~/api.env myapp-api:v1

# Another container on the same network can now call http://api:8000`,
      },
      { type: "h2", text: "Published ports decide who can reach a container" },
      { type: "p", text: "`-p 8000:8000` opens the port on every interface of the host. `-p 127.0.0.1:8000:8000` opens it only for programs on the same machine. Leaving `-p` out means only containers on the same Docker network can connect. For an API that sits behind a proxy, the third option is the safest." },
      { type: "table", head: ["Flag", "Who can connect"], rows: [["`-p 8000:8000`", "Anyone who can reach the host, if the firewall allows it"], ["`-p 127.0.0.1:8000:8000`", "Only processes on the host itself"], ["no `-p`, same network", "Only containers on that Docker network"]] },
      { type: "h2", text: "Volumes: data that survives the container" },
      { type: "p", text: "A container's own filesystem disappears with it. A **named volume** is storage Docker manages outside the container. A reverse proxy needs one so it keeps its TLS certificates across restarts, instead of asking for new ones each time." },
      {
        type: "code",
        language: "bash",
        code: `docker run -d --name caddy --network myapp \\
  -v caddy_data:/data \\
  -v ~/caddy/Caddyfile:/etc/caddy/Caddyfile \\
  caddy:2

docker volume ls          # caddy_data is listed
docker volume inspect caddy_data`,
      },
      { type: "h2", text: "Secrets: provide them at run time" },
      { type: "p", text: "An image is copied to registries and other machines, so anything inside it is exposed with it. Database passwords and API keys belong in the environment of the running container instead." },
      {
        type: "list",
        items: [
          "Keep `.env` out of git and out of the image (`.dockerignore`).",
          "Pass values with `--env-file` or from a secret store when the container starts.",
          "On a server, restrict the file: `chmod 600 ~/api.env`.",
          "Public values (such as a publishable key) are fine in a build, but treat anything that bypasses access rules as secret.",
        ],
      },
      { type: "callout", tone: "tip", title: "Version 1 shortcut", text: "Copying the env file to the server with `scp` is fine for a first deploy. Later versions replace it with a parameter store, so no secret file sits on the machine." },
    ],
    references: [
      { title: "Docker docs: Volumes", url: "https://docs.docker.com/engine/storage/volumes/" },
      { title: "Docker docs: Networking", url: "https://docs.docker.com/engine/network/" },
      { title: "Docker docs: Build secrets", url: "https://docs.docker.com/build/building/secrets/" },
    ],
  },
  points: [
    {
      id: "devops.containers.volumes.network-dns",
      title: "User-defined networks give you DNS by name",
      detail: "Containers on a network you create can resolve each other's names. The default bridge network does not do this.",
      question: "Why does the proxy config say `api:8000` instead of an IP address?",
    },
    {
      id: "devops.containers.volumes.published-ports",
      title: "Published ports control exposure",
      detail: "Binding to `127.0.0.1` keeps a port private to the host. No `-p` keeps it inside the Docker network.",
      question: "You want only the proxy to reach the API. Which `docker run` flags do you use for each container?",
    },
    {
      id: "devops.containers.volumes.named-volumes",
      title: "Named volumes persist data",
      detail: "Data written to a named volume stays after the container is removed. Anything else in the container filesystem is lost.",
      question: "What is lost if the proxy container is removed and recreated without `-v caddy_data:/data`?",
    },
    {
      id: "devops.containers.volumes.runtime-secrets",
      title: "Secrets arrive at run time",
      detail: "Secrets passed with `--env-file` are not stored in the image layers. Anything copied or baked during the build is.",
      question: "Name two places a secret must never appear, and one way to deliver it instead.",
    },
  ],
};
