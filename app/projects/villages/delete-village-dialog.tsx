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
      toast.success(`Village "${village.name}" deleted successfully`)
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
            <div className="p-1.5 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            Delete Village
          </DialogTitle>
          <DialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{village?.name}</span>? This action
            cannot be undone and will permanently remove this record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-1.5 h-8 px-3 text-xs"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDeleteConfirm}
            className="gap-1.5 h-8 px-3 text-xs shadow-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
