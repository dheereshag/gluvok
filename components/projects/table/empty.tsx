/**
 * @file components/projects/table/empty.tsx
 * @description Fallback component rendered inside the table row when no records match filter criteria.
 */

import { SearchX } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"

/**
 * ProjectTableEmpty Component
 * Renders an empty search state indicator taking up the full width of the table.
 */
export function ProjectTableEmpty({ columnsCount }: { columnsCount: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnsCount} className="h-32 text-center text-xs text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <SearchX className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
          <span className="font-medium">No results found.</span>
        </div>
      </TableCell>
    </TableRow>
  )
}
