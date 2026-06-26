-- rls_policies.sql
-- Note: Replace placeholders with exact column names if they differ slightly

-- ============================================================================
-- OPTIONAL: Run this block to drop ALL existing policies in the public schema
-- ============================================================================
/*
DO $$ 
DECLARE 
  r RECORD; 
BEGIN 
  FOR r IN (
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP 
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename); 
  END LOOP; 
END $$;
*/
-- ============================================================================

-- 1. Helper functions to avoid multiple joins in RLS policies

-- Get current user's role from profiles
CREATE OR REPLACE FUNCTION current_user_role() RETURNS text AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current user's factory_id from either profiles or customers
CREATE OR REPLACE FUNCTION current_user_factory_id() RETURNS int AS $$
  SELECT COALESCE(
    (SELECT factory_id FROM profiles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT factory_id FROM customers WHERE user_id = auth.uid() LIMIT 1)
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current customer's ID based on auth.uid()
CREATE OR REPLACE FUNCTION current_customer_id() RETURNS int AS $$
  SELECT id FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;


-- 2. Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_isolation_policy" ON profiles;
CREATE POLICY "profiles_isolation_policy" ON profiles
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR factory_id = current_user_factory_id()
);


-- 3. Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_isolation_policy" ON customers;
CREATE POLICY "customers_isolation_policy" ON customers
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR factory_id = current_user_factory_id()
);


-- 4. Factories
-- Super Admins can do anything
-- Others can only read/update their own factory
ALTER TABLE factories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "factories_isolation_policy" ON factories;
CREATE POLICY "factories_isolation_policy" ON factories
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR id = current_user_factory_id()
)
WITH CHECK (
  current_user_role() = 'SUPER_ADMIN'
  OR (id = current_user_factory_id() AND current_user_role() = 'ADMIN') -- Admin can edit
);


-- 5. Centers
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "centers_isolation_policy" ON centers;
CREATE POLICY "centers_isolation_policy" ON centers
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR factory_id = current_user_factory_id()
);


-- 6. Rates
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rates_isolation_policy" ON rates;
CREATE POLICY "rates_isolation_policy" ON rates
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR factory_id = current_user_factory_id()
);


-- 7. Weighments
-- Linked to a center. Center is linked to factory.
-- Also check customer_id if logged-in user is a customer (profile role is null)
ALTER TABLE weighments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weighments_isolation_policy" ON weighments;
CREATE POLICY "weighments_isolation_policy" ON weighments
FOR ALL TO authenticated
USING (
  current_user_role() = 'SUPER_ADMIN'
  OR (
    center_id IN (SELECT id FROM centers WHERE factory_id = current_user_factory_id())
    AND
    (
      -- If the user has a role in profiles (not a customer), they see all factory weighments
      current_user_role() IS NOT NULL
      OR
      -- If they are a customer, they only see their own weighments
      customer_id = current_customer_id()
    )
  )
);
