"use server";

import database from "../client";
import { scores } from "../schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// Types
export type ScoreEntry = {
    id: string;
    roundId: string;
    playerId: string;
    score: number;
};

// Add score entry manually
export async function addScore(roundId: string, playerId: string, score: number) {
    const [entry] = await database.insert(scores).values({
        id: uuid(),
        roundId,
        playerId,
        score,
    }).returning();

    return entry;
}

// Update score value
export async function updateScore(scoreId: string, newValue: number) {
    const [entry] = await database.update(scores)
        .set({ score: newValue, updatedAt: new Date() })
        .where(eq(scores.id, scoreId))
        .returning();

    return entry;
}

// Delete score
export async function deleteScore(scoreId: string) {
    return database.delete(scores).where(eq(scores.id, scoreId));
}

// Get all scores for a round
export async function getScoresByRound(roundId: string) {
    return database.query.scores.findMany({
        where: (s, { eq }) => eq(s.roundId, roundId),
    });
}

// Get all scores for a player
export async function getScoresByPlayer(playerId: string) {
    return database.query.scores.findMany({
        where: (s, { eq }) => eq(s.playerId, playerId),
    });
}
