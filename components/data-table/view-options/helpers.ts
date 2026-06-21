import { Hash, Globe, Calendar, CalendarClock, Image, Tag, Factory } from "lucide-react"
import { ColumnLabel, EntityKey } from "@/lib/constants/enums"

export const COLUMN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  [EntityKey.ID]: Hash,
  [EntityKey.NAME]: Tag,
  [EntityKey.STATE]: Globe,
  [EntityKey.CREATED_AT]: Calendar,
  [EntityKey.UPDATED_AT]: CalendarClock,
  [EntityKey.IMAGES]: Image,
  [EntityKey.FACTORY_ID]: Factory,
  [EntityKey.FACTORY_NAME]: Factory,
}

export function getColumnLabel(id: string): string {
  switch (id) {
    case EntityKey.ID: return ColumnLabel.ID
    case EntityKey.GOVT_ID: return ColumnLabel.GOVT_ID
    case EntityKey.AADHAR_NUMBER: return ColumnLabel.AADHAR_NUMBER
    case EntityKey.NAME: return ColumnLabel.NAME
    case EntityKey.STATE: return ColumnLabel.STATE
    case EntityKey.FACTORY_ID: return ColumnLabel.FACTORY_ID
    case EntityKey.UNIT_PRICE: return ColumnLabel.UNIT_PRICE
    case EntityKey.UNIT: return ColumnLabel.UNIT
    case EntityKey.FATHER_NAME: return ColumnLabel.FATHER_NAME
    case EntityKey.VILLAGE_ID: return ColumnLabel.VILLAGE_ID
    case EntityKey.VEHICLE_NUMBER: return ColumnLabel.VEHICLE_NUMBER
    case EntityKey.WEIGHT: return ColumnLabel.WEIGHT
    case EntityKey.COMMODITY_ID: return ColumnLabel.COMMODITY_ID
    case EntityKey.COMMODITY_NAME: return ColumnLabel.COMMODITY_NAME
    case EntityKey.RATE_ID: return ColumnLabel.RATE_ID
    case EntityKey.CENTER_ID: return ColumnLabel.CENTER_ID
    case EntityKey.PROFILE_ID: return ColumnLabel.PROFILE_ID
    case EntityKey.CUSTOMER_ID: return ColumnLabel.CUSTOMER_ID
    case EntityKey.EMAIL: return ColumnLabel.EMAIL
    case EntityKey.ROLE: return ColumnLabel.ROLE
    case EntityKey.CREATED_AT: return ColumnLabel.CREATED_AT
    case EntityKey.UPDATED_AT: return ColumnLabel.UPDATED_AT
    case EntityKey.IMAGES: return ColumnLabel.IMAGES
    case EntityKey.USER_ID: return ColumnLabel.USER_ID
    case EntityKey.IS_ACTIVE: return ColumnLabel.IS_ACTIVE
    case EntityKey.FACTORY_NAME: return ColumnLabel.FACTORY_NAME
    case EntityKey.VILLAGE_NAME: return ColumnLabel.VILLAGE_NAME
    case EntityKey.PROFILE_NAME: return ColumnLabel.PROFILE
    case EntityKey.PROFILE_AADHAR: return ColumnLabel.AADHAR_NUMBER
    case EntityKey.CUSTOMER_NAME: return ColumnLabel.CUSTOMER
    case EntityKey.CENTER_NAME: return ColumnLabel.CENTER
    case EntityKey.CUSTOMER_GOVT_ID: return ColumnLabel.GOVT_ID
    case "commodity": return ColumnLabel.COMMODITY
    case "factory": return ColumnLabel.FACTORY
    case "user": return ColumnLabel.USER
    case "village": return ColumnLabel.VILLAGE
    case "rate": return ColumnLabel.RATE
    case "center": return ColumnLabel.CENTER
    case "profile": return ColumnLabel.PROFILE
    case "customer": return ColumnLabel.CUSTOMER
    case "user_email": return ColumnLabel.USER_EMAIL
    default:
      return id
  }
}
