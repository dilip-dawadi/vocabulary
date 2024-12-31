import { count, eq, getTableColumns, sql } from "drizzle-orm";
import { between, asc } from "drizzle-orm";
import { db } from "../db.js";
import { SelectWord, wordsTable } from "../schema.js";

interface Word {
  id: number;
  word: string;
  meaning: string;
  romanNepaliWord: string;
  romanNepaliMeaning: string;
  synonyms: string[] | null;
  understood: boolean | null;
  created_at: Date | null;
}

export async function getTotalCount(): Promise<{ all: number, understood: number, ununderstood: number }> {
  const [allCount, understoodCount, ununderstoodCount] = await Promise.all([
    db
      .select({ count: count().as("count") })
      .from(wordsTable)
      .limit(1), // Count all words
    db
      .select({ count: count().as("count") })
      .from(wordsTable)
      .where(eq(wordsTable.understood, true)) // Count only understood words
      .limit(1),
    db
      .select({ count: count().as("count") })
      .from(wordsTable)
      .where(eq(wordsTable.understood, false)) // Count only ununderstood words
      .limit(1)
  ]);

  return {
    all: allCount[0]?.count ?? 0,
    understood: understoodCount[0]?.count ?? 0,
    ununderstood: ununderstoodCount[0]?.count ?? 0
  };
}


export async function getAllWords(
  page: number,
  pageSize = 5
): Promise<Array<Word>> {
  const [words] = await Promise.all([
    db
      .select()
      .from(wordsTable)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(asc(wordsTable.word)), // order by is mandatory
  ]);
  return words;
}

export async function getUnunderstoodWords(
  page: number,
  pageSize = 5
): Promise<Array<Word>> {
  const [words] = await Promise.all([
    db
      .select()
      .from(wordsTable)
      .where(eq(wordsTable.understood, false)) // Fetch words where understood is false
      .orderBy(asc(wordsTable.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  return words;
}

export async function getUnderstoodWords(
  page: number,
  pageSize = 5
): Promise<Array<Word>> {
  const [words] = await Promise.all([
    db
      .select({
        ...getTableColumns(wordsTable),
      })
      .from(wordsTable)
      .where(eq(wordsTable.understood, true)) // Fetch words where understood is true
      .orderBy(asc(wordsTable.word))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  return words;
}

export async function getWordsForLast24Hours(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    id: number;
    word: string;
    meaning: string;
    romanNepaliWord: string;
    romanNepaliMeaning: string;
    synonyms: string[] | null;
    understood: boolean | null;
    created_at: Date | null;
  }>
> {
  return db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
      meaning: wordsTable.meaning,
      romanNepaliWord: wordsTable.romanNepaliWord,
      romanNepaliMeaning: wordsTable.romanNepaliMeaning,
      synonyms: wordsTable.synonyms,
      understood: wordsTable.understood,
      created_at: wordsTable.created_at,
    })
    .from(wordsTable)
    .where(
      between(wordsTable.created_at, sql`now() - interval '1 day'`, sql`now()`)
    ) // Filter for the last 24 hours
    .orderBy(asc(wordsTable.created_at), asc(wordsTable.word))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
