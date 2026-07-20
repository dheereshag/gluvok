/**
 * @file lib/fields/helpers.ts
 * @description Helper definitions or configuration for entity table fields (helpers).
 */

import { ProjectSlug, EntityKey, CommodityName, ProjectName, SystemSlug, SingularEntityName, FieldType } from "@/lib/constants/enums"
import { Sprout, Wheat, Droplet, Hammer, Package, Leaf, Wine, Weight, type LucideIcon } from "lucide-react"

export function getPrimaryIdKey(slug: string | ProjectSlug): EntityKey {
  switch (slug) {
    default:
      break
  }
  return EntityKey.ID
}

export function getReferencedEntitySlug(key: string | EntityKey): string | null {
  switch (key) {
    case EntityKey.FACTORY_ID:
      return ProjectSlug.FACTORIES
    case EntityKey.COMMODITY_ID:
    case EntityKey.COMMODITY_NAME:
      return ProjectSlug.COMMODITIES
    case EntityKey.RATE_ID:
      return ProjectSlug.RATES
    case EntityKey.CENTER_ID:
      return ProjectSlug.CENTERS
    case EntityKey.PROFILE_ID:
      return ProjectSlug.PROFILES
    case EntityKey.CUSTOMER_ID:
      return ProjectSlug.CUSTOMERS
    case EntityKey.USER_ID:
      return SystemSlug.USERS
    default:
      return null
  }
}

export function isCommoditySlug(slug: string | ProjectSlug): boolean {
  return slug === ProjectSlug.COMMODITIES || slug === "commodities"
}

const COMMODITY_ICON_MAP: Record<CommodityName, LucideIcon> = {
  [CommodityName.WHEAT]: Wheat,
  [CommodityName.CORN]: Sprout,
  [CommodityName.CRUDE_OIL]: Droplet,
  [CommodityName.SCRAP_COPPER]: Hammer,
  [CommodityName.BARLEY]: Leaf,
  [CommodityName.WINE]: Wine,
}

export function getCommodityIcon(name: string): LucideIcon {
  if (!name) return Package
  const cleanName = name.split(" (ID:")[0].trim().toLowerCase()
  const entry = Object.entries(COMMODITY_ICON_MAP).find(
    ([key]) => key.toLowerCase() === cleanName
  )
  return entry ? entry[1] : Package
}

export function getItemIcon(type: string | ProjectSlug, label: string): LucideIcon | null {
  switch (type as ProjectSlug | string) {
    case ProjectSlug.COMMODITIES:
    case "commodities":
      return getCommodityIcon(label)
    case FieldType.UNIT:
    case "unit":
      return Weight
    default:
      return null
  }
}

export function getSelectPlaceholder(entity: string): string {
  return `Select ${entity.toLowerCase()}...`
}

export function getSingularName(name: string): string {
  switch (name) {
    case ProjectName.CENTERS:
      return SingularEntityName.CENTER
    case ProjectName.COMMODITIES:
      return SingularEntityName.COMMODITY
    case ProjectName.RATES:
      return SingularEntityName.RATE
    case ProjectName.CUSTOMERS:
      return SingularEntityName.CUSTOMER
    case ProjectName.WEIGHMENTS:
      return SingularEntityName.WEIGHMENT
    case ProjectName.FACTORIES:
      return SingularEntityName.FACTORY
    case ProjectName.PROFILES:
      return SingularEntityName.PROFILE

    default:
      if (name.endsWith("ies")) {
        return name.slice(0, -3) + "y"
      }
      if (name.endsWith("s")) {
        return name.slice(0, -1)
      }
      return name
  }
}
