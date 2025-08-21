"use client";

import React, {useEffect} from "react";
import {getLeaderboard, PlayerStatistics} from "@/lib/database/actions/leaderboard-actions";
import PlayerItem from "@/components/player-item";
import Loader from "@/components/Loader";

const TopPlayers = () => {
    const [players, setPlayers] = React.useState<PlayerStatistics[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getLeaderboard("score", 5);
                setPlayers(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader/>
            </div>
        );
    }

    if (players.length === 0) {
        return (
            <div className="flex justify-center items-center h-32 text-gray-500">
                No players yet. Be the first to score!
            </div>
        );
    }

    return (
        <div className="px-4 py-2">
            <h2 className="text-lg font-bold mb-2">Top Players</h2>
            <div
                className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {players.map((player) => (
                    <PlayerItem
                        key={player.playerId} player={player}/>
                ))}
            </div>
        </div>
    );
};

export default TopPlayers;
