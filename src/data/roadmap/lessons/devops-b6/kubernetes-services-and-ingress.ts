import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_SERVICES_AND_INGRESS: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Services and Ingress",
    slug: "kubernetes-services-and-ingress",
    lesson: {
      summary: "A Service gives a changing set of pods one stable address, and an Ingress routes outside HTTP traffic to Services.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why Services exist" },
        { type: "p", text: "Pods are disposable: they get new IPs every time they are replaced. A **Service** is a stable virtual IP and DNS name in front of all pods matching a label selector. Clients talk to the Service, and Kubernetes spreads connections across the pods that are ready." },
        { type: "code", language: "yaml", title: "service.yaml", code: `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - port: 80          # what clients use
      targetPort: 8080  # what the container listens on` },
        { type: "h2", text: "Service types" },
        { type: "table", head: ["Type", "Reachable from", "Typical use"], rows: [["ClusterIP (default)", "Inside the cluster only", "Internal APIs, databases."], ["NodePort", "Any node's IP on a port in 30000-32767", "Quick tests, or as a building block for load balancers."], ["LoadBalancer", "A cloud load balancer with its own address", "Exposing one service directly to the internet."]] },
        { type: "p", text: "Each type builds on the previous: a LoadBalancer also gets a NodePort and a ClusterIP. On a local cluster a LoadBalancer stays `<pending>` unless you add something like minikube tunnel or MetalLB." },
        { type: "h2", text: "How service discovery works" },
        { type: "p", text: "The cluster DNS (CoreDNS) creates a name for every Service: `web.shop.svc.cluster.local`, meaning service `web` in namespace `shop`. Inside the same namespace the short name `web` works. Pods get their DNS settings automatically, so your app config can simply say `http://web` or `postgres:5432`. Environment variables like `WEB_SERVICE_HOST` also exist but only for Services that existed when the pod started, so prefer DNS." },
        { type: "p", text: "Behind the name, the control plane maintains EndpointSlices listing the IPs of ready pods, and kube-proxy (or the network plugin) turns the Service IP into one of those addresses. A pod that fails its readiness probe is removed from the list." },
        { type: "h2", text: "Ingress: HTTP routing at the edge" },
        { type: "p", text: "Giving every service its own cloud load balancer gets expensive. An **Ingress** is a set of host and path rules, and an **ingress controller** (NGINX, Traefik and others) is the program that enforces them behind one load balancer. The Ingress object does nothing on its own without a controller installed." },
        { type: "code", language: "yaml", title: "ingress.yaml", code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service: { name: api, port: { number: 80 } }
          - path: /
            pathType: Prefix
            backend:
              service: { name: web, port: { number: 80 } }
  tls:
    - hosts: [shop.example.com]
      secretName: shop-tls` },
        { type: "p", text: "TLS certificates live in a Secret named in `tls`. Tools such as cert-manager can issue and renew them automatically. The newer Gateway API is the designed successor to Ingress, but Ingress is still everywhere." },
        { type: "callout", tone: "gotcha", title: "Empty endpoints", text: "If a Service returns connection refused, run `kubectl get endpointslices -l kubernetes.io/service-name=web`. No addresses usually means the selector does not match the pod labels, or no pod is ready." },
      ],
      references: [
        { title: "Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/" },
        { title: "Ingress", url: "https://kubernetes.io/docs/concepts/services-networking/ingress/" },
        { title: "DNS for Services and Pods", url: "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/" },
        { title: "Connecting Applications with Services", url: "https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/" },
      ],
    },
  },
};
