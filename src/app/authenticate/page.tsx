'use client'
import React, {useEffect} from 'react';
import {useUser} from "@clerk/nextjs";
import Loader from "@/components/Loader";
import {createPlayer, getPlayerByUserId, updatePlayer} from "@/lib/database/actions";
import {redirect} from "next/navigation";
import {UserResource} from "@clerk/types";
import {isUnderConstruction} from "@/lib/utils";


const AuthenticatePage = () => {
    if(isUnderConstruction) return (
        <div className="flex justify-center items-center h-screen">
            <Loader/>
        </div>
    );

    /*const {isSignedIn, user} = useUser();

    useEffect(() => {
        const fetchPlayer = async (user: UserResource) => {
            const player = await getPlayerByUserId(user.id);
            if (player) {
                console.log('Player found:', player);
                await updatePlayer(
                    player.id,
                    user.username ?? user.firstName ?? user.lastName ?? '',
                    user.primaryEmailAddress?.emailAddress,
                    user.imageUrl,
                )
            } else {
                console.log('Player not found');
                await createPlayer(
                    user.id,
                    user.username ?? user.firstName ?? user.lastName ?? '',
                    user.primaryEmailAddress?.emailAddress ?? '',
                    user.imageUrl,
                );
            }
        };

        if (!isSignedIn || !user) {
            console.log('User is not signed in');
            return;
        } else {
            fetchPlayer(user).then(
                () => {
                    console.log('Player fetched or created');
                    redirect('/');
                }
            );
        }
    }, [isSignedIn, user]);
    return (
        <Loader text="Authenticating..."/>
    );*/
};

export default AuthenticatePage;