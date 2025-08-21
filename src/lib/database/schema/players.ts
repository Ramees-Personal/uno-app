import {index, pgTable, text, timestamp, uniqueIndex, uuid} from "drizzle-orm/pg-core";

export const players = pgTable(
    "players",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: text("user_id").notNull(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        avatarUrl: text("avatar_url"),
        createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {withTimezone: true})
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex("uq_players_user").on(t.userId),
        uniqueIndex("uq_players_email").on(t.email),
        index("idx_players_name").on(t.name),
    ]
);

export type Players = typeof players.$inferSelect;
