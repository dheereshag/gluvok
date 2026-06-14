import { ProjectSlug } from "@/lib/fields"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { commodityPrices } from "@/data/commodity-prices"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { operators } from "@/data/operators"
import { villages } from "@/data/villages"
import { users } from "@/data/users"
import { useEntitiesStore } from "@/lib/store"
import {
  type Center,
  type Commodity,
  type CommodityPrice,
  type Customer,
  type Factory,
  type Operator,
  type User,
  type Village,
} from "@/types"

export type Entity = Center | Commodity | CommodityPrice | Customer | Factory | Operator | User | Village

export const FALLBACK_DATA: Record<string, Entity[]> = {
  [ProjectSlug.CENTERS]: centers,
  [ProjectSlug.COMMODITIES]: commodities,
  [ProjectSlug.COMMODITY_PRICES]: commodityPrices,
  [ProjectSlug.CUSTOMERS]: customers,
  [ProjectSlug.FACTORIES]: factories,
  [ProjectSlug.OPERATORS]: operators,
  [ProjectSlug.VILLAGES]: villages,
  [ProjectSlug.USERS]: users,
}

export const ENTITY_EXTRACTORS: Record<string, (item: Entity) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: (item) => ({ id: String((item as Customer).govt_id ?? ""), name: (item as Customer).name }),
  [ProjectSlug.OPERATORS]: (item) => ({ id: String((item as Operator).aadhar_number ?? ""), name: (item as Operator).name }),
  [ProjectSlug.CENTERS]: (item) => ({ id: String((item as Center).id ?? ""), name: (item as Center).name }),
  [ProjectSlug.COMMODITIES]: (item) => ({ id: (item as Commodity).name, name: (item as Commodity).name }),
  [ProjectSlug.COMMODITY_PRICES]: (item) => {
    const p = item as CommodityPrice
    const storeState = useEntitiesStore.getState()
    const activeFactories = (storeState.entities[ProjectSlug.FACTORIES] || factories) as Factory[]
    const factory = activeFactories.find((f) => String(f.id) === String(p.factory_id))
    const factoryName = factory ? factory.name : `Factory ${p.factory_id}`
    return {
      id: String(p.id),
      name: `${p.commodity_name} (${factoryName} - ID: ${p.factory_id}) (${parseFloat(p.unit_price)} INR)`
    }
  },
  [ProjectSlug.FACTORIES]: (item) => ({ id: String((item as Factory).id ?? ""), name: (item as Factory).name }),
  [ProjectSlug.VILLAGES]: (item) => ({ id: String((item as Village).id ?? ""), name: (item as Village).name }),
  [ProjectSlug.USERS]: (item) => ({ id: (item as User).id, name: (item as User).email }),
}
