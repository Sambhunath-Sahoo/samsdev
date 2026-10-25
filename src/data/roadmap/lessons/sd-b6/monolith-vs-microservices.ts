import type { LessonEntry } from "@/types/roadmap";

export const MONOLITH_VS_MICROSERVICES: LessonEntry = {
  track: "system-design",
  section: "Architecture styles",
  subsection: {
    title: "Monolith vs microservices",
    slug: "monolith-vs-microservices",
    lesson: {
      summary: "Start with a well-structured monolith and split into services only when team size, scaling needs or failure isolation justify the new costs.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two ways to package the same system" },
        { type: "p", text: "A **monolith** is one deployable unit: one codebase, one build, usually one database. A **microservice** architecture splits the system into many small services, each owning one business capability and its own data, deployed independently and talking over the network. The business logic can be identical in both. What changes is where the boundaries are enforced: by the compiler and in-process calls, or by networks and contracts." },
        { type: "h2", text: "Monolith first" },
        { type: "p", text: "Martin Fowler's observation, and many teams' experience, is that almost all successful microservice systems began as a monolith that grew too big, and many systems built as microservices from day one ran into trouble. The reason is that early on you do not know where the right boundaries are. A wrong boundary inside a monolith costs a refactor. A wrong boundary between services costs a distributed migration, with versioned APIs and data moved between databases." },
        { type: "p", text: "A monolith is not the same as a mess. Build a **modular monolith**: clear modules (orders, billing, catalog) with explicit interfaces, no reaching into another module's tables, and enforced dependency rules. When a module needs to leave, the seams already exist." },
        { type: "h2", text: "What microservices cost" },
        { type: "p", text: "Every in-process call becomes a network call that can be slow, fail or time out. You gain independence and pay for it in these ways:" },
        {
          type: "list",
          items: [
            "**Distributed data:** no joins or ACID transactions across services. You need sagas, outbox patterns and eventual consistency.",
            "**Operational load:** dozens of pipelines, dashboards, alerts and on-call rotations, plus tracing and service discovery to debug one request.",
            "**Testing and versioning:** contract tests, backward-compatible APIs, and deploy ordering.",
            "**Latency and failure:** a request that touches five services multiplies the chance of a slow or failed hop. Retries, timeouts and circuit breakers become mandatory.",
          ],
        },
        { type: "h2", text: "When to split" },
        {
          type: "table",
          head: ["Signal", "Why it justifies a service"],
          rows: [
            ["Many teams block each other on one deploy", "Independent deploys restore team speed (Conway's law: structure follows the organisation)"],
            ["One part needs very different scaling", "Image processing needs 50 GPU nodes while the rest needs 4 small servers"],
            ["Different reliability or compliance needs", "Payments need isolation, audits and stricter release rules"],
            ["Different technology fits a part", "A search or ML component in another runtime"],
            ["A fault must not spread", "A crash in recommendations must not take down checkout"],
          ],
        },
        { type: "p", text: "Weak reasons: \"it is modern\", \"Netflix does it\", or a team of five wanting twenty services. Netflix split because hundreds of engineers and huge scale forced it. A rough rule: if you cannot name the specific pain a split removes, do not split." },
        { type: "h2", text: "Splitting well" },
        {
          type: "list",
          ordered: true,
          items: [
            "Find boundaries along business capabilities and data ownership (domain-driven design bounded contexts), not technical layers like a separate \"database service\".",
            "Extract one module at a time, starting with a loosely coupled one, using the strangler pattern: route some traffic to the new service while the monolith keeps the rest.",
            "Give each service its own database. Shared tables turn services into a distributed monolith.",
            "Add observability and automation first: tracing, central logs, CI/CD per service.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "The distributed monolith", text: "If services must be deployed together, share a database, or call each other in long synchronous chains, you have all the cost of microservices and none of the independence. A sign: one change regularly needs coordinated releases of three services." },
        { type: "p", text: "In an interview, do not announce microservices by reflex. Say you would begin with a modular monolith and name the exact signal, such as team count or a hot component, that would make you extract a service. Then describe how: boundaries, data ownership, and how consistency is handled across them." },
      ],
      references: [
        { title: "MonolithFirst (Martin Fowler)", url: "https://martinfowler.com/bliki/MonolithFirst.html" },
        { title: "Microservices (Martin Fowler and James Lewis)", url: "https://martinfowler.com/articles/microservices.html" },
        { title: "Pattern: Monolithic Architecture (microservices.io)", url: "https://microservices.io/patterns/monolithic.html" },
      ],
    },
  },
};
