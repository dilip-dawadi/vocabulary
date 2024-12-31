CREATE TABLE "words_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"romanNepaliWord" text NOT NULL,
	"romanNepaliMeaning" text NOT NULL,
	"meaning" text NOT NULL,
	"synonyms" text[] DEFAULT '{}',
	"understood" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
