import { useMemo } from "react"
import { type LucideIcon } from "lucide-react"
import { isCommoditySlug, getCommodityIcon } from "@/lib/fields"
import { type ComboboxOption } from "@/components/combobox/base"

export function useCommodityIcon(type: string, selectedItem?: ComboboxOption): LucideIcon | null {
  return useMemo(() => {
    if (isCommoditySlug(type) && selectedItem) {
      return getCommodityIcon(selectedItem.label)
    }
    return null
  }, [type, selectedItem])
}
