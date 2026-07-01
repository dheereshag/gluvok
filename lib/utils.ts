import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateStr: string) {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr.replace(" ", "T"))
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }
  } catch {}
  return dateStr
}


export function getDisplayName(src: string, fileName: string | undefined, index: number): string {
  if (fileName) return fileName
  if (src.startsWith("data:")) return `Image ${index + 1}`
  // extract basename from path
  const parts = src.split("/")
  return parts[parts.length - 1] || `Image ${index + 1}`
}

export function splitFileName(filename: string): [string, string] {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1 || lastDotIndex === 0) return [filename, ""]
  return [filename.slice(0, lastDotIndex), filename.slice(lastDotIndex)]
}

export { getSingularName } from "@/lib/fields"

export { useReactTable } from "@tanstack/react-table"
