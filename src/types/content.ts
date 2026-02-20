export type DetailedProjectLinkSet = {
  live?: string;
  github?: string;
};

export type DetailedProject = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  videoUrl?: string;
  gallery?: string[];
  tech: string[];
  fullDescription: string;
  features: string[];
  links?: DetailedProjectLinkSet;
};

export type FeaturedProject = {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
};

export type ExperienceItem = {
  id: number;
  company: string;
  role: string;
  period: string;
  logo: string;
  points: string[];
  location?: string;
};

export type UserProfile = {
  name: string;
  title: string;
  email: string;
  github: string;
  linkedin: string;
  // ... other keys can exist; keep this minimal and expand when needed
};

export type ServiceItem = {
  title: string;
  desc: string;
  icon: string;
};

export type TechStackItem = {
  name: string;
  icon: string;
  featured?: boolean;
};


