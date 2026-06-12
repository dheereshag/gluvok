import * as React from "react"
import { type EntityRecord } from "@/types"
import { DialogMode } from "@/lib/constants"
import { EntityDialog } from "./entity-dialog"
import { DeleteEntityDialog } from "./delete-dialog"

interface ProjectDialogsProps {
  creating: boolean
  setCreating: (open: boolean) => void
  editingItem: EntityRecord | null
  setEditingItem: (item: EntityRecord | null) => void
  deletingItem: EntityRecord | null
  setDeletingItem: (item: EntityRecord | null) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
}

export function ProjectDialogs({
  creating,
  setCreating,
  editingItem,
  setEditingItem,
  deletingItem,
  setDeletingItem,
  projectSlug,
  projectName,
  primaryIdKey,
}: ProjectDialogsProps) {
  return (
    <>
      <EntityDialog
        mode={DialogMode.CREATE} open={creating} onOpenChange={setCreating}
        projectSlug={projectSlug} projectName={projectName} primaryIdKey={primaryIdKey}
      />
      <EntityDialog
        mode={DialogMode.EDIT} open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}
        projectSlug={projectSlug} projectName={projectName} primaryIdKey={primaryIdKey} item={editingItem}
      />
      <DeleteEntityDialog
        open={deletingItem !== null} onOpenChange={(open) => !open && setDeletingItem(null)}
        projectSlug={projectSlug} projectName={projectName} primaryIdKey={primaryIdKey} item={deletingItem}
      />
    </>
  )
}
