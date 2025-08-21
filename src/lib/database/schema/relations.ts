import {relations} from "drizzle-orm";
import {players} from "./players";
import {gamePlayers, games} from "./games";
import {rounds} from "./rounds";
import {scores} from "./scores";

// Games
export const gamesRelations = relations(games, ({one, many}) => ({
    host: one(players, {fields: [games.hostId], references: [players.id]}),
    winner: one(players, {fields: [games.winnerId], references: [players.id]}),
    players: many(gamePlayers),
    rounds: many(rounds),
}));

// GamePlayers
export const gamePlayersRelations = relations(gamePlayers, ({one}) => ({
    game: one(games, {fields: [gamePlayers.gameId], references: [games.id]}),
    player: one(players, {fields: [gamePlayers.playerId], references: [players.id]}),
}));

// Rounds
export const roundsRelations = relations(rounds, ({one, many}) => ({
    game: one(games, {fields: [rounds.gameId], references: [games.id]}),
    scores: many(scores),
}));

// Players
export const playersRelations = relations(players, ({many}) => ({
    scores: many(scores),
    games: many(gamePlayers),
}));

// Scores
export const scoresRelations = relations(scores, ({one}) => ({
    round: one(rounds, {fields: [scores.roundId], references: [rounds.id]}),
    player: one(players, {fields: [scores.playerId], references: [players.id]}),
}));
