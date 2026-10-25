import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Band, Bullet, CARD, TAG, TAG_ON } from "@/components/section-shell";
import type { DetailedProject } from "@/types/content";
import { padIndex } from "@/lib/hues";
import { projectStatus, projectStatusLabel } from "@/lib/project-status";
import { cn } from "@/lib/utils";

function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/").split("&")[0];
  if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/").split("?")[0];
  if (url.includes("vimeo.com/")) return url.replace("vimeo.com/", "player.vimeo.com/video/");
  return url;
}

function Media({ project }: { project: DetailedProject }) {
  const embedUrl = toEmbedUrl(project.videoUrl);

  if (embedUrl) {
    return (
      <div className="aspect-video w-full bg-bg-sunken">
        <iframe
          src={embedUrl}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (project.image) {
    return (
      <div className="relative aspect-[4/3] w-full bg-bg-sunken">
        <Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" priority />
      </div>
    );
  }

  return (
    <div className="grid aspect-[4/3] w-full place-items-center bg-bg-sunken font-display text-7xl text-faint">
      {project.title.charAt(0)}
    </div>
  );
}

export function ProjectDetail({ project }: { project: DetailedProject }) {
  const gallery = project.gallery ?? [];
  const features = project.features ?? [];
  const tech = project.tech ?? [];
  const hasBody = Boolean(project.fullDescription) || features.length > 0;
  const hasGallery = gallery.length > 0;
  const detailsTone = hasGallery ? "lav" : "ink";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Band tone="lav" hero>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex min-w-0 flex-col">
              <Link href="/projects" className="hud inline-flex items-center gap-1.5 text-muted hover:text-ink">
                <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> All projects
              </Link>
              <p className="hud mt-6 text-muted">Chapter 01 / Project · {project.subtitle}</p>
              <h1 className="pub-h1 mt-4 !text-[clamp(2rem,6vw,4rem)]">{project.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{project.description}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                <span className={cn(TAG, projectStatus(project) === "live" && TAG_ON)}>{projectStatusLabel(project)}</span>
                {tech.map((item) => (
                  <span key={item} className={TAG}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                {project.links?.live ? (
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    View live <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </a>
                ) : (
                  <span className="hud text-muted">Live link coming soon</span>
                )}
                {project.links?.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                )}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-line-strong">
              <Media project={project} />
            </div>
          </div>
        </Band>

        {hasGallery && (
          <Band tone="ink">
            <p className="hud mb-6 text-muted">
              Chapter 02 / Gallery · {gallery.length} screenshot{gallery.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, i) => (
                <figure key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-bg-sunken">
                  <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                </figure>
              ))}
            </div>
          </Band>
        )}

        <Band tone={detailsTone}>
          <p className="hud mb-6 text-muted">Chapter {hasGallery ? "03" : "02"} / Details · What it does and how it is built</p>
          <div className={cn("grid gap-4", hasBody && "lg:grid-cols-[2fr_1fr]")}>
            {hasBody && (
              <div className={CARD}>
                {project.fullDescription && (
                  <>
                    <p className="hud text-muted">About the project</p>
                    <p className="mt-4 max-w-[65ch] leading-[1.7] text-ink">{project.fullDescription}</p>
                  </>
                )}

                {features.length > 0 && (
                  <div className={project.fullDescription ? "mt-10" : ""}>
                    <p className="hud text-muted">Key features</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {features.map((feature, i) => (
                        <div key={feature} className="flex gap-3 rounded-xl border border-line p-4 sm:[&:last-child:nth-child(odd)]:col-span-2">
                          <span className="font-display text-xl leading-none text-accent-ink">{padIndex(i)}</span>
                          <span className="text-sm leading-relaxed text-ink">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={CARD}>
              <p className="hud text-muted">Stack</p>
              <ul className="mt-4 grid gap-2.5 text-ink">
                {tech.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Bullet />
                    <span className="font-mono text-sm tracking-[0.04em]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Band>
      </main>
      <Footer />
    </div>
  );
}
