import type { LessonEntry } from "@/types/roadmap";

export const PIPELINE_AS_CODE: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Pipeline as code",
    slug: "pipeline-as-code",
    lesson: {
      summary: "Keep the pipeline definition in the repository so it is reviewed, versioned and reproducible like any other code.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "What it means" },
        { type: "p", text: "Older CI servers were configured by clicking through a web UI: add a build step, tick a box, paste a command. The result lived only on the server. If the server died or someone changed a setting, nobody knew what ran or why. **Pipeline as code** means the definition is a text file (`.github/workflows/ci.yml`, `.gitlab-ci.yml`, `Jenkinsfile`) committed next to the code it builds." },
        { type: "h2", text: "Why it is worth it" },
        { type: "list", items: ["**Review**: a pipeline change goes through a pull request like any other change.", "**History**: `git log` and `git blame` tell you who changed the deploy step and when, and you can revert it.", "**Branch-specific**: a branch carries the pipeline version that matches its code, so changing the build does not break old branches.", "**Reproducible**: a new repository or a new CI account starts from a file, not from memory.", "**Testable**: you can try pipeline edits on a branch before they reach main."] },
        { type: "h2", text: "Keeping it maintainable" },
        { type: "p", text: "A pipeline file grows. When commands multiply, move logic into scripts in the repo and keep the YAML as orchestration: which job, which runner, which order. A script can be run on a laptop; a 40-line `run:` block cannot be debugged locally." },
        { type: "code", language: "yaml", title: ".github/workflows/ci.yml calling a repo script", code: `jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/ci.sh` },
        { type: "code", language: "bash", title: "scripts/ci.sh", code: `#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run lint
npm test
npm run build` },
        { type: "p", text: "For repetition across repositories, share the definition instead of copying it. GitHub offers reusable workflows (`on: workflow_call`) and composite actions; GitLab has `include:`; Jenkins has shared libraries. Fix a mistake once and every project gets it." },
        { type: "callout", tone: "gotcha", title: "The pipeline is code with privileges", text: "Whoever can edit the workflow can run commands with the pipeline's credentials. Protect the main branch, require review for changes under `.github/`, and use CODEOWNERS for it. A pipeline file is part of your attack surface." },
        { type: "p", text: "Declarative files also tempt people to encode programming logic in YAML with long conditionals. If a condition needs three lines of expressions, it probably belongs in a script that can be tested." },
      ],
      references: [
        { title: "Workflow syntax for GitHub Actions", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax" },
        { title: "Using a Jenkinsfile", url: "https://www.jenkins.io/doc/book/pipeline/jenkinsfile/" },
        { title: "CI/CD YAML syntax reference (GitLab)", url: "https://docs.gitlab.com/ci/yaml/" },
      ],
    },
    points: [
      { id: "devops.pipeline-as-code.versioned", title: "The pipeline lives in git", detail: "A workflow file committed with the code gets review, history and revert. Each branch carries the pipeline version that fits its code.", question: "What can you do with a pipeline in git that you cannot with one configured in a UI?" },
      { id: "devops.pipeline-as-code.scripts", title: "Orchestration in YAML, logic in scripts", detail: "Keep YAML for jobs and ordering, and move real commands into repo scripts you can run locally and test.", question: "Why is a script called from `run:` easier to debug than a long inline block?" },
      { id: "devops.pipeline-as-code.reuse", title: "Share, do not copy", detail: "Reusable workflows, composite actions, GitLab `include:` and Jenkins shared libraries let many repositories use one maintained definition.", question: "What problem do reusable workflows solve across ten repositories?" },
      { id: "devops.pipeline-as-code.protect", title: "Protect the pipeline file", detail: "Anyone who can change the workflow can run code with its credentials, so review changes and use CODEOWNERS on the workflow directory.", question: "Why should changes to `.github/workflows` need review?" },
    ],
  },
};
