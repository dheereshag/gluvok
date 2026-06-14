"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription } from "@/components/ui/field"
import { AuthCard, AuthInput } from "./common"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppRoutes } from "@/lib/constants"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const registeredUsers = useAuthStore((state) => state.registeredUsers)

  const form = useForm<ForgotPasswordInput>({
    resolver: standardSchemaResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    const userExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    )

    if (!userExists) {
      form.setError("email", {
        type: "manual",
        message: "This email is not registered.",
      })
      return
    }

    toast.success("Password reset link sent! Check your email inbox.")
    
    // Simulate clicking the email link after a brief delay
    setTimeout(() => {
      router.push(`${AppRoutes.RESET_PASSWORD}?email=${encodeURIComponent(data.email)}`)
    }, 1500)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Reset your password"
        description="Enter your email address below and we'll send you a password reset link"
        footer={
          <FieldDescription className="text-center mt-4">
            Remembered your password?{" "}
            <a href={AppRoutes.LOGIN} className="underline underline-offset-4 hover:text-primary">
              Sign in
            </a>
          </FieldDescription>
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              registration={form.register("email")}
              error={form.formState.errors.email}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  )
}
