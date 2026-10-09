import { Rail } from "@/components/section-shell";
import { CopyButton } from "@/components/copy-button";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

const DEFAULT_EMAIL = "sambhu05357@gmail.com";
const DEFAULT_LINKEDIN = socials.find((s) => s.name === "LinkedIn")?.href ?? "";

export async function ContactSection({ index = "07" }: { index?: string }) {
  const contacts = await getContacts();
  const email = contacts?.email ?? DEFAULT_EMAIL;
  const linkedin = contacts?.linkedin ?? DEFAULT_LINKEDIN;

  return (
    <section id="contact" className="scroll-mt-12">
      <Rail>
        <div className="flex flex-col items-center px-6 py-20 text-center md:py-28">
          <p className="hud text-faint">
            {index} / Contact · Replies within a day
          </p>
          <h2 className="mt-6 max-w-4xl text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.98] tracking-[-0.04em]">
            Let&apos;s connect to build <span className="accent-text">your next idea</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Freelance builds, full-time roles, or a second opinion on an architecture. Pick whichever is easiest.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Book a call
            </a>
            <a href={`mailto:${email}`} className="btn btn-secondary">
              Email me
            </a>
          </div>

          <div className="strip mt-7">
            <span className="hud text-faint">Email</span>
            <span>
              <code className="select-all font-mono text-[13px] text-ink">{email}</code>
            </span>
            <CopyButton value={email} />
          </div>
        </div>
      </Rail>
    </section>
  );
}
