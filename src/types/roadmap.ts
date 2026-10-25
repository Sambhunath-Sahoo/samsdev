export interface RoadmapPoint {
  /** Stable key that progress is saved against. Never reuse or rename once published. */
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly question: string;
}

/** One block of a lesson. Inline `code` and **bold** are allowed in every text field. */
export type LessonBlock =
  | { readonly type: "h2"; readonly text: string }
  | { readonly type: "p"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[]; readonly ordered?: boolean }
  | { readonly type: "code"; readonly language: string; readonly code: string; readonly title?: string }
  | { readonly type: "callout"; readonly tone: "tip" | "gotcha" | "cost"; readonly title: string; readonly text: string }
  | { readonly type: "table"; readonly head: readonly string[]; readonly rows: readonly (readonly string[])[] }
  | { readonly type: "figure"; readonly src: string; readonly alt: string; readonly caption: string; readonly width: number; readonly height: number };

/** An external page worth reading next. Must be a public https URL. */
export interface LessonReference {
  readonly title: string;
  readonly url: string;
}

export interface Lesson {
  /** One sentence shown under the title and in lesson cards. */
  readonly summary: string;
  readonly minutes: number;
  readonly blocks: readonly LessonBlock[];
  /** "Further reading" links shown after the lesson. */
  readonly references?: readonly LessonReference[];
}

export interface RoadmapSubsection {
  readonly title: string;
  /** URL segment for the lesson page. Only needed when `lesson` exists. Unique within a track. */
  readonly slug?: string;
  /** The written note. Omitted while the subsection is only an outline. */
  readonly lesson?: Lesson;
  /** Written points. Omitted while the subsection is only an outline. */
  readonly points?: readonly RoadmapPoint[];
}

export interface RoadmapSection {
  readonly title: string;
  readonly goal: string;
  readonly subsections: readonly RoadmapSubsection[];
  readonly doneWhen?: readonly string[];
}

export interface RoadmapTrack {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly hue: "orange" | "blue";
  readonly sections: readonly RoadmapSection[];
}

/** A written lesson that belongs to one outline subsection, matched by track, section title and subsection title. */
export interface LessonEntry {
  readonly track: "devops" | "system-design";
  /** Exact `title` of the section the subsection sits in. */
  readonly section: string;
  readonly subsection: RoadmapSubsection;
}
