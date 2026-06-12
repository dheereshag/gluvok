"use client"

import { type EntityRecord } from "@/types"
import { getPrimaryIdKey } from "@/lib/fields"
import { DataTablePagination } from "@/components/data-table"
import { ProjectToolbar } from "@/components/projects/project-toolbar"
import { ProjectDialogs } from "@/components/projects/project-dialogs"
import { ProjectTable } from "@/components/projects/project-table"
import { useProjectTable } from "@/components/projects/use-project-table"

interface ProjectClientProps {
  projectName: string; projectSlug: string; initialData: EntityRecord[]
}

export function ProjectClient({ projectName, projectSlug, initialData }: ProjectClientProps) {
  const primaryIdKey = getPrimaryIdKey(projectSlug)
  const pt = useProjectTable({ projectSlug, primaryIdKey, projectName, initialData })
  const { table, isLoading, filterKey, creating, setCreating, editingItem, setEditingItem, deletingItem, setDeletingItem } = pt

  return (
    <div className="space-y-4">
      <ProjectToolbar
        table={table}
        projectSlug={projectSlug}
        projectName={projectName}
        filterKey={filterKey}
        setCreating={setCreating}
      />

      <ProjectTable table={table} isLoading={isLoading} columnsCount={table.getAllColumns().length} />

      <div className="pt-2">
        <DataTablePagination table={table} />
      </div>

      <ProjectDialogs
        creating={creating}
        setCreating={setCreating}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        deletingItem={deletingItem}
        setDeletingItem={setDeletingItem}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
      />
    </div>
  )
}

