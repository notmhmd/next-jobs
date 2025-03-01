import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { URLSearchParams } from "url";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        return NextResponse.json(
            { message: "Authorization token is missing" },
            { status: 401 }
        );
    }
    const page = params.get("pageIndex") || "1";
    const department = params.get("department");
    let apiUrl = `${process.env.DJANGO_API_URL}/api/candidates/admin/candidates/?page=${page}`;
    if (department) {
        apiUrl += `&department=${department}`;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to fetch candidates" },
                { status: 500 }
            );
        }
        const candidates = await response.json();
        return NextResponse.json(
            { data: candidates.results, total: candidates.count },
            { status: 200 }
        );
    } catch (error) {
        console.log({ error });
        return NextResponse.json(
            { message: "An error occurred while fetching candidates" },
            { status: 500 }
        );
    }
}