import type { RoadmapSubsection } from "@/types/roadmap";
import { point, withPoints } from "./point";

const S = "kubernetes";

export const K8S_ARCHITECTURE = withPoints("Architecture: control plane and nodes", [
  point(
    S,
    "control-plane-and-nodes",
    "Control plane and worker node components",
    "The control plane runs the API server (the front door for every request), etcd (the cluster's datastore), the scheduler (picks a node for each new pod) and the controller manager (runs control loops that drive actual state toward desired state). Each worker node runs the kubelet, which starts and monitors pods through the container runtime, and kube-proxy, which maintains the networking rules for Services.",
    "Which component decides where a pod runs, and which one actually starts its containers?",
  ),
  point(
    S,
    "etcd-role",
    "The role of etcd",
    "etcd is a consistent, distributed key-value store that holds all cluster state: objects, configuration and Secrets. Only the API server talks to it, and it uses the Raft protocol, so it needs a majority of members (quorum) to accept writes. Production clusters run three or five members and take regular snapshots.",
    "Why do production etcd clusters use an odd number of members?",
  ),
  point(
    S,
    "etcd-failure",
    "What happens if etcd goes down",
    "Without etcd the API server cannot read or write state, so you cannot create, change or schedule anything and controllers stop reconciling. Pods already running on nodes keep running, because the kubelet and container runtime work from what they already have, but nothing self-heals. Recovery means restoring quorum or restoring from a snapshot.",
    "etcd is unreachable. Will your running application keep serving traffic, and what will not work?",
  ),
  point(
    S,
    "kubectl-apply-flow",
    "What happens when you run kubectl apply",
    "kubectl sends the manifest to the API server, which authenticates, authorises and validates it, runs admission controllers and stores the desired state in etcd. Controllers watching the API react: for a Deployment, a ReplicaSet is created, which creates pods. The scheduler assigns each pod to a node, and that node's kubelet pulls the image and starts the containers. apply also records the last applied configuration so later runs can compute a diff.",
    "Trace a kubectl apply of a new Deployment from your laptop to a running container.",
  ),
]);

export const K8S_WORKLOADS = withPoints("Workloads: Pods, ReplicaSets, Deployments", [
  point(
    S,
    "pod-killed-recovery",
    "What happens when a pod is killed",
    "If a pod is owned by a ReplicaSet (through a Deployment), the ReplicaSet controller sees fewer pods than desired and creates a replacement, which the scheduler places on a node. A bare pod with no controller is not recreated. If a whole node fails, its pods are rescheduled elsewhere after the node is marked unreachable and the eviction timeout passes.",
    "You delete a pod from a Deployment with three replicas. What happens, and how long is capacity reduced?",
  ),
  point(
    S,
    "deployment-vs-statefulset",
    "Deployment vs StatefulSet",
    "A Deployment manages interchangeable, stateless pods that get random names and can start in any order. A StatefulSet gives each pod a stable name and ordinal (db-0, db-1), stable network identity through a headless Service, and its own persistent volume from volumeClaimTemplates, with ordered startup and shutdown. Use it for databases and other systems that need stable identity and storage.",
    "Why would you run PostgreSQL as a StatefulSet and the API as a Deployment?",
  ),
  point(
    S,
    "daemonset-job-cronjob",
    "DaemonSet, Job and CronJob",
    "A DaemonSet runs one pod on every node (or a selected set), which suits log collectors and node agents. A Job runs pods to completion, retrying on failure, for one-off tasks such as a migration. A CronJob creates Jobs on a schedule, for backups and periodic reports.",
    "Which workload type runs a log shipper on every node, and which runs a nightly backup?",
  ),
  point(
    S,
    "sidecar-container",
    "Sidecar containers",
    "A sidecar is an extra container in the same pod as the main app. It shares the pod's network namespace and can share volumes, so it can add behaviour without changing the app: log shipping, a proxy such as Envoy in a service mesh, certificate refresh or config reload. Recent Kubernetes versions support native sidecars, declared as init containers that keep running for the pod's lifetime.",
    "Give two reasons to put log shipping in a sidecar instead of in the application code.",
  ),
]);

