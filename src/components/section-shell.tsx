import { cn } from "@/lib/utils";

/** The 1280px column with hairline rails on both sides (roadmap pages). */
export function Rail({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rail", className)}>{children}</div>;
}

/** Sticky mono header that labels every section: "02 / Work" (roadmap pages). */
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

/** Large display heading plus a muted lead paragraph (roadmap pages). */
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
      {lead && <p className="mt-4 max-w-xl leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

/** Plain title and one line of context that sits under a SectionBar (roadmap pages). */
export function SectionHead({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-line px-6 pb-4 pt-6 md:px-10">
      <h2 className="display-md">{title}</h2>
      <p className="mt-1.5 max-w-xl text-sm text-muted">{description}</p>
    </div>
  );
}

/* ---------- public marketing bands ---------- */

export type BandTone = "lav" | "ink";

/** Full-width band that re-scopes every colour token. Alternate lav and ink down the page. */
export function Band({
  tone,
  id,
  hero = false,
  className,
  children,
}: {
  tone: BandTone;
  id?: string;
  hero?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(tone === "lav" ? "band-lav" : "band-ink", "pub-band", hero && "pub-band--hero", className)}
    >
      <div className="pub-wrap">{children}</div>
    </section>
  );
}

/** Mono eyebrow, upper-case headline and optional italic serif accent plus lead paragraph. */
export function BandHead({
  eyebrow,
  title,
  accent,
  lead,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 md:mb-10", className)}>
      <p className="hud text-muted">{eyebrow}</p>
      <h2 className="pub-h2 mt-3 max-w-3xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="pub-serif">{accent}</span>
          </>
        )}
      </h2>
      {lead && <p className="mt-4 max-w-xl leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

/** Card surface used on both band tones. */
export const CARD = "min-w-0 rounded-2xl border border-line bg-bg-raised p-5 md:p-6";

/** Small mono pill tag. Add TAG_ON for the highlighted variant. */
export const TAG =
  "inline-flex w-fit items-center rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-accent-ink";
export const TAG_ON = "!bg-accent !text-bg";

/** Diamond list marker. */
export function Bullet({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("h-1.5 w-1.5 flex-none rotate-45 bg-accent", className)} />;
}
