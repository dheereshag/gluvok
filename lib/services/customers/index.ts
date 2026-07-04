/**
 * @file lib/services/customers/index.ts
 * @description Database service logic for CRUD operations of customers.
 */

export { fetchCustomers, fetchCustomerById } from "./list"
export { fetchCustomersPaginated } from "./paginated"
export { TABLE_NAME } from "./query"

