import { type LucideIcon } from "lucide-react"
import { ProjectSlug } from "../fields"

export enum ProjectName {
  CENTERS = "Centers",
  COMMODITIES = "Commodities",
  COMMODITY_PRICES = "Commodity Prices",
  CUSTOMERS = "Customers",
  WEIGHMENTS = "Weighments",
  FACTORIES = "Factories",
  OPERATORS = "Operators",
  USERS = "Users",
  VILLAGES = "Villages",
}

export interface ProjectMetadata {
  slug: ProjectSlug
  name: ProjectName
  desc: string
  icon: LucideIcon
  color: string
}
