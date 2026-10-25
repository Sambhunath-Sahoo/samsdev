import type { LessonEntry } from "@/types/roadmap";

export const MERGE_VS_REBASE_AND_CONFLICTS: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Merge vs rebase and conflicts",
    slug: "merge-vs-rebase-and-conflicts",
    lesson: {
      summary: "Know what git merge and git rebase each do to history, when to use which, and how to resolve a conflict calmly.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two ways to combine work" },
        { type: "p", text: "Say `feature` branched from `main`, and `main` has since moved on. To bring the two together you have two tools. They produce the same final files but different history." },
        { type: "p", text: "**`git merge`** creates a new **merge commit** with two parents. Nothing existing is changed; history shows that two lines of work joined. It is safe and non-destructive, but a busy repository ends up with a lot of merge commits." },
        { type: "p", text: "**`git rebase`** takes your branch's commits and replays them, one by one, on top of the target branch. They become **new commits** with new hashes, and history stays a straight line. The cost: you have rewritten commits, so anyone who already has the old ones is now out of sync." },
        {
          type: "code",
          language: "bash",
          code: `# merge main into your branch (history keeps the real shape)
git switch feature && git merge main

# or rebase your branch onto main (linear history)
git switch feature && git rebase main
git push --force-with-lease          # needed after a rebase of a pushed branch`,
        },
        { type: "h2", text: "Which one to use" },
        {
          type: "table",
          head: ["Situation", "Use"],
          rows: [
            ["Update your own unpublished feature branch with latest `main`", "`rebase`"],
            ["Branch is shared with others", "`merge`, do not rewrite"],
            ["Bringing a finished PR into `main`", "Merge, squash or rebase-merge, per team rule"],
            ["`main` or any shared branch", "Never rebase it"],
          ],
        },
        { type: "p", text: "The golden rule: **do not rebase commits that others have based work on.** Rebasing your private branch is fine. Prefer `--force-with-lease` over `--force`, because it refuses to overwrite commits you have not seen." },
        { type: "h2", text: "Resolving merge conflicts" },
        { type: "p", text: "A conflict happens when both sides changed the same lines and git cannot choose. It is not an error, only a request for a human decision. Git stops, marks the files, and waits." },
        {
          type: "code",
          language: "text",
          title: "What a conflicted file looks like",
          code: `<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 10000;
>>>>>>> feature`,
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Run `git status` to see the files marked as both modified.",
            "Open each file, decide the right final content, and delete the three marker lines.",
            "Run the tests or at least the build. A clean textual merge can still be broken logic.",
            "`git add <file>`, then `git merge --continue` (or `git rebase --continue`).",
            "Changed your mind? `git merge --abort` or `git rebase --abort` returns you to before you started.",
          ],
        },
        { type: "p", text: "During a rebase the labels flip: `HEAD` is the branch you are rebasing onto and the incoming side is your own commit. That confuses many people, so read the commit message shown by `git status` rather than trusting the side names." },
        { type: "callout", tone: "tip", title: "Fewer conflicts by design", text: "Small PRs, frequent merges from `main`, and not reformatting whole files in unrelated commits remove most conflicts before they happen. Turn on `git config rerere.enabled true` so git remembers how you resolved a conflict and reuses it on repeats." },
        { type: "p", text: "Common mistakes: committing the marker lines, resolving by always taking your side without reading the other, and force-pushing over a teammate's work." },
      ],
      references: [
        { title: "Git - Rebasing", url: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing" },
        { title: "Git - git-rebase Documentation", url: "https://git-scm.com/docs/git-rebase" },
        { title: "Git - Advanced Merging", url: "https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging" },
      ],
    },
  },
};
