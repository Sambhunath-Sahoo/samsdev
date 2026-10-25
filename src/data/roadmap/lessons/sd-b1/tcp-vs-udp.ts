import type { LessonEntry } from "@/types/roadmap";

export const TCP_VS_UDP: LessonEntry = {
  track: "system-design",
  section: "Networking and APIs",
  subsection: {
    title: "TCP vs UDP",
    slug: "tcp-vs-udp",
    lesson: {
      summary: "TCP gives you an ordered, reliable byte stream at the cost of handshakes and waiting; UDP gives you raw datagrams and leaves reliability to you.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Two transport protocols, two promises" },
        { type: "p", text: "Both run on top of IP and add port numbers so many programs can share one address. They differ in what they promise about delivery." },
        { type: "p", text: "**TCP** provides a connection with a reliable, ordered stream of bytes. It numbers every byte, the receiver acknowledges what arrived, and the sender retransmits anything missing. It also does **flow control** (do not overwhelm the receiver) and **congestion control** (do not overwhelm the network, slow down when packets are lost)." },
        { type: "p", text: "**UDP** sends independent datagrams with a tiny 8-byte header. No connection, no acknowledgement, no ordering, no retransmission. A datagram arrives, arrives twice, arrives out of order or never arrives, and the application finds out only if it built something to notice." },
        { type: "table", head: ["", "TCP", "UDP"], rows: [["Setup", "Three-way handshake", "None"], ["Delivery", "Guaranteed or the connection errors", "Best effort"], ["Ordering", "In order", "Not guaranteed"], ["Unit", "Byte stream, no message boundaries", "Datagrams, boundaries kept"], ["Overhead", "20+ byte header, state per connection", "8 byte header, stateless"], ["Typical use", "HTTP, databases, SSH, email", "DNS, VoIP, games, video calls, QUIC"]] },
        { type: "h2", text: "Why you would choose UDP" },
        { type: "p", text: "Reliability is not free: a lost packet stalls everything behind it (head-of-line blocking) until it is retransmitted. For a voice call, a late packet is useless, so it is better to drop it and play the next one. Games send position updates 60 times a second; the newest one supersedes any lost one, so resending is wasted effort." },
        { type: "p", text: "UDP also supports multicast and broadcast, avoids per-connection state on busy servers, and lets you build your own scheme. DNS queries are the classic small request and reply that do not justify a handshake. QUIC, the transport under HTTP/3, is built on UDP precisely to get per-stream recovery and faster setup without waiting for operating system TCP changes." },
        { type: "h2", text: "Choosing in a design" },
        { type: "list", items: ["Data must all arrive correct and in order (payments, files, API calls): TCP, usually via HTTP or gRPC.", "Freshness beats completeness (live audio, video, telemetry, game state): UDP, with the application tolerating loss.", "You need reliability and low latency with many streams: QUIC, or build selective reliability on UDP."] },
        { type: "code", language: "python", title: "Same idea, different sockets", code: `# TCP: connect first, then stream bytes
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("example.com", 80))
s.sendall(b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n")

# UDP: just fire a datagram at an address
u = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
u.sendto(b"ping", ("example.com", 9999))   # no idea if it arrived` },
        { type: "callout", tone: "gotcha", title: "UDP is not simply faster", text: "Candidates say 'UDP is faster' and stop. It has less overhead, but if you re-add acknowledgements, ordering and congestion control yourself you end up rebuilding TCP, usually worse. Also, unthrottled UDP can flood a network; congestion control is a duty you inherit. TCP 'guaranteed' only means the bytes arrive or you get an error, not that the peer processed them." },
      ],
      references: [
        { title: "RFC 9293: Transmission Control Protocol (TCP)", url: "https://www.rfc-editor.org/rfc/rfc9293" },
        { title: "RFC 768: User Datagram Protocol", url: "https://www.rfc-editor.org/rfc/rfc768" },
        { title: "RFC 9000: QUIC, a UDP-Based Multiplexed and Secure Transport", url: "https://www.rfc-editor.org/rfc/rfc9000" },
      ],
    },
    points: [
      { id: "sd.tcp-vs-udp.reliability-and-ordering", title: "What TCP guarantees", detail: "TCP delivers a byte stream in order, retransmits lost segments and applies flow and congestion control. The cost is a handshake and head-of-line blocking when a segment is lost.", question: "A TCP packet is lost mid-stream. What happens to the data that arrived after it?" },
      { id: "sd.tcp-vs-udp.when-udp-wins", title: "When UDP is the right choice", detail: "Real-time audio, video, games and DNS prefer fresh data or a single small exchange over guaranteed delivery. The application decides which losses to tolerate.", question: "Why does a video call prefer dropping a late packet to retransmitting it?" },
      { id: "sd.tcp-vs-udp.quic", title: "QUIC builds on UDP", detail: "QUIC adds reliability, congestion control, encryption and independent streams in user space on top of UDP. That is how HTTP/3 avoids TCP's cross-stream blocking.", question: "Why was QUIC built on UDP instead of changing TCP?" },
    ],
  },
};
