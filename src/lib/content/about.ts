import { client } from "@/lib/sanity/client";
import { ABOUT_QUERY } from "@/lib/sanity/queries";
import type { SanityAbout } from "@/types/content";

export async function getAbout(): Promise<SanityAbout | null> {
  return client.fetch<SanityAbout | null>(ABOUT_QUERY);
}
