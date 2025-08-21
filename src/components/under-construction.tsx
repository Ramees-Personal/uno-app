import React from 'react';
import {HardHat, Hammer, Construction} from 'lucide-react';
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const UnderConstruction = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-md p-6 space-y-6 text-center">
                <div className="flex justify-center space-x-2">
                    <HardHat className="w-12 h-12 text-yellow-500 animate-bounce"/>
                    <Construction className="w-12 h-12 text-orange-500 animate-pulse"/>
                    <Hammer className="w-12 h-12 text-blue-500 animate-bounce"/>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Under Construction</h1>
                <p className="text-muted-foreground">
                    We&#39;re working hard to bring you something amazing. Please check back soon!
                </p>
            </Card>
        </div>
    );
};

export default UnderConstruction;