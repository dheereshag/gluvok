import { State } from "@/lib/constants"

export const STATES_DATA = Object.entries(State).map(([code, name]) => ({
  label: name,
  value: name,
  code: code,
}))
