"use client"

/**
 * @file app/signup/page.tsx
 * @description Sign-up page for the gluvok application.
 * Renders the signup form within the common authentication layout.
 */

import { SignupForm } from "@/components/auth/form"
import { AuthPageLayout } from "@/components/auth/common"

/**
 * SignupPage Component
 * Renders the full signup experience. Wrap in AuthPageLayout to maintain the shared
 * branding, typography, and card presentation.
 */
export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupForm />
    </AuthPageLayout>
  )
}
