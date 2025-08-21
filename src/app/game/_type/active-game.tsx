'use client';

import React, {useEffect, useState} from 'react';
import {GameDetails} from '@/lib/database/actions';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Loader from '@/components/Loader';

type NewRoundScores = {
    [playerId: string]: number;
};

const ActiveGamePage = (gameDetails: GameDetails) => {
    const [loading, setLoading] = useState(true);
    const [newRoundScores, setNewRoundScores] = useState<NewRoundScores>({});

    useEffect(() => {
        const fetchGame = async () => {
            if (gameDetails) {
                const initialScores: NewRoundScores = {};
                gameDetails.players.forEach(p => (initialScores[p.id] = 0));
                setNewRoundScores(initialScores);
            }
            setLoading(false);
        };
        fetchGame();
    }, [gameDetails]);

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

    const lastRound = gameDetails.rounds[gameDetails.rounds.length - 1];

    const handleScoreChange = (playerId: string, value: string) => {
        setNewRoundScores(prev => ({
            ...prev,
            [playerId]: parseInt(value) || 0,
        }));
    };

    const handleSubmitRound = () => {
        console.log('Submit new round scores:', newRoundScores);
        // Call API to save the round
    };

    // Stats calculation
    const totalRounds = gameDetails.rounds.length;
    const allScores = gameDetails.rounds.flatMap(r => r.scores.map(s => s.score));
    const highestScore = allScores.length ? Math.max(...allScores) : 0;
    const averageScore = allScores.length
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 0;

    return (
        <div className="p-4 space-y-6">
            {/* Previous round */}
            {lastRound && (
                <Card>
                    <CardHeader>
                        <CardTitle>Previous Round #{lastRound.round.roundNumber}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {lastRound.scores.map(score => {
                            const player = gameDetails.players.find(p => p.id === score.playerId);
                            if (!player) return null;
                            return (
                                <div
                                    key={player.id}
                                    className={`flex justify-between p-2 rounded-md ${
                                         ''
                                    }`}
                                >
                                    <span>{player.name}</span>
                                    <span>{score.score}</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* New round input */}
            <Card>
                <CardHeader>
                    <CardTitle>New Round</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {gameDetails.players.map(player => (
                        <div key={player.id} className="flex justify-between items-center">
                            <span>{player.name}</span>
                            <Input
                                type="number"
                                className="w-24"
                                value={newRoundScores[player.id] || 0}
                                onChange={e => handleScoreChange(player.id, e.target.value)}
                            />
                        </div>
                    ))}
                    <Button className="w-full mt-4" onClick={handleSubmitRound}>
                        Submit Round
                    </Button>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Game Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span>Total Rounds:</span>
                        <span>{totalRounds}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Highest Score:</span>
                        <span>{highestScore}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Average Score:</span>
                        <span>{averageScore.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActiveGamePage;
