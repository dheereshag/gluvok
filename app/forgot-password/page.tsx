"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthPageLayout } from "@/components/auth/common"

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm />
    </AuthPageLayout>
  )
}
