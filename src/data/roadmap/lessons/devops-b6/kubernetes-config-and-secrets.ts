import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_CONFIG_AND_SECRETS: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Config and secrets",
    slug: "kubernetes-config-and-secrets",
    lesson: {
      summary: "ConfigMaps and Secrets keep settings out of the image, but a Secret is only base64-encoded unless you add protection.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why config lives outside the image" },
        { type: "p", text: "One image should run in dev, staging and production. What differs, such as a database URL, a feature flag or a password, is injected at runtime. Kubernetes has two objects for this: **ConfigMap** for non-sensitive values and **Secret** for sensitive ones." },
        { type: "h2", text: "ConfigMap vs Secret" },
        { type: "table", head: ["", "ConfigMap", "Secret"], rows: [["Holds", "Plain settings, config files", "Passwords, tokens, keys, certificates"], ["Stored in etcd as", "Plain text", "Base64 text (not encrypted by default)"], ["Size limit", "1 MiB", "1 MiB"], ["Extra handling", "None", "Can be encrypted at rest, tighter RBAC, kept off disk on nodes where possible"]] },
        { type: "p", text: "Base64 is an encoding, not encryption. Anyone who can read the Secret object can decode it with one command. So the separation is mostly about access control and handling, not secrecy by itself." },
        { type: "h2", text: "Creating and using them" },
        { type: "code", language: "bash", code: `kubectl create configmap web-config \\
  --from-literal=LOG_LEVEL=info \\
  --from-literal=SPRING_PROFILES_ACTIVE=prod

kubectl create secret generic db-credentials \\
  --from-literal=username=app \\
  --from-literal=password='s3cr3t-value'` },
        { type: "code", language: "yaml", title: "container section of a Deployment", code: `containers:
  - name: web
    image: ghcr.io/example/web:1.4.2
    envFrom:
      - configMapRef:
          name: web-config
    env:
      - name: DB_PASSWORD
        valueFrom:
          secretKeyRef:
            name: db-credentials
            key: password
    volumeMounts:
      - name: tls
        mountPath: /etc/tls
        readOnly: true
volumes:
  - name: tls
    secret:
      secretName: web-tls` },
        { type: "p", text: "There are two ways to deliver values. **Environment variables** are simple but fixed when the container starts. **Mounted volumes** show each key as a file, and Kubernetes updates the files when the ConfigMap or Secret changes (after a short delay), though your app must re-read them. Values used through `subPath` mounts or env vars never update without a pod restart." },
        { type: "h2", text: "Making Secrets actually safer" },
        { type: "list", items: ["Enable **encryption at rest** for Secrets in the API server (managed clusters often offer this with a cloud key).", "Restrict who can `get` or `list` Secrets with RBAC. `list` on Secrets reveals every value.", "Prefer volume mounts over env vars: env values leak into crash dumps, `describe` output of some tools and child processes.", "Keep the YAML out of Git. Use Sealed Secrets, SOPS, or the External Secrets Operator to pull from a vault or cloud secret manager.", "Rotate credentials, and roll the pods so they pick the new value up."] },
        { type: "callout", tone: "gotcha", title: "Changing a ConfigMap does not restart pods", text: "If config is read from env vars, you must restart the Deployment: `kubectl rollout restart deployment/web`. A common Helm trick is to put a hash of the ConfigMap in a pod annotation so any change triggers a rollout." },
        { type: "p", text: "Never bake secrets into the image or into a ConfigMap, and avoid committing `kubectl create secret ... -o yaml` output. Treat the cluster as a place secrets pass through, with their source of truth elsewhere." },
      ],
      references: [
        { title: "ConfigMaps", url: "https://kubernetes.io/docs/concepts/configuration/configmap/" },
        { title: "Secrets", url: "https://kubernetes.io/docs/concepts/configuration/secret/" },
        { title: "Good practices for Kubernetes Secrets", url: "https://kubernetes.io/docs/concepts/security/secrets-good-practices/" },
        { title: "Encrypting Confidential Data at Rest", url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/" },
      ],
    },
  },
};
