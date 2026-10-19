// Creates the tables in db/schema.sql in the Neon database named by DATABASE_URL (safe to re-run).
// Run: node --env-file=.env.local scripts/db-setup.mjs
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const statements = schema
  .replace(/^\s*--.*$/gm, "")
  .split(";")
  .map((part) => part.trim())
  .filter(Boolean);

const sql = neon(url);
for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Schema is ready (${statements.length} statements).`);
