"use client"

import {useEffect} from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import {useRouter, useSearchParams} from "next/navigation";

export default function Page() {
    const params = useSearchParams();
    const candidateName = params.get("name");
    const router = useRouter();


    useEffect(() => {
        const interval = setInterval(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.9 },
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.9 },
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleHomeClick = ()=> {
        router.push("/");
    }

    return (
        <div className="welcome-container flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl rounded-lg text-center">
                {candidateName ? (
                    <>
                        <h1 className="text-4xl font-bold text-green-600">Welcome to the team 🫡 , {candidateName}!</h1>
                        <p className="text-lg text-gray-600 mt-4">We are excited to have you with us!</p>
                    </>
                ) : (
                    <h1 className="text-4xl font-bold text-gray-600">Welcome to the team!</h1>
                )}
                <Button onClick={handleHomeClick} className="mt-6 bg-green-600 text-white hover:bg-green-700">
                    Let&#39;s Get Started
                </Button>
            </div>
        </div>
    );
}