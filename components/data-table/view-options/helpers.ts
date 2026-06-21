import { Hash, Globe, Calendar, CalendarClock, Image, Tag, Factory } from "lucide-react"
import { ColumnLabel } from "@/lib/constants/enums"

export const COLUMN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  id: Hash,
  name: Tag,
  state: Globe,
  created_at: Calendar,
  updated_at: CalendarClock,
  images: Image,
  factory_id: Factory,
  factory_name: Factory,
}

export function getColumnLabel(id: string): string {
  switch (id) {
    case "id": return ColumnLabel.ID
    case "govt_id": return ColumnLabel.GOVT_ID
    case "aadhar_number": return ColumnLabel.AADHAR_NUMBER
    case "name": return ColumnLabel.NAME
    case "state": return ColumnLabel.STATE
    case "factory_id": return ColumnLabel.FACTORY_ID
    case "unit_price": return ColumnLabel.UNIT_PRICE
    case "father_name": return ColumnLabel.FATHER_NAME
    case "village_id": return ColumnLabel.VILLAGE_ID
    case "vehicle_number": return ColumnLabel.VEHICLE_NUMBER
    case "weight": return ColumnLabel.WEIGHT
    case "commodity_id": return ColumnLabel.COMMODITY_ID
    case "commodity_name": return ColumnLabel.COMMODITY_NAME
    case "rate_id": return ColumnLabel.RATE_ID
    case "center_id": return ColumnLabel.CENTER_ID
    case "profile_id": return ColumnLabel.PROFILE_ID
    case "customer_id": return ColumnLabel.CUSTOMER_ID
    case "email": return ColumnLabel.EMAIL
    case "role": return ColumnLabel.ROLE
    case "created_at": return ColumnLabel.CREATED_AT
    case "updated_at": return ColumnLabel.UPDATED_AT
    case "images": return ColumnLabel.IMAGES
    case "user_id": return ColumnLabel.USER_ID
    case "commodity": return ColumnLabel.COMMODITY
    case "factory": return ColumnLabel.FACTORY
    case "is_active": return ColumnLabel.IS_ACTIVE
    case "user": return ColumnLabel.USER
    case "village": return ColumnLabel.VILLAGE
    case "rate": return ColumnLabel.RATE
    case "center": return ColumnLabel.CENTER
    case "profile": return ColumnLabel.PROFILE
    case "customer": return ColumnLabel.CUSTOMER
    case "factory_name": return ColumnLabel.FACTORY_NAME
    case "village_name": return ColumnLabel.VILLAGE_NAME
    case "user_email": return ColumnLabel.USER_EMAIL
    // Custom resolved column names:
    case "profile_name": return ColumnLabel.PROFILE
    case "profile_aadhar": return ColumnLabel.AADHAR_NUMBER
    case "customer_name": return ColumnLabel.CUSTOMER
    case "customer_govt_id": return ColumnLabel.GOVT_ID
    default:
      return id
  }
}
