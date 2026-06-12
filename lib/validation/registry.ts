import { ProjectSlug } from "../fields"
import { addCenterSchema, editCenterSchema } from "./centers"
import { addCommoditySchema, editCommoditySchema } from "./commodities"
import { addCustomerSchema, editCustomerSchema } from "./customers"
import { addWeighmentSchema, editWeighmentSchema } from "./weighments"
import { addFactorySchema, editFactorySchema } from "./factories"
import { addOperatorSchema, editOperatorSchema } from "./operators"
import { addUserSchema, editUserSchema } from "./users"
import { addVillageSchema, editVillageSchema } from "./villages"

export type EntityAddSchema =
  | typeof addCenterSchema
  | typeof addCommoditySchema
  | typeof addCustomerSchema
  | typeof addWeighmentSchema
  | typeof addFactorySchema
  | typeof addOperatorSchema
  | typeof addUserSchema
  | typeof addVillageSchema

export type EntityEditSchema =
  | typeof editCenterSchema
  | typeof editCommoditySchema
  | typeof editCustomerSchema
  | typeof editWeighmentSchema
  | typeof editFactorySchema
  | typeof editOperatorSchema
  | typeof editUserSchema
  | typeof editVillageSchema

export const ENTITY_ADD_SCHEMAS: Record<ProjectSlug, EntityAddSchema> = {
  [ProjectSlug.CENTERS]: addCenterSchema,
  [ProjectSlug.COMMODITIES]: addCommoditySchema,
  [ProjectSlug.CUSTOMERS]: addCustomerSchema,
  [ProjectSlug.WEIGHMENTS]: addWeighmentSchema,
  [ProjectSlug.FACTORIES]: addFactorySchema,
  [ProjectSlug.OPERATORS]: addOperatorSchema,
  [ProjectSlug.USERS]: addUserSchema,
  [ProjectSlug.VILLAGES]: addVillageSchema,
}

export const ENTITY_EDIT_SCHEMAS: Record<ProjectSlug, EntityEditSchema> = {
  [ProjectSlug.CENTERS]: editCenterSchema,
  [ProjectSlug.COMMODITIES]: editCommoditySchema,
  [ProjectSlug.CUSTOMERS]: editCustomerSchema,
  [ProjectSlug.WEIGHMENTS]: editWeighmentSchema,
  [ProjectSlug.FACTORIES]: editFactorySchema,
  [ProjectSlug.OPERATORS]: editOperatorSchema,
  [ProjectSlug.USERS]: editUserSchema,
  [ProjectSlug.VILLAGES]: editVillageSchema,
}
