import { cn } from "@/lib/utils";

/** The 1280px column with hairline rails on both sides. */
export function Rail({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rail", className)}>{children}</div>;
}

/** Sticky mono header that labels every section: "02 / Work". */
export function SectionBar({
  index,
  label,
  aside,
}: {
  index: string;
  label: string;
  aside?: string;
}) {
  return (
    <div className="section-bar">
      <p className="hud text-muted">
        <span className="text-faint">{index}</span>
        <span className="mx-2 text-faint">/</span>
        {label}
      </p>
      {aside && <p className="hud hidden text-faint sm:block">{aside}</p>}
    </div>
  );
}

/** Large display heading plus a muted lead paragraph. */
export function SectionIntro({
  title,
  lead,
  className,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-pad", className)}>
      <h2 className="display-lg max-w-3xl">{title}</h2>
      {lead && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
