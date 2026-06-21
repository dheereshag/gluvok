import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { EntityKey, ProjectSlug } from "@/lib/constants/enums"
export { getCommodityIcon } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType, type Village as VillageType, type Assignment, type Profile, type Commodity, type Customer } from "@/types"
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
      const userId = record.user_id || record.id
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
      switch (!!record.factory_id) {
        case true:
          return String(record.factory_id)
        default: {
          let profileId: number | null = null
          switch (!!record.profile_id) {
            case true:
              profileId = Number(record.profile_id)
              break
            default:
              switch (!!record.aadhar_number) {
                case true: {
                  const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
                  const aadhar = String(record.aadhar_number).replace(/\s/g, "").toLowerCase()
                  const foundP = activeProfiles.find((p) => p.aadhar_number.replace(/\s/g, "").toLowerCase() === aadhar)
                  switch (!!foundP) {
                    case true:
                      profileId = foundP!.id
                      break
                    default:
                      break
                  }
                  break
                }
                default: {
                  const uId = record.id || record.user_id
                  switch (!!uId && typeof uId === "string") {
                    case true: {
                      const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
                      const cleanUId = String(uId).trim().toLowerCase()
                      const foundP = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === cleanUId)
                      switch (!!foundP) {
                        case true:
                          profileId = foundP!.id
                          break
                        default:
                          break
                      }
                      break
                    }
                    default:
                      break
                  }
                  break
                }
              }
              break
          }

          switch (profileId !== null) {
            case true: {
              const activeAssignments = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] as Assignment[] || []
              const factoryIds = activeAssignments
                .filter((a) => Number(a.profile_id) === Number(profileId))
                .map((a) => a.factory_id)
              switch (factoryIds.length > 0) {
                case true:
                  return factoryIds.join(", ")
                default:
                  return ""
              }
            }
            default:
              return ""
          }
        }
      }
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
      let factoryIds: string[] = []

      switch (!!record.factory_id) {
        case true:
          factoryIds = [String(record.factory_id)]
          break
        default: {
          let profileId: number | null = null
          switch (!!record.profile_id) {
            case true:
              profileId = Number(record.profile_id)
              break
            default:
              switch (!!record.aadhar_number) {
                case true: {
                  const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
                  const aadhar = String(record.aadhar_number).replace(/\s/g, "").toLowerCase()
                  const foundP = activeProfiles.find((p) => p.aadhar_number.replace(/\s/g, "").toLowerCase() === aadhar)
                  switch (!!foundP) {
                    case true:
                      profileId = foundP!.id
                      break
                    default:
                      break
                  }
                  break
                }
                default: {
                  const uId = record.id || record.user_id
                  switch (!!uId && typeof uId === "string") {
                    case true: {
                      const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
                      const cleanUId = String(uId).trim().toLowerCase()
                      const foundP = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === cleanUId)
                      switch (!!foundP) {
                        case true:
                          profileId = foundP!.id
                          break
                        default:
                          break
                      }
                      break
                    }
                    default:
                      break
                  }
                  break
                }
              }
              break
          }

          switch (profileId !== null) {
            case true: {
              const activeAssignments = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] as Assignment[] || []
              factoryIds = activeAssignments
                .filter((a) => Number(a.profile_id) === Number(profileId))
                .map((a) => String(a.factory_id))
              break
            }
            default:
              break
          }
          break
        }
      }

      switch (factoryIds.length === 0) {
        case true:
          return ""
        default: {
          const activeFactories = useEntitiesStore.getState().entities[ProjectSlug.FACTORIES] as FactoryType[] || []
          const names = factoryIds.map((fid) => {
            const factory = activeFactories.find((f) => String(f.id).trim().toLowerCase() === String(fid).trim().toLowerCase())
            return factory ? factory.name : `Factory ${fid}`
          })
          return names.join(", ")
        }
      }
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
      const villageId = record.village_id
      if (!villageId) return ""
      const activeVillages = useEntitiesStore.getState().entities[ProjectSlug.VILLAGES] as VillageType[] || []
      const village = activeVillages.find((v) => String(v.id) === String(villageId))
      return village ? village.name : `Village ${villageId}`
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
  const id = "profile_name"
  const label = ColumnLabel.PROFILE_NAME
  const Icon = User
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const profileId = record.profile_id || record.id
      switch (!!profileId) {
        case true: {
          const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
          const profile = activeProfiles.find((p) => Number(p.id) === Number(profileId))
          return profile ? profile.name : String(profileId)
        }
        default:
          return ""
      }
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
  const id = "profile_aadhar"
  const label = ColumnLabel.AADHAR_NUMBER
  const Icon = Fingerprint
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const profileId = record.profile_id || record.id
      switch (!!profileId) {
        case true: {
          const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
          const profile = activeProfiles.find((p) => Number(p.id) === Number(profileId))
          return profile ? profile.aadhar_number : String(profileId)
        }
        default:
          return ""
      }
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
  const id = "commodity_name"
  const label = ColumnLabel.COMMODITY
  const Icon = Tag
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const commodityId = record.commodity_id
      switch (!!commodityId) {
        case true: {
          const activeCommodities = useEntitiesStore.getState().entities[ProjectSlug.COMMODITIES] as Commodity[] || []
          const comm = activeCommodities.find((c) => Number(c.id) === Number(commodityId))
          return comm ? comm.name : `Commodity ${commodityId}`
        }
        default:
          return ""
      }
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

export function createCustomerNameColumn<T>(): ColumnDef<T> {
  const id = "customer_name"
  const label = ColumnLabel.CUSTOMER_NAME
  const Icon = Users
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const customerId = record.customer_id
      switch (!!customerId) {
        case true: {
          const activeCustomers = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] as Customer[] || []
          const customer = activeCustomers.find((c) => Number(c.id) === Number(customerId))
          return customer ? customer.name : String(customerId)
        }
        default:
          return ""
      }
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

export function createCustomerGovtIdColumn<T>(): ColumnDef<T> {
  const id = "customer_govt_id"
  const label = ColumnLabel.GOVT_ID
  const Icon = ShieldCheck
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const customerId = record.customer_id
      switch (!!customerId) {
        case true: {
          const activeCustomers = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] as Customer[] || []
          const customer = activeCustomers.find((c) => Number(c.id) === Number(customerId))
          return customer ? String(customer.govt_id) : String(customerId)
        }
        default:
          return ""
      }
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
      return record.village_id ? String(record.village_id) : ""
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
  const id = EntityKey.RATE_ID
  const label = ColumnLabel.RATE_ID
  const Icon = Package
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      return record.rate_id ? String(record.rate_id) : ""
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

export function createCenterIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.CENTER_ID
  const label = ColumnLabel.CENTER_ID
  const Icon = Building
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      return record.center_id ? String(record.center_id) : ""
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

export function createProfileIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.PROFILE_ID
  const label = ColumnLabel.PROFILE_ID
  const Icon = User
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      return record.profile_id ? String(record.profile_id) : ""
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

export function createCustomerIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.CUSTOMER_ID
  const label = ColumnLabel.CUSTOMER_ID
  const Icon = Users
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      return record.customer_id ? String(record.customer_id) : ""
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



