import type { LessonEntry } from "@/types/roadmap";

export const TAGS_AND_RELEASES: LessonEntry = {
  track: "devops",
  section: "Git and collaboration",
  subsection: {
    title: "Tags and releases",
    slug: "tags-and-releases",
    lesson: {
      summary: "Mark exact versions with git tags, number them with semantic versioning, and publish them as releases that pipelines can build from.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What a tag is" },
        { type: "p", text: "A branch moves forward with every commit. A **tag** is a fixed label on one specific commit and does not move. That makes it the right way to say \"this commit is version 1.4.0\", so you can rebuild exactly that code months later, or roll back to it." },
        { type: "p", text: "Git has two kinds. A **lightweight** tag is just a name pointing at a commit. An **annotated** tag is a full object with a tagger, date and message. Use annotated tags for releases; they carry the context and can be signed." },
        {
          type: "code",
          language: "bash",
          code: `git tag -a v1.4.0 -m "Release 1.4.0"      # annotated tag on the current commit
git tag -a v1.3.1 9fceb02 -m "Hotfix"      # tag an older commit
git push origin v1.4.0                     # tags are not pushed automatically
git tag -l "v1.*"                          # list matching tags
git show v1.4.0                            # tag details and the commit
git checkout v1.4.0                        # inspect that exact version
git tag -d v1.4.0 && git push origin --delete v1.4.0   # remove (avoid for published tags)`,
        },
        { type: "h2", text: "Semantic versioning" },
        { type: "p", text: "**Semantic versioning** numbers releases as `MAJOR.MINOR.PATCH`. The number tells consumers what to expect from an upgrade." },
        {
          type: "table",
          head: ["Part", "Increment when", "Example"],
          rows: [
            ["MAJOR", "You make a breaking change", "`1.4.2` to `2.0.0`"],
            ["MINOR", "You add functionality, backwards compatible", "`1.4.2` to `1.5.0`"],
            ["PATCH", "You fix a bug, backwards compatible", "`1.4.2` to `1.4.3`"],
          ],
        },
        { type: "p", text: "Pre-release versions add a suffix such as `2.0.0-rc.1`, which sorts before `2.0.0`. Versions below `1.0.0` are treated as unstable, where anything may change. For a service rather than a library, \"breaking\" means a change to an API contract your clients depend on." },
        { type: "h2", text: "From tag to release" },
        { type: "p", text: "A GitHub **release** is built on a tag. It adds release notes and optional attached files such as binaries. The useful part for operations: pushing a tag can trigger a pipeline that builds the image and tags it with the same version, so the version in git, the container registry and the running service all match." },
        {
          type: "code",
          language: "bash",
          code: `gh release create v1.4.0 --generate-notes     # release with auto-generated notes
git describe --tags --always                   # e.g. v1.4.0-12-g3a1f9c2 on a build`,
        },
        { type: "callout", tone: "gotcha", title: "Never move or reuse a published tag", text: "If someone already pulled `v1.4.0`, deleting it and re-tagging a different commit leaves people with two different meanings of the same version, and registries or caches may keep the old one. If a release is wrong, ship `v1.4.1`." },
        { type: "p", text: "Common mistakes: forgetting `git push origin <tag>` so the tag exists only locally, using lightweight tags for releases, bumping MAJOR for every release regardless of compatibility, and tagging a commit that has not passed CI." },
      ],
      references: [
        { title: "Git - Tagging", url: "https://git-scm.com/book/en/v2/Git-Basics-Tagging" },
        { title: "Semantic Versioning 2.0.0", url: "https://semver.org/" },
        { title: "Managing releases in a repository - GitHub Docs", url: "https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository" },
      ],
    },
  },
};
