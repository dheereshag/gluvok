/**
 * @file lib/services/index.ts
 * @description Database service logic for CRUD operations of services.
 */

export * from "./common"
export * from "./scoping"

export { fetchCenters, fetchCenterById, fetchCentersPaginated } from "./centers"
export { fetchCommodities, fetchCommodityById, fetchCommoditiesPaginated } from "./commodities"
export { fetchRates, fetchRateById, fetchRatesPaginated } from "./rates"
export { fetchCustomers, fetchCustomerById, fetchCustomersPaginated } from "./customers"
export { fetchWeighments, fetchWeighmentById, fetchWeighmentsPaginated } from "./weighments"
export { fetchFactories, fetchFactoryById, fetchFactoriesPaginated } from "./factories"
export { fetchProfiles, fetchProfileById, fetchProfilesPaginated } from "./profiles"
