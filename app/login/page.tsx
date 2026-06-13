"use client"

import { LoginForm } from "@/components/auth/login-form"
import { AuthPageLayout } from "@/components/auth/common"

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  )
}
