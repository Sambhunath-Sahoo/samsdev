import type { LessonEntry } from "@/types/roadmap";

export const IMAGE_SCANNING_WITH_TRIVY: LessonEntry = {
  track: "devops",
  section: "Containers",
  subsection: {
    title: "Image scanning with Trivy",
    slug: "image-scanning-with-trivy",
    lesson: {
      summary: "Trivy compares what is inside an image with a vulnerability database, and a CI step can fail the build when something serious is found.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "What Trivy checks" },
        { type: "p", text: "Trivy is an open-source scanner. Pointed at an image, it unpacks the layers, lists the operating system packages and language dependencies it finds (apt, apk, npm, Maven, pip and more), and matches each name and version against a database of known vulnerabilities (CVEs). The output is a list: package, installed version, the CVE, its severity, and the version that fixes it." },
        { type: "p", text: "It can also scan a project directory (`trivy fs`), look for committed secrets, and check Dockerfiles and Terraform for misconfiguration (`trivy config`). This lesson is about the image scan." },
        { type: "h2", text: "Running it" },
        {
          type: "code",
          language: "bash",
          code: `# full report for an image
trivy image myapp:1.0

# only serious findings that already have a fix available
trivy image --severity HIGH,CRITICAL --ignore-unfixed myapp:1.0

# CI mode: exit code 1 if anything matches, so the pipeline fails
trivy image --severity CRITICAL --ignore-unfixed --exit-code 1 myapp:1.0`,
        },
        { type: "p", text: "The first run downloads the vulnerability database, so it takes a moment. Later runs reuse the cache. In CI, cache that directory or the job will download it on every run." },
        { type: "h2", text: "Reading the result" },
        { type: "list", items: ["**Severity** is a generic rating (low, medium, high, critical). It does not know whether your app calls the vulnerable code.", "**Fixed version** blank means no patch exists yet. You can only switch base image or accept the risk.", "**Target** tells you where it was found: the OS layer points at your base image, a jar or `package-lock.json` points at your own dependencies."] },
        { type: "p", text: "Most findings in a fresh image come from the base image. Moving from a full `debian` image to a slim or distroless one usually removes a large share of them, because the packages are simply not there. This is the same fix that makes the image smaller." },
        { type: "h2", text: "Handling false alarms" },
        { type: "p", text: "Some CVEs do not apply to you, for example a flaw in a library feature you never enable. List the ID in a `.trivyignore` file, one per line, with a comment on why and a date to revisit. An ignore without a reason will outlive the person who wrote it." },
        {
          type: "code",
          language: "text",
          title: ".trivyignore",
          code: `# affects the XML parser only, we never parse untrusted XML. Recheck 2026-12.
CVE-2024-12345`,
        },
        { type: "callout", tone: "gotcha", title: "A clean scan is a snapshot", text: "The database changes daily. An image that passed on Monday can fail on Friday with no change from you. Scan on every build and also on a schedule for images already deployed, and rebuild on a fresh base image regularly." },
        { type: "p", text: "Common mistakes: failing the build on every severity so the team learns to bypass the check, never failing it at all so the report is ignored, and scanning only the final image while a vulnerable package sits in a build stage that never ships (which is harmless, so do not chase it)." },
      ],
      references: [
        { title: "Trivy documentation", url: "https://trivy.dev/latest/docs/" },
        { title: "Trivy: container image scanning", url: "https://trivy.dev/latest/docs/target/container_image/" },
        { title: "Trivy: filtering results", url: "https://trivy.dev/latest/docs/configuration/filtering/" },
      ],
    },
    points: [
      { id: "devops.image-scanning-with-trivy.what-it-finds", title: "What an image scan reports", detail: "Trivy lists OS packages and language dependencies inside the image and matches them to known CVEs. Each row shows the installed version, the severity and the fixed version.", question: "What does a blank fixed-version column tell you?" },
      { id: "devops.image-scanning-with-trivy.fail-the-build", title: "Failing CI on serious findings", detail: "`--exit-code 1` with `--severity` and `--ignore-unfixed` turns the scan into a gate that only blocks on problems you can act on.", question: "Why filter with --ignore-unfixed before failing a build?" },
      { id: "devops.image-scanning-with-trivy.ignore-with-reason", title: "Ignore with a reason and a date", detail: "A `.trivyignore` entry should say why the CVE does not apply and when to recheck. Otherwise ignored findings are forgotten.", question: "What two things belong in the comment above an ignored CVE?" },
    ],
  },
};
