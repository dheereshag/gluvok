"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription, Field } from "@/components/ui/field"
import { AuthCard, AuthInput } from "./common"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppRoutes } from "@/lib/constants/enums"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const resetPassword = useAuthStore((state) => state.resetPassword)

  const form = useForm<ResetPasswordInput>({
    resolver: standardSchemaResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: ResetPasswordInput) => {
    if (!email) {
      toast.error("Invalid reset link. Missing email address.")
      return
    }

    const success = resetPassword(email, data.password)

    if (success) {
      toast.success("Successfully reset your password!")
      router.push(AppRoutes.LOGIN)
    } else {
      toast.error("Failed to reset password. Email might not be registered.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Reset your password"
        description={email ? `Set a new password for ${email}` : "Set a new password for your account"}
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
            <Field>
              <div className="grid grid-cols-2 gap-4">
                <AuthInput
                  id="password"
                  label="New Password"
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
              {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  )
}
