import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "git";

export const GIT_SUBSECTIONS: readonly RoadmapSubsection[] = [
  withPoints("Branching and pull requests", [
    point(
      S,
      "trunk-based-development",
      "Trunk-based development",
      "In trunk-based development everyone integrates into one main branch at least daily, using very short-lived branches or direct commits behind feature flags. It keeps merges small, avoids long-running integration pain and fits continuous delivery. It relies on strong automated tests and feature flags so unfinished work can sit in main without being exposed.",
      "What makes trunk-based development safe when half-finished work lands on main every day?",
    ),
    point(
      S,
      "gitflow-vs-trunk",
      "Gitflow vs trunk-based",
      "Gitflow uses long-lived main and develop branches plus feature, release and hotfix branches. It suits versioned products with scheduled releases and several supported versions, but it creates big merges and delays integration. Trunk-based development suits teams that deploy continuously from a single line of history.",
      "Which would you pick for a web app deployed ten times a day, and which for a library with supported versions?",
    ),
    point(
      S,
      "gitflow-hotfix",
      "Hotfixes in Gitflow",
      "A hotfix branch is cut from main (the production line), the fix is made and tested, then it is merged back into main and tagged with a new patch version. The same branch is also merged into develop, or the current release branch, so the fix is not lost in the next release. Skipping that second merge is the usual mistake.",
      "Why must a Gitflow hotfix be merged into develop as well as main?",
    ),
    point(
      S,
      "pull-requests-and-review",
      "Pull requests and code review",
      "A pull request proposes a branch for merging and is where automated checks run and a teammate reviews the change. Good reviews stay small, check behaviour, tests and risk rather than style a linter can enforce, and end with an explicit approval. Branch protection makes the checks and approval mandatory.",
      "What would you want automated before a human reviews a pull request?",
    ),
  ]),
  withPoints("Merge vs rebase and conflicts", [
    point(
      S,
      "merge-vs-rebase",
      "git merge vs git rebase",
      "Merge joins two histories with a merge commit and keeps the original commits untouched. Rebase replays your commits on top of another branch, producing a linear history but rewriting commit hashes. Rebase local, unshared branches; never rebase commits others have already pulled.",
      "When is it safe to rebase, and what goes wrong if you rebase a shared branch?",
    ),
    point(
      S,
      "resolving-merge-conflicts",
      "Resolving merge conflicts",
      "A conflict happens when two branches change the same lines and Git cannot choose. Git marks the file with conflict markers; you edit it to the intended result, stage it, and continue the merge or rebase. Frequent small merges and a good test run afterwards keep conflicts cheap and catch bad resolutions.",
      "You resolved a conflict and the build now fails. How do you work out what went wrong?",
    ),
  ]),
  withPoints("Protected main and hooks", [
    point(
      S,
      "git-hooks",
      "Git hooks",
      "Hooks are scripts Git runs at points in its workflow, such as pre-commit before a commit is created or pre-push before pushing. Teams use them to run linters, formatters, secret scanners and fast tests. They live in .git/hooks and are not shared by default, so teams distribute them with a tool such as pre-commit or Husky and still enforce the same checks in CI.",
      "Why must CI repeat the checks that a pre-commit hook already runs?",
    ),
    point(
      S,
      "protected-branches",
      "Protected branches and PR rules",
      "Branch protection on main blocks direct pushes and force pushes, requires a pull request, a number of approvals and passing status checks, and can require a linear history. This turns the team workflow from a convention into something the platform enforces. Administrators can still be included or excluded from the rules deliberately.",
      "Which branch protection rules would you set on main for a five-person team?",
    ),
  ]),
  withPoints("Tags and releases", [
    point(
      S,
      "semver-and-tags",
      "Tagging releases and semantic versioning",
      "A Git tag names a specific commit, and annotated tags such as v1.4.2 mark a release. Semantic versioning uses MAJOR.MINOR.PATCH: increment MAJOR for breaking changes, MINOR for backward-compatible features and PATCH for backward-compatible fixes. CI can build and publish artifacts when a tag is pushed.",
      "A release removes a field from a public API response. Which version number changes, and why?",
    ),
  ]),
  withPoints("Monorepo vs polyrepo", [
    point(
      S,
      "monorepo-vs-polyrepo",
      "Monorepo vs polyrepo",
      "A monorepo holds many projects in one repository, which makes atomic cross-project changes, shared tooling and code reuse easy, but it needs build tooling that only rebuilds what changed and careful access control. Polyrepo gives each service its own repository, history, permissions and pipeline, at the cost of coordinating changes across repositories and versioning shared libraries.",
      "How would CI avoid rebuilding every service in a monorepo for a one-line change?",
    ),
  ]),
  { title: ".gitignore and what never to commit" },
  { title: "Practice: team workflow with protected branches, PR rules and pre-commit hooks" },
];
