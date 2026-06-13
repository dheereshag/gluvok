"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore } from "@/lib/store"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const storeData = useEntitiesStore((state) => state.entities[projectSlug])
  const hydrated = useEntitiesStore((state) => state.hydrated)

  return {
    tableData: storeData || initialData,
    isLoading: !hydrated,
  }
}

export function useProjectDialogStates() {
  const [editingItem, setEditingItem] = React.useState<EntityRecord | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<EntityRecord | null>(null)
  const [creating, setCreating] = React.useState(false)

  return {
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem,
    creating,
    setCreating,
  }
}
