import * as React from "react"
import { useEntitiesStore, useAuthStore, filterOptionsForUser } from "@/lib/store"
import { ENTITY_EXTRACTORS, type Entity } from "./entity-extractors"
import { type EntityRecord } from "@/types"
import { fetchEntityList } from "@/lib/services"
import { supabase } from "@/lib/supabase"

export function useEntityOptions(entitySlug: string, contextSlug?: string, fieldKey?: string) {
  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = React.useState(true)
  const user = useAuthStore((state) => state.user)
  const allEntities = useEntitiesStore((state) => state.entities)

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        let rawList: Entity[] = []
        if (entitySlug === "users") {
          const { data, error } = await supabase.rpc("get_users")
          if (error) throw new Error(error.message)
          rawList = data || []
        } else {
          rawList = await fetchEntityList(entitySlug)
        }

        if (!active) return

        const filteredList = entitySlug === "users" 
          ? rawList 
          : filterOptionsForUser(entitySlug, rawList as EntityRecord[], user, allEntities)
        const extractor = ENTITY_EXTRACTORS[entitySlug]
        if (!extractor) {
          setOptions([])
          return
        }

        const opts = filteredList.map((item) => {
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
  }, [entitySlug, user, allEntities, contextSlug, fieldKey])

  return { options, loading }
}
