import { ArrowUpRight } from "lucide-react";
import { getContacts } from "@/lib/content/contacts";
import { AvailabilityBadge } from "@/components/availability-badge";

export async function ContactSection() {
  const contacts = await getContacts();
  const contactEmail = contacts?.email ?? "sambhu05357@gmail.com";

  return (
    <section id="contact" className="py-24 px-6 bg-slate-100 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div>
          {/* Availability Badge */}
          <AvailabilityBadge
            layout="split"
            className="px-4 py-2 mb-10"
            dotClassName="bg-blue-500"
            text="AVAILABLE FOR PROJECTS"
            year="2026"
          />

          {/* Large Heading */}
          <h2 
            className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "clamp(42px, 7vw, 80px)" }}
          >
            LET&apos;S <span className="text-blue-600">CONNECT</span><br />
            <span className="text-slate-400 dark:text-slate-600">TO BUILD YOUR</span><br />
            NEXT <span className="text-blue-600">IDEA</span>
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              BOOK A CALL
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
            >
              EMAIL ME
            </a>
          </div>

          {/* Footer Link */}
          <div className="flex items-center gap-2 text-slate-900 dark:text-white text-xl font-medium">
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
