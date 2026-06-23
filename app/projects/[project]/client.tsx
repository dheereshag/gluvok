"use client"

import { getPrimaryIdKey } from "@/lib/fields"
import { DataTablePagination } from "@/components/data-table"
import { ProjectToolbar, ProjectDialogs, ProjectTable, useProjectTable } from "@/components/projects"

interface ProjectClientProps {
  projectName: string; projectSlug: string
}

export function ProjectClient({ projectName, projectSlug }: ProjectClientProps) {
  const primaryIdKey = getPrimaryIdKey(projectSlug)
  const pt = useProjectTable({ projectSlug, primaryIdKey, projectName })
  const { table, isLoading, filterKey, creating, setCreating, editingItem, setEditingItem, deletingItem, setDeletingItem, handleReload } = pt

  return (
    <div className="space-y-4">
      <ProjectToolbar
        table={table}
        projectSlug={projectSlug}
        projectName={projectName}
        filterKey={filterKey}
        primaryIdKey={primaryIdKey}
        setCreating={setCreating}
        onReload={handleReload}
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

