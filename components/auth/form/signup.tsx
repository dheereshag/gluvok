"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription, Field } from "@/components/ui/field"
import { AuthCard, AuthInput } from "../common"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppRoutes } from "@/lib/constants/enums"

import Link from "next/link"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupInput = z.infer<typeof signupSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const registerUser = useAuthStore((state) => state.registerUser)

  const form = useForm<SignupInput>({
    resolver: standardSchemaResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignupInput) => {
    const { success, requiresVerification } = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (success) {
      if (requiresVerification) {
        toast.success("Account created! Please check your email to verify your account.")
        router.push(AppRoutes.LOGIN)
      } else {
        toast.success("Successfully created account!")
        router.push(AppRoutes.HOME)
      }
    } else {
      toast.error("Failed to create account. User might already exist.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Create your account"
        description="Enter your details below to create your account"
        footer={
          <FieldDescription className="text-center mt-4">
            Already have an account? <Link href={AppRoutes.LOGIN} className="underline underline-offset-4 hover:text-primary">Sign in</Link>
          </FieldDescription>
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AuthInput
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              registration={form.register("name")}
              error={form.formState.errors.name}
            />
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              registration={form.register("email")}
              error={form.formState.errors.email}
            />
            <Field>
              <div className="grid grid-cols-2 gap-4">
                <AuthInput
                  id="password"
                  label="Password"
                  type="password"
                  registration={form.register("password")}
                  error={form.formState.errors.password}
                />
                <AuthInput
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  registration={form.register("confirmPassword")}
                  error={form.formState.errors.confirmPassword}
                />
              </div>
              {!form.formState.errors.password && !form.formState.errors.confirmPassword && (
                <FieldDescription className="mt-1">
                  Must be at least 8 characters long.
                </FieldDescription>
              )}
            </Field>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  )
}
