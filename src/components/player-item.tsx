import React from 'react';
import { PlayerStatistics } from "@/lib/database/actions/leaderboard-actions";
import UserAvatar from "@/components/user-avatar";

const PlayerItem = ({ player }: { player: PlayerStatistics }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow w-full">

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <UserAvatar name={player.name} imageUrl={player.avatarUrl} size={40} />
                <div className="flex flex-col overflow-hidden">
                    <span className="text-md font-semibold truncate text-gray-900 dark:text-gray-100">{player.name}</span>
                    <span className="text-xs truncate text-gray-500 dark:text-gray-400">{player.email}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
                <Stat label="Score" value={player.totalScore} />
                <Stat label="Avg" value={Number(player.avgScore).toFixed(1)} />
                <Stat label="High" value={player.highestScore} />
                <Stat label="Low" value={player.lowestScore} />
                <Stat label="Games" value={player.gamesPlayed} />
                <Stat label="Rounds" value={player.roundsPlayed} />
                {player.lastWeekScore > 0 && <Stat label="Last Week" value={player.lastWeekScore} color="green" />}
            </div>
        </div>
    );
};

// Helper component for compact stats
const Stat = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div className={`flex flex-col items-center text-xs px-2 py-1 rounded ${color === "green" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}>
        <span className="font-semibold">{value}</span>
        <span>{label}</span>
    </div>
);

export default PlayerItem;
