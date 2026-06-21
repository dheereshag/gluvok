import { ProjectSlug } from "@/lib/constants/enums"
import {
  centers,
  commodities,
  rates,
  customers,
  factories,
  profiles,
  villages,
  users,
  assignments,
  affiliations,
} from "@/data"
import { useEntitiesStore } from "@/lib/store"
import {
  type Rate,
  type User,
  type Assignment,
  type Affiliation,
  type EntityRecord,
} from "@/types"

export type Entity = EntityRecord

export const FALLBACK_DATA: Record<string, Entity[]> = {
  [ProjectSlug.CENTERS]: centers,
  [ProjectSlug.COMMODITIES]: commodities,
  [ProjectSlug.RATES]: rates,
  [ProjectSlug.CUSTOMERS]: customers,
  [ProjectSlug.FACTORIES]: factories,
  [ProjectSlug.PROFILES]: profiles,
  [ProjectSlug.VILLAGES]: villages,
  [ProjectSlug.USERS]: users,
  [ProjectSlug.ASSIGNMENTS]: assignments,
  [ProjectSlug.AFFILIATIONS]: affiliations,
}

const extractByIdAndName = (item: Entity) => {
  const namedItem = item as { id: string | number; name: string }
  return {
    id: String(namedItem.id ?? ""),
    name: namedItem.name,
  }
}

function getEntityName<T extends Entity>(
  slug: ProjectSlug,
  id: string | number,
  fallbackData: T[],
  getName: (item: T) => string,
  fallbackLabel: string
): string {
  const storeState = useEntitiesStore.getState()
  const entities = (storeState.entities[slug] || fallbackData) as T[]
  const entity = entities.find((e) => String(e.id) === String(id))
  return entity ? getName(entity) : `${fallbackLabel} ${id}`
}

export const ENTITY_EXTRACTORS: Record<string, (item: Entity) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: extractByIdAndName,
  [ProjectSlug.PROFILES]: extractByIdAndName,
  [ProjectSlug.CENTERS]: extractByIdAndName,
  [ProjectSlug.COMMODITIES]: extractByIdAndName,
  [ProjectSlug.FACTORIES]: extractByIdAndName,
  [ProjectSlug.VILLAGES]: extractByIdAndName,
  [ProjectSlug.USERS]: (item) => ({ id: (item as User).id, name: (item as User).email }),
  [ProjectSlug.RATES]: (item) => {
    const p = item as Rate
    const factoryName = getEntityName(ProjectSlug.FACTORIES, p.factory_id, factories, (f) => f.name, "Factory")
    const commodityName = getEntityName(ProjectSlug.COMMODITIES, p.commodity_id, commodities, (c) => c.name, "Commodity")
    return {
      id: String(p.id),
      name: `${commodityName} (${factoryName}) (₹${parseFloat(p.unit_price)})`
    }
  },
  [ProjectSlug.ASSIGNMENTS]: (item) => {
    const a = item as Assignment
    const factoryName = getEntityName(ProjectSlug.FACTORIES, a.factory_id, factories, (f) => f.name, "Factory")
    const profileName = getEntityName(ProjectSlug.PROFILES, a.profile_id, profiles, (p) => p.name, "Profile")
    return {
      id: String(a.id),
      name: `${profileName} @ ${factoryName}`
    }
  },
  [ProjectSlug.AFFILIATIONS]: (item) => {
    const a = item as Affiliation
    const factoryName = getEntityName(ProjectSlug.FACTORIES, a.factory_id, factories, (f) => f.name, "Factory")
    const customerName = getEntityName(ProjectSlug.CUSTOMERS, a.customer_id, customers, (c) => c.name, "Customer")
    return {
      id: String(a.id),
      name: `${customerName} @ ${factoryName}`
    }
  },
}


