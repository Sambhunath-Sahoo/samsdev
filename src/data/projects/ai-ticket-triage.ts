import type { DetailedProject } from "@/types/content";

export const AI_TICKET_TRIAGE: DetailedProject = {
  slug: "ai-ticket-triage",
  title: "AI Ticket Triage",
  subtitle: "AI search service",
  status: "in-progress",
  description:
    "A FastAPI service with a LangChain RAG pipeline over pgvector that triages support tickets and powers semantic search.",
  image: "",
  tech: ["Python", "FastAPI", "LangChain", "pgvector", "PostgreSQL", "Docker"],
  fullDescription:
    "AI Ticket Triage covers the whole retrieval-augmented generation loop: ingesting tickets, embedding them into pgvector, retrieving similar tickets and generating a triage suggestion from the retrieved context. It runs as a containerized FastAPI service and exposes both AI-driven triage and semantic search.",
  features: [
    "Ticket ingestion and embedding into pgvector",
    "Semantic search across past tickets",
    "LangChain RAG pipeline for AI-driven triage",
    "FastAPI service containerized with Docker",
  ],
};
