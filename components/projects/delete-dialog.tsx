"use client"

import { type EntityRecord } from "@/types"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { DeleteEntityDialogContent } from "./delete-dialog-content"

interface DeleteEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
  item: EntityRecord | null
}

export function DeleteEntityDialog({
  open,
  onOpenChange,
  ...props
}: DeleteEntityDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[92vw] max-w-100 sm:w-full">
        <DeleteEntityDialogContent onOpenChange={onOpenChange} {...props} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

