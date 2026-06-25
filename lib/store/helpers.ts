import { type EntityRecord } from "@/types"

/** Safe dynamic field access on entity records */
export function getField(entity: EntityRecord, key: string): string | number | string[] | undefined {
  return (entity as EntityRecord & Record<string, string | number | string[] | undefined>)[key]
}

