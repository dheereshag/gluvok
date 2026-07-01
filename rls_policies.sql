-- rls_policies.sql
-- Note: Replace placeholders with exact column names if they differ slightly

-- ============================================================================
-- OPTIONAL: Run this block to drop ALL existing policies in the public schema
-- ============================================================================
/*
DO $$ 
DECLARE 
  r RECORD; 
END; $$;
*/
-- ============================================================================

-- 0. Schema Updates
-- Add missing factory_id column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS factory_id int REFERENCES factories(id);

-- Add missing unit column to weighments table
ALTER TABLE weighments ADD COLUMN IF NOT EXISTS unit unit_enum NOT NULL DEFAULT 'kg';


-- 1. Helper functions to avoid multiple joins in RLS policies

-- Get current user's role from profiles
CREATE OR REPLACE FUNCTION current_user_role() RETURNS text AS $$
  SELECT role::text FROM profiles WHERE user_id = auth.uid() LIMIT 1;
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
  current_user_role() = 'super_admin'
  OR factory_id = current_user_factory_id()
);


-- 3. Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_isolation_policy" ON customers;
CREATE POLICY "customers_isolation_policy" ON customers
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
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
  current_user_role() = 'super_admin'
  OR id = current_user_factory_id()
)
WITH CHECK (
  current_user_role() = 'super_admin'
  OR (id = current_user_factory_id() AND current_user_role() = 'admin') -- Admin can edit
);


-- 5. Centers
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "centers_isolation_policy" ON centers;
CREATE POLICY "centers_isolation_policy" ON centers
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR factory_id = current_user_factory_id()
);


-- 6. Rates
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rates_isolation_policy" ON rates;
CREATE POLICY "rates_isolation_policy" ON rates
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
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
  current_user_role() = 'super_admin'
  OR current_user_role() = 'hardware'
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


-- 8. Villages
-- Read: Anyone who is authenticated and has a profile/customer record (factory_id is not null) or SUPER_ADMIN
-- Write: SUPER_ADMIN only
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "villages_select_policy" ON villages;
CREATE POLICY "villages_select_policy" ON villages
FOR SELECT TO authenticated
USING (
  current_user_factory_id() IS NOT NULL
  OR current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "villages_all_policy" ON villages;
CREATE POLICY "villages_all_policy" ON villages
FOR ALL TO authenticated
USING (current_user_role() = 'super_admin')
WITH CHECK (current_user_role() = 'super_admin');


-- 9. Commodities
-- Read: Anyone who is authenticated and has a profile/customer record or SUPER_ADMIN
-- Write: SUPER_ADMIN only
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "commodities_select_policy" ON commodities;
CREATE POLICY "commodities_select_policy" ON commodities
FOR SELECT TO authenticated
USING (
  current_user_factory_id() IS NOT NULL
  OR current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "commodities_all_policy" ON commodities;
CREATE POLICY "commodities_all_policy" ON commodities
FOR ALL TO authenticated
USING (current_user_role() = 'super_admin')
WITH CHECK (current_user_role() = 'super_admin');


-- ============================================================================
-- IMPORTANT FIX: Recreate the 'profiles_with_email' view WITHOUT security_invoker.
-- This allows it to run as Owner (Security Definer) so it has access to 'auth.users'.
-- To keep it secure and enforce tenant isolation, we add the WHERE clause filter.
-- ============================================================================
DROP VIEW IF EXISTS profiles_with_email;

CREATE OR REPLACE VIEW profiles_with_email AS
SELECT p.*, u.email
FROM profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE (
  current_user_role() = 'super_admin'
  OR p.factory_id = current_user_factory_id()
);
