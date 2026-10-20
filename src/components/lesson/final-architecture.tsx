/** The end state of the DevOps track, drawn with sample names only. */

type BoxProps = { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean; dashed?: boolean };

function Box({ x, y, w, h, label, sub, accent, dashed }: BoxProps) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="var(--bg-raised)"
        stroke={accent ? "var(--app)" : "var(--line-strong)"}
        strokeWidth={accent ? 1.75 : 1}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={cx} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="currentColor">
        {label}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.55}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, label, lx, ly }: { d: string; label?: string; lx?: number; ly?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.25} markerEnd="url(#arrow)" />
      {label && lx !== undefined && ly !== undefined && (
        <text x={lx} y={ly} fontSize={10.5} fill="currentColor" opacity={0.6}>
          {label}
        </text>
      )}
    </g>
  );
}

function Frame({ x, y, w, h, label, dashed }: { x: number; y: number; w: number; h: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke="var(--line-strong)" strokeDasharray={dashed ? "6 5" : undefined} />
      <text x={x + 12} y={y + 18} fontSize={10.5} letterSpacing={1.2} fill="currentColor" opacity={0.55} style={{ textTransform: "uppercase" }}>
        {label}
      </text>
    </g>
  );
}

export function FinalArchitecture() {
  return (
    <figure className="border border-line bg-bg-raised">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 1100 640"
          role="img"
          aria-label="Final architecture: users reach a WAF and load balancer, which route to apps on an EKS cluster in private subnets. ArgoCD deploys images that GitHub Actions pushes to a registry. The apps use a cache, a queue, a vector database and an LLM API, and Terraform builds it all."
          className="mx-auto block h-auto min-w-[760px] w-full max-w-[1100px] text-ink"
          fontFamily="var(--font-body), system-ui, sans-serif"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor" opacity={0.7} />
            </marker>
          </defs>

          <Box x={20} y={120} w={110} h={44} label="Users" sub="browser" />
          <Box x={20} y={210} w={110} h={44} label="Route 53" sub="DNS" />
          <Box x={20} y={300} w={110} h={44} label="WAF" sub="filters bad traffic" />
          <Arrow d="M75 164 V208" />
          <Arrow d="M75 254 V298" />

          <Frame x={170} y={40} w={910} h={500} label="VPC · 2 availability zones" dashed />
          <Box x={190} y={300} w={110} h={44} label="ALB" sub="TLS from ACM" accent />
          <Arrow d="M130 322 H188" />

          <Frame x={340} y={70} w={400} h={440} label="EKS cluster · private subnets" />
          <Box x={360} y={110} w={170} h={46} label="3 Next.js apps" sub="web pods" />
          <Box x={360} y={190} w={170} h={46} label="API pods" sub="FastAPI, autoscaled" accent />
          <Box x={360} y={270} w={170} h={46} label="Queue worker" sub="background jobs" />
          <Box x={550} y={110} w={170} h={46} label="ArgoCD" sub="syncs git to cluster" />
          <Box x={550} y={190} w={170} h={46} label="Prometheus + Grafana" sub="metrics, dashboards" />
          <Box x={550} y={270} w={170} h={46} label="CloudWatch" sub="logs, alarms" />
          <Arrow d="M300 322 H338" />
          <Arrow d="M338 322 H320 V213 H358" />

          <Frame x={780} y={70} w={280} h={440} label="Data and AI" />
          <Box x={800} y={110} w={240} h={46} label="Redis" sub="cache" />
          <Box x={800} y={190} w={240} h={46} label="SQS" sub="job queue" />
          <Box x={800} y={270} w={240} h={46} label="Postgres + pgvector" sub="managed database" />
          <Box x={800} y={350} w={240} h={46} label="LLM API + tracing" sub="Langfuse" />
          <Arrow d="M740 133 H798" />
          <Arrow d="M740 213 H798" />
          <Arrow d="M740 293 H798" />
          <Arrow d="M740 373 H798" />
          <text x={745} y={440} fontSize={10.5} fill="currentColor" opacity={0.6}>
            apps call these
          </text>

          <Box x={20} y={570} w={150} h={46} label="GitHub Actions" sub="test, build, OIDC" />
          <Box x={230} y={570} w={120} h={46} label="ECR" sub="image registry" />
          <Arrow d="M170 593 H228" />
          <Arrow d="M350 593 H550 V510" label="image tag in git" lx={420} ly={585} />
          <Box x={800} y={570} w={240} h={46} label="Terraform" sub="builds every box above" dashed />
        </svg>
      </div>
      <figcaption className="border-t border-line px-4 py-2.5 text-sm text-muted">
        Where the track ends: the same app, now behind a firewall, on Kubernetes, deployed from git, with a cache, a queue, a vector database and an LLM, and all of it created by Terraform. Sample names only.
      </figcaption>
    </figure>
  );
}
