import { db } from "../db.js";
import { wordsTable, InsertWord } from "../schema.js";

export async function createWord(data: InsertWord) {
  await db.insert(wordsTable).values(data);
}
