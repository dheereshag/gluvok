import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { EntityKey, ProjectSlug } from "@/lib/constants/enums"
export { getCommodityIcon } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType, type Village as VillageType, type Assignment, type Profile, type Customer } from "@/types"
import { User, Factory, Home, Tag, Users, ShieldCheck, Fingerprint, Package, Building } from "lucide-react"

export function createBaseColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, cell: ColumnDef<T>["cell"], id?: string
): ColumnDef<T> {
  return {
    id,
    accessorKey: key,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell,
    meta: { icon: Icon, label },
  }
}

export function createCustomColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, renderCell: (value: string) => React.ReactNode, id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = (row.original as Record<string, unknown>)[key]
    return renderCell(String(val ?? ""))
  }, id)
}

export function createTextColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, className = "font-semibold text-foreground text-xs", id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = (row.original as Record<string, unknown>)[key]
    return <div className={className}>{String(val ?? "")}</div>
  }, id)
}

export function createUserEmailColumn<T>(
  label: ColumnLabel | string,
  Icon: React.ComponentType<{ className?: string }> = User,
  id: string = EntityKey.EMAIL
): ColumnDef<T> {
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const userId = record[EntityKey.USER_ID] || record[EntityKey.ID]
      if (!userId || typeof userId !== "string") return ""
      const activeUsers = useEntitiesStore.getState().entities[ProjectSlug.USERS] as UserType[] || []
      const user = activeUsers.find((u) => String(u.id) === String(userId))
      return user ? user.email : userId
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const email = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{email || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createFactoryIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.FACTORY_ID
  const label = ColumnLabel.FACTORY_ID
  const Icon = Factory
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const factoryIds = resolveFactoryIds(record)
      return factoryIds.length > 0 ? factoryIds.join(", ") : ""
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const val = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{val || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createFactoryNameColumn<T>(): ColumnDef<T> {
  const id = EntityKey.FACTORY_NAME
  const label = ColumnLabel.FACTORY_NAME
  const Icon = Factory
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const factoryIds = resolveFactoryIds(record)
      if (factoryIds.length === 0) return ""
      const activeFactories = useEntitiesStore.getState().entities[ProjectSlug.FACTORIES] as FactoryType[] || []
      const names = factoryIds.map((fid) => {
        const factory = activeFactories.find((f) => String(f.id) === String(fid))
        return factory ? factory.name : `${ColumnLabel.FACTORY} ${fid}`
      })
      return names.join(", ")
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const factoryName = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{factoryName || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createVillageNameColumn<T>(): ColumnDef<T> {
  const id = EntityKey.VILLAGE_NAME
  const label = ColumnLabel.VILLAGE_NAME
  const Icon = Home
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const villageId = resolveVillageId(record)
      if (!villageId) return ""
      const activeVillages = useEntitiesStore.getState().entities[ProjectSlug.VILLAGES] as VillageType[] || []
      const village = activeVillages.find((v) => String(v.id) === String(villageId))
      return village ? village.name : `${ColumnLabel.VILLAGE} ${villageId}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const villageName = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{villageName || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createProfileNameColumn<T>(): ColumnDef<T> {
  const id = EntityKey.PROFILE_NAME
  const label = ColumnLabel.PROFILE_NAME
  const Icon = User
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const profileId = getProfileId(record)
      if (!profileId) return ""
      const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
      const profile = activeProfiles.find((p) => Number(p.id) === profileId)
      return profile ? profile.name : String(profileId)
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{name || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createProfileAadharColumn<T>(): ColumnDef<T> {
  const id = EntityKey.PROFILE_AADHAR
  const label = ColumnLabel.AADHAR_NUMBER
  const Icon = Fingerprint
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const profileId = getProfileId(record)
      if (!profileId) return ""
      const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
      const profile = activeProfiles.find((p) => Number(p.id) === profileId)
      return profile ? profile.aadhar_number : String(profileId)
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const aadhar = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{aadhar || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createCommodityNameColumn<T>(): ColumnDef<T> {
  return createLookupNameColumn(
    EntityKey.COMMODITY_NAME,
    ColumnLabel.COMMODITY,
    Tag,
    EntityKey.COMMODITY_ID,
    ProjectSlug.COMMODITIES,
    ColumnLabel.COMMODITY
  )
}

export function createCustomerNameColumn<T>(): ColumnDef<T> {
  return createLookupNameColumn(
    EntityKey.CUSTOMER_NAME,
    ColumnLabel.CUSTOMER_NAME,
    Users,
    EntityKey.CUSTOMER_ID,
    ProjectSlug.CUSTOMERS,
    ColumnLabel.CUSTOMER
  )
}

export function createCustomerGovtIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.CUSTOMER_GOVT_ID
  const label = ColumnLabel.GOVT_ID
  const Icon = ShieldCheck
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const customerId = record[EntityKey.CUSTOMER_ID]
      if (!customerId) return ""
      const activeCustomers = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] as Customer[] || []
      const customer = activeCustomers.find((c) => Number(c.id) === Number(customerId))
      return customer ? String(customer.govt_id) : String(customerId)
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const govtId = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{govtId || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createVillageIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.VILLAGE_ID
  const label = ColumnLabel.VILLAGE_ID
  const Icon = Home
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const villageId = resolveVillageId(record)
      return villageId ? String(villageId) : ""
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const val = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{val || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createRateIdColumn<T>(): ColumnDef<T> {
  return createIdColumn(EntityKey.RATE_ID, ColumnLabel.RATE_ID, Package)
}

export function createCenterIdColumn<T>(): ColumnDef<T> {
  return createIdColumn(EntityKey.CENTER_ID, ColumnLabel.CENTER_ID, Building)
}

export function createProfileIdColumn<T>(): ColumnDef<T> {
  return createIdColumn(EntityKey.PROFILE_ID, ColumnLabel.PROFILE_ID, User)
}

export function createCustomerIdColumn<T>(): ColumnDef<T> {
  return createIdColumn(EntityKey.CUSTOMER_ID, ColumnLabel.CUSTOMER_ID, Users)
}

export function createCenterNameColumn<T>(): ColumnDef<T> {
  return createLookupNameColumn(
    EntityKey.CENTER_NAME,
    ColumnLabel.CENTER_NAME,
    Building,
    EntityKey.CENTER_ID,
    ProjectSlug.CENTERS,
    ColumnLabel.CENTER
  )
}

// --- Internal Helpers for resolving nested relations ---

function resolveFactoryIds(record: Record<string, unknown>): number[] {
  const factId = record[EntityKey.FACTORY_ID]
  if (factId) {
    return [Number(factId)]
  }

  let profileId: number | null = null
  const profId = record[EntityKey.PROFILE_ID]
  if (profId) {
    profileId = Number(profId)
  } else {
    const uId = record[EntityKey.ID] || record[EntityKey.USER_ID]
    if (uId && typeof uId === "string") {
      const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
      const cleanUId = String(uId).trim().toLowerCase()
      const foundP = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === cleanUId)
      if (foundP) {
        profileId = foundP.id
      }
    }
  }

  if (profileId !== null) {
    const activeAssignments = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] as Assignment[] || []
    return activeAssignments
      .filter((a) => Number(a.profile_id) === Number(profileId))
      .map((a) => a.factory_id)
  }

  return []
}

function resolveVillageId(record: Record<string, unknown>): number | null {
  const villageId = record[EntityKey.VILLAGE_ID]
  if (villageId) return Number(villageId)

  const factId = record[EntityKey.FACTORY_ID]
  if (factId) {
    const activeFactories = useEntitiesStore.getState().entities[ProjectSlug.FACTORIES] as FactoryType[] || []
    const factory = activeFactories.find((f) => String(f.id) === String(factId))
    if (factory) {
      return factory.village_id
    }
  }
  return null
}

function getProfileId(record: Record<string, unknown>): number | null {
  const profileId = record[EntityKey.PROFILE_ID] || record[EntityKey.ID]
  return profileId ? Number(profileId) : null
}

export function createIdColumn<T>(
  key: EntityKey,
  label: ColumnLabel | string,
  Icon: React.ComponentType<{ className?: string }>,
  id: EntityKey = key
): ColumnDef<T> {
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const val = record[key]
      return val ? String(val) : ""
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const val = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{val || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createLookupNameColumn<T>(
  id: EntityKey,
  label: ColumnLabel | string,
  Icon: React.ComponentType<{ className?: string }>,
  fkKey: EntityKey,
  slug: ProjectSlug,
  fallbackPrefix: ColumnLabel
): ColumnDef<T> {
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const fkValue = record[fkKey]
      if (!fkValue) return ""
      const activeEntities = useEntitiesStore.getState().entities[slug] as { id: number | string; name: string }[] || []
      const found = activeEntities.find((e) => String(e.id) === String(fkValue))
      return found ? found.name : `${fallbackPrefix} ${fkValue}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{name || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}



