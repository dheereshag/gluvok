/**
 * @file components/combobox/states-data.ts
 * @description Static array mapping State enum properties into label-value configurations.
 */

import { State } from "@/lib/constants/enums"

/**
 * STATES_DATA list
 * Array of mapped state option objects (label, value, short code).
 */
export const STATES_DATA = Object.entries(State).map(([code, name]) => ({
  label: name,
  value: name,
  code: code,
}))
