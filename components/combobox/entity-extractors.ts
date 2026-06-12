import { ProjectSlug } from "@/lib/fields"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { operators } from "@/data/operators"
import { villages } from "@/data/villages"
import {
  type Center,
  type Commodity,
  type Customer,
  type Factory,
  type Operator,
  type Village,
} from "@/types"

export type Entity = Center | Commodity | Customer | Factory | Operator | Village

export const FALLBACK_DATA: Record<string, Entity[]> = {
  [ProjectSlug.CENTERS]: centers,
  [ProjectSlug.COMMODITIES]: commodities,
  [ProjectSlug.CUSTOMERS]: customers,
  [ProjectSlug.FACTORIES]: factories,
  [ProjectSlug.OPERATORS]: operators,
  [ProjectSlug.VILLAGES]: villages,
}

export const ENTITY_EXTRACTORS: Record<string, (item: Entity) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: (item) => ({ id: String((item as Customer).govt_id ?? ""), name: item.name }),
  [ProjectSlug.OPERATORS]: (item) => ({ id: String((item as Operator).aadhar_number ?? ""), name: item.name }),
  [ProjectSlug.CENTERS]: (item) => ({ id: String((item as Center).id ?? ""), name: item.name }),
  [ProjectSlug.COMMODITIES]: (item) => ({ id: String((item as Commodity).id ?? ""), name: item.name }),
  [ProjectSlug.FACTORIES]: (item) => ({ id: String((item as Factory).id ?? ""), name: item.name }),
  [ProjectSlug.VILLAGES]: (item) => ({ id: String((item as Village).id ?? ""), name: item.name }),
}
