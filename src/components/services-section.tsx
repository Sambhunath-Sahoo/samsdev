import Link from "next/link";
import { Rail, SectionBar, SectionHead } from "@/components/section-shell";
import { getServices } from "@/lib/content/services";
import { hueClass, padIndex } from "@/lib/hues";

export async function ServicesSection({ index = "04" }: { index?: string }) {
  const services = await getServices();
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-12">
      <Rail>
        <SectionBar index={index} label="Services" aside="What I can take on" />
        <SectionHead title="Services" description="What you can hire me to build." />

        <div className="cell-grid sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => (
            <div key={service._id} className={`cell flex min-h-[150px] flex-col ${hueClass(i)}`}>
              <span className="hud num self-start">{padIndex(i)}</span>
              <h3 className="mt-4 text-xl tracking-[-0.02em]">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.desc}</p>
            </div>
          ))}

          <div className="cell flex flex-col justify-center">
            <p className="hud text-faint">Something else?</p>
            <h3 className="mt-3 text-xl tracking-[-0.02em]">
              Tell me the <span className="accent-text">problem</span>
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              If it needs to scale, perform and not break, it is probably in scope.
            </p>
            <Link href="/#contact" className="btn btn-secondary btn-sm mt-4">
              Get in touch
            </Link>
          </div>
        </div>
      </Rail>
    </section>
  );
}