export const K8S_SERVICES = withPoints("Services and Ingress", [
  point(
    S,
    "service-types",
    "Service types: ClusterIP, NodePort, LoadBalancer",
    "A Service gives a changing set of pods one stable virtual IP and DNS name. ClusterIP is reachable only inside the cluster and is the default. NodePort also opens the same port on every node, and LoadBalancer asks the cloud provider for an external load balancer in front of it. Ingress adds HTTP routing by host and path on top of Services.",
    "How would you expose five internal HTTP services through one public load balancer?",
  ),
  point(
    S,
    "service-discovery",
    "How service discovery works",
    "Each Service gets a DNS name such as orders.shop.svc.cluster.local, served by the cluster DNS (CoreDNS), so pods find each other by name instead of IP. The Service selects pods by label, and the endpoints list tracks which are ready. kube-proxy then load balances traffic sent to the Service IP across those endpoints.",
    "A pod calls http://orders from the same namespace. How is that name resolved and where does the request land?",
  ),
]);

export const K8S_CONFIG = withPoints("Config and secrets", [
  point(
    S,
    "configmap-vs-secret",
    "ConfigMap vs Secret",
    "A ConfigMap holds non-sensitive configuration and a Secret holds sensitive values such as passwords and tokens. Both can be injected as environment variables or mounted as files. Secret values are only base64 encoded, not encrypted, so turn on encryption at rest, restrict access with RBAC, or use an external secrets manager.",
    "Is a Kubernetes Secret encrypted by default? What would you add to protect it?",
  ),
]);

export const K8S_PROBES = withPoints("Probes, rollouts and autoscaling", [
  point(
    S,
    "liveness-readiness-startup",
    "Liveness, readiness and startup probes",
    "A liveness probe tells the kubelet when to restart a container that is stuck. A readiness probe decides whether the pod receives Service traffic, and failing it removes the pod from endpoints without restarting it. A startup probe holds off the other two while a slow app boots, so it is not killed too early.",
    "An app needs 90 seconds to warm up. Which probe do you add so it is not restarted during boot?",
  ),
  point(
    S,
    "rolling-updates",
    "Rolling updates and rollbacks",
    "A Deployment replaces pods gradually by creating a new ReplicaSet and scaling it up while scaling the old one down, governed by maxSurge and maxUnavailable. Readiness probes make sure new pods only get traffic once healthy. kubectl rollout status watches progress and kubectl rollout undo returns to the previous revision.",
    "What do maxSurge and maxUnavailable control, and what do you set for no capacity loss?",
  ),
  point(
    S,
    "zero-downtime-kubernetes",
    "Zero-downtime deploys on Kubernetes",
    "Run several replicas, use a readiness probe and set maxUnavailable to 0 so capacity never drops. Add a preStop delay and a sufficient termination grace period so in-flight requests finish and load balancers stop sending traffic before the container exits, and handle SIGTERM in the app. A PodDisruptionBudget protects availability during node drains.",
    "Users see 502s during every rollout although probes pass. What shutdown settings do you check?",
  ),
  point(
    S,
    "hpa",
    "Horizontal Pod Autoscaler",
    "The HPA is a control loop that periodically compares a metric, usually CPU utilisation relative to the pods' requests, with a target and adjusts the replica count between a minimum and maximum. The metrics server must be installed, and CPU based scaling needs resource requests to be set. Scale-up and scale-down are damped so replicas do not flap.",
    "Why does CPU based HPA not work if the pods have no resource requests?",
  ),
  point(
    S,
    "vpa",
    "Vertical Pod Autoscaler",
    "The VPA observes real usage and recommends or applies different CPU and memory requests for a workload, rather than changing the number of replicas. It helps right-size pods, but applying changes usually restarts them. Do not let HPA and VPA both act on the same CPU or memory metric.",
    "When would you choose VPA over HPA?",
  ),
]);

