import type { LessonEntry } from "@/types/roadmap";

export const KUBERNETES_PRACTICE_SPRING_POSTGRES: LessonEntry = {
  track: "devops",
  section: "Kubernetes",
  subsection: {
    title: "Practice: Spring Boot and PostgreSQL on kind or minikube with probes, HPA and a Helm chart",
    slug: "kubernetes-practice-spring-postgres",
    lesson: {
      summary: "Deploy a Spring Boot API and PostgreSQL to a local cluster, add probes and an autoscaler, then package it all as a Helm chart.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "The goal" },
        { type: "p", text: "You will put the pieces of this section together on a local cluster: a PostgreSQL StatefulSet with a volume, a Spring Boot Deployment with probes and resource settings, a Service and Ingress, an HPA, and finally a Helm chart. Assume you have a Spring Boot image called `api:dev` that reads `DB_URL`, `DB_USER` and `DB_PASSWORD`." },
        { type: "list", ordered: true, items: ["Create the cluster, load the image and make a namespace.", "Deploy PostgreSQL with a Secret and a PVC.", "Deploy the API with probes, requests and limits.", "Expose it, then autoscale it.", "Package everything as a chart and install it as a release."] },
        { type: "h2", text: "1. Cluster, image and secret" },
        { type: "code", language: "bash", code: `kind create cluster --name dev
kind load docker-image api:dev --name dev
kubectl create namespace shop
kubectl -n shop create secret generic db \\
  --from-literal=user=app --from-literal=password=change-me` },
        { type: "h2", text: "2. PostgreSQL as a StatefulSet" },
        { type: "code", language: "yaml", title: "postgres.yaml", code: `apiVersion: v1
kind: Service
metadata: { name: postgres, namespace: shop }
spec:
  clusterIP: None            # headless: gives the pod a stable DNS name
  selector: { app: postgres }
  ports: [{ port: 5432 }]
---
apiVersion: apps/v1
kind: StatefulSet
metadata: { name: postgres, namespace: shop }
spec:
  serviceName: postgres
  replicas: 1
  selector: { matchLabels: { app: postgres } }
  template:
    metadata: { labels: { app: postgres } }
    spec:
      containers:
        - name: postgres
          image: postgres:16
          env:
            - { name: POSTGRES_DB, value: shop }
            - name: POSTGRES_USER
              valueFrom: { secretKeyRef: { name: db, key: user } }
            - name: POSTGRES_PASSWORD
              valueFrom: { secretKeyRef: { name: db, key: password } }
            - { name: PGDATA, value: /var/lib/postgresql/data/pgdata }
          readinessProbe:
            exec: { command: ["pg_isready", "-U", "app", "-d", "shop"] }
          volumeMounts:
            - { name: data, mountPath: /var/lib/postgresql/data }
  volumeClaimTemplates:
    - metadata: { name: data }
      spec:
        accessModes: [ReadWriteOnce]
        resources: { requests: { storage: 2Gi } }` },
        { type: "p", text: "`PGDATA` points to a subfolder because a fresh volume contains a `lost+found` directory that Postgres refuses to initialise over." },
        { type: "h2", text: "3. The API with probes and resources" },
        { type: "code", language: "yaml", title: "api.yaml (container section)", code: `containers:
  - name: api
    image: api:dev
    env:
      - { name: DB_URL, value: "jdbc:postgresql://postgres:5432/shop" }
      - name: DB_USER
        valueFrom: { secretKeyRef: { name: db, key: user } }
      - name: DB_PASSWORD
        valueFrom: { secretKeyRef: { name: db, key: password } }
    ports: [{ containerPort: 8080 }]
    resources:
      requests: { cpu: 250m, memory: 512Mi }
      limits: { memory: 768Mi }
    startupProbe:
      httpGet: { path: /actuator/health/liveness, port: 8080 }
      periodSeconds: 5
      failureThreshold: 30
    readinessProbe:
      httpGet: { path: /actuator/health/readiness, port: 8080 }
      periodSeconds: 5` },
        { type: "p", text: "Spring Boot exposes the liveness and readiness health groups when it detects Kubernetes, or when `management.endpoint.health.probes.enabled=true` is set. Add the Actuator dependency if it is missing." },
        { type: "h2", text: "4. Service, HPA and a load test" },
        { type: "code", language: "bash", code: `kubectl -n shop apply -f postgres.yaml -f api.yaml
kubectl -n shop expose deployment api --port=80 --target-port=8080
kubectl -n shop autoscale deployment api --cpu-percent=70 --min=2 --max=5
kubectl -n shop get hpa -w
kubectl -n shop port-forward svc/api 8081:80` },
        { type: "p", text: "The HPA needs metrics-server. On minikube run `minikube addons enable metrics-server`. On kind, install the upstream manifest and add the `--kubelet-insecure-tls` argument to its Deployment, since kind's kubelet certificates are self-signed. Generate load with a loop or a tool like `hey` and watch replicas rise." },
        { type: "h2", text: "5. Make it a chart" },
        { type: "code", language: "bash", code: `helm create shop           # scaffold, then replace templates with your YAML
# turn image, replicas, resources and hostnames into values.yaml entries
helm lint shop
helm upgrade --install shop ./shop -n shop -f values-dev.yaml
helm rollback shop 1 -n shop` },
        { type: "callout", tone: "gotcha", title: "Verify it, do not assume", text: "Prove the pieces work: delete the API pod and watch it return; delete the Postgres pod and confirm your data survives; break the readiness path and confirm traffic stops. Each failure you cause on purpose is one you will recognise in production." },
      ],
      references: [
        { title: "Configure Liveness, Readiness and Startup Probes", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" },
        { title: "Horizontal Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/" },
        { title: "Charts", url: "https://helm.sh/docs/topics/charts/" },
        { title: "Endpoints :: Spring Boot", url: "https://docs.spring.io/spring-boot/reference/actuator/endpoints.html" },
      ],
    },
    points: [
      {
        id: "devops.kubernetes.practice.postgres-statefulset-volume",
        title: "Postgres with a StatefulSet and a volume",
        detail: "A StatefulSet with a volumeClaimTemplate gives Postgres a stable name and its own disk that survives pod restarts. A headless Service provides the stable DNS name.",
        question: "After deleting the postgres-0 pod, why is the data still there when the new pod starts?",
      },
      {
        id: "devops.kubernetes.practice.probes-on-spring-boot",
        title: "Probes for a Spring Boot API",
        detail: "Actuator's liveness and readiness health groups map onto the matching probes, and a startup probe covers slow JVM boot. Readiness controls whether the pod receives traffic.",
        question: "Why should the liveness probe not check the database connection?",
      },
      {
        id: "devops.kubernetes.practice.hpa-load-test",
        title: "Autoscale under load",
        detail: "The HPA needs metrics-server and a CPU request on the pod. Generate load and watch `kubectl get hpa -w` scale replicas up, then back down after the cooldown.",
        question: "What does an HPA target of `<unknown>/70%` tell you to check?",
      },
      {
        id: "devops.kubernetes.practice.helm-chart-release",
        title: "Package it as a Helm chart",
        detail: "Move the image tag, replica count, resources and hostnames into values.yaml, lint the chart, and install it with `helm upgrade --install`. A rollback returns you to an earlier revision.",
        question: "Which values would differ between a dev and a production release of this chart?",
      },
    ],
  },
};
