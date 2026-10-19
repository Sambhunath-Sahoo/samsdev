/** Shared classes for <details> rows. Group names are spelled out so Tailwind can see every class. */
export const summaryReset = "list-none cursor-pointer [&::-webkit-details-marker]:hidden";

const FLIP_WHEN_OPEN = {
  point: "group-open/point:rotate-180",
  sub: "group-open/sub:rotate-180",
  section: "group-open/section:rotate-180",
} as const;

/** Chevron that points down when closed and up when its <details> group is open. */
export function chevron(group: keyof typeof FLIP_WHEN_OPEN): string {
  return `shrink-0 transition-transform ${FLIP_WHEN_OPEN[group]}`;
}
