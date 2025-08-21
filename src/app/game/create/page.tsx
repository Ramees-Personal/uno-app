'use client';

/*import React, {useEffect, useState} from 'react';
import {createGame, getPlayerByUserId, getPlayers} from '@/lib/database/actions';
import {Players} from '@/lib/database/schema';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import Loader from '@/components/Loader';
import {useUser} from '@clerk/nextjs';
import {redirect} from "next/navigation";*/
import {isUnderConstruction} from "@/lib/utils";

const CreateGamePage = () => {

    if (isUnderConstruction) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Under Construction</h1>
                <p className="text-lg text-gray-600">
                    This feature is currently under construction. Please check back later.
                </p>
            </div>
        );
    }

    /*const {user} = useUser();
    const [players, setPlayers] = useState<Players[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!user) return;

            setLoading(true);

            // Get logged-in user player info
            const hostPlayer = await getPlayerByUserId(user.id);
            const allPlayers = await getPlayers();

            setPlayers(allPlayers);

            // Automatically select the host
            if (hostPlayer) {
                setSelectedPlayers([hostPlayer.id]);
            }

            setLoading(false);
        };

        fetchPlayers();
    }, [user]);

    const togglePlayer = (id: string) => {
        // Don't allow deselecting the host
        if (selectedPlayers[0] === id) return;
        setSelectedPlayers((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const filteredPlayers = players.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
    );
    const handleCreateGame = async () => {
        if (selectedPlayers.length < 2) {
            alert('Select at least 2 players');
            return;
        }
        const hostId = selectedPlayers[0];
        const game = await createGame(hostId, selectedPlayers);

        redirect(`/game?id=${game.id}`);
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-4 space-y-4">
            <h1 className="text-2xl font-bold">Create Game</h1>

            <Input
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />

            <div className="flex space-x-4 overflow-x-auto py-2">
                {filteredPlayers.length === 0 && (
                    <div className="text-gray-500">No players found</div>
                )}
                {filteredPlayers.map((player) => {
                    const selected = selectedPlayers.includes(player.id);
                    const isHost = selectedPlayers[0] === player.id;

                    return (
                        <div
                            key={player.id}
                            className={`flex-shrink-0 w-32 p-3 border rounded-lg cursor-pointer flex flex-col items-center space-y-2 transition-all ${
                                selected
                                    ? 'border-primary bg-secondary'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                            onClick={() => togglePlayer(player.id)}
                        >
                            <img
                                src={player.avatarUrl || '/default-avatar.png'}
                                alt={player.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="text-sm font-medium text-center truncate w-full">
                                {player.name} {isHost && '(You)'}
                            </div>
                            <div className="text-xs text-gray-500 truncate w-full text-center">
                                {player.email}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-sm text-gray-600 mt-auto mb-12">
                {selectedPlayers.length} player{selectedPlayers.length !== 1 && 's'} selected
            </div>

            <div className="fixed bottom-4 left-0 w-full px-4">
                <Button
                    className="w-full"
                    disabled={selectedPlayers.length < 2}
                    onClick={handleCreateGame}
                >
                    {selectedPlayers.length < 2 ? "Select 2 or more players" : "Create Game"}
                </Button>
            </div>
        </div>
    );*/
};

export default CreateGamePage;
