"use client"

import { toast } from "sonner"
import { type EntityRecord } from "@/types"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useEntitiesStore, getField, getEntityDisplayName } from "@/lib/store"

interface DeleteContentProps {
  onOpenChange: (open: boolean) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
  item: EntityRecord | null
}

export function DeleteEntityDialogContent({
  onOpenChange, projectSlug, projectName, primaryIdKey, item
}: DeleteContentProps) {
  const deleteEntity = useEntitiesStore((state) => state.deleteEntity)

  const onDeleteConfirm = () => {
    if (!item) return
    try {
      deleteEntity(projectSlug, primaryIdKey, String(getField(item, primaryIdKey)))
      toast.success(`${projectName} deleted successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to delete ${projectName.toLowerCase()}`)
    }
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
          <div className="p-1.5 rounded-lg bg-destructive/10"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
          Delete {projectName}
        </AlertDialogTitle>
        <AlertDialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">{getEntityDisplayName(item, projectSlug, primaryIdKey)}</span>? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
        <AlertDialogCancel id="delete-entity-cancel" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5 h-8 px-3 text-xs">
          <X className="h-3.5 w-3.5" /> Cancel
        </AlertDialogCancel>
        <AlertDialogAction id="delete-entity-confirm" variant="destructive" size="sm" onClick={onDeleteConfirm} className="gap-1.5 h-8 px-3 text-xs shadow-sm">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  )
}
