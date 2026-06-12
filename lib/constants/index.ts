export { State } from "./state-constants"

export enum CommodityName {
  WHEAT = "Wheat",
  SCRAP_COPPER = "Scrap Copper",
  CORN = "Corn",
  CRUDE_OIL = "Crude Oil",
}

export enum Role {
  ADMIN = "Admin",
  OPERATOR = "Operator",
  MANAGER = "Manager",
  AUTHENTICATED = "authenticated",
}

export enum ColumnLabel {
  ID = "ID",
  GOVT_ID = "Govt ID",
  AADHAR_NUMBER = "Aadhar Number",
  NAME = "Name",
  STATE = "State",
  FACTORY_ID = "Factory ID",
  UNIT_PRICE = "Unit Price",
  FATHER_NAME = "Father's Name",
  VILLAGE_ID = "Village ID",
  VEHICLE_NUMBER = "Vehicle Number",
  WEIGHT = "Weight",
  COMMODITY_ID = "Commodity ID",
  CENTER_ID = "Center ID",
  OPERATOR_ID = "Operator ID",
  CUSTOMER_ID = "Customer ID",
  EMAIL = "Email",
  ROLE = "Role",
  CREATED_AT = "Created At",
  UPDATED_AT = "Updated At",
}

export enum DialogMode {
  CREATE = "create",
  EDIT = "edit",
}
