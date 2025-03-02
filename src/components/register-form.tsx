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
import { Loader2 } from "lucide-react"
import {useRouter} from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import * as React from "react";

const registerFormSchema = yup.object({
    full_name: yup.string().required("Full Name is required"),
    date_of_birth: yup.date().required("Date of Birth is required"),
    years_of_experience: yup.number().min(0, "Experience cannot be negative").required("Years of Experience is required"),
    department: yup.string().required("Department is required"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    resume: yup
        .mixed<FileList>()
        .required("Resume is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
            if (value && value[0]) {
                return value[0].type === "application/pdf";
            }
            return false;
        }),
})

export type RegisterFormValues = yup.InferType<typeof registerFormSchema>

type RegisterFormProps = {
    className?: string
    onSubmit: (data: RegisterFormValues) => void
    loading: boolean
}

export function RegisterForm({ className, loading, onSubmit, ...props }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerFormSchema),
    })
    const router = useRouter()


    const handleLoginRedirect = () => {
        router.push("/login")
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register as a Candidate</CardTitle>
                    <CardDescription>Fill in the form below to register as a candidate</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    {...register("full_name")}
                                    id="full_name"
                                    type="text"
                                    placeholder="Mohamed Elmojtba"
                                    required
                                />
                                {errors.full_name && (
                                    <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    {...register("date_of_birth")}
                                    id="date_of_birth"
                                    type="date"
                                    required
                                />
                                {errors.date_of_birth && (
                                    <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="years_of_experience">Years of Experience</Label>
                                <Input
                                    {...register("years_of_experience")}
                                    id="years_of_experience"
                                    type="number"
                                    placeholder="4"
                                    required
                                />
                                {errors.years_of_experience && (
                                    <p className="text-red-500 text-sm">{errors.years_of_experience.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="department">Department</Label>
                                <Select {...register("department")} onValueChange={(value: string) => {setValue("department", value)}}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Department"/>
                                    </SelectTrigger>
                                    <SelectContent id="department">
                                        <SelectGroup>
                                            <SelectLabel>Department</SelectLabel>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="HR">HR</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.department && (
                                    <p className="text-red-500 text-sm">{errors.department.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="youremail@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="resume">Resume (PDF Only)</Label>
                                <Input
                                    {...register("resume")}
                                    id="resume"
                                    type="file"
                                    accept="application/pdf"
                                    required
                                />
                                {errors.resume && (
                                    <p className="text-red-500 text-sm">{errors.resume.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Register
                                    {loading && <Loader2 className="animate-spin ml-2" />}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already an Employer?{" "}
                            <a href="#" className="underline underline-offset-4" onClick={handleLoginRedirect}>
                                Login here
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}