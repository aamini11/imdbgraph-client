CREATE EXTENSION pg_trgm;
--> statement-breakpoint
CREATE TABLE "episode" (
	"show_id" varchar(10) NOT NULL,
	"episode_id" varchar(10) PRIMARY KEY NOT NULL,
	"episode_title" text,
	"season_num" integer NOT NULL,
	"episode_num" integer NOT NULL,
	"imdb_rating" double precision NOT NULL,
	"num_votes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "show" (
	"imdb_id" varchar(10) PRIMARY KEY NOT NULL,
	"primary_title" text NOT NULL,
	"start_year" char(4),
	"end_year" char(4),
	"imdb_rating" double precision DEFAULT 0 NOT NULL,
	"num_votes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temp_episode" (
	"episode_id" varchar(10),
	"show_id" varchar(10),
	"season_num" integer,
	"episode_num" integer
);
--> statement-breakpoint
CREATE TABLE "temp_ratings" (
	"imdb_id" varchar(10) PRIMARY KEY NOT NULL,
	"imdb_rating" double precision,
	"num_votes" integer
);
--> statement-breakpoint
CREATE TABLE "temp_title" (
	"imdb_id" varchar(10),
	"title_type" text,
	"primary_title" text,
	"original_title" text,
	"is_adult" boolean,
	"start_year" char(4),
	"end_year" char(4),
	"runtime_minutes" integer,
	"genres" text
);
--> statement-breakpoint
CREATE TABLE "thumbnails" (
	"imdb_id" varchar(10) PRIMARY KEY NOT NULL,
	"thumbnail_url" text
);
--> statement-breakpoint
ALTER TABLE "episode" ADD CONSTRAINT "episode_new_show_id_fkey1" FOREIGN KEY ("show_id") REFERENCES "public"."show"("imdb_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thumbnails" ADD CONSTRAINT "thumbnails_show_imdb_id_fk" FOREIGN KEY ("imdb_id") REFERENCES "public"."show"("imdb_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "episode_index" ON "episode" USING btree ("show_id" text_ops);--> statement-breakpoint
CREATE INDEX "rating_index" ON "show" USING btree ("imdb_rating" float8_ops);