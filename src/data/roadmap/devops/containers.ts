import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "containers";

/** Replaces the plain "Images vs containers" outline entry (same title). */
export const IMAGES_VS_CONTAINERS: RoadmapSubsection = withPoints("Images vs containers", [
  point(
    S,
    "image-vs-container",
    "Image vs container",
    "An image is a read-only, layered template that holds the filesystem and metadata needed to run an app. A container is a running (or stopped) instance of an image with a thin writable layer on top, its own process tree, network and mounts. Many containers can start from one image, and deleting a container discards its writable layer.",
    "You change a file inside a running container and restart it. Is the change still there, and what about after docker rm?",
  ),
  point(
    S,
    "containers-vs-vms",
    "Containers vs virtual machines",
    "A VM virtualises hardware and runs a full guest operating system on a hypervisor, so it is heavy but strongly isolated. A container shares the host kernel and isolates processes with namespaces and cgroups, so it starts in seconds and uses far less memory. The trade-off is weaker isolation, and a container needs a compatible kernel.",
    "Why can a Linux container not run a different kernel version than its host, while a VM can?",
  ),
  point(
    S,
    "docker-architecture",
    "Docker architecture",
    "The docker client sends commands to the Docker daemon (dockerd) over an API. The daemon builds and stores images, creates containers through a container runtime (containerd and runc), and pulls and pushes images to a registry. Images, containers, networks and volumes are the objects the daemon manages.",
    "When you run docker run nginx on a fresh machine, which components act and in what order?",
  ),
]);

export const DOCKERFILE_INSTRUCTIONS = withPoints("Dockerfile instructions: CMD, ENTRYPOINT, COPY and ADD", [
  point(
    S,
    "cmd-vs-entrypoint",
    "CMD vs ENTRYPOINT",
    "ENTRYPOINT defines the executable that always runs when the container starts, while CMD supplies default arguments or a default command. Arguments given to docker run replace CMD but are appended to ENTRYPOINT, and replacing ENTRYPOINT needs the --entrypoint flag. A common pattern is ENTRYPOINT for the program and CMD for its default flags. Prefer the exec (JSON array) form so the process receives signals.",
    "A container is started with docker run myimage --verbose. What happens with CMD only, and with ENTRYPOINT plus CMD?",
  ),
  point(
    S,
    "copy-vs-add",
    "COPY vs ADD",
    "COPY copies files or directories from the build context into the image and nothing more. ADD does the same but also extracts local tar archives and can fetch remote URLs, which makes it less predictable. Docker's guidance is to use COPY unless you specifically need archive extraction.",
    "Why is COPY preferred over ADD for adding source code to an image?",
  ),
]);

export const DOCKER_NETWORK_DRIVERS = withPoints("Docker network drivers: bridge, host and overlay", [
  point(
    S,
    "network-drivers",
    "How Docker networking works: bridge, host, overlay",
    "The default bridge driver gives each container a private IP on a virtual switch on the host; a user-defined bridge also adds DNS by container name, and ports must be published to reach containers from outside. The host driver removes network isolation so the container uses the host's network stack directly. The overlay driver spans several Docker hosts, for example in Swarm, so containers on different machines can talk as if on one network.",
    "Two containers on the default bridge cannot reach each other by name. What do you change?",
  ),
]);

export const CONTAINERS_AFTER_REGISTRY: readonly (string | RoadmapSubsection)[] = [
  "Image scanning with Trivy",
  "Docker Hub and other registries: GHCR, Artifact Registry (GCR is retired)",
  "Practice: Spring Boot and PostgreSQL with Compose, image size minimised",
];
