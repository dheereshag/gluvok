# Zod Schema Validations Specification

This document defines the TypeScript Zod validations for both creating (adding) and updating (editing) each database entity in the gluvok platform, matching the constraints defined in `schema.md`.

All enums used below are imported from `lib/constants.ts` to ensure consistency across the application.

---

## 1. Villages (`villages`)

### Add Validation Schema
```typescript
import { State } from "@/lib/constants";

const addVillageSchema = z.object({
  name: z
    .string()
    .min(3, "Village name must be at least 3 characters")
    .max(255, "Village name must be 255 characters or less"),
  state: z.nativeEnum(State, { required_error: "State plate code is required" }),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 2. Factories (`factories`)

### Add Validation Schema
```typescript
const addFactorySchema = z.object({
  name: z
    .string()
    .min(1, "Factory name is required")
    .max(255, "Factory name must be 255 characters or less"),
  village_id: z
    .number({ invalid_type_error: "Village ID must be an integer" })
    .int("Village ID must be an integer")
    .positive("Village ID must be a positive integer"),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 3. Centers (`centers`)

### Add Validation Schema
```typescript
const addCenterSchema = z.object({
  name: z
    .string()
    .min(3, "Center name must be at least 3 characters")
    .max(255, "Center name must be 255 characters or less"),
  factory_id: z
    .number({ invalid_type_error: "Factory ID must be an integer" })
    .int("Factory ID must be an integer")
    .positive("Factory ID must be a positive integer"),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 4. Commodities (`commodities`)

### Add Validation Schema
```typescript
import { CommodityName } from "@/lib/constants";

const addCommoditySchema = z.object({
  name: z.nativeEnum(CommodityName, { required_error: "Commodity type selection is required" }),
  unit_price: z
    .coerce
    .number({ invalid_type_error: "Unit price must be a number" })
    .positive("Unit price must be a positive number"),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 5. Customers (`customers`)

### Add Validation Schema
```typescript
const addCustomerSchema = z.object({
  name: z
    .string()
    .min(3, "Customer name must be at least 3 characters")
    .max(255, "Customer name must be 255 characters or less"),
  father_name: z
    .string()
    .min(3, "Father's name must be at least 3 characters")
    .max(255, "Father's name must be 255 characters or less"),
  village_id: z
    .number({ invalid_type_error: "Village ID must be an integer" })
    .int("Village ID must be an integer")
    .positive("Village ID must be a positive integer")
    .optional(),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 6. Operators (`operators`)

### Add Validation Schema
```typescript
const addOperatorSchema = z.object({
  id: z
    .string()
    .min(1, "System UUID identifier is required")
    .uuid("System ID must be a valid Supabase Auth UUID"),
  name: z
    .string()
    .min(3, "Operator full name must be at least 3 characters")
    .max(255, "Operator name must be 255 characters or less"),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 7. Users (`users`)

### Add Validation Schema
```typescript
import { Role } from "@/lib/constants";

const addUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please provide a valid email format"),
  role: z.nativeEnum(Role, { required_error: "Role selection is required" }),
});
```

### Edit Validation Schema
*Same as Add Schema.*

---

## 8. Data Entries (`data-entries`)

### Add Validation Schema
```typescript
const addDataEntrySchema = z.object({
  vehicle_number: z
    .string()
    .min(1, "Vehicle plate number is required")
    .max(10, "Vehicle plate must be 10 characters or less")
    .regex(
      /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
      "Must match standard Indian license plate format (e.g. PB10XY1234)"
    ),
  weight: z
    .coerce
    .number({ invalid_type_error: "Weight must be a number" })
    .positive("Measured weight must be a positive number"),
  commodity_id: z
    .number({ invalid_type_error: "Commodity ID must be an integer" })
    .int("Commodity ID must be an integer")
    .positive("Commodity ID must be a positive integer"),
  center_id: z
    .number({ invalid_type_error: "Center ID must be an integer" })
    .int("Center ID must be an integer")
    .positive("Center ID must be a positive integer"),
  operator_id: z
    .string()
    .length(12, "Operator Aadhar number must be exactly 12 characters"),
  customer_id: z
    .number({ invalid_type_error: "Customer ID must be an integer" })
    .int("Customer ID must be an integer")
    .positive("Customer ID must be a positive integer"),
});
```

### Edit Validation Schema
*Same as Add Schema.*
