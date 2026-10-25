import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_ARCHITECTURE: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Architecture: control plane and nodes",
    slug: "kubernetes-architecture",
    lesson: {
      summary: "A cluster is a control plane that stores and reconciles desired state, plus worker nodes that run your containers.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Desired state and reconciliation" },
        { type: "p", text: "Kubernetes is a system for keeping a promise. You declare what should exist (three copies of this image, reachable on port 80) and the cluster keeps working until reality matches. Every part of the architecture serves that loop: store the declaration, notice the difference, act on it." },
        { type: "h2", text: "The control plane" },
        { type: "p", text: "The control plane is the brain. It usually runs on dedicated machines, and managed services like EKS or GKE run it for you. It makes decisions but does not run your application containers." },
        { type: "table", head: ["Component", "Job"], rows: [["kube-apiserver", "The only front door. Authenticates, authorises and validates every request, and is the only component that talks to etcd."], ["etcd", "A consistent key-value store holding all cluster state: objects, config and Secrets."], ["kube-scheduler", "Picks a node for each pod that has none, based on resource requests, constraints and spread."], ["kube-controller-manager", "Runs the control loops (Deployment, ReplicaSet, Node, Job and others) that push actual state toward desired state."]] },
        { type: "h2", text: "The worker nodes" },
        { type: "p", text: "Each node runs the components that turn a pod spec into running processes." },
        { type: "list", items: ["**kubelet**: an agent that watches the API server for pods assigned to its node, asks the container runtime to start them, runs probes and reports status back.", "**Container runtime**: containerd or CRI-O, which pulls images and runs containers. Docker Engine is not needed.", "**kube-proxy**: programs the node's network rules so traffic to a Service address reaches a healthy pod. Some network plugins replace it."] },
        { type: "h2", text: "The role of etcd, and what happens when it fails" },
        { type: "p", text: "etcd is the source of truth. It uses the Raft consensus protocol, so writes need agreement from a majority of members. That is why production clusters run three or five members: an odd number tolerates failures without ties, and two members are no safer than one." },
        { type: "p", text: "If etcd becomes unavailable, the API server cannot read or write state. You cannot create, change or schedule anything, and controllers cannot react. But pods already running keep running, because kubelet and the container runtime do not need etcd for the containers they already started. Your app keeps serving until something needs a change: a crash, a node loss or a deploy." },
        { type: "h2", text: "What kubectl apply actually does" },
        { type: "list", ordered: true, items: ["kubectl reads your YAML and sends it to the API server over HTTPS.", "The API server authenticates you, checks RBAC, runs admission controllers and validates the object.", "It writes the desired state to etcd.", "The Deployment controller sees a new Deployment and creates a ReplicaSet; that controller creates Pod objects with no node set.", "The scheduler notices unscheduled pods and assigns each one a node.", "The kubelet on that node sees a pod bound to it, pulls the image, starts the containers and reports status back through the API server."] },
        { type: "p", text: "Notice that no component calls another directly. Everything watches the API server and writes results back to it. That is why the system recovers from partial failures: a restarted controller just reads current state and carries on." },
        { type: "code", language: "bash", title: "Look at the parts on a real cluster", code: `kubectl get nodes -o wide
kubectl get pods -n kube-system        # apiserver, etcd, scheduler, coredns...
kubectl describe pod web-7c9d8 | tail  # the Events show scheduler and kubelet steps` },
        { type: "callout", tone: "gotcha", title: "Back up etcd", text: "On a self-managed cluster, a lost etcd means a lost cluster, even though pods keep running for a while. Take regular snapshots with `etcdctl snapshot save` and test restoring one. Managed services handle this for you." },
      ],
      references: [
        { title: "Cluster Architecture", url: "https://kubernetes.io/docs/concepts/architecture/" },
        { title: "Kubernetes Components", url: "https://kubernetes.io/docs/concepts/overview/components/" },
        { title: "Controllers", url: "https://kubernetes.io/docs/concepts/architecture/controller/" },
        { title: "Nodes", url: "https://kubernetes.io/docs/concepts/architecture/nodes/" },
      ],
    },
  },
};
