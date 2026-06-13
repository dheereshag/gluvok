"use client"

import * as React from "react"
import { useEntitiesStore } from "@/lib/store"
import { FALLBACK_DATA, ENTITY_EXTRACTORS, type Entity } from "./entity-extractors"

export function useEntityOptions(entitySlug: string) {
  const storeData = useEntitiesStore((state) => state.entities[entitySlug]) as Entity[] | undefined

  return React.useMemo(() => {
    const dataList = storeData !== undefined ? storeData : (FALLBACK_DATA[entitySlug] || [])
    const extractor = ENTITY_EXTRACTORS[entitySlug]
    
    if (!extractor) return []

    return dataList.map((item) => {
      const { id, name } = extractor(item)
      return {
        value: id,
        label: name === id ? name : name ? `${name} (ID: ${id})` : id,
      }
    })
  }, [storeData, entitySlug])
}
