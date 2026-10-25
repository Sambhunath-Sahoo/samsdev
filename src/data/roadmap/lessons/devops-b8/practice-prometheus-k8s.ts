import type { LessonEntry } from "@/types/roadmap";

export const PRACTICE_PROMETHEUS_K8S: LessonEntry = {
  track: "devops",
  section: "Observability",
  subsection: {
    title: "Practice: Prometheus and Grafana on Kubernetes with alert rules for CPU, memory and error rate",
    slug: "practice-prometheus-grafana-kubernetes-alerts",
    lesson: {
      summary: "Install kube-prometheus-stack with Helm, scrape an app with a ServiceMonitor, and add alert rules for CPU, memory and error rate.",
      minutes: 10,
      blocks: [
        { type: "h2", text: "What you will build" },
        { type: "p", text: "The `kube-prometheus-stack` Helm chart installs Prometheus, Alertmanager, Grafana, node and kube-state exporters, and the Prometheus Operator. The operator adds custom resources so you configure scraping and alerts with Kubernetes objects: a `ServiceMonitor` says what to scrape, and a `PrometheusRule` holds alert rules. You need a cluster (kind or minikube is fine), `kubectl` and `helm`." },
        { type: "h2", text: "1. Install the stack" },
        {
          type: "code",
          language: "bash",
          code: `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \\
  --namespace monitoring --create-namespace

kubectl -n monitoring get pods
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
# admin password:
kubectl -n monitoring get secret monitoring-grafana \\
  -o jsonpath="{.data.admin-password}" | base64 -d`,
        },
        { type: "p", text: "The release name is `monitoring`, and it matters: by default the operator only picks up rules and monitors that carry the label `release: monitoring`. Grafana already has dashboards for nodes, pods and namespaces." },
        { type: "h2", text: "2. Scrape your app" },
        { type: "p", text: "Assume your app has a Service named `api` with a port named `http` that serves `/metrics`." },
        {
          type: "code",
          language: "yaml",
          title: "servicemonitor.yaml",
          code: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api
  namespace: default
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: api
  endpoints:
    - port: http
      path: /metrics
      interval: 15s`,
        },
        { type: "p", text: "The selector matches labels on the Service, not the pods. After applying it, open Prometheus (`kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-prometheus 9090`) and check **Status, Targets** for your app." },
        { type: "h2", text: "3. Alert rules" },
        {
          type: "code",
          language: "yaml",
          title: "alerts.yaml",
          code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-alerts
  namespace: default
  labels:
    release: monitoring
spec:
  groups:
    - name: api
      rules:
        - alert: HighCpuVsLimit
          expr: |
            sum by (namespace, pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
              / sum by (namespace, pod) (kube_pod_container_resource_limits{resource="cpu"}) > 0.9
          for: 10m
          labels: { severity: ticket }
          annotations:
            summary: "{{ $labels.pod }} is using over 90% of its CPU limit"
        - alert: HighMemoryVsLimit
          expr: |
            sum by (namespace, pod) (container_memory_working_set_bytes{container!=""})
              / sum by (namespace, pod) (kube_pod_container_resource_limits{resource="memory"}) > 0.9
          for: 10m
          labels: { severity: ticket }
          annotations:
            summary: "{{ $labels.pod }} is using over 90% of its memory limit"
        - alert: HighErrorRate
          expr: |
            sum(rate(http_requests_total{job="api",status=~"5.."}[5m]))
              / sum(rate(http_requests_total{job="api"}[5m])) > 0.05
          for: 5m
          labels: { severity: page }
          annotations:
            summary: "More than 5% of API requests are failing"`,
        },
        { type: "p", text: "CPU and memory alerts compare usage to the pod's limit, so they only work for pods that have resource limits set. The error rate rule assumes your metric is named `http_requests_total` with a `status` label, so adjust the names to what your app exposes." },
        { type: "h2", text: "4. Prove the alerts fire" },
        {
          type: "list",
          items: [
            "Run `kubectl apply -f servicemonitor.yaml -f alerts.yaml` and see the rules under **Status, Rules** in Prometheus.",
            "Make the app return 500s for a few minutes, or temporarily lower the threshold, and watch the alert go Pending, then Firing.",
            "In Alertmanager (`monitoring-kube-prometheus-alertmanager`, port 9093) confirm the alert arrived, then route `severity=page` to a receiver.",
            "Add a Grafana panel for the same error rate query.",
          ],
        },
        { type: "callout", tone: "gotcha", title: "Nothing shows up: check the labels", text: "The two usual causes are a missing `release: monitoring` label on the ServiceMonitor or PrometheusRule, and a ServiceMonitor selector that does not match the Service labels. Both fail silently, so inspect the Targets and Rules pages first." },
      ],
      references: [
        { title: "kube-prometheus-stack chart", url: "https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" },
        { title: "Prometheus Operator introduction", url: "https://prometheus-operator.dev/docs/getting-started/introduction/" },
        { title: "Alerting rules (Prometheus)", url: "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/" },
        { title: "Alertmanager (Prometheus)", url: "https://prometheus.io/docs/alerting/latest/alertmanager/" },
      ],
    },
    points: [
      {
        id: "devops.practice-prometheus-grafana-kubernetes-alerts.operator-crds",
        title: "ServiceMonitor and PrometheusRule",
        detail: "The Prometheus Operator turns scrape and alert configuration into Kubernetes objects. A ServiceMonitor selects Services to scrape, and a PrometheusRule holds alert rules.",
        question: "Which object tells Prometheus to scrape your app, and what does its selector match?",
      },
      {
        id: "devops.practice-prometheus-grafana-kubernetes-alerts.release-label",
        title: "The release label",
        detail: "By default the operator only selects monitors and rules labelled with the Helm release name. A missing label makes them silently ignored.",
        question: "Why does a ServiceMonitor not appear in Targets after you apply it?",
      },
      {
        id: "devops.practice-prometheus-grafana-kubernetes-alerts.limits-based-alerts",
        title: "CPU and memory alerts need limits",
        detail: "Comparing usage to the container limit gives a meaningful percentage, but only when limits are set. Without them, those expressions return no data.",
        question: "What must be set on a pod for the CPU-versus-limit alert to evaluate?",
      },
      {
        id: "devops.practice-prometheus-grafana-kubernetes-alerts.test-fire",
        title: "Test that alerts really fire",
        detail: "Force the failure or lower a threshold and watch the alert move from Pending to Firing and reach Alertmanager. An untested alert is a guess.",
        question: "How do you prove an alert rule works before you need it?",
      },
    ],
  },
};
