import { ProjectSlug, EntityKey, CommodityName, ProjectName, SystemSlug, SingularEntityName } from "@/lib/constants/enums"
import { Sprout, Wheat, Droplet, Hammer, Package, Leaf, Wine, type LucideIcon } from "lucide-react"

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
      return SystemSlug.USERS
    default:
      return null
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
  [CommodityName.WINE]: Wine,
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
    case ProjectName.VILLAGES:
      return SingularEntityName.VILLAGE
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
