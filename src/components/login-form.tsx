"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";


const loginFormSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

export type LoginFormValues = yup.InferType<typeof loginFormSchema>

type LoginFormProps = {
  className?: string;
  onSubmit: (data: LoginFormValues) => void,
  loading: boolean,
}

export function LoginForm({className, loading, onSubmit, ...props}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  })
  const router = useRouter()


  const handleSignUpRedirect = () => {
    router.push("/register")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input
                    {...register("username")}
                    id="username"
                    type="username"
                    placeholder="m@example.com or johndoe"
                    required
                />
                {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required {...register("password")}/>
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit"  className='w-full' >
                  Login
                  { loading ? <Loader2 className="animate-spin" /> : undefined }
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t You are A Candidate?{" "}
              <a href="#" onClick={handleSignUpRedirect} className="underline underline-offset-4">
                Register now
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
