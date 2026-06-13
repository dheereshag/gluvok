"use client"

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { DeleteEntityDialogContent } from "./delete-content"
import { type DeleteEntityDialogProps } from "./types"

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
