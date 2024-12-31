import { db } from "../db.js";
import { wordsTable } from "../schema.js";
export async function createWord(data) {
    await db.insert(wordsTable).values(data);
}
