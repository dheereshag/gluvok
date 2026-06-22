/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectSlug } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import {
  type Rate,
  type Assignment,
  type Affiliation,
  type EntityRecord,
} from "@/types"

export type Entity = EntityRecord | { id: string; email: string }

const extractByIdAndName = (item: any) => {
  return {
    id: String(item.id ?? ""),
    name: item.name,
  }
}

function getEntityName(
  slug: ProjectSlug,
  id: string | number,
  fallbackLabel: string
): string {
  const storeState = useEntitiesStore.getState()
  const entities = storeState.entities[slug] || []
  const entity = entities.find((e) => String(e.id) === String(id))
  return entity ? (entity as any).name : `${fallbackLabel} ${id}`
}

export const ENTITY_EXTRACTORS: Record<string, (item: any) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: extractByIdAndName,
  [ProjectSlug.PROFILES]: extractByIdAndName,
  [ProjectSlug.CENTERS]: extractByIdAndName,
  [ProjectSlug.COMMODITIES]: extractByIdAndName,
  [ProjectSlug.FACTORIES]: extractByIdAndName,
  [ProjectSlug.VILLAGES]: extractByIdAndName,
  "users": (item) => ({ id: item.id, name: item.email }),
  [ProjectSlug.RATES]: (item) => {
    const p = item as Rate
    const factoryName = getEntityName(ProjectSlug.FACTORIES, p.factory_id, "Factory")
    const commodityName = getEntityName(ProjectSlug.COMMODITIES, p.commodity_id, "Commodity")
    return {
      id: String(p.id),
      name: `${commodityName} (${factoryName}) (₹${parseFloat(p.unit_price)})`
    }
  },
  [ProjectSlug.ASSIGNMENTS]: (item) => {
    const a = item as Assignment
    const factoryName = getEntityName(ProjectSlug.FACTORIES, a.factory_id, "Factory")
    const profileName = getEntityName(ProjectSlug.PROFILES, a.profile_id, "Profile")
    return {
      id: String(a.id),
      name: `${profileName} @ ${factoryName}`
    }
  },
  [ProjectSlug.AFFILIATIONS]: (item) => {
    const a = item as Affiliation
    const factoryName = getEntityName(ProjectSlug.FACTORIES, a.factory_id, "Factory")
    const customerName = getEntityName(ProjectSlug.CUSTOMERS, a.customer_id, "Customer")
    return {
      id: String(a.id),
      name: `${customerName} @ ${factoryName}`
    }
  },
}
