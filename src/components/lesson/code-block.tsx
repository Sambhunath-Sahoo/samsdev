import { CopyButton } from "@/components/copy-button";
import { highlight, type TokenKind } from "@/lib/roadmap/highlight";

/** One Dark Pro palette. The window stays dark in both site themes. */
const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: "",
  comment: "italic text-[#5c6370]",
  string: "text-[#98c379]",
  keyword: "font-semibold text-[#c678dd]",
  flag: "text-[#61afef]",
};

export function CodeBlock({ language, code, title }: { language: string; code: string; title?: string }) {
  const label = title ?? language;
  return (
    <figure className="my-4 overflow-hidden rounded-lg border border-[#181a1f] bg-[#282c34]">
      <figcaption className="flex items-center gap-3 border-b border-[#181a1f] bg-[#21252b] px-3 py-1.5">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-[#7f848e]">{label}</span>
        <CopyButton value={code} className="px-2 py-0.5 !text-[#abb2bf]" />
      </figcaption>
      <pre tabIndex={0} aria-label={`${label} code`} className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-[1.6] text-[#abb2bf]">
        <code>
          {highlight(code, language).map((token, i) => (
            <span key={i} className={TOKEN_CLASS[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
