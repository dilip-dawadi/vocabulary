import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core"; // Import necessary functions and types

// Define the 'words_table' with the desired columns
export const wordsTable = pgTable("words_table", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  word: text("word").notNull(), // Word column (text, cannot be null)
  romanNepaliWord: text("romanNepaliWord").notNull(),
  romanNepaliMeaning: text("romanNepaliMeaning").notNull(),
  meaning: text("meaning").notNull(), // Meaning column (text, cannot be null)
  synonyms: text("synonyms").array().default([]), // Synonyms stored as an array of text, defaults to empty array
  understood: boolean("understood").default(false), // If the user has understood the word, defaults to false
  created_at: timestamp("created_at").defaultNow(), // Timestamp for when the word was created, defaults to current time
});

// Type inference for insert and select operations
export type InsertWord = typeof wordsTable.$inferInsert; // Type for inserting into 'words_table'
export type SelectWord = typeof wordsTable.$inferSelect; // Type for selecting from 'words_table'
