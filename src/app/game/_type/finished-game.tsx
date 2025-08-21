'use client';

import React from 'react';
import {GameDetails} from '@/lib/database/actions';

interface FinishedGamePageProps {
    gameDetails: GameDetails;
}

const FinishedGamePage: React.FC<FinishedGamePageProps> = ({gameDetails}) => {

    const {game, players, rounds} = gameDetails;

    // Calculate total scores per player
    const playerTotals = players.map((p) => {
        const total = rounds.reduce((acc, r) => {
            const score = r.scores.find((s) => s.playerId === p.id)?.score || 0;
            return acc + score;
        }, 0);
        return {...p, total};
    });

    const sortedPlayers = [...playerTotals].sort((a, b) => b.total - a.total);

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">{game.id}</h1>
                <span className="text-green-600 font-semibold">Finished</span>
            </div>

            {/* Stats Overview */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
                <div className="p-4 bg-background border rounded-md min-w-[120px] text-center">
                    <div className="font-semibold">Rounds</div>
                    <div>{rounds.length}</div>
                </div>
                <div className="p-4 bg-background border rounded-md min-w-[120px] text-center">
                    <div className="font-semibold">Players</div>
                    <div>{players.length}</div>
                </div>
                <div className="p-4 bg-background border rounded-md min-w-[120px] text-center">
                    <div className="font-semibold">Top Score</div>
                    <div>{sortedPlayers[0].total}</div>
                </div>
            </div>

            {/* Player Rankings */}
            <div>
                <h2 className="font-semibold mb-2">Final Rankings</h2>
                <div className="space-y-2">
                    {sortedPlayers.map((p, idx) => (
                        <div key={p.id} className="flex justify-between p-3 bg-background border rounded-md">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold">{idx + 1}.</span>
                                <span>{p.name}</span>
                            </div>
                            <div className="font-semibold">{p.total}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rounds List */}
            <div>
                <h2 className="font-semibold mb-2">Rounds</h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {rounds.map((r) => (
                        <div key={r.round.id} className="min-w-[200px] p-4 bg-background border rounded-md">
                            <div className="font-semibold mb-2">Round {r.round.roundNumber}</div>
                            {players.map((p) => {
                                const score = r.scores.find((s) => s.playerId === p.id)?.score || 0;
                                return (
                                    <div key={p.id} className="flex justify-between text-sm">
                                        <span>{p.name}</span>
                                        <span>{score}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinishedGamePage;
