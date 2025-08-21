import { pgTable, uuid, integer, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { rounds } from "./rounds";
import { players } from "./players";

export const scores = pgTable(
    "scores",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        roundId: uuid("round_id").notNull().references(() => rounds.id, { onDelete: "cascade" }),
        playerId: uuid("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
        score: integer("score").default(0).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex("uq_scores_round_player").on(t.roundId, t.playerId),
        index("idx_scores_round").on(t.roundId),
        index("idx_scores_player").on(t.playerId),
    ]
);

export type Scores = typeof scores.$inferSelect;
