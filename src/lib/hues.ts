export const HUES = ["blue", "orange", "purple", "yellow", "teal", "pink", "green"] as const;

export type Hue = (typeof HUES)[number];

/** Cycles through the seven area hues so sibling cells never share a colour. */
export function hueClass(index: number): string {
  return `hue-${HUES[index % HUES.length]}`;
}

/** "01", "02", … for the numbered badges. */
export function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
