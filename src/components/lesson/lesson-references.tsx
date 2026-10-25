import { ExternalLink } from "lucide-react";
import type { LessonReference } from "@/types/roadmap";

/** "Further reading" list shown after the lesson body. */
export function LessonReferences({ references }: { references: readonly LessonReference[] }) {
  if (references.length === 0) return null;
  return (
    <section aria-labelledby="further-reading" className="mt-8 border-t border-line pt-4">
      <h2 id="further-reading" className="text-lg">
        Further reading
      </h2>
      <ul className="mt-2 space-y-1.5">
        {references.map((reference) => (
          <li key={reference.url}>
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-[0.8125rem] text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{reference.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
