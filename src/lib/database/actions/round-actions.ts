"use server";

import database from "../client";
import {rounds, scores} from "../schema";
import {eq} from "drizzle-orm";
import {v4 as uuid} from "uuid";

// Types
export type RoundWithScores = {
    id: string;
    gameId: string;
    roundNumber: number;
    status: string;
    winnerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    scores: {
        playerId: string;
        score: number;
    }[];
};

// Create new round & initialize scores = 0 for all players
export async function createRound(gameId: string, roundNumber: number) {
    const [round] = await database.insert(rounds).values({
        id: uuid(),
        gameId,
        roundNumber,
        status: "pending",
    }).returning();

    // Get all players in the game
    const gamePlayers = await database.query.gamePlayers.findMany({
        where: (gp, {eq}) => eq(gp.gameId, gameId),
    });

    // Initialize scores = 0
    await database.insert(scores).values(
        gamePlayers.map((gp) => ({
            id: uuid(),
            roundId: round.id,
            playerId: gp.playerId,
            score: 0,
        }))
    );

    return round;
}

// End round & optionally assign winner
export async function endRound(roundId: string, winnerId?: string) {
    const [round] = await database.update(rounds)
        .set({
            status: "completed",
            winnerId: winnerId ?? null,
            updatedAt: new Date(),
        })
        .where(eq(rounds.id, roundId))
        .returning();

    return round;
}

// Get round details including scores
export async function getRoundDetails(roundId: string): Promise<RoundWithScores | null> {
    const round = await database.query.rounds.findFirst({
        where: (r, {eq}) => eq(r.id, roundId),
        with: {
            scores: true,
        },
    });

    if (!round) return null;

    return {
        ...round,
        scores: round.scores.map((s) => ({
            playerId: s.playerId,
            score: s.score,
        })),
    };
}

// Get all rounds in a game
export async function getRoundsForGame(gameId: string) {
    return database.query.rounds.findMany({
        where: (r, {eq}) => eq(r.gameId, gameId),
        orderBy: (r, {asc}) => asc(r.roundNumber),
        with: {
            scores: true,
        },
    });
}
