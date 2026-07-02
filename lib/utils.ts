/**
 * @file lib/utils.ts
 * @description General utility helper functions for class merging, date formatting, and string splitting.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn utility
 * Merges and filters Tailwind classes securely using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * formatDateTime utility
 * Converts ISO date strings into human-readable date-time strings (e.g. Oct 12, 2026, 10:30 AM).
 */
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


/**
 * getDisplayName utility
 * Resolves a friendly display name for an image source path, local file name, or backup index.
 */
export function getDisplayName(src: string, fileName: string | undefined, index: number): string {
  if (fileName) return fileName
  if (src.startsWith("data:")) return `Image ${index + 1}`
  // extract basename from path
  const parts = src.split("/")
  return parts[parts.length - 1] || `Image ${index + 1}`
}

/**
 * splitFileName utility
 * Splits a file name string into two elements: its name segment and its extension segment.
 */
export function splitFileName(filename: string): [string, string] {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1 || lastDotIndex === 0) return [filename, ""]
  return [filename.slice(0, lastDotIndex), filename.slice(lastDotIndex)]
}

export { getSingularName } from "@/lib/fields"

export { useReactTable } from "@tanstack/react-table"
