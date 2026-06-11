import * as z from "zod"

export enum ProjectSlug {
  CENTERS = "centers",
  COMMODITIES = "commodities",
  CUSTOMERS = "customers",
  DATA_ENTRIES = "data-entries",
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

export interface FieldConfig {
  key: string
  label: string
  placeholder: string
  type: FieldType
}

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  [ProjectSlug.CENTERS]: [
    { key: "name", label: "Center Name", placeholder: "e.g. Center F", type: FieldType.TEXT },
    { key: "factory_id", label: "Factory ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.COMMODITIES]: [
    { key: "name", label: "Commodity Name", placeholder: "e.g. Barley", type: FieldType.TEXT },
    { key: "unit_price", label: "Unit Price (INR)", placeholder: "e.g. 15000", type: FieldType.NUMBER },
  ],
  [ProjectSlug.CUSTOMERS]: [
    { key: "name", label: "Customer Name", placeholder: "e.g. Ajay Kumar", type: FieldType.TEXT },
    { key: "father_name", label: "Father's Name", placeholder: "e.g. Vijay Kumar", type: FieldType.TEXT },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.DATA_ENTRIES]: [
    { key: "vehicle_number", label: "Vehicle Number", placeholder: "e.g. PB10XY1234", type: FieldType.TEXT },
    { key: "weight", label: "Weight (tons)", placeholder: "e.g. 15.5", type: FieldType.NUMBER },
    { key: "commodity_id", label: "Commodity ID", placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: "center_id", label: "Center ID", placeholder: "e.g. 1", type: FieldType.TEXT },
    { key: "operator_id", label: "Operator ID", placeholder: "e.g. 123456789012", type: FieldType.TEXT },
    { key: "customer_id", label: "Customer ID", placeholder: "e.g. GOV1001", type: FieldType.TEXT },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: "name", label: "Factory Name", placeholder: "e.g. Factory C", type: FieldType.TEXT },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: FieldType.TEXT },
  ],
  [ProjectSlug.OPERATORS]: [
    { key: "id", label: "System ID", placeholder: "e.g. operator-id", type: FieldType.TEXT },
    { key: "name", label: "Operator Name", placeholder: "e.g. Amit Sharma", type: FieldType.TEXT },
  ],
  [ProjectSlug.USERS]: [
    { key: "email", label: "Email Address", placeholder: "e.g. user@example.com", type: FieldType.TEXT },
    { key: "role", label: "User Role", placeholder: "e.g. operator", type: FieldType.TEXT },
  ],
  [ProjectSlug.VILLAGES]: [
    { key: "name", label: "Village Name", placeholder: "e.g. Ludhiana", type: FieldType.TEXT },
    { key: "state", label: "State", placeholder: "Select state...", type: FieldType.STATE },
  ],
}

export function getPrimaryIdKey(slug: string | ProjectSlug): string {
  if (slug === ProjectSlug.CUSTOMERS) return "govt_id"
  if (slug === ProjectSlug.OPERATORS) return "aadhar_number"
  return "id"
}

export function getReferencedEntitySlug(key: string): ProjectSlug | null {
  if (key === "factory_id") return ProjectSlug.FACTORIES
  if (key === "village_id") return ProjectSlug.VILLAGES
  if (key === "commodity_id") return ProjectSlug.COMMODITIES
  if (key === "center_id") return ProjectSlug.CENTERS
  if (key === "operator_id") return ProjectSlug.OPERATORS
  if (key === "customer_id") return ProjectSlug.CUSTOMERS
  return null
}

export function getFieldsSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {}
  fields.forEach((f) => {
    if (f.type === FieldType.NUMBER) {
      schemaShape[f.key] = z.coerce.number()
    } else {
      schemaShape[f.key] = z.string().min(1, `${f.label} is required`)
    }
  })
  return z.object(schemaShape)
}
