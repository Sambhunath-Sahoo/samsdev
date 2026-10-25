import type { LessonEntry } from "@/types/roadmap";

export const PROTECTED_MAIN_AND_HOOKS: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Protected main and hooks",
    slug: "protected-main-and-hooks",
    lesson: {
      summary: "Catch problems on your machine with Git hooks and make the server enforce the rules with protected branches and required checks.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two layers of enforcement" },
        { type: "p", text: "Rules that depend on people remembering them eventually fail. You want two layers. **Git hooks** run on the developer's machine and give fast feedback before code leaves it. **Protected branches** run on the server (GitHub, GitLab) and cannot be skipped. Hooks are convenience; branch protection is the guarantee." },
        { type: "h2", text: "Git hooks" },
        { type: "p", text: "A hook is a script in `.git/hooks/` that git runs at certain moments. The common ones are `pre-commit` (before a commit is recorded), `commit-msg` (to check the message), and `pre-push` (before pushing). A non-zero exit stops the action." },
        {
          type: "code",
          language: "bash",
          title: ".git/hooks/pre-commit",
          code: `#!/bin/sh
# block the commit if lint or a staged secret is found
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(ts|tsx)$')
[ -z "$FILES" ] || npx eslint --max-warnings 0 $FILES || exit 1
if git diff --cached | grep -E 'AKIA[0-9A-Z]{16}'; then
  echo "Possible AWS key staged, commit blocked" >&2
  exit 1
fi`,
        },
        { type: "p", text: "The folder `.git/hooks` is not part of the repository, so teammates do not receive your scripts. Teams share hooks through a tool: **Husky** for JavaScript projects, or **pre-commit** for any language, both of which install hooks from a committed config file. Keep hooks fast, a few seconds at most, or people will bypass them with `git commit --no-verify`." },
        { type: "h2", text: "Protected branches and PR rules" },
        { type: "p", text: "Protecting `main` means nobody can push to it directly. Changes arrive only through pull requests that satisfy rules you define. Typical settings:" },
        {
          type: "list",
          items: [
            "**Require a pull request** with at least one approving review.",
            "**Require status checks** (tests, lint, build) to pass before merging, and the branch to be up to date.",
            "**Dismiss stale approvals** when new commits are pushed.",
            "**Block force pushes and deletion** of the branch.",
            "**Require linear history** or signed commits if your team wants them.",
            "**Apply rules to administrators** too, so the owner cannot bypass them by accident.",
          ],
        },
        { type: "p", text: "On GitHub these live under branch protection rules or the newer rulesets, which can target several branches at once. Set them up in the repository settings and, for a team, require a code owner review for sensitive paths through a `CODEOWNERS` file." },
        { type: "callout", tone: "gotcha", title: "A required check must exist and run", text: "If a required status check is misnamed, or its workflow only runs for some paths, the PR waits forever or passes without it. After enabling protection, open a test PR and confirm the check appears, fails when it should, and blocks the merge button." },
        { type: "p", text: "Common mistakes: relying on hooks alone, since anyone can skip them, protecting `main` but leaving `release/*` open, making hooks so slow that people disable them, and exempting admins who then push straight to `main` during an incident and skip the checks you most need." },
      ],
      references: [
        { title: "Git - Git Hooks", url: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks" },
        { title: "About protected branches - GitHub Docs", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" },
        { title: "About rulesets - GitHub Docs", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets" },
        { title: "pre-commit", url: "https://pre-commit.com/" },
      ],
    },
  },
};
