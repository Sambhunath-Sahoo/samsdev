import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_RESOURCE_REQUESTS_AND_LIMITS: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Resource requests and limits",
    slug: "kubernetes-resource-requests-and-limits",
    lesson: {
      summary: "Requests reserve CPU and memory for scheduling, limits cap what a container may use, and the two together decide who gets throttled or killed.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Two numbers per resource" },
        { type: "p", text: "Each container can declare a **request** and a **limit** for CPU and memory. The request is what the scheduler reserves: a pod only lands on a node with enough unreserved capacity. The limit is a ceiling enforced at runtime. They answer different questions, so confusing them is the most common mistake." },
        { type: "code", language: "yaml", code: `resources:
  requests:
    cpu: 250m        # a quarter of a core
    memory: 512Mi
  limits:
    memory: 512Mi    # cpu limit deliberately omitted` },
        { type: "h2", text: "What happens when a container goes over" },
        { type: "table", head: ["Resource", "Over the limit", "Why"], rows: [["CPU", "Throttled: it runs slower but keeps running", "CPU is compressible; the kernel just gives it less time."], ["Memory", "OOMKilled and restarted", "Memory cannot be taken back, so the process is killed."]] },
        { type: "p", text: "Under node memory pressure, the kubelet evicts pods that use more than they requested first. So requests also decide who survives a crowded node." },
        { type: "h2", text: "QoS classes" },
        { type: "p", text: "Kubernetes derives a quality-of-service class from what you set. It is a result, not a field you choose." },
        { type: "list", items: ["**Guaranteed**: every container has requests equal to limits for both CPU and memory. Last to be evicted.", "**Burstable**: at least one request or limit is set, but not equal. The usual class.", "**BestEffort**: nothing set. First to be evicted. Avoid it for anything you care about."] },
        { type: "h2", text: "Setting sensible values" },
        { type: "p", text: "Measure first. `kubectl top pod` (needs metrics-server) and your Prometheus graphs show real use. Set the memory request near typical use and the memory limit with headroom, often equal to the request for predictable behaviour. For a JVM, give the heap a clear share of the limit (for example `-XX:MaxRAMPercentage=75`) so non-heap memory does not push it over." },
        { type: "p", text: "Many teams set CPU requests but skip CPU limits, because throttling can hurt latency even when the node has idle CPU. Others keep them to protect neighbours. Both are defensible; what matters is that you chose on purpose." },
        { type: "code", language: "bash", code: `kubectl top pod -n shop
kubectl describe pod web-6f7c9d-abcde | grep -A3 "Last State"   # Reason: OOMKilled
kubectl describe node worker-1 | grep -A8 "Allocated resources"` },
        { type: "callout", tone: "gotcha", title: "Requests drive autoscaling and bills", text: "The HPA computes CPU utilisation against the request, so a request that is too high makes autoscaling react late. Over-requesting also strands capacity: nodes look full while actual use is low, and you pay for extra nodes. Use a LimitRange and ResourceQuota per namespace to set defaults and caps." },
      ],
      references: [
        { title: "Resource Management for Pods and Containers", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" },
        { title: "Node-pressure Eviction", url: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/" },
        { title: "Horizontal Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/" },
      ],
    },
  },
};
