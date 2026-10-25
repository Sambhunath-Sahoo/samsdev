import type { LessonEntry } from "@/types/roadmap";

export const DOCKERFILE_CMD_ENTRYPOINT_COPY_ADD: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Dockerfile instructions: CMD, ENTRYPOINT, COPY and ADD",
    slug: "dockerfile-cmd-entrypoint-copy-add",
    lesson: {
      summary: "CMD sets a default command that is easy to override, ENTRYPOINT fixes the executable, and COPY is almost always the right way to bring files in.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "CMD vs ENTRYPOINT" },
        { type: "p", text: "Both say what the container runs when it starts. **CMD** is a default: anything you type after the image name in `docker run` replaces it. **ENTRYPOINT** is the fixed executable: what you type after the image name is appended to it as arguments instead of replacing it." },
        { type: "p", text: "The usual pattern is both together. ENTRYPOINT names the program, CMD supplies default arguments that the user can swap." },
        {
          type: "code",
          language: "dockerfile",
          title: "Dockerfile",
          code: `FROM eclipse-temurin:21-jre
COPY app.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
CMD ["--spring.profiles.active=prod"]`,
        },
        {
          type: "code",
          language: "bash",
          code: `docker run myapp                                   # uses the CMD default
docker run myapp --spring.profiles.active=dev      # replaces CMD only
docker run --entrypoint sh -it myapp               # replaces the ENTRYPOINT`,
        },
        { type: "h2", text: "Exec form vs shell form" },
        { type: "p", text: "Write `[\"java\", \"-jar\", \"app.jar\"]` (exec form, a JSON array) rather than `java -jar app.jar` (shell form). Shell form wraps the command in `/bin/sh -c`, so your program is not PID 1, and it never receives `SIGTERM` from `docker stop`. Docker waits ten seconds, then kills it. Exec form makes your process PID 1 and lets it shut down cleanly." },
        { type: "callout", tone: "gotcha", title: "No variables in exec form", text: "Exec form does not run a shell, so `CMD [\"echo\", \"$HOME\"]` prints the literal text `$HOME`. If you need expansion, use a small entrypoint script that ends with `exec \"$@\"` so the real process still replaces the shell." },
        { type: "h2", text: "COPY vs ADD" },
        { type: "p", text: "**COPY** copies files or directories from the build context into the image, and does nothing else. **ADD** does the same, but also unpacks a local `.tar` archive and can download from a URL. Those extras make behaviour less obvious. A URL download adds a layer with no checksum by default, and a tarball may be extracted when you expected a plain copy." },
        {
          type: "table",
          head: ["Instruction", "Use it for"],
          rows: [
            ["`COPY`", "Source code, config files, a built jar. The default choice."],
            ["`ADD`", "Extracting a local tar archive into the image, which is its one good use."],
            ["`RUN curl ... && tar ...`", "Remote downloads, so you can verify a checksum and delete the archive in the same layer."],
          ],
        },
        { type: "h2", text: "Order and context" },
        { type: "p", text: "Paths in COPY are relative to the **build context**, the directory you pass to `docker build`, not to the Dockerfile. Anything outside it is not visible. Add a `.dockerignore` so `node_modules`, `.git` and `.env` are never sent to the daemon or copied by mistake. Copy dependency manifests first and run the install, then copy the rest of the source, so the install layer stays cached when only code changes." },
        {
          type: "code",
          language: "dockerfile",
          code: `COPY package.json package-lock.json ./
RUN npm ci
COPY . .`,
        },
        { type: "p", text: "Common mistakes: using shell form and wondering why `docker stop` takes ten seconds, using ADD for plain files, and a missing `.dockerignore` that bakes secrets into an image layer." },
      ],
      references: [
        { title: "Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/" },
        { title: "Building best practices", url: "https://docs.docker.com/build/building/best-practices/" },
      ],
    },
  },
};
