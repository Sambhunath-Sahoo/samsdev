import type { RoadmapSubsection } from "@/types/roadmap";

export const DOCKERFILE_AND_BUILD_CACHE: RoadmapSubsection = {
  title: "Dockerfile and build cache",
  slug: "dockerfile-and-build-cache",
  lesson: {
    summary: "Write a small, fast-to-rebuild image for a Python API and a Next.js app, and avoid the four mistakes that cost an evening each.",
    minutes: 12,
    blocks: [
      { type: "h2", text: "What a Dockerfile does" },
      { type: "p", text: "A Dockerfile is a recipe. Each instruction (`FROM`, `COPY`, `RUN`) adds a **layer**, and Docker stores every layer. When you rebuild, Docker reuses each layer from the top until it meets one whose inputs changed, then rebuilds that layer and everything below it. That is the build cache." },
      { type: "p", text: "So the order of lines is a speed decision. Put things that change rarely (dependencies) above things that change often (your source code)." },
      { type: "h2", text: "A multi-stage Dockerfile for a Python API" },
      { type: "p", text: "Stage one installs dependencies with uv from the lockfile. Stage two starts from a clean base image and copies in only the finished virtual environment and the app. The build tools never reach the final image." },
      {
        type: "code",
        language: "dockerfile",
        title: "api/Dockerfile",
        code: `# ---------- Stage 1: build the virtualenv ----------
FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:0.8.22 /uv /usr/local/bin/uv
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Dependencies first: this layer only rebuilds when the lockfile changes
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \\
    uv sync --frozen --no-dev --no-install-project

# ---------- Stage 2: small runtime image ----------
FROM python:3.13-slim
RUN useradd --create-home --uid 1000 appuser
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY app ./app

ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1
USER appuser
EXPOSE 8000
# 0.0.0.0 so the port is reachable from outside the container
CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]`,
      },
      { type: "h2", text: "Keep secrets out with .dockerignore" },
      { type: "p", text: "`COPY app ./app` only copies what you name, but a broad `COPY . .` copies everything in the folder, including your `.env`. A `.dockerignore` file is the safety net. It also keeps the build context small, which makes builds start faster." },
      {
        type: "code",
        language: "text",
        title: ".dockerignore",
        code: `.env
.env.*
.venv
.git
__pycache__
*.py[oc]
.ruff_cache`,
      },
      { type: "h2", text: "Build and check it" },
      {
        type: "code",
        language: "bash",
        code: `docker build -t myapp-api .
docker run --rm -p 8000:8000 --env-file .env myapp-api
curl localhost:8000/health        # expect HTTP 200
docker run --rm myapp-api whoami  # expect appuser, not root
docker images myapp-api           # check the size`,
      },
      { type: "callout", tone: "tip", title: "Size is not the whole story", text: "The local image was 388 MB, but it is stored in the registry at about 83 MB because layers are compressed. Judge size with `docker images` for local disk and with the registry for what you pay for." },
      { type: "h2", text: "One Dockerfile for several Next.js apps" },
      { type: "p", text: "In a monorepo with three Next.js apps that build the same way, one Dockerfile with a build argument beats three copies that drift apart. Each build still produces its own image." },
      {
        type: "code",
        language: "dockerfile",
        title: "web/Dockerfile (trimmed)",
        code: `FROM node:22-slim AS deps
RUN corepack enable
WORKDIR /repo
# package.json pins the pnpm version; pnpm fetch needs only the lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

FROM deps AS builder
ARG APP
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter \${APP} build

FROM node:22-slim AS runner
ARG APP
ARG PORT=3000
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=\${PORT} APP=\${APP}
WORKDIR /repo
COPY --from=builder --chown=node /repo/apps/\${APP}/.next/standalone ./
COPY --from=builder --chown=node /repo/apps/\${APP}/.next/static ./apps/\${APP}/.next/static
USER node
CMD exec node apps/\${APP}/server.js`,
      },
      {
        type: "code",
        language: "bash",
        code: `docker build --build-arg APP=shop --build-arg PORT=3002 \\
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \\
  -t myapp-shop .`,
      },
      { type: "h2", text: "Four mistakes worth remembering" },
      { type: "callout", tone: "gotcha", title: "NEXT_PUBLIC values are baked in", text: "Next.js copies `NEXT_PUBLIC_*` values into the browser bundle during `next build`. Setting them on `docker run` does nothing. Pass them as `--build-arg`, and expect to rebuild when the API address changes." },
      { type: "callout", tone: "gotcha", title: "useradd: UID 1000 is not unique", text: "The official `node` image already ships an unprivileged user called `node` with uid 1000. Use `USER node` instead of creating your own." },
      { type: "callout", tone: "gotcha", title: "pnpm fetch fails on build scripts", text: "If `package.json` is not copied before `pnpm fetch`, Corepack installs the newest pnpm, which blocks dependency build scripts. Copying `package.json` first pins the version from `packageManager`." },
      { type: "callout", tone: "gotcha", title: "Monorepo output must be traced from the root", text: "Set `output: \"standalone\"` and `outputFileTracingRoot` to the repo root in `next.config`, or the shared workspace packages are missing from the standalone bundle." },
    ],
  },
  points: [
    {
      id: "devops.containers.dockerfile.layer-order",
      title: "Put rarely-changing steps first",
      detail: "Docker reuses layers from the top until one changes. Copy the lockfile and install dependencies before copying source code, and a code edit rebuilds only the last layers.",
      question: "You edit one Python file. Which layers rebuild if `COPY . .` comes before `uv sync`? And if it comes after?",
    },
    {
      id: "devops.containers.dockerfile.multi-stage",
      title: "Multi-stage builds",
      detail: "Build tools and caches stay in a builder stage. The final stage copies only the output, so the shipped image is smaller and has less to attack.",
      question: "What is copied from the builder stage in the API Dockerfile, and what is left behind?",
    },
    {
      id: "devops.containers.dockerfile.non-root-and-ignore",
      title: "Run as non-root and use .dockerignore",
      detail: "A non-root `USER` limits what a compromised process can do. `.dockerignore` keeps `.env` files and `.git` out of the build context so they cannot end up in a layer.",
      question: "How do you prove the container is not running as root, and that no `.env` file is inside the image?",
    },
    {
      id: "devops.containers.dockerfile.build-time-vs-run-time",
      title: "Build-time values vs run-time values",
      detail: "`ARG` and `ENV` set during a build are fixed into the image, and Next.js inlines `NEXT_PUBLIC_*` into the bundle. Secrets must arrive at run time, never at build time.",
      question: "The API address changes. Why must a Next.js image be rebuilt, but the API image only restarted?",
    },
  ],
};
