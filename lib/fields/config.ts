import { ProjectSlug, EntityKey, FieldType, InputMode, type FieldConfig } from "./types"
import { ColumnLabel } from "@/lib/constants"
import { getSelectPlaceholder } from "./helpers"
import {
  Building,
  Factory,
  Package,
  Tag,
  IndianRupee,
  User,
  Home,
  Car,
  Image,
  Weight,
  Users,
  Power,
  Mail,
  ShieldCheck,
  Fingerprint,
  Globe,
  Hash,
} from "lucide-react"

export const PROJECT_FIELDS: Record<string, FieldConfig[]> = {
  [ProjectSlug.CENTERS]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Center F", type: FieldType.TEXT, icon: Building },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder("Factory"), type: FieldType.TEXT, icon: Factory },
  ],
  [ProjectSlug.COMMODITIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Barley", type: FieldType.TEXT, icon: Tag },
  ],
  [ProjectSlug.RATES]: [
    { key: EntityKey.COMMODITY_ID, label: ColumnLabel.COMMODITY, placeholder: getSelectPlaceholder("Commodity"), type: FieldType.TEXT, icon: Tag },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder("Factory"), type: FieldType.TEXT, icon: Factory },
    { key: EntityKey.UNIT_PRICE, label: ColumnLabel.UNIT_PRICE, placeholder: "e.g. 15000", type: FieldType.NUMBER, icon: IndianRupee },
  ],
  [ProjectSlug.CUSTOMERS]: [
    { key: EntityKey.GOVT_ID, label: ColumnLabel.GOVT_ID, placeholder: "e.g. 1001", type: FieldType.NUMBER, icon: ShieldCheck },
    { key: EntityKey.ID, label: ColumnLabel.USER, placeholder: getSelectPlaceholder("User"), type: FieldType.TEXT, icon: Hash },
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Ajay Kumar", type: FieldType.TEXT, icon: User },
    { key: EntityKey.FATHER_NAME, label: ColumnLabel.FATHER_NAME, placeholder: "e.g. Vijay Kumar", type: FieldType.TEXT, icon: User },
    { key: EntityKey.VILLAGE_ID, label: ColumnLabel.VILLAGE, placeholder: getSelectPlaceholder("Village"), type: FieldType.TEXT, icon: Home },
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
    { key: EntityKey.WEIGHT, label: ColumnLabel.WEIGHT, placeholder: "e.g. 15.5", type: FieldType.NUMBER, icon: Weight },
    { key: EntityKey.RATE_ID, label: ColumnLabel.RATE, placeholder: getSelectPlaceholder("Rate"), type: FieldType.TEXT, icon: Package },
    { key: EntityKey.CENTER_ID, label: ColumnLabel.CENTER, placeholder: getSelectPlaceholder("Center"), type: FieldType.TEXT, icon: Building },
    {
      key: EntityKey.PROFILE_ID,
      label: ColumnLabel.PROFILE,
      placeholder: getSelectPlaceholder("Profile"),
      type: FieldType.TEXT,
      inputMode: InputMode.NUMERIC,
      transformOnChange: (v) => {
        const digits = v.replace(/\D/g, "").slice(0, 12)
        const match = digits.match(/(\d{1,4})/g)
        return match ? match.join(" ") : digits
      },
      icon: User,
    },
    { key: EntityKey.CUSTOMER_ID, label: ColumnLabel.CUSTOMER, placeholder: getSelectPlaceholder("Customer"), type: FieldType.TEXT, icon: Users },
    { key: EntityKey.IS_ACTIVE, label: ColumnLabel.IS_ACTIVE, placeholder: "", type: FieldType.CHECKBOX, icon: Power },
  ],
  [ProjectSlug.FACTORIES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Factory C", type: FieldType.TEXT, icon: Factory },
    { key: EntityKey.VILLAGE_ID, label: ColumnLabel.VILLAGE, placeholder: getSelectPlaceholder("Village"), type: FieldType.TEXT, icon: Home },
  ],
  [ProjectSlug.ASSIGNMENTS]: [
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder("Factory"), type: FieldType.TEXT, icon: Factory },
    { key: EntityKey.PROFILE_ID, label: ColumnLabel.PROFILE, placeholder: getSelectPlaceholder("Profile"), type: FieldType.TEXT, icon: User },
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
    { key: EntityKey.USER_ID, label: ColumnLabel.USER, placeholder: getSelectPlaceholder("User"), type: FieldType.TEXT, icon: Hash },
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Amit Sharma", type: FieldType.TEXT, icon: User },
    { key: EntityKey.FACTORY_ID, label: ColumnLabel.FACTORY, placeholder: getSelectPlaceholder("Factory"), type: FieldType.TEXT, icon: Factory },
  ],
  [ProjectSlug.USERS]: [
    { key: EntityKey.EMAIL, label: ColumnLabel.EMAIL, placeholder: "e.g. user@example.com", type: FieldType.TEXT, icon: Mail },
    { key: EntityKey.ROLE, label: ColumnLabel.ROLE, placeholder: "Select role...", type: FieldType.ROLE, icon: ShieldCheck },
  ],
  [ProjectSlug.VILLAGES]: [
    { key: EntityKey.NAME, label: ColumnLabel.NAME, placeholder: "e.g. Ludhiana", type: FieldType.TEXT, icon: Home },
    { key: EntityKey.STATE, label: ColumnLabel.STATE, placeholder: "Select state...", type: FieldType.STATE, icon: Globe },
  ],
}
