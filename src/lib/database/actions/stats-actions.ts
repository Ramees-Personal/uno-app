"use server";

import { sql } from "drizzle-orm";
import database from "../client";
import { games, scores } from "../schema";

export type GlobalStats = {
    totalPlayers: number;
    totalGames: number;
    totalRounds: number;
    totalScores: number;
    avgScorePerGame: number;
};

export async function getGlobalStats(): Promise<GlobalStats> {
    const result = await database.execute<GlobalStats>(sql`
    SELECT
      (SELECT COUNT(*) FROM players) as "totalPlayers",
      (SELECT COUNT(*) FROM games) as "totalGames",
      (SELECT COUNT(*) FROM rounds) as "totalRounds",
      (SELECT COUNT(*) FROM scores) as "totalScores",
      COALESCE((SELECT AVG(sub.total) FROM (
        SELECT SUM(score) as total FROM scores GROUP BY round_id
      ) sub), 0) as "avgScorePerGame"
  `);

    return result[0];
}
