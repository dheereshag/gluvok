"use client"

import { LoginForm } from "@/components/auth/form/login-form"
import { AuthPageLayout } from "@/components/auth/common"

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  )
}
