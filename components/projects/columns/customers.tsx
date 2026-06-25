import { ColumnDef } from "@tanstack/react-table"
import { User, Mail, ShieldCheck, Tag, Home } from "lucide-react"
import { EntityKey, ProjectSlug } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn, createCustomColumn } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type Profile } from "@/types"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.GOVT_ID, ColumnLabel.GOVT_ID, ShieldCheck, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.USER_ID, ColumnLabel.EMAIL, Mail, (userId) => {
      if (!userId) return <span className="text-muted-foreground">—</span>
      const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
      const profile = profiles.find((p) => String(p.user_id) === String(userId))
      return <div className="font-semibold text-foreground text-xs">{profile?.email || userId}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createIdColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home),
    createTextColumn("village_name", ColumnLabel.VILLAGE_NAME, Home),
  ]
}
