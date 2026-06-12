import { ColumnDef } from "@tanstack/react-table"
import { type EntityRecord } from "@/types"
import { ProjectSlug } from "@/lib/fields"

import { getSelectColumn } from "./select"
import { getSystemColumns } from "./system"
import { getActionsColumn } from "./actions"

import { getCentersColumns } from "./centers"
import { getCommoditiesColumns } from "./commodities"
import { getCustomersColumns } from "./customers"
import { getWeighmentsColumns } from "./weighments"
import { getFactoriesColumns } from "./factories"
import { getOperatorsColumns } from "./operators"
import { getUsersColumns } from "./users"
import { getVillagesColumns } from "./villages"

export interface ColumnActionsCallbacks<T = EntityRecord> {
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

function getSpecificColumns<T>(projectSlug: string): ColumnDef<T>[] {
  switch (projectSlug) {
    case ProjectSlug.CENTERS: return getCentersColumns<T>()
    case ProjectSlug.COMMODITIES: return getCommoditiesColumns<T>()
    case ProjectSlug.CUSTOMERS: return getCustomersColumns<T>()
    case ProjectSlug.WEIGHMENTS: return getWeighmentsColumns<T>()
    case ProjectSlug.FACTORIES: return getFactoriesColumns<T>()
    case ProjectSlug.OPERATORS: return getOperatorsColumns<T>()
    case ProjectSlug.USERS: return getUsersColumns<T>()
    case ProjectSlug.VILLAGES: return getVillagesColumns<T>()
    default: return []
  }
}

export function getProjectColumns<T extends EntityRecord = EntityRecord>(
  projectSlug: string,
  primaryIdKey: string,
  projectName: string,
  callbacks: ColumnActionsCallbacks<T>
): ColumnDef<T>[] {
  const systemCols = getSystemColumns<T>(primaryIdKey)

  return [
    getSelectColumn<T>(),
    systemCols[0], // ID column
    ...getSpecificColumns<T>(projectSlug),
    systemCols[1], // Created At
    systemCols[2], // Updated At
    getActionsColumn<T>(projectSlug, primaryIdKey, projectName, callbacks),
  ]
}
