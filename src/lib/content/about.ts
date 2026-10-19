import { client } from "@/lib/sanity/client";
import { ABOUT_QUERY } from "@/lib/sanity/queries";
import { RESUME_ABOUT } from "@/data/resume";
import type { SanityAbout } from "@/types/content";

/** Sanity supplies nickname, location and the long bio; resume fields win where set. */
export async function getAbout(): Promise<SanityAbout | null> {
  const remote = await client.fetch<SanityAbout | null>(ABOUT_QUERY, {}, { next: { revalidate: 2 } });
  if (!remote) return null;
  return { ...remote, ...RESUME_ABOUT };
}
