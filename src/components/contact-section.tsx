import { Band } from "@/components/section-shell";
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
    <Band tone="lav" id="contact" className="!py-16 md:!py-24">
      <div className="flex flex-col items-center text-center">
        <p className="hud text-muted">Chapter {index} / Contact · Replies within a day</p>
        <h2 className="pub-h2 mt-4 max-w-4xl !text-[clamp(2rem,6vw,3.75rem)]">
          Let&apos;s connect to build <span className="pub-serif">your next idea</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Freelance builds, full-time roles, or a second opinion on an architecture. Pick whichever is easiest.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Book a call
          </a>
          <a href={`mailto:${email}`} className="btn btn-secondary">
            Email me
          </a>
        </div>

        <div className="mt-7 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-3xl border border-line-strong px-4 py-1.5">
          <span className="hud text-muted">Email</span>
          <code className="select-all break-all font-mono text-[13px] text-ink">{email}</code>
          <CopyButton value={email} className="rounded-full px-3 py-1.5" />
        </div>
      </div>
    </Band>
  );
}
