/**
 * @file lib/services/weighments/query.ts
 * @description Query definition and row mapping for the weighments entity.
 */

import { supabase } from "@/lib/supabase"
import { type Weighment } from "@/types"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.WEIGHMENTS

export const SELECT_QUERY = `
  *,
  center:${ProjectSlug.CENTERS}(${EntityKey.ID}, ${EntityKey.NAME}),
  profile:${ProjectSlug.PROFILES}(${EntityKey.ID}, ${EntityKey.NAME}, ${EntityKey.AADHAR_NUMBER}),
  customer:${ProjectSlug.CUSTOMERS}(${EntityKey.ID}, ${EntityKey.NAME}, ${EntityKey.GOVT_ID}),
  rate:${ProjectSlug.RATES}(${EntityKey.ID}, ${EntityKey.UNIT_PRICE}, ${EntityKey.UNIT},
    commodity:${ProjectSlug.COMMODITIES}(${EntityKey.ID}, ${EntityKey.NAME})
  )
`

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export function enrichWeighment(item: {
  center?: { name: string } | null
  profile?: { name: string; aadhar_number: string } | null
  customer?: { name: string; govt_id: number } | null
  rate?: { id: number; unit_price: number; unit: string; commodity: { id: number; name: string } | null } | null
  unit?: string | null
}): Weighment {
  return {
    ...item,
    center_name: item.center?.name,
    profile_name: item.profile?.name,
    profile_aadhar: item.profile?.aadhar_number,
    customer_name: item.customer?.name,
    customer_govt_id: item.customer?.govt_id,
    commodity_id: item.rate?.commodity?.id,
    commodity_name: item.rate?.commodity?.name,
    unit_price: item.rate?.unit_price,
    unit: item.unit ?? item.rate?.unit,
  } as Weighment
}

export function enrichWeighments(data: {
  center?: { name: string } | null
  profile?: { name: string; aadhar_number: string } | null
  customer?: { name: string; govt_id: number } | null
  rate?: { id: number; unit_price: number; unit: string; commodity: { id: number; name: string } | null } | null
  unit?: string | null
}[]): Weighment[] {
  return data.map(enrichWeighment)
}
