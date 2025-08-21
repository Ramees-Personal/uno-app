import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const UserAvatar = (
    {
        imageUrl,
        name,
        size = 40
    }:
    {
        imageUrl: string | null;
        name: string | null;
        size?: number;
    }
) => {
    return (
        <Avatar className={`h-[${size}px] w-[${size}px]`}>
            {imageUrl &&
                <AvatarImage src={imageUrl} alt={name ?? "User Avatar"}/>
            }
            <AvatarFallback>{name ?? "U".charAt(0)}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;