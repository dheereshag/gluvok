import * as React from "react"
import { useEntitiesStore, useAuthStore, filterOptionsForUser } from "@/lib/store"
import { FALLBACK_DATA, ENTITY_EXTRACTORS, type Entity } from "./entity-extractors"

export function useEntityOptions(entitySlug: string, contextSlug?: string, fieldKey?: string) {
  const storeData = useEntitiesStore((state) => state.entities[entitySlug]) as Entity[] | undefined
  const user = useAuthStore((state) => state.user)
  const allEntities = useEntitiesStore((state) => state.entities)

  return React.useMemo(() => {
    const dataList = storeData !== undefined ? storeData : (FALLBACK_DATA[entitySlug] || [])
    const filteredList = filterOptionsForUser(entitySlug, dataList, user, allEntities, contextSlug, fieldKey)
    const extractor = ENTITY_EXTRACTORS[entitySlug]
    
    if (!extractor) return []

    return filteredList.map((item) => {
      const { id, name } = extractor(item)
      const displayId = id.length > 8 ? `${id.substring(0, 8)}...` : id
      return {
        value: id,
        label: name === id ? name : name ? `${name} (ID: ${displayId})` : id,
      }
    })
  }, [storeData, entitySlug, user, allEntities, contextSlug, fieldKey])
}
