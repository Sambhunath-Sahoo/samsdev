import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_NAMESPACES_AND_RBAC: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Namespaces and RBAC",
    slug: "kubernetes-namespaces-and-rbac",
    lesson: {
      summary: "Namespaces split a cluster into named areas, and RBAC decides which identities may do which actions inside them.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Namespaces" },
        { type: "p", text: "A namespace is a scope for names and policy inside one cluster. Two teams can each have a Service called `api` in different namespaces. Namespaces are also where you attach resource quotas, network policies and RBAC rules. Most objects (pods, Services, ConfigMaps, Secrets) are namespaced; nodes, PersistentVolumes and namespaces themselves are not." },
        { type: "code", language: "bash", code: `kubectl create namespace shop
kubectl get pods -n shop
kubectl config set-context --current --namespace=shop   # default for this context
kubectl get pods -A                                     # across all namespaces` },
        { type: "p", text: "Services are reachable across namespaces through the full DNS name, `api.shop.svc.cluster.local`. A namespace is **not** a security boundary by itself: without network policies, pods in any namespace can talk to each other." },
        { type: "h2", text: "RBAC" },
        { type: "p", text: "Role-based access control answers: may this subject perform this verb on this resource? It is additive; there are no deny rules, so anything not granted is refused. Four objects make it work." },
        { type: "table", head: ["Object", "Scope", "Meaning"], rows: [["Role", "One namespace", "A list of allowed verbs on resources."], ["ClusterRole", "Cluster-wide", "Same, for cluster resources or reusable across namespaces."], ["RoleBinding", "One namespace", "Grants a Role or ClusterRole to a user, group or ServiceAccount in that namespace."], ["ClusterRoleBinding", "Cluster-wide", "Grants a ClusterRole everywhere."]] },
        { type: "code", language: "yaml", title: "rbac.yaml: a CI account that may update Deployments in shop", code: `apiVersion: v1
kind: ServiceAccount
metadata: { name: ci-deployer, namespace: shop }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: deployer, namespace: shop }
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "patch", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: ci-deployer, namespace: shop }
subjects:
  - kind: ServiceAccount
    name: ci-deployer
    namespace: shop
roleRef:
  kind: Role
  name: deployer
  apiGroup: rbac.authorization.k8s.io` },
        { type: "code", language: "bash", title: "Test it without logging in as that account", code: `kubectl auth can-i patch deployments -n shop \\
  --as=system:serviceaccount:shop:ci-deployer     # yes
kubectl auth can-i get secrets -n shop \\
  --as=system:serviceaccount:shop:ci-deployer     # no` },
        { type: "h2", text: "Common mistakes" },
        { type: "list", items: ["Binding `cluster-admin` to make an error go away. Grant the specific verbs instead, and use `kubectl auth can-i` to check.", "Forgetting that `list` and `watch` on `secrets` expose every secret value in that scope.", "Letting pods use the `default` ServiceAccount with extra permissions. Create one per app, and disable token mounting (`automountServiceAccountToken: false`) when the pod never calls the API.", "Using wildcards (`*`) in verbs or resources in long-lived roles."] },
        { type: "callout", tone: "tip", title: "Least privilege applies here too", text: "The same discipline as IAM in the cloud applies: one identity per workload, the narrowest role, and an audit habit of listing bindings (`kubectl get rolebindings,clusterrolebindings -A`) now and then." },
      ],
      references: [
        { title: "Namespaces", url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/" },
        { title: "Using RBAC Authorization", url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
        { title: "DNS for Services and Pods", url: "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/" },
      ],
    },
  },
};
