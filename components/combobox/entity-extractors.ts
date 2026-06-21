import { ProjectSlug } from "@/lib/constants/enums"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { rates } from "@/data/rates"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { profiles } from "@/data/profiles"
import { villages } from "@/data/villages"
import { users } from "@/data/users"
import { assignments } from "@/data/assignments"
import { useEntitiesStore } from "@/lib/store"
import {
  type Center,
  type Commodity,
  type Rate,
  type Customer,
  type Factory,
  type Profile,
  type User,
  type Village,
  type Assignment,
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
}

export const ENTITY_EXTRACTORS: Record<string, (item: Entity) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: (item) => ({ id: String((item as Customer).id ?? ""), name: (item as Customer).name }),
  [ProjectSlug.PROFILES]: (item) => ({ id: String((item as Profile).id ?? ""), name: (item as Profile).name }),
  [ProjectSlug.CENTERS]: (item) => ({ id: String((item as Center).id ?? ""), name: (item as Center).name }),
  [ProjectSlug.COMMODITIES]: (item) => ({ id: String((item as Commodity).id ?? ""), name: (item as Commodity).name }),
  [ProjectSlug.RATES]: (item) => {
    const p = item as Rate
    const storeState = useEntitiesStore.getState()
    const activeFactories = (storeState.entities[ProjectSlug.FACTORIES] || factories) as Factory[]
    const activeCommodities = (storeState.entities[ProjectSlug.COMMODITIES] || commodities) as Commodity[]
    const factory = activeFactories.find((f) => String(f.id) === String(p.factory_id))
    const commodity = activeCommodities.find((c) => Number(c.id) === Number(p.commodity_id))
    const factoryName = factory ? factory.name : `Factory ${p.factory_id}`
    const commodityName = commodity ? commodity.name : `Commodity ${p.commodity_id}`
    return {
      id: String(p.id),
      name: `${commodityName} (${factoryName}) (₹${parseFloat(p.unit_price)})`
    }
  },
  [ProjectSlug.FACTORIES]: (item) => ({ id: String((item as Factory).id ?? ""), name: (item as Factory).name }),
  [ProjectSlug.VILLAGES]: (item) => ({ id: String((item as Village).id ?? ""), name: (item as Village).name }),
  [ProjectSlug.USERS]: (item) => ({ id: (item as User).id, name: (item as User).email }),
  [ProjectSlug.ASSIGNMENTS]: (item) => {
    const a = item as Assignment
    const storeState = useEntitiesStore.getState()
    const activeFactories = (storeState.entities[ProjectSlug.FACTORIES] || factories) as Factory[]
    const activeProfiles = (storeState.entities[ProjectSlug.PROFILES] || profiles) as Profile[]
    const factory = activeFactories.find((f) => String(f.id) === String(a.factory_id))
    const profile = activeProfiles.find((p) => Number(p.id) === Number(a.profile_id))
    const factoryName = factory ? factory.name : `Factory ${a.factory_id}`
    const profileName = profile ? profile.name : `Profile ${a.profile_id}`
    return {
      id: String(a.id),
      name: `${profileName} @ ${factoryName}`
    }
  },
}

