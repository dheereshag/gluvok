import { type Table } from "@tanstack/react-table"
import { List } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DataTablePaginationPageSize<TData>({ table }: { table: Table<TData> }) {
  const pageSize = table.getState().pagination.pageSize
  return (
    <div className="flex items-center space-x-2">
      <List className="h-4 w-4 text-muted-foreground" />
      <p className="text-xs font-medium">Rows per page</p>
      <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
        <SelectTrigger className="h-8 w-[70px] text-xs">
          <SelectValue placeholder={`${pageSize}`} />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectGroup>
            <SelectLabel className="text-xs">Small Rows</SelectLabel>
            {[5, 10, 20].map((size) => (
              <SelectItem key={size} value={`${size}`} className="text-xs">{size}</SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel className="text-xs">Large Rows</SelectLabel>
            {[30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`} className="text-xs">{size}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
