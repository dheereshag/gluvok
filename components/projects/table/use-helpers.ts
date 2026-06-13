"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore } from "@/lib/store"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const storeData = useEntitiesStore((state) => state.entities[projectSlug])
  const setEntities = useEntitiesStore((state) => state.setEntities)
  const [localLoading, setLocalLoading] = React.useState(true)

  React.useEffect(() => {
    if (storeData === undefined) {
      setEntities(projectSlug, initialData)
    }
    const timer = setTimeout(() => {
      setLocalLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [projectSlug, initialData, setEntities, storeData])

  return {
    tableData: storeData || initialData,
    isLoading: localLoading,
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
