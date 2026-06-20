"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore, useAuthStore, filterEntitiesForUser } from "@/lib/store"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const [isMounted, setIsMounted] = React.useState(false)
  const user = useAuthStore((state) => state.user)
  const entities = useEntitiesStore((state) => state.entities)
  const hydrated = useEntitiesStore((state) => state.hydrated)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const data = React.useMemo(() => {
    if (!isMounted) return initialData
    const rawData = entities[projectSlug] || initialData
    return filterEntitiesForUser(projectSlug, rawData, user, entities)
  }, [projectSlug, initialData, user, entities, isMounted])

  return {
    tableData: data,
    isLoading: !isMounted || !hydrated,
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
