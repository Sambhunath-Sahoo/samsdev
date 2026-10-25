import type { LessonEntry } from "@/types/roadmap";

export const GITOPS_WORKFLOW: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "GitOps workflow",
    slug: "gitops-workflow",
    lesson: {
      summary: "Keep the desired state of your cluster in Git and let an agent such as ArgoCD or Flux pull it into place.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "What GitOps is" },
        { type: "p", text: "GitOps is a way of operating a system where Git holds the **desired state** and an automated agent keeps the real system equal to it. You do not run `kubectl apply` from your laptop or from a CI job. You open a pull request that changes a manifest, it is reviewed and merged, and the agent notices the change and applies it." },
        { type: "p", text: "The community definition (OpenGitOps) lists four principles: the state is declarative, it is versioned and immutable in Git, it is pulled automatically, and it is continuously reconciled." },
        { type: "h2", text: "Push versus pull" },
        { type: "table", head: ["", "Push (classic CI/CD)", "Pull (GitOps)"], rows: [["Who applies", "The pipeline runs `kubectl` or `helm` against the cluster", "An agent inside the cluster reads Git and applies"], ["Cluster credentials", "Stored in the CI system", "Stay inside the cluster"], ["Manual changes", "Stay until the next deploy, unnoticed", "Detected and, if configured, reverted"], ["Rollback", "Re-run an old pipeline", "Revert a commit"]] },
        { type: "h2", text: "ArgoCD and Flux" },
        { type: "p", text: "Both are Kubernetes controllers that continuously compare a Git repository with the cluster. **Argo CD** has a web UI that shows each application, its sync status and a diff, and is built around an `Application` resource. **Flux** is a set of controllers driven by custom resources (`GitRepository`, `Kustomization`, `HelmRelease`) and is mostly used from the CLI and Git." },
        {
          type: "code",
          language: "yaml",
          title: "argocd-application.yaml",
          code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/example/myapp-config.git
    targetRevision: main
    path: k8s/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: myapp
  syncPolicy:
    automated:
      prune: true      # delete what was removed from Git
      selfHeal: true   # revert manual edits in the cluster`,
        },
        { type: "p", text: "With `selfHeal`, someone who `kubectl edit`s a deployment in prod sees the change undone within minutes, because Git says otherwise. With `prune`, a manifest deleted from Git is deleted from the cluster." },
        { type: "h2", text: "A typical flow" },
        { type: "list", ordered: true, items: ["CI builds the app image and pushes it to a registry with an immutable tag, such as the commit SHA.", "CI (or a bot) opens a pull request in the **config repository** that changes the image tag in a manifest or Helm values file.", "A person reviews and merges it.", "The agent sees the new commit and syncs the cluster.", "To roll back, revert the commit. The agent syncs the old state."] },
        { type: "callout", tone: "tip", title: "Separate app code from config", text: "A dedicated config repository keeps deploy changes out of the application history, and lets you grant different people access to each. It also avoids a loop where a CI commit to the app repository triggers another build." },
        { type: "callout", tone: "gotcha", title: "Secrets do not belong in plain Git", text: "Do not commit Kubernetes `Secret` manifests as they are, since base64 is not encryption. Use an approach such as Sealed Secrets, SOPS encryption, or the External Secrets Operator that pulls from a secrets manager." },
        { type: "h2", text: "Where GitOps fits" },
        { type: "p", text: "GitOps works best for Kubernetes workloads, where manifests are declarative and a controller can reconcile them. For cloud resources such as VPCs and databases, Terraform in a pipeline gives you a similar review-and-merge flow. The two combine well: Terraform builds the cluster, and ArgoCD or Flux manages what runs in it." },
      ],
      references: [
        { title: "OpenGitOps: principles and definition", url: "https://opengitops.dev/" },
        { title: "Argo CD documentation", url: "https://argo-cd.readthedocs.io/en/stable/" },
        { title: "Flux concepts (Flux documentation)", url: "https://fluxcd.io/flux/concepts/" },
      ],
    },
  },
};
