import { describe, expect, it } from "vitest";
import { findLesson, lessonHeadings, listLessons, neighbours, slugify } from "./lessons";
import { ROADMAP_TRACKS } from "@/data/roadmap";
import type { RoadmapTrack } from "@/types/roadmap";

const lesson = (heading: string) => ({
  summary: "s",
  minutes: 3,
  blocks: [
    { type: "h2", text: heading },
    { type: "p", text: "body" },
  ] as const,
});

const track: RoadmapTrack = {
  id: "t",
  title: "T",
  description: "d",
  hue: "blue",
  sections: [
    {
      title: "One",
      goal: "g",
      subsections: [
        { title: "Outline only" },
        { title: "First lesson", slug: "first", lesson: lesson("Why it matters") },
        { title: "Second lesson", slug: "second", lesson: lesson("Run: it & go!") },
      ],
    },
    { title: "Two", goal: "g", subsections: [{ title: "Third lesson", slug: "third", lesson: lesson("Third") }] },
  ],
};

/** AWS documentation's placeholder account ids. Any other 12-digit number could be a real account. */
const EXAMPLE_ACCOUNT_IDS: ReadonlySet<string> = new Set(["111122223333", "123456789012"]);

/** Addresses that cannot identify a real host: RFC 5737 documentation ranges, RFC 1918 private ranges, loopback, and public DNS resolvers everyone knows. */
function isExampleAddress(ip: string): boolean {
  const [a, b, c] = ip.split(".").map(Number);
  if (["1.1.1.1", "8.8.8.8", "8.8.4.4", "0.0.0.0"].includes(ip)) return true;
  if (a === 127 || a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 0 && c === 2) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  return a === 203 && b === 0 && c === 113;
}

describe("slugify", () => {
  it("lowercases, strips punctuation and joins words with dashes", () => {
    expect(slugify("Run: it & go!")).toBe("run-it-go");
    expect(slugify("  Dockerfile and build cache ")).toBe("dockerfile-and-build-cache");
  });
});

describe("listLessons", () => {
  it("returns only subsections that have a lesson, in reading order", () => {
    expect(listLessons(track).map((l) => l.slug)).toEqual(["first", "second", "third"]);
  });

  it("numbers lessons within their section", () => {
    const [first, second, third] = listLessons(track);
    expect([first.position, second.position, third.position]).toEqual([1, 2, 1]);
    expect([first.total, third.total]).toEqual([2, 1]);
  });
});

describe("findLesson and neighbours", () => {
  it("finds a lesson by slug", () => {
    expect(findLesson(track, "second")?.subsection.title).toBe("Second lesson");
    expect(findLesson(track, "missing")).toBeUndefined();
  });

  it("gives previous and next across sections", () => {
    expect(neighbours(track, "second")).toEqual({ previous: expect.objectContaining({ slug: "first" }), next: expect.objectContaining({ slug: "third" }) });
    expect(neighbours(track, "first").previous).toBeUndefined();
    expect(neighbours(track, "third").next).toBeUndefined();
  });
});

describe("lessonHeadings", () => {
  it("builds the on-this-page list from h2 blocks", () => {
    expect(lessonHeadings(lesson("Run: it & go!"))).toEqual([{ id: "run-it-go", text: "Run: it & go!" }]);
  });
});

describe("written roadmap lessons", () => {
  const all = ROADMAP_TRACKS.flatMap((t) => listLessons(t).map((ref) => ({ track: t.id, ref })));

  it("has at least one lesson, with a unique slug per track", () => {
    expect(all.length).toBeGreaterThan(0);
    const keys = all.map(({ track, ref }) => `${track}/${ref.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(all.map(({ track, ref }) => [`${track}/${ref.slug}`, ref] as const))("%s has headings, key points and a clean slug", (_name, ref) => {
    expect(ref.slug).toBe(slugify(ref.slug));
    expect(lessonHeadings(ref.subsection.lesson).length).toBeGreaterThan(0);
    expect(ref.subsection.points?.length ?? 0).toBeGreaterThan(0);
  });

  it("never lets a real account id, IP or key name into lesson text", () => {
    const text = JSON.stringify(all.map(({ ref }) => ref.subsection));
    const accountIds = (text.match(/\b\d{12}\b/g) ?? []).filter((id) => !EXAMPLE_ACCOUNT_IDS.has(id));
    const addresses = (text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? []).filter((ip) => !isExampleAddress(ip));
    expect(accountIds).toEqual([]);
    expect(addresses).toEqual([]);
  });
});
