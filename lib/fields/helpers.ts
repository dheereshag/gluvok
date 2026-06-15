import { ProjectSlug, EntityKey, CommodityName } from "./types"
import { Sprout, Wheat, Droplet, Hammer, Package, Leaf, type LucideIcon } from "lucide-react"

export function getPrimaryIdKey(slug: string | ProjectSlug): EntityKey {
  switch (slug) {
    case ProjectSlug.CUSTOMERS:
      return EntityKey.GOVT_ID
    case ProjectSlug.PROFILES:
      return EntityKey.AADHAR_NUMBER
    case ProjectSlug.COMMODITIES:
      return EntityKey.NAME
    default:
      return EntityKey.ID
  }
}

export function getReferencedEntitySlug(key: string | EntityKey): ProjectSlug | null {
  switch (key) {
    case EntityKey.ID:
      return ProjectSlug.USERS
    case EntityKey.FACTORY_ID:
      return ProjectSlug.FACTORIES
    case EntityKey.VILLAGE_ID:
      return ProjectSlug.VILLAGES
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
      return ProjectSlug.USERS
    default:
      return null
  }
}

export function isPrimaryKeyEditable(slug: string | ProjectSlug): boolean {
  switch (slug) {
    case ProjectSlug.COMMODITIES:
      return true
    default:
      return false
  }
}

export function isCommoditySlug(slug: string | ProjectSlug): boolean {
  switch (slug) {
    case ProjectSlug.COMMODITIES:
      return true
    default:
      return false
  }
}

const COMMODITY_ICON_MAP: Record<CommodityName, LucideIcon> = {
  [CommodityName.WHEAT]: Wheat,
  [CommodityName.CORN]: Sprout,
  [CommodityName.CRUDE_OIL]: Droplet,
  [CommodityName.SCRAP_COPPER]: Hammer,
  [CommodityName.BARLEY]: Leaf,
}

export function getCommodityIcon(name: string): LucideIcon {
  return COMMODITY_ICON_MAP[name as CommodityName] ?? Package
}

export function getItemIcon(type: string | ProjectSlug, label: string): LucideIcon | null {
  switch (type as ProjectSlug) {
    case ProjectSlug.COMMODITIES:
      return getCommodityIcon(label)
    default:
      return null
  }
}
