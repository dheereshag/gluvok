/**
 * @file lib/fields/config.ts
 * @description Helper definitions or configuration for entity table fields (config).
 */

import { ProjectSlug, EntityKey, FieldType, InputMode, Role, SingularEntityName } from "@/lib/constants/enums"
import { type FieldConfig } from "./types"
import { ColumnLabel } from "@/lib/constants/enums"
import { getSelectPlaceholder } from "./helpers"
import {
  Building,
  Factory,
  Package,
  Tag,
  IndianRupee,
  User,
  Car,
  Image,
  Weight,
  Ruler,
  Users,
  Power,
  ShieldCheck,
  Fingerprint,
  Hash,
  ArrowLeftRight,
} from "lucide-react"

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  [ProjectSlug.CENTERS]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Center F", type: FieldType.TEXT, icon: Tag },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder(SingularEntityName.FACTORY), type: FieldType.TEXT, icon: Factory, visibleRoles: [Role.SUPER_ADMIN], editableRoles: [Role.SUPER_ADMIN] },
  ],
  [ProjectSlug.COMMODITIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Barley", type: FieldType.TEXT, icon: Tag },
  ],
  [ProjectSlug.RATES]: [
    { key: EntityKey.COMMODITY_ID, label: ColumnLabel.COMMODITY, placeholder: getSelectPlaceholder(SingularEntityName.COMMODITY), type: FieldType.TEXT, icon: Tag },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder(SingularEntityName.FACTORY), type: FieldType.TEXT, icon: Factory, visibleRoles: [Role.SUPER_ADMIN], editableRoles: [Role.SUPER_ADMIN] },
    { key: EntityKey.UNIT_PRICE, label: ColumnLabel.UNIT_PRICE, placeholder: "e.g. 15000", type: FieldType.NUMBER, icon: IndianRupee },
    { key: EntityKey.UNIT, label: ColumnLabel.UNIT, placeholder: "Select unit...", type: FieldType.UNIT, icon: Ruler },
  ],
  [ProjectSlug.CUSTOMERS]: [
    { key: EntityKey.GOVT_ID, label: ColumnLabel.GOVT_ID, placeholder: "e.g. 1001", type: FieldType.NUMBER, icon: ShieldCheck },
    { key: EntityKey.USER_ID, label: ColumnLabel.USER, placeholder: getSelectPlaceholder(SingularEntityName.USER), type: FieldType.TEXT, icon: Hash },
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Ajay Kumar", type: FieldType.TEXT, icon: Tag },
    { key: EntityKey.FATHER_NAME, label: ColumnLabel.FATHER_NAME, placeholder: "e.g. Vijay Kumar", type: FieldType.TEXT, icon: User },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder(SingularEntityName.FACTORY), type: FieldType.TEXT, icon: Factory, visibleRoles: [Role.SUPER_ADMIN], editableRoles: [Role.SUPER_ADMIN] },
  ],
  [ProjectSlug.WEIGHMENTS]: [
    {
      key: EntityKey.VEHICLE_NUMBER,
      label: ColumnLabel.VEHICLE_NUMBER,
      placeholder: "e.g. PB10XY1234",
      type: FieldType.TEXT,
      className: "uppercase",
      transformOnChange: (v) => v.toUpperCase(),
      icon: Car,
    },
    { key: EntityKey.IMAGES, label: ColumnLabel.IMAGES, placeholder: "Upload weighment photos...", type: FieldType.IMAGES, icon: Image },
    { key: EntityKey.WEIGHT, label: ColumnLabel.WEIGHT, placeholder: "e.g. 15.5", type: FieldType.NUMBER, icon: Weight, editVisibleRoles: [Role.SUPER_ADMIN, Role.ADMIN] },
    { key: EntityKey.UNIT, label: ColumnLabel.UNIT, placeholder: "Select unit...", type: FieldType.UNIT, icon: Ruler },
    { key: EntityKey.TYPE, label: ColumnLabel.TYPE, placeholder: "Select type...", type: FieldType.TYPE, icon: ArrowLeftRight },
    { key: EntityKey.RATE_ID, label: ColumnLabel.RATE, placeholder: getSelectPlaceholder(SingularEntityName.RATE), type: FieldType.TEXT, icon: Package },
    { key: EntityKey.CENTER_ID, label: ColumnLabel.CENTER, placeholder: getSelectPlaceholder(SingularEntityName.CENTER), type: FieldType.TEXT, icon: Building },
    {
      key: EntityKey.PROFILE_ID,
      label: ColumnLabel.PROFILE_NAME,
      placeholder: getSelectPlaceholder(SingularEntityName.PROFILE),
      type: FieldType.TEXT,
      inputMode: InputMode.NUMERIC,
      transformOnChange: (v) => {
        const digits = v.replace(/\D/g, "").slice(0, 12)
        const match = digits.match(/(\d{1,4})/g)
        return match ? match.join(" ") : digits
      },
      icon: User,
      visibleRoles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    { key: EntityKey.CUSTOMER_ID, label: ColumnLabel.CUSTOMER_NAME, placeholder: getSelectPlaceholder(SingularEntityName.CUSTOMER), type: FieldType.TEXT, icon: Users },
    { key: EntityKey.IS_ACTIVE, label: ColumnLabel.IS_ACTIVE, placeholder: "", type: FieldType.CHECKBOX, icon: Power },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Factory C", type: FieldType.TEXT, icon: Tag },
  ],
  [ProjectSlug.PROFILES]: [
    {
      key: EntityKey.AADHAR_NUMBER,
      label: ColumnLabel.AADHAR_NUMBER,
      placeholder: "e.g. 1234 5678 9012",
      type: FieldType.TEXT,
      inputMode: InputMode.NUMERIC,
      transformOnChange: (v) => {
        const digits = v.replace(/\D/g, "").slice(0, 12)
        const match = digits.match(/(\d{1,4})/g)
        return match ? match.join(" ") : digits
      },
      icon: Fingerprint,
    },
    { key: EntityKey.USER_ID, label: ColumnLabel.USER, placeholder: getSelectPlaceholder(SingularEntityName.USER), type: FieldType.TEXT, icon: Hash },
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Amit Sharma", type: FieldType.TEXT, icon: Tag },
    { key: EntityKey.ROLE, label: ColumnLabel.ROLE, placeholder: "Select role...", type: FieldType.ROLE, icon: ShieldCheck },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder(SingularEntityName.FACTORY), type: FieldType.TEXT, icon: Factory, visibleRoles: [Role.SUPER_ADMIN], editableRoles: [Role.SUPER_ADMIN] },
  ],

}
