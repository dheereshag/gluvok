import { ProjectSlug, EntityKey } from "./types"

export function getPrimaryIdKey(slug: string | ProjectSlug): EntityKey {
  switch (slug) {
    case ProjectSlug.CUSTOMERS:
      return EntityKey.GOVT_ID
    case ProjectSlug.OPERATORS:
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
    case EntityKey.COMMODITY_PRICE_ID:
      return ProjectSlug.COMMODITY_PRICES
    case EntityKey.CENTER_ID:
      return ProjectSlug.CENTERS
    case EntityKey.OPERATOR_ID:
      return ProjectSlug.OPERATORS
    case EntityKey.CUSTOMER_ID:
      return ProjectSlug.CUSTOMERS
    default:
      return null
  }
}
