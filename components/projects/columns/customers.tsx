import { ColumnDef } from "@tanstack/react-table"
import { User, Mail, ShieldCheck, Tag } from "lucide-react"
import { EntityKey, ProjectSlug } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { type Customer, type Affiliation } from "@/types"
import { createTextColumn, createUserEmailColumn, createVillageNameColumn, createFactoryIdColumn, createFactoryNameColumn, createVillageIdColumn } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.GOVT_ID, ColumnLabel.GOVT_ID, ShieldCheck, "font-mono text-muted-foreground text-xs"),
    createUserEmailColumn(ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createVillageIdColumn(),
    createVillageNameColumn(),
    
    createFactoryIdColumn<T>((row) => {
      const c = row as unknown as Customer
      const activeAffiliations = useEntitiesStore.getState().entities[ProjectSlug.AFFILIATIONS] as Affiliation[] || []
      return activeAffiliations
        .filter((a) => Number(a.customer_id) === Number(c.id))
        .map((a) => a.factory_id)
    }),
    createFactoryNameColumn<T>((row) => {
      const c = row as unknown as Customer
      const activeAffiliations = useEntitiesStore.getState().entities[ProjectSlug.AFFILIATIONS] as Affiliation[] || []
      return activeAffiliations
        .filter((a) => Number(a.customer_id) === Number(c.id))
        .map((a) => a.factory_id)
    }),
  ]
}
