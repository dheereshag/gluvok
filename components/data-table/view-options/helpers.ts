import { Hash, Home, Globe, Calendar, CalendarClock, Image } from "lucide-react"

export const COLUMN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  id: Hash,
  name: Home,
  state: Globe,
  created_at: Calendar,
  updated_at: CalendarClock,
  images: Image,
}

export function getColumnLabel(id: string) {
  const customLabels: Record<string, string> = {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
  }
  if (customLabels[id]) return customLabels[id]
  return id
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
