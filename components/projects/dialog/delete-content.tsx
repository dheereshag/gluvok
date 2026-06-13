"use client"

import { toast } from "sonner"
import { AlertTriangle, Trash2, X } from "lucide-react"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEntitiesStore, getField, getEntityDisplayName } from "@/lib/store"
import { type DeleteContentProps } from "./types"

export function DeleteEntityDialogContent({
  onOpenChange, projectSlug, projectName, primaryIdKey, item, items, onSuccess, customDisplayName, onConfirm
}: DeleteContentProps) {
  const deleteEntity = useEntitiesStore((state) => state.deleteEntity)
  const isBulk = items && items.length > 1
  const count = items?.length || 0

  const onDeleteConfirm = () => {
    if (onConfirm) {
      onConfirm()
      onOpenChange(false)
      return
    }

    try {
      if (isBulk) {
        items.forEach(i => deleteEntity(projectSlug!, primaryIdKey!, String(getField(i, primaryIdKey!))))
      } else if (item) {
        deleteEntity(projectSlug!, primaryIdKey!, String(getField(item, primaryIdKey!)))
      }
      toast.success(`${isBulk ? `${count} items` : projectName} deleted successfully`)
      onSuccess?.()
      onOpenChange(false)
    } catch {
      toast.error(`Failed to delete ${isBulk ? "items" : projectName?.toLowerCase() || "item"}`)
    }
  }

  const displayName = customDisplayName || (isBulk
    ? `${count} selected items`
    : getEntityDisplayName(item, projectSlug!, primaryIdKey!))

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <div className="p-1.5 rounded-lg bg-destructive/10"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
          Delete {isBulk ? "Selected" : (projectName || "Item")}
        </DialogTitle>
        <DialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground text-left">
          Are you sure you want to delete <span className="font-semibold text-foreground">{displayName}</span>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
        <Button id="delete-entity-cancel" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5 h-8 px-3 text-xs">
          <X className="h-3.5 w-3.5" /> Cancel
        </Button>
        <Button id="delete-entity-confirm" variant="destructive" size="sm" onClick={onDeleteConfirm} className="gap-1.5 h-8 px-3 text-xs shadow-sm">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </DialogFooter>
    </>
  )
}
