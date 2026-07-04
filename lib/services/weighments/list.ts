/**
 * @file lib/services/weighments/list.ts
 * @description Database service logic for listing of weighments.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

function enrichWeighments(data: any[]): EntityRecord[] {
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
  }))
}


export async function fetchWeighments(): Promise<EntityRecord[]> {
  const query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `)

  const data = await executeListQuery(query)
  return enrichWeighments(data)
}

export async function fetchWeighmentById(id: number): Promise<EntityRecord> {
  const query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `)

  const item = await executeSingleQuery(query, id)
  return enrichWeighments([item])[0]
}

