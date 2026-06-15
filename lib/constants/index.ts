export { State } from "./states"

export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  OPERATOR = "operator",
  BASE = "base",
}

export enum RoleLabel {
  SUPER_ADMIN = "SUPER ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  OPERATOR = "OPERATOR",
  BASE = "BASE",
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
  COMMODITY_NAME = "Commodity Name",
  RATE_ID = "Rate ID",
  CENTER_ID = "Center ID",
  PROFILE_ID = "Profile ID",
  CUSTOMER_ID = "Customer ID",
  EMAIL = "Email",
  ROLE = "Role",
  CREATED_AT = "Created At",
  UPDATED_AT = "Updated At",
  IMAGES = "Images",
  USER_ID = "User ID",
  COMMODITY = "Commodity",
  FACTORY = "Factory",
  IS_ACTIVE = "Status",
}

export enum DialogMode {
  CREATE = "create",
  EDIT = "edit",
}

export enum ActiveStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum AppRoutes {
  HOME = "/",
  LOGIN = "/login",
  SIGNUP = "/signup",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
}

export const AUTH_ROUTES = [
  AppRoutes.LOGIN,
  AppRoutes.SIGNUP,
  AppRoutes.FORGOT_PASSWORD,
  AppRoutes.RESET_PASSWORD,
]
