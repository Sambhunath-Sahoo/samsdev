import type { LessonEntry } from "@/types/roadmap";

export const DEPLOYMENT_STRATEGIES: LessonEntry = {
  track: "devops",
  section: "CI/CD",
  subsection: {
    title: "Deployment strategies: rolling, blue-green, canary, rollback",
    slug: "deployment-strategies",
    lesson: {
      summary: "Four ways to replace running code without dropping requests, and what each costs when something goes wrong.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Zero-downtime deployments" },
        { type: "p", text: "The naive deploy stops the old version, then starts the new one, and users see errors in between. Zero downtime means at every moment some healthy instance is serving traffic. Three things make that work: more than one instance (or a second environment), a load balancer that only sends traffic to instances passing a health check, and a graceful shutdown so the old instance finishes in-flight requests before it exits." },
        { type: "h2", text: "The strategies" },
        { type: "table", head: ["Strategy", "How it works", "Rollback", "Cost"], rows: [["Rolling", "Replace instances a few at a time", "Roll forward the old version again, takes minutes", "Cheap; old and new run together briefly"], ["Blue-green", "Build a full second environment, switch traffic at once", "Switch back, seconds", "Double capacity during the switch"], ["Canary", "Send 1-5% of traffic to the new version, watch metrics, widen", "Send the percentage back to zero", "Needs traffic splitting and good metrics"]] },
        { type: "p", text: "**Blue-green vs canary**: blue-green is all-or-nothing and gives the fastest rollback, but if the bug only shows under real traffic, everyone sees it. Canary limits the blast radius, but you need enough traffic and the right metrics (error rate, latency) to tell good from bad. Rolling updates are the default in Kubernetes and ECS because they need no extra infrastructure." },
        { type: "code", language: "yaml", title: "Kubernetes rolling update settings", code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0   # never drop below 4 ready pods
      maxSurge: 1         # start one extra pod at a time
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: ghcr.io/me/api:3f9c2ab
          readinessProbe:
            httpGet: { path: /health, port: 8000 }` },
        { type: "h2", text: "Rolling back in a pipeline" },
        { type: "p", text: "A rollback should be the same pipeline deploying an older artifact, not a special procedure invented at 2 a.m. Because images are tagged by commit SHA, rolling back means redeploying the previous SHA. In Kubernetes, `kubectl rollout undo deployment/api` does it directly. Make the pipeline run a post-deploy health check and revert automatically if it fails." },
        { type: "h2", text: "Feature flags and database migrations" },
        { type: "p", text: "**Feature flags** separate deploy from release: ship code switched off, turn it on for a few users, turn it off instantly if it misbehaves, no redeploy needed. Remove flags once a feature is fully on, or they pile up as dead branches." },
        { type: "p", text: "**Database migrations** are what breaks rollbacks. During a rolling or canary deploy, old and new code run against the same database. Use the expand and contract pattern: first add the new column (compatible with old code), deploy code that uses it, and only later remove the old column. Never ship a migration that old code cannot survive." },
        { type: "callout", tone: "gotcha", title: "Rollback does not undo data", text: "Reverting the image is easy; reverting a destructive migration is not. If a deploy drops or rewrites a column, your rollback target no longer works. Take that change in two separate releases." },
      ],
      references: [
        { title: "Blue Green Deployment (Martin Fowler)", url: "https://martinfowler.com/bliki/BlueGreenDeployment.html" },
        { title: "Canary Release (Martin Fowler)", url: "https://martinfowler.com/bliki/CanaryRelease.html" },
        { title: "Feature Toggles (Martin Fowler)", url: "https://martinfowler.com/articles/feature-toggles.html" },
        { title: "Kubernetes Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
        { title: "Application deployment and testing strategies (Google Cloud)", url: "https://cloud.google.com/architecture/application-deployment-and-testing-strategies" },
      ],
    },
  },
};
