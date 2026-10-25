import type { LessonEntry } from "@/types/roadmap";

export const IMAGE_TAGGING_AND_RELEASES: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Image tagging and releases",
    slug: "image-tagging-and-releases",
    lesson: {
      summary: "Tag images so every running container maps back to one commit, and treat `latest` as a convenience, never as a deploy target.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "A tag is a movable label" },
        { type: "p", text: "An image tag such as `myapp:1.4.0` is a pointer to an image digest, and pointers can be moved. Push a different image under the same tag and the tag now means something else. The digest (`sha256:...`) is the only name that is guaranteed to refer to the same bytes forever." },
        { type: "p", text: "That matters in operations. If production runs `myapp:latest`, you cannot answer \"which commit is live?\", you cannot roll back to \"the previous latest\", and two servers pulling at different times can run different code." },
        { type: "h2", text: "Tags that help" },
        { type: "table", head: ["Tag", "Example", "Use"], rows: [["Commit SHA", "`myapp:3f9c2ab`", "Immutable link to source. Deploy this."], ["Version", "`myapp:1.4.0`", "Human-readable release, from a git tag"], ["Branch", "`myapp:main`", "Moving pointer for staging or previews"], ["`latest`", "`myapp:latest`", "Whatever was pushed last. Fine for quick local runs"]] },
        { type: "p", text: "The usual pattern is to tag every build with the commit SHA, and add the version tag only when you cut a release. Version numbers follow semantic versioning: MAJOR for breaking changes, MINOR for compatible features, PATCH for fixes." },
        { type: "h2", text: "Automating it" },
        { type: "p", text: "The `docker/metadata-action` generates tags and labels from the git event, and `docker/build-push-action` builds and pushes them. Pushing a git tag like `v1.4.0` then produces the version tag without anyone typing it." },
        { type: "code", language: "yaml", title: "Build and push on tags and main", code: `on:
  push:
    branches: [main]
    tags: ["v*"]

jobs:
  image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=sha
            type=semver,pattern={{version}}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}` },
        { type: "h2", text: "Releases" },
        { type: "p", text: "A release is a git tag plus notes. Tag the commit (`git tag v1.4.0 && git push --tags`), let the pipeline build the version-tagged image from that exact commit, and create a GitHub Release with the changelog. To roll back, redeploy the previous version or SHA tag; nothing needs rebuilding." },
        { type: "callout", tone: "gotcha", title: "Re-pushing a version tag", text: "Do not overwrite `v1.4.0` after it has shipped, even to fix a typo. Cached nodes will keep the old image and you will debug a ghost. Ship `v1.4.1`. Registries such as ECR can enforce this with immutable tags." },
      ],
      references: [
        { title: "Docker Build: Manage tags and labels with GitHub Actions", url: "https://docs.docker.com/build/ci/github-actions/manage-tags-labels/" },
        { title: "Docker Build: GitHub Actions", url: "https://docs.docker.com/build/ci/github-actions/" },
        { title: "Semantic Versioning 2.0.0", url: "https://semver.org/" },
        { title: "Amazon ECR image tag mutability", url: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" },
      ],
    },
    points: [
      { id: "devops.image-tagging.sha-tags", title: "Deploy by commit SHA", detail: "Tag each build with the git commit SHA so any running container maps to one commit. Deploy that tag, not `latest`.", question: "How do you find the source code behind a running container?" },
      { id: "devops.image-tagging.latest-trap", title: "latest is not a version", detail: "`latest` is only the most recent push. It makes rollbacks and audits impossible and lets servers drift when they pull at different times.", question: "Why does deploying `latest` make rollback hard?" },
      { id: "devops.image-tagging.semver-releases", title: "Version tags come from git tags", detail: "Push a git tag like `v1.4.0` and let the pipeline derive the image version from it. Never overwrite a published version tag; ship a new patch instead.", question: "What should you do when you notice a bug in `v1.4.0` after release?" },
      { id: "devops.image-tagging.digest", title: "Digests are the stable name", detail: "A tag can be repointed, but a digest identifies exact content. Pinning by digest or using immutable tags guarantees the same image everywhere.", question: "What does a digest guarantee that a tag does not?" },
    ],
  },
};
