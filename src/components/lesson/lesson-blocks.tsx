import Image from "next/image";
import { CodeBlock } from "@/components/lesson/code-block";
import { InlineText } from "@/components/lesson/inline-text";
import { slugify } from "@/lib/roadmap/lessons";
import type { Lesson, LessonBlock } from "@/types/roadmap";

const CALLOUT_STYLE = {
  tip: { label: "Tip", box: "bg-tint-lav", text: "text-accent-ink" },
  gotcha: { label: "Gotcha", box: "bg-warn-bg", text: "text-danger" },
  cost: { label: "Cost", box: "bg-tint-sand", text: "text-warn-fg" },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={slugify(block.text)} className="mt-8 scroll-mt-24 text-xl first:mt-0">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mt-3 max-w-[78ch] text-[0.9375rem] leading-[1.65] text-muted">
          <InlineText text={block.text} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`mt-3 max-w-[78ch] space-y-1.5 pl-5 text-[0.9375rem] leading-[1.6] text-muted marker:text-accent ${block.ordered ? "list-decimal" : "list-[square]"}`}>
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
        <aside className={`my-5 max-w-[78ch] rounded-lg p-3.5 ${style.box}`}>
          <p className={`eyebrow ${style.text}`}>
            {style.label} · {block.title}
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    }
    case "table":
      return (
        <div className="my-5 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left text-[0.8125rem]">
            <thead className="bg-tint-lav">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="eyebrow border-b border-line px-3 py-2">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-line last:border-b-0">
                  {row.map((cell, i) => (
                    <td key={`${i}-${cell}`} className={`px-3 py-2 align-top ${i === 0 ? "font-medium text-ink" : "text-muted"}`}>
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
        <figure className="my-6 overflow-hidden rounded-lg border border-line bg-bg-raised">
          <Image src={block.src} alt={block.alt} width={block.width} height={block.height} unoptimized className="h-auto w-full" />
          <figcaption className="border-t border-line px-3 py-2 text-xs text-muted">{block.caption}</figcaption>
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
