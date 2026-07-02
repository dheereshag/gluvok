/**
 * @file components/projects/table/loading.tsx
 * @description Loading overlay component rendered inside the table while fetching data.
 */

import { Spinner } from "@/components/kibo-ui/spinner"

/**
 * ProjectTableLoading Component
 * Displays a centered loading indicator with a spinner and text.
 */
export function ProjectTableLoading() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-64 flex flex-col items-center justify-center gap-3">
        <Spinner variant="circle-filled" className="size-6 text-primary" />
        <span className="text-xs font-semibold text-muted-foreground/80">Loading data...</span>
      </div>
    </div>
  )
}
