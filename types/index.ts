import { Center, Commodity, Rate, Customer, Factory, Profile, User, Village, Weighment } from "./entities"

export * from "./entities"
/** Union of all entity types used across the app */
export type EntityRecord = Center | Commodity | Rate | Customer | Weighment | Factory | Profile | User | Village
