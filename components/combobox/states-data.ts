import { State } from "@/lib/constants/enums"

export const STATES_DATA = Object.entries(State).map(([code, name]) => ({
  label: name,
  value: name,
  code: code,
}))
