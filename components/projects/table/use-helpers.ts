"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore, useAuthStore, filterEntitiesForUser } from "@/lib/store"
import { ProjectSlug } from "@/lib/constants/enums"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const [isMounted, setIsMounted] = React.useState(false)
  const user = useAuthStore((state) => state.user)
  const entities = useEntitiesStore((state) => state.entities)
  const hydrated = useEntitiesStore((state) => state.hydrated)
  const loadEntities = useEntitiesStore((state) => state.loadEntities)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) setIsMounted(true)
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        await loadEntities(projectSlug as ProjectSlug)
      } catch (err) {
        console.error("Failed to load page entities:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [projectSlug, loadEntities])

  const data = React.useMemo(() => {
    if (!isMounted) return initialData
    const rawData = entities[projectSlug] || initialData
    return filterEntitiesForUser(projectSlug, rawData, user, entities)
  }, [projectSlug, initialData, user, entities, isMounted])

  return {
    tableData: data,
    isLoading: !isMounted || !hydrated || loading,
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
