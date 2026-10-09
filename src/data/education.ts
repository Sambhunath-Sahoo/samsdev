export interface EducationItem {
  degree: string;
  institution: string;
  institutionUrl?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying?: boolean;
  location?: string;
  description?: string[];
}

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "B.Tech in Computer Science Engineering",
    institution: "GIET University",
    startDate: "2018-09",
    endDate: "2022-05",
    location: "Gunupur, Odisha",
  },
];
