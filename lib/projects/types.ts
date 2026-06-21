import { type LucideIcon } from "lucide-react"
import { ProjectSlug, ProjectName } from "@/lib/constants/enums"

export interface ProjectMetadata {
  slug: ProjectSlug
  name: ProjectName
  desc: string
  icon: LucideIcon
  color: string
}
