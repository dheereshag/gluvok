import { type LucideIcon } from "lucide-react"
import { ProjectSlug } from "../fields"

export enum ProjectName {
  CENTERS = "Centers",
  COMMODITIES = "Commodities",
  RATES = "Rates",
  CUSTOMERS = "Customers",
  WEIGHMENTS = "Weighments",
  FACTORIES = "Factories",
  PROFILES = "Profiles",
  USERS = "Users",
  VILLAGES = "Villages",
  ASSIGNMENTS = "Assignments",
}

export interface ProjectMetadata {
  slug: ProjectSlug
  name: ProjectName
  desc: string
  icon: LucideIcon
  color: string
}
