import {SignedIn, SignedOut} from "@clerk/nextjs";
import Dashboard from "./_components/dashboard/Dashboard";
import Login from "./_components/Login";
import UnderConstruction from "@/components/under-construction";

export default function Home() {

    const underConstruction = true;

    if (underConstruction) {
        return (
            <UnderConstruction/>
        );
    }

    return (
        <main>
            <SignedIn>
                <Dashboard/>
            </SignedIn>
            <SignedOut>
                <Login/>
            </SignedOut>
        </main>
    );
}
