import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_HELM_AND_DEBUGGING: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Helm and debugging",
    slug: "kubernetes-helm-and-debugging",
    lesson: {
      summary: "Helm packages manifests as versioned, configurable charts, and a short kubectl routine finds out why a pod is failing.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Helm charts" },
        { type: "p", text: "Raw YAML gets repetitive: the same Deployment, Service and Ingress with different image tags, replica counts and hostnames per environment. **Helm** is the package manager for Kubernetes. A **chart** is a folder of templated manifests plus a `values.yaml` of defaults. Installing a chart with chosen values creates a named **release**, and Helm records each change as a numbered revision." },
        { type: "code", language: "text", title: "chart layout", code: `web/
  Chart.yaml          # name, version, appVersion
  values.yaml         # defaults
  templates/
    deployment.yaml   # Go templates that read .Values
    service.yaml
    _helpers.tpl` },
        { type: "code", language: "yaml", title: "templates/deployment.yaml (excerpt)", code: `spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"` },
        { type: "code", language: "bash", code: `helm lint ./web
helm template web ./web -f values-prod.yaml     # render only, inspect the YAML
helm install web ./web -n shop --create-namespace -f values-prod.yaml
helm upgrade web ./web -n shop --set image.tag=1.5.0
helm history web -n shop
helm rollback web 1 -n shop                     # back to revision 1` },
        { type: "p", text: "One chart serves dev, staging and production through different values files. Use `helm template` and `helm lint` in CI to catch template mistakes before they reach a cluster." },
        { type: "callout", tone: "tip", title: "Use upgrade --install", text: "`helm upgrade --install web ./web` installs if the release is missing and upgrades otherwise, which makes a CI deploy step idempotent." },
        { type: "h2", text: "Debugging pods and CrashLoopBackOff" },
        { type: "p", text: "Start with the status, then follow the evidence. The pod phase and the reason tell you which layer is failing." },
        { type: "table", head: ["Status", "Usual cause", "Look at"], rows: [["Pending", "No node fits: not enough CPU or memory, taints, unbound PVC", "`describe pod` Events"], ["ImagePullBackOff", "Wrong tag, private registry without pull secret", "`describe pod` Events"], ["CrashLoopBackOff", "The container starts and exits repeatedly", "`logs --previous`, exit code"], ["Running but not Ready", "Readiness probe failing", "`describe pod`, probe path and port"], ["OOMKilled", "Exceeded its memory limit", "`describe pod` last state"]] },
        { type: "code", language: "bash", title: "The routine", code: `kubectl get pods
kubectl describe pod web-6f7c9d-abcde      # Events at the bottom are the best clue
kubectl logs web-6f7c9d-abcde --previous   # logs of the crashed attempt
kubectl get events --sort-by=.lastTimestamp
kubectl exec -it web-6f7c9d-abcde -- sh    # poke around inside
kubectl debug -it web-6f7c9d-abcde --image=busybox --target=web` },
        { type: "p", text: "CrashLoopBackOff is not an error itself. It means the container keeps exiting and the kubelet waits longer between restarts (10 seconds, doubling up to five minutes). The cause is in the exit code and the previous logs: exit code 1 usually an application error such as a bad config or unreachable database, 137 a kill signal (often out of memory), 143 a SIGTERM." },
        { type: "callout", tone: "gotcha", title: "Plain kubectl logs shows the new container", text: "After a restart, `kubectl logs` shows the fresh container, often empty. The failure you want is in `--previous`." },
      ],
      references: [
        { title: "Charts", url: "https://helm.sh/docs/topics/charts/" },
        { title: "Using Helm", url: "https://helm.sh/docs/intro/using_helm/" },
        { title: "Debug Pods", url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/" },
        { title: "Determine the Reason for Pod Failure", url: "https://kubernetes.io/docs/tasks/debug/debug-application/determine-reason-pod-failure/" },
      ],
    },
  },
};
