import { ProjectSlug } from "./fields"
import {
  addCenterSchema, editCenterSchema,
  addCommoditySchema, editCommoditySchema,
  addCustomerSchema, editCustomerSchema,
  addFactorySchema, editFactorySchema,
  addVillageSchema, editVillageSchema,
} from "./validation-part1"
import {
  addOperatorSchema, editOperatorSchema,
  addUserSchema, editUserSchema,
  addDataEntrySchema, editDataEntrySchema,
} from "./validation-part2"

export * from "./validation-part1"
export * from "./validation-part2"

export type EntityAddSchema =
  | typeof addCenterSchema
  | typeof addCommoditySchema
  | typeof addCustomerSchema
  | typeof addDataEntrySchema
  | typeof addFactorySchema
  | typeof addOperatorSchema
  | typeof addUserSchema
  | typeof addVillageSchema

export type EntityEditSchema =
  | typeof editCenterSchema
  | typeof editCommoditySchema
  | typeof editCustomerSchema
  | typeof editDataEntrySchema
  | typeof editFactorySchema
  | typeof editOperatorSchema
  | typeof editUserSchema
  | typeof editVillageSchema

export const ENTITY_ADD_SCHEMAS: Record<ProjectSlug, EntityAddSchema> = {
  [ProjectSlug.CENTERS]: addCenterSchema,
  [ProjectSlug.COMMODITIES]: addCommoditySchema,
  [ProjectSlug.CUSTOMERS]: addCustomerSchema,
  [ProjectSlug.DATA_ENTRIES]: addDataEntrySchema,
  [ProjectSlug.FACTORIES]: addFactorySchema,
  [ProjectSlug.OPERATORS]: addOperatorSchema,
  [ProjectSlug.USERS]: addUserSchema,
  [ProjectSlug.VILLAGES]: addVillageSchema,
}

export const ENTITY_EDIT_SCHEMAS: Record<ProjectSlug, EntityEditSchema> = {
  [ProjectSlug.CENTERS]: editCenterSchema,
  [ProjectSlug.COMMODITIES]: editCommoditySchema,
  [ProjectSlug.CUSTOMERS]: editCustomerSchema,
  [ProjectSlug.DATA_ENTRIES]: editDataEntrySchema,
  [ProjectSlug.FACTORIES]: editFactorySchema,
  [ProjectSlug.OPERATORS]: editOperatorSchema,
  [ProjectSlug.USERS]: editUserSchema,
  [ProjectSlug.VILLAGES]: editVillageSchema,
}
