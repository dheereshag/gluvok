import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface LogoProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt"> {
  size?: number
}

export function Logo({ size = 32, className, ...props }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="gluvok logo"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      {...props}
    />
  )
}
