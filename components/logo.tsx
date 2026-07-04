import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface LogoProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt"> {
  size?: number
}

export interface LogoHorizontalProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt"> {
  height?: number
}

export interface LogoVerticalProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt"> {
  height?: number
}

/**
 * Square / icon-only logo — uses /logo.png
 */
export function Logo({ size = 32, className, ...props }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Gluvok logo"
      width={size}
      height={size}
      className={cn("object-contain w-auto h-auto", className)}
      {...props}
    />
  )
}

/**
 * Horizontal logo (wide) — uses /logo-horizontal.png
 */
export function LogoHorizontal({ height = 64, width = 64, className, ...props }: LogoHorizontalProps) {
  return (
    <Image
      src="/logo-horizontal.png"
      alt="Gluvok logo"
      width={width}
      height={height}
      className={cn("object-contain w-auto h-auto", className)}
      {...props}
    />
  )
}

/**
 * Vertical logo (stacked) — uses /logo-vertical.png
 */
export function LogoVertical({ height = 64, width = 64, className, ...props }: LogoVerticalProps) {
  return (
    <Image
      src="/logo-vertical.png"
      alt="Gluvok logo"
      width={width}
      height={height}
      className={cn("object-contain w-auto h-auto", className)}
      {...props}
    />
  )
}
