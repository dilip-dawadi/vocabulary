// src/types.ts
export type VocabularyItemType = {
  id: number;
  word: string;
  meaning: string;
  romanNepaliMeaning: string;
  romanNepaliWord: string;
  synonyms: string[];
  understood: boolean;
};
