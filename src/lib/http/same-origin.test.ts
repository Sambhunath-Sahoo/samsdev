import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./same-origin";

describe("isSameOrigin", () => {
  it("accepts a matching origin and host", () => {
    expect(isSameOrigin("https://sams.dev", "sams.dev")).toBe(true);
  });

  it("rejects a different host", () => {
    expect(isSameOrigin("https://evil.example", "sams.dev")).toBe(false);
  });

  it("rejects a missing origin or host", () => {
    expect(isSameOrigin(null, "sams.dev")).toBe(false);
    expect(isSameOrigin("https://sams.dev", null)).toBe(false);
  });

  it("rejects a malformed origin", () => {
    expect(isSameOrigin("not a url", "sams.dev")).toBe(false);
  });
});
