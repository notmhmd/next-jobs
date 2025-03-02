import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        DJANGO_API_URL: process.env.DJANGO_API_URL,
    },
};

export default nextConfig;
