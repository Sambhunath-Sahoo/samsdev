import { Fragment } from "react";

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

/** Renders `code` and **bold** inside a plain string. Everything else stays text. */
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code key={i} className="rounded-md bg-tint-mauve px-1.5 py-0.5 font-mono text-[0.85em] text-ink [overflow-wrap:anywhere]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
