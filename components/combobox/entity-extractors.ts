/**
 * @file components/combobox/entity-extractors.ts
 * @description Helpers for mapping raw database records of different types (customers, rates, users)
 * to a standardized `{ id, name }` shape.
 */

import { ProjectSlug, SystemSlug } from "@/lib/constants/enums"
import {
  type Rate,
  type EntityRecord,
} from "@/types"

export type Entity = EntityRecord | { id: string; email: string }

/**
 * Standard extractor helper
 * Extract ID and name fields directly from simple database records.
 */
const extractByIdAndName = (item: any) => {
  return {
    id: String(item.id),
    name: item.name,
  }
}

/**
 * ENTITY_EXTRACTORS map
 * Registry of mapping functions for converting database rows into `{ id, name }` display properties.
 */
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
    return {
      id: String(p.id),
      name: `${p.commodity_name} (${p.factory_name}) (₹${parseFloat(p.unit_price)})`
    }
  },
}


