import type { LessonEntry } from "@/types/roadmap";

export const OTHER_CI_TOOLS: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Other CI tools: Jenkins, GitLab CI, CircleCI",
    slug: "other-ci-tools",
    lesson: {
      summary: "How Jenkins, GitLab CI and CircleCI differ from GitHub Actions, and which ideas carry over between all of them.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Jenkins and GitLab CI compared with GitHub Actions" },
        { type: "p", text: "Every CI tool does the same core job: watch a repository, run your steps on a machine, report pass or fail. The differences are in who runs it, how it is configured and how much comes built in. Once you understand one well, the others are mostly renamed concepts." },
        { type: "table", head: ["Tool", "Hosting", "Config file", "Notable trait"], rows: [["GitHub Actions", "Hosted by GitHub, or self-hosted runners", "`.github/workflows/*.yml`", "Huge marketplace of reusable actions; tight GitHub integration"], ["GitLab CI", "GitLab.com or your own GitLab", "`.gitlab-ci.yml`", "Part of the GitLab platform: registry, environments and review apps built in"], ["Jenkins", "You run it yourself", "`Jenkinsfile` (Groovy)", "Very flexible, thousands of plugins, and you maintain the server"], ["CircleCI", "Hosted (self-hosted runners available)", "`.circleci/config.yml`", "Fast hosted execution, reusable packages called orbs"]] },
        { type: "h2", text: "Same ideas, different names" },
        { type: "table", head: ["Concept", "GitHub Actions", "GitLab CI", "Jenkins"], rows: [["A unit of work", "job", "job", "stage / step"], ["Ordering", "`needs:`", "`stages:` and `needs:`", "stages in sequence"], ["Machine", "runner", "runner", "agent / node"], ["Reuse", "reusable workflows, actions", "`include:`, templates", "shared libraries"]] },
        { type: "code", language: "yaml", title: ".gitlab-ci.yml equivalent of a test job", code: `stages: [test, build]

test:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHORT_SHA .` },
        { type: "code", language: "groovy", title: "Jenkinsfile (declarative)", code: `pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t myapp:$GIT_COMMIT .'
      }
    }
  }
}` },
        { type: "h2", text: "How to choose" },
        { type: "list", items: ["Your code is on GitHub and you want the least setup: GitHub Actions.", "You use GitLab for repositories, issues and registry: GitLab CI is already there.", "You have complex, long-lived or on-premise needs and a team to run it: Jenkins.", "You want fast hosted pipelines and have no strong tie to a code host: CircleCI is a reasonable option."] },
        { type: "callout", tone: "gotcha", title: "Jenkins is a server you own", text: "Jenkins is powerful, but updates, plugin compatibility and security patches are your job. Plugins are a frequent source of vulnerabilities and upgrade breakage. Budget real maintenance time before choosing it for a new project." },
        { type: "p", text: "Do not lock your build logic into one tool's syntax. Keep commands in scripts and Dockerfiles, and a migration becomes a rewrite of orchestration rather than of the build." },
      ],
      references: [
        { title: "Jenkins Pipeline", url: "https://www.jenkins.io/doc/book/pipeline/" },
        { title: "GitLab CI/CD documentation", url: "https://docs.gitlab.com/ci/" },
        { title: "CircleCI documentation", url: "https://circleci.com/docs/" },
        { title: "Migrating from Jenkins to GitHub Actions", url: "https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-jenkins-to-github-actions" },
      ],
    },
  },
};
