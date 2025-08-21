'use client';

import React from "react";
import {UserButton, useUser} from "@clerk/nextjs";
import TopPlayers from "@/app/_components/dashboard/_sections/TopPlayers";
import UserInfo from "@/app/_components/dashboard/_sections/UserInfo";
import RecentGames from "@/app/_components/dashboard/_sections/RecentGames";
import Loader from "@/components/Loader";
import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {
    const {isLoaded, isSignedIn, user} = useUser();

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader/>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                You are not signed in
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Header */}
            <header className="flex items-center justify-between p-4 shadow-md">
                <h1 className="text-lg font-bold">Dashboard</h1>
                <UserButton/>
            </header>

            {/* Main content */}
            <main className="p-4 space-y-6">
                <section>
                    <TopPlayers/>
                </section>

                <section>
                    <UserInfo user={user}/>
                </section>

                <section>
                    <RecentGames user={user}/>
                </section>
            </main>

            {/* Floating Action Button */}
            <Button
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center"
                aria-label="Add new game"
                asChild
            >
                <Link href="/game/create">
                    <PlusIcon className="w-6 h-6"/>
                </Link>
            </Button>
        </div>
    );
};

export default Dashboard;
