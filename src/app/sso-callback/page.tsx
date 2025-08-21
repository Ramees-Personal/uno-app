'use client';

import {AuthenticateWithRedirectCallback, useUser} from '@clerk/nextjs';
import {useEffect} from 'react';
import Loader from "@/components/Loader";
import {isUnderConstruction} from "@/lib/utils";

export default function SSOCallback() {

    if (isUnderConstruction) return (
        <div className="flex justify-center items-center h-screen">
            <Loader/>
        </div>
    );

    /*const {isSignedIn, user} = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            console.log('User is signed in:', user, isSignedIn);
        } else {
            console.log('User is not signed in', user, isSignedIn);
        }
    }, [isSignedIn, user]);

    return (
        <div>
            <Loader/>
            <div className="opacity-0">
                <AuthenticateWithRedirectCallback/>
            </div>
        </div>
    );*/
}