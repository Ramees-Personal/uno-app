"use server";

import { desc, eq, sql } from "drizzle-orm";
import database from "../client";
import { players, rounds, scores } from "../schema";

export type PlayerStatistics = {
    playerId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    totalScore: number;
    avgScore: number;
    highestScore: number;
    lowestScore: number;
    gamesPlayed: number;
    roundsPlayed: number;
    lastWeekScore: number;
};

export async function getLeaderboard(
    sortBy: "score" | "name" = "score",
    limit: number | null = 10
): Promise<PlayerStatistics[]> {
    const query = database
        .select({
            playerId: players.id,
            name: players.name,
            email: players.email,
            avatarUrl: players.avatarUrl,
            totalScore: sql<number>`COALESCE(SUM(${scores.score}), 0)`,
            avgScore: sql<number>`COALESCE(AVG(${scores.score}), 0)`,
            highestScore: sql<number>`COALESCE(MAX(${scores.score}), 0)`,
            lowestScore: sql<number>`COALESCE(MIN(${scores.score}), 0)`,
            gamesPlayed: sql<number>`COUNT(DISTINCT ${rounds.gameId})`,
            roundsPlayed: sql<number>`COUNT(${scores.roundId})`,
            lastWeekScore: sql<number>`
                COALESCE(SUM(
                    CASE WHEN ${scores.createdAt} >= NOW() - INTERVAL '7 days'
                    THEN ${scores.score}
                    ELSE 0 END
                ), 0)
            `,
        })
        .from(players)
        .leftJoin(scores, eq(players.id, scores.playerId))
        .leftJoin(rounds, eq(scores.roundId, rounds.id)) // ✅ missing join
        .groupBy(players.id)
        .orderBy(
            sortBy === "score"
                ? desc(sql`SUM(${scores.score})`)
                : players.name
        );

    if (limit) {
        query.limit(limit);
    }

    return query;
}
