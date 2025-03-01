"use client"
import {LoginForm, LoginFormValues} from "@/components/login-form"
import { useState } from "react";
import {apiRequest} from "@/lib/utils";
import {useRouter} from "next/navigation";

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const handleLogin = async (data: LoginFormValues) => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiRequest<{ token: string }>("auth/login", "POST", data)
            console.log("Login successful:", result)
            router.push("/candidates");
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
          <LoginForm onSubmit={handleLogin} loading={loading} />
          {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}
