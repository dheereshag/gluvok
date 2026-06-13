"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DeleteEntityDialogContent } from "./delete-content"
import { type DeleteEntityDialogProps } from "./types"

export function DeleteEntityDialog({
  open,
  onOpenChange,
  size = "default",
  ...props
}: DeleteEntityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={`w-[92vw] sm:w-full ${size === "sm" ? "max-w-[320px] p-5" : "max-w-100"}`}>
        <DeleteEntityDialogContent onOpenChange={onOpenChange} {...props} />
      </DialogContent>
    </Dialog>
  )
}
