"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6">
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className="text-2xl sm:text-4xl font-bold text-center"
            >
                Welcome to Our Platform 🚀
            </motion.h1>
            <motion.p
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.2}}
                className="text-base sm:text-lg text-gray-300 mt-3 text-center px-4"
            >
                Join us and unlock your potential. Sign up or log in to continue.
            </motion.p>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.4}}
                className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto"
            >
                <Button
                    className="px-6 py-3 text-base sm:text-lg bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
                    onClick={() => router.push("/register")}
                >
                    Register as Candidate
                </Button>
                <Button
                    className="px-6 py-3 text-base sm:text-lg bg-gray-700 hover:bg-gray-800 w-full sm:w-auto"
                    onClick={() => router.push("/login")}
                >
                    Login as Employer
                </Button>
            </motion.div>
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 opacity-20 -z-10"
                initial={{opacity: 0}}
                animate={{opacity: 0.3}}
                transition={{duration: 1.5}}
            />
        </div>
    );
}