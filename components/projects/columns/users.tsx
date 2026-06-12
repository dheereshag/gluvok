import { ColumnDef } from "@tanstack/react-table"
import { Mail, ShieldCheck } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { PillIndicator } from "@/components/kibo-ui/pill"
import { createTextColumn, createPillColumn } from "./helpers"

export function getUsersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.EMAIL, ColumnLabel.EMAIL, Mail),
    createPillColumn(
      EntityKey.ROLE,
      ColumnLabel.ROLE,
      ShieldCheck,
      (val) => <><PillIndicator pulse variant="success" />{val}</>,
      { className: "text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
    ),
  ]
}
