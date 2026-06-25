"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"


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
