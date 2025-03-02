"use client"
import { useState } from "react";
import {apiRequest} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {RegisterForm, RegisterFormValues} from "@/components/register-form";
import {Candidate} from "@/components/candidate-table";

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const handleRegister = async (data: RegisterFormValues) => {
        setLoading(true)
        setError(null)
        try {
            const formData = new FormData();
            formData.append("full_name", data.full_name);
            formData.append("date_of_birth", data.date_of_birth.toISOString().split('T')[0]);
            formData.append("years_of_experience", data.years_of_experience.toString());
            formData.append("department", data.department);
            formData.append("email", data.email);
            formData.append("resume", data.resume[0]);
            const result = await apiRequest<{data: Candidate}>("candidates/", "POST", formData)
            router.push(`/welcome?name=${encodeURIComponent(result.data.full_name)}`);

        } catch (err) {
            console.log({err})
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm onSubmit={handleRegister} loading={loading} />
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    )
}
