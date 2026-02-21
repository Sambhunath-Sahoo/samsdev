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



export type SanityExperienceItem = {
  _id: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  companyUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  location?: string;
  description: string[];
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

export type SanityAboutSkills = {
  frontend?: string[];
  backend?: string[];
  devopsCloud?: string[];
  ai?: string[];
  toolsPractices?: string[];
};

export type SanityAbout = {
  nickname: string;
  location?: string;
  designation?: string;
  experienceYears?: number;
  shortDescription?: string;
  // Portable Text blocks
   
  longDescription?: any[];
  skills?: SanityAboutSkills;
  contacts?: {
    email?: string;
    github?: string;
    linkedin?: string;
  };
};
