import {index, integer, pgTable, timestamp, uniqueIndex, uuid} from "drizzle-orm/pg-core";
import {games} from "./games";
import {players} from "./players";

export const rounds = pgTable(
    "rounds",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        gameId: uuid("game_id").notNull().references(() => games.id, {onDelete: "cascade"}),
        roundNumber: integer("round_number").notNull(),
        createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {withTimezone: true})
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex("uq_game_roundno").on(t.gameId, t.roundNumber),
        index("idx_rounds_game").on(t.gameId),
    ]
);

export type Rounds = typeof rounds.$inferSelect;
