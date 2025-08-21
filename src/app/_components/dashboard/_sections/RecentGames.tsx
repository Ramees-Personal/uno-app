'use client';

import React, { useEffect, useState } from 'react';
import { getPlayerByUserId, getPlayerGames } from '@/lib/database/actions';
import { UserResource } from '@clerk/types';
import { GamePlayers } from '@/lib/database/schema';
import Loader from '@/components/Loader';

interface Props {
    user: UserResource;
}

const RecentGames = ({ user }: Props) => {
    const [games, setGames] = useState<GamePlayers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            const player = await getPlayerByUserId(user.id);
            if (!player) {
                console.error('Player not found');
                setLoading(false);
                return;
            }
            const data = await getPlayerGames(player.id);
            setGames(data);
            setLoading(false);
        };
        fetchGames();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader />
            </div>
        );
    }

    if (!games.length) {
        return (
            <div className="text-center py-8">
                <span style={{ color: 'var(--text-primary)' }}>No recent games yet.</span>
            </div>
        );
    }

    return (
        <div className="py-4">
            <h2 className="mb-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Recent Games
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="flex-shrink-0 w-64 bg-[var(--accent)] rounded-xl p-4 shadow-md"
                    >
                        <div className="flex justify-between items-center mb-2">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Game ID
              </span>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {new Date(game.joinedAt).toLocaleDateString()}
              </span>
                        </div>
                        <div className="flex flex-col gap-1">
              <span style={{ color: 'var(--text-primary)' }}>
                Player ID: {game.playerId.slice(0, 6)}...
              </span>
                            <span style={{ color: 'var(--text-primary)' }}>
                Host: {game.isHost ? 'Yes' : 'No'}
              </span>
                        </div>
                        <div className="mt-2">
              <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.isHost ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
              >
                {game.isHost ? 'Host' : 'Participant'}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentGames;
