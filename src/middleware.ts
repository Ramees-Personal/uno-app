import {clerkMiddleware} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';
import {isUnderConstruction} from "@/lib/utils";

const PUBLIC_PATHS = [
    '/',
    '/authenticate',
    '/sso-callback',
];

export default clerkMiddleware(async (auth, req) => {

    if (isUnderConstruction) {
        if (req.nextUrl.pathname === '/') {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/', req.url));
    }

    const {pathname} = req.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    // Check authentication for protected routes
    const {userId} = await auth.protect();
    if (userId) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to homepage
    return NextResponse.redirect(new URL('/', req.url));
});

export const config = {
    matcher: [
        '/((?!_next|.*\\..*).*)', // apply to all routes except static files/_next
    ],
};
