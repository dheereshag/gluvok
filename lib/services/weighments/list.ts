/**
 * @file lib/services/weighments/list.ts
 * @description Database service logic for listing of weighments.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
  *,
  center:centers(id, name),
  profile:profiles(id, name, aadhar_number),
  customer:customers(id, name, govt_id),
  rate:rates(id, unit_price, unit,
    commodity:commodities(id, name)
  )
`

const buildQuery = () => supabase.from("weighments").select(SELECT_QUERY)

function enrichWeighments<
  T extends {
    center?: { name: string } | null
    profile?: { name: string; aadhar_number: string } | null
    customer?: { name: string; govt_id: number } | null
    rate?: { id: number; unit_price: number; unit: string; commodity: { id: number; name: string } | null } | null
    unit?: string | null
  }
>(data: T[]): EntityRecord[] {
  return data.map((item) => ({
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
  } as unknown as EntityRecord))
}


export async function fetchWeighments(): Promise<EntityRecord[]> {
  const data = await executeListQuery(buildQuery())
  return enrichWeighments(data)
}

export async function fetchWeighmentById(id: number): Promise<EntityRecord> {
  const item = await executeSingleQuery(buildQuery(), id)
  return enrichWeighments([item])[0]
}
