import { describe, expect, it } from "vitest";
import { highlight } from "./highlight";

const kinds = (code: string, language: string) => highlight(code, language).filter((t) => t.kind !== "plain").map((t) => [t.kind, t.text]);

describe("highlight", () => {
  it("never loses or changes the original text", () => {
    const code = `FROM node:22-slim AS deps\n# a comment\nRUN echo "hi" --flag value`;
    expect(highlight(code, "dockerfile").map((t) => t.text).join("")).toBe(code);
  });

  it("marks comments, strings, keywords and flags in a Dockerfile", () => {
    expect(kinds(`FROM node AS build # base\nRUN echo "hi"`, "dockerfile")).toEqual([
      ["keyword", "FROM"],
      ["keyword", "AS"],
      ["comment", "# base"],
      ["keyword", "RUN"],
      ["string", '"hi"'],
    ]);
  });

  it("marks commands and flags in bash but leaves a hash inside a word alone", () => {
    expect(kinds("docker run --rm -p 80:80 img#tag", "bash")).toEqual([
      ["keyword", "docker"],
      ["flag", "--rm"],
      ["flag", "-p"],
    ]);
  });

  it("returns a single plain token for languages it does not know", () => {
    expect(highlight("anything here", "text")).toEqual([{ kind: "plain", text: "anything here" }]);
  });
});
