"use server";

import database from "../client";
import {gamePlayers, players, scores} from "../schema";
import {eq, ilike, sql} from "drizzle-orm";
import {v4 as uuid} from "uuid";

export type PlayerStats = {
    player: typeof players.$inferSelect;
    gamesPlayed: number;
    highestScore: number;
    lowestScore: number;
    weeklyScores: { week: string; total: number }[];
};

export async function getPlayerStats(userId: string): Promise<PlayerStats | null> {
    const player = await database.query.players.findFirst({
        where: eq(players.userId, userId),
    });

    if (!player) return null;

    const gamesPlayed = await database.query.gamePlayers.findMany({
        where: eq(gamePlayers.playerId, player.id),
    });

    const scoresList = await database.query.scores.findMany({
        where: eq(scores.playerId, player.id),
    });

    const highestScore = scoresList.length
        ? Math.max(...scoresList.map((s) => s.score))
        : 0;

    const lowestScore = scoresList.length
        ? Math.min(...scoresList.map((s) => s.score))
        : 0;

    // group weekly scores
    const weeklyScores =
        await database.execute<{
            week: string;
            total: number;
        }>(sql`
      SELECT TO_CHAR(created_at, 'IYYY-IW') as week, SUM(score) as total
      FROM scores
      WHERE player_id = ${player.id}
      GROUP BY week
      ORDER BY week DESC
    `);

    return {
        player,
        gamesPlayed: gamesPlayed.length,
        highestScore,
        lowestScore,
        weeklyScores: weeklyScores,
    };
}

export async function createPlayer(userId: string, name: string, email: string, avatarUrl?: string) {
    const [player] = await database.insert(players).values({
        id: uuid(),
        userId,
        name,
        email,
        avatarUrl,
    }).returning();

    return player;
}

export async function updatePlayer(userId: string, name?: string, email?: string, avatarUrl?: string) {
    const [player] = await database.update(players)
        .set({
            name: name,
            email: email,
            avatarUrl: avatarUrl,
            updatedAt: new Date(),
        })
        .where(eq(players.userId, userId))
        .returning();

    return player;
}

export async function getPlayerByUserId(userId: string) {
    return database.query.players.findFirst({
        where: eq(players.userId, userId),
    });
}

export async function getPlayers(options?: { search?: string; limit?: number; offset?: number }) {
    const query = database.select().from(players);

    if (options?.search) {
        query.where(
            sql`${ilike(players.name, `%${options.search}%`)} OR ${ilike(players.email, `%${options.search}%`)}`
        );
    }

    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.offset(options.offset);

    return query;
}