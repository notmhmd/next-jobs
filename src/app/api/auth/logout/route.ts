import {NextResponse} from "next/server";

export async function POST() {
    const res = NextResponse.json({
        message: "Logout succefully",
        success: true,
    });

    res.cookies.set("token","",{httpOnly: true, expires: new Date(0)});
    return res;
}