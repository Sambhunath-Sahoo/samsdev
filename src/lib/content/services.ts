import { client } from "@/lib/sanity/client";
import { SERVICES_QUERY } from "@/lib/sanity/queries";
import type { SanityServiceItem } from "@/types/content";

export async function getServices(): Promise<SanityServiceItem[]> {
  return client.fetch<SanityServiceItem[]>(SERVICES_QUERY);
}
