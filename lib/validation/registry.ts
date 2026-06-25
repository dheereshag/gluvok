import { ProjectSlug } from "@/lib/constants/enums"
import { addCenterSchema, editCenterSchema } from "./centers"
import { addCommoditySchema, editCommoditySchema } from "./commodities"
import { addRateSchema, editRateSchema } from "./rates"
import { addCustomerSchema, editCustomerSchema } from "./customers"
import { addWeighmentSchema, editWeighmentSchema } from "./weighments"
import { addFactorySchema, editFactorySchema } from "./factories"
import { addProfileSchema, editProfileSchema } from "./profiles"
import { addVillageSchema, editVillageSchema } from "./villages"
import { addAssignmentSchema, editAssignmentSchema } from "./assignments"

export type EntityAddSchema =
  | typeof addCenterSchema
  | typeof addCommoditySchema
  | typeof addRateSchema
  | typeof addCustomerSchema
  | typeof addWeighmentSchema
  | typeof addFactorySchema
  | typeof addProfileSchema
  | typeof addVillageSchema
  | typeof addAssignmentSchema

export type EntityEditSchema =
  | typeof editCenterSchema
  | typeof editCommoditySchema
  | typeof editRateSchema
  | typeof editCustomerSchema
  | typeof editWeighmentSchema
  | typeof editFactorySchema
  | typeof editProfileSchema
  | typeof editVillageSchema
  | typeof editAssignmentSchema

export const ENTITY_ADD_SCHEMAS: Record<ProjectSlug, EntityAddSchema> = {
  [ProjectSlug.CENTERS]: addCenterSchema,
  [ProjectSlug.COMMODITIES]: addCommoditySchema,
  [ProjectSlug.RATES]: addRateSchema,
  [ProjectSlug.CUSTOMERS]: addCustomerSchema,
  [ProjectSlug.WEIGHMENTS]: addWeighmentSchema,
  [ProjectSlug.FACTORIES]: addFactorySchema,
  [ProjectSlug.PROFILES]: addProfileSchema,
  [ProjectSlug.VILLAGES]: addVillageSchema,
  [ProjectSlug.ASSIGNMENTS]: addAssignmentSchema,
}

export const ENTITY_EDIT_SCHEMAS: Record<ProjectSlug, EntityEditSchema> = {
  [ProjectSlug.CENTERS]: editCenterSchema,
  [ProjectSlug.COMMODITIES]: editCommoditySchema,
  [ProjectSlug.RATES]: editRateSchema,
  [ProjectSlug.CUSTOMERS]: editCustomerSchema,
  [ProjectSlug.WEIGHMENTS]: editWeighmentSchema,
  [ProjectSlug.FACTORIES]: editFactorySchema,
  [ProjectSlug.PROFILES]: editProfileSchema,
  [ProjectSlug.VILLAGES]: editVillageSchema,
  [ProjectSlug.ASSIGNMENTS]: editAssignmentSchema,
}
