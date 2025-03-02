"use client"
import CandidateTable, {Candidate} from "@/components/candidate-table";
import {apiRequest} from "@/lib/utils";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";
import * as React from "react";

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [department, setDepartment] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(10);
    const router = useRouter();


    const handleDownloadResume = async (candidateId: string, candidateName: string) => {
        try {
            const blob = await apiRequest<Blob>(`candidates/${candidateId}/resume`, "GET");
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            const name = candidateName.replace(/ /g, "-");
            a.href = url;
            a.download = `${name}_resume.pdf`;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.log({error})
            console.error("Error downloading resume:", error);
            alert("Failed to download resume.");
        }
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const params: { department?: string, pageIndex: number, pageSize: number } = {
                    pageIndex,
                    pageSize
                };
                if (department) {
                    params.department = department;
                }
                const candidates = await apiRequest<{data: Candidate[], total: number}>("/candidates", "GET", undefined, params);
                setCandidates(candidates.data)
                setTotalCount(candidates.total)
                setLoading(false)
            } catch (err) {
                console.log({err})
                setError('An error occurred while fetching candidates.')
                setCandidates([])
                setLoading(false)
            }
        }

        fetchCandidates()
    }, [pageIndex, pageSize, department])

    const handleLogout = async () => {
        try {
            await apiRequest('/auth/logout', 'POST');
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Something went wrong while logging out.');
        }
    };

    if (loading) {
        return (
            <div className="h-[100vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                <p className="text-lg text-gray-600">Loading, please wait...</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Candidate List</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
            <CandidateTable
                candidates={candidates}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                setDepartment={setDepartment}
                handleDownloadResume={handleDownloadResume}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}/>
            {error && <div>{error}</div>}
        </div>
    );
}