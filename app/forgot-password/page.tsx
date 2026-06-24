"use client"

/**
 * @file app/forgot-password/page.tsx
 * @description Page enabling users to request a password reset link.
 * Renders the ForgotPasswordForm within the common AuthPageLayout wrapper.
 */

import { ForgotPasswordForm } from "@/components/auth/form"
import { AuthPageLayout } from "@/components/auth/common"

/**
 * ForgotPasswordPage Component
 * Renders the request password reset screen.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm />
    </AuthPageLayout>
  )
}
