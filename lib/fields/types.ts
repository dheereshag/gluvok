import { ComponentType } from "react"

export enum ProjectSlug {
  CENTERS = "centers",
  COMMODITIES = "commodities",
  RATES = "rates",
  CUSTOMERS = "customers",
  WEIGHMENTS = "weighments",
  FACTORIES = "factories",
  PROFILES = "profiles",
  USERS = "users",
  VILLAGES = "villages",
  ASSIGNMENTS = "assignments",
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  STATE = "state",
  IMAGES = "images",
  ROLE = "role",
  CHECKBOX = "checkbox",
}

export enum EntityKey {
  ID = "id",
  NAME = "name",
  STATE = "state",
  FACTORY_ID = "factory_id",
  UNIT_PRICE = "unit_price",
  FATHER_NAME = "father_name",
  VILLAGE_ID = "village_id",
  VEHICLE_NUMBER = "vehicle_number",
  WEIGHT = "weight",
  COMMODITY_ID = "commodity_id",
  COMMODITY_NAME = "commodity_name",
  RATE_ID = "rate_id",
  CENTER_ID = "center_id",
  PROFILE_ID = "profile_id",
  CUSTOMER_ID = "customer_id",
  EMAIL = "email",
  ROLE = "role",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  AADHAR_NUMBER = "aadhar_number",
  GOVT_ID = "govt_id",
  IMAGES = "images",
  USER_ID = "user_id",
  IS_ACTIVE = "is_active",
  FACTORY_NAME = "factory_name",
  VILLAGE_NAME = "village_name",
}

export enum InputMode {
  NONE = "none",
  TEXT = "text",
  TEL = "tel",
  URL = "url",
  EMAIL = "email",
  NUMERIC = "numeric",
  DECIMAL = "decimal",
  SEARCH = "search",
}

export enum CommodityName {
  WHEAT = "Wheat",
  CORN = "Corn",
  CRUDE_OIL = "Crude Oil",
  SCRAP_COPPER = "Scrap Copper",
  BARLEY = "Barley",
}

export interface FieldConfig {
  key: EntityKey
  label: string
  placeholder: string
  type: FieldType
  className?: string
  transformOnChange?: (value: string) => string
  inputMode?: InputMode
  icon?: ComponentType<{ className?: string }>
}
