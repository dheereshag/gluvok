/**
 * @file components/combobox/use-entity-options.ts
 * @description Hook to fetch list records for a given entity slug and format them into combobox options.
 */

import * as React from "react"
import { ENTITY_EXTRACTORS, type Entity } from "@/lib/utils/entity-extractors"


import { fetchEntityList } from "@/lib/services"
import { supabase } from "@/lib/supabase"
import { SystemSlug } from "@/lib/constants/enums"

/**
 * useEntityOptions Hook
 * Performs API or RPC request depending on the entity type, pulls rows,
 * extracts display attributes using custom mappings, and manages loading state.
 */
export function useEntityOptions(entitySlug: string, contextSlug?: string, fieldKey?: string) {
  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        let rawList: Entity[] = []
        if (entitySlug === SystemSlug.USERS) {
          const { data, error } = await supabase.rpc("get_users")
          if (error) throw new Error(error.message)
          rawList = data || []
        } else {
          rawList = await fetchEntityList(entitySlug)
        }

        if (!active) return

        const extractor = ENTITY_EXTRACTORS[entitySlug]
        if (!extractor) {
          setOptions([])
          return
        }

        const opts = rawList.map((item) => {
          const { id, name } = extractor(item)
          const displayId = id.length > 8 ? `${id.substring(0, 8)}...` : id
          return {
            value: id,
            label: name === id ? name : name ? `${name} (ID: ${displayId})` : id,
          }
        })
        setOptions(opts)
      } catch (err) {
        console.error("Failed to load options for", entitySlug, err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [entitySlug, contextSlug, fieldKey])

  return { options, loading }
}

