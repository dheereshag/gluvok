"use client"

import * as React from "react"
import { ChevronsUpDown, Shield } from "lucide-react"
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from "@/components/kibo-ui/combobox"
import { Role, RoleLabel } from "@/lib/constants"

const ROLES_DATA = [
  { value: Role.SUPER_ADMIN, label: RoleLabel.SUPER_ADMIN },
  { value: Role.ADMIN, label: RoleLabel.ADMIN },
  { value: Role.MANAGER, label: RoleLabel.MANAGER },
  { value: Role.OPERATOR, label: RoleLabel.OPERATOR },
  { value: Role.BASE, label: RoleLabel.BASE },
]

interface RoleComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function RoleCombobox({ value, onChange, id }: RoleComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const currentRole = ROLES_DATA.find((r) => r.value === value)

  return (
    <Combobox data={ROLES_DATA} type="role" value={value} onValueChange={onChange} open={open} onOpenChange={setOpen} modal={true}>
      <ComboboxTrigger
        id={id || "role-combobox-trigger"}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors min-w-0"
      >
        <span className="flex items-center gap-2 truncate text-left flex-1 min-w-0">
          <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{currentRole ? currentRole.label : "Select role..."}</span>
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent className="max-h-72">
        <ComboboxInput placeholder="Search role..." className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">No role found.</ComboboxEmpty>
          <ComboboxGroup>
            {ROLES_DATA.map((r) => (
              <ComboboxItem
                key={r.value}
                id={`role-option-${r.value}`}
                value={r.label.toLowerCase()}
                onSelect={() => { onChange(r.value); setOpen(false); }}
                className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{r.label}</span>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
