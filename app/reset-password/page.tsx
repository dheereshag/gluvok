import React from "react"
import { ResetPasswordForm } from "@/components/auth/form"
import { AuthPageLayout } from "@/components/auth/common"

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
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
