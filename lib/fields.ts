import * as z from "zod"

export interface FieldConfig {
  key: string
  label: string
  placeholder: string
  type: "text" | "number" | "state"
}

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  centers: [
    { key: "name", label: "Center Name", placeholder: "e.g. Center F", type: "text" },
    { key: "factory_id", label: "Factory ID", placeholder: "e.g. 1", type: "text" },
  ],
  commodities: [
    { key: "name", label: "Commodity Name", placeholder: "e.g. Barley", type: "text" },
    { key: "unit_price", label: "Unit Price (INR)", placeholder: "e.g. 15000", type: "number" },
  ],
  customers: [
    { key: "name", label: "Customer Name", placeholder: "e.g. Ajay Kumar", type: "text" },
    { key: "father_name", label: "Father's Name", placeholder: "e.g. Vijay Kumar", type: "text" },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: "text" },
  ],
  "data-entries": [
    { key: "vehicle_number", label: "Vehicle Number", placeholder: "e.g. PB10XY1234", type: "text" },
    { key: "weight", label: "Weight (tons)", placeholder: "e.g. 15.5", type: "number" },
    { key: "commodity_id", label: "Commodity ID", placeholder: "e.g. 1", type: "text" },
    { key: "center_id", label: "Center ID", placeholder: "e.g. 1", type: "text" },
    { key: "operator_id", label: "Operator ID", placeholder: "e.g. 123456789012", type: "text" },
    { key: "customer_id", label: "Customer ID", placeholder: "e.g. GOV1001", type: "text" },
  ],
  factories: [
    { key: "name", label: "Factory Name", placeholder: "e.g. Factory C", type: "text" },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: "text" },
  ],
  operators: [
    { key: "id", label: "System ID", placeholder: "e.g. operator-id", type: "text" },
    { key: "name", label: "Operator Name", placeholder: "e.g. Amit Sharma", type: "text" },
  ],
  users: [
    { key: "email", label: "Email Address", placeholder: "e.g. user@example.com", type: "text" },
    { key: "role", label: "User Role", placeholder: "e.g. operator", type: "text" },
  ],
  villages: [
    { key: "name", label: "Village Name", placeholder: "e.g. Ludhiana", type: "text" },
    { key: "state", label: "State", placeholder: "Select state...", type: "state" },
  ],
}

export function getPrimaryIdKey(slug: string): string {
  if (slug === "customers") return "govt_id"
  if (slug === "operators") return "aadhar_number"
  return "id"
}

export function getReferencedEntitySlug(key: string): string | null {
  if (key === "factory_id") return "factories"
  if (key === "village_id") return "villages"
  if (key === "commodity_id") return "commodities"
  if (key === "center_id") return "centers"
  if (key === "operator_id") return "operators"
  if (key === "customer_id") return "customers"
  return null
}

export function getFieldsSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {}
  fields.forEach((f) => {
    if (f.type === "number") {
      schemaShape[f.key] = z.coerce.number()
    } else {
      schemaShape[f.key] = z.string().min(1, `${f.label} is required`)
    }
  })
  return z.object(schemaShape)
}
