import { ComponentType } from "react"
import { EntityKey, FieldType, InputMode } from "@/lib/constants/enums"

export interface FieldConfig {
  key: EntityKey
  label: string
  placeholder: string
  type: FieldType
  className?: string
  transformOnChange?: (value: string) => string
  inputMode?: InputMode
  icon?: ComponentType<{ className?: string }>
}
