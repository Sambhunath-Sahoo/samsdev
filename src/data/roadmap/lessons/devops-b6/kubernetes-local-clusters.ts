import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_LOCAL_CLUSTERS: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Lightweight and local clusters: kind, minikube and k3s",
    slug: "kubernetes-local-clusters",
    lesson: {
      summary: "Pick kind for throwaway test clusters, minikube for a friendly local playground, and k3s for a small real cluster on a cheap server.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why not a cloud cluster for learning" },
        { type: "p", text: "A managed cluster costs money while it sits idle and takes minutes to create. A local cluster starts in under a minute, costs nothing and can be destroyed and rebuilt freely. All three tools below give you a real, conformant Kubernetes API, so manifests you write transfer to EKS or GKE." },
        { type: "table", head: ["Tool", "How it runs", "Best for"], rows: [["kind", "Each node is a Docker container", "CI pipelines, multi-node tests, quick throwaway clusters."], ["minikube", "A VM or container with one node (more optional)", "Learning, with built-in addons like ingress and metrics-server."], ["k3s", "One small binary installed on a Linux host", "Small real servers, edge devices, a home lab or a cheap VPS."]] },
        { type: "h2", text: "kind: Kubernetes in Docker" },
        { type: "p", text: "kind needs only Docker. A config file lets you add worker nodes and publish host ports, which you need if you want an ingress controller reachable at `localhost`." },
        { type: "code", language: "yaml", title: "kind-config.yaml", code: `kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 80
        hostPort: 8080
  - role: worker
  - role: worker` },
        { type: "code", language: "bash", code: `kind create cluster --name dev --config kind-config.yaml
kubectl cluster-info --context kind-dev
kind load docker-image web:dev --name dev     # use a local image, no registry
kind delete cluster --name dev` },
        { type: "h2", text: "minikube: a batteries-included playground" },
        { type: "code", language: "bash", code: `minikube start --cpus=4 --memory=6g
minikube addons enable ingress
minikube addons enable metrics-server     # needed for HPA and kubectl top
minikube image load web:dev
minikube service web --url                # reach a NodePort service from the host
minikube tunnel                           # gives LoadBalancer services an IP
minikube delete` },
        { type: "h2", text: "k3s: lightweight, but production-capable" },
        { type: "p", text: "k3s is a CNCF-certified Kubernetes distribution packaged as a single binary that bundles containerd, CoreDNS, Traefik ingress and a simple load balancer. It uses far less memory than a full distribution, so it fits on a 2 GB machine. By default it stores state in SQLite rather than etcd, with embedded etcd available for multi-server high availability." },
        { type: "code", language: "bash", code: `curl -sfL https://get.k3s.io | sh -
sudo k3s kubectl get nodes
# copy /etc/rancher/k3s/k3s.yaml to ~/.kube/config and fix the server address` },
        { type: "p", text: "Read an install script before piping it to a shell, especially on a server you care about." },
        { type: "callout", tone: "gotcha", title: "Local images and the pull policy", text: "A cluster in a container or VM cannot see images in your host's Docker. Load them with `kind load docker-image` or `minikube image load`, and use a specific tag, not `latest`. With `latest` the default pull policy is `Always`, so the node tries the registry and fails with ImagePullBackOff." },
        { type: "p", text: "Pick by purpose: kind when you want it disposable and scriptable, minikube when you want addons with one command, k3s when it should keep running for real." },
      ],
      references: [
        { title: "kind - Quick Start", url: "https://kind.sigs.k8s.io/docs/user/quick-start/" },
        { title: "kind - Ingress", url: "https://kind.sigs.k8s.io/docs/user/ingress/" },
        { title: "minikube start", url: "https://minikube.sigs.k8s.io/docs/start/" },
        { title: "K3s Documentation", url: "https://docs.k3s.io/" },
      ],
    },
    points: [
      {
        id: "devops.kubernetes.local-clusters.kind-vs-minikube-vs-k3s",
        title: "kind, minikube and k3s compared",
        detail: "kind runs each node as a Docker container and suits CI and throwaway clusters. minikube runs a local node with built-in addons and suits learning. k3s is a single-binary distribution that suits small real servers.",
        question: "Which tool would you choose to test a manifest in CI, and which to keep a small cluster running on a cheap VPS?",
      },
      {
        id: "devops.kubernetes.local-clusters.load-local-images",
        title: "Getting a local image into the cluster",
        detail: "A local cluster has its own image store, so images built on your host are not visible to it. Use `kind load docker-image` or `minikube image load`, and pin a tag other than latest.",
        question: "Why does a pod using `web:latest` fail with ImagePullBackOff on kind even though the image exists locally?",
      },
      {
        id: "devops.kubernetes.local-clusters.reach-services",
        title: "Reaching services from your laptop",
        detail: "On kind you publish host ports through the cluster config or use kubectl port-forward. On minikube you can use `minikube service` for NodePorts and `minikube tunnel` for LoadBalancers.",
        question: "Why does a LoadBalancer Service stay in pending on a local cluster, and how do you fix it on minikube?",
      },
    ],
  },
};
