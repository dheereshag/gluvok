/**
 * @file components/projects/table/loading.tsx
 * @description Loading skeleton component rendered inside the table while fetching data.
 */

import { Skeleton } from "@/components/ui/skeleton"
import { Table as TableGrid, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/**
 * ProjectTableLoading Component
 * Displays a realistic mock skeleton table layout to minimize visual layout shift.
 */
export function ProjectTableLoading() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300">
      <TableGrid>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableHead key={i} className="h-10 text-xs py-2 font-semibold">
                <Skeleton className="h-3.5 w-16 bg-muted/60" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b last:border-b-0 hover:bg-transparent">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <TableCell key={colIndex} className="py-3.5 text-xs">
                  <Skeleton className="h-3.5 w-[75%] bg-muted/40" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableGrid>
    </div>
  )
}
