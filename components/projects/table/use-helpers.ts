"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore, useAuthStore, filterEntitiesForUser } from "@/lib/store"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const user = useAuthStore((state) => state.user)
  const entities = useEntitiesStore((state) => state.entities)
  const hydrated = useEntitiesStore((state) => state.hydrated)

  const data = React.useMemo(() => {
    const rawData = entities[projectSlug] || initialData
    return filterEntitiesForUser(projectSlug, rawData, user, entities)
  }, [projectSlug, initialData, user, entities])

  return {
    tableData: data,
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
