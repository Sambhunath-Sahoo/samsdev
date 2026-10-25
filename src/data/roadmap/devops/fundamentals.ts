import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "fundamentals";

export const FUNDAMENTALS_SUBSECTIONS: readonly RoadmapSubsection[] = [
  withPoints("What DevOps is and what it solves", [
    point(
      S,
      "what-is-devops",
      "What DevOps is and the problem it solves",
      "DevOps is a set of practices and a culture that joins development and operations so software is built, tested, released and run by one feedback loop. It removes the hand-off wall where developers ship code and operations absorb the risk. The result is smaller, more frequent, automated releases with faster recovery when something breaks.",
      "What problem does DevOps solve, and how would you tell a team is doing it well?",
    ),
    point(
      S,
      "devops-vs-sre",
      "DevOps vs SRE",
      "DevOps describes the culture and the goals: shared ownership, automation, fast feedback. Site Reliability Engineering is one concrete way to do it, with a team that treats operations as a software problem, sets SLOs and error budgets, and caps manual toil. A common summary is that SRE is a specific implementation of DevOps principles.",
      "How do error budgets turn the DevOps goal of shipping fast into a rule an SRE team can enforce?",
    ),
    point(
      S,
      "shift-left",
      "Shift-left",
      "Shift-left means moving testing, security and quality checks earlier in the lifecycle, to the editor, the pre-commit hook and the pull request rather than a final gate before release. A bug found while writing the code costs minutes, while the same bug in production costs an incident. Linting, unit tests, dependency and image scanning and policy checks in CI are typical shift-left practices.",
      "Name four checks you would run before a pull request can merge, and what each one catches.",
    ),
  ]),
];
