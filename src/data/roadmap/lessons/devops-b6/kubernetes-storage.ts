import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_STORAGE: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Storage: PV, PVC and StorageClass",
    slug: "kubernetes-storage",
    lesson: {
      summary: "A pod asks for storage with a PersistentVolumeClaim, and a StorageClass tells the cluster how to provision the disk behind it.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why pod storage is temporary by default" },
        { type: "p", text: "A container's filesystem disappears when it restarts, and an `emptyDir` volume lasts only as long as the pod. Anything that must survive, like a PostgreSQL data directory, needs a volume whose life is separate from the pod." },
        { type: "h2", text: "Three objects, three roles" },
        { type: "table", head: ["Object", "Who creates it", "What it is"], rows: [["PersistentVolume (PV)", "An admin, or automatically", "A piece of real storage in the cluster, such as an EBS volume or an NFS share."], ["PersistentVolumeClaim (PVC)", "The app developer", "A request: how much, what access mode, which class."], ["StorageClass", "A cluster admin", "A template for dynamic provisioning: which provisioner, disk type and reclaim policy."]] },
        { type: "p", text: "The flow is: you create a PVC; the StorageClass provisioner creates a disk and a PV; the PV binds to your PVC; the pod mounts the PVC by name. You never reference the PV directly, so the same manifest works on any cluster that has a suitable class." },
        { type: "code", language: "yaml", title: "pvc.yaml and its use", code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pgdata
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: standard
  resources:
    requests:
      storage: 10Gi
---
# in the pod spec
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pgdata
containers:
  - name: postgres
    image: postgres:16
    volumeMounts:
      - name: data
        mountPath: /var/lib/postgresql/data` },
        { type: "h2", text: "Details that matter" },
        { type: "list", items: ["**Access modes**: `ReadWriteOnce` mounts on one node at a time (typical for block disks); `ReadWriteMany` allows many nodes and needs a shared filesystem like NFS or EFS; `ReadWriteOncePod` limits it to a single pod.", "**Reclaim policy**: `Delete` removes the disk when the PVC is deleted; `Retain` keeps it for manual recovery. Dynamic classes often default to `Delete`.", "**Binding mode**: `WaitForFirstConsumer` delays creating the disk until a pod is scheduled, so it lands in the same zone as the pod.", "**StatefulSets** use `volumeClaimTemplates` to create one PVC per replica automatically."] },
        { type: "code", language: "bash", code: `kubectl get storageclass
kubectl get pvc,pv
kubectl describe pvc pgdata     # Events explain a Pending claim` },
        { type: "callout", tone: "gotcha", title: "Deleting the claim can delete the data", text: "With a `Delete` reclaim policy, removing the PVC (or the namespace holding it) destroys the underlying disk. Check the policy before running `helm uninstall` or deleting a namespace for a database, and keep real backups; a PV is not a backup." },
        { type: "p", text: "A PVC stuck in `Pending` usually means no default StorageClass exists, the class name is wrong, or no node can satisfy the zone constraint. Local clusters such as kind and minikube ship a simple default class backed by a folder on the node, which is fine for practice but not durable." },
      ],
      references: [
        { title: "Persistent Volumes", url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/" },
        { title: "Storage Classes", url: "https://kubernetes.io/docs/concepts/storage/storage-classes/" },
        { title: "StatefulSets", url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/" },
      ],
    },
  },
};
