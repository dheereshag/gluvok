import { ColumnDef } from "@tanstack/react-table"
import { createFactoryNameColumn, createFactoryIdColumn, createCustomerGovtIdColumn, createCustomerNameColumn, createCustomerIdColumn } from "./helpers"

export function getAffiliationsColumns<T>(): ColumnDef<T>[] {
  return [
    createFactoryIdColumn(),
    createFactoryNameColumn(),
    createCustomerIdColumn(),
    createCustomerNameColumn(),
    createCustomerGovtIdColumn(),
  ]
}
