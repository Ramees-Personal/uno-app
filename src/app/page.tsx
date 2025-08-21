import {SignedIn, SignedOut} from "@clerk/nextjs";
import Dashboard from "./_components/dashboard/Dashboard";
import Login from "./_components/Login";
import UnderConstruction from "@/components/under-construction";
import {isUnderConstruction} from "@/lib/utils";

export default function Home() {

    if (isUnderConstruction) {
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
