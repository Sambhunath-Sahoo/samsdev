import type { LessonEntry } from "@/types/roadmap";

export const GITIGNORE_AND_WHAT_NEVER_TO_COMMIT: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: ".gitignore and what never to commit",
    slug: "gitignore-and-what-never-to-commit",
    lesson: {
      summary: "Use .gitignore to keep secrets, build output and local files out of the repository, and know what to do when something slips in.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why it matters" },
        { type: "p", text: "Git history is permanent and copied to every clone. Anything you commit, including a password you delete in the next commit, stays reachable in history. So the aim is to keep the wrong files from ever being committed. `.gitignore` is the file that tells git which untracked paths to skip." },
        { type: "h2", text: "What never to commit" },
        {
          type: "list",
          items: [
            "**Secrets**: `.env` files, API keys, tokens, private keys (`*.pem`, `id_rsa`), cloud credentials, database dumps with real data.",
            "**Dependencies**: `node_modules/`, virtual environments, vendored caches. They are reproducible from a lockfile.",
            "**Build output**: `.next/`, `dist/`, `build/`, compiled files, coverage reports.",
            "**Local state**: Terraform state (`*.tfstate`) and `.terraform/`, which hold secrets and belong in a remote backend.",
            "**Machine and editor files**: `.DS_Store`, `.idea/`, logs, temporary files.",
          ],
        },
        { type: "p", text: "Do commit lockfiles (`package-lock.json`, `pnpm-lock.yaml`), because they make installs repeatable, and commit a `.env.example` with variable names and no values so others know what to set." },
        { type: "h2", text: "A working .gitignore" },
        {
          type: "code",
          language: "text",
          title: ".gitignore",
          code: `# dependencies and build output
node_modules/
.next/
dist/
coverage/

# secrets and local config
.env
.env.*
!.env.example
*.pem

# terraform
.terraform/
*.tfstate
*.tfstate.*

# os and editor
.DS_Store
.idea/
*.log`,
        },
        { type: "p", text: "Patterns match relative to the file's location. A trailing `/` matches directories only, `*` matches within a name, `**` matches across folders, and a leading `!` re-includes something an earlier rule excluded. Use `git check-ignore -v path` to learn which rule is hiding a file." },
        { type: "callout", tone: "gotcha", title: ".gitignore does not untrack files", text: "It only affects files git is not already tracking. If `.env` was committed before you added the rule, git keeps tracking it. Run `git rm --cached .env`, commit, and the file stays on disk but leaves the index." },
        { type: "h2", text: "When a secret gets committed" },
        { type: "p", text: "Treat it as leaked the moment it is pushed, because bots scan public repositories within minutes. In order: **revoke or rotate the credential first**, then remove it from the code, then, if you want, rewrite history with `git filter-repo` or the BFG tool and force-push. Rewriting history does not undo exposure: forks, clones and caches may still hold it, so rotation is the real fix." },
        { type: "p", text: "Prevention is cheaper. Enable GitHub secret scanning and push protection, which blocks pushes that contain recognised credential formats, and add a pre-commit scanner such as gitleaks. For machine-wide patterns, put them in a global ignore file with `git config --global core.excludesfile ~/.gitignore_global`." },
        { type: "p", text: "Common mistakes: adding `.env` to `.gitignore` after the first commit, committing a Terraform state file, and assuming a private repository makes committed secrets safe. Private repos get cloned, leaked and made public." },
      ],
      references: [
        { title: "Git - gitignore Documentation", url: "https://git-scm.com/docs/gitignore" },
        { title: "Ignoring files - GitHub Docs", url: "https://docs.github.com/en/get-started/git-basics/ignoring-files" },
        { title: "Secret scanning - GitHub Docs", url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning" },
      ],
    },
    points: [
      {
        id: "devops.gitignore.never-commit",
        title: "What stays out of git",
        detail: "Secrets, dependencies, build output, Terraform state and machine files do not belong in the repository. Commit lockfiles and a `.env.example` instead.",
        question: "Which file do you commit so teammates know which environment variables to set?",
      },
      {
        id: "devops.gitignore.already-tracked",
        title: "Ignoring does not untrack",
        detail: "`.gitignore` only affects untracked files. A file that was already committed needs `git rm --cached` to leave the index.",
        question: "You added `.env` to .gitignore but git still shows changes to it. Why, and what is the fix?",
      },
      {
        id: "devops.gitignore.leaked-secret",
        title: "Rotate first when a secret leaks",
        detail: "A pushed secret must be treated as exposed. Rotate it first, then clean the code and optionally the history, because clones and forks may still hold it.",
        question: "Why is rewriting git history not enough after a secret was pushed?",
      },
      {
        id: "devops.gitignore.push-protection",
        title: "Block secrets before they land",
        detail: "GitHub secret scanning with push protection and a local scanner like gitleaks catch credentials before or at push time.",
        question: "What two layers can stop a credential from reaching the remote?",
      },
    ],
  },
};
