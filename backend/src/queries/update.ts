import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { wordsTable } from "../schema.js";

export async function updateWordQuery(id: number, data: boolean) {
  await db
    .update(wordsTable)
    .set({ understood: !data })
    .where(eq(wordsTable.id, id));

  const updatedRecord = await db
    .select()
    .from(wordsTable)
    .where(eq(wordsTable.id, id))
    .limit(1);

  return updatedRecord[0];
}
