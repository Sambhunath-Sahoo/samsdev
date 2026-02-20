import { createClient } from "next-sanity";

import { sanityDataset, sanityProjectId } from "./env";

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});
