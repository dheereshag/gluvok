"use client"

import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldDescription } from "@/components/ui/field"
import { AuthCard, AuthInput } from "../common"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppRoutes } from "@/lib/constants/enums"

import Link from "next/link"

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginInput>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginInput) => {
    const success = await login(data.email, data.password)

    if (success) {
      toast.success("Successfully logged in!")
      router.push(AppRoutes.HOME)
      router.refresh()
    } else {
      toast.error("Invalid email or password.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Welcome back"
        description="Enter your email below to login to your account"
        footer={
          <FieldDescription className="text-center mt-4">
            Don&apos;t have an account? <Link href={AppRoutes.SIGNUP} className="underline underline-offset-4 hover:text-primary">Sign up</Link>
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
            <AuthInput
              id="password"
              label="Password"
              type="password"
              registration={form.register("password")}
              error={form.formState.errors.password}
              labelRight={
                <Link
                  href={AppRoutes.FORGOT_PASSWORD}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              }
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  )
}
