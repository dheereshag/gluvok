"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription } from "@/components/ui/field"
import { AuthCard, AuthInput } from "../common"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppRoutes } from "@/lib/constants/enums"

import Link from "next/link"

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const form = useForm<ForgotPasswordInput>({
    resolver: standardSchemaResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    // Dynamically import supabase to keep it simple and clean
    const { supabase } = await import("@/lib/supabase")

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}${AppRoutes.RESET_PASSWORD}`,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Password reset link sent! Check your email inbox.")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Reset your password"
        description="Enter your email address below and we'll send you a password reset link"
        footer={
          <FieldDescription className="text-center mt-4">
            Remembered your password?{" "}
            <Link href={AppRoutes.LOGIN} className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
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
