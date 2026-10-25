import { describe, expect, it } from "vitest";
import { ROADMAP_TRACKS } from "@/data/roadmap";

describe.each(ROADMAP_TRACKS.map((track) => [track.id, track] as const))("%s track", (_id, track) => {
  const subsections = track.sections.flatMap((section) => section.subsections.map((sub) => ({ section: section.title, sub })));

  it("has a written lesson with a slug for every topic", () => {
    const missing = subsections.filter(({ sub }) => !sub.lesson || !sub.slug).map(({ section, sub }) => `${section} :: ${sub.title}`);
    expect(missing).toEqual([]);
  });

  it("has at least one key point for every topic, so it can be ticked off", () => {
    const missing = subsections.filter(({ sub }) => !sub.points?.length).map(({ section, sub }) => `${section} :: ${sub.title}`);
    expect(missing).toEqual([]);
  });

  it("uses each lesson slug only once", () => {
    const seen = new Set<string>();
    const duplicates = subsections.flatMap(({ sub }) => (sub.slug ? [sub.slug] : [])).filter((slug) => (seen.has(slug) ? true : (seen.add(slug), false)));
    expect(duplicates).toEqual([]);
  });

  it("gives every lesson two or more public https references without repeats", () => {
    const problems = subsections.flatMap(({ section, sub }) => {
      const urls = (sub.lesson?.references ?? []).map((reference) => reference.url);
      const label = `${section} :: ${sub.title}`;
      if (urls.length < 2) return [`${label}: needs at least 2 references`];
      if (new Set(urls).size !== urls.length) return [`${label}: repeated reference`];
      return urls.filter((url) => !/^https:\/\/[^\s]+$/.test(url)).map((url) => `${label}: not an https URL: ${url}`);
    });
    expect(problems).toEqual([]);
  });
});
