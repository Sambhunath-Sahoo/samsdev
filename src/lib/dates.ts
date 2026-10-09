/** "2023-11" → "Nov 2023" */
export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** "2023-11" → "2023" */
export function yearOf(dateStr: string): string {
  return dateStr.slice(0, 4);
}

export function formatPeriod(start: string, end: string | null | undefined, isCurrent: boolean): string {
  const from = formatMonthYear(start);
  const to = isCurrent ? "Present" : end ? formatMonthYear(end) : "";
  return `${from} – ${to}`;
}

/** Short label for the cell eyebrow: "Current · 2023 →" or "2022 – 2023" */
export function periodLabel(start: string, end: string | null | undefined, isCurrent: boolean): string {
  if (isCurrent) return `Current · ${yearOf(start)} →`;
  return end ? `${yearOf(start)} – ${yearOf(end)}` : yearOf(start);
}
