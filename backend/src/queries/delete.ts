import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { wordsTable } from "../schema.js";

export async function deleteWord(id: number) {
  await db.delete(wordsTable).where(eq(wordsTable.id, id));
}
