import type { LessonEntry } from "@/types/roadmap";

export const TCP_UDP_AND_PORTS: LessonEntry = {
  track: "devops",
  section: "Networking for ops",
  subsection: {
    title: "TCP, UDP and ports",
    slug: "tcp-udp-and-ports",
    lesson: {
      summary: "TCP gives reliable ordered streams, UDP gives fast unordered datagrams, and ports tell the operating system which program gets the traffic.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Ports and sockets" },
        { type: "p", text: "An IP address finds a machine. A **port** (0 to 65535) finds the program on it. A connection is identified by four values: source IP, source port, destination IP and destination port. That is why one server on port 443 can handle thousands of clients at once, since each client arrives with a different source port." },
        { type: "p", text: "Ports below 1024 are traditionally privileged on Linux, so a non-root process usually cannot bind them. This is one reason apps listen on 3000 or 8000 and a reverse proxy takes 80 and 443." },
        {
          type: "table",
          head: ["Port", "Service"],
          rows: [
            ["22", "SSH"],
            ["53", "DNS (UDP and TCP)"],
            ["80 / 443", "HTTP / HTTPS"],
            ["5432", "PostgreSQL"],
            ["3306", "MySQL"],
            ["6379", "Redis"],
          ],
        },
        { type: "h2", text: "TCP" },
        { type: "p", text: "TCP creates a connection before sending data, using a three-step handshake: the client sends `SYN`, the server replies `SYN-ACK`, the client sends `ACK`. After that, TCP delivers bytes in order, retransmits anything lost, and slows down when the network is congested. HTTP, SSH, and database protocols use it because they cannot tolerate missing or reordered data." },
        { type: "p", text: "The handshake costs one round trip before any data moves, and TLS adds more on top. That is why distance to the server shows up as latency even for tiny requests, and why connection reuse (HTTP keep-alive, connection pools) matters." },
        { type: "h2", text: "UDP" },
        { type: "p", text: "UDP skips all of that. You send a datagram and hope. There is no handshake, no retransmission and no ordering guarantee. It suits cases where speed beats completeness or the application handles loss itself: DNS queries, video and voice calls, games, and QUIC, the transport underneath HTTP/3." },
        {
          type: "table",
          head: ["", "TCP", "UDP"],
          rows: [
            ["Connection", "Handshake first", "None"],
            ["Delivery", "Reliable, ordered", "Best effort"],
            ["Overhead", "Higher", "Lower"],
            ["Typical use", "Web, SSH, databases", "DNS, media, QUIC"],
          ],
        },
        { type: "h2", text: "Looking at ports in practice" },
        {
          type: "code",
          language: "bash",
          code: `sudo ss -tulnp                 # TCP and UDP listeners with processes
nc -zv example.com 443         # test a TCP port from here
nc -zvu 203.0.113.10 53        # UDP check (result is not conclusive)
sudo lsof -i :3000             # what is using port 3000?`,
        },
        { type: "callout", tone: "gotcha", title: "A UDP check cannot prove much", text: "With TCP, a successful connect proves something is listening. With UDP there is no handshake, so silence can mean open or filtered. Test UDP services by sending a real request, such as a `dig` query to a DNS server." },
        { type: "p", text: "Common mistakes: opening a port in the firewall for the wrong protocol (a rule for TCP 53 does not cover UDP 53), exposing a database port to the whole internet because it was easier than setting up a tunnel, and running out of ephemeral source ports on a busy client that opens a new connection per request instead of reusing them." },
      ],
      references: [
        { title: "RFC 9293: Transmission Control Protocol (TCP)", url: "https://www.rfc-editor.org/rfc/rfc9293" },
        { title: "RFC 768: User Datagram Protocol", url: "https://www.rfc-editor.org/rfc/rfc768" },
        { title: "tcp(7) - Linux manual page", url: "https://man7.org/linux/man-pages/man7/tcp.7.html" },
        { title: "ss(8) - Linux manual page", url: "https://man7.org/linux/man-pages/man8/ss.8.html" },
      ],
    },
    points: [
      {
        id: "devops.tcp-udp.four-tuple",
        title: "A connection is four values",
        detail: "Source IP, source port, destination IP and destination port identify a connection. One server port can serve many clients because each uses a different source port.",
        question: "How can thousands of clients connect to the same server port 443?",
      },
      {
        id: "devops.tcp-udp.tcp-handshake",
        title: "TCP handshake and reliability",
        detail: "TCP opens with SYN, SYN-ACK and ACK, then guarantees ordered, retransmitted delivery. The handshake costs a round trip, so connection reuse lowers latency.",
        question: "Why does connection reuse make repeated requests faster?",
      },
      {
        id: "devops.tcp-udp.udp-use",
        title: "When UDP is the right choice",
        detail: "UDP has no handshake or delivery guarantee. It suits DNS, real-time media and QUIC, where speed matters or the application handles loss.",
        question: "Why does DNS normally use UDP instead of TCP?",
      },
    ],
  },
};
