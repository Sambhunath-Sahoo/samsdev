"use client";

import { useState } from "react";

/** One text toggle that opens or closes every section and subsection row (not individual points). */
export function ExpandControls() {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleAll() {
    const next = !isExpanded;
    document.querySelectorAll<HTMLDetailsElement>("details[data-collapsible]").forEach((el) => {
      el.open = next;
    });
    setIsExpanded(next);
  }

  return (
    <button type="button" onClick={toggleAll} className="rounded-md px-1 text-sm font-semibold text-accent-ink hover:underline">
      {isExpanded ? "Collapse all sections" : "Expand all sections"}
    </button>
  );
}
