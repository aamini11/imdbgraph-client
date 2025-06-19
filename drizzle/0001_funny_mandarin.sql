ALTER TABLE "show" RENAME COLUMN "primary_title" TO "title";--> statement-breakpoint
ALTER TABLE "show" RENAME COLUMN "imdb_rating" TO "rating";--> statement-breakpoint
DROP INDEX "rating_index";--> statement-breakpoint
CREATE INDEX "rating_index" ON "show" USING btree ("rating" float8_ops);