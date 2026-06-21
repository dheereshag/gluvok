### Entity A: villages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `SERIAL` | Primary Key | Unique identifier for each village. |
| `name` | `VARCHAR(255)` | Not Null | Display name (e.g., "Ludhiana", "Jaipur"). |
| `state` | `ENUM('AN','AP','AR','AS','BR','CH','CG','DD','DL','DN','GA','GJ','HR','HP','JK','JH','KA','KL','LA','LD','MP','MH','MN','ML','MZ','NL','OD','PY','PB','RJ','SK','TN','TS','TR','UP','UK','WB')` | Not Null | Indian state/UT code as used on vehicle number plates. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last structural update time. |

---

### Entity B: factories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `SERIAL` | Primary Key | Unique depot ID. |
| `name` | `VARCHAR(255)` | Not Null | Display label (e.g., "Silo Terminal C"). |
| `village_id` | `INTEGER` | FK → `villages.id`, Not Null | Restricts factory to a registered village. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last structural update time. |

---

### Entity C: centers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `SERIAL` | Primary Key | Unique identifier. |
| `name` | `VARCHAR(255)` | Not Null | Display name. |
| `factory_id` | `INTEGER` | FK → `factories.id`, Not Null | Associated factory. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last structural update time. |

---

### Entity D: commodities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `name` | `VARCHAR(255)` | Primary Key | Display name and unique identifier of the commodity (e.g., "Wheat", "Corn"). |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last update time. |

---

### Entity H: rates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `SERIAL` | Primary Key | Unique price record identifier. |
| `commodity_name` | `VARCHAR(255)` | FK → `commodities.name`, Not Null, On Delete Cascade, On Update Cascade | Associated commodity name. |
| `unit_price` | `DECIMAL(12,2)` | Not Null | Price per metric ton. |
| `factory_id` | `INTEGER` | FK → `factories.id`, Not Null | Associated factory. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last update time. |

---

### Entity E: customers
Represents workers/customers identified by government ID. No auth login required.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `govt_id` | `INTEGER` | Primary Key | Government-issued ID, unique per customer. |
| `name` | `VARCHAR(255)` | Not Null | Full name of the customer. |
| `father_name` | `VARCHAR(255)` | Nullable | Father's full name (additional identifier). |
| `village_id` | `INTEGER` | FK → `villages.id`, Nullable | Registered home village. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last update time. |

---

### Entity F: profiles
Details of human resources/users linked to login accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `aadhar_number` | `CHAR(12)` | Primary Key, CHECK (`aadhar_number ~ '^\d{12}$'`) | Aadhar number — unique profile identifier. |
| `id` | `UUID` | Unique, Not Null, FK → `auth.users(id)`, On Delete Cascade | References Supabase Auth user. |
| `name` | `VARCHAR(255)` | Not Null | Full name of the profile owner. |
| `factory_id` | `INTEGER` | FK → `factories.id`, Nullable | Associated home factory. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last update time. |

---

### Entity G: weighments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGSERIAL` | Primary Key | Scaled key for millions of transactions. |
| `vehicle_number` | `VARCHAR(10)` | Indexed, Non-Unique | Plate or tag of the transport unit. |
| `weight` | `DECIMAL` | Not Null | Precise measured weight. |
| `images` | `JSONB` | Nullable | Array of object-storage paths. |
| `rate_id` | `INTEGER` | FK → `rates.id`, Not Null | Link to the specific commodity price rate. |
| `center_id` | `INTEGER` | FK → `centers.id`, Not Null | Physical location where weighing occurred. |
| `profile_id` | `CHAR(12)` | FK → `profiles.aadhar_number`, Not Null | Profile who managed the scale/vehicle. |
| `customer_id` | `INTEGER` | FK → `customers.govt_id`, Not Null | Customer who was there. |
| `is_active` | `BOOLEAN` | Not Null, Default: `TRUE` | Transaction status toggle. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Immutable transaction timestamp. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last update time. |

---

### Entity I: assignments
Represents factory assignments that map factories to profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `SERIAL` | Primary Key | Unique assignment ID. |
| `factory_id` | `INTEGER` | FK → `factories.id`, Not Null | Associated factory. |
| `profile_id` | `CHAR(12)` | FK → `profiles.aadhar_number`, Not Null | Associated operator/admin profile. |
| `created_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not Null, Default: `CURRENT_TIMESTAMP` | Last structural update time. |