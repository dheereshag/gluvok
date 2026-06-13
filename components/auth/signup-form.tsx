"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription, Field } from "@/components/ui/field"
import { AuthCard, AuthInput } from "./common"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const signupSchema = z.object({
  name: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupInput = z.infer<typeof signupSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: SignupInput) => {
    console.log("Signup submitted:", data)
    toast.success("Successfully created account!")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Create your account"
        description="Enter your details below to create your account"
        footer={
          <FieldDescription className="text-center mt-4">
            Already have an account? <a href="/login" className="underline underline-offset-4 hover:text-primary">Sign in</a>
          </FieldDescription>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <AuthInput
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              registration={register("name")}
              error={errors.name}
            />
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              registration={register("email")}
              error={errors.email}
            />
            <Field>
              <div className="grid grid-cols-2 gap-4">
                <AuthInput
                  id="password"
                  label="Password"
                  type="password"
                  registration={register("password")}
                  error={errors.password}
                />
                <AuthInput
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  registration={register("confirmPassword")}
                  error={errors.confirmPassword}
                />
              </div>
              {!errors.password && !errors.confirmPassword && (
                <FieldDescription className="mt-1">
                  Must be at least 8 characters long.
                </FieldDescription>
              )}
            </Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  )
}
