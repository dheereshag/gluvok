/**
 * @file lib/services/customers/list.ts
 * @description Database service logic for listing of customers.
 */

import { type Customer } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichCustomer, enrichCustomers } from "./query"

export async function fetchCustomers(): Promise<Customer[]> {
  const data = await executeListQuery(buildListQuery())
  return enrichCustomers(data)
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichCustomer(item)
}
