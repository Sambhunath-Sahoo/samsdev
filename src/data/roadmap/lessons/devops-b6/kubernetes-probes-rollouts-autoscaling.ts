import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_PROBES_ROLLOUTS_AUTOSCALING: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Probes, rollouts and autoscaling",
    slug: "kubernetes-probes-rollouts-autoscaling",
    lesson: {
      summary: "Probes tell Kubernetes when a pod is alive and ready, which makes rolling updates safe and autoscaling meaningful.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Three probes, three questions" },
        { type: "table", head: ["Probe", "Question", "On failure"], rows: [["Startup", "Has the app finished booting?", "Keeps other probes disabled; restarts the container if it never passes."], ["Liveness", "Is it stuck beyond recovery?", "Kubelet restarts the container."], ["Readiness", "Can it take traffic right now?", "Pod is removed from Service endpoints; no restart."]] },
        { type: "p", text: "A JVM app like Spring Boot can take 20 to 60 seconds to start. Use a startup probe for that window so the liveness probe does not kill it mid-boot. Keep liveness checks cheap and local; do not make them depend on the database, or a database blip restarts every pod at once." },
        { type: "code", language: "yaml", title: "probes for a Spring Boot container", code: `startupProbe:
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  periodSeconds: 5
  failureThreshold: 30        # up to 150 s to boot
livenessProbe:
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  periodSeconds: 10
readinessProbe:
  httpGet: { path: /actuator/health/readiness, port: 8080 }
  periodSeconds: 5` },
        { type: "h2", text: "Rolling updates and rollbacks" },
        { type: "p", text: "Change the image in a Deployment and it creates a new ReplicaSet, scaling it up while the old one scales down. Two knobs control the pace: `maxSurge` (extra pods allowed above the desired count) and `maxUnavailable` (pods allowed to be missing). Defaults are 25% each." },
        { type: "code", language: "bash", code: `kubectl set image deployment/web web=ghcr.io/example/web:1.5.0
kubectl rollout status deployment/web
kubectl rollout history deployment/web
kubectl rollout undo deployment/web          # back to the previous ReplicaSet` },
        { type: "h2", text: "Zero-downtime deploys" },
        { type: "p", text: "A rolling update is only as safe as its readiness probe: new pods receive traffic only once ready. To avoid dropped requests, combine these:" },
        { type: "list", items: ["`maxUnavailable: 0` with `maxSurge: 1` so capacity never drops during a rollout.", "A real readiness probe, so traffic is not sent to a booting pod.", "A graceful shutdown: handle SIGTERM, finish in-flight requests, and set `terminationGracePeriodSeconds` high enough. A short `preStop` sleep (a few seconds) covers the delay before endpoint removal reaches every proxy.", "A PodDisruptionBudget so node drains do not take down too many replicas at once."] },
        { type: "h2", text: "Horizontal and Vertical Pod Autoscaler" },
        { type: "p", text: "The **HPA** changes the replica count based on metrics, usually CPU utilisation measured against the container's CPU *request*. It needs metrics-server installed and requests set on the pods." },
        { type: "code", language: "yaml", title: "hpa.yaml", code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }` },
        { type: "p", text: "The **VPA** instead adjusts the CPU and memory requests of pods. It is an add-on, not built in, and in its default mode it applies new values by evicting and recreating pods. Do not point HPA and VPA at the same CPU metric for one workload; they will fight. A common use is VPA in recommendation-only mode to tune requests." },
        { type: "callout", tone: "gotcha", title: "HPA shows <unknown>", text: "If `kubectl get hpa` shows `<unknown>/70%`, either metrics-server is missing or the container has no CPU request, so utilisation cannot be computed." },
      ],
      references: [
        { title: "Configure Liveness, Readiness and Startup Probes", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" },
        { title: "Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
        { title: "Horizontal Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/" },
        { title: "Vertical Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/" },
        { title: "Pod Lifecycle", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/" },
      ],
    },
  },
};
