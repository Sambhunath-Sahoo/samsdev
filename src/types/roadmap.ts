export interface RoadmapPoint {
  /** Stable key that progress is saved against. Never reuse or rename once published. */
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly question: string;
}

export interface RoadmapSubsection {
  readonly title: string;
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
