"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { FileDown, FileSpreadsheet, Trash2, X } from "lucide-react"
import { DeleteEntityDialog } from "@/components/projects/dialog/delete"
import { downloadPDF, downloadCSV } from "@/lib/csv/exporter"

import { useAuthStore, getPermissions } from "@/lib/store"

interface BulkActionsProps<TData> {
  table: Table<TData>; projectSlug: string; projectName: string; primaryIdKey: string
}

export function BulkActions<TData>({ table, projectSlug, projectName, primaryIdKey }: BulkActionsProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const user = useAuthStore((state) => state.user)
  const permissions = getPermissions(user?.role, projectSlug)
  const canDelete = permissions.delete

  const handleDownloadPDF = () => {
    downloadPDF(table, projectName)
    table.resetRowSelection()
  }

  const handleDownloadCSV = () => {
    downloadCSV(table, projectName)
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
        <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="h-8 gap-1.5 text-xs bg-background shadow-xs hover:bg-muted"><FileSpreadsheet className="h-3.5 w-3.5" />Download CSV</Button>
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
