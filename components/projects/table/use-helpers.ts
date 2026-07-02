"use client"

/**
 * @file components/projects/table/use-helpers.ts
 * @description Hook to manage dialog/overlay open states for editing, deleting, and creating entities.
 */

import * as React from "react"
import { type EntityRecord } from "@/types"

/**
 * useProjectDialogStates hook
 * Manages open states and references to active entities for edit, delete, and create dialog overlays.
 */
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
