import { RowData } from "@tanstack/react-table"
import { Village } from "@/data/villages"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    onEdit?: (village: Village) => void
    onDelete?: (village: Village) => void
  }
}
