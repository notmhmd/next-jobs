import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const response = await fetch(`${process.env.DJANGO_API_URL}/api/candidates/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });



        if (!response.ok) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        const { access_token, expires_in } = await response.json();

        const cookie = serialize("token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expires_in || 60 * 60 * 24, // Default to 1 day
            path: "/",
        });

        const res = NextResponse.json({ success: true });
        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}