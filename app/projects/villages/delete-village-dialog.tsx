"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Village } from "@/data/villages"
import { useVillagesStore } from "./store"

interface DeleteVillageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  village: Village | null
}

export function DeleteVillageDialog({ open, onOpenChange, village }: DeleteVillageDialogProps) {
  const deleteVillage = useVillagesStore((state) => state.deleteVillage)

  const onDeleteConfirm = () => {
    if (!village) return
    try {
      deleteVillage(village.id)
      toast.success("Village deleted successfully")
      onOpenChange(false)
    } catch {
      toast.error("Failed to delete village")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Village</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{village?.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
