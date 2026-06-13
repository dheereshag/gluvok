import { Center, Commodity, CommodityPrice, Customer, Factory, Operator, User, Village, Weighment } from "./entities"

export * from "./entities"
/** Union of all entity types used across the app */
export type EntityRecord = Center | Commodity | CommodityPrice | Customer | Weighment | Factory | Operator | User | Village
