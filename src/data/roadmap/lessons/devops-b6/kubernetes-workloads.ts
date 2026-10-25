import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_WORKLOADS: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Workloads: Pods, ReplicaSets, Deployments",
    slug: "kubernetes-workloads",
    lesson: {
      summary: "Pods run containers, ReplicaSets keep a count of them alive, and Deployments manage ReplicaSets so you can update safely.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Pod, ReplicaSet, Deployment" },
        { type: "p", text: "A **Pod** is the smallest unit Kubernetes schedules: one or more containers that share a network address and can share volumes. A **ReplicaSet** makes sure a given number of identical pods exist. A **Deployment** owns ReplicaSets and adds rolling updates and rollback. In practice you write Deployments and almost never touch the other two directly." },
        { type: "code", language: "yaml", title: "deployment.yaml", code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
        - name: web
          image: ghcr.io/example/web:1.4.2
          ports:
            - containerPort: 8080` },
        { type: "p", text: "The `selector` must match the pod template labels. That label link is how the ReplicaSet knows which pods are its own." },
        { type: "h2", text: "What happens when a pod is killed" },
        { type: "p", text: "Delete a pod owned by a ReplicaSet and the controller sees two pods where three are wanted. It creates a replacement, the scheduler places it, and a kubelet starts it. Capacity is reduced only for the time that takes: seconds for a cached image, longer for a pull or a slow startup. A bare pod with no owner is simply gone; nothing recreates it." },
        { type: "code", language: "bash", code: `kubectl get pods -l app=web -w &
kubectl delete pod web-6f7c9d-abcde     # watch a new name appear` },
        { type: "p", text: "The replacement has a new name and a new IP. Never depend on a pod's name or address; that is what Services are for." },
        { type: "h2", text: "Choosing the right controller" },
        { type: "table", head: ["Kind", "Use it for", "Behaviour"], rows: [["Deployment", "Stateless apps and APIs", "Interchangeable pods, random names, rolling updates."], ["StatefulSet", "Databases, queues, anything needing identity", "Stable names (db-0, db-1), ordered start, a PVC per replica, stable DNS."], ["DaemonSet", "Log shippers, node agents", "One pod per node, or per selected node."], ["Job", "One-off tasks such as a migration", "Runs to completion, retries on failure."], ["CronJob", "Scheduled tasks such as a nightly backup", "Creates a Job on a cron schedule."]] },
        { type: "p", text: "PostgreSQL belongs in a StatefulSet because each replica needs its own disk and a predictable identity so replicas can find the primary. A stateless API belongs in a Deployment because any copy can serve any request." },
        { type: "h2", text: "Sidecar containers" },
        { type: "p", text: "A sidecar is a helper container in the same pod as the main one. Because they share a network namespace and optionally volumes, it can ship logs, run a proxy (the service mesh pattern), or refresh certificates without changing the app. Newer Kubernetes versions support native sidecars: an init container with `restartPolicy: Always` that starts before the app and keeps running with it." },
        { type: "code", language: "yaml", title: "native sidecar (excerpt)", code: `spec:
  initContainers:
    - name: log-shipper
      image: example/shipper:2.1
      restartPolicy: Always
  containers:
    - name: web
      image: ghcr.io/example/web:1.4.2` },
        { type: "callout", tone: "gotcha", title: "Do not run bare pods or use :latest", text: "A pod without a controller will not come back after a node failure. And an image tag like `latest` makes rollbacks meaningless because you cannot tell what is running. Pin a version." },
      ],
      references: [
        { title: "Pods", url: "https://kubernetes.io/docs/concepts/workloads/pods/" },
        { title: "Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
        { title: "StatefulSets", url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/" },
        { title: "Sidecar Containers", url: "https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/" },
        { title: "Jobs", url: "https://kubernetes.io/docs/concepts/workloads/controllers/job/" },
      ],
    },
  },
};
