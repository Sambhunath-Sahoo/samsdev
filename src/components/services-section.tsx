import Link from "next/link";
import { Band, BandHead, CARD } from "@/components/section-shell";
import { getServices } from "@/lib/content/services";
import { padIndex } from "@/lib/hues";

export async function ServicesSection({ index = "04" }: { index?: string }) {
  const services = await getServices();
  if (!services || services.length === 0) return null;

  return (
    <Band tone="ink" id="services">
      <BandHead eyebrow={`Chapter ${index} / What I can take on`} title="Services" lead="What you can hire me to build." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, i) => (
          <div key={service._id} className={`${CARD} flex min-h-[150px] flex-col`}>
            <span className="font-display text-4xl leading-none text-accent-ink">{padIndex(i)}</span>
            <h3 className="mt-4 font-display text-xl leading-tight text-ink-strong">{service.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.desc}</p>
          </div>
        ))}

        <div className={`${CARD} flex flex-col justify-center border-dashed`}>
          <p className="hud text-muted">Something else?</p>
          <h3 className="mt-3 font-display text-xl uppercase leading-tight text-ink-strong">
            Tell me the <span className="pub-serif text-[1.1em]">problem</span>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            If it needs to scale, perform and not break, it is probably in scope.
          </p>
          <Link href="/#contact" className="btn btn-secondary btn-sm mt-4">
            Get in touch
          </Link>
        </div>
      </div>
    </Band>
  );
}
