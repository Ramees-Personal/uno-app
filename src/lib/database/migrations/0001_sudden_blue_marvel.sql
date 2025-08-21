ALTER TABLE "rounds" DROP CONSTRAINT "rounds_winner_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "rounds" DROP COLUMN "winner_id";