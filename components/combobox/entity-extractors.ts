import { ProjectSlug } from "@/lib/fields"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { rates } from "@/data/rates"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { profiles } from "@/data/profiles"
import { villages } from "@/data/villages"
import { users } from "@/data/users"
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
} from "@/types"

export type Entity = Center | Commodity | Rate | Customer | Factory | Profile | User | Village

export const FALLBACK_DATA: Record<string, Entity[]> = {
  [ProjectSlug.CENTERS]: centers,
  [ProjectSlug.COMMODITIES]: commodities,
  [ProjectSlug.RATES]: rates,
  [ProjectSlug.CUSTOMERS]: customers,
  [ProjectSlug.FACTORIES]: factories,
  [ProjectSlug.PROFILES]: profiles,
  [ProjectSlug.VILLAGES]: villages,
  [ProjectSlug.USERS]: users,
}

export const ENTITY_EXTRACTORS: Record<string, (item: Entity) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: (item) => ({ id: String((item as Customer).govt_id ?? ""), name: (item as Customer).name }),
  [ProjectSlug.PROFILES]: (item) => ({ id: String((item as Profile).aadhar_number ?? ""), name: (item as Profile).name }),
  [ProjectSlug.CENTERS]: (item) => ({ id: String((item as Center).id ?? ""), name: (item as Center).name }),
  [ProjectSlug.COMMODITIES]: (item) => ({ id: (item as Commodity).name, name: (item as Commodity).name }),
  [ProjectSlug.RATES]: (item) => {
    const p = item as Rate
    const storeState = useEntitiesStore.getState()
    const activeFactories = (storeState.entities[ProjectSlug.FACTORIES] || factories) as Factory[]
    const factory = activeFactories.find((f) => String(f.id) === String(p.factory_id))
    const factoryName = factory ? factory.name : `Factory ${p.factory_id}`
    return {
      id: String(p.id),
      name: `${p.commodity_name} (${factoryName}) (₹${parseFloat(p.unit_price)})`
    }
  },
  [ProjectSlug.FACTORIES]: (item) => ({ id: String((item as Factory).id ?? ""), name: (item as Factory).name }),
  [ProjectSlug.VILLAGES]: (item) => ({ id: String((item as Village).id ?? ""), name: (item as Village).name }),
  [ProjectSlug.USERS]: (item) => ({ id: (item as User).id, name: (item as User).email }),
}
