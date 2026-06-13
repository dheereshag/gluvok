import { ProjectSlug, EntityKey, FieldType, type FieldConfig } from "./types"
import { ColumnLabel } from "@/lib/constants"

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  [ProjectSlug.CENTERS]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Center F", type: FieldType.TEXT },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.COMMODITIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Barley", type: FieldType.TEXT },
  ],
  [ProjectSlug.COMMODITY_PRICES]: [
    { key: EntityKey.COMMODITY_NAME, label: ColumnLabel.COMMODITY_NAME, placeholder: "Select commodity...", type: FieldType.TEXT },
    { key: EntityKey.UNIT_PRICE, label: ColumnLabel.UNIT_PRICE, placeholder: "e.g. 15000", type: FieldType.NUMBER },
  ],
  [ProjectSlug.CUSTOMERS]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Ajay Kumar", type: FieldType.TEXT },
    { key: EntityKey.FATHER_NAME, label: ColumnLabel.FATHER_NAME, placeholder: "e.g. Vijay Kumar", type: FieldType.TEXT },
    { key: EntityKey.VILLAGE_ID, label: ColumnLabel.VILLAGE_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.WEIGHMENTS]: [
    {
      key: EntityKey.VEHICLE_NUMBER,
      label: ColumnLabel.VEHICLE_NUMBER,
      placeholder: "e.g. PB10XY1234",
      type: FieldType.TEXT,
      className: "uppercase",
      transformOnChange: (v) => v.toUpperCase(),
    },
    { key: EntityKey.WEIGHT, label: ColumnLabel.WEIGHT, placeholder: "e.g. 15.5", type: FieldType.NUMBER },
    { key: EntityKey.COMMODITY_PRICE_ID, label: ColumnLabel.COMMODITY_PRICE_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: EntityKey.CENTER_ID, label: ColumnLabel.CENTER_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: EntityKey.OPERATOR_ID, label: ColumnLabel.OPERATOR_ID, placeholder: "e.g. 123456789012", type: FieldType.TEXT },
    { key: EntityKey.CUSTOMER_ID, label: ColumnLabel.CUSTOMER_ID, placeholder: "e.g. GOV1001", type: FieldType.TEXT },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Factory C", type: FieldType.TEXT },
    { key: EntityKey.VILLAGE_ID, label: ColumnLabel.VILLAGE_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.OPERATORS]: [
    { key: EntityKey.ID, label: ColumnLabel.ID, placeholder: "e.g. operator-id", type: FieldType.TEXT },
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Amit Sharma", type: FieldType.TEXT },
  ],
  [ProjectSlug.USERS]: [
    { key: EntityKey.EMAIL, label: ColumnLabel.EMAIL, placeholder: "e.g. user@example.com", type: FieldType.TEXT },
    { key: EntityKey.ROLE, label: ColumnLabel.ROLE, placeholder: "e.g. operator", type: FieldType.TEXT },
  ],
  [ProjectSlug.VILLAGES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Ludhiana", type: FieldType.TEXT },
    { key: EntityKey.STATE, label: ColumnLabel.STATE, placeholder: "Select state...", type: FieldType.STATE },
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
