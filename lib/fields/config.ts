import { ProjectSlug, EntityKey, FieldType, type FieldConfig } from "./types"

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  [ProjectSlug.CENTERS]: [
    { key: EntityKey.NAME, label: "Center Name", placeholder: "e.g. Center F", type: FieldType.TEXT },
    { key: EntityKey.FACTORY_ID, label: "Factory ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.COMMODITIES]: [
    { key: EntityKey.NAME, label: "Commodity Name", placeholder: "e.g. Barley", type: FieldType.TEXT },
  ],
  [ProjectSlug.COMMODITY_PRICES]: [
    { key: EntityKey.COMMODITY_NAME, label: "Commodity Name", placeholder: "Select commodity...", type: FieldType.TEXT },
    { key: EntityKey.UNIT_PRICE, label: "Unit Price (INR)", placeholder: "e.g. 15000", type: FieldType.NUMBER },
  ],
  [ProjectSlug.CUSTOMERS]: [
    { key: EntityKey.NAME, label: "Customer Name", placeholder: "e.g. Ajay Kumar", type: FieldType.TEXT },
    { key: EntityKey.FATHER_NAME, label: "Father's Name", placeholder: "e.g. Vijay Kumar", type: FieldType.TEXT },
    { key: EntityKey.VILLAGE_ID, label: "Village ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.WEIGHMENTS]: [
    {
      key: EntityKey.VEHICLE_NUMBER,
      label: "Vehicle Number",
      placeholder: "e.g. PB10XY1234",
      type: FieldType.TEXT,
      className: "uppercase",
      transformOnChange: (v) => v.toUpperCase(),
    },
    { key: EntityKey.WEIGHT, label: "Weight (tons)", placeholder: "e.g. 15.5", type: FieldType.NUMBER },
    { key: EntityKey.COMMODITY_PRICE_ID, label: "Commodity Price ID", placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: EntityKey.CENTER_ID, label: "Center ID", placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: EntityKey.OPERATOR_ID, label: "Operator ID", placeholder: "e.g. 123456789012", type: FieldType.TEXT },
    { key: EntityKey.CUSTOMER_ID, label: "Customer ID", placeholder: "e.g. GOV1001", type: FieldType.TEXT },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: EntityKey.NAME, label: "Factory Name", placeholder: "e.g. Factory C", type: FieldType.TEXT },
    { key: EntityKey.VILLAGE_ID, label: "Village ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.OPERATORS]: [
    { key: EntityKey.ID, label: "System ID", placeholder: "e.g. operator-id", type: FieldType.TEXT },
    { key: EntityKey.NAME, label: "Operator Name", placeholder: "e.g. Amit Sharma", type: FieldType.TEXT },
  ],
  [ProjectSlug.USERS]: [
    { key: EntityKey.EMAIL, label: "Email Address", placeholder: "e.g. user@example.com", type: FieldType.TEXT },
    { key: EntityKey.ROLE, label: "User Role", placeholder: "e.g. operator", type: FieldType.TEXT },
  ],
  [ProjectSlug.VILLAGES]: [
    { key: EntityKey.NAME, label: "Village Name", placeholder: "e.g. Ludhiana", type: FieldType.TEXT },
    { key: EntityKey.STATE, label: "State", placeholder: "Select state...", type: FieldType.STATE },
  ],
}

export function getPrimaryIdKey(slug: string | ProjectSlug): EntityKey {
  if (slug === ProjectSlug.CUSTOMERS) return EntityKey.GOVT_ID
  if (slug === ProjectSlug.OPERATORS) return EntityKey.AADHAR_NUMBER
  if (slug === ProjectSlug.COMMODITIES) return EntityKey.NAME
  return EntityKey.ID
}

export function getReferencedEntitySlug(key: string | EntityKey): ProjectSlug | null {
  if (key === EntityKey.FACTORY_ID) return ProjectSlug.FACTORIES
  if (key === EntityKey.VILLAGE_ID) return ProjectSlug.VILLAGES
  if (key === EntityKey.COMMODITY_ID) return ProjectSlug.COMMODITIES
  if (key === EntityKey.COMMODITY_NAME) return ProjectSlug.COMMODITIES
  if (key === EntityKey.COMMODITY_PRICE_ID) return ProjectSlug.COMMODITY_PRICES
  if (key === EntityKey.CENTER_ID) return ProjectSlug.CENTERS
  if (key === EntityKey.OPERATOR_ID) return ProjectSlug.OPERATORS
  if (key === EntityKey.CUSTOMER_ID) return ProjectSlug.CUSTOMERS
  return null
}
