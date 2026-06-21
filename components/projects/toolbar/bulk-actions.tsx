"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { FileDown, Trash2, X } from "lucide-react"
import { DeleteEntityDialog } from "@/components/projects/dialog/delete"
import { generatePdfHtml } from "@/lib/pdf/template"
import { printPdf } from "@/lib/pdf/exporter"

import { useAuthStore, getPermissions } from "@/lib/store"
import { ProjectSlug } from "@/lib/constants/enums"

interface BulkActionsProps<TData> {
  table: Table<TData>; projectSlug: string; projectName: string; primaryIdKey: string
}

export function BulkActions<TData>({ table, projectSlug, projectName, primaryIdKey }: BulkActionsProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const user = useAuthStore((state) => state.user)
  const permissions = getPermissions(user?.role, projectSlug)
  let canDelete = permissions.delete

  switch (projectSlug as ProjectSlug) {
    case ProjectSlug.RATES:
      canDelete = false
      break
    default:
      break
  }

  const handleDownloadPDF = () => {
    const cols = table.getVisibleLeafColumns().filter(c => c.id !== "select" && c.id !== "actions")
    const headersHtml = cols.map(c => `<th>${(c.columnDef.meta as Record<string, unknown>)?.label || c.id}</th>`).join("")
    const rowsHtml = selectedRows.map(row => {
      const cells = cols.map(c => {
        const val = row.getValue(c.id)
        return `<td>${Array.isArray(val) ? `${val.length} image(s)` : String(val ?? "")}</td>`
      }).join("")
      return `<tr>${cells}</tr>`
    }).join("")
    printPdf(generatePdfHtml(projectName, headersHtml, rowsHtml, selectedRows.length))
    //? what should happen after 
    table.resetRowSelection()
  }

  return (
    <div className="flex w-full items-center justify-between gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border/80 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary animate-pulse">{selectedRows.length}</span>
        <span>selected</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()} className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" />Clear</Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="h-8 gap-1.5 text-xs bg-background shadow-xs hover:bg-muted"><FileDown className="h-3.5 w-3.5" />Download PDF</Button>
        {canDelete && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)} className="h-8 gap-1.5 text-xs shadow-xs">
            <Trash2 className="h-3.5 w-3.5" />Delete Selected
          </Button>
        )}
        <DeleteEntityDialog
          open={open}
          onOpenChange={setOpen}
          projectSlug={projectSlug}
          projectName={projectName}
          primaryIdKey={primaryIdKey}
          items={selectedRows.map(r => r.original as import("@/types").EntityRecord)}
          onSuccess={() => table.resetRowSelection()}
        />
      </div>
    </div>
  )
}
