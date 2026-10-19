import type { SanityAbout, SanityAboutSkills, SanityExperienceItem, SanityServiceItem } from "@/types/content";

/**
 * Resume content kept in code. Fields here win over the Sanity documents of
 * the same kind (see lib/content/*), the same way local projects win over Sanity.
 */

export const RESUME_ABOUT: Partial<SanityAbout> = {
  designation: "AI Full Stack Engineer",
  experienceYears: 4,
  shortDescription:
    "AI full stack engineer with 4+ years building scalable SaaS products. At Recruit CRM I shipped a production LLM-powered RAG feature in a live candidate-matching product, on a Java, Spring Boot and Vue.js base, and was promoted to Software Engineer within 20 months. Outside work I build with Python, FastAPI and Next.js.",
};

export const RESUME_EXPERIENCE: readonly SanityExperienceItem[] = [
  {
    _id: "recruit-crm-se",
    title: "Software Engineer",
    companyName: "Recruit CRM",
    startDate: "2023-11-01",
    endDate: null,
    currentlyWorking: true,
    location: "Remote",
    description: [
      "Built the AI sourcing and candidate discovery feature on an LLM-powered RAG pipeline (LangChain, embeddings, OpenSearch vector search), improving match relevance and cutting manual effort.",
      "Designed Boolean, filter, travel-time and radius candidate search with Spring Boot and Vue.js, improving location accuracy by 30%.",
      "Integrated SingleStore with Spring Boot microservices, cutting complex global-search query times by over 40%.",
      "Built async event handling for a Node.js notification microservice, delivering real-time updates over WebSockets with retries and idempotency.",
      "Mentored 8+ junior developers and led PR and design reviews, lifting team velocity by 20%.",
    ],
  },
  {
    _id: "recruit-crm-ase",
    title: "Associate Software Engineer",
    companyName: "Recruit CRM",
    startDate: "2022-03-01",
    endDate: "2023-11-01",
    currentlyWorking: false,
    location: "Pune",
    description: [
      "Refactored legacy monolithic APIs into modular Spring Boot microservices with async job patterns, speeding up feature delivery.",
      "Resolved 200+ high-priority bugs across Vue, React and backend services, supporting a consistent 95% customer satisfaction rate.",
      "Redesigned the MySQL schema for global search with product and QA, reducing search latency by 30%.",
      "Built responsive Vue.js and React modules for candidate search and dashboards.",
    ],
  },
  {
    _id: "siscaso-intern",
    title: "Software Engineer Intern",
    companyName: "SISCASO",
    startDate: "2021-07-01",
    endDate: "2022-02-01",
    currentlyWorking: false,
    location: "Pune",
    description: ["Built reusable React UI components and fixed production bugs across modules."],
  },
];

export const RESUME_SKILLS: SanityAboutSkills = {
  ai: ["LLMs", "Generative AI", "LangChain", "RAG pipelines", "Embeddings", "OpenSearch", "pgvector"],
  frontend: ["Next.js", "React.js", "Vue.js", "Redux", "TypeScript"],
  backend: ["Python", "FastAPI", "Spring Boot", "Java", "Node.js", "REST APIs", "Microservices", "WebSockets", "System design"],
  devopsCloud: ["AWS (EC2, S3, Aurora)", "Docker", "Jenkins", "GitHub Actions", "Linux", "Kafka", "RabbitMQ", "AWS SQS"],
  toolsPractices: ["PostgreSQL", "MySQL", "SingleStore", "MongoDB", "Redis", "OAuth2", "JWT", "JUnit", "Mockito"],
};

export const RESUME_SERVICES: readonly SanityServiceItem[] = [
  {
    _id: "svc-ai",
    title: "AI search and RAG",
    desc: "LLM features inside your product: embeddings, vector search with OpenSearch or pgvector, LangChain pipelines.",
  },
  {
    _id: "svc-fullstack",
    title: "AI-ready full stack products",
    desc: "FastAPI or Spring Boot backends with Next.js, React or Vue frontends, from schema to UI.",
  },
  {
    _id: "svc-backend",
    title: "Backend and performance",
    desc: "Microservices, async messaging, query and schema tuning, deployed on AWS with Docker and CI/CD.",
  },
];
