"use client"

import { SignupForm } from "@/components/auth/form"
import { AuthPageLayout } from "@/components/auth/common"

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupForm />
    </AuthPageLayout>
  )
}
