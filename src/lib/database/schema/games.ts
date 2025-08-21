import {pgTable, uuid, timestamp, index, uniqueIndex, boolean} from "drizzle-orm/pg-core";
import { gameStatus } from "./enums";
import { players } from "./players";

export const games = pgTable(
    "games",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        hostId: uuid("host_id").notNull().references(() => players.id, { onDelete: "cascade" }),
        status: gameStatus("status").default("active").notNull(),
        winnerId: uuid("winner_id").references(() => players.id),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index("idx_games_status").on(t.status),
        index("idx_games_host").on(t.hostId),
    ]
);

export const gamePlayers = pgTable(
    "game_players",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
        playerId: uuid("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
        isHost: boolean("is_host").default(false).notNull(),
        joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        uniqueIndex("uq_game_player").on(t.gameId, t.playerId),
        index("idx_game_players_game").on(t.gameId),
        index("idx_game_players_player").on(t.playerId),
    ]
);

export type Games = typeof games.$inferSelect;
export type GamePlayers = typeof gamePlayers.$inferSelect;
