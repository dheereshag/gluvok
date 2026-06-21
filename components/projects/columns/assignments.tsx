import { ColumnDef } from "@tanstack/react-table"
import { createFactoryNameColumn, createProfileNameColumn, createProfileAadharColumn, createFactoryIdColumn, createProfileIdColumn } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createFactoryIdColumn(),
    createFactoryNameColumn(),
    createProfileIdColumn(),
    createProfileNameColumn(),
    createProfileAadharColumn(),
  ]
}
