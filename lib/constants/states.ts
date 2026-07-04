/**
 * @file lib/constants/states.ts
 * @description Static array mapping State enum properties into label-value configurations.
 */

import { State } from "./enums"

/**
 * STATES_DATA list
 * Array of mapped state option objects (label, value, short code).
 */
export const STATES_DATA = Object.entries(State).map(([code, name]) => ({
  label: name,
  value: name,
  code: code,
}))
