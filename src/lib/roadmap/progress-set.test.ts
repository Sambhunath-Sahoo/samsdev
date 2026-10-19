import { describe, expect, it } from "vitest";
import { withPointCompleted } from "./progress-set";

describe("withPointCompleted", () => {
  it("adds a point without mutating the original", () => {
    const original: ReadonlySet<string> = new Set(["a"]);
    const next = withPointCompleted(original, "b", true);
    expect([...next].sort()).toEqual(["a", "b"]);
    expect([...original]).toEqual(["a"]);
  });

  it("removes a point without mutating the original", () => {
    const original: ReadonlySet<string> = new Set(["a", "b"]);
    const next = withPointCompleted(original, "a", false);
    expect([...next]).toEqual(["b"]);
    expect(original.has("a")).toBe(true);
  });
});
