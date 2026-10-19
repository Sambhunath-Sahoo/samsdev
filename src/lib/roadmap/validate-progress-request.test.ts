import { describe, expect, it } from "vitest";
import { parseProgressUpdate } from "./validate-progress-request";

const VALID_ID = "sd.foundations.vertical-vs-horizontal";

describe("parseProgressUpdate", () => {
  it("returns the update for a valid body", () => {
    expect(parseProgressUpdate({ pointId: VALID_ID, completed: true })).toEqual({ ok: true, pointId: VALID_ID, completed: true });
  });

  it.each([
    ["not an object", "x"],
    ["null", null],
    ["missing pointId", { completed: true }],
    ["unknown pointId", { pointId: "made.up", completed: true }],
    ["non-string pointId", { pointId: 1, completed: true }],
    ["missing completed", { pointId: VALID_ID }],
    ["non-boolean completed", { pointId: VALID_ID, completed: "yes" }],
  ])("rejects %s", (_name, body) => {
    expect(parseProgressUpdate(body).ok).toBe(false);
  });
});
