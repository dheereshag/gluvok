import { type EntityRecord } from "@/types"
import { ProjectSlug, EntityKey } from "./fields"

/** Safe dynamic field access on entity records */
export function getField(entity: EntityRecord, key: string): string | number | string[] | undefined {
  return (entity as EntityRecord & Record<string, string | number | string[] | undefined>)[key]
}

/** Get the dynamic display name for any entity record */
export function getEntityDisplayName(
  item: EntityRecord | null | undefined,
  projectSlug: string,
  primaryIdKey: string
): string {
  if (!item) return ""
  let key: EntityKey
  switch (projectSlug) {
    case ProjectSlug.USERS:
      key = EntityKey.EMAIL
      break
    case ProjectSlug.DATA_ENTRIES:
      key = EntityKey.VEHICLE_NUMBER
      break
    default:
      key = EntityKey.NAME
  }
  return String(getField(item, key) || getField(item, primaryIdKey) || "")
}
