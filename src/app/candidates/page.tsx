"use client"
import CandidateTable, {Candidate} from "@/components/candidate-table";
import {apiRequest} from "@/lib/utils";
import {useEffect, useState} from "react";


export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [department, setDepartment] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(10);


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

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6">Candidate List</h1>
            <CandidateTable
                candidates={candidates}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                setDepartment={setDepartment}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}/>
            {error && <div>{error}</div>}
        </div>
    );
}