"use client"

/**
 * @file app/projects/[project]/client.tsx
 * @description Client-side component for rendering a generic project dashboard interface.
 * Coordinates the toolbar, data table, pagination, and modals/dialogs for the selected project.
 */

import { getPrimaryIdKey } from "@/lib/fields"
import { DataTablePagination } from "@/components/data-table"
import { ProjectToolbar, ProjectDialogs, ProjectTable, useProjectTable } from "@/components/projects"

interface ProjectClientProps {
  projectName: string;
  projectSlug: string;
}

/**
 * ProjectClient Component
 * Serves as the main orchestrator for a project's data management UI.
 * Handles fetching, pagination, creation, editing, deletion, and reloading operations
 * using the custom `useProjectTable` hook.
 */
export function ProjectClient({ projectName, projectSlug }: ProjectClientProps) {
  const primaryIdKey = getPrimaryIdKey(projectSlug)
  const pt = useProjectTable({ projectSlug, primaryIdKey, projectName })
  const { table, isLoading, creating, setCreating, editingItem, setEditingItem, deletingItem, setDeletingItem, handleReload } = pt

  return (
    <div className="space-y-4">
      {/* Search, filters, reload and creation controls */}
      <ProjectToolbar
        table={table}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
        setCreating={setCreating}
        onReload={handleReload}
      />

      {/* Main data representation grid/table */}
      <ProjectTable table={table} isLoading={isLoading} columnsCount={table.getAllColumns().length} />

      {/* Pagination controls */}
      <div className="pt-2">
        <DataTablePagination table={table} />
      </div>

      {/* Dialog overlays for CUD operations (Create, Update, Delete) */}
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

