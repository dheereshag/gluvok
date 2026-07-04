/**
 * @file lib/validation/helpers.ts
 * @description Zod schema and validation rules for Helpers entities.
 */

import * as z from "zod"

export const integerIdSchema = (fieldName: string) =>
  z.coerce
    .number({ message: `${fieldName} must be an integer` })
    .int(`${fieldName} must be an integer`)
    .positive(`${fieldName} must be a positive integer`)

export const uuidSchema = (fieldName: string) =>z.uuid(`${fieldName} must be a valid UUID`)

export const nameSchema = (fieldName: string, min = 3, max = 255) =>
  z.string()
    .min(min, `${fieldName} must be at least ${min} characters`)
    .max(max, `${fieldName} must be ${max} characters or less`)

export const requiredStringSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`)
