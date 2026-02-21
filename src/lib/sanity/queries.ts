import { groq } from "next-sanity";

export const FEATURED_PROJECTS_QUERY = groq`
  *[_type == "project" && isFeatured == true] | order(order asc) {
    "id": _id,
    title,
    description,
    "image": image.asset->url,
    tech,
    demoUrl,
    githubUrl
  }
`;

export const DETAILED_PROJECTS_QUERY = groq`
  *[_type == "project"] | order(order asc) {
    "slug": slug.current,
    title,
    subtitle,
    description,
    fullDescription,
    "image": image.asset->url,
    videoUrl,
    "gallery": gallery[].asset->url,
    tech,
    features,
    challenges,
    outcome,
    "links": {
      "live": demoUrl,
      "github": githubUrl
    }
  }
`;

export const PROJECT_BY_SLUG_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    subtitle,
    description,
    fullDescription,
    "image": image.asset->url,
    videoUrl,
    "gallery": gallery[].asset->url,
    tech,
    features,
    "links": {
      "live": demoUrl,
      "github": githubUrl
    }
  }
`;

export const WORK_EXPERIENCE_QUERY = groq`
  *[_type == "workExperience"] | order(startDate desc) {
    "_id": _id,
    title,
    companyName,
    "companyLogo": companyLogo.asset->url,
    companyUrl,
    startDate,
    endDate,
    currentlyWorking,
    location,
    description
  }
`;

export const ABOUT_QUERY = groq`
  *[_type == "about"][0] {
    nickname,
    location,
    designation,
    experienceYears,
    shortDescription,
    longDescription
  }
`;

export const CONTACTS_QUERY = groq`
  *[_type == "contacts"][0] {
    email,
    github,
    linkedin
  }
`;

export const SKILLS_QUERY = groq`
  *[_type == "skills"][0] {
    frontend,
    backend,
    devopsCloud,
    ai,
    toolsPractices
  }
`;

export const SERVICES_QUERY = groq`
  *[_type == "services"] | order(order asc) {
    _id,
    title,
    desc
  }
`;
