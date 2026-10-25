import type { LessonEntry } from "@/types/roadmap";

export const IMAGES_VS_CONTAINERS: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Images vs containers",
    slug: "images-vs-containers",
    lesson: {
      summary: "An image is a read-only template, a container is a running process started from it, and neither is a virtual machine.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Image and container" },
        { type: "p", text: "An **image** is a stack of read-only filesystem layers plus metadata: the default command, environment variables, exposed ports. It does nothing on its own. A **container** is a normal Linux process started from an image, with a thin writable layer on top and its own view of the filesystem, network and process list." },
        { type: "p", text: "The relationship is the same as a class and an object. One image can start any number of containers, and deleting a container never changes the image it came from." },
        {
          type: "code",
          language: "bash",
          code: `docker pull nginx:1.27            # download the image layers
docker run -d --name web1 -p 8080:80 nginx:1.27
docker run -d --name web2 -p 8081:80 nginx:1.27   # same image, second container
docker images                     # images on this machine
docker ps -a                      # containers, running or stopped
docker rm -f web1 web2            # containers gone, image still there`,
        },
        { type: "h2", text: "Containers vs virtual machines" },
        { type: "p", text: "A virtual machine runs a full guest operating system, including its own kernel, on virtual hardware provided by a hypervisor. A container shares the host's kernel. Linux **namespaces** limit what a process can see, and **cgroups** limit how much CPU and memory it can use. There is no second kernel to boot, so a container starts in about a second and costs little more than the process itself." },
        {
          type: "table",
          head: ["", "Container", "Virtual machine"],
          rows: [
            ["Kernel", "Shared with the host", "Its own guest kernel"],
            ["Startup", "Around a second", "Tens of seconds to minutes"],
            ["Size", "Megabytes to a few hundred MB", "Gigabytes"],
            ["Isolation", "Process level, weaker", "Hardware level, stronger"],
          ],
        },
        { type: "p", text: "The shared kernel is also the limit. A Linux image cannot run on a Windows kernel directly, and a kernel bug can affect every container on the host. Docker Desktop on macOS and Windows quietly runs a small Linux VM to get around the first problem." },
        { type: "h2", text: "Docker architecture" },
        { type: "p", text: "Docker is a client and a server. The `docker` command is the **client**. It talks over a socket to the **daemon** (`dockerd`), which builds images, manages networks and volumes, and starts containers. Underneath, the daemon hands container creation to `containerd`, which uses `runc` to set up the namespaces and cgroups. Images are pulled from and pushed to a **registry**, such as Docker Hub." },
        { type: "list", items: ["**Client**: the CLI, or any tool that speaks the Docker API.", "**Daemon**: owns images, containers, networks and volumes on one host.", "**Registry**: stores images by name and tag.", "**Runtime**: `containerd` and `runc`, which actually start the process."] },
        { type: "h2", text: "What happens to data" },
        { type: "p", text: "Writes inside a running container go to its writable layer. When the container is removed, those writes are removed with it. Anything that must survive, such as a database directory, belongs in a volume. The container itself should be disposable: you replace it with a new one from a newer image rather than patching it in place." },
        { type: "callout", tone: "gotcha", title: "Stopped is not gone", text: "`docker ps` shows only running containers. Stopped ones keep their writable layer and take disk space until you run `docker rm` or `docker container prune`. A host full of old `Exited` containers is a common cause of a full disk." },
        { type: "p", text: "Common mistakes: treating a container like a small server you SSH into and edit by hand, using the `latest` tag so two machines pull different images, and assuming containers are a strong security boundary on their own." },
      ],
      references: [
        { title: "Docker overview", url: "https://docs.docker.com/get-started/docker-overview/" },
        { title: "What is an image?", url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/" },
        { title: "What is a container?", url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/" },
        { title: "namespaces(7) - Linux manual page", url: "https://man7.org/linux/man-pages/man7/namespaces.7.html" },
      ],
    },
  },
};
