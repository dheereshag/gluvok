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
  'base',
  'hardware'
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
  user_id UUID UNIQUE,
  factory_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_customer_auth_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE SET NULL,
    
  CONSTRAINT fk_customer_village
    FOREIGN KEY (village_id)
    REFERENCES public.villages(id)
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_customer_factory
    FOREIGN KEY (factory_id)
    REFERENCES public.factories(id)
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
  role role_enum NOT NULL DEFAULT 'base',
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
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
  unit unit_enum NOT NULL DEFAULT 'kg',
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

-- Enforce that only super_admin or admin can edit weight or unit
CREATE OR REPLACE FUNCTION public.check_weighments_update_columns()
RETURNS trigger AS $$
BEGIN
  IF (public.get_user_role() NOT IN ('super_admin', 'admin')) THEN
    IF (NEW.weight IS DISTINCT FROM OLD.weight OR NEW.unit IS DISTINCT FROM OLD.unit) THEN
      RAISE EXCEPTION 'Only super_admin or admin can modify weight or unit.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_weighments_update_columns
  BEFORE UPDATE ON public.weighments
  FOR EACH ROW
  EXECUTE FUNCTION public.check_weighments_update_columns();



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



-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- ---------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user role from public.profiles table
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role::text INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'base');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- A. villages policies
CREATE POLICY "villages_select" ON public.villages
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "villages_insert" ON public.villages
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY "villages_update" ON public.villages
  FOR UPDATE TO authenticated USING (public.get_user_role() = 'super_admin');
CREATE POLICY "villages_delete" ON public.villages
  FOR DELETE TO authenticated USING (public.get_user_role() = 'super_admin');

-- B. factories policies
CREATE POLICY "factories_select" ON public.factories
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "factories_insert" ON public.factories
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "factories_update" ON public.factories
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "factories_delete" ON public.factories
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- C. centers policies
CREATE POLICY "centers_select" ON public.centers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "centers_insert" ON public.centers
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "centers_update" ON public.centers
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "centers_delete" ON public.centers
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- D. commodities policies
CREATE POLICY "commodities_select" ON public.commodities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "commodities_insert" ON public.commodities
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY "commodities_update" ON public.commodities
  FOR UPDATE TO authenticated USING (public.get_user_role() = 'super_admin');
CREATE POLICY "commodities_delete" ON public.commodities
  FOR DELETE TO authenticated USING (public.get_user_role() = 'super_admin');

-- H. rates policies
CREATE POLICY "rates_select" ON public.rates
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "rates_insert" ON public.rates
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'manager'));
CREATE POLICY "rates_update" ON public.rates
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin', 'manager'));
CREATE POLICY "rates_delete" ON public.rates
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- E. customers policies
CREATE POLICY "customers_select" ON public.customers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "customers_insert" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'manager', 'operator'));
CREATE POLICY "customers_update" ON public.customers
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin', 'manager', 'operator'));
CREATE POLICY "customers_delete" ON public.customers
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- F. profiles policies
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'manager'));
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin', 'manager'));
CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- G. weighments policies
CREATE POLICY "weighments_select" ON public.weighments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "weighments_insert" ON public.weighments
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'manager', 'operator', 'hardware'));
CREATE POLICY "weighments_update" ON public.weighments
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin', 'manager', 'operator'));
CREATE POLICY "weighments_delete" ON public.weighments
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

-- I. assignments policies
CREATE POLICY "assignments_select" ON public.assignments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments_insert" ON public.assignments
  FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "assignments_update" ON public.assignments
  FOR UPDATE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "assignments_delete" ON public.assignments
  FOR DELETE TO authenticated USING (public.get_user_role() IN ('super_admin', 'admin'));