export const K8S_HELM = withPoints("Helm and debugging", [
  point(
    S,
    "helm-chart",
    "Helm charts",
    "Helm is the package manager for Kubernetes. A chart bundles templated manifests with a values.yaml of defaults, and installing it with chosen values creates a named release. helm upgrade changes a release and helm rollback returns to an earlier revision, so one chart serves dev, staging and production with different values.",
    "How does one Helm chart deploy the same app with different replica counts per environment?",
  ),
  point(
    S,
    "debugging-pods",
    "Debugging pods and CrashLoopBackOff",
    "Start with kubectl get pods and kubectl describe pod to read events, then kubectl logs (add --previous for a crashed container) and kubectl exec for a shell inside. CrashLoopBackOff means the container keeps exiting and being restarted with growing back-off, often from a bad command, missing config or a failing probe. ImagePullBackOff, Pending and OOMKilled each point to different causes.",
    "A pod is in CrashLoopBackOff. List the first three commands you run.",
  ),
]);

export const K8S_NEW_TOPICS: readonly RoadmapSubsection[] = [
  withPoints("Storage: PV, PVC and StorageClass", [
    point(
      S,
      "pv-pvc-storageclass",
      "PersistentVolume, PersistentVolumeClaim and StorageClass",
      "A PersistentVolume is a piece of storage in the cluster and a PersistentVolumeClaim is a pod's request for storage of a given size and access mode. A StorageClass describes a kind of storage and lets the cluster provision a volume dynamically when a claim appears. The volume outlives the pod, which is why stateful workloads use claims rather than container storage.",
      "A database pod is rescheduled to another node. How does it get its data back?",
    ),
  ]),
  withPoints("Resource requests and limits", [
    point(
      S,
      "requests-and-limits",
      "Resource requests and limits",
      "A request is the amount of CPU and memory the scheduler reserves for a container when choosing a node. A limit is the ceiling it can use: going over the CPU limit throttles the container, while going over the memory limit gets it OOMKilled. Requests and limits together set the pod's quality of service class, which decides eviction order under pressure.",
      "Why is a container killed when it exceeds its memory limit but only slowed when it exceeds its CPU limit?",
    ),
  ]),
  withPoints("Namespaces and RBAC", [
    point(
      S,
      "namespaces",
      "Namespaces",
      "Namespaces divide a cluster into named scopes for names, quotas and access policy, commonly per team or environment. They are not a hard security boundary on their own, since pods in different namespaces can still talk unless a network policy blocks it. ResourceQuotas and LimitRanges apply per namespace.",
      "Does putting dev and prod in separate namespaces isolate their network traffic?",
    ),
    point(
      S,
      "rbac",
      "RBAC",
      "Role-based access control grants permissions through Roles (namespaced) or ClusterRoles (cluster-wide) that list allowed verbs on resources. A RoleBinding or ClusterRoleBinding attaches them to users, groups or ServiceAccounts. RBAC is purely additive, so there are no deny rules, and workloads should use dedicated ServiceAccounts with only the access they need.",
      "How would you let a CI job deploy to one namespace but nothing else?",
    ),
  ]),
  withPoints("Network policies", [
    point(
      S,
      "network-policies",
      "Network policies",
      "By default every pod can talk to every other pod. A NetworkPolicy selects pods by label and, once a pod is selected, allows only the ingress or egress traffic the policy lists, so the usual pattern is a default deny followed by specific allows. The cluster's network plugin must enforce them, as Calico and Cilium do, otherwise they have no effect.",
      "How do you make the database pods accept connections only from the API pods?",
    ),
  ]),
  "Lightweight and local clusters: kind, minikube and k3s",
  "Practice: Spring Boot and PostgreSQL on kind or minikube with probes, HPA and a Helm chart",
].map((item) => (typeof item === "string" ? { title: item } : item));
