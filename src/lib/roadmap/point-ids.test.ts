import { describe, expect, it } from "vitest";
import { ALL_POINT_IDS, isKnownPointId, sectionPointIds } from "./point-ids";
import { ROADMAP_TRACKS } from "@/data/roadmap";

describe("point ids", () => {
  it("has a unique id for every written point", () => {
    const ids = ROADMAP_TRACKS.flatMap((t) => t.sections.flatMap((s) => sectionPointIds(s)));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ALL_POINT_IDS.size).toBe(ids.length);
  });

  it("accepts a real id", () => {
    expect(isKnownPointId("sd.foundations.vertical-vs-horizontal")).toBe(true);
  });

  it.each([["nope"], [""], [42], [null], [undefined], [{}]])("rejects %j", (value) => {
    expect(isKnownPointId(value)).toBe(false);
  });
});
