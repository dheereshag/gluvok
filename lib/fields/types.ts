export enum ProjectSlug {
  CENTERS = "centers",
  COMMODITIES = "commodities",
  COMMODITY_PRICES = "commodity_prices",
  CUSTOMERS = "customers",
  WEIGHMENTS = "weighments",
  FACTORIES = "factories",
  OPERATORS = "operators",
  USERS = "users",
  VILLAGES = "villages",
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  STATE = "state",
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
  COMMODITY_PRICE_ID = "commodity_price_id",
  CENTER_ID = "center_id",
  OPERATOR_ID = "operator_id",
  CUSTOMER_ID = "customer_id",
  EMAIL = "email",
  ROLE = "role",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  AADHAR_NUMBER = "aadhar_number",
  GOVT_ID = "govt_id",
  IMAGES = "images"
}

export interface FieldConfig {
  key: EntityKey
  label: string
  placeholder: string
  type: FieldType
}
