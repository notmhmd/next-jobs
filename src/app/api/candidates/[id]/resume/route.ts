import {  NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "Authorization token is missing" },
                { status: 401 }
            );
        }

        if (!id) {
            return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 });
        }

        const response = await fetch(
            `${process.env.DJANGO_API_URL}/api/candidates/admin/candidate/${id}/resume/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
                    Authorization: `Bearer ${token.value}`,
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch resume" }, { status: 400 });
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=candidate_${id}_resume.pdf`,
            },
        });
    } catch (error) {
        console.error("Error fetching resume:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}