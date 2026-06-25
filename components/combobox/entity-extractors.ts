/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectSlug, ColumnLabel, SystemSlug } from "@/lib/constants/enums"
import {
  type Rate,
  type EntityRecord,
} from "@/types"

export type Entity = EntityRecord | { id: string; email: string }

const extractByIdAndName = (item: any) => {
  return {
    id: String(item.id),
    name: item.name,
  }
}

export const ENTITY_EXTRACTORS: Record<string, (item: any) => { id: string; name: string }> = {
  [ProjectSlug.CUSTOMERS]: extractByIdAndName,
  [ProjectSlug.PROFILES]: extractByIdAndName,
  [ProjectSlug.CENTERS]: extractByIdAndName,
  [ProjectSlug.COMMODITIES]: extractByIdAndName,
  [ProjectSlug.FACTORIES]: extractByIdAndName,
  [ProjectSlug.VILLAGES]: extractByIdAndName,
  [SystemSlug.USERS]: (item) => ({ id: item.id, name: item.email }),
  [ProjectSlug.RATES]: (item) => {
    const p = item as Rate
    const factoryName = p.factory_name || `${ColumnLabel.FACTORY} ${p.factory_id}`
    const commodityName = p.commodity_name || `${ColumnLabel.COMMODITY} ${p.commodity_id}`
    return {
      id: String(p.id),
      name: `${commodityName} (${factoryName}) (₹${parseFloat(p.unit_price)})`
    }
  },
}


