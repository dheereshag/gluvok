"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, X } from "lucide-react"
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Delete Village
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{village?.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteConfirm} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
