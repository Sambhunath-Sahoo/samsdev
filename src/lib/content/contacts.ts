import { client } from "@/lib/sanity/client";
import { CONTACTS_QUERY } from "@/lib/sanity/queries";
import type { SanityContacts } from "@/types/content";

export async function getContacts(): Promise<SanityContacts | null> {
  return client.fetch<SanityContacts | null>(CONTACTS_QUERY);
}
