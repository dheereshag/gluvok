"use client"

import { toast } from "sonner"
import { type EntityRecord } from "@/types"
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
import { useEntitiesStore, getField, getEntityDisplayName } from "@/lib/store"

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
  projectSlug,
  projectName,
  primaryIdKey,
  item,
}: DeleteEntityDialogProps) {
  const deleteEntity = useEntitiesStore((state) => state.deleteEntity)

  const onDeleteConfirm = () => {
    if (!item) return
    try {
      const itemId = String(getField(item, primaryIdKey))
      deleteEntity(projectSlug, primaryIdKey, itemId)
      toast.success(`${projectName} deleted successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to delete ${projectName.toLowerCase()}`)
    }
  }

  const displayName = getEntityDisplayName(item, projectSlug, primaryIdKey)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-100 sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <div className="p-1.5 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            Delete {projectName}
          </DialogTitle>
          <DialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{displayName}</span>? This action
            cannot be undone and will permanently remove this record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
          <Button
            id="delete-entity-cancel"
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
            id="delete-entity-confirm"
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
