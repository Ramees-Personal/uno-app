'use client';
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Login = () => {
    const { signIn, isLoaded } = useSignIn();
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    // Check URL for redirect_url param
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect_url");
            console.log("Redirect URL from URL:", redirect);
            if (redirect) setRedirectUrl(redirect);
        }
    }, []);

    const handleGoogleSignIn = async () => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: redirectUrl || "/sso-callback",          // fallback if none in URL
                redirectUrlComplete: "/authenticate",                // final landing page
            });
        } catch (err) {
            console.error("Google sign-in failed", err);
        }
    };

    // Optional: auto-redirect if redirect_url is present (before sign-in)
    useEffect(() => {
        if (redirectUrl && !isLoaded) {
            router.push(redirectUrl);
        }
    }, [redirectUrl, isLoaded, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen p-16">
            <div className="flex flex-col mt-auto items-center gap-4 h-fit">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={40} height={40} />
                    <h1 className="text-3xl font-bold">UNO</h1>
                </div>
                <h2>Create an account</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className={cn("rounded-full px-6 py-3")}
                    >
                        <div className="flex items-center gap-2">
                            <FaGoogle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            Sign in with Google
                        </div>
                    </Button>
                </form>
            </div>
            <p className="mt-auto">
                By clicking continue, you agree to our{" "}
                <a className="text-primary underline">Terms of Service</a> and{" "}
                <a className="text-primary underline">Privacy Policy</a>
            </p>
        </div>
    );
};

export default Login;
