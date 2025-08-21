'use client'
import React, {useEffect, useState} from 'react';
import {GameDetails, getGameDetails} from "@/lib/database/actions";
import Loader from "@/components/Loader";
import ActiveGamePage from "@/app/game/_type/active-game";
import FinishedGamePage from "@/app/game/_type/finished-game";

const GamePage = () => {
    const [gameId, setGameId] = useState<string | null>(null);
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        setGameId(id);
    }, []);


    useEffect(() => {
        const fetchGame = async () => {
            if (!gameId) return;
            const data = await getGameDetails(gameId);
            if (data) {
                setGameDetails(data);
            }
            setLoading(false);
        };
        fetchGame();
    }, [gameId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader/>
            </div>
        );
    }

    if (!gameDetails) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Game not found
            </div>
        );
    }

    if (gameDetails.game.status === "active") {
        return (
            <ActiveGamePage game={gameDetails.game} players={gameDetails.players} rounds={gameDetails.rounds}/>
        )
    }
    return (
        <FinishedGamePage gameDetails={gameDetails}/>
    )
};

export default GamePage;