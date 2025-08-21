import {pgEnum} from "drizzle-orm/pg-core";

export const gameStatus = pgEnum("game_status", ["active", "finished"]);
