import { ProjectSlug, EntityKey, FieldType, InputMode, type FieldConfig } from "./types"
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
    { key: EntityKey.GOVT_ID, label: ColumnLabel.GOVT_ID, placeholder: "e.g. 1001", type: FieldType.NUMBER },
    { key: EntityKey.ID, label: ColumnLabel.ID, placeholder: "Select user...", type: FieldType.TEXT },
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
    { key: EntityKey.IMAGES, label: ColumnLabel.IMAGES, placeholder: "Upload weighment photos...", type: FieldType.IMAGES },
    { key: EntityKey.WEIGHT, label: ColumnLabel.WEIGHT, placeholder: "e.g. 15.5", type: FieldType.NUMBER },
    { key: EntityKey.COMMODITY_PRICE_ID, label: ColumnLabel.COMMODITY_PRICE_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: EntityKey.CENTER_ID, label: ColumnLabel.CENTER_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
    {
      key: EntityKey.OPERATOR_ID,
      label: ColumnLabel.OPERATOR_ID,
      placeholder: "e.g. 1234 5678 9012",
      type: FieldType.TEXT,
      inputMode: InputMode.NUMERIC,
      transformOnChange: (v) => {
        const digits = v.replace(/\D/g, "").slice(0, 12)
        const match = digits.match(/(\d{1,4})/g)
        return match ? match.join(" ") : digits
      },
    },
    { key: EntityKey.CUSTOMER_ID, label: ColumnLabel.CUSTOMER_ID, placeholder: "e.g. GOV1001", type: FieldType.TEXT },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Factory C", type: FieldType.TEXT },
    { key: EntityKey.VILLAGE_ID, label: ColumnLabel.VILLAGE_ID, placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.OPERATORS]: [
    {
      key: EntityKey.AADHAR_NUMBER,
      label: ColumnLabel.AADHAR_NUMBER,
      placeholder: "e.g. 1234 5678 9012",
      type: FieldType.TEXT,
      inputMode: InputMode.NUMERIC,
      transformOnChange: (v) => {
        const digits = v.replace(/\D/g, "").slice(0, 12)
        const match = digits.match(/(\d{1,4})/g)
        return match ? match.join(" ") : digits
      },
    },
    { key: EntityKey.ID, label: ColumnLabel.ID, placeholder: "Select user...", type: FieldType.TEXT },
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


