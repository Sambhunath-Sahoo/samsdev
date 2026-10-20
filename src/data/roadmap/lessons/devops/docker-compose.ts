import type { RoadmapSubsection } from "@/types/roadmap";

export const DOCKER_COMPOSE: RoadmapSubsection = {
  title: "Docker Compose",
  slug: "docker-compose",
  lesson: {
    summary: "Describe a four-container stack in one file, start it with one command, and keep that file in its own repository.",
    minutes: 9,
    blocks: [
      { type: "h2", text: "What Compose adds" },
      { type: "p", text: "Running four `docker run` commands by hand means four sets of flags to remember. A Compose file lists the services once: which image or Dockerfile, which ports, which environment, which service must be healthy before another starts. `docker compose up` then builds, networks and starts everything." },
      { type: "p", text: "Compose also creates a network for the stack and gives every service a DNS name equal to its service name, which is the same idea as the user-defined network from the previous lesson." },
      { type: "h2", text: "A compose file for one API and two web apps" },
      {
        type: "code",
        language: "yaml",
        title: "docker-compose.yml",
        code: `name: myapp

x-web-build: &web-build
  context: ../myapp-web
  args: &web-args
    NEXT_PUBLIC_API_URL: http://localhost:8000
    NEXT_PUBLIC_PUBLISHABLE_KEY: \${NEXT_PUBLIC_PUBLISHABLE_KEY:?set in .env}

services:
  api:
    build: ../myapp-api
    image: myapp-api
    env_file: ../myapp-api/.env          # real secrets, read at run time
    ports: ["8000:8000"]
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request as u; u.urlopen('http://localhost:8000/health')"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    restart: unless-stopped

  shop:
    build:
      <<: *web-build
      args: { <<: *web-args, APP: shop, PORT: "3002" }
    image: myapp-shop
    ports: ["3002:3002"]
    depends_on:
      api: { condition: service_healthy }
    restart: unless-stopped

  admin:
    build:
      <<: *web-build
      args: { <<: *web-args, APP: admin, PORT: "3000" }
    image: myapp-admin
    ports: ["3000:3000"]
    depends_on:
      api: { condition: service_healthy }
    restart: unless-stopped`,
      },
      { type: "h2", text: "Everyday commands" },
      {
        type: "code",
        language: "bash",
        code: `docker compose config -q          # validate the file, print nothing if fine
docker compose up -d --build      # build and start in the background
docker compose ps                 # state and health of each service
docker compose logs -f api        # follow one service's logs
docker compose down               # stop and remove the containers`,
      },
      { type: "h2", text: "Where the file lives" },
      { type: "p", text: "A compose file that builds several repositories does not belong inside any one of them. Put it in a small repository of its own (here, `myapp-infra`) next to the others, and refer to them with relative paths such as `../myapp-api`. That repository later also holds Terraform and deploy workflows, so make it private." },
      {
        type: "table",
        head: ["Folder", "Contains"],
        rows: [["`myapp-api/`", "FastAPI backend and its Dockerfile"], ["`myapp-web/`", "Next.js apps and the shared Dockerfile"], ["`myapp-infra/`", "`docker-compose.yml`, `.env.example`, later Terraform"]],
      },
      { type: "callout", tone: "gotcha", title: "Two env files, two jobs", text: "Compose reads the `.env` next to the compose file to fill `${VARIABLES}` in the YAML, such as build arguments. `env_file:` is different: it hands variables to the running container. Do not mix them up, and commit only a `.env.example` with the names but no values." },
      { type: "callout", tone: "tip", title: "Check each app from the browser", text: "A green `docker compose ps` is not proof. Open each app and sign in. A bad API address baked into a web image only shows up there." },
    ],
  },
  points: [
    {
      id: "devops.containers.compose.single-file",
      title: "One file describes the whole stack",
      detail: "Services, ports, environment, health checks and start order live in one YAML file, so anyone can start the same stack with one command.",
      question: "What does `docker compose up -d --build` do that four separate `docker run` commands do not?",
    },
    {
      id: "devops.containers.compose.healthcheck-order",
      title: "Health checks and depends_on",
      detail: "`depends_on` with `condition: service_healthy` makes a service wait until its dependency passes its health check, not just until the container has started.",
      question: "Why wait for the API to be healthy before starting the web apps?",
    },
    {
      id: "devops.containers.compose.two-env-files",
      title: "env_file vs the .env next to the compose file",
      detail: "The `.env` beside the compose file fills `${VAR}` placeholders in the YAML. `env_file:` injects variables into a running container.",
      question: "Where do build arguments come from, and where do the API's database credentials come from?",
    },
    {
      id: "devops.containers.compose.own-repo",
      title: "Keep compose in its own repository",
      detail: "A file that builds several repos belongs in a separate infra repository using relative paths, which can stay private and later grows Terraform and workflows.",
      question: "Why is the compose file not placed inside the API repository?",
    },
  ],
};
