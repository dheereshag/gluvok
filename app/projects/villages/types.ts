import { RowData } from "@tanstack/react-table"
import { Village } from "@/data/villages"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    _unused?: TData
    onEdit?: (village: Village) => void
    onDelete?: (village: Village) => void
  }
}
