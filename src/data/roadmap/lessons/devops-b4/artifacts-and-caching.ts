import type { LessonEntry } from "@/types/roadmap";

export const ARTIFACTS_AND_CACHING: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Artifacts and caching in pipelines",
    slug: "artifacts-and-caching-in-pipelines",
    lesson: {
      summary: "Caches make pipelines faster by reusing downloads; artifacts pass real build outputs between jobs and keep them afterwards. They are not the same thing.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Two tools, two jobs" },
        { type: "p", text: "Every job on a hosted runner starts on an empty machine. That is good for reproducibility and bad for speed: each run downloads the same npm packages again. There are two ways to carry data across runs or jobs, and they solve different problems." },
        { type: "table", head: ["", "Cache", "Artifact"], rows: [["Purpose", "Speed up repeated work", "Hand over or keep a result"], ["Contents", "Dependencies, build tool caches", "Test reports, binaries, bundles, coverage"], ["Guaranteed present?", "No, a miss must still work", "Yes, until its retention expires"], ["Scope", "Shared across runs and branches by key", "Tied to one workflow run"], ["Action", "`actions/cache`, or `cache:` in setup actions", "`actions/upload-artifact`, `download-artifact`"]] },
        { type: "h2", text: "Caching dependencies" },
        { type: "p", text: "A cache entry is stored under a **key**. If the key matches, the files are restored; if not, the job runs without them and saves a new entry at the end. The trick is a key that changes exactly when the contents should change: a hash of the lockfile." },
        { type: "code", language: "yaml", title: "Explicit cache of the npm download cache", code: `      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            npm-\${{ runner.os }}-
      - run: npm ci` },
        { type: "p", text: "`restore-keys` is a fallback prefix: on a lockfile change you still restore the previous cache and only download the difference. For common ecosystems `actions/setup-node` with `cache: npm` does all of this in one line." },
        { type: "h2", text: "Passing artifacts between jobs" },
        { type: "p", text: "Build once in one job, upload the output, and download it in the deploy job. This is how you guarantee the thing you tested is the thing you ship." },
        { type: "code", language: "yaml", code: `  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: web-dist
          path: dist/
          retention-days: 7

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: web-dist` },
        { type: "callout", tone: "gotcha", title: "Do not cache secrets or trust the cache blindly", text: "Anything under the cached path is readable by later workflow runs that can match the key, and a poisoned entry would be restored into your build. Cache dependencies only, never credentials, and keep release builds from depending on a cache hit for correctness." },
        { type: "list", items: ["Cache storage has a size limit per repository and old entries are evicted, so a miss is normal.", "Set a short `retention-days` on artifacts; they count against storage.", "For Docker images, use the registry or BuildKit cache rather than uploading image tarballs as artifacts."] },
      ],
      references: [
        { title: "Dependency caching reference", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching" },
        { title: "Store and share data with workflow artifacts", url: "https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow" },
        { title: "Manage GitHub Actions caches", url: "https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manage-caches" },
      ],
    },
    points: [
      { id: "devops.pipeline-artifacts.cache-vs-artifact", title: "Cache vs artifact", detail: "A cache speeds up repeated work and may be missing. An artifact is a result you pass to another job or keep for download, and it is guaranteed until it expires.", question: "Which would you use to pass a built `dist/` folder to a deploy job?" },
      { id: "devops.pipeline-artifacts.lockfile-key", title: "Key the cache on the lockfile", detail: "Hash the lockfile in the cache key so the cache is replaced exactly when dependencies change. `restore-keys` allows partial reuse of the previous entry.", question: "What happens to the cache when `package-lock.json` changes?" },
      { id: "devops.pipeline-artifacts.build-once", title: "Build once, ship the artifact", detail: "Upload the build output from one job and download it in later jobs so tests and deploy use identical files.", question: "Why is rebuilding in the deploy job risky?" },
      { id: "devops.pipeline-artifacts.retention", title: "Retention and limits", detail: "Artifacts and caches consume storage and expire. Set short retention for artifacts and never rely on a cache hit for correctness.", question: "Why must a pipeline still pass on a cache miss?" },
    ],
  },
};
