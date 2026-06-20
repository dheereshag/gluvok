"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Copy, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getField } from "@/lib/store"
import { type EntityRecord } from "@/types"
import { type ColumnActionsCallbacks } from "./index"

import { type Permission } from "@/lib/store"
import { ProjectSlug } from "@/lib/fields"

export function getActionsColumn<T extends EntityRecord>(
  projectSlug: string,
  primaryIdKey: string,
  projectName: string,
  callbacks: ColumnActionsCallbacks<T>,
  permissions?: Permission
): ColumnDef<T> {
  let canWrite = permissions?.write ?? true
  let canDelete = permissions?.delete ?? true

  switch (projectSlug as ProjectSlug) {
    case ProjectSlug.RATES:
      canWrite = false
      canDelete = false
      break
    default:
      break
  }

  return {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
      const itemId = String(getField(item, primaryIdKey))
      return (
        <div className="text-right pr-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button id={`actions-trigger-${projectSlug}-${itemId}`} variant="ghost" className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                id={`actions-copy-${projectSlug}-${itemId}`} className="text-xs cursor-pointer gap-2 py-2"
                onClick={() => { navigator.clipboard.writeText(itemId); toast.success("Identifier copied to clipboard") }}
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Copy ID
              </DropdownMenuItem>
              {canWrite && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem id={`actions-edit-${projectSlug}-${itemId}`} className="text-xs cursor-pointer gap-2 py-2" onClick={() => callbacks.onEdit(item)}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> Edit {projectName}
                  </DropdownMenuItem>
                </>
              )}
              {canDelete && (
                <>
                  {!canWrite && <DropdownMenuSeparator />}
                  <DropdownMenuItem id={`actions-delete-${projectSlug}-${itemId}`} className="text-xs cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => callbacks.onDelete(item)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" /> Delete {projectName}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  }
}
