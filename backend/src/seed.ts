import { drizzle } from "drizzle-orm/node-postgres";
import { wordsTable } from "./schema.js";
import { config } from "dotenv";
import { readFile } from "fs/promises";
import { URL } from "url";
import pkg from "pg";
const jsonData = JSON.parse(
  await readFile(new URL("./json/vocabulary.json", import.meta.url), "utf-8")
);
const { Pool } = pkg;

config({ path: ".env" });

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  const data: (typeof wordsTable.$inferInsert)[] = jsonData.map(
    (entry: any) => ({
      word: entry.word,
      meaning: entry.meaning,
      romanNepaliWord: entry.romanNepaliWord,
      romanNepaliMeaning: entry.romanNepaliMeaning,
      synonyms: entry.synonyms || [], // Default to empty array if no synonyms are provided
      understood: false, // Default to false if not provided
    })
  );

  console.log("Seed start", data);
  await db.insert(wordsTable).values(data);
  console.log("Seed done");
};

main();
