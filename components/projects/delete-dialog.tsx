"use client"

import { type EntityRecord } from "@/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-100 sm:w-full">
        <DeleteEntityDialogContent onOpenChange={onOpenChange} {...props} />
      </DialogContent>
    </Dialog>
  )
}
