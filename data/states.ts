import { State } from "@/lib/constants";

export const STATES = Object.entries(State).map(([code, name]) => ({
  value: name as State,
  label: name,
  code: code,
}))

