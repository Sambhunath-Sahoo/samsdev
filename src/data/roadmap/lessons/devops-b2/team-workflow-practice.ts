import type { LessonEntry } from "@/types/roadmap";

export const TEAM_WORKFLOW_PRACTICE: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Practice: team workflow with protected branches, PR rules and pre-commit hooks",
    slug: "practice-team-workflow-protected-branches",
    lesson: {
      summary: "Set up a real repository where main is protected, every change goes through a checked pull request, and hooks catch problems before a push.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The goal" },
        { type: "p", text: "You will build the workflow from this section on a throwaway repository: nobody pushes to `main`, every change is a small PR, CI must pass before merge, and a local hook blocks obvious mistakes. Do it on a practice repo, with a second GitHub account or a friend as reviewer if you can. If not, you can still do every step except the approval." },
        { type: "h2", text: "Step 1: a repository with a check" },
        { type: "p", text: "Create a repo with a tiny project and a CI workflow, because a rule that requires a check needs a check to exist. Any lint or test command works." },
        {
          type: "code",
          language: "yaml",
          title: ".github/workflows/ci.yml",
          code: `name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test`,
        },
        { type: "h2", text: "Step 2: protect main" },
        { type: "p", text: "In the repository settings, add a branch protection rule (or ruleset) for `main`:" },
        {
          type: "list",
          items: [
            "Require a pull request before merging, with 1 approval.",
            "Require the `test` status check to pass, and the branch to be up to date.",
            "Dismiss stale approvals on new commits.",
            "Block force pushes and branch deletion.",
            "Include administrators.",
          ],
        },
        { type: "p", text: "Then prove it works: try `git push origin main` from a local commit. It must be rejected." },
        { type: "h2", text: "Step 3: a pre-commit hook" },
        { type: "p", text: "Install the hook with a shared tool so teammates get it too. With the `pre-commit` framework, a committed config file lists the checks." },
        {
          type: "code",
          language: "yaml",
          title: ".pre-commit-config.yaml",
          code: `repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: check-added-large-files
      - id: detect-private-key
      - id: end-of-file-fixer
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks`,
        },
        {
          type: "code",
          language: "bash",
          code: `pip install pre-commit        # or: brew install pre-commit
pre-commit install            # writes .git/hooks/pre-commit
echo "-----BEGIN RSA PRIVATE KEY-----" > fake.pem && git add fake.pem
git commit -m "test hook"     # should be blocked by detect-private-key
git rm -f --cached fake.pem && rm fake.pem`,
        },
        { type: "h2", text: "Step 4: run the flow end to end" },
        {
          type: "list",
          ordered: true,
          items: [
            "`git switch -c fix/readme-typo`, make a one-line change, commit.",
            "`git push -u origin fix/readme-typo` and `gh pr create --fill`.",
            "Watch CI run. Break a test on purpose in a second commit and confirm the merge button is blocked, then fix it.",
            "Get the approval, merge with squash, and delete the branch.",
            "Create a conflict: edit the same line on two branches, merge one, then rebase the other and resolve it.",
            "Tag the result: `git tag -a v0.1.0 -m \"First release\"` and push the tag.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Version pins in the example", text: "The `rev` values and action versions above are examples that will age. Check each project's releases page for the current tag, or run `pre-commit autoupdate`, before relying on them." },
        { type: "h2", text: "What done looks like" },
        { type: "p", text: "You are finished when a direct push to `main` fails, a PR with a failing check cannot be merged, a staged secret is stopped at commit time, and you have resolved one conflict and pushed one release tag. Write down what surprised you; those notes are the start of your team's contributing guide." },
      ],
      references: [
        { title: "About protected branches - GitHub Docs", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" },
        { title: "pre-commit", url: "https://pre-commit.com/" },
        { title: "Git - Git Hooks", url: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks" },
        { title: "Pull requests - GitHub Docs", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" },
      ],
    },
    points: [
      {
        id: "devops.team-workflow.protect-main",
        title: "Prove the protection works",
        detail: "After enabling rules, try a direct push to `main` and a PR with a failing check. Both must be blocked, or the rules are not doing their job.",
        question: "How do you verify that a required status check really blocks a merge?",
      },
      {
        id: "devops.team-workflow.shared-hooks",
        title: "Share hooks through a committed config",
        detail: "Hooks in `.git/hooks` are local. A `.pre-commit-config.yaml` committed to the repo lets every teammate install the same checks.",
        question: "Why does a hook script in .git/hooks not reach your teammates?",
      },
      {
        id: "devops.team-workflow.full-loop",
        title: "Branch, PR, check, review, merge, tag",
        detail: "The full loop is a short-lived branch, a PR with CI, an approval, a squash merge and a tag for the release. Practising it once on a throwaway repo makes it routine.",
        question: "Which step of the loop produces the version label for a release?",
      },
    ],
  },
};
