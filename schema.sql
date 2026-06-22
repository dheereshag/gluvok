-- ==========================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA (DDL)
-- ==========================================


-- State codes as ENUM matching Indian state/UT abbreviations
CREATE TYPE state_enum AS ENUM (
  'AN','AP','AR','AS','BR','CH','CG','DD','DL','DN','GA','GJ','HR','HP',
  'JK','JH','KA','KL','LA','LD','MP','MH','MN','ML','MZ','NL','OD','PY',
  'PB','RJ','SK','TN','TS','TR','UP','UK','WB'
);

-- User roles within the application
CREATE TYPE role_enum AS ENUM (
  'super_admin',
  'admin',
  'manager',
  'operator',
  'base'
);

-- Commodity rates pricing units
CREATE TYPE unit_enum AS ENUM (
  'kg',
  'q',
  'gal'
);

-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- -----------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABLES DEFINITIONS
-- -----------------------------------------

-- A. villages table
CREATE TABLE public.villages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state state_enum NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_villages
  BEFORE UPDATE ON public.villages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- B. factories table
CREATE TABLE public.factories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  village_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_factory_village
    FOREIGN KEY (village_id)
    REFERENCES public.villages(id)
    ON DELETE RESTRICT
);

CREATE TRIGGER set_timestamp_factories
  BEFORE UPDATE ON public.factories
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- C. centers table
CREATE TABLE public.centers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  factory_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_center_factory
    FOREIGN KEY (factory_id)
    REFERENCES public.factories(id)
    ON DELETE RESTRICT
);

CREATE TRIGGER set_timestamp_centers
  BEFORE UPDATE ON public.centers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- D. commodities table
CREATE TABLE public.commodities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_commodities
  BEFORE UPDATE ON public.commodities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- H. rates table
CREATE TABLE public.rates (
  id SERIAL PRIMARY KEY,
  commodity_id INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  unit unit_enum NOT NULL,
  factory_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_rate_commodity
    FOREIGN KEY (commodity_id)
    REFERENCES public.commodities(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
    
  CONSTRAINT fk_rate_factory
    FOREIGN KEY (factory_id)
    REFERENCES public.factories(id)
    ON DELETE RESTRICT
);

CREATE TRIGGER set_timestamp_rates
  BEFORE UPDATE ON public.rates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- E. customers table
CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  govt_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255) NOT NULL,
  village_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_customer_village
    FOREIGN KEY (village_id)
    REFERENCES public.villages(id)
    ON DELETE RESTRICT
);

CREATE TRIGGER set_timestamp_customers
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- F. profiles table
-- Note: References Supabase Auth.users(id) table in the 'auth' schema.
CREATE TABLE public.profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  aadhar_number CHAR(12) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_profile_auth_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT check_aadhar_format
    CHECK (aadhar_number ~ '^\d{12}$')
);

CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- G. weighments table
CREATE TABLE public.weighments (
  id BIGSERIAL PRIMARY KEY,
  vehicle_number VARCHAR(10) NOT NULL,
  weight DECIMAL(12, 3) NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  rate_id INTEGER NOT NULL,
  center_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_weighment_rate
    FOREIGN KEY (rate_id)
    REFERENCES public.rates(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_weighment_center
    FOREIGN KEY (center_id)
    REFERENCES public.centers(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_weighment_profile
    FOREIGN KEY (profile_id)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_weighment_customer
    FOREIGN KEY (customer_id)
    REFERENCES public.customers(id)
    ON DELETE RESTRICT
);

-- Index for heavy weighments query performance on vehicle lookup
CREATE INDEX idx_weighments_vehicle_number ON public.weighments (vehicle_number);

CREATE TRIGGER set_timestamp_weighments
  BEFORE UPDATE ON public.weighments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- I. assignments table
CREATE TABLE public.assignments (
  id SERIAL PRIMARY KEY,
  factory_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_assignment_factory
    FOREIGN KEY (factory_id)
    REFERENCES public.factories(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_assignment_profile
    FOREIGN KEY (profile_id)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT,
    
  -- Unique constraint to avoid duplicate assignments
  CONSTRAINT uq_factory_profile_assignment
    UNIQUE (factory_id, profile_id)
);

CREATE TRIGGER set_timestamp_assignments
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();


-- J. affiliations table
CREATE TABLE public.affiliations (
  id SERIAL PRIMARY KEY,
  factory_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_affiliation_factory
    FOREIGN KEY (factory_id)
    REFERENCES public.factories(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_affiliation_customer
    FOREIGN KEY (customer_id)
    REFERENCES public.customers(id)
    ON DELETE RESTRICT,
    
  -- Unique constraint to avoid duplicate affiliations
  CONSTRAINT uq_factory_customer_affiliation
    UNIQUE (factory_id, customer_id)
);

CREATE TRIGGER set_timestamp_affiliations
  BEFORE UPDATE ON public.affiliations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();
