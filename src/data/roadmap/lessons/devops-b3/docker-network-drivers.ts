import type { LessonEntry } from "@/types/roadmap";

export const DOCKER_NETWORK_DRIVERS: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Docker network drivers: bridge, host and overlay",
    slug: "docker-network-drivers",
    lesson: {
      summary: "The bridge driver gives containers a private network on one host, host removes the isolation, and overlay spans several hosts.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What a driver decides" },
        { type: "p", text: "A Docker network driver decides how a container's network interface is wired to the outside world. Every container gets its own network namespace, which means its own IP address, routing table and ports, unless you choose otherwise. The driver is what connects that namespace to other containers and to the host." },
        { type: "table", head: ["Driver", "Scope", "Use it for"], rows: [["`bridge`", "One host", "The default. Containers on the same host talking to each other."], ["`host`", "One host", "Skipping isolation for speed or when you need many ports."], ["`overlay`", "Several hosts", "Swarm services spread across machines."], ["`none`", "One host", "A container with no network at all."]] },
        { type: "h2", text: "Bridge" },
        { type: "p", text: "Docker creates a virtual switch on the host. Each container gets a virtual interface plugged into it, and outbound traffic is translated (NAT) to the host's address. The built-in `bridge` network has a weakness: containers on it can only reach each other by IP. A **user-defined** bridge adds automatic DNS, so containers find each other by name, and it isolates them from containers on other networks. Compose creates one of these for every project." },
        {
          type: "code",
          language: "bash",
          code: `docker network create appnet
docker run -d --name db --network appnet -e POSTGRES_PASSWORD=dev postgres:16
docker run -d --name api --network appnet -p 8080:8080 myapi
# inside the api container the database host is simply "db"`,
        },
        { type: "p", text: "Only `-p 8080:8080` exposes a port to the outside. The database above has no published port, so nothing outside the `appnet` network can reach it. That is the point: publish only what users need." },
        { type: "h2", text: "Host" },
        { type: "p", text: "With `--network host` the container shares the host's network namespace. There is no NAT and no port mapping, so a process listening on 8080 inside the container listens on 8080 on the machine. This avoids a small amount of overhead and helps with software that opens large port ranges. The cost is that the container can now see and bind every host port, and two containers cannot both use the same port. On Docker Desktop it behaves differently, because the \"host\" is the hidden Linux VM." },
        { type: "h2", text: "Overlay" },
        { type: "p", text: "An overlay network joins containers that run on different hosts into one virtual network, by wrapping their traffic in VXLAN tunnels between the hosts. Docker Swarm uses it for services. You will rarely create one by hand today, because Kubernetes has its own networking model through CNI plugins, but the idea is the same: a flat network on top of several machines." },
        { type: "callout", tone: "gotcha", title: "localhost is the container", text: "Inside a container, `localhost` means that container, not your laptop or the database container. Use the service or container name on a user-defined network. Also, a published port such as `-p 5432:5432` is reachable from outside the host unless you bind it to `127.0.0.1:5432:5432`, and Docker edits the host firewall rules to allow it." },
        { type: "p", text: "Common mistakes: relying on the default bridge and hardcoding IPs that change on restart, publishing database ports to the internet, and using host networking as a shortcut to avoid understanding why one container cannot reach another." },
      ],
      references: [
        { title: "Networking overview", url: "https://docs.docker.com/engine/network/" },
        { title: "Bridge network driver", url: "https://docs.docker.com/engine/network/drivers/bridge/" },
        { title: "Host network driver", url: "https://docs.docker.com/engine/network/drivers/host/" },
        { title: "Overlay network driver", url: "https://docs.docker.com/engine/network/drivers/overlay/" },
      ],
    },
  },
};
