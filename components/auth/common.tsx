"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UseFormRegisterReturn, FieldError as HookFieldError } from "react-hook-form"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

interface AuthInputProps extends React.ComponentProps<typeof Input> {
  label: string
  error?: HookFieldError
  registration: UseFormRegisterReturn
  labelRight?: React.ReactNode
}

export function AuthInput({ label, error, registration, id, labelRight, ...props }: AuthInputProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelRight}
      </div>
      <Input id={id} {...props} {...registration} />
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  )
}
