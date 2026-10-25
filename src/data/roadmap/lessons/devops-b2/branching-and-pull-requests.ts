import type { LessonEntry } from "@/types/roadmap";

export const BRANCHING_AND_PULL_REQUESTS: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Branching and pull requests",
    slug: "branching-and-pull-requests",
    lesson: {
      summary: "Compare trunk-based development with Gitflow, handle hotfixes, and run pull requests so review stays small and fast.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Why branch at all" },
        { type: "p", text: "A branch is a movable pointer to a commit, so creating one is nearly free. It lets you work on a change without touching the shared line of code, and a **pull request** (PR) is the request to merge that branch back, with a place for review and automated checks. The real decision is not whether to branch but how long branches live and how many long-lived ones you keep." },
        { type: "h2", text: "Trunk-based development" },
        { type: "p", text: "In **trunk-based development** everyone works from one main branch. Branches are short, typically a day or two, and merged back often. Unfinished work is hidden behind feature flags so `main` is always releasable. Because each change is small, merges rarely conflict and CI tells you quickly if something broke. This is the style that suits continuous deployment, and it is the sensible default for a small team." },
        { type: "h2", text: "Gitflow and trunk-based compared" },
        { type: "p", text: "**Gitflow** keeps two permanent branches, `main` for released code and `develop` for integration, plus `feature/*`, `release/*` and `hotfix/*` branches. It fits products shipped in versioned releases (installed software, mobile apps, several supported versions). It costs you more merging and a longer gap between writing code and shipping it." },
        {
          type: "table",
          head: ["", "Trunk-based", "Gitflow"],
          rows: [
            ["Long-lived branches", "Only `main`", "`main` and `develop`"],
            ["Branch lifetime", "Hours to a couple of days", "Days to weeks"],
            ["Release", "Deploy from `main`, often", "Cut a `release/*` branch"],
            ["Best for", "Web apps, continuous delivery", "Versioned, supported releases"],
            ["Main risk", "Needs good tests and flags", "Painful merges, slow feedback"],
          ],
        },
        { type: "h2", text: "Hotfixes" },
        { type: "p", text: "In Gitflow, a production bug is fixed on a `hotfix/*` branch cut from `main`, merged back to `main` and tagged, and then also merged into `develop` so the fix is not lost. Forgetting that second merge is the classic error, and the bug returns in the next release. In trunk-based flow it is simpler: fix on `main` and deploy, or, if you release from release branches, cherry-pick the fix onto the branch." },
        {
          type: "code",
          language: "bash",
          title: "A short-lived feature branch",
          code: `git switch main && git pull --ff-only
git switch -c feat/contact-form
# ...commit small, logical steps...
git push -u origin feat/contact-form
gh pr create --fill                 # open the pull request
# after approval and green CI:
gh pr merge --squash --delete-branch`,
        },
        { type: "h2", text: "Pull requests and review" },
        { type: "p", text: "A good PR is small, has a description that says what changed and why, and links the issue. Reviewers read faster and miss less when the diff is a few hundred lines at most. Let automation cover style, types and tests so humans can focus on design, correctness and risk. Review the diff for secrets, missing error handling and untested paths." },
        {
          type: "list",
          items: [
            "Keep PRs to one purpose. Split refactors from behaviour changes.",
            "Open early as a draft when you want feedback on direction.",
            "Author responds to every comment; reviewer approves only what they would be willing to debug.",
            "Delete the branch after merge so the branch list stays meaningful.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Long-lived branches rot", text: "A branch that lives for weeks drifts from `main`, collects conflicts and becomes a risky big-bang merge. If a feature takes weeks, merge it in slices behind a flag instead." },
      ],
      references: [
        { title: "Git - Branching Workflows", url: "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows" },
        { title: "Gitflow Workflow | Atlassian Git Tutorial", url: "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow" },
        { title: "Trunk Based Development - Introduction", url: "https://trunkbaseddevelopment.com/" },
        { title: "Pull requests - GitHub Docs", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" },
      ],
    },
  },
};
