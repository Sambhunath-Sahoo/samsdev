import type { LessonEntry } from "@/types/roadmap";

export const SPRING_BOOT_POSTGRES_COMPOSE_PRACTICE: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Practice: Spring Boot and PostgreSQL with Compose, image size minimised",
    slug: "spring-boot-postgres-compose-practice",
    lesson: {
      summary: "Containerise a Spring Boot API with a multi-stage build, run it next to PostgreSQL with Compose, and check what you saved in image size.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "The goal" },
        { type: "p", text: "You have a Spring Boot service built with Maven that talks to PostgreSQL. By the end, `docker compose up` starts both, the API waits until the database is ready, the database data survives a restart, and the API image contains only a JRE and your jar. This pulls together the Dockerfile, network, volume and Compose lessons." },
        { type: "h2", text: "A multi-stage Dockerfile" },
        { type: "p", text: "Maven and the JDK are needed to build, not to run. Build in one stage and copy only the jar into a small runtime stage. Copying `pom.xml` first lets Docker cache the dependency download until the pom changes." },
        {
          type: "code",
          language: "dockerfile",
          title: "Dockerfile",
          code: `FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]`,
        },
        { type: "p", text: "Add a `.dockerignore` with `target/`, `.git` and `.env`. Without it, a local build output is sent to the daemon on every build." },
        { type: "h2", text: "The compose file" },
        {
          type: "code",
          language: "yaml",
          title: "docker-compose.yml",
          code: `services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${DB_PASSWORD:?set in .env}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: .
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app
      SPRING_DATASOURCE_USERNAME: app
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}
    ports: ["8080:8080"]
    depends_on:
      db: { condition: service_healthy }

volumes:
  pgdata:`,
        },
        { type: "p", text: "The database has no `ports:` entry, so it is reachable only from the API over the Compose network, by the hostname `db`. Put `DB_PASSWORD` in an uncommitted `.env` file next to the compose file." },
        { type: "h2", text: "Check the size" },
        {
          type: "code",
          language: "bash",
          code: `docker compose up -d --build
docker images                       # compare the API image with a JDK-based one
docker history <api-image>          # which layer is large
docker compose down && docker compose up -d   # data should still be there`,
        },
        { type: "p", text: "A JRE on Alpine is usually a few hundred MB smaller than a full JDK image with Maven inside it. Further steps: a layered jar (see the Spring Boot guide on efficient images) so a code-only change rebuilds one small layer, or a `jlink` runtime trimmed to the modules you use." },
        { type: "callout", tone: "gotcha", title: "Started is not ready", text: "Postgres accepts connections several seconds after the container starts. Plain `depends_on` only waits for the container to exist, so the API crashes on its first connect. The healthcheck plus `condition: service_healthy` is what fixes this. Alpine uses musl instead of glibc, so if you hit a native-library problem, switch to the non-Alpine JRE tag." },
        { type: "p", text: "Common mistakes: running as root, copying the whole repository before the dependency step so the cache never hits, and hardcoding the database password in the compose file." },
      ],
      references: [
        { title: "Efficient container images (Spring Boot reference)", url: "https://docs.spring.io/spring-boot/reference/packaging/container-images/efficient-images.html" },
        { title: "Control startup and shutdown order in Compose", url: "https://docs.docker.com/compose/how-tos/startup-order/" },
        { title: "Containerize a Java application (Docker guides)", url: "https://docs.docker.com/guides/java/" },
        { title: "postgres - Official Image (Docker Hub)", url: "https://hub.docker.com/_/postgres" },
      ],
    },
    points: [
      { id: "devops.spring-boot-postgres-compose-practice.multi-stage", title: "Build in one stage, run in another", detail: "The JDK and Maven stay in the build stage. The runtime stage copies only the jar onto a JRE image, which is smaller and has fewer packages to patch.", question: "Which tools exist in the build stage but should not ship in the final image?" },
      { id: "devops.spring-boot-postgres-compose-practice.healthcheck-order", title: "Wait for the database to be healthy", detail: "A `pg_isready` healthcheck with `condition: service_healthy` stops the API starting before Postgres accepts connections.", question: "Why is plain depends_on not enough for a database?" },
      { id: "devops.spring-boot-postgres-compose-practice.volume-and-network", title: "Named volume, no published DB port", detail: "A named volume keeps the data across container replacement. Leaving out `ports:` on the database keeps it reachable only from the API.", question: "What happens to the data if you run docker compose down -v?" },
      { id: "devops.spring-boot-postgres-compose-practice.non-root", title: "Run as a non-root user", detail: "Create a user in the runtime stage and switch with `USER`, so a compromised app does not run as root inside the container.", question: "Which Dockerfile line switches the process to the unprivileged user?" },
    ],
  },
};
