"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useEntitiesStore } from "@/lib/store"

export function useProjectStoreSync(projectSlug: string, initialData: EntityRecord[]) {
  const [data, setData] = React.useState<EntityRecord[]>(initialData)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = useEntitiesStore.subscribe((state) => {
      if (state.entities[projectSlug]) {
        setData(state.entities[projectSlug])
      }
      setIsLoading(!state.hydrated)
    })

    // Set initial values from store
    const currentState = useEntitiesStore.getState()
    if (currentState.entities[projectSlug]) {
      setData(currentState.entities[projectSlug])
    }
    setIsLoading(!currentState.hydrated)

    return () => unsubscribe()
  }, [projectSlug])

  return {
    tableData: data,
    isLoading,
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
