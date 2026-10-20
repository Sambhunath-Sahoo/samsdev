import Image from "next/image";
import { CodeBlock } from "@/components/lesson/code-block";
import { InlineText } from "@/components/lesson/inline-text";
import { slugify } from "@/lib/roadmap/lessons";
import type { Lesson, LessonBlock } from "@/types/roadmap";

const CALLOUT_STYLE = {
  tip: { label: "Tip", bar: "border-[var(--app)]", text: "accent-text" },
  gotcha: { label: "Gotcha", bar: "border-danger", text: "text-danger" },
  cost: { label: "Cost", bar: "border-[var(--c-yellow)]", text: "text-[var(--c-yellow-ink)]" },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={slugify(block.text)} className="mt-12 scroll-mt-28 text-2xl tracking-tight first:mt-0">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mt-4 max-w-[78ch] text-[1.0625rem] leading-[1.75] text-muted">
          <InlineText text={block.text} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`mt-4 max-w-[78ch] space-y-2 pl-6 text-[1.0625rem] leading-[1.7] text-muted marker:text-[var(--app)] ${block.ordered ? "list-decimal" : "list-[square]"}`}>
          {block.items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return <CodeBlock language={block.language} code={block.code} title={block.title} />;
    case "callout": {
      const style = CALLOUT_STYLE[block.tone];
      return (
        <aside className={`my-6 max-w-[78ch] border border-line border-l-2 bg-bg-raised p-4 ${style.bar}`}>
          <p className={`hud ${style.text}`}>
            {style.label} · {block.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    }
    case "table":
      return (
        <div className="my-6 overflow-x-auto border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-bg-sunken">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="hud border-b border-line px-4 py-2.5 text-faint">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-line last:border-b-0">
                  {row.map((cell, i) => (
                    <td key={`${i}-${cell}`} className={`px-4 py-2.5 align-top ${i === 0 ? "font-medium text-ink" : "text-muted"}`}>
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "figure":
      return (
        <figure className="my-8 border border-line bg-bg-raised">
          <Image src={block.src} alt={block.alt} width={block.width} height={block.height} unoptimized className="h-auto w-full" />
          <figcaption className="border-t border-line px-4 py-2.5 text-sm text-muted">{block.caption}</figcaption>
        </figure>
      );
  }
}

export function LessonBlocks({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      {lesson.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
