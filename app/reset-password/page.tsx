/**
 * @file app/reset-password/page.tsx
 * @description Reset Password page of the application.
 * Utilizes standard React.Suspense to resolve Next.js search parameters in subcomponents (ResetPasswordForm).
 */

import React from "react"
import { ResetPasswordForm } from "@/components/auth/form"
import { AuthPageLayout } from "@/components/auth/common"

/**
 * ResetPasswordPage Component
 * Provides a secure password reset interface, wrapping the ResetPasswordForm within the AuthPageLayout.
 */
export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      {/* React Suspense handles reading URL query parameters asynchronously */}
      <React.Suspense fallback={
        <div className="text-xs font-mono text-muted-foreground text-center">
          Loading...
        </div>
      }>
        <ResetPasswordForm />
      </React.Suspense>
    </AuthPageLayout>
  )
}
