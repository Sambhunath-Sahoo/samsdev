import { Navbar } from "@/components/navbar";
import { Rail } from "@/components/section-shell";

const SKELETON_WIDTHS = ["w-2/3", "w-1/2", "w-5/6", "w-1/3"] as const;

export function PageLoader() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Rail className="min-h-[calc(100vh-var(--nav-h))]">
        <div className="section-bar">
          <p className="hud text-muted">
            <span className="text-faint">00</span>
            <span className="mx-2 text-faint">/</span>
            Loading
          </p>
        </div>
        <div aria-busy="true" aria-live="polite" className="section-pad flex max-w-3xl flex-col gap-4">
          <span className="sr-only">Loading content</span>
          {SKELETON_WIDTHS.map((width, i) => (
            <div key={width} className={`h-10 animate-pulse bg-bg-sunken ${width}`} style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </Rail>
    </div>
  );
}
