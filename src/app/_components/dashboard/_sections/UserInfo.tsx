'use client';

import React, { useEffect, useState } from 'react';
import { getPlayerStats, PlayerStats } from '@/lib/database/actions';
import { UserResource } from '@clerk/types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
    user: UserResource;
}

const UserInfo = ({ user }: Props) => {
    const [player, setPlayer] = useState<PlayerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getPlayerStats(user.id);
            setPlayer(data);
            setLoading(false);
        };
        fetchStats();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <span style={{ color: 'var(--text-primary)' }}>Loading player info...</span>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="text-center py-8">
                <span style={{ color: 'var(--text-primary)' }}>No stats available yet.</span>
            </div>
        );
    }

    const totalPoints = player.weeklyScores.reduce((acc, w) => acc + w.total, 0);
    const avgScore = player.weeklyScores.length
        ? (totalPoints / player.weeklyScores.length).toFixed(2)
        : '0';
    const lastWeekScore = player.weeklyScores[0]?.total ?? 0;

    const chartData = {
        labels: player.weeklyScores.map((w) => w.week).reverse(),
        datasets: [
            {
                label: 'Weekly Score',
                data: player.weeklyScores.map((w) => w.total).reverse(),
                fill: false,
                borderColor: 'var(--primary)',
                backgroundColor: 'var(--primary)',
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
            {/* Large Card - Graph */}
            {player.weeklyScores.length > 0 && (
                <div className="col-span-2 sm:col-span-4 bg-[var(--accent)] rounded-2xl p-4 shadow-md">
                    <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-2">
                        Weekly Score Trend
                    </h3>
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}

            {/* Stat Cards */}
            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {player.gamesPlayed}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Games Played</span>
            </div>

            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {player.highestScore}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Highest Score</span>
            </div>

            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {player.lowestScore}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Lowest Score</span>
            </div>

            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {totalPoints}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Total Points</span>
            </div>

            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {avgScore}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Average Score</span>
            </div>

            <div className="bg-[var(--accent)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {lastWeekScore}
        </span>
                <span style={{ color: 'var(--text-secondary)' }}>Last Week</span>
            </div>
        </div>
    );
};

export default UserInfo;
