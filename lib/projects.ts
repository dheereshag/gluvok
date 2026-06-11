import {
  Building,
  Package,
  Users,
  ClipboardList,
  Factory,
  UserCog,
  User,
  Home,
  type LucideIcon,
} from "lucide-react"
import { ProjectSlug } from "./fields"

export enum ProjectName {
  CENTERS = "Centers",
  COMMODITIES = "Commodities",
  CUSTOMERS = "Customers",
  DATA_ENTRIES = "Data Entries",
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

export const PROJECTS: ProjectMetadata[] = [
  {
    slug: ProjectSlug.CENTERS,
    name: ProjectName.CENTERS,
    desc: "Manage processing and collection centers",
    icon: Building,
    color: "text-blue-500",
  },
  {
    slug: ProjectSlug.COMMODITIES,
    name: ProjectName.COMMODITIES,
    desc: "Track trading products and goods catalog",
    icon: Package,
    color: "text-amber-500",
  },
  {
    slug: ProjectSlug.CUSTOMERS,
    name: ProjectName.CUSTOMERS,
    desc: "Directory of client accounts and details",
    icon: Users,
    color: "text-green-500",
  },
  {
    slug: ProjectSlug.DATA_ENTRIES,
    name: ProjectName.DATA_ENTRIES,
    desc: "Input logs, sheets and record metrics",
    icon: ClipboardList,
    color: "text-purple-500",
  },
  {
    slug: ProjectSlug.FACTORIES,
    name: ProjectName.FACTORIES,
    desc: "Configure manufacturing plants and lines",
    icon: Factory,
    color: "text-indigo-500",
  },
  {
    slug: ProjectSlug.OPERATORS,
    name: ProjectName.OPERATORS,
    desc: "Manage workers and field operatives",
    icon: UserCog,
    color: "text-pink-500",
  },
  {
    slug: ProjectSlug.USERS,
    name: ProjectName.USERS,
    desc: "Configure access control and team profiles",
    icon: User,
    color: "text-teal-500",
  },
  {
    slug: ProjectSlug.VILLAGES,
    name: ProjectName.VILLAGES,
    desc: "Database of geographical areas and metadata",
    icon: Home,
    color: "text-rose-500",
  },
]
