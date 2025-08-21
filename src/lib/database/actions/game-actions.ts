"use server";

import database from "../client";
import {gamePlayers, games, players, rounds, scores} from "../schema";
import {and, eq, inArray} from "drizzle-orm";
import {v4 as uuid} from "uuid";

export type GameDetails = {
    game: typeof games.$inferSelect;
    players: (typeof players.$inferSelect)[];
    rounds: {
        round: typeof rounds.$inferSelect;
        scores: (typeof scores.$inferSelect)[];
    }[];
};

export async function getGameDetails(gameId: string): Promise<GameDetails | null> {
    const game = await database.query.games.findFirst({
        where: eq(games.id, gameId),
    });

    if (!game) return null;

    const gamePlayersList = await database.query.gamePlayers.findMany({
        where: eq(gamePlayers.gameId, gameId),
        with: {player: true},
    });

    const roundsList = await database.query.rounds.findMany({
        where: eq(rounds.gameId, gameId),
        with: {scores: true},
    });

    return {
        game,
        players: gamePlayersList.map((gp) => gp.player),
        rounds: roundsList.map((r) => ({
            round: r,
            scores: r.scores,
        })),
    };
}
export async function createGame(hostId: string, players: string[]) {
    if (players.length < 2) {
        throw new Error("At least two players are required");
    }

    return await database.transaction(async (tx) => {
        const [newGame] = await tx.insert(games).values({
            id: uuid(),
            hostId,
        }).returning();

        for (const playerId of players) {
            await tx.insert(gamePlayers).values({
                gameId: newGame.id,
                playerId,
                isHost: playerId === hostId,
            });
        }

        return newGame; // return the game from transaction
    });
}
export async function addPlayerToGame(gameId: string, playerId: string) {
    const existing = await database.query.gamePlayers.findFirst({
        where: (gp, {eq, and}) =>
            and(eq(gp.gameId, gameId), eq(gp.playerId, playerId)),
    });

    if (existing) return existing;
    const roundsForGame = await database.query.rounds.findMany({
        where: eq(rounds.gameId, gameId),
        with: {
            scores: true, // 👈 pulls in all scores for each round
        },
    });
    for (const round of roundsForGame) {
        if (round.scores.length > 0) {
            const avg = Math.round(
                round.scores.reduce((sum, s) => sum + s.score, 0) / round.scores.length
            );

            await database.insert(scores).values({
                roundId: round.id,
                playerId,
                score: avg,
            });
        }
    }
    const [entry] = await database.insert(gamePlayers).values({
        gameId,
        playerId,
    }).returning();

    return entry;
}

export async function removePlayerFromGame(gameId: string, playerId: string) {
    await database.delete(scores).where(
        and(
            eq(scores.playerId, playerId),
            // only scores belonging to rounds in this game
            inArray(
                scores.roundId,
                database
                    .select({id: rounds.id})
                    .from(rounds)
                    .where(eq(rounds.gameId, gameId))
            )
        )
    );
    await database
        .delete(gamePlayers)
        .where(
            and(
                eq(gamePlayers.gameId, gameId),
                eq(gamePlayers.playerId, playerId)
            )
        );
}

export async function finishGame(gameId: string, winnerId: string | null) {
    const [game] = await database.update(games)
        .set({
            status: "finished",
            winnerId,
            updatedAt: new Date(),
        })
        .where(eq(games.id, gameId))
        .returning();

    return game;
}


// Get all active games
export async function getActiveGames() {
    return database.query.games.findMany({
        where: (g, {eq}) => eq(g.status, "active"),
        orderBy: (g, {desc}) => desc(g.createdAt),
    });
}

// Get recently finished games
export async function getFinishedGames(limit?: number) {
    return database.query.games.findMany({
        where: (g, {eq}) => eq(g.status, "finished"),
        orderBy: (g, {desc}) => desc(g.updatedAt),
        limit: limit ?? undefined,
    });
}

// Get all games for a player
export async function getPlayerGames(playerId: string) {
    return database.query.gamePlayers.findMany({
        where: (gp, {eq}) => eq(gp.playerId, playerId),
        with: {
            game: true,
        },
    });
}
