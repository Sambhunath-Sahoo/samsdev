import { neon } from "@neondatabase/serverless";

/** One place that reads DATABASE_URL, so a missing value fails with a clear message. */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}
