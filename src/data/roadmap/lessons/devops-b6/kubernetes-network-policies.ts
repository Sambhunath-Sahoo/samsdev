import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_NETWORK_POLICIES: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Network policies",
    slug: "kubernetes-network-policies",
    lesson: {
      summary: "NetworkPolicies are pod-level firewall rules: once a pod is selected, only the traffic you allow can reach it.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The default is open" },
        { type: "p", text: "In a fresh cluster every pod can reach every other pod, in any namespace. If one pod is compromised, an attacker can probe your database directly. A **NetworkPolicy** narrows this by describing which traffic a group of pods accepts (ingress) and which it may send (egress)." },
        { type: "callout", tone: "gotcha", title: "Your network plugin must enforce them", text: "A NetworkPolicy is only an object in the API. Enforcement comes from the CNI plugin: Calico, Cilium and others do it, but some simple default plugins, such as the one in older kind clusters, ignore policies silently. Check your cluster's plugin before trusting a policy." },
        { type: "h2", text: "How the rules work" },
        { type: "list", items: ["A policy selects pods with `podSelector` inside its own namespace.", "Once any policy selects a pod for a direction, that direction becomes deny-by-default for that pod. Only what the policies allow gets through.", "Policies are additive: if several select a pod, the union of their allow rules applies. There are no deny rules.", "Sources and destinations are described by pod labels, namespace labels or IP blocks, plus ports."] },
        { type: "h2", text: "A worked example" },
        { type: "p", text: "Start by denying all incoming traffic in a namespace, then open exactly what each tier needs." },
        { type: "code", language: "yaml", title: "default deny, then allow API to Postgres", code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: shop
spec:
  podSelector: {}          # every pod in the namespace
  policyTypes: [Ingress]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-postgres
  namespace: shop
spec:
  podSelector:
    matchLabels: { app: postgres }
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: api }
      ports:
        - protocol: TCP
          port: 5432` },
        { type: "p", text: "With these two, only pods labelled `app: api` in the `shop` namespace can connect to Postgres on 5432. Everything else is refused, including pods in other namespaces. To admit traffic from another namespace, use a `namespaceSelector` (it matches the label `kubernetes.io/metadata.name` automatically)." },
        { type: "h2", text: "Egress and its traps" },
        { type: "p", text: "Restricting egress is stronger but easy to break. If you deny egress for a pod, DNS lookups fail unless you allow UDP and TCP port 53 to the cluster DNS pods. Pods also need egress to reach the internet, a cloud API or an external database, which you describe with `ipBlock` ranges." },
        { type: "code", language: "bash", title: "Test from a throwaway pod", code: `kubectl run tmp -n shop --rm -it --image=busybox --restart=Never \\
  --labels=app=other -- nc -zv postgres 5432   # should time out
kubectl run tmp -n shop --rm -it --image=busybox --restart=Never \\
  --labels=app=api -- nc -zv postgres 5432     # should connect` },
        { type: "p", text: "Always test both the allowed path and a path that should be blocked. A policy that was never proven to block anything gives false comfort." },
      ],
      references: [
        { title: "Network Policies", url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/" },
        { title: "Namespaces", url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/" },
        { title: "Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/" },
      ],
    },
  },
};
